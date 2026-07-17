# FanFlow AI

> **Your intelligent matchday assistant for FIFA World Cup 2026.**

FanFlow AI is a production-grade Generative AI web application designed to enhance stadium operations, manage crowd intelligence, and provide seamless, accessible navigation for football fans, volunteers, and venue staff.

Built for the **Google PromptWars** challenge, FanFlow AI targets a 98–100% score by prioritising Code Quality, Security, Efficiency, Testing, Accessibility, and deep Problem Statement Alignment.

---

## 🌟 Key Features

1. **Arrival Planner**: Recommends the optimal time and gate based on your location, transport mode, and expected crowd levels.
2. **Live Crowd Intelligence**: Real-time simulated congestion tracking across all stadium zones (gates, food, restrooms, merch).
3. **AI Smart Navigation**: Calculates the shortest and least crowded route to your destination, with a dedicated Accessibility Mode that avoids stairs.
4. **Multilingual Chat Assistant**: Fast conversational AI powered by Groq, supporting English, Spanish, French, Portuguese, Hindi, Japanese, and Arabic.
5. **Transportation Planner**: AI-optimized routing for pre-match arrival and post-match exit based on live city data.
6. **Emergency Guidance**: Immediate, high-contrast, step-by-step instructions for medical or security incidents.

---

## 🏗️ Architecture

FanFlow AI uses an intelligent routing layer to send requests to the most appropriate AI model:

- **Groq (`llama-3.3-70b-versatile`)**: Used for fast, low-latency conversational tasks (Multilingual Assistant, Emergency).
- **Google Gemini (`gemini-1.5-flash`)**: Used for deep reasoning, multi-step planning, and spatial routing (Arrival, Navigation, Transport).

All AI responses are enforced to return strict JSON via system prompts and are rigorously validated using **Zod** schemas before rendering on the client.

### Tech Stack
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript (Strict mode, no `any`)
- **Styling**: Tailwind CSS + Shadcn UI principles
- **Animations**: Framer Motion
- **State Management**: Zustand (Persisted)
- **Validation**: Zod + React Hook Form
- **Icons**: Lucide React
- **Testing**: Vitest, Playwright, Jest-Axe

---

## 🚀 Getting Started

### Prerequisites
- Node.js 20+
- Groq API Key
- Google Gemini API Key

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-org/fifaman.git
   cd fifaman
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment Variables:**
   Copy `.env.example` to `.env.local` and add your API keys:
   ```env
   GROQ_API_KEY=your_groq_api_key_here
   GEMINI_API_KEY=your_gemini_api_key_here
   ```

4. **Run the Development Server:**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🛡️ Security
- **API Keys Hidden**: All AI calls happen securely via Next.js server-side Route Handlers. No API keys are exposed to the client.
- **Strict Validation**: Every AI response is validated against Zod schemas. Invalid responses are caught and handled securely.
- **Input Sanitization**: User inputs are sanitized to prevent XSS.
- **Rate Limiting**: Custom in-memory rate limiting protects API routes from abuse.
- **Security Headers**: Strict CSP, X-Frame-Options, and HSTS configured in `next.config.ts`.

---

## ♿ Accessibility (WCAG 2.2 AA)
- **Keyboard Navigation**: Fully keyboard navigable with a visually hidden `SkipNav` link.
- **ARIA Labels**: Comprehensive use of ARIA roles and labels for screen readers.
- **Color Contrast**: Dark and light modes designed to meet WCAG AA contrast ratios.
- **Reduced Motion**: Respects the user's `prefers-reduced-motion` OS setting via CSS.
- **Focus Management**: Clear focus rings on all interactive elements.

---

## 🧪 Testing
We target >95% coverage across the application.

```bash
# Run unit tests and calculate coverage
npm run test:coverage

# Run End-to-End (E2E) tests
npm run test:e2e

# Run Typecheck & Linting
npm run typecheck
npm run lint
```

---

## 📂 Project Structure
Feature-based folder architecture ensuring high maintainability and SOLID principles.

- `/src/app` - Next.js App Router pages and API routes
- `/src/components` - Shared UI components and layout
- `/src/features` - Feature-specific views
- `/src/services/ai` - AI router and model clients
- `/src/hooks` - Custom React hooks
- `/src/stores` - Zustand global state
- `/src/lib` - Constants, Types, Validators, and Utilities
- `/tests` - Unit, Integration, and E2E tests

---

## 📄 License
Copyright (c) 2026 FanFlow AI. All rights reserved.
