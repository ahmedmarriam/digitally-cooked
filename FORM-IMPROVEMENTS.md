# Brand Profile Form — Improvements Backlog
*Noted June 13 2026 — implement all at once*

## 1. Brand Personality — pre-fill from scan
Currently asked as a blank question after the website scan.
**Fix:** Website scan + social scan should assess and suggest brand personality automatically. Present it as a pre-selected option the user can confirm or change — not fill from scratch.

## 2. Duplicate questions — tone + visual style
"How formal is your brand", "tone of voice", and "visual style" are effectively the same question asked multiple times across sections.
**Fix:** Consolidate into one section. Website scan already captures most of this. Pre-fill and let user adjust.

## 3. Customer interests — user may not know their audience
Some users (especially new brands) don't know their audience demographics or interests yet.
**Fix:** Add "I'm not sure yet" option. Claude should infer from business type + description and generate a suggested audience profile.

## 4. Top 3 pain points — wrong direction
This question was intended to capture the USER's pain points (their content creation challenges — no time, no ideas, inconsistent posting), NOT their audience's pain points. Currently worded/mapped incorrectly.
**Fix:** Reword question to: "What are your top 3 challenges when it comes to creating content?" — feeds Claude context about why this user needs the platform.

## 5. Niche intelligence — simplify the process
Currently asks users to enter competitor social handles AND manually paste hooks for each platform separately. Too much work — nobody will do this properly.
**Fix:** Ask for 3 competitor website URLs only. Platform scans each website, finds their socials automatically, assesses what makes them stand out. User just reviews the output. Remove the manual hook-pasting entirely.

## 6. Solid post templates — redesigned ✅
Already implemented June 13 2026 — new editorial-quality templates (bold, gradient, split, editorial).
