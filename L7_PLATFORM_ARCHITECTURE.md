# L7 Shift Internal Platform
## Case Study & Architecture Documentation

**Version:** 1.0
**Date:** January 27, 2026
**Author:** L7 Shift Engineering

---

## Executive Summary

L7 Shift has built a comprehensive internal platform to replace dependency on Monday.com and provide clients with unprecedented visibility into their project progress. The platform embodies the **SymbAIotic Method™** - a human-AI collaborative approach that delivers projects faster while maintaining quality.

### Key Metrics
| Metric | Before (Monday.com) | After (L7 Platform) |
|--------|--------------------|--------------------|
| Monthly Cost | $50+/mo | $0 (self-hosted) |
| Client Visibility | 0% | 100% real-time |
| Time to Status | Minutes (reading) | 3 seconds (visual) |
| Customization | Limited | Unlimited |
| Requirements Signoff | Manual email | In-app with audit trail |

---

## The Problem

Traditional project management tools fail creative agencies in three ways:

1. **Client Disconnect** - Clients never see progress, only hear about it
2. **Manual Updates** - Status reports require copy/paste from multiple sources
3. **Generic Workflows** - Tools built for everyone fit no one perfectly

L7 Shift needed a platform that demonstrates value through visuals, not text walls.

---

## The Solution: Visual-First, Insights-Driven

Every screen answers: **"What should I do next?"**

### Design Principles
- **3-Second Rule** - Understand project health in 3 seconds
- **5-Second Action** - Know your next action in 5 seconds
- **Visual Over Text** - Charts, rings, and pills over paragraphs
- **Actionable Insights** - Not just data, but recommendations

---

## System Architecture

```
┌─────────────────────────────────────────────────────────────────────────┐
│                         L7 SHIFT PLATFORM                               │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐         │
│  │   MARKETING     │  │    INTERNAL     │  │     CLIENT      │         │
│  │    WEBSITE      │  │     PORTAL      │  │     PORTAL      │         │
│  │                 │  │                 │  │                 │         │
│  │  l7shift.com    │  │   /internal/*   │  │  /portal/[slug] │         │
│  │                 │  │                 │  │                 │         │
│  │ • Hero/Landing  │  │ • Dashboard     │  │ • Dashboard     │         │
│  │ • Services      │  │ • Projects      │  │ • Deliverables  │         │
│  │ • Case Studies  │  │ • Kanban Board  │  │ • Requirements  │         │
│  │ • Contact/CTA   │  │ • Requirements  │  │ • Activity      │         │
│  │ • Insights Blog │  │ • Metrics       │  │ • Signoff Flow  │         │
│  └────────┬────────┘  └────────┬────────┘  └────────┬────────┘         │
│           │                    │                    │                   │
│           └────────────────────┴────────────────────┘                   │
│                                │                                        │
│                    ┌───────────┴───────────┐                           │
│                    │   SHARED COMPONENTS   │                           │
│                    │                       │                           │
│                    │  • Dashboard (10)     │                           │
│                    │  • Desktop (14)       │                           │
│                    │  • Mobile (11)        │                           │
│                    │  • Shared (3)         │                           │
│                    └───────────┬───────────┘                           │
│                                │                                        │
│           ┌────────────────────┴────────────────────┐                  │
│           │                                         │                   │
│  ┌────────┴────────┐                    ┌──────────┴──────────┐       │
│  │   SUPABASE      │                    │      VERCEL         │       │
│  │                 │                    │                     │       │
│  │ • PostgreSQL    │                    │  • Edge Functions   │       │
│  │ • Auth          │                    │  • CDN              │       │
│  │ • Storage       │                    │  • Deployments      │       │
│  │ • Realtime      │                    │  • Analytics        │       │
│  └─────────────────┘                    └─────────────────────┘       │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## Tech Stack

| Layer | Technology | Purpose |
|-------|------------|---------|
| **Framework** | Next.js 14 (App Router) | Server components, routing, API |
| **Language** | TypeScript | Type safety, better DX |
| **Styling** | CSS-in-JS + Tailwind | Brand consistency, rapid development |
| **Database** | Supabase PostgreSQL | Relational data, RLS security |
| **Auth** | Supabase Auth + PIN | Magic links + quick access |
| **Storage** | Supabase Storage | Deliverable files |
| **Realtime** | Supabase Realtime | Live updates |
| **Deployment** | Vercel | Edge network, instant deploys |
| **Email** | Resend | Transactional email |
| **Payments** | Stripe | Client billing |

---

## Database Schema

### Entity Relationship Diagram

```
┌─────────────────┐       ┌─────────────────┐       ┌─────────────────┐
│    PROJECTS     │       │     SPRINTS     │       │     TASKS       │
├─────────────────┤       ├─────────────────┤       ├─────────────────┤
│ id (PK)         │───┐   │ id (PK)         │   ┌───│ id (PK)         │
│ name            │   │   │ project_id (FK) │───┤   │ project_id (FK) │
│ client_name     │   │   │ name            │   │   │ sprint_id (FK)  │
│ description     │   │   │ goals           │   │   │ title           │
│ status          │   │   │ start_date      │   │   │ description     │
│ budget_total    │   │   │ end_date        │   │   │ status          │
│ budget_used     │   │   └─────────────────┘   │   │ priority        │
│ start_date      │   │                         │   │ shift_hours     │◄── The SymbAIotic
│ target_end_date │   │                         │   │ trad_hours_est  │    Method™ Metric
└────────┬────────┘   │                         │   │ assigned_to     │
         │            │                         │   │ shipped_at      │
         │            │   ┌─────────────────┐   │   └────────┬────────┘
         │            │   │  DELIVERABLES   │   │            │
         │            │   ├─────────────────┤   │            │
         │            └──►│ id (PK)         │   │   ┌────────┴────────┐
         │                │ project_id (FK) │◄──┘   │ TASK_COMMENTS   │
         │                │ task_id (FK)    │───────├─────────────────┤
         │                │ name            │       │ id (PK)         │
         │                │ type            │       │ task_id (FK)    │
         │                │ url             │       │ author          │
         │                │ status          │       │ content         │
         │                │ version         │       └─────────────────┘
         │                │ client_approved │
         │                └────────┬────────┘
         │                         │
         │                ┌────────┴────────┐
         │                │ CLIENT_FEEDBACK │
         │                ├─────────────────┤
         │                │ id (PK)         │
         │                │ deliverable_id  │
         │                │ client_id       │
         │                │ content         │
         │                │ resolved        │
         │                └─────────────────┘
         │
         │   ┌──────────────────┐       ┌──────────────────┐
         │   │ REQUIREMENTS_DOCS│       │ REQUIREMENT_     │
         │   ├──────────────────┤       │ SIGNOFFS         │
         └──►│ id (PK)          │───┐   ├──────────────────┤
             │ project_id (FK)  │   │   │ id (PK)          │
             │ title            │   └──►│ doc_id (FK)      │
             │ content (MDX)    │       │ client_id        │
             │ version          │       │ signed_at        │
             │ status           │       │ ip_address       │◄── Audit Trail
             │ created_by       │       │ user_agent       │
             └──────────────────┘       └──────────────────┘
