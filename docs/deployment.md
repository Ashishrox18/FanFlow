# Deployment & CI Guide

FanFlow AI is container-ready and prepared for automated deployments.

## Local Building & Serving

To verify the production build locally:

```bash
# Build the production Next.js bundle
npm run build

# Start the Node.js production server
npm run start
```

## GitHub Actions CI Workflow

The `.github/workflows/ci.yml` pipeline automatically triggers on pushes or pull requests to `main`:

```yaml
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
      - run: npm ci
      - run: npm run typecheck
      - run: npm run lint
      - run: npm run test:coverage
      - run: npm run build
```

## Production Hosting

FanFlow AI is optimized for cloud deployment using Vercel or standard Docker containers.

- **Node.js runtime**: Backend services run on standard Node.js serverless or edge runtimes.
- **Cache-Control Headers**: Cache headers on dynamic API routes (like `/api/crowd`) prevent stale CDNs from serving outdated logistics updates.
