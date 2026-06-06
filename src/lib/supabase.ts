import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey =
  process.env.SUPABASE_SERVICE_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Server-side client — used in all API routes
export const supabase = createClient(supabaseUrl, supabaseKey);

// ─── Types ────────────────────────────────────────────────────
export type User = {
  id: string;
  name: string;
  email: string;
  password_hash: string;
  plan: 'starter' | 'growth' | 'agency';
  stripe_customer_id?: string;
  stripe_subscription_id?: string;
  created_at: string;
};

export type Brand = {
  id: string;
  user_id: string;
  brand_personality?: string;
  tone_of_voice?: string;
  target_audience?: string;
  audience_pain_points?: string;
  audience_goals?: string;
  positioning_statement?: string;
  brand_colors?: string;
  brand_mission?: string;
  brand_name?: string;
  owner_name?: string;
  business_type?: string;
  location?: string;
  business_description?: string;
  top_products?: string;
  unique_factor?: string;
  ideal_customer?: string;
  content_tone?: string;
  visual_style?: string;
  monthly_goal?: string;
  posting_frequency?: string;
  platforms?: string[];
  logo_url?: string;
  generation_status: 'pending' | 'generating' | 'complete' | 'failed';
  created_at: string;
};

export type Post = {
  id: string;
  brand_id: string;
  user_id: string;
  post_number: number;
  post_group?: number;
  day?: number;
  is_bonus: boolean;
  platform: string;
  format: string;
  pillar?: string;
  hook: string;
  caption: string;
  cta: string;
  hashtags: string;
  image_prompt?: string;
  image_url?: string;
  custom_image_url?: string;
  status: 'draft' | 'scheduled' | 'posted';
  scheduled_at?: string;
  zernio_post_id?: string;
  editor_data?: object;
  created_at: string;
};