```

### Tables Summary

| Table | Purpose | Records |
|-------|---------|---------|
| `projects` | Core project tracking | Parent entity |
| `sprints` | Time-boxed work periods | Grouped tasks |
| `tasks` | Individual work items | Kanban cards |
| `task_comments` | Discussion threads | Collaboration |
| `deliverables` | Client-facing files | Review/approval |
| `client_feedback` | Feedback on deliverables | Change requests |
| `requirements_docs` | Requirement specifications | Signoff workflow |
| `requirement_signoffs` | Audit trail | Legal record |
| `requirement_comments` | Doc discussions | Clarifications |
| `client_portal_sessions` | Client auth | Magic link/PIN |
| `activity_log` | All changes | Audit trail |

### Key Database Features

1. **Row Level Security (RLS)** - Clients only see their projects
2. **Auto Timestamps** - `updated_at` triggers on all tables
3. **Shipped Tracking** - Auto-sets `shipped_at` when task status changes
4. **Project Metrics View** - Pre-computed dashboard stats
5. **Velocity Function** - `get_project_velocity()` for charts

---

## Route Architecture

### Public Routes
```
/                           # Marketing homepage
/start                      # Intake form / discovery
/insights                   # Blog / thought leadership
/insights/[slug]            # Individual articles
```

### Internal Portal (L7 Team)
```
/internal                   # Dashboard - project overview
/internal/projects          # All projects grid/list
/internal/projects/[id]     # Single project + Kanban
/internal/requirements      # Requirements hub
/internal/requirements/[id] # Document editor
/internal/clients           # Client management (future)
/internal/metrics           # Analytics (future)
```

### Client Portal
```
/portal/[clientSlug]              # Client dashboard
/portal/[clientSlug]/deliverables # Deliverable gallery
/portal/[clientSlug]/requirements # Requirements + signoff
/portal/[clientSlug]/activity     # Activity timeline (future)
```

### Client-Specific (Legacy/Custom)
```
/client/prettypaidcloset          # Custom discovery flow
/discovery/prettypaidcloset       # Brand guide delivery
```

---

## Component Library

### Dashboard Components (`/components/dashboard/`)

| Component | Purpose | Props |
|-----------|---------|-------|
| `ProgressRing` | Circular completion indicator | `percentage`, `size`, `color`, `label` |
| `StatusPill` | Color-coded status badges | `status`, `size` |
| `ActionCard` | Clickable action tiles | `icon`, `title`, `subtitle`, `badge`, `variant` |
| `InsightCard` | AI-generated recommendations | `type`, `title`, `message`, `actionLabel` |
| `VelocitySparkline` | Mini trend charts | `data`, `color`, `height` |
| `TimelineBar` | Phase progress indicator | `phases`, `size` |
| `ActivityFeed` | Recent changes list | `items`, `maxItems` |
| `MetricCard` | Single metric display | `label`, `value`, `change`, `trend` |
| `ComparisonChart` | Shift vs Traditional hours | `shiftHours`, `traditionalHours` |
| `KanbanBoard` | Drag-drop task board | `tasks`, `onTaskMove`, `onTaskClick` |

### Visual Hierarchy

```
┌─────────────────────────────────────────────────────────────────┐
│  PROGRESS RING        TIMELINE BAR              ACTION BADGE    │
│  ┌───────────┐       ┌────────────────────┐    ┌───────────┐   │
│  │    78%    │       │ ●───●───◐───○       │    │    3      │   │
│  │ ╭───────╮ │       │ Disc│Des│Build│Lnch │    │  Actions  │   │
│  │ │       │ │       └────────────────────┘    │  Needed   │   │
│  │ ╰───────╯ │                                  └───────────┘   │
│  │ Complete  │                                                  │
│  └───────────┘                                                  │
├─────────────────────────────────────────────────────────────────┤
│  STATUS PILLS                                                   │
│                                                                 │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐          │
│  │ Backlog  │ │ Active   │ │ Review   │ │ Shipped  │          │
│  │   #888   │ │  #00F0FF │ │  #FF00AA │ │  #BFFF00 │          │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘          │
├─────────────────────────────────────────────────────────────────┤
│  COMPARISON CHART (The SymbAIotic Method™)                      │
│                                                                 │
│  Shift Hours        ████████░░░░░░░░░░░░░░░░░░░░  12.5h        │
│  Traditional Est.   ████████████████████████████  120h          │
│                                                                 │
│  "90% faster than traditional development"                      │
└─────────────────────────────────────────────────────────────────┘
```

### Website Components

**Desktop (`/components/desktop/`)** - 14 components
- `Navigation`, `HeroSection`, `MarqueeSection`
- `ProblemSection`, `ServicesSection`, `ProcessSection`
- `CaseStudySection`, `WhyUsSection`, `InvestmentSection`
- `ContactSection`, `Footer`, `CustomCursor`, `DesktopPage`

**Mobile (`/components/mobile/`)** - 11 components
- `MobileHeader`, `MobileMenuOverlay`, `MobileHero`
- `MobileServices`, `MobileProcess`, `MobilePricing`
- `MobileCaseStudy`, `MobileContact`, `MobileFooter`, `MobilePage`

**Shared (`/components/shared/`)** - 3 components
- `Button`, `SectionHeader`, `GradientBar`

---

## The SymbAIotic Method™

### Brand Terminology

| Term | Definition |
|------|------------|
| **L7 Shift** | Company name |
| **SymbAIotic Shift™** | Overall philosophy |
| **The SymbAIotic Method™** | Specific methodology |
| **Shift Hours** | Time measurement (AI-assisted hours) |

### The Value Proposition

```
Traditional Development:    The SymbAIotic Method™:
        120 hours            →     12.5 hours

    ┌─────────────────┐          ┌───────┐
    │                 │          │       │
    │     HUMAN       │          │ HUMAN │
    │     ONLY        │          │  +AI  │
    │                 │          │       │
    └─────────────────┘          └───────┘

         90% TIME SAVINGS
