# Testing Documentation

Our repository uses a comprehensive test suite to maintain high reliability and prevent regression.

## Test Types

1. **Unit Tests (Vitest)**: Tests validation logic, core utility functions, deterministic crowd generators, and rate limiters under `tests/unit/`.
2. **Accessibility Tests (Jest-Axe)**: Runs WCAG compliance checks on components and pages under `tests/accessibility/`.
3. **End-to-End Tests (Playwright)**: Automates multi-page user journeys (Stadium Selection -> Route Generation -> Chat interaction) under `tests/e2e/`.

## Running the Tests

To run the full test suite locally:

```bash
# Run unit and accessibility tests
npm run test

# Run unit tests and calculate coverage
npm run test:coverage

# Run Playwright E2E browser tests
npm run test:e2e
```

## CI/CD Pipeline Integration

Our GitHub Action (`.github/workflows/ci.yml`) runs on every push and pull request to the `main` branch:

1. **Typecheck**: Verifies strict TypeScript compilation via `tsc --noEmit`.
2. **Lint**: Inspects code formatting and syntax style via `next lint`.
3. **Vitest**: Runs the unit test suite and validates code coverage against our thresholds.
4. **Build**: Builds the production bundle (`npm run build`) to ensure build stability.
