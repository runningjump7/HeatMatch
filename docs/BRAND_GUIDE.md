# HeatMatch Brand Guide

## Overview
HeatMatch is a trusted heat pump installer marketplace for Auckland's North Shore. Our brand prioritizes clarity, trust, and ease of use.

---

## Color Palette

### Primary Colors
**Blue** — Trust, action, reliability
- Primary Blue: `#2563eb` (blue-600)
- Dark Blue: `#1e40af` (blue-700)
- Light Blue: `#eff6ff` (blue-50)
- Blue Border: `#3b82f6` (blue-500)

**Usage:** CTAs, links, progress bars, success states, key UI elements

### Secondary Colors
**Gray** — Neutral, readable, balance
- Dark Gray (text): `#111827` (gray-900) — Primary text color
- Medium Gray (text): `#4b5563` (gray-600) — Secondary text
- Light Gray (bg): `#f9fafb` (gray-50) — Background fills
- Gray Border: `#d1d5db` (gray-300) — Borders, dividers

**Usage:** Body text, backgrounds, borders, inactive states

### Accent Colors

**Red** — Errors, alerts, warnings
- Red: `#dc2626` (red-600)
- Dark Red: `#991b1b` (red-800)
- Light Red: `#fee2e2` (red-50)

**Usage:** Error messages, validation failures, destructive actions

**Green** — Success, confirmation, completion
- Green: `#16a34a` (green-600)
- Dark Green: `#1f2937` (green-800)
- Light Green: `#f0fdf4` (green-50)

**Usage:** Success messages, completed states, positive feedback

**Slate** — Gradients, dark backgrounds
- Slate: `#0f172a` (slate-900)
- Light Slate: `#f8fafc` (slate-50)

**Usage:** Gradient overlays, dark mode support, secondary accents

---

## Color Usage Guide

| Element | Color | Tailwind Class |
|---------|-------|---|
| **Primary CTA Button** | Blue-600 | `bg-blue-600 hover:bg-blue-700` |
| **Secondary Button** | Gray-200 | `bg-gray-200 hover:bg-gray-300` |
| **Body Text** | Gray-900 | `text-gray-900` |
| **Secondary Text** | Gray-600 | `text-gray-600` |
| **Borders** | Gray-300 | `border-gray-300` |
| **Error Message** | Red-600 | `text-red-600 bg-red-50` |
| **Success Message** | Green-600 | `text-green-600 bg-green-50` |
| **Page Background** | White | `bg-white` |
| **Card Background** | Gray-50 | `bg-gray-50` |
| **Info Box Background** | Blue-50 | `bg-blue-50 border-blue-200` |

---

## Typography

### Font Family
**Body & UI:** Arial, Helvetica, sans-serif
**Mono (Code):** Geist Mono (from Next.js)

### Font Sizes & Weights
- **H1 (Hero):** 2.5rem, bold
- **H2 (Sections):** 2rem, bold
- **H3 (Subsections):** 1.5rem, bold
- **Body:** 1rem (16px), regular
- **Small:** 0.875rem (14px), regular
- **XSmall:** 0.75rem (12px), regular

### Line Height
- Headings: 1.2
- Body: 1.6

---

## UI Components

### Buttons

**Primary Button**
```css
bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition
```

**Secondary Button**
```css
bg-gray-200 hover:bg-gray-300 text-gray-900 px-6 py-3 rounded-lg font-semibold transition
```

**Danger Button**
```css
bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-semibold transition
```

### Modals
- **Background overlay:** Dark with 50% opacity
- **Modal background:** White
- **Modal border:** None
- **Rounded corners:** 0.5rem (8px)
- **Shadow:** Standard drop shadow

### Forms
- **Input background:** White
- **Input border:** Gray-300
- **Input focus border:** Blue-500
- **Label text:** Gray-900
- **Help text:** Gray-600
- **Error text:** Red-600

### Cards
- **Background:** Gray-50
- **Border:** Gray-200
- **Rounded corners:** 0.5rem (8px)

---

## Spacing

Use Tailwind default spacing scale (4px base unit):
- `p-2` = 8px padding
- `p-4` = 16px padding
- `p-6` = 24px padding
- `gap-4` = 16px gap between items

---

## Shadows & Elevation

### Standard Shadow
```css
shadow (box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05))
```

### Medium Shadow
```css
shadow-md (stronger emphasis)
```

---

## Dark Mode (Future)

When dark mode is implemented:
- **Background:** `#0a0a0a` (from globals.css)
- **Foreground:** `#ededed`
- **Primary Blue:** Lighten by 1-2 shades
- **Gray text:** Invert to light grays

---

## Logo & Brand Mark

*(To be added: logo files, lockup variations, minimum clear space)*

---

## Accessibility

- **Contrast Ratio (WCAG AA):** All text ≥ 4.5:1 on backgrounds
- **Link Colors:** Blue-600 (underlined when in body copy)
- **Focus States:** Blue border + outline for keyboard navigation
- **Color Alone:** Never use color alone to convey information (always pair with icons, text, or patterns)

---

## Last Updated
September 2026

## Maintainer
Alex Vaz (alex@alexvaz.org)