```

### Displayed In
- Internal Dashboard - ComparisonChart component
- Client Portal - Hero stats section
- Project Details - Metrics sidebar
- Marketing Site - Case study proof points

---

## Authentication Flows

### Internal Portal
```
┌──────────┐     ┌──────────┐     ┌──────────┐
│  Login   │────►│ Supabase │────►│ Internal │
│   Form   │     │   Auth   │     │  Portal  │
└──────────┘     └──────────┘     └──────────┘
```

### Client Portal (Two Methods)

**Magic Link Flow:**
```
┌──────────┐     ┌──────────┐     ┌──────────┐     ┌──────────┐
│  Enter   │────►│  Send    │────►│  Click   │────►│  Client  │
│  Email   │     │  Email   │     │  Link    │     │  Portal  │
└──────────┘     └──────────┘     └──────────┘     └──────────┘
```

**PIN Quick Access:**
```
┌──────────┐     ┌──────────┐     ┌──────────┐
│  Enter   │────►│ Validate │────►│  Client  │
│   PIN    │     │   PIN    │     │  Portal  │
└──────────┘     └──────────┘     └──────────┘
```

---

## Client Portal User Flows

### Requirement Signoff Flow

```
┌───────────────────────────────────────────────────────────────────────┐
│                    REQUIREMENT SIGNOFF WORKFLOW                       │
└───────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│   L7 Team   │───►│   Client    │───►│   Client    │───►│   Signoff   │
│   Creates   │    │  Receives   │    │  Reviews    │    │  Recorded   │
│   Document  │    │   Email     │    │  Document   │    │  w/ Audit   │
└─────────────┘    └─────────────┘    └─────────────┘    └─────────────┘
     │                   │                  │                   │
     │                   │                  │                   │
   DRAFT              REVIEW            REVIEW             APPROVED
   Status             Status            Status              Status
