# 🍳 Digitally Cooked — Test Checklist

Use this during testing with your partner. Check off what works, note what doesn't.

---

## Auth
- [ ] Sign up with name, email, password
- [ ] Log in with existing account
- [ ] Session persists on page refresh
- [ ] Sign out clears session and redirects
- [ ] Delete Account — requires typing "DELETE", deletes everything, redirects to homepage

---

## Brand Kit (`/brand-kit`)
- [ ] Multi-select works for Brand Vibe, Customer Emotion, Content Goal (more than 1 option selectable)
- [ ] Can't proceed to next step without selecting at least one from each
- [ ] Completing brand kit saves data to localStorage
- [ ] When you go to Brand Profile after Brand Kit, fields are auto-filled from kit data

---

## Brand Profile (`/brand-profile`)
- [ ] All form steps complete and navigable
- [ ] Can select up to 2 caption languages (e.g. English + Urdu)
- [ ] Wants Reels toggle works
- [ ] Platform selection works
- [ ] Submitting triggers Make.com webhook
- [ ] Redirects to Processing page after submit

---

## Processing Page (`/processing`)
- [ ] Spinner and animated steps show
- [ ] Shows "Batch X of 5 complete · Y concepts ready" (not raw row count)
- [ ] Progress bar fills correctly up to ~95%
- [ ] Counter shows "X / 30 concepts done"
- [ ] Automatically redirects to dashboard when generation is complete (not before)

---

## Post Generation (via Make.com + Claude)
- [ ] 5 batches generate 30 calendar concepts (6 per batch, days 1–30)
- [ ] Batch 6 generates 10 bonus concepts
- [ ] Each concept has 1 variation per selected platform (same image, different captions)
- [ ] Captions written in selected language(s)
- [ ] No JSON truncation errors
- [ ] Hashtags = exactly 6 per post
- [ ] `post_group` links platform variations of same concept

---

## Image Generation (Ideogram)
- [ ] 1 image generated per concept group (shared across platforms)
- [ ] Image prompt enhanced with brand's visual style, tone, and colors
- [ ] Ideogram style_type matches brand's visual style (e.g. Elegant → REALISTIC)
- [ ] Brand hex colors seeded into Ideogram color palette
- [ ] If Ideogram fails → Picsum fallback image used (never blank)
- [ ] All images eventually appear without manual refresh

---

## Dashboard (`/dashboard`)
- [ ] Shows correct count — 30 posts, 10 bonus (concept groups, not rows)
- [ ] Calendar days count matches (30)
- [ ] Platform count is correct
- [ ] Filter tabs show only platforms actually in the posts (not all 5 hardcoded)
- [ ] Shimmer animation shows on cards while images are loading
- [ ] Floating pill "Cooking your images... X / Y" shows and disappears when done
- [ ] Images appear automatically without refreshing (10s polling)
- [ ] Platform tabs on each card switch between platform variations
- [ ] Bonus posts section appears below calendar posts with 🎁 label
- [ ] Engagement score (X/10) shows on each card
- [ ] Copy button — copies hook, caption, CTA, hashtags to clipboard
- [ ] Edit button — opens image editor
- [ ] Publish Now button — copies content + opens platform upload page in new tab
- [ ] Regenerate button links back to brand profile

---

## Image Editor
- [ ] Opens on clicking Edit
- [ ] Text overlay can be added
- [ ] Text position: Top / Center / Bottom
- [ ] Text color picker works
- [ ] Font size slider (16–60px)
- [ ] Background overlay options
- [ ] "Use Hook" / "Use Caption" / "Clear" quick fill buttons
- [ ] Download as PNG works
- [ ] Close returns to dashboard

---

## Calendar (`/calendar`)
- [ ] Shows real posts from Supabase (not fake data)
- [ ] Only shows platforms the user actually chose
- [ ] Platform legend is dynamic
- [ ] Clicking a day opens modal with hook, caption, CTA, hashtags, image

---

## Settings (`/settings`)
- [ ] Shows real name, email, plan
- [ ] Can update name and email — saves correctly
- [ ] Can change password (requires current password, 8 char minimum)
- [ ] Plan section shows correct tier (Starter / Growth / Agency)
- [ ] Member since date shows correctly
- [ ] Sign Out works
- [ ] Delete Account modal works (type DELETE → deletes everything)

---

## Connect Accounts / Schedule (Dashboard)
- [ ] Platform toggle buttons work visually
- [ ] ⚠️ Schedule All Posts will show an error (Zernio not activated — expected for now)

---

## Not Built Yet (Intentional)
- ⏸ Stripe payments
- ⏸ Zernio auto-scheduling
- ⏸ Video / Reels generation (Creatify / Yapper — no API confirmed)

---

*Last updated: June 2026*
