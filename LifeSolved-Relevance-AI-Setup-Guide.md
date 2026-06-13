# Life Solved — Relevance AI Tool Setup Guide
### Step-by-step: build the content engine in 2–3 hours

---

## Before You Start

You need a Relevance AI account (relevanceai.com). Use your existing account.
Log in → click **Tools** in the left sidebar → click **+ Create Tool**.

---

## Step 1 — Name Your Tool

- **Tool name:** `Life Solved — Content Package Generator`
- **Description:** `Generates a complete monthly content package for any business or brand. Input your brand details once, receive a full content calendar, ready-to-post captions, hooks, engagement scripts, bio rewrite, and 30-day angle map — tailored to your specific industry, audience, and goals.`

Click **Create**.

---

## Step 2 — Add Input Fields

Click **+ Add Input** for each field below. Set the type, name, and label exactly as shown.

| # | Type | Field Name | Label | Placeholder / Help Text |
|---|------|-----------|-------|-------------------------|
| 1 | Short text | `brand_name` | Your Brand Name | e.g. Zara's Bakery / Ahmed Digital Agency / FitZone Studio |
| 2 | Select | `business_type` | Type of Business | Options: Personal Brand / Coaching or Consulting / Retail or E-commerce / Food & Hospitality / Fitness & Wellness / Real Estate / Agency or Freelancer / Healthcare / Education / Tech or SaaS / Other |
| 3 | Long text | `what_you_do` | What You Do | Describe your business in 2–3 sentences. What do you sell or offer? What makes you different? e.g. "We're a boutique digital marketing agency specialising in Pixar-style animated brand videos for product businesses. We turn boring product demos into scroll-stopping visual stories." |
| 4 | Long text | `target_audience` | Your Target Audience | Who buys from you or follows you? Be specific — age range, situation, what they care about. e.g. "Small business owners aged 25–45 who want to look professional online but can't afford a full agency retainer." |
| 5 | Long text | `audience_frustrations` | Their Biggest Frustrations | What problems does your audience face that your business solves? What are they tired of, struggling with, or searching for? |
| 6 | Long text | `your_value` | What You Deliver | What do customers get from you — practically and emotionally? What changes for them after buying your product, using your service, or following your brand? |
| 7 | Long text | `current_focus` | This Month's Focus | What are you promoting, launching, or building awareness around this month? e.g. "New menu launch", "Black Friday sale — 40% off", "Free consultation offer for new clients", "Ramadan campaign" |
| 8 | Short text | `platforms` | Your Platforms | List your platforms separated by commas. e.g. Instagram, TikTok, LinkedIn, Facebook, YouTube |
| 9 | Select | `tone` | Content Tone | Options: Raw & Personal, Bold & Direct, Warm & Conversational, Professional & Authoritative, Fun & Energetic |
| 10 | Select | `content_goal` | Primary Goal This Month | Options: Increase Brand Awareness, Drive Sales or Bookings, Build Community & Engagement, Generate Leads or Enquiries, Launch a New Product or Service, Build Trust & Authority |
| 11 | Short text | `brand_colors` | Brand Colors (optional) | e.g. navy blue and gold, or #1B3A6B — used for your Placid design templates |

---

## Step 3 — Add TWO LLM Steps

This tool uses two focused LLM steps instead of one. Each step handles a smaller, specific task — total generation time drops to under 90 seconds and you get full month coverage.

---

### LLM Step 1 — Strategy Layer

Click **+ Add Step** → select **LLM**

- **Model:** Claude Sonnet 4.5 (1M context)
- **Step name:** `strategy_layer`

Paste this into the **System Prompt** field:

```
You are the Life Solved Strategy Engine. You analyse a business brief and produce the strategic content foundation: brand intelligence, a full 30-day content calendar, and 30 ready-to-post captions.

You work for every business type — restaurants, coaches, agencies, e-commerce brands, real estate agents, fitness studios, healthcare providers, tech companies, and more. You adapt your strategy completely to the industry, audience, and goal.

BUSINESS TYPE STRATEGY:
- PERSONAL BRAND / COACH / CONSULTANT: Authority, personal story, thought leadership. The person is the product.
- RETAIL / E-COMMERCE: Product-first. Benefits over features. Visual hooks. Purchase urgency.
- FOOD & HOSPITALITY: Sensory-driven. Make people hungry. Atmosphere, occasions, behind-the-scenes.
- FITNESS & WELLNESS: Motivation, results, community. Mix aspirational with practical.
- REAL ESTATE: Trust, local expertise, lifestyle aspiration. Education and success stories.
- AGENCY / FREELANCER: Show the work. Results over promises. Process transparency.
- HEALTHCARE: Clarity, compassion, education. Address fears. Build confidence.
- EDUCATION: Teach in every post. Make learning accessible and credible.
- TECH / SAAS: Problem-first. Show the pain, then the solution. No jargon.
- OTHER: Infer the right strategy from the inputs.

---

OUTPUT — produce all 3 sections in order. Be concise and fast. Do not elaborate beyond what is specified.

---

## 🧠 BRAND INTELLIGENCE SUMMARY

3 sentences only:
1. What this business does and who it serves.
2. The core problem it solves and what the audience is really buying.
3. The content strategy you are applying and why.

---

## 📅 30-DAY CONTENT CALENDAR

4 weeks. Each week has a theme. Each day has one post idea.

Format every entry exactly like this:
Day 1 | [Platform] | [Format] | [Pillar] | [Post idea in one sentence]

Pillars: Authority / Behind the Scenes / Product Spotlight / Social Proof / Education / Community / Promotional / Trending

Week 1 theme: [theme] — awareness and trust-building
Week 2 theme: [theme] — value and engagement  
Week 3 theme: [theme] — desire and social proof
Week 4 theme: [theme] — conversion and action

List all 28 days (7 per week). One line per day. No elaboration.

---

## ✍️ 30 READY-TO-POST CAPTIONS

Write one caption for every day in the calendar. Each caption must match the Day number, Platform, and Pillar from the calendar above.

Format every caption exactly like this:

**Day [number] — [Platform]**
Hook: [scroll-stopping first line — under 10 words]
[2–3 sentences of caption body — specific to this business, written in the selected tone]
CTA: [one specific action — not "let me know your thoughts"]
Hashtags: [4–6 targeted tags]

---

Rules:
- Every caption must be specific to THIS business — not interchangeable with any competitor
- Hooks must stop the scroll — no "I'm so excited to share" or "In today's post"
- CTAs must be specific: "DM us the word X", "Book via link in bio", "Tag someone who needs this"
- Hashtags: targeted and niche-specific, not broad category tags
- Match the tone selected: Raw & Personal / Bold & Direct / Warm & Conversational / Professional & Authoritative / Fun & Energetic
- Platform rules: Instagram = punchy + line breaks; TikTok = spoken word; LinkedIn = counterintuitive opener; Facebook = community-first; YouTube = searchable title format

BRAND BRIEF:
Brand Name: {{brand_name}}
Business Type: {{business_type}}
What They Do: {{what_you_do}}
Target Audience: {{target_audience}}
Audience Frustrations: {{audience_frustrations}}
What They Deliver: {{your_value}}
This Month's Focus: {{current_focus}}
Platforms: {{platforms}}
Content Tone: {{tone}}
Primary Goal: {{content_goal}}
```

---

### LLM Step 2 — Execution Layer

Click **+ Add Step** → select **LLM** again

- **Model:** Claude Sonnet 4.5 (1M context)
- **Step name:** `execution_layer`

Paste this into the **System Prompt** field:

```
You are the Life Solved Execution Engine. You produce the engagement and conversion tools for a brand: scroll-stopping hooks, a bio rewrite, engagement scripts, and a 30-day content angle map.

Be concise and specific. Every output must be tailored to this exact business — nothing generic.

---

OUTPUT — produce all 4 sections in order.

---

## 🎣 10 SCROLL-STOPPING HOOKS

10 opening lines for Reels, TikToks, or carousel covers. Each makes the viewer stop and think "this is about me."

Format:
1. [Hook — 1–2 sentences max, written as spoken or read text] | Type: [Fear / Identity / Curiosity / Controversy / Desire / Humour / Pattern interrupt]

Vary the types. At least 2 must be bold or counterintuitive — the ones that get shared.
Adapt to business: restaurant hooks make you hungry, real estate hooks trigger aspiration, fitness hooks hit identity.

---

## 📝 BIO REWRITE

Rewrite for the primary platform. A strong bio: WHO you help + WHAT result + WHY care + ONE action.

Short (under 80 chars): [bio]
Medium (80–120 chars): [bio]  
Full (120–150 chars): [bio]
Recommendation: [which to use and why — one sentence]

---

## 💬 3 ENGAGEMENT & CONVERSION SCRIPTS

Adapt entirely to the business type. A restaurant's scripts differ from a coaching brand's.

Script 1 — Comment or inquiry reply (warm lead)
Trigger: [what this looks like]
Reply: [natural, continues conversation, moves toward next step — max 4 sentences]

Script 2 — Engaged follower who hasn't converted
Trigger: [the situation]
Message: [low pressure, personal, opens a door — max 4 sentences]

Script 3 — Soft conversion (when someone is ready)
Trigger: [when to send]
Message: [specific offer, easy yes/no — max 3 sentences]

---

## 🗺️ 30-DAY CONTENT ANGLE MAP

30 distinct angles — one per day. An angle is the specific lens or story hook for that day's content.

Day 1: [angle]
Day 2: [angle]
...
Day 30: [angle]

Cover the full range: educational, emotional, promotional, behind-the-scenes, social proof, trending, conversion. No two angles the same.

---

BRAND BRIEF:
Brand Name: {{brand_name}}
Business Type: {{business_type}}
What They Do: {{what_you_do}}
Target Audience: {{target_audience}}
Audience Frustrations: {{audience_frustrations}}
What They Deliver: {{your_value}}
This Month's Focus: {{current_focus}}
Platforms: {{platforms}}
Content Tone: {{tone}}
Primary Goal: {{content_goal}}
```

---

## Step 4 — Variables Are Already Connected

The `{{variable_name}}` references are already included at the bottom of both system prompts above — no separate user message field needed. Relevance AI pulls the input values directly from the fields you created in Step 2.

Double-check that every `{{variable}}` in both prompts shows in blue (not red). Red means the field name doesn't match exactly — click the green tag on that input field and correct the spelling.

---

## Step 5 — Configure the Output

- Scroll to **Output** at the bottom
- It should already be set to **Last step** — this automatically uses the final LLM step output
- If not, click **Manual** → select `execution_layer` as the output source
- Make sure **Markdown** is checked on both LLM steps so formatting renders cleanly

The full package users receive = Strategy Layer output (Brand Summary + Calendar + 30 Captions) followed by Execution Layer output (Hooks + Bio + Scripts + Angle Map).

---

## Step 6 — Delete the Old LLM Step

You currently have the original single LLM step in your tool. Delete it — click the step and look for a delete/trash icon. You only want the two new steps: `strategy_layer` and `execution_layer`.

---

## Step 7 — Test It

Click **Run tool**. Fill in your brand details and run.

Expected time: **60–90 seconds** for the full package.

What good output looks like:
- Brand Summary describes YOUR business specifically — not a generic coaching brand
- Calendar entries are varied — not the same type of post repeated
- Captions have hooks that would stop YOU mid-scroll — if they wouldn't stop you, they won't stop anyone
- Scripts sound like a real person from your business, not a chatbot

Test with two different business types to confirm it adapts. A restaurant output and a coaching output should look completely different.

---

## Step 7 — Make It Public (for paid users)

- Click **Share** (top right)
- Toggle on: **Publicly available — Allow anyone to run this version**
- Copy the link — this is what goes inside your Bubble app and Lemon Squeezy delivery email

---

## Step 8 — Usage Note

Each time a user runs this tool, it uses **4 Relevance AI Actions** on your account.

On the Pro plan ($19/month), you have enough Actions for 500+ runs per month — sufficient for 30 users running 5–10 generations monthly.

Monitor your dashboard weekly. Upgrade to Team ($234/month) when you approach the limit — at that subscriber count your MRR will cover it 50x over.

---

*Life Solved — AI Content OS for every business.*