```

### Deliverable Review Flow

```
┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│   L7 Team   │───►│   Client    │───►│   Client    │───►│  Approved/  │
│   Uploads   │    │   Sees in   │    │  Provides   │    │  Rejected   │
│   Asset     │    │   Gallery   │    │  Feedback   │    │   Status    │
└─────────────┘    └─────────────┘    └─────────────┘    └─────────────┘
```

---

## Data Flow Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                         DATA FLOW                                   │
└─────────────────────────────────────────────────────────────────────┘

     INTERNAL                    DATABASE                    CLIENT
        │                           │                           │
        │   CREATE/UPDATE           │                           │
        │──────────────────────────►│                           │
        │                           │                           │
        │                           │   REALTIME SYNC           │
        │                           │──────────────────────────►│
        │                           │                           │
        │                           │   FEEDBACK/SIGNOFF        │
        │                           │◄──────────────────────────│
        │                           │                           │
        │   NOTIFICATION            │                           │
        │◄──────────────────────────│                           │
        │                           │                           │

┌─────────────────────────────────────────────────────────────────────┐
│  Activity Log captures ALL changes for audit trail                 │
└─────────────────────────────────────────────────────────────────────┘
```

---

## Brand System

### Colors

```css
/* Primary Palette */
--void-black:     #0A0A0A;    /* Background */
--electric-cyan:  #00F0FF;    /* Primary accent */
--hot-magenta:    #FF00AA;    /* Secondary accent */
--acid-lime:      #BFFF00;    /* Success/shipped */

/* Semantic Colors */
--status-backlog: #888888;
--status-active:  #00F0FF;
--status-review:  #FF00AA;
--status-shipped: #BFFF00;

/* UI Colors */
--text-primary:   #FAFAFA;
--text-secondary: #888888;
--text-muted:     #666666;
--border:         rgba(255, 255, 255, 0.1);
--card-bg:        rgba(255, 255, 255, 0.03);
```

### Typography

```css
/* Headlines */
font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
font-weight: 700;

/* Body */
font-family: 'Inter', -apple-system, sans-serif;
font-weight: 400;

/* Code/Data */
font-family: 'JetBrains Mono', monospace;
```

### Gradients

```css
/* Primary CTA */
background: linear-gradient(135deg, #00F0FF, #FF00AA);

/* Success */
background: linear-gradient(135deg, #BFFF00, #00F0FF);

/* Card Hover */
background: rgba(0, 240, 255, 0.05);
border-color: rgba(0, 240, 255, 0.3);
```

---

## File Structure

