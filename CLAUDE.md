# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Static promotional landing page for VoiceSketch iOS app, hosted on GitHub Pages at `voicesketch.kairosaitech.com`. No build system or dependencies - pure HTML/CSS/JavaScript in a single `index.html` file (~5000+ lines).

## Development Commands

```bash
# Start local server (Python 3)
python3 -m http.server 8000

# Then open http://localhost:8000
```

## Architecture

**Single-file architecture**: All CSS and JavaScript are embedded in `index.html`. The file is large (~377KB) — use targeted line-range reads rather than reading the whole file.

### Rough Layout of index.html

1. **`<head>`** — SEO meta tags, hreflang tags, Open Graph, dynamic canonical URL logic
2. **`<style>`** — All CSS including `:root` variables (`--gradient-start`, `--gradient-mid`, `--gradient-end`, `--primary-red`), responsive breakpoints, animations
3. **`<body>` HTML** — Navigation, Hero, Demo, Features, How It Works, Use Cases, Stats, Testimonials carousel, CTA, Terms of Service section (`#terms`), Privacy Policy section (`#privacy`), Footer
4. **`<script>`** — `translations` object (8 languages), App Store routing, language detection, carousel, scroll animations

### Localization System

- All translatable text uses `data-i18n` attributes with dot-notation keys (e.g., `hero.cta`, `demo.label1`)
- `translations` object contains all 8 language versions: en, zh-TW, zh-CN, ja, ko, fr, es, it
- `setLanguage(lang)` applies translations, updates App Store links, canonical URL, and URL bar
- Language priority: `?lang=` URL param > localStorage > browser language > English default
- Language variants use `?lang=xx` query params (English has no param)

### App Store Link Routing

Links with class `app-store-link` are dynamically updated. Two-tier country detection:
1. **Language-based** (immediate): `langToAppStoreCountry` map sets country code from selected language
2. **IP-based** (async override): `ipapi.co/country/` API detects actual country, overrides language-based routing

Constants: `APP_STORE_BASE` and `APP_STORE_APP_PATH` define the URL template.

### SEO Infrastructure

- Canonical URLs and hreflang tags are dynamically updated in both `<head>` (static for crawlers) and via JS
- `/privacy/index.html` and `/terms/index.html` are redirect stubs that send users to `/?scrollTo=privacy` and `/?scrollTo=terms` respectively
- `sitemap.xml` lists all language variants
- `app-ads.txt` for Google AdMob authorization

### Animation Systems

- **Scroll animations**: Intersection Observer adds `.visible` class to `.feature-card`, `.timeline-item`, `.animate-on-scroll` elements
- **Floating elements**: CSS keyframes with varied durations for organic movement in demo section
- **Testimonials carousel**: 6 slides, auto-rotation (4s), touch/swipe support, progress bar
- **Demo section**: Typing cursor, pulsing record button, orbiting rings (CSS animations)

## Key Modification Patterns

- **App Store URL**: Update `APP_STORE_APP_PATH` and `APP_STORE_BASE` constants, plus the hardcoded `href` on `app-store-link` elements (fallback for no-JS)
- **Adding a language**: Add to `translations` object, `langToAppStoreCountry`, `langNames`, `hreflangMap`, hreflang `<link>` tags, OG locale alternates, `sitemap.xml`, and lang dropdown HTML
- **Terms/Privacy content**: Inline HTML sections with ids `#terms` and `#privacy` — content is duplicated per language inside the translations object
- **Testimonials**: Add entries to carousel HTML and translations (keys: `reviews.1` through `reviews.6`)
