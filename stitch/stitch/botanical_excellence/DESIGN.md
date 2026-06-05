---
name: Botanical Excellence
colors:
  surface: '#f9f9f9'
  surface-dim: '#dadada'
  surface-bright: '#f9f9f9'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f3f3f4'
  surface-container: '#eeeeee'
  surface-container-high: '#e8e8e8'
  surface-container-highest: '#e2e2e2'
  on-surface: '#1a1c1c'
  on-surface-variant: '#434843'
  inverse-surface: '#2f3131'
  inverse-on-surface: '#f0f1f1'
  outline: '#737973'
  outline-variant: '#c3c8c1'
  surface-tint: '#4d6453'
  primary: '#061b0e'
  on-primary: '#ffffff'
  primary-container: '#1b3022'
  on-primary-container: '#819986'
  inverse-primary: '#b4cdb8'
  secondary: '#5a632e'
  on-secondary: '#ffffff'
  secondary-container: '#dce5a3'
  on-secondary-container: '#5f6732'
  tertiary: '#17180a'
  on-tertiary: '#ffffff'
  tertiary-container: '#2b2d1d'
  on-tertiary-container: '#93947f'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#d0e9d4'
  primary-fixed-dim: '#b4cdb8'
  on-primary-fixed: '#0b2013'
  on-primary-fixed-variant: '#364c3c'
  secondary-fixed: '#dfe8a6'
  secondary-fixed-dim: '#c3cc8c'
  on-secondary-fixed: '#191e00'
  on-secondary-fixed-variant: '#434b18'
  tertiary-fixed: '#e4e4cc'
  tertiary-fixed-dim: '#c8c8b0'
  on-tertiary-fixed: '#1b1d0e'
  on-tertiary-fixed-variant: '#474836'
  background: '#f9f9f9'
  on-background: '#1a1c1c'
  surface-variant: '#e2e2e2'
typography:
  display-lg:
    fontFamily: Montserrat
    fontSize: 48px
    fontWeight: '700'
    lineHeight: '1.2'
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Montserrat
    fontSize: 32px
    fontWeight: '600'
    lineHeight: '1.3'
  headline-lg-mobile:
    fontFamily: Montserrat
    fontSize: 24px
    fontWeight: '600'
    lineHeight: '1.3'
  title-md:
    fontFamily: Montserrat
    fontSize: 20px
    fontWeight: '600'
    lineHeight: '1.4'
  body-lg:
    fontFamily: Montserrat
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.6'
  body-sm:
    fontFamily: Montserrat
    fontSize: 14px
    fontWeight: '400'
    lineHeight: '1.5'
  label-caps:
    fontFamily: Montserrat
    fontSize: 12px
    fontWeight: '700'
    lineHeight: '1'
    letterSpacing: 0.1em
  price-tag:
    fontFamily: Montserrat
    fontSize: 18px
    fontWeight: '600'
    lineHeight: '1'
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  unit: 8px
  container-margin-mobile: 20px
  container-margin-desktop: 80px
  gutter: 16px
  section-gap: 48px
  stack-sm: 4px
  stack-md: 12px
  stack-lg: 24px
---

## Brand & Style
This design system embodies a "Botanical Luxury" aesthetic, blending the serenity of nature with the precision of premium hospitality. The personality is sophisticated, organic, and tranquil. It targets a discerning clientele who appreciates high-end culinary experiences and intuitive, clutter-free digital interactions.

The visual style is **Minimalist with Tactile accents**. It leverages heavy whitespace to create a "breathable" interface, reminiscent of a quiet garden. While the customer-facing side focuses on high-quality food photography and elegant presentation, the admin side transitions into a **Modern SaaS** layout that prioritizes functional efficiency without losing the premium brand essence. 

Key attributes:
- **Atmospheric:** Evoking the feeling of a lush, upscale conservatory.
- **Precision-led:** Sharp alignment and clear hierarchies reflect professional service.
- **RTL-Native:** Designed with bidirectional flow in mind to ensure the Arabic reading experience is as premium as the English one.

## Colors
The palette is rooted in deep, earthy tones that signify growth and exclusivity. 

- **Forest Green (#1B3022):** Used for primary headings, call-to-action buttons, and brand-heavy backgrounds. It provides the "anchor" for the luxury feel.
- **Olive Green (#4B5320):** Utilized for accents, active states, and secondary information like category tags.
- **Light Beige (#F5F5DC):** The primary background color for the customer menu, offering a softer, warmer alternative to pure white that reduces eye strain in low-light restaurant environments.
- **White (#FFFFFF):** Reserved for card surfaces, input fields, and the admin dashboard background to maintain a "clean" and surgical professional look.

Contrast ratios must adhere strictly to AAA standards for readability, especially for price points and ingredient descriptions.

## Typography
This design system uses **Montserrat** as its primary typeface for its geometric purity and modern elegance. For Arabic localizations, the system utilizes **Almarai**, ensuring the stroke weights and x-heights harmonize perfectly with the Latin counterpart.

- **Headlines:** Use Bold and Semi-Bold weights to establish clear hierarchy. Use tighter letter spacing for large display text to give it a "custom" editorial feel.
- **Body Text:** Standard weight (400) is used for dish descriptions and instructions to ensure maximum legibility.
- **Price Points:** Always rendered in Semi-Bold to ensure they are immediately scannable. 
- **RTL Considerations:** When switching to Arabic, the line height is increased by 10% to accommodate the script's ascending and descending characters without crowding the layout.

## Layout & Spacing
The layout follows a **Fluid Grid** model with a focus on vertical rhythm. 

### Customer View (Mobile-First)
- **Grid:** 4-column system.
- **Margins:** 20px side margins to ensure content doesn't feel cramped against the screen edges.
- **Flow:** Single-column scroll for menu items to allow for large, appetizing imagery.

### Admin View (Desktop)
- **Grid:** 12-column system.
- **Side Navigation:** Fixed 280px width, utilizing the Forest Green primary color.
- **Content Area:** Fluid width with a max-container size of 1440px to prevent excessive line lengths in data tables.

### RTL Transformation
The layout mirrors horizontally for Arabic support. Icons that indicate direction (like "back" arrows) must be flipped, while non-directional icons (like "search" or "leaf") remain unchanged.

## Elevation & Depth
To maintain a high-end feel, this design system avoids heavy shadows, instead using **Tonal Layering** and **Soft Ambient Occlusion**.

- **Level 0 (Surface):** Light Beige background. Flat.
- **Level 1 (Cards):** Pure White cards with a 1px border of #1B3022 at 5% opacity. A very soft shadow (0px 4px 20px rgba(27, 48, 34, 0.05)) is applied to give a "floated" feel.
- **Level 2 (Modals/Overlays):** Increased shadow depth (0px 12px 40px rgba(27, 48, 34, 0.12)) and a background backdrop blur of 8px to focus the user's attention.

Interactive elements (like buttons) use a subtle "press" effect where the shadow is removed and the element scales down to 98% to simulate physical feedback.

## Shapes
The shape language is **Refined and Organic**. 

- **Base Radius:** 0.5rem (8px). This is applied to input fields, buttons, and small cards to maintain a friendly yet professional tone.
- **Large Radius:** 1.5rem (24px). Applied to main product imagery and large menu item containers to create a softer, more "premium" look that mimics organic shapes.
- **Pill Shapes:** Reserved exclusively for category chips (e.g., "Vegan", "Gluten-Free") and status indicators in the admin panel to distinguish them from actionable buttons.

## Components

### Buttons
- **Primary:** Forest Green background with White text. Bold weight. Minimal padding of 16px vertical / 32px horizontal.
- **Secondary:** Transparent with a 1.5px Olive Green border.
- **Ghost:** No background or border. Primary color text. Used for "Cancel" or low-priority actions.

### Menu Cards (Customer)
- **Image-focused:** Top-aligned image with a subtle 4px internal margin from the card edge.
- **Details:** Dish name in `title-md`, description in `body-sm`, and price in `price-tag` positioned at the bottom right (bottom left for RTL).

### Input Fields
- **Style:** Outlined. 1px border using #1B3022 at 20% opacity. 
- **Focus State:** Border changes to Forest Green at 100% opacity with a 2px outer "glow" of the same color at 10% opacity.

### Chips & Tags
- **Dietary Tags:** Small pill-shaped containers with #4B5320 backgrounds and white text. Iconography (e.g., a small leaf) should precede the text.

### Admin Lists
- **Data Tables:** Alternating row highlights using #F5F5DC at 50% opacity. Headers must be in `label-caps` for clear distinction.