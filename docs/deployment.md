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

- **Node.js runtime**: Backend services run on standard Node.js serverless runtimes.
- **Cache-Control Headers**: Cache headers on dynamic API routes (like `/api/crowd`) prevent stale CDNs from serving outdated logistics updates.

## Vercel Deployment Steps

Vercel automatically detects Next.js configurations. Follow these steps to complete the deployment:

1. **Create/Select Project**: Import your repository in the Vercel Dashboard.
2. **Framework Preset**: Vercel will automatically select **Next.js**. Keep the default settings:
   - Build Command: `next build`
   - Output Directory: `.next`
   - Install Command: `npm install`
3. **Environment Variables**: Add the following Environment Variables in the Project Settings -> Environment Variables tab:
   - `GROQ_API_KEY`: Your Groq console API key (`gsk_...`)
   - `GEMINI_API_KEY`: Your Google AI Studio API key (`AIzaSy...`)
   - `NEXT_PUBLIC_APP_URL`: Set to your production domain (e.g., `https://your-app-name.vercel.app`)
4. **Deploy**: Click the **Deploy** button. Vercel will build the application, execute route verification, and deploy serverless functions for all dynamic API endpoints.

