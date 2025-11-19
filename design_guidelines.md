# Restaurant Ordering Platform - Design Guidelines

## Design Approach
**Reference-Based:** Drawing inspiration from modern food delivery platforms (DoorDash, Uber Eats) combined with sleek SaaS interactions (Linear, Notion) - vibrant, mobile-first, with rich micro-interactions.

## Core Design Principles
- **Mobile-first responsive design** - optimized for table QR scanning
- **Vibrant, animated interfaces** with staggered reveals and smooth transitions
- **Rich visual hierarchy** using food photography, gradients, and modern card layouts
- **Instant feedback** through micro-interactions and live status updates

## Typography
- **Headings:** Bold, modern sans-serif (600-700 weight)
- **Body:** Clean, readable sans-serif (400-500 weight)
- **Hierarchy:** Clear distinction between eyebrow text, headings, subheadings, and body
- **Micro-labels:** Small pills/badges for status, tags, and context

## Layout System
**Spacing:** Use Tailwind units of 2, 4, 6, 8, 12, 16, 20, 24 consistently
- Sections: py-12 to py-24
- Cards: p-4 to p-6
- Gaps: gap-4 to gap-8

## Component Library

### Header (Sticky)
- Transparent initially, solid on scroll with blur effect
- Left: Round logo + restaurant name
- Center: Context pill ("Dine-in · Table T12")
- Right: Profile icon, language toggle
- Slides up and locks on scroll

### Hero Section
- Full-width gradient background (deep navy → warm orange)
- Animated gradient orbs/patterns
- Left: Welcome text + quick action chips
- Right: Floating phone mockup with overlapping food cards
- Quick action chips: "Start Ordering", "Surprise me", "View favorites", "Order for later"

### Modern Widget Cards
**Dish of the Day:**
- Large spotlight card with image left/top
- Pulsing badge label
- Tags row (spice level, serves, time)
- Dual CTAs

**Deals Carousel:**
- Horizontal swipe cards with image backgrounds
- Gradient overlays
- Save badges ("Save 15%", "New", "Limited")
- Dot indicators

**AI Recommendations Grid:**
- Staggered fade-in cards
- Personalization badges ("You ordered similar")
- Quick add buttons
- Slight tilt on hover

**Popular Now:**
- Horizontal scrollable cards
- Heat indicator ("🔥 24 orders today")
- Slide-in from right animation

### Category Pills
- Scrollable horizontal row with emoji icons
- Active state highlighting
- Smooth scroll to section on click
- Below: 2-3 large category preview tiles with zoom on hover

### Order Status Components
**Sticky Bottom Bar/Widget:**
- Cart summary or active order status
- Slide-up panel revealing full details
- Timeline visualization (Received → In Kitchen → Almost Ready → Ready)
- "I've arrived" button for order-ahead

### Order Ahead Widget
- Split card layout
- Time picker (dropdown/slider: ASAP, 6:30 PM, 7:00 PM, etc.)
- Smooth sliding interaction

## Animations & Interactions
- **Page load:** Staggered fade-ins with 50ms delays
- **Scroll reveals:** Cards slide up and fade in
- **Hover states:** Scale to 1.03, glow borders, shadow deepening
- **Card effects:** Floating/bobbing (keyframes), subtle parallax
- **Status updates:** Progress bar animations, confetti on order placed
- **Loading states:** Shimmer skeleton placeholders
- **Transitions:** Smooth easing (300-400ms)

## Images
**Essential imagery throughout:**
- **Hero:** High-quality food photography (biryani, karahi, naan) - bright, saturated, shallow depth of field
- **Dish cards:** Professional food shots for each menu item
- **Category tiles:** Close-up shots (sizzling BBQ, steaming karahi, fluffy rice)
- **Deal cards:** Combo/platter photos with gradient overlays
- **Device mockup:** Phone showing digital menu interface

## Accessibility
- Clear focus states on all interactive elements
- Sufficient contrast ratios for text
- Touch targets minimum 44x44px
- Semantic HTML structure
- ARIA labels for status updates

## Footer
Minimal, guest-friendly:
- Help contact information
- Essential links (Allergy info, Terms, Privacy)
- Platform attribution
- py-8 spacing