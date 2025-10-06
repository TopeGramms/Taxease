# TaxEase – Nigeria Tax Calculator Design Guidelines

## Design Approach
**System-Based Approach**: This is a utility-focused tax calculator requiring clarity, trust, and efficiency. Drawing inspiration from financial tools like Stripe Dashboard and Linear for clean, functional interfaces.

## Core Design Principles
1. **Clarity First**: Users need to understand inputs and results instantly
2. **Trust & Professionalism**: Financial calculations require a credible, authoritative interface
3. **Efficiency**: Minimize friction in data entry and result comprehension
4. **Nigerian Context**: Subtle integration of national identity through color and tone

---

## Color Palette

**Primary Brand Color**
- Nigerian Green: 152 100% 27% (#008751) - Use for primary buttons, headings, active states, and brand accents

**Neutrals (Dark Mode)**
- Background: 0 0% 7% (deep charcoal)
- Card/Surface: 0 0% 11% (elevated surfaces)
- Border: 0 0% 20% (subtle dividers)
- Text Primary: 0 0% 95% (high contrast)
- Text Secondary: 0 0% 65% (muted text)

**Semantic Colors**
- Success: 142 76% 36% (green for positive results)
- Warning: 38 92% 50% (amber for alerts)
- Error: 0 84% 60% (red for validation errors)

---

## Typography

**Font Stack**: 'Inter', 'Poppins', system-ui, sans-serif

**Scale & Usage**
- Headings (H1): 2rem (32px), font-weight 700, Nigerian Green
- Headings (H2): 1.5rem (24px), font-weight 600
- Body Text: 0.938rem (15px), font-weight 400, line-height 1.6
- Input Labels: 0.875rem (14px), font-weight 500
- Large Numbers (Tax Results): 2.5rem (40px), font-weight 700
- Helper Text: 0.813rem (13px), font-weight 400, text-secondary

---

## Layout System

**Spacing Primitives**: Use Tailwind units of 2, 4, 6, and 8 consistently
- Component spacing: p-6 or p-8
- Section gaps: gap-4 or gap-6
- Form field spacing: space-y-4
- Button padding: px-6 py-3

**Container Strategy**
- Max width: 500px (as specified), centered with mx-auto
- Viewport padding: px-4 on mobile, px-6 on desktop
- Card elevation: Subtle shadow with backdrop blur

---

## Component Library

### Mode Toggle
- Segmented control design (pills)
- Active state: Nigerian Green background with white text
- Inactive state: transparent with border, text-secondary
- Smooth transition: 200ms ease-in-out
- Position: Top of form, centered

### Input Fields
- Height: 48px minimum for touch targets
- Border: 1px solid border-color, rounded-lg (8px)
- Focus state: Nigerian Green border (2px), subtle green glow
- Labels: Above input, font-weight 500, mb-2
- Prefix: "₦" symbol integrated within input (left-aligned, text-secondary)
- Placeholder: Light gray, italic
- Group related inputs visually with subtle background variation

### Checkboxes
- Size: 20px × 20px
- Checked: Nigerian Green background with white checkmark
- Border-radius: 4px
- Label: Right-aligned, clickable

### Buttons
**Primary (Calculate Tax)**
- Background: Nigerian Green
- Text: White, font-weight 600
- Padding: px-8 py-4
- Border-radius: 8px
- Full width on mobile
- Hover: Slightly lighter green with subtle lift (shadow)

**Secondary (Download PDF)**
- Outline style: 2px Nigerian Green border
- Text: Nigerian Green
- Background: transparent with blur if on images
- Same dimensions as primary

### Results Display Card
- Prominent elevation with stronger shadow
- Background: Slightly lighter than page background
- Padding: p-8
- Border-left: 4px solid Nigerian Green (accent strip)
- Results layout:
  - "Total Tax Owed" in large numbers (40px), Nigerian Green
  - "After-Tax Income" below, slightly smaller (32px)
  - Fun line in italic, text-secondary, smaller font
- Border-radius: 12px

### Banner (Disclaimer)
- Light gray background with subtle border
- Icon: Info icon (left-aligned)
- Text: 0.875rem, balanced line-height
- Position: Below results
- Padding: p-4, rounded-lg

### Footer
- Text-center, text-secondary
- Font-size: 0.813rem
- Padding: py-8
- Links in Nigerian Green with underline on hover
- "Built with ❤️ by Topegramms" includes red heart

---

## Interaction Design

**Transitions**
- Mode switching: 300ms cubic-bezier ease
- Form visibility (crypto section): Slide-down with 250ms ease-out
- Input focus: 150ms border color transition
- Button hover: 200ms all properties

**Auto-Detection**
- When user enters buy/sell price in crypto fields, smoothly reveal quantity field with fade-in animation

**Validation**
- Real-time validation with subtle red border for errors
- Error messages appear below input in red text (0.813rem)

---

## Responsive Behavior

**Mobile (< 640px)**
- Full-width buttons
- Stack all form elements vertically with gap-4
- Results card: Full viewport width minus px-4 padding
- Font sizes: Reduce headings by 15%

**Desktop (≥ 640px)**
- Container centered at 500px max-width
- Buttons: Auto width (px-12)
- Maintain generous vertical spacing (py-8 between sections)

---

## Accessibility
- Minimum contrast ratio: 4.5:1 for all text
- Focus indicators: 2px Nigerian Green outline with 2px offset
- All interactive elements: Minimum 44px touch target
- Labels associated with inputs via for/id attributes
- ARIA labels for screen readers on calculator button

---

## Visual Hierarchy
1. **App Title** ("TaxEase"): Top, largest, Nigerian Green, bold
2. **Mode Toggle**: Immediately below title, visually distinct
3. **Form Sections**: Clear groupings with subtle dividers or spacing
4. **Calculate Button**: Bold, stands out with Nigerian Green
5. **Results**: Most prominent visual element when displayed

---

## No Images Required
This utility app doesn't need hero imagery. The focus is on functional clarity and efficient data entry/display.