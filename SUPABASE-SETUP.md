# Supabase Setup Guide — Digitally Cooked

## Step 1 — Run the schema in Supabase

1. Go to https://supabase.com/dashboard
2. Open your project → **SQL Editor** → **New Query**
3. Copy the entire contents of `supabase-schema.sql` and paste it in
4. Click **Run**
5. You should see: "Success. No rows returned."

This creates the `users`, `brands`, and `posts` tables.

---

## Step 2 — Get your Service Role Key

The anon key you already have is for browser reads.  
For server-side writes (creating users, saving posts), you need the **service role key**:

1. Supabase → Settings → API
2. Under **Project API keys**, copy the `service_role` key (labeled "secret")
3. Add it to `.env.local`:
   ```
   SUPABASE_SERVICE_KEY=your_service_role_key_here
   ```

---

## Step 3 — Add env vars to Vercel

In Vercel → Your Project → Settings → Environment Variables, add:

| Variable | Value |
|----------|-------|
| `NEXT_PUBLIC_SUPABASE_URL` | `https://kpeqmspyniohroxubwkf.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | (your anon/publishable key) |
| `SUPABASE_SERVICE_KEY` | (your service role key from Step 2) |
| `POSTS_RECEIVE_SECRET` | `dc_make_secret_2026` |

After adding, redeploy from Vercel dashboard.

---

## Step 4 — Update Make.com pipeline

Add one final HTTP module at the END of your Make.com scenario:

- **Module:** HTTP → Make a Request
- **Method:** POST
- **URL:** `https://digitallycooked.com/api/posts/receive`
- **Headers:**
  - `Content-Type: application/json`
  - `x-dc-secret: dc_make_secret_2026`
- **Body (JSON):**
  ```json
  {
    "brand_id": "{{brand_id}}",
    "user_id": "{{user_id}}",
    "posts": [
      {
        "post_number": 1,
        "day": 1,
        "is_bonus": false,
        "platform": "instagram",
        "format": "Reel",
        "pillar": "Education",
        "hook": "...",
        "caption": "...",
        "cta": "...",
        "hashtags": "#tag1 #tag2 #tag3",
        "image_prompt": "...",
        "image_url": "..."
      }
    ]
  }
  ```

The `brand_id` and `user_id` will be passed from your brand-profile submit webhook — they're already included in the payload.

---

## Step 5 — Test locally

```bash
npm install @supabase/supabase-js
npm run dev
```

Go to http://localhost:3000/signup → create an account → you should see a new row in Supabase → users table.

---

## Security notes

- `SUPABASE_SERVICE_KEY` is used **server-side only** (in `/api` routes). Never expose it client-side.
- `.env.local` is already in `.gitignore` — it will never be committed to GitHub.
- Row Level Security (RLS) is currently disabled for MVP speed. Enable it before scaling.
