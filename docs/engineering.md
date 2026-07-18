# Engineering Standards

This document outlines the coding style, patterns, and quality requirements for FanFlow AI.

## Coding Style & Patterns

- **Functional React Components**: All components are structured as functional components using Tailwind CSS for clean layout styles.
- **Zustand State Isolation**: Component state should remain local where possible. Shared global variables (such as user settings) must reside in custom Zustand stores with dedicated actions.
- **TypeScript strictness**: Avoid using `any`. Explicitly annotate return types for services, hooks, and API Route Handlers.
- **JSDoc Annotation**: Every exported function, utility, hook, and service must have descriptive JSDoc headers detailing parameters, return types, and descriptions.

## Error Handling Pattern

Every Route Handler utilizes our unified error utility `toApiError` to map internal exceptions to standard JSON error payloads containing appropriate HTTP status codes:

- **ValidationError**: Triggers a `400 Bad Request` with Zod validation details.
- **RateLimitError**: Triggers a `429 Too Many Requests` with a `Retry-After` header.
- **NotFoundError**: Triggers a `404 Not Found`.
- **Unhandled exceptions**: Caught safely and returned as a generic `500 Internal Server Error` without leaking stack traces.
