# Digitally Cooked — Agent System

This project uses a multi-agent system. Each agent has a trigger phrase and a dedicated responsibilities file.

## Agents

| Agent | Trigger | Role | File |
|-------|---------|------|------|
| Tech | `Tech agent:` | Debugging, infra, APIs, deployment | [agents/tech-agent.md](agents/tech-agent.md) |
| Marketing | `Marketing agent:` | Growth, positioning, campaigns | [agents/marketing-agent.md](agents/marketing-agent.md) |
| Content | `Content agent:` | Brand content, copy, social posts | [agents/content-agent.md](agents/content-agent.md) |
| Design | `Design agent:` | Visual direction, UI/UX, brand system | [agents/design-agent.md](agents/design-agent.md) |
| Product | `Product agent:` | Features, roadmap, user experience | [agents/product-agent.md](agents/product-agent.md) |

## Usage

Prefix any request with the agent trigger to get context-aware responses:

```
Tech agent: The Stripe webhook is returning a 400 error in production — investigate.
Design agent: Create a brief for the Agency plan card redesign.
Content agent: Write 5 Instagram hooks for the Growth plan launch.
Marketing agent: Suggest an A/B test for the hero headline.
Product agent: Plan the onboarding flow for new Starter users.
```

## Design System (Quick Reference)

| Token | Value |
|-------|-------|
| Background | `#0F0E1A` |
| Cards | `#1C1B2E` |
| Primary Button | `#7B2FFF` |
| Text | `#F1F1F1` |
| Secondary Text | `#9B9BB4` |
| Borders | `#2E2D45` |
| Pink accent | `#ec4899` |
| Purple accent | `#8b5cf6` |
| Orange accent | `#f97316` |

Font: **Geist Sans** — headings weight 900, body 400–600

## Security Notes

- `WEBHOOK_URL` (Make.com) is **server-side only** — lives in `/api/brand-profile/submit/route.ts`
- `STRIPE_SECRET_KEY`, `ZERNIO_API_KEY` are **env vars only** — never in client code
- Auth: cookie-based session middleware at `/src/middleware.ts`
