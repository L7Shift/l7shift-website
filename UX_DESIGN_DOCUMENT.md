# L7 Shift - UX Site Design Document
## www.l7shift.com

**Document Version:** 1.0
**Last Updated:** January 26, 2026
**Platform:** Next.js 14 (App Router)
**Live URL:** https://l7shift.com

---

## 1. Executive Summary

L7 Shift is a digital consulting agency website featuring a bold, rebellious brand identity with a dark theme and vibrant accent colors. The site employs a dual-experience architecture: a feature-rich desktop experience with custom cursor and complex animations, and a streamlined mobile experience optimized for touch interactions.

**Core Taglines:**
- "Strategy. Systems. Solutions." (Framework)
- "Digital transformation for the non-conformist." (Brand Voice)
- "Break the Square." (Signature)

---

## 2. Brand Design System

### 2.1 Color Palette

| Color Name | Hex Code | Usage |
|------------|----------|-------|
| Void Black | `#0A0A0A` | Primary background |
| Clean White | `#FAFAFA` | Primary text |
| Electric Cyan | `#00F0FF` | Primary accent, CTAs, highlights |
| Hot Magenta | `#FF00AA` | Secondary accent, hover states |
| Acid Lime | `#BFFF00` | Tertiary accent, special highlights |
| Carbon Gray | `#2A2A2A` | Cards, secondary backgrounds |
| Soft Gray | `#E5E5E5` | Body text, subtle elements |

### 2.2 Typography

| Element | Font Family | Weight | Size |
|---------|-------------|--------|------|
| Headlines (H1-H6) | Helvetica Neue | 700 | Responsive (clamp) |
| Body Text | Inter | 400-600 | 16-20px |
| Labels/Badges | Inter | 600 | 10-12px |
| Navigation | Inter | 600 | 14px |

### 2.3 Spacing System

- **Section Padding:** 120px vertical (desktop), 60px (mobile)
- **Content Max Width:** 1400px
- **Grid Gap:** 60px (desktop), 24px (mobile)
- **Component Spacing:** 8px base unit

---

## 3. Site Architecture

### 3.1 Page Structure (Single Page Application)

```
l7shift.com/
├── #hero          - Hero section with breaking square animation
├── #services      - Service offerings (BUILD, BRAND, SHIFT)
├── #process       - 4-step process flow
├── #investment    - Pricing/engagement models
└── #contact       - Contact form
```

### 3.2 Navigation Structure

**Desktop Navigation (Fixed Header)**
- Logo: "L7 SHIFT" with "BREAK THE SQUARE" tagline
- Nav Links: SERVICES | PROCESS | INVESTMENT
- CTA Button: "START A PROJECT" (gradient)

**Mobile Navigation (Minimal + Overlay)**
- Header: L7 logo mark (left) + "MENU" text (right)
- Full-screen overlay with large nav links
- Theatrical fade-in animation

---

## 4. Section Breakdown

### 4.1 Hero Section

**Purpose:** Immediate brand impact and value proposition

**Desktop Layout:**
- Two-column grid (content left, visual right)
- Breaking square animation (CSS keyframes)
- Gradient glow backgrounds
- Custom cursor interaction

**Content Elements:**
- Badge: "STRATEGY • SYSTEMS • SOLUTIONS"
- Headline: "Stop being square." (glitch effect on "square")
- Subhead: "Digital transformation for the non-conformist..."
- CTAs: "LET'S TALK" (primary) + "EXPLORE SERVICES" (secondary)
- Stats: "Fast Delivery" | "Real Results"

**Visual Elements:**
- Central rotating square with fragments
- Orbiting dots (cyan + magenta)
- Gradient glow pulses
- Scroll indicator (vertical)

**Mobile Adaptation:**
- Stacked layout (content above visual)
- Simplified visual treatment
- Full-width CTA buttons

---

### 4.2 Marquee Section

**Purpose:** Brand reinforcement through motion

**Content:**
BRAND • SHIFT • INNOVATE • CREATE • TRANSFORM • BUILD (repeating)

**Implementation:**
- CSS animation: `marquee 20s linear infinite`
- Seamless loop with duplicated content
- Diamond separators between words

---

### 4.3 Problem Section

**Purpose:** Identify pain points, establish authority

**Layout:** Two columns (problems left, stat right)

**Content - Pain Points:**
1. **Outdated tech** - Legacy systems that slow everything down
2. **Cookie-cutter brands** - Looking like everyone else in the market
3. **Fear of change** - Knowing they need to evolve but not how
4. **Wasted budgets** - Paying agencies for mediocre results

**Stat Callout:**
- "73%" (large gradient text)
- "of digital transformations fail"
- "— McKinsey"

---

### 4.4 Services Section

**Purpose:** Showcase core offerings

**Section Header:**
- Label: "THE SOLUTION"
- Headline: "We help you *break* the box."

**Service Cards (3 columns):**

