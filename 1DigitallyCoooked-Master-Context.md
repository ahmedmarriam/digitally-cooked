# DIGITALLY COOKED — MASTER PROJECT CONTEXT
> Paste this entire document at the start of any new chat to resume work instantly.
> Last updated: May 28, 2026 (evening session)

---

## WHO I AM
- Name: Marriam Ahmed
- Email: ahmed.marriam@gmail.com
- I run 3 businesses: mindset/leadership coaching, a digital marketing agency, and a podcast "Ab Next Kya?"
- I am building Digitally Cooked as a SaaS product

---

## WHAT DIGITALLY COOKED IS
An AI-powered social media content generation SaaS. Businesses paste their website URL or fill out a brand profile form and the platform automatically generates a complete 40-post monthly content package tailored to that business — then auto-posts it across platforms.

**Tagline:** "Your Complete Social Media Department. Automated."
**Subheadline:** "We write it. We design it. We schedule it. We post it. You just show up."

**The full value proposition:**
- 40 platform-specific posts generated in under 5 minutes
- Every post includes: hook, caption, CTA, hashtags, AI image prompt
- Posts auto-scheduled and published via Zernio
- Analytics dashboard shows what's working
- Website URL scanner auto-fills brand profile in seconds
- Captions generated in user's chosen language (20 languages supported)
- AI engagement score (1-10) on every post
- Replaces a $2,000/month social media manager for $49/month

---

## LIVE LINKS
- **Website:** https://digitally-cooked.vercel.app
- **Domain:** digitallycooked.com
- **App subdomain (planned):** app.digitallycooked.com
- **Email:** hello@digitallycooked.com
- **Make.com Webhook:** https://hook.us2.make.com/aba6mfll6svmbqt1zdxrya28p6t4ac1d
- **Lemon Squeezy store:** https://digitally-cooked.lemonsqueezy.com

---

## TECH STACK
| Layer | Tool |
|-------|------|
| Frontend | Next.js 16 App Router + TypeScript, deployed on Vercel |
| Automation Pipeline | Make.com Pro ($16/month) |
| AI Content Generation | Claude API (claude-sonnet-4-6, max_tokens 8000) |
| AI Image Generation | Ideogram API ($0.03/image) |
| Auto-Posting + Analytics | Zernio API (posts to 15 platforms) |
| Payments | Lemon Squeezy (replaced Stripe — works in Pakistan) |
| Database | Supabase (Postgres) |
| Auth | Cookie-based session (httpOnly, 7-day expiry) |
| 3D Animations | Three.js + GSAP ScrollTrigger (to be built) |
| Programmatic Video | Remotion (Phase 2) |

