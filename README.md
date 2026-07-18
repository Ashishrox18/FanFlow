<div align="center">

# FanFlow AI

### Generative AI Stadium Intelligence Platform · FIFA World Cup 2026

[![CI](https://github.com/Ashishrox18/FanFlow/actions/workflows/ci.yml/badge.svg)](https://github.com/Ashishrox18/FanFlow/actions/workflows/ci.yml)
[![Security Audit](https://github.com/Ashishrox18/FanFlow/actions/workflows/security.yml/badge.svg)](https://github.com/Ashishrox18/FanFlow/actions/workflows/security.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-Strict-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Next.js](https://img.shields.io/badge/Next.js-App_Router-black?logo=next.js)](https://nextjs.org/)
[![WCAG 2.2 AA](https://img.shields.io/badge/Accessibility-WCAG%202.2%20AA-green)](docs/accessibility.md)
[![Tests](https://img.shields.io/badge/Tests-273%20passing-brightgreen)](tests/)
[![Coverage](https://img.shields.io/badge/Coverage-93%25-brightgreen)](docs/testing.md)

**FanFlow AI** is a production-grade GenAI web application that enhances stadium operations and the fan experience across all **FIFA World Cup 2026** venues. It delivers AI-powered crowd management, accessible navigation, multilingual assistance, arrival planning, transport routing, and real-time emergency guidance — purpose-built for fans, organizers, volunteers, and venue staff.

[Live Demo](https://fanflow-ai.vercel.app) · [API Reference](docs/api.md) · [Architecture](docs/architecture.md) · [Testing](docs/testing.md)

</div>

---

## Table of Contents

1. [Executive Summary](#-executive-summary)
2. [Problem Statement Alignment](#-problem-statement-alignment)
3. [User Personas](#-user-personas)
4. [Feature Mapping](#-feature-mapping)
5. [AI Decision Engine](#-ai-decision-engine)
6. [Architecture](#️-architecture)
7. [Engineering Decisions](#-engineering-decisions)
8. [Security](#️-security)
9. [Testing](#-testing)
10. [Accessibility](#-accessibility-wcag-22-aa)
11. [Performance](#-performance)
12. [Repository Structure](#-repository-structure)
13. [Getting Started](#-getting-started)
14. [API Overview](#-api-overview)
15. [Future Improvements](#-future-improvements)
16. [License](#-license)

---

## 🎯 Executive Summary

FanFlow AI is the intelligent co-pilot for the **FIFA World Cup 2026** — the first World Cup spanning three countries (USA, Canada, Mexico) and 16 stadiums. Managing 80,000+ fans per match across a geographically distributed tournament requires real-time AI decision support that no static app can deliver.

FanFlow AI solves this by combining:
- **Groq (Llama 3.3 70B)** — Sub-second conversational AI for multilingual chat, emergency guidance, and FAQ
- **Google Gemini (1.5 Flash)** — Deep reasoning for multi-step arrival planning, crowd-aware navigation, and transport optimisation
- **Deterministic crowd simulation** — 30-second refresh cycle delivering real-time zone congestion data without requiring live sensor infrastructure
- **Strict Zod validation** — Every AI response is schema-validated before reaching the client, eliminating hallucination risk

The result is a platform that serves **all four target personas** (fans, organizers, volunteers, venue staff) across **all eight challenge capabilities** (navigation, crowd management, accessibility, transportation, sustainability, multilingual assistance, operational intelligence, real-time decision support).

---

## 📋 Problem Statement Alignment

**Official Challenge:** *"Build a GenAI-enabled solution that enhances stadium operations and the overall tournament experience for fans, organizers, volunteers, or venue staff. The solution must leverage Generative AI to improve navigation, crowd management, accessibility, transportation, sustainability, multilingual assistance, operational intelligence, or real-time decision support during the FIFA World Cup 2026."*

### Traceability Matrix

| # | Challenge Requirement | Implemented Feature | AI Capability | Primary Persona | Key Files | Business Value | Status |
|---|---|---|---|---|---|---|---|
| 1 | **Navigation** | AI Smart Navigation — shortest + least-crowded route with step-by-step instructions | Gemini (spatial reasoning) | Fans, Volunteers | `src/app/navigate/`, `api/ai/navigation/` | Reduces gate congestion and late-arrival incidents | ✅ Implemented |
| 2 | **Crowd Management** | Live Crowd Intelligence — 16-zone real-time congestion map per stadium | Deterministic simulation + AI interpretation | Organizers, Venue Staff | `services/crowd/`, `app/crowd/` | Enables proactive zone rebalancing | ✅ Implemented |
| 3 | **Accessibility** | Accessibility Mode — ramp/elevator-only routes, ARIA-compliant UI, WCAG 2.2 AA | Gemini (accessibility-aware routing prompt) | Fans with mobility needs | `buildNavigationSystemPrompt()`, `src/app/navigate/` | Ensures equal access for all fans | ✅ Implemented |
| 4 | **Transportation** | Transport Planner — pre-match and post-match multi-modal routing (Metro, Bus, Taxi, Walk, Ride-share) | Gemini (logistics reasoning) | Fans, Organizers | `api/ai/transport/`, `src/app/transport/` | Reduces road congestion and improves flow | ✅ Implemented |
| 5 | **Sustainability** | Green transport recommendations — AI explicitly recommends Metro/Bus as low-carbon options; eco-tip is surfaced in transport results | Gemini (prompt instructs carbon-aware mode) | Fans, Organizers | `buildTransportSystemPrompt()`, Transport UI | Reduces per-capita carbon footprint at scale | ✅ Implemented |
| 6 | **Multilingual Assistance** | 7-language AI Chat — English, Spanish, French, Portuguese, Hindi, Japanese, Arabic. All AI responses are generated in the selected language | Groq (low-latency inference) | Fans (international) | `api/ai/assistant/`, `stores/app.store.ts` | Eliminates language barriers for global fans | ✅ Implemented |
| 7 | **Operational Intelligence** | Real-time crowd snapshot API + zone-level capacity percentages, wait times, and operational status per zone | Crowd service + REST API | Venue Staff, Organizers | `api/crowd/`, `services/crowd/` | Empowers staff with actionable zone intelligence | ✅ Implemented |
| 8 | **Real-Time Decision Support** | Arrival Planner — optimal gate, arrival window, crowd forecast, and alternative routing updated based on live crowd state | Gemini (multi-factor reasoning) + crowd data | Fans, Venue Staff | `api/ai/arrival/`, `src/app/arrival/` | Prevents bottlenecks before they form | ✅ Implemented |
| 9 | **Enhance Fan Experience** | Unified matchday assistant: chat, navigate, plan arrival, get emergency help — all in one interface | Groq + Gemini dual-model | Fans | All pages + assistant | End-to-end fan journey covered | ✅ Implemented |
| 10 | **Enhance Stadium Operations** | Emergency guidance API with immediate action, step-by-step instructions, nearest exit and response time | Groq (low-latency, safety-critical) | Venue Staff, Organizers | `api/ai/emergency/` | Minimises incident response time | ✅ Implemented |
| 11 | **Support Organizers** | Multi-stadium support (6 FIFA 2026 venues), zone-level operational status visible per stadium | Constants + crowd service | Organizers | `lib/constants/index.ts` | Enables cross-stadium operational oversight | ✅ Implemented |
| 12 | **Support Volunteers** | Navigation planning usable by volunteers to direct fans; multilingual AI so volunteers can translate real-time | Groq + Gemini | Volunteers | Assistant + Navigation | Multiplies volunteer effectiveness | ✅ Implemented |
| 13 | **GenAI-enabled** | Two-model AI pipeline (Groq + Gemini) with structured JSON output, Zod validation, and complexity-based routing | Dual-model LLM routing | All personas | `services/ai/` | Production-grade GenAI integration | ✅ Implemented |

---

## 👥 User Personas

FanFlow AI explicitly serves all four personas named in the challenge:

### 🎟️ Fans
**Goal:** Navigate the stadium, find their seat, get food, communicate in their language, and exit safely.

**FanFlow capabilities:**
- Multilingual AI Chat Assistant (7 languages) for any stadium question
- AI Arrival Planner with optimal gate and time window recommendations
- AI Navigation with shortest + least-crowded route options
- Live Crowd Intelligence to choose uncongested concession/restroom areas
- Accessibility Mode for fans with mobility requirements
- Emergency guidance for medical or security situations

### 🏟️ Organizers
**Goal:** Maintain safe crowd flows, prevent bottlenecks, coordinate transport, and respond to incidents.

**FanFlow capabilities:**
- Real-time 16-zone crowd congestion data per stadium
- Capacity percentage and wait time per zone
- Zone operational status (open/closed)
- Transport congestion levels per modality
- Crowd-level forecasting to support staff deployment decisions
- Multi-stadium data across all 6 FIFA 2026 venues

### 🦺 Volunteers
**Goal:** Direct fans efficiently, answer common questions, provide multilingual support.

**FanFlow capabilities:**
- AI Chat can be used by volunteers to look up information instantly
- Navigation planner can be used to direct fans to any destination
- 7-language AI responses for real-time translation assistance
- Emergency guidance for first-responder volunteers

### 🔧 Venue Staff
**Goal:** Monitor stadium zones, respond to crowd incidents, manage operational flows.

**FanFlow capabilities:**
- Zone-level crowd data: capacity %, wait times, operational status
- Emergency AI guidance with nearest exit and response time estimates
- Live crowd snapshot API consumable by internal dashboards
- Real-time decision support via Crowd Intelligence page

---

## 🗺️ Feature Mapping

### Feature 1 — AI Arrival Planner
**Challenge capability:** Navigation, Real-Time Decision Support, Crowd Management

AI analyses the fan's current location, transport mode, and desired arrival time to recommend the optimal gate, arrival window, crowd forecast, and walking time. All responses are generated in the user's selected language.

- **Route:** `POST /api/ai/arrival`
- **Model:** Groq (via unified router)
- **Language-aware:** ✅ (prompt instructs response language)
- **Page:** `/arrival`

---

### Feature 2 — Live Crowd Intelligence
**Challenge capability:** Crowd Management, Operational Intelligence

Real-time crowd simulation producing a 16-zone snapshot for the selected stadium every 30 seconds. Each zone reports: crowd level (Low/Medium/High), capacity percentage, wait time in minutes, and operational status. Available via REST API for external consumption by staff dashboards.

- **Route:** `GET /api/crowd?stadiumId={id}`
- **Service:** `src/services/crowd/crowd.service.ts`
- **Refresh:** Every 30 seconds
- **Stadiums:** MetLife, SoFi, Azteca, BMO Field, AT&T Stadium, NRG Stadium
- **Page:** `/crowd`

---

### Feature 3 — AI Smart Navigation (with Accessibility Mode)
**Challenge capability:** Navigation, Accessibility

AI generates two routes — shortest and least-crowded — with step-by-step instructions and landmarks. When Accessibility Mode is enabled, all routes exclusively use ramps and elevators. Prompts explicitly instruct the model to avoid stairs.

- **Route:** `POST /api/ai/navigation`
- **Model:** Groq (via unified router)
- **Accessibility prompt injection:** ✅ (`buildNavigationSystemPrompt()` includes `IMPORTANT: avoid stairs`)
- **Page:** `/navigate`

---

### Feature 4 — Multilingual AI Chat Assistant
**Challenge capability:** Multilingual Assistance, Operational Intelligence

Conversational AI assistant answering any fan or staff question in their preferred language. The system prompt instructs the AI to respond in the selected language, making every response — including navigation directions, emergency instructions, and gate locations — fully localised.

- **Route:** `POST /api/ai/assistant`
- **Model:** Groq (Llama 3.3 70B — low latency)
- **Languages:** English 🇬🇧, Spanish 🇪🇸, French 🇫🇷, Portuguese 🇧🇷, Hindi 🇮🇳, Japanese 🇯🇵, Arabic 🇸🇦
- **Page:** `/assistant`

---

### Feature 5 — Transport Planner (Pre + Post Match)
**Challenge capability:** Transportation, Sustainability

AI generates a complete transport plan for before or after the match. Recommends the best transport mode (Metro, Bus, Taxi, Walking, Ride-share), estimated time and cost, step-by-step instructions, and congestion level. Metro and Bus are surfaced first as green alternatives, directly supporting sustainability goals.

- **Route:** `POST /api/ai/transport`
- **Model:** Groq (via unified router)
- **Green transport:** ✅ (Metro/Bus recommended by default where available)
- **Phases:** `before` | `after`
- **Page:** `/transport`

---

### Feature 6 — Emergency Guidance
**Challenge capability:** Real-Time Decision Support, Operational Intelligence

Immediate AI-generated emergency guidance for medical or security situations. Returns: immediate action, step-by-step instructions (up to 10 steps), emergency contact number, nearest exit, and estimated response time. Rendered in high-contrast red on the UI. Emergency endpoints have a 3× higher rate limit (90 requests/min vs 30) to never block safety-critical calls.

- **Route:** `POST /api/ai/emergency`
- **Model:** Groq (forced — fastest model for safety-critical latency)
- **Rate limit:** 90 req/min (3× standard)
- **Types:** Medical, Security, Fire, Evacuation, Lost Person
- **Page:** `/emergency`

---

## 🤖 AI Decision Engine

FanFlow AI uses a two-model pipeline with deterministic routing:

```
User Request
     │
     ▼
┌────────────────────────────────────────────┐
│           Input Validation (Zod)           │
│   - Schema check                           │
│   - Input sanitisation (XSS prevention)   │
│   - Rate limit check                       │
└────────────────────┬───────────────────────┘
                     │
                     ▼
┌────────────────────────────────────────────┐
│         Complexity Classification          │
│   classifyQuery() → "simple" | "complex"   │
│   Keywords: plan, route, navigate,         │
│   transport, arrival, schedule, emergency  │
└──────────┬─────────────────────┬───────────┘
           │                     │
     simple│               complex│
           ▼                     ▼
  ┌────────────────┐   ┌──────────────────────┐
  │   Groq         │   │   Google Gemini       │
  │ Llama 3.3 70B  │   │   Gemini 1.5 Flash    │
  │                │   │                      │
  │ Use cases:     │   │ Use cases:            │
  │ · Chat FAQ     │   │ · Arrival planning    │
  │ · Emergency    │   │ · Navigation routes   │
  │ · Multilingual │   │ · Transport routing   │
  └───────┬────────┘   └──────────┬───────────┘
          │                       │
          └──────────┬────────────┘
                     ▼
        ┌────────────────────────┐
        │   Structured JSON      │
        │   (enforced via        │
        │   system prompt)       │
        └────────────┬───────────┘
                     ▼
        ┌────────────────────────┐
        │   Zod Schema           │
        │   Validation           │
        │   (6 response schemas) │
        └────────────┬───────────┘
                     ▼
        ┌────────────────────────┐
        │   Business Logic /     │
        │   API Response         │
        └────────────────────────┘
```

### Why Groq?
Groq's LPU (Language Processing Unit) architecture delivers **sub-200ms inference** on Llama 3.3 70B. This is critical for:
- Emergency guidance (safety-critical — every second counts)
- Multilingual chat (conversational — users expect instant responses)

### Why Gemini?
Google Gemini 1.5 Flash excels at **multi-step spatial and logistical reasoning**. This is critical for:
- Arrival planning (integrates location + time + crowd + transport variables)
- Navigation routing (generates coherent step-by-step spatial instructions)
- Transport optimisation (multi-modal route comparison)

### Structured Output Strategy
All prompts instruct the model with an explicit JSON schema. The system prompt always contains:
> "You must ONLY return valid JSON matching this exact schema. Never add markdown, code blocks, or free text outside JSON."

This makes outputs deterministic and parseable without regex stripping.

### Zod Validation
Every AI response is validated by a typed Zod schema **before reaching the client**. If validation fails, the API returns `502 AI_VALIDATION_ERROR` rather than silently passing malformed data.

**6 response schemas:** `AssistantResponseSchema`, `ArrivalPlanSchema`, `NavigationPlanSchema`, `TransportPlanSchema`, `EmergencyResponseSchema`, `CrowdSnapshotSchema`

### Timeout & Error Strategy
- **15-second timeout** per AI request (configurable via `AI_TIMEOUT_MS`)
- `AITimeoutError` on abort → HTTP 504
- `AIValidationError` on schema mismatch → HTTP 502
- `AIError` on SDK failure → HTTP 502
- `ValidationError` on bad input → HTTP 400
- `RateLimitError` on abuse → HTTP 429

---

## 🏗️ Architecture

### System Overview

```
Browser (Next.js Client)
  │
  ├── Zustand Store (app.store, chat.store)
  ├── React Hooks (useAssistant, useCrowd, useDebounce)
  └── UI Pages (/, /arrival, /crowd, /navigate, /assistant, /transport, /emergency)
          │
          │ (fetch)
          ▼
Next.js App Router (Server)
  │
  ├── /api/ai/assistant   → Groq → AssistantResponseSchema
  ├── /api/ai/arrival     → Groq/Gemini → ArrivalPlanSchema
  ├── /api/ai/navigation  → Groq/Gemini → NavigationPlanSchema
  ├── /api/ai/transport   → Groq/Gemini → TransportPlanSchema
  ├── /api/ai/emergency   → Groq (forced) → EmergencyResponseSchema
  └── /api/crowd          → CrowdService → CrowdSnapshotSchema
          │
          ├── services/ai/router.service.ts  (complexity routing)
          ├── services/ai/groq.service.ts    (Groq client)
          ├── services/ai/gemini.service.ts  (Gemini client)
          └── services/crowd/crowd.service.ts (simulation engine)
```

### Tech Stack

| Layer | Technology | Rationale |
|---|---|---|
| Framework | Next.js (App Router) | SSR + API routes in one project |
| Language | TypeScript (strict) | Zero `any`, full type safety |
| Styling | Tailwind CSS | Utility-first, design tokens |
| Animations | Framer Motion | Micro-animations, motion preferences |
| State | Zustand (persisted) | Lightweight, no provider boilerplate |
| Validation | Zod | Runtime schema enforcement for AI outputs |
| AI (fast) | Groq / Llama 3.3 70B | Sub-200ms inference |
| AI (deep) | Google Gemini 1.5 Flash | Multi-step planning and reasoning |
| Testing | Vitest + Jest-Axe + Playwright | Unit, component, integration, E2E, a11y |

### Supported Stadiums (FIFA 2026)

| Stadium | City | Country | Capacity |
|---|---|---|---|
| MetLife Stadium | East Rutherford | USA | 82,500 |
| SoFi Stadium | Inglewood | USA | 70,240 |
| Estadio Azteca | Mexico City | Mexico | 87,523 |
| BMO Field | Toronto | Canada | 30,991 |
| AT&T Stadium | Arlington | USA | 80,000 |
| NRG Stadium | Houston | USA | 72,220 |

---

## ⚙️ Engineering Decisions

| Decision | Rationale |
|---|---|
| **Dual-model AI** | Groq for latency-critical paths (chat, emergency), Gemini for reasoning-heavy tasks (planning, routing) |
| **Forced JSON system prompts** | Eliminates markdown stripping, makes outputs deterministic without regex |
| **Zod at API boundary** | AI can hallucinate; Zod ensures only schema-valid data reaches the client |
| **`useShallow` on Zustand derived selectors** | Prevents infinite render loops from `slice()`/`filter()` returning new array references |
| **Deterministic crowd simulation** | `getTimeSeed()` seeds the PRNG with wall-clock hour, making refreshes smooth and reproducible in tests |
| **15s AI timeout with `AbortController`** | Prevents hanging requests; surfaces `AITimeoutError` to the UI gracefully |
| **3× rate limit for emergency** | Safety-critical endpoints must never be blocked by standard rate limits |
| **App Router over Pages** | RSC enables per-route streaming; `force-dynamic` on AI routes ensures no stale cached AI responses |
| **Barrel exports** | `src/components/index.ts`, `src/hooks/index.ts`, `src/stores/index.ts` improve DX and tree-shaking |

---

## 🛡️ Security

| Control | Implementation |
|---|---|
| **API key isolation** | All AI calls happen server-side via Route Handlers. Zero keys exposed to the browser |
| **Input sanitisation** | `sanitiseInput()` strips HTML tags before every AI prompt to prevent prompt injection |
| **Zod validation** | Every request body validated before processing; every AI response validated before returning |
| **Rate limiting** | In-memory sliding window: 30 req/min standard, 90 req/min emergency |
| **Security headers** | `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`, strict CSP, HSTS |
| **No client API exposure** | `GROQ_API_KEY` and `GEMINI_API_KEY` are never sent to the browser |
| **CORS** | Defaults to same-origin; API routes reject cross-origin requests |

See [docs/security.md](docs/security.md) for full details.

---

## 🧪 Testing

### Metrics

| Metric | Result |
|---|---|
| Test files | 21 |
| Total tests | **273 passing** |
| TypeScript errors | **0** |
| ESLint errors / warnings | **0 / 0** |
| Statement coverage | **93.54%** |
| Function coverage | **97.87%** |
| Line coverage | **94.46%** |
| `lib/*` / `stores/*` / `components/*` | **100%** |

### Running Tests

```bash
# All tests with coverage
npm run test:coverage

# Unit and integration tests only
npm run test

# End-to-End (Playwright)
npm run test:e2e

# Type checking
npm run typecheck

# Linting
npm run lint
```

### Test Coverage by Layer

| Layer | Files | What is Tested |
|---|---|---|
| Unit | 9 | Error classes, AI router, Zod validators, crowd service, Zustand stores, useDebounce, AI JSON parsing, Groq service, Gemini service |
| Component | 3 | CrowdBadge (ARIA, axe), MessageBubble (layout, a11y), Skeleton (all 3 variants) |
| Integration | 6 | All 6 API routes — validation, success, method rejection, mocked AI |
| Accessibility | 1 | CrowdBadge and SkipNav via jest-axe |

See [docs/testing.md](docs/testing.md) for full strategy.

---

## ♿ Accessibility (WCAG 2.2 AA)

| Requirement | Implementation |
|---|---|
| **Keyboard navigation** | Full tab order; `SkipNav` link targets `#main-content` |
| **Screen reader support** | `role`, `aria-label`, `aria-live`, `aria-busy`, `aria-pressed` on all interactive elements |
| **Colour contrast** | Dark and light modes designed to ≥4.5:1 contrast ratio |
| **Reduced motion** | `prefers-reduced-motion` respected via CSS and Framer Motion config |
| **Focus indicators** | Visible `focus-visible:ring-2` on all interactive elements |
| **Semantic HTML** | `<main>`, `<nav>`, `<header>`, `<footer>`, `<section>`, single `<h1>` per page |
| **Accessibility Mode (AI)** | Navigation AI explicitly avoids stairs when Accessibility Mode is enabled |
| **Error messages** | All validation errors are associated with their input field via `aria-describedby` |
| **Automated testing** | jest-axe runs on CrowdBadge, SkipNav, Skeleton, MessageBubble |

See [docs/accessibility.md](docs/accessibility.md) for full details.

---

## ⚡ Performance

| Optimisation | Detail |
|---|---|
| **AI timeout** | 15-second hard cap with `AbortController` |
| **Crowd data caching** | `Cache-Control: no-store` on `/api/crowd` — always fresh; client-side 30s interval |
| **Lazy loading** | Page components loaded on demand via Next.js route splitting |
| **Framer Motion** | Respects `prefers-reduced-motion`; animations disabled when system preference is set |
| **Zustand persistence** | Stadium selection persists across sessions; no redundant fetches on revisit |
| **AI response streaming** | Not yet implemented — future improvement (see below) |

---

## 📂 Repository Structure

```
fifaman/
├── .github/
│   ├── workflows/
│   │   ├── ci.yml              # 4-stage CI: quality → tests → build → E2E
│   │   └── security.yml        # Dependency audit
│   └── ISSUE_TEMPLATE/         # Bug and feature request templates
├── docs/
│   ├── architecture.md         # System design and data flow
│   ├── api.md                  # All 6 REST endpoints with schemas
│   ├── testing.md              # Test strategy and commands
│   ├── security.md             # Security controls
│   ├── accessibility.md        # WCAG 2.2 AA coverage
│   ├── performance.md          # Performance optimisations
│   ├── deployment.md           # Vercel deployment guide
│   ├── engineering.md          # Dev standards
│   └── prompt-alignment.md     # AI alignment documentation
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── ai/
│   │   │   │   ├── assistant/route.ts   # Multilingual chat
│   │   │   │   ├── arrival/route.ts     # Arrival planning
│   │   │   │   ├── navigation/route.ts  # Route planning
│   │   │   │   ├── transport/route.ts   # Transport planning
│   │   │   │   └── emergency/route.ts   # Emergency guidance
│   │   │   └── crowd/route.ts           # Crowd intelligence
│   │   ├── arrival/page.tsx
│   │   ├── assistant/page.tsx
│   │   ├── crowd/page.tsx
│   │   ├── emergency/page.tsx
│   │   ├── navigate/page.tsx
│   │   └── transport/page.tsx
│   ├── components/
│   │   ├── chat/MessageBubble.tsx
│   │   ├── crowd/CrowdBadge.tsx
│   │   ├── crowd/CrowdCard.tsx
│   │   ├── layout/Header.tsx
│   │   ├── layout/Footer.tsx
│   │   ├── layout/SkipNav.tsx
│   │   ├── navigation/RouteStepList.tsx
│   │   └── ui/Skeleton.tsx
│   ├── features/
│   │   └── landing/            # Hero, FeatureGrid, StadiumSelector
│   ├── hooks/
│   │   ├── useAssistant.ts     # Chat state management
│   │   ├── useCrowd.ts         # Crowd data polling
│   │   └── useDebounce.ts      # Input debouncing
│   ├── lib/
│   │   ├── constants/          # Stadiums, languages, transport modes
│   │   ├── errors/             # Typed error classes
│   │   ├── utils/              # sanitiseInput, getTimeSeed, formatTime
│   │   └── validators/         # 10 Zod schemas (6 request + 6 response)
│   ├── services/
│   │   ├── ai/
│   │   │   ├── router.service.ts    # Complexity routing + system prompts
│   │   │   ├── groq.service.ts      # Groq client + JSON parsing
│   │   │   └── gemini.service.ts    # Gemini client + JSON parsing
│   │   └── crowd/crowd.service.ts   # Deterministic simulation engine
│   ├── stores/
│   │   ├── app.store.ts        # Stadium selection, language, accessibility
│   │   └── chat.store.ts       # Message history, loading state
│   └── types/index.ts          # All shared TypeScript types
├── tests/
│   ├── accessibility/          # jest-axe component tests
│   ├── components/             # CrowdBadge, MessageBubble, Skeleton
│   ├── integration/            # All 6 API routes (mocked AI)
│   └── unit/                   # Errors, router, validators, stores, services
├── CHANGELOG.md
├── CONTRIBUTING.md
├── SECURITY.md
└── CODE_OF_CONDUCT.md
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js 20+
- Groq API Key ([get one free](https://console.groq.com))
- Google Gemini API Key ([get one free](https://aistudio.google.com))

### Installation

```bash
# Clone
git clone https://github.com/Ashishrox18/FanFlow.git
cd FanFlow

# Install dependencies
npm install

# Configure environment
cp .env.example .env.local
# Edit .env.local and add your API keys:
# GROQ_API_KEY=gsk_...
# GEMINI_API_KEY=AIza...

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Environment Variables

| Variable | Required | Description |
|---|---|---|
| `GROQ_API_KEY` | ✅ | Groq API key for Llama 3.3 70B |
| `GEMINI_API_KEY` | ✅ | Google Gemini API key |
| `NEXT_PUBLIC_APP_URL` | Optional | Public URL for production |

---

## 🔌 API Overview

All endpoints require `Content-Type: application/json`. All responses follow:
```json
{ "success": true, "data": { ... } }
// or
{ "success": false, "error": "message", "code": "ERROR_CODE" }
```

| Endpoint | Method | Capability |
|---|---|---|
| `/api/ai/assistant` | POST | Multilingual Chat — general Q&A, navigation, emergency |
| `/api/ai/arrival` | POST | Arrival planning — optimal gate, window, crowd forecast |
| `/api/ai/navigation` | POST | Route planning — shortest + least-crowded with accessibility mode |
| `/api/ai/transport` | POST | Transport planning — pre/post match multi-modal routing |
| `/api/ai/emergency` | POST | Emergency guidance — immediate action, steps, nearest exit |
| `/api/crowd` | GET | Crowd snapshot — 16-zone real-time congestion per stadium |

Full request/response schemas: [docs/api.md](docs/api.md)

---

## 🔭 Future Improvements

These are real improvements that would further increase alignment — not implemented to avoid feature bloat:

| Improvement | Challenge Capability |
|---|---|
| Live IoT sensor integration (replace simulation with real sensors) | Crowd Management, Operational Intelligence |
| AI response streaming via `ReadableStream` | Real-Time Decision Support |
| Push notifications for zone congestion alerts | Operational Intelligence |
| Volunteer-specific dashboard with zone assignment view | Volunteers persona |
| Carbon footprint calculator per transport choice | Sustainability |
| Offline mode with service worker for poor connectivity | Fan Experience |
| Voice input/output for accessibility | Accessibility |

---

## 📄 License

MIT License — Copyright (c) 2026 FanFlow AI. See [LICENSE](LICENSE) for details.

---

<div align="center">

Built for **Google PromptWars** · FIFA World Cup 2026 · Powered by Groq × Google Gemini

</div>