| Card | Title | Subtitle | Description |
|------|-------|----------|-------------|
| 01 | BUILD | Custom Apps & Websites | From MVPs to full platforms. AI-powered tools. Modern stacks. No bloated enterprise BS. |
| 02 | BRAND | Identity & Strategy | Logos that stick. Messaging that cuts through. Positioning that makes you unforgettable. |
| 03 | SHIFT | Business Transformation | Process automation. AI integration. New revenue streams. Futureproofing operations. |

**Capabilities Grid:**

| Category | Technologies |
|----------|--------------|
| Optimize & Scale | Docker, Kubernetes, AWS, GCP, Terraform, CI/CD |
| Build Modern | Next.js, TypeScript, Tailwind, Supabase, Vercel, Resend |
| E-Commerce | Shopify, WooCommerce, Stripe, Custom Storefronts, Inventory Systems, Payment Integration |
| Legacy & Migration | WordPress, PHP, MySQL, PostgreSQL, API Integrations, Data Migration |

---

### 4.5 Process Section

**Purpose:** Demystify the engagement process

**Section Header:**
- Label: "PROCESS"
- Headline: "How We Work"

**Steps (4 columns with timeline):**

| Step | Title | Description |
|------|-------|-------------|
| 01 | DISCOVER | Deep dive into your business, goals, and constraints |
| 02 | DESIGN | Strategy, concepts, and prototypes before building |
| 03 | BUILD | Rapid development with weekly check-ins |
| 04 | LAUNCH | Deploy, test, iterate, and scale |

**Visual Treatment:**
- Large background number (04) as watermark
- Gradient line connecting steps
- Color-coded step numbers (cyan → magenta → lime → cyan)

---

### 4.6 Why Us Section

**Purpose:** Differentiation and trust building

**Section Header:**
- Label: "WHY US"
- Headline: "Why L7 Shift?"

**Value Props (2x2 grid):**

| Title | Description | Accent Color |
|-------|-------------|--------------|
| No Agency BS | No account managers, no layers. You work directly with the people building. | Cyan |
| Outcomes First | We measure success by your results — revenue, users, growth. Not deliverables. | Magenta |
| Ship & Iterate | Launch fast, learn from real users, improve continuously. Momentum over perfection. | Lime |
| Skin in the Game | We care about your success, not billable hours. Your win is our win. | Cyan |

---

### 4.7 Case Study Section

**Purpose:** Social proof through real results

**Section Header:**
- Label: "CASE STUDY"
- Headline: "Real Results"

**Featured Project: Scat Pack CLT**
- Description: Dog waste removal SaaS with scheduling, payments, route optimization, and AI assistant for 24/7 customer support

**Stats Grid:**
| Metric | Value |
|--------|-------|
| Core Build | 24hrs |
| DB Tables | 18 |
| API Routes | 23 |
| Portals | 4 |

**Tech Stack Tags:** Next.js, Supabase, Stripe, Vercel, Resend

**Outcome Cards:**
- "The Stack" - AI agent framework, Supabase backend, automated tests + self-service tools. Built to dominate, not compete.
- "The Shift" - Strategy → Systems → Solutions → Shifted outcomes. Live business. Paying customers. Zero manual processes. They launched ready to dominate.

**CTA:** "Your project could be here. LET'S TALK →"

---

### 4.8 Investment Section

**Purpose:** Pricing transparency

**Section Header:**
- Label: "INVESTMENT"
- Headline: "Flexible Engagement Models"

**Pricing Tiers (3 columns):**

| Tier | Model | Description | Features |
|------|-------|-------------|----------|
| PROJECT | Fixed Scope | One-time builds | Defined scope & deliverables, Clear timeline & milestones, Perfect for MVPs, brands, sites |
| RETAINER | Ongoing | Monthly partnership | Dedicated capacity monthly, Priority support & iterations, Continuous improvement |
| PARTNER | Equity | Startup collaboration | Reduced cash + equity stake, Full commitment to success, For early-stage companies |

**Background:** Light/white section for contrast

---

### 4.9 Contact Section

**Purpose:** Lead generation

**Section Header:**
- Label: "START A PROJECT"
- Headline: "Ready to shift?"
- Subhead: "Tell us about your project. We'll get back to you within 24 hours with our thoughts."

**Contact Info:**
- Email: hello@l7shift.com (with icon)

**Form Fields:**
- Name (text input)
- Email (email input)
- Tell us about your project (textarea)
- Submit: "SEND MESSAGE →" (gradient button)

---

### 4.10 Footer

**Layout:** Three-column (logo | copyright | social)

**Content:**
- Logo: "L7 SHIFT"
- Copyright: "© 2026 L7 Shift. Break the square."
- Social: @l7shift

---

## 5. Animation & Interaction System

### 5.1 CSS Animations