**NOT using:** Stripe (doesn't work in Pakistan), Bubble.io, Relevance AI, Placid, Creatify, QMe (website scanner covers this)

---

## MAKE.COM PIPELINE
Flow: User submits brand profile → Make.com webhook → Claude API generates 40 posts → Ideogram generates images → HTTP module POSTs to /api/posts/receive → saved to Supabase → user sees posts on dashboard

**Posts receive endpoint:** `POST https://digitallycooked.com/api/posts/receive`
**Header required:** `x-dc-secret: dc_make_secret_2026`
**Key file:** `outputs/claude_module_body.json` — the Claude API call body

**PENDING:** Final HTTP module still needs to be added to Make.com scenario (doing this when Ideogram credits reset)

**Post format:**
```
---POST [NUMBER]---
DAY: [1-30 or BONUS]
PLATFORM: [platform]
FORMAT: [Reel/Carousel/Static Post/Story/Video]
PILLAR: [pillar]
HOOK: [max 10 words, all caps]
CAPTION: [2-3 sentences, brand-specific, in {caption_language}]
CTA: [specific action]
HASHTAGS: [5-7 niche tags]
IMAGE PROMPT: [detailed Ideogram prompt]
---END POST [NUMBER]---
```
Posts 1-30 = calendar posts. Posts 31-40 = BONUS (5 Stories + 5 alternates)

---

## PRICING — LEMON SQUEEZY
| Plan | Monthly | Yearly | Trial |
|------|---------|--------|-------|
| Starter | $49/mo | $490/yr (save $98) | 7 days |
| Growth | $99/mo | $990/yr (save $198) | 7 days |
| Agency | $249/mo | $2,490/yr (save $498) | None |

**Lemon Squeezy checkout URLs:**
| Plan | Billing | URL |
|------|---------|-----|
| Starter | Monthly | https://digitally-cooked.lemonsqueezy.com/checkout/buy/13f5219a-fa8e-4a8c-81dd-3883794e92cf |
| Starter | Yearly | https://digitally-cooked.lemonsqueezy.com/checkout/buy/9e93b8f2-e457-485e-95e3-fb193805eb2d |
| Growth | Monthly | https://digitally-cooked.lemonsqueezy.com/checkout/buy/fc446352-aa44-4d7f-a51c-2b4dc437f80d |
| Growth | Yearly | https://digitally-cooked.lemonsqueezy.com/checkout/buy/c18c91ff-ea4f-4478-9a13-58a771ea8627 |
| Agency | Monthly | https://digitally-cooked.lemonsqueezy.com/checkout/buy/e2d78a8e-6e14-4eb0-a52a-5288606f5272 |
| Agency | Yearly | https://digitally-cooked.lemonsqueezy.com/checkout/buy/5c7ca6c0-8fa7-4e99-a7a9-31402d949d34 |

After payment → redirect to https://digitallycooked.com/signup

---

## PLATFORM ACCURACY — IMPORTANT
- **Content generated for:** Instagram, TikTok, Facebook, LinkedIn, YouTube (5 platforms only)
- **Auto-posting via Zernio:** Up to 15 platforms
- Do NOT claim content is tailored for more than 5 platforms

---

## COST STRUCTURE
- Claude API: ~$0.16/run
- Ideogram: $0.03 × 40 = $1.20/run
- **Total variable: ~$1.36/run**
- Fixed monthly: Make.com $16/month
- Lemon Squeezy fee: 5% + $0.50 per transaction

---

## DATABASE — SUPABASE
- **Project URL:** https://kpeqmspyniohroxubwkf.supabase.co
- **Tables:** users, brands, posts
- **RLS:** Disabled for MVP (enable before scaling)
- **Schema file:** `supabase-schema.sql` in project root
- **Setup guide:** `SUPABASE-SETUP.md` in project root

**Environment variables (in Vercel + .env.local):**
- NEXT_PUBLIC_SUPABASE_URL
- NEXT_PUBLIC_SUPABASE_ANON_KEY
- SUPABASE_SERVICE_KEY
- POSTS_RECEIVE_SECRET=dc_make_secret_2026
- ANTHROPIC_API_KEY (for website URL scanner)

---

## BRAND COLORS
| Color | Hex | Use |
|-------|-----|-----|
| Background | #0F0E1A | Page background |
| Card | #1C1B2E | Cards, sidebar |
| Electric Purple | #7B2FFF | CTA buttons, accents |
| Coral | #FF6B6B | Highlights |
| Text | #F1F1F1 | Primary text |
| Secondary Text | #9B9BB4 | Labels, placeholders |
| Borders | #2E2D45 | Input borders, dividers |

---

## APP PAGES — ALL BUILT
| Page | Status | Notes |
|------|--------|-------|
| /login | ✅ Built | Session auth, cookie-based |
| /signup | ✅ Built | Creates user in Supabase |
| /brand-profile | ✅ Built | Website URL scanner + full form + language selector |
| /processing | ✅ Built | Animated spinner, redirects to dashboard after 10s |
| /dashboard | ✅ Built | Real posts from Supabase, content scores, platform filter |
| /calendar | ✅ Built | Monthly grid view |
| /settings | ✅ Built | Account details, plan info |
| /brand-kit | ✅ Built | Brand assets page |

---

## KEY FEATURES BUILT
- **Website URL Scanner** — paste URL → AI reads site → auto-fills entire brand profile
- **Multi-language captions** — 20 languages, user selects on brand profile form
- **Content scoring** — AI engagement score (1-10) on every dashboard post card
- **Monthly/yearly pricing toggle** — on landing page pricing section
- **Supabase database** — users, brands, posts all persisted
- **Real auth** — signup/login stores/verifies users in DB, not just cookies
- **Posts receive endpoint** — Make.com delivers 40 posts to /api/posts/receive after generation

---

## PHASE 1 CHECKLIST
- [x] Make.com pipeline (40 posts)
- [x] Claude API integration
- [x] Ideogram integration
- [x] Next.js app live on Vercel
- [x] Landing page (headline, pricing, sections, platform accuracy)
- [x] All app pages built (login, signup, brand-profile, dashboard, calendar, processing, settings)
- [x] Session-based authentication
- [x] Supabase database connected
- [x] Lemon Squeezy payments (replaced Stripe)
- [x] Monthly/yearly pricing toggle
- [x] Website URL scanner (auto-fills brand profile)
- [x] Multi-language caption support (20 languages)
- [x] Content scoring on dashboard
- [ ] Make.com final HTTP module (deliver posts to dashboard) — doing tomorrow with Ideogram test
- [ ] Test full 40-post run end-to-end
- [ ] Logo field tested in pipeline
- [ ] Platforms field tested in pipeline
- [ ] Deploy to app.digitallycooked.com
- [ ] Zernio auto-posting integration
- [ ] Image editor (Fabric.js)

## PHASE 2 CHECKLIST
- [ ] Expand content generation to more platforms: Pinterest, Threads, Twitter/X, Google Business Profile (currently 5 platforms only — bump post count to 50 with per-platform toggles)
- [ ] Runway ML — video clip generation from static posts
- [ ] HeyGen — AI presenter videos
- [ ] Multi-language caption delivery confirmed in Make.com
- [ ] Monthly regeneration reminder email
- [ ] Post performance tracking (Zernio analytics back to dashboard)
- [ ] Competitor content scan feature
- [ ] 21st.dev + Framer Motion — enhanced UI
- [ ] Multi-agent orchestration

---

## TOOLS CONFIRMED
| Tool | Purpose | Status |
|------|---------|--------|
| Zernio | Auto-post to 15 platforms + analytics | API key in Vercel env |
| Ideogram | AI image generation | Credits reset tomorrow |
| Make.com Pro | Automation pipeline | Active ($16/month) |
| Lemon Squeezy | Payments | Active, 3 products live |
| Supabase | Database | Active, tables created |
| Anthropic API | Website scanner + content gen | Key in Vercel env |

---

## AGENT SYSTEM
5 agents in /agents folder. Use trigger phrases in Claude Code:

| Agent | Trigger | Handles |
|-------|---------|---------|
| Tech Agent | "Tech agent:" | Bugs, APIs, infrastructure, Make.com, Zernio, deployment |
| Marketing Agent | "Marketing agent:" | Copy, pricing, campaigns, competitor research, email marketing |
| Content Agent | "Content agent:" | Posts for Digitally Cooked's own social media, blog, newsletters |
| Design Agent | "Design agent:" | UI/UX direction, Canva briefs, visual consistency, animations |
| Product Agent | "Product agent:" | Roadmap, features, user experience, integrations, feedback |

---

## IMPORTANT WARNINGS
1. All secret keys in .env.local and Vercel only — never paste in chat
2. Bubble.io frontend abandoned — all UI in Next.js
3. Make.com webhook: https://hook.us2.make.com/aba6mfll6svmbqt1zdxrya28p6t4ac1d
4. Ideogram credits reset tomorrow — test full pipeline then
5. Logo and Platforms fields in Make.com pipeline still need end-to-end testing
6. Domain is digitallycooked.com (NOT digitallycookedai.com — that was wrong)
7. Lemon Squeezy confirmation links point to digitallycooked.com/signup

---

## HOW TO USE AGENTS IN A NEW CHAT
1. Paste this entire document at the top of the new chat
2. State which agent you need, for example:
   - "Tech agent: the /login page is returning a 404 error"
   - "Marketing agent: write 3 subject lines for our launch email"
   - "Design agent: the dashboard cards need better visual hierarchy"
   - "Product agent: should we add a free trial?"
   - "Content agent: write 5 Instagram posts for Digitally Cooked's own account"
