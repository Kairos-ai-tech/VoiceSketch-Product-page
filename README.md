# VoiceSketch Product Page

<p align="center">
  <img src="assets/logo.png" alt="VoiceSketch Logo" width="120">
</p>

<p align="center">
  <strong>Transform Voice into Visual Learning</strong>
</p>

<p align="center">
  <a href="https://voicesketch.kairosaitech.com">Live Site</a> •
  <a href="https://www.kairosaitech.com">Kairos.ai</a>
</p>

A modern, animated promotional landing page for VoiceSketch - the iOS app that transforms voice into visual learning materials.

## Features

- **Multi-language Support** - 8 languages: English, Traditional Chinese, Simplified Chinese, Japanese, Korean, French, Spanish, Italian
- **Auto Language Detection** - Detects browser language on first visit
- **Responsive Design** - Optimized for desktop, tablet, and mobile
- **Smooth Animations** - Scroll-triggered animations, hover effects, and micro-interactions
- **Mobile-First UX** - Sticky CTA button on mobile, responsive navigation

## Preview

Open `index.html` in a browser to preview locally.

## Deploy to GitHub Pages

1. Push this repository to GitHub
2. Go to **Settings** > **Pages**
3. Under "Source", select **Deploy from a branch**
4. Select `main` branch and `/ (root)` folder
5. Click **Save**

Your page will be available at `https://voicesketch.kairosaitech.com/`

## Project Structure

```
├── index.html      # Main landing page (fully self-contained)
├── sitemap.xml     # SEO sitemap
├── robots.txt      # Search engine directives
├── assets/
│   └── logo.png    # VoiceSketch app logo
├── CLAUDE.md       # Development guide
└── README.md
```

## Page Sections

1. **Navigation** - Fixed nav with smooth scroll links
2. **Hero** - Animated logo with sound wave effects, CTA button
3. **Demo** - Interactive phone mockup showing app in action
4. **Features** - 6 feature cards with animated icons
5. **How It Works** - 3-step timeline with animated illustrations
6. **Use Cases** - Target audience cards (Students, Professionals, etc.)
7. **Stats** - Key numbers with gradient styling
8. **Testimonials** - User reviews with ratings
9. **CTA** - Final call-to-action section
10. **Footer** - Contact info & Kairos.ai branding

## Supported Languages

| Code | Language |
|------|----------|
| en | English |
| zh-TW | Traditional Chinese (繁體中文) |
| zh-CN | Simplified Chinese (简体中文) |
| ja | Japanese (日本語) |
| ko | Korean (한국어) |
| fr | French (Français) |
| es | Spanish (Español) |
| it | Italian (Italiano) |

## Customization

- **App Store Link**: Update `href="#"` in CTA buttons
- **Colors**: Modify CSS variables in `:root`
- **Logo**: Replace `assets/logo.png`
- **Translations**: Edit the `translations` object in the `<script>` section

## Technologies

- Pure HTML/CSS/JavaScript (no dependencies)
- CSS Animations & Transitions
- Intersection Observer API for scroll animations
- LocalStorage for language preference
- Google Fonts (Inter)

## License

MIT