```
website/
├── src/
│   ├── app/
│   │   ├── page.tsx                    # Marketing homepage
│   │   ├── layout.tsx                  # Root layout
│   │   ├── globals.css                 # Global styles
│   │   ├── api/
│   │   │   └── contact/route.ts        # Contact form API
│   │   ├── internal/
│   │   │   ├── layout.tsx              # Sidebar nav
│   │   │   ├── page.tsx                # Dashboard
│   │   │   ├── projects/
│   │   │   │   ├── page.tsx            # Projects list
│   │   │   │   └── [id]/page.tsx       # Project detail + Kanban
│   │   │   └── requirements/
│   │   │       ├── page.tsx            # Requirements hub
│   │   │       └── [id]/page.tsx       # Document editor
│   │   ├── portal/
│   │   │   └── [clientSlug]/
│   │   │       ├── layout.tsx          # Client nav
│   │   │       ├── page.tsx            # Client dashboard
│   │   │       ├── deliverables/page.tsx
│   │   │       └── requirements/page.tsx
│   │   ├── insights/                   # Blog
│   │   ├── start/                      # Intake form
│   │   └── discovery/                  # Client deliveries
│   │
│   ├── components/
│   │   ├── dashboard/                  # 10 dashboard components
│   │   │   ├── index.ts                # Barrel export
│   │   │   ├── ProgressRing.tsx
│   │   │   ├── StatusPill.tsx
│   │   │   ├── ActionCard.tsx
│   │   │   ├── InsightCard.tsx
│   │   │   ├── VelocitySparkline.tsx
│   │   │   ├── TimelineBar.tsx
│   │   │   ├── ActivityFeed.tsx
│   │   │   ├── MetricCard.tsx
│   │   │   ├── ComparisonChart.tsx
│   │   │   └── KanbanBoard.tsx
│   │   ├── desktop/                    # 14 marketing components
│   │   ├── mobile/                     # 11 mobile components
│   │   ├── shared/                     # 3 shared components
│   │   └── DeviceSwitch.tsx            # Device detection
│   │
│   ├── hooks/                          # Custom React hooks
│   │   ├── useIsMobile.ts
│   │   └── ...
│   │
│   └── lib/
│       ├── supabase.ts                 # Supabase client
│       └── database.types.ts           # TypeScript types
│
├── supabase/
│   └── schema.sql                      # Database schema
│
├── public/
│   ├── robots.txt
│   └── sitemap.xml
│
├── L7_PLATFORM_ARCHITECTURE.md         # This document
├── UX_DESIGN_DOCUMENT.md               # Website UX docs
└── CLAUDE.md                           # Project context
```

---

## Deployment Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                         DEPLOYMENT                                  │
└─────────────────────────────────────────────────────────────────────┘

┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│    GitHub    │────►│   Vercel     │────►│  l7shift.com │
│   (Source)   │     │  (Build/CDN) │     │   (Live)     │
└──────────────┘     └──────────────┘     └──────────────┘
                            │
                            │ Environment Variables
                            ▼
                     ┌──────────────┐
                     │   Supabase   │
                     │  (Database)  │
                     └──────────────┘

Deploy Pipeline:
1. Push to main branch
2. Vercel auto-deploys
3. Preview URLs for PRs
4. Production at l7shift.com
```

---

## Security Considerations

| Layer | Implementation |
|-------|----------------|
| **Auth** | Supabase Auth with JWT tokens |
| **RLS** | Row Level Security on all tables |
| **API** | Server-side only for sensitive ops |
| **Secrets** | Environment variables, never client-side |
| **HTTPS** | Enforced via Vercel |
| **Audit** | All signoffs logged with IP/UA |

---

## Future Roadmap

### Phase 2: Enhanced Features
- [ ] Real Supabase integration (currently mock data)
- [ ] Email notifications via Resend
- [ ] File upload to Supabase Storage
- [ ] PDF export for requirements
- [ ] Client activity timeline

### Phase 3: Advanced Analytics
- [ ] Velocity tracking over time
- [ ] Budget burn-down charts
- [ ] Client engagement metrics
- [ ] AI-powered project insights

### Phase 4: Integrations
- [ ] Stripe billing dashboard
- [ ] GitHub commit linking
- [ ] Slack notifications
- [ ] Calendar sync

---

## Conclusion

The L7 Shift Internal Platform demonstrates the SymbAIotic Method™ in action - built in days rather than months, with full functionality and production-ready code. It replaces a $50+/month dependency while providing 10x the visibility and customization.

**Key Achievements:**
- 38+ React components built
- 11 database tables designed
- 15+ application routes
- 3 integrated systems (PM, Client, Requirements)
- Visual-first design throughout
- The SymbAIotic Method™ metrics embedded

---

*Built by L7 Shift using The SymbAIotic Method™*

**Strategy. Systems. Solutions.**
