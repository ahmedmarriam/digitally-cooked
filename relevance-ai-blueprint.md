# CONTENT THAT CONVERTS — Relevance AI Agent Blueprint
### Step-by-step guide to building your paid, sellable AI tool on Relevance AI (no coding required)

---

## WHY RELEVANCE AI FOR THIS

Relevance AI (relevanceai.com) lets you build AI agents and tools using a visual builder. You write instructions in plain English, define what inputs users provide, what the AI does with them, and what it outputs. You can then share the tool via a link, embed it on a website, or sell access to it. No coding. No developers.

Your "Content That Converts" tool becomes a professional product people pay to access.

---

## STEP 1 — CREATE YOUR ACCOUNT

Go to relevanceai.com and sign up for free. The free plan lets you build and test. When you're ready to sell access, upgrade to the Team plan ($19/month) which gives you shareable tool links and usage limits you can manage.

---

## STEP 2 — CREATE A NEW TOOL

From your dashboard, click **"+ New Tool"**. Give it:
- **Name:** Content That Converts
- **Description:** Generate platform-specific content that turns followers into paying coaching clients — built on conversion psychology, not guesswork.
- **Icon:** Upload a simple logo or use an emoji (💰 or ✍️)

---

## STEP 3 — BUILD YOUR INPUT FIELDS

These are the questions users answer before the AI generates their content. Set up the following fields:

**Field 1 — Your Offer**
- Type: Long text
- Label: "What do you sell? Describe your coaching offer or service."
- Placeholder: "e.g. 6-week 1:1 mindset coaching program for women who feel stuck in their careers"

**Field 2 — Client's #1 Pain Point**
- Type: Long text
- Label: "What is your ideal client's biggest pain? What do they struggle with most?"
- Placeholder: "e.g. They keep self-sabotaging every time they get close to a breakthrough. They know what to do but can't make themselves do it."

**Field 3 — The Transformation**
- Type: Long text
- Label: "What does your client's life look like AFTER working with you? Be specific."
- Placeholder: "e.g. They wake up with clarity on their next move, stop second-guessing themselves in business decisions, and finally raise their rates without feeling sick."

**Field 4 — Platform**
- Type: Dropdown (single select)
- Label: "Where will this content be posted?"
- Options: Instagram Caption / TikTok/Reel Script / LinkedIn Post / Facebook Post / Email / All Platforms

**Field 5 — Content Goal**
- Type: Dropdown (single select)
- Label: "What do you want this content to do?"
- Options: Attract new audience / Nurture existing followers / Drive bookings & inquiries directly

**Field 6 — Tone**
- Type: Dropdown (single select)
- Label: "What tone fits your brand?"
- Options: Raw & personal / Professional & authoritative / Warm & conversational / Bold & direct

---

## STEP 4 — BUILD THE AI STEP (The Brain)

Inside the tool builder, add a **"LLM" step** (Large Language Model). This is where you paste your instructions.

In the **System Prompt** field, paste the full system prompt from the "content-that-converts-GPT-system-prompt.md" file.

In the **User Prompt** field, write the following to connect your input fields to the AI:

```
Generate conversion-focused content for a coach with the following details:

OFFER: {{offer}}
CLIENT PAIN POINT: {{pain_point}}
TRANSFORMATION DELIVERED: {{transformation}}
PLATFORM: {{platform}}
CONTENT GOAL: {{content_goal}}
TONE: {{tone}}

Follow all platform-specific formats and conversion psychology rules from your instructions. 
Produce the content ready to copy and paste, the strategy explanation, and one A/B variation.
```

Note: The {{field_name}} tags pull in whatever the user typed into each input field automatically. You don't need to do anything else.

**Model:** Select GPT-4o or Claude 3.5 Sonnet (both available inside Relevance AI)

**Temperature:** Set to 0.7 (creative but consistent)

---

## STEP 5 — SET YOUR OUTPUT

Add an **"Output" step** after the LLM step. Set it to display the AI's response in a formatted text box. Label it: "Your Conversion Content — ready to copy and post."

---

## STEP 6 — TEST YOUR TOOL

Before you sell anything, run 10 test prompts using your own coaching details. Evaluate:
- Does the content sound like it was written for a real person, not a robot?
- Does it follow the platform formats correctly?
- Does it include a clear CTA?
- Would YOU engage with this if you saw it?

Tweak the system prompt until the output is consistently strong. This is the most important step.

---

## STEP 7 — SET UP ACCESS CONTROL

Once your tool is ready to sell:

1. In Relevance AI, go to **Tool Settings → Sharing**
2. Set to **"Link sharing — restricted"**
3. This gives you a unique URL you can share only with paying customers

To control who gets access, connect your payment platform (Gumroad or Stan Store) so that buyers automatically receive the tool link after purchase.

---

## STEP 8 — CONNECT TO PAYMENT (GUMROAD)

Go to gumroad.com and create a product:
- **Name:** Content That Converts — AI Tool for Coaches
- **Price:** $49/month (subscription) or $97 one-time access
- **Delivery:** In the "Thank you" message and delivery email, paste your Relevance AI tool link
- **Description:** Use the sales copy from the launch plan document

When someone pays, Gumroad sends them the link automatically. No manual work from you.

---

## STEP 9 — UPGRADE PATH (HIGHER TICKET)

Once you have users on the basic tool, offer a **Done-For-You Setup** at $300–$500:
- You build a customized version of the tool with their specific offer, tone, and frameworks pre-loaded
- They get a tool that outputs content that sounds like THEM, not a generic coach
- Deliver in 3–5 business days

This is where real revenue comes from. The $49/month tool is your lead generation. The DFY setup is your profit.

---

## TOOL VERSIONS TO BUILD (IN ORDER)

**Version 1 — Launch (Build this first)**
Single-output tool. User fills in 6 fields, gets one platform's content. Simple, fast, effective. Launch at $49/month.

**Version 2 — Upgrade (Build after 20 paying users)**
Multi-output tool. User fills in fields once, gets content for ALL platforms in one run. Charge $97/month or $197 one-time.

**Version 3 — White Label (Build after $2,000 revenue)**
Coaches can rebrand the tool with their own logo and sell it to THEIR clients. You charge $497 for white-label access. Minimum effort, maximum leverage.

---

## ESTIMATED BUILD TIME

- Setting up Relevance AI account: 30 minutes
- Building input fields: 1 hour
- Pasting and testing the system prompt: 2–3 hours
- Running 10 test prompts and refining: 2–3 hours
- Setting up Gumroad: 1 hour

**Total: One focused Saturday or two evenings.**

---

## RESOURCES

- Relevance AI: relevanceai.com
- Relevance AI Tutorial (YouTube): Search "Relevance AI tool builder tutorial 2025"
- Gumroad: gumroad.com
- Stan Store (alternative to Gumroad): stan.store