| Animation | Duration | Easing | Usage |
|-----------|----------|--------|-------|
| `pulse` | 3-4s | ease-in-out | Glows, accents |
| `float` | 4-7s | ease-in-out | Decorative elements |
| `orbit` | 8-12s | linear | Orbiting dots |
| `glitch` | 0.3s | cubic-bezier | Text hover effect |
| `slideUp` | 0.8s | cubic-bezier(0.16, 1, 0.3, 1) | Reveal animations |
| `marquee` | 20s | linear | Scrolling text |
| `gradientShift` | 4s | ease | Gradient bar |
| `scanline` | 8s | linear | Scan effect overlay |

### 5.2 Custom Cursor (Desktop Only)

- **Outer Ring:** 20px cyan border, follows mouse with slight delay
- **Inner Dot:** 4px magenta dot, tracks mouse position
- **Hover State:** 2.5x scale, magenta glow, background tint
- **Implementation:** `mix-blend-mode: difference` for visibility

### 5.3 Scroll-Triggered Animations

- Elements use `.reveal-up` class with staggered delays
- Intersection Observer triggers `.visible` class
- Stagger delays: 0.1s increments (delay-1 through delay-6)

### 5.4 Hover Effects

- **Primary Button:** translateY(-4px), scale(1.02), cyan glow shadow
- **Secondary Button:** Border fade, gradient underline expansion
- **Service Cards:** translateY(-12px), scale(1.02)
- **Glitch Text:** Increased animation speed on hover

---

## 6. Mobile Experience

### 6.1 Device Detection

- **Breakpoint:** 768px
- **Method:** Client-side detection via `useDeviceDetection` hook
- **Behavior:** Complete component tree swap (not responsive CSS)

### 6.2 Mobile Header

- **Height:** 70px fixed
- **Content:** L7 logo (left) + MENU button (right)
- **Style:** Minimal, clean, no navigation links visible

### 6.3 Mobile Menu Overlay

- **Trigger:** Tap MENU button
- **Animation:** Fade in with backdrop blur
- **Content:**
  - Large navigation links (centered)
  - Gradient bar accent
  - "START A PROJECT" CTA
  - Close button (X)
- **Feel:** Theatrical, premium, full-screen takeover

### 6.4 Mobile Section Adaptations

| Section | Mobile Treatment |
|---------|------------------|
| Hero | Stacked layout, simplified visual, full-width CTAs |
| Services | Vertical card stack, full-width |
| Process | Vertical timeline |
| Why Us | Single column cards |
| Pricing | Stacked tiers |
| Contact | Full-width form |

---

## 7. Technical Implementation

### 7.1 Component Architecture

```
src/
├── app/
│   ├── page.tsx              # Device router
│   ├── globals.css           # Shared styles + animations
│   └── api/contact/route.ts  # Form submission endpoint
├── hooks/
│   ├── useDeviceDetection.ts # Mobile/desktop detection
│   ├── useMouseTracking.ts   # Cursor position + hover
│   ├── useScrollTracking.ts  # Scroll position + observer
│   └── useContactForm.ts     # Form state management
├── components/
│   ├── desktop/              # 14 desktop components
│   ├── mobile/               # 11 mobile components
│   └── shared/               # Reusable components
```

### 7.2 Performance Considerations

- **CSS Animations:** Prefer CSS over JS for animations
- **Will-Change:** Applied to animated elements
- **Lazy Loading:** Images and heavy components
- **Code Splitting:** Separate desktop/mobile bundles

---

## 8. SEO & Accessibility

### 8.1 Current Status

**Known Issue:** Site uses `'use client'` directive which may affect server-side rendering and SEO crawlability.

### 8.2 Future Research Items

1. [ ] Check Google Search Console for indexing status
2. [ ] Verify SSR is working properly for main content
3. [ ] Add sitemap.xml generation
4. [ ] Consider moving device detection server-side
5. [ ] Add structured data (JSON-LD) for organization
6. [ ] Implement Open Graph meta tags for social sharing
7. [ ] Add canonical URLs
8. [ ] Test with Google's Mobile-Friendly Test
9. [ ] Verify robots.txt configuration

### 8.3 Accessibility Checklist

- [ ] Keyboard navigation for all interactive elements
- [ ] ARIA labels for custom components
- [ ] Color contrast ratios (WCAG AA minimum)
- [ ] Focus indicators visible
- [ ] Screen reader testing
- [ ] Reduced motion preference support

---

## 9. Future Enhancements

### 9.1 Mobile Animation Additions

**Recommended additions to bring desktop energy to mobile:**

1. **Breaking Square Visual** - Simplified version for mobile hero
2. **Glitch Text Effect** - CSS-only, lightweight
3. **Float Animations** - On decorative elements
4. **Pulse Effects** - On accent elements
5. **Stagger Reveals** - On scroll entry

### 9.2 Feature Roadmap

- [ ] Blog/insights section
- [ ] Detailed case study pages
- [ ] Team/about page
- [ ] Service detail pages
- [ ] Client portal integration
- [ ] Newsletter signup
- [ ] Live chat widget

---

## 10. Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | Jan 26, 2026 | Initial document creation |

---

**Document Prepared By:** Claude Code
**For:** L7 Shift Consulting
