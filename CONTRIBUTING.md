# Contributing to FanFlow AI

Thank you for your interest in contributing to FanFlow AI! To maintain our strict standards of code quality, security, and accessibility, please follow these guidelines:

## Code Quality Standards

- All code must be written in strict TypeScript.
- No `any` type is allowed. Explicitly define all return types and parameters.
- Provide JSDocs for all exported functions and classes.
- Ensure all API endpoints validate input/output payloads with Zod schemas.

## Testing Checklist

- Every feature must be accompanied by unit tests.
- We target above 95% test coverage.
- End-to-End tests using Playwright must be added/updated for UI workflow changes.
- Run `npm run test:coverage` and `npm run typecheck` locally before submitting a PR.

## Pull Request Process

1. Create a descriptive feature branch from `main`.
2. Follow the PR template format.
3. Ensure CI passes successfully.
4. Obtain approval from at least one reviewer.
