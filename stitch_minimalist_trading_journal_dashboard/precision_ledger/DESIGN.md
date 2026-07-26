---
name: Precision Ledger
colors:
  surface: '#0b1326'
  surface-dim: '#0b1326'
  surface-bright: '#31394d'
  surface-container-lowest: '#060e20'
  surface-container-low: '#131b2e'
  surface-container: '#171f33'
  surface-container-high: '#222a3d'
  surface-container-highest: '#2d3449'
  on-surface: '#dae2fd'
  on-surface-variant: '#bccbb9'
  inverse-surface: '#dae2fd'
  inverse-on-surface: '#283044'
  outline: '#869585'
  outline-variant: '#3d4a3d'
  surface-tint: '#4ae176'
  primary: '#4be277'
  on-primary: '#003915'
  primary-container: '#22c55e'
  on-primary-container: '#004b1e'
  inverse-primary: '#006e2f'
  secondary: '#ffb3ad'
  on-secondary: '#68000a'
  secondary-container: '#a40217'
  on-secondary-container: '#ffaea8'
  tertiary: '#afc7ff'
  on-tertiary: '#002e6a'
  tertiary-container: '#82abff'
  on-tertiary-container: '#003d88'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#6bff8f'
  primary-fixed-dim: '#4ae176'
  on-primary-fixed: '#002109'
  on-primary-fixed-variant: '#005321'
  secondary-fixed: '#ffdad7'
  secondary-fixed-dim: '#ffb3ad'
  on-secondary-fixed: '#410004'
  on-secondary-fixed-variant: '#930013'
  tertiary-fixed: '#d8e2ff'
  tertiary-fixed-dim: '#adc6ff'
  on-tertiary-fixed: '#001a42'
  on-tertiary-fixed-variant: '#004395'
  background: '#0b1326'
  on-background: '#dae2fd'
  surface-variant: '#2d3449'
typography:
  display:
    fontFamily: Inter
    fontSize: 48px
    fontWeight: '700'
    lineHeight: 56px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Inter
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
    letterSpacing: -0.01em
  headline-md:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-sm:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  mono-label:
    fontFamily: JetBrains Mono
    fontSize: 13px
    fontWeight: '500'
    lineHeight: 16px
  mono-data:
    fontFamily: JetBrains Mono
    fontSize: 15px
    fontWeight: '600'
    lineHeight: 20px
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  unit: 4px
  container-padding: 24px
  gutter: 16px
  stack-sm: 8px
  stack-md: 16px
  stack-lg: 32px
---

## Brand & Style

The design system is engineered for analytical rigor and high-frequency data consumption within a small, focused trading community. The brand personality is utilitarian, objective, and disciplined, mirroring the mindset of a successful trader. 

The aesthetic is a hybrid of **Minimalism** and **Modern Corporate**, prioritizing information density without visual clutter. By stripping away decorative elements and relying on a strict grid, the UI transforms from a "product" into a professional tool. The emotional response is one of clarity and control; the interface recedes to let the performance data speak for itself.

## Colors

The palette is anchored in a deep, "ink" dark mode to reduce eye strain during long sessions. 

- **Backgrounds:** Use `#0f172a` (Slate 950) for the primary canvas and `#1e293b` (Slate 800) for nested containers.
- **Functional Accents:** Green (`#22c55e`) and Red (`#ef4444`) are reserved exclusively for P&L indicators (Profit and Loss). No other UI elements should use these colors to prevent "false alarms."
- **Primary Action:** Use a neutral White or high-contrast Slate for standard actions.
- **Information:** A muted Blue (`#3b82f6`) is used for neutral state changes or secondary data points like "Break Even."

## Typography

This design system utilizes **Inter** for its exceptional readability in dense layouts and high X-height. For numerical data, price points, and timestamps, **JetBrains Mono** is introduced to ensure tabular figures align perfectly, allowing traders to scan columns of numbers with precision.

- **Headlines:** Use tight letter spacing and bold weights to create a strong hierarchy.
- **Data Points:** Always use the `mono-data` role for P&L values, ticket numbers, and asset prices.
- **Labels:** Small caps or slightly tracked-out mono fonts should be used for table headers and metadata descriptors.

## Layout & Spacing

The layout follows a **Fluid Grid** model with strict 4px increments (the 4-point grid). 

- **Desktop:** 12-column grid with 16px gutters. Sidebars are fixed at 240px to maximize the data table area.
- **Metric Cards:** Should be arranged in a responsive flex-row, wrapping as the viewport narrows.
- **Density:** Information density is "High." Vertical padding in table rows should be minimized (8px - 12px) to allow more data visibility above the fold.
- **Mobile:** Transition to a single-column stack. Charts should maintain a 16:9 aspect ratio or be scrollable horizontally if detail is required.

## Elevation & Depth

In alignment with a flat, minimalist aesthetic, this design system avoids traditional shadows. Depth is achieved through **Tonal Layering** and **Subtle Borders**.

- **Level 0 (Base):** `#0f172a` - The main application background.
- **Level 1 (Cards/Containers):** `#1e293b` - Surface color for cards and secondary sidebars.
- **Borders:** Use a 1px solid border of `#334155` (Slate 700) to define boundaries. 
- **Interaction:** On hover, surfaces may lift slightly by changing the border color to `#475569` (Slate 600), rather than adding a shadow.

## Shapes

The shape language is "Soft" yet disciplined. While sharp corners feel too aggressive, overly rounded "pill" shapes are avoided to maintain a professional, tool-like feel.

- **Standard Elements:** Inputs, buttons, and small cards use a 4px (0.25rem) radius.
- **Large Containers:** Dashboard widgets or main content areas use an 8px (0.5rem) radius.
- **Charts:** Line charts should use straight segments or very subtle curves; avoid heavy interpolation to keep the data honest.

## Components

### Buttons
- **Primary:** Solid White or Slate 100 with Slate 950 text. No gradients.
- **Ghost:** Transparent background with a 1px Slate 700 border. Use for secondary actions like "Export" or "Filter."

### Metric Cards
- Large, bold numerical values using JetBrains Mono. 
- A "trend" indicator (small sparkline or percentage) in the corner using the functional Green/Red.

### Data Tables
- Header row: Slate 800 background, muted uppercase text.
- Row zebra-striping is discouraged; use subtle 1px bottom borders instead.
- P&L columns must be right-aligned for numerical comparison.

### Heatmap Calendar
- A grid of squares representing days. 
- Opacity of Green/Red indicates the magnitude of profit or loss for that specific day. 
- Empty days are Slate 800.

### Input Fields
- Dark background (`#0f172a`), 1px Slate 700 border. 
- On focus, the border changes to Slate 400. No glow effects.

### Charts
- **Line Charts:** 2px stroke width. Use a subtle gradient fill below the line only if it aids in distinguishing multiple datasets.
- **Tooltips:** Slate 900 background, white text, no arrow, 4px border radius.