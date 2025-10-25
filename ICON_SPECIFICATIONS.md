# MoPay Agent Icon Specifications

## 🎨 Design Guidelines
**Brand Colors:**
- Primary: #007bff (MoPay Blue)
- Secondary: #28a745 (Success Green)
- Accent: #ffc107 (Warning Yellow)
- Background: #ffffff (White)

**Typography:** Modern, clean sans-serif font (similar to Inter or Roboto)

## 📱 Icon Specifications

### 1. Main App Icon (`icon.png`)
- **Size:** 1024x1024px
- **Format:** PNG with transparency
- **Background:** Transparent
- **Design:** MoPay logo with "MA" initials in circular badge

### 2. Adaptive Icon (`adaptive-icon.png`)
- **Size:** 1024x1024px
- **Format:** PNG with transparency
- **Background:** Transparent (Android will add adaptive background)
- **Safe Zone:** Icon should fit within 66% center (safe zone)
- **Design:** Simplified MoPay logo for various backgrounds

### 3. Splash Icon (`splash-icon.png`)
- **Size:** 512x512px minimum (can be larger)
- **Format:** PNG with transparency
- **Background:** Transparent
- **Design:** Clean MoPay logo for splash screen

### 4. Favicon (`favicon.png`)
- **Size:** 64x64px (primary), include multiples: 16x16, 32x32, 64x64
- **Format:** PNG with transparency
- **Background:** Transparent
- **Design:** Simplified MoPay icon for web browser tabs

## 🎯 Icon Design Elements

### Primary Icon Design:
```
┌─────────────────┐
│                 │
│    ████████     │
│   ██      ██    │
│  ██  MP    ██   │
│  ██        ██   │
│   ██      ██    │
│    ████████     │
│                 │
│     AGENT       │
└─────────────────┘
```

### Simplified Version (for adaptive/small sizes):
```
┌─────────────────┐
│                 │
│    ████████     │
│   ██      ██    │
│  ██   M    ██   │
│  ██    P   ██   │
│   ██      ██    │
│    ████████     │
└─────────────────┘
```

## 🛠️ Creation Tools
- **Figma** - Design icons with proper specifications
- **Adobe Illustrator** - Vector-based icon creation
- **Inkscape** - Free vector graphics editor
- **Canva** - Quick icon creation with templates

## 📋 Checklist
- [ ] Main icon (1024x1024) with transparent background
- [ ] Adaptive icon (1024x1024) optimized for Android
- [ ] Splash icon (512x512+) for loading screen
- [ ] Favicon (64x64) for web browsers
- [ ] Test icons on different backgrounds
- [ ] Verify proper scaling and readability

## 🚀 Implementation
Icons are already configured in `app.json`:
- iOS: Uses `icon.png`
- Android: Uses `adaptive-icon.png` for adaptive icons
- Web: Uses `favicon.png`
- Splash: Uses `splash-icon.png`