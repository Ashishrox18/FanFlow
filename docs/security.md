# Security Implementation

FanFlow AI enforces multiple security layers protecting the client UI and the server infrastructure.

## 1. Environment Variable Protection

All AI models are queried securely from Next.js server Route Handlers (`/api/ai/*`). API keys (`GROQ_API_KEY`, `GEMINI_API_KEY`) are kept on the server environment. The client codebase contains absolutely no hardcoded API keys.

## 2. HTTP Security Headers

Configured in `next.config.ts` to attach standard protection headers on all responses:

- **Content-Security-Policy (CSP)**: RESTRICTS script execution to the origin domain and secure CDNs.
- **X-Frame-Options**: Prevents Clickjacking attacks by setting `DENY`.
- **Referrer-Policy**: Restricts referrer exposure to `strict-origin-when-cross-origin`.
- **Permissions-Policy**: Restricts access to device sensors and features.

## 3. Input Sanitization & Schema Validation

- Custom input sanitization function (`sanitiseInput`) strips HTML, scripts, and potential XSS payloads.
- Every API endpoint validates the incoming request payload with a **Zod** schema. Any malformed or unauthorized parameters are rejected with a HTTP 400 Validation Error.

## 4. Rate Limiting

API routes are protected from denial-of-service and credential stuffing attacks by a custom, sliding-window in-memory rate limiter (`checkRateLimit`). Critical routes like the Emergency Assistant get increased limits, while normal routes are limited to a standard request threshold.
