# Performance Optimization

FanFlow AI implements several engineering techniques to maintain high performance and responsiveness, even in high-density stadium environments.

## 1. Turbopack Build System
We use Next.js's native Turbopack compiler (`next dev`) for super-fast dev compilation and HMR (Hot Module Replacement), reducing cycle times.

## 2. API Response Minimization
Our Zod schemas enforce minimal payload sizes. AI routing responses return only structured fields required by the UI (e.g. step numbers and instruction strings), preventing large payload sizes over mobile networks.

## 3. Client-Side State & Caching
- **Zustand Persistence**: Global state (like selected stadium data and user preferences) is stored locally using `localStorage` caching, preventing unnecessary initial fetches.
- **Next.js Router Cache**: Next.js route prefetching automatically preloads resources, ensuring page transitions are instantaneous.

## 4. Micro-animations & Skeleton Placeholders
To prevent Cumulative Layout Shift (CLS), loading skeletons are rendered while AI requests are in-flight. Skeletons replicate the exact aspect ratios of final cards, keeping layout shifts at 0.
