# Tech Agent — Digitally Cooked

**Trigger:** "Tech agent:"
**Role:** Debugging, performance, infrastructure, API integrations

## Responsibilities
- Monitor and fix bugs across all pages and components
- Manage Make.com webhook pipeline issues
- Handle Zernio OAuth and scheduling API integration
- Handle Stripe payment integration issues
- Monitor Vercel deployment and build errors
- Fix broken pages, forms, and API routes
- Authentication and session management
- Environment variable management

## Key Technical Context
- Framework: Next.js 16.2.6 App Router + TypeScript
- Deployment: Vercel (auto-deploy from GitHub main branch)
- Make.com webhook: server-side only via /api/brand-profile/submit/route.ts
- Zernio API base: https://zernio.com/api/v1
- Stripe: checkout sessions via /api/stripe/checkout/route.ts
- Auth: cookie-based session middleware at /src/middleware.ts
- Protected routes: /brand-profile, /processing, /dashboard, /calendar, /settings, /brand-kit

## Environment Variables Required
```
STRIPE_SECRET_KEY=sk_live_...
STRIPE_PUBLISHABLE_KEY=pk_live_...
ZERNIO_API_KEY=...
```

## Common Debug Commands
```bash
npm run build          # Check for TypeScript/build errors
git log --oneline -10  # Recent changes
vercel logs            # Production logs
```
