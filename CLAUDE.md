# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Static promotional landing page for VoiceSketch iOS app. No build system or dependencies - pure HTML/CSS/JavaScript in a single `index.html` file.

## Development Commands

```bash
# Start local server (Python 3)
python3 -m http.server 8000

# Then open http://localhost:8000
```

## Architecture

**Single-file architecture**: All CSS and JavaScript are embedded in `index.html`.

### Key Sections in index.html

1. **CSS Variables** (`:root`) - Color scheme using `--gradient-start`, `--gradient-mid`, `--gradient-end`, `--primary-red`
2. **Translations Object** - `translations` object in `<script>` contains all 8 language versions (en, zh-TW, zh-CN, ja, ko, fr, es, it)
3. **Components**: Navigation, Hero, Demo (phone mockup with floating elements), Features, How It Works (animated demos), Use Cases, Stats, Testimonials (carousel), CTA, Footer

### Localization System

- All translatable text uses `data-i18n` attributes
- `setLanguage(lang)` function applies translations
- Language preference stored in localStorage
- Auto-detects browser language on first visit

### Animation Systems

- **Scroll animations**: Intersection Observer adds `.visible` class to elements
- **Floating elements**: CSS keyframes with varied durations for organic movement
- **Testimonials carousel**: JavaScript-controlled with auto-rotation (4s interval)
- **Demo section**: Various CSS animations (typing cursor, pulsing record button, orbiting rings)

## Customization Points

- **App Store URL**: Search for `href="#"` in CTA buttons
- **Testimonials**: Add entries to carousel HTML and `translations` object (reviews 1-6)
- **Floating labels**: Add new `.float-item` elements and corresponding translations under `demo.*` keys
