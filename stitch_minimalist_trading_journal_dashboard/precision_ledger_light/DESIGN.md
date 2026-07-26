---
name: Precision Ledger Light
colors:
  surface: '#f7f9fb'
  surface-dim: '#d8dadc'
  surface-bright: '#f7f9fb'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f2f4f6'
  surface-container: '#eceef0'
  surface-container-high: '#e6e8ea'
  surface-container-highest: '#e0e3e5'
  on-surface: '#191c1e'
  on-surface-variant: '#3d4a3d'
  inverse-surface: '#2d3133'
  inverse-on-surface: '#eff1f3'
  outline: '#6d7b6c'
  outline-variant: '#bccbb9'
  surface-tint: '#006e2f'
  primary: '#006e2f'
  on-primary: '#ffffff'
  primary-container: '#22c55e'
  on-primary-container: '#004b1e'
  inverse-primary: '#4ae176'
  secondary: '#565e74'
  on-secondary: '#ffffff'
  secondary-container: '#dae2fd'
  on-secondary-container: '#5c647a'
  tertiary: '#505f76'
  on-tertiary: '#ffffff'
  tertiary-container: '#9dadc6'
  on-tertiary-container: '#314156'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#6bff8f'
  primary-fixed-dim: '#4ae176'
  on-primary-fixed: '#002109'
  on-primary-fixed-variant: '#005321'
  secondary-fixed: '#dae2fd'
  secondary-fixed-dim: '#bec6e0'
  on-secondary-fixed: '#131b2e'
  on-secondary-fixed-variant: '#3f465c'
  tertiary-fixed: '#d3e4fe'
  tertiary-fixed-dim: '#b7c8e1'
  on-tertiary-fixed: '#0b1c30'
  on-tertiary-fixed-variant: '#38485d'
  background: '#f7f9fb'
  on-background: '#191c1e'
  surface-variant: '#e0e3e5'
typography:
  headline-xl:
    fontFamily: Hanken Grotesk
    fontSize: 40px
    fontWeight: '700'
    lineHeight: 48px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Hanken Grotesk
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
    letterSpacing: -0.01em
  headline-lg-mobile:
    fontFamily: Hanken Grotesk
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  headline-md:
    fontFamily: Hanken Grotesk
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
  label-md:
    fontFamily: JetBrains Mono
    fontSize: 14px
    fontWeight: '500'
    lineHeight: 20px
    letterSpacing: 0.02em
  label-sm:
    fontFamily: JetBrains Mono
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  base: 4px
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 40px
  container-max: 1280px
  gutter: 24px
---

## Brand & Style
The design system is engineered for high-stakes financial clarity and professional trust. It adopts a **Minimalist** aesthetic that prioritizes data density without sacrificing legibility. By utilizing expansive whitespace and a restrained color palette, the UI directs focus toward transactional accuracy and growth metrics. 

The target audience consists of financial analysts, accountants, and business owners who require a tool that feels reliable, objective, and efficient. The emotional response is one of "calm control"—reducing the cognitive load associated with complex ledger management through a systematic, organized, and airy interface.

## Colors
The palette is anchored by a crisp `#FFFFFF` background to ensure maximum contrast and a sense of cleanliness. 

- **Primary (#22C55E):** Reserved for core "Success" actions, growth indicators, and primary call-to-action buttons. It signifies movement and positive financial health.
- **Secondary (#0F172A):** A deep slate used for primary headings and navigation elements to provide a grounded, authoritative structure.
- **Tertiary (#64748B):** A muted blue-gray for secondary information, icons, and metadata.
- **Neutral (#F8FAFC):** A very light gray used for container backgrounds and subtle section differentiation to prevent visual fatigue.

## Typography
The typography system uses a tri-font strategy to balance character and utility. 

**Hanken Grotesk** provides a sharp, contemporary feel for headlines, ensuring the brand feels "fintech-forward." **Inter** is utilized for all body copy due to its exceptional readability and neutral tone. **JetBrains Mono** is strategically applied to labels, data points, and currency values to evoke the precision of a ledger and ensure numerical alignment.

Text colors should strictly follow the hierarchy: Deep slate for headings, charcoal for body, and slate-gray for labels and captions.

## Layout & Spacing
The design system employs a **12-column fluid grid** for desktop and a **4-column grid** for mobile. A strict 4px baseline grid governs all vertical rhythm.

- **Margins:** Desktop uses 40px outer margins; Mobile scales down to 16px.
- **Gutters:** Standardized at 24px to provide significant breathing room between data widgets.
- **Padding:** Containers and cards should utilize "Lush" padding (24px or 32px) to maintain the minimalist, airy aesthetic requested. Avoid cramped data tables; use increased row heights (minimum 48px) for tabular data.

## Elevation & Depth
This design system avoids heavy drop shadows in favor of **Tonal Layers** and **Subtle Outlines**. 

- **Level 0 (Floor):** White (`#FFFFFF`) background.
- **Level 1 (Cards/Containers):** Light gray (`#F8FAFC`) fill with a very fine 1px border (`#E2E8F0`). 
- **Level 2 (Dropdowns/Modals):** White fill with a soft, ultra-diffused shadow: `0 4px 20px -2px rgba(15, 23, 42, 0.08)`.

Depth is primarily communicated through color shifts in surfaces rather than physical height, keeping the interface flat and modern.

## Shapes
A "Soft" rounding strategy is used to balance professional rigor with modern approachability. 

Small elements like checkboxes and tags use `0.25rem` (4px). Standard components like buttons and input fields use `rounded-lg` (8px). Larger structural elements like cards or dashboard widgets use `rounded-xl` (12px). This creates a subtle visual hierarchy where larger objects appear slightly "softer" than the precise interactive elements within them.

## Components
- **Buttons:** Primary buttons use a solid `#22C55E` fill with white text. Secondary buttons use a white fill with a `#E2E8F0` border and slate text.
- **Input Fields:** Use a subtle `#F8FAFC` background with a 1px `#E2E8F0` border. On focus, the border transitions to `#22C55E` with a faint green outer glow.
- **Cards:** White background, 1px border, no shadow unless hovered. Content within cards should follow the 24px internal padding rule.
- **Chips/Status Tags:** For "Paid" or "Success," use a 10% opacity green background with 100% opacity green text. For "Pending," use a soft amber. 
- **Lists:** Clean rows separated by 1px horizontal lines (`#F1F5F9`). No zebra-striping; use hover states (subtle gray shift) to indicate interactivity.
- **Data Tables:** High-density mono-type numbers using `label-md`. Headers should be all-caps slate text at `label-sm` size.