/**
 * Template Engine v3 — Vercel OG + Sharp
 * Renders HTML templates to professional images with proper typography
 */

import { ImageResponse } from "@vercel/og";
import sharp from "sharp";

// ─── Types ─────────────────────────────────────────────────────

export interface BrandContext {
  name: string;
  primaryColor: string;
  secondaryColor: string;
  textColor: string;
  tone: string;
  visualStyle: string;
  businessType: string;
  logoBase64: string | null;
}

export interface PostContent {
  hook: string;
  caption: string;
  cta: string;
  hashtags: string;
  format: string;
  postIndex: number;
  isBonus: boolean;
}

export type TemplateName = "bold" | "split" | "editorial" | "gradient";

// ─── Color Utilities ───────────────────────────────────────────

function hexToRgb(hex: string) {
  const clean = (hex ?? "#7b2fff").replace("#", "").padEnd(6, "0");
  return {
    r: parseInt(clean.slice(0, 2), 16) || 123,
    g: parseInt(clean.slice(2, 4), 16) || 47,
    b: parseInt(clean.slice(4, 6), 16) || 255,
  };
}

function rgbToHex(r: number, g: number, b: number): string {
  const c = (v: number) => Math.max(0, Math.min(255, Math.round(v))).toString(16).padStart(2, "0");
  return `#${c(r)}${c(g)}${c(b)}`;
}

function getLuminance({ r, g, b }: { r: number; g: number; b: number }) {
  return (0.299 * r + 0.587 * g + 0.114 * b) / 255;
}

export function getContrastColor(hex: string): string {
  try { return getLuminance(hexToRgb(hex)) > 0.45 ? "#111111" : "#ffffff"; }
  catch { return "#ffffff"; }
}

export function adjustColor(hex: string, amount: number): string {
  try {
    const { r, g, b } = hexToRgb(hex);
    return rgbToHex(r + amount, g + amount, b + amount);
  } catch { return hex; }
}

export function parseFirstHex(s: string): string {
  const m = (s ?? "").match(/#[0-9A-Fa-f]{6}/);
  return m ? m[0].toLowerCase() : "#7b2fff";
}

export function parseSecondHex(s: string, primary: string): string {
  const m = (s ?? "").match(/#[0-9A-Fa-f]{6}/g) ?? [];
  return m.length >= 2 ? m[1].toLowerCase() : adjustColor(primary, -55);
}

export function buildBrandContext(brand: {
  brand_name?: string; brand_colors?: string; content_tone?: string;
  visual_style?: string; business_type?: string; logo_url?: string | null;
}): BrandContext {
  const primary = parseFirstHex(brand.brand_colors ?? "");
  const secondary = parseSecondHex(brand.brand_colors ?? "", primary);
  return {
    name: brand.brand_name ?? "Brand",
    primaryColor: primary,
    secondaryColor: secondary,
    textColor: getContrastColor(primary),
    tone: brand.content_tone ?? "",
    visualStyle: brand.visual_style ?? "",
    businessType: brand.business_type ?? "",
    logoBase64: brand.logo_url ?? null,
  };
}

// ─── Template Selection ────────────────────────────────────────

export function selectTemplate(brand: BrandContext, postIndex: number): TemplateName {
  const style = brand.visualStyle.toLowerCase();
  if (style.includes("minimal") || style.includes("clean")) return "split";
  if (style.includes("elegant") || style.includes("luxury")) return "editorial";
  if (style.includes("corporate") || style.includes("modern") || style.includes("tech")) return "gradient";
  const cycle: TemplateName[] = ["bold", "gradient", "split", "editorial"];
  return cycle[postIndex % cycle.length];
}

// Use post_group (1-based) as the index — globally unique per concept.
// Regular: groups whose post_group % 10 is 1-6 get images → 60%
// Bonus:   groups whose post_group % 10 is 1-7 get images → 70%
export function shouldUseImage(postGroup: number, isBonus: boolean): boolean {
  const g = isNaN(postGroup) || postGroup < 1 ? 1 : postGroup;
  const idx = g % 10;  // 0-9
  return isBonus ? idx < 8 : idx < 7;
}

// ─── Helpers ───────────────────────────────────────────────────

function truncate(text: string, max: number): string {
  return (text ?? "").length > max ? text.substring(0, max - 1) + "…" : (text ?? "");
}

// ─── Vercel OG Template Functions ───────────────────────────────

async function renderBoldTemplate(brand: BrandContext, post: PostContent): Promise<Buffer> {
  const lighter = adjustColor(brand.primaryColor, 30);
  const darker = adjustColor(brand.primaryColor, -40);

  const imageResponse = new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          background: `linear-gradient(135deg, ${lighter} 0%, ${brand.primaryColor} 50%, ${darker} 100%)`,
          display: "flex",
          flexDirection: "column",
          padding: "80px",
          fontFamily: "system-ui",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Decorative circles */}
        <div
          style={{
            position: "absolute",
            top: "-100px",
            right: "-80px",
            width: "450px",
            height: "450px",
            borderRadius: "50%",
            background: "rgba(255,255,255,0.08)",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: "-150px",
            left: "-100px",
            width: "400px",
            height: "400px",
            borderRadius: "50%",
            background: "rgba(255,255,255,0.05)",
          }}
        />

        {/* Brand name */}
        <div
          style={{
            color: brand.textColor,
            opacity: 0.6,
            fontSize: "22px",
            fontWeight: "700",
            letterSpacing: "3px",
            marginBottom: "80px",
          }}
        >
          {brand.name.toUpperCase().substring(0, 20)}
        </div>

        {/* Hook */}
        <div
          style={{
            color: brand.textColor,
            fontSize: "72px",
            fontWeight: "900",
            lineHeight: 1.2,
            marginBottom: "30px",
          }}
        >
          {truncate(post.hook, 80)}
        </div>

        {/* Divider */}
        <div
          style={{
            width: "280px",
            height: "3px",
            background: brand.textColor,
            opacity: 0.4,
            marginBottom: "30px",
          }}
        />

        {/* Caption */}
        <div
          style={{
            color: brand.textColor,
            opacity: 0.8,
            fontSize: "28px",
            lineHeight: 1.5,
            marginBottom: "60px",
            flex: 1,
          }}
        >
          {truncate(post.caption, 100)}
        </div>

        {/* CTA Button */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            border: `2px solid ${brand.textColor}`,
            borderRadius: "50px",
            padding: "20px 50px",
            background: "rgba(255,255,255,0.15)",
            color: brand.textColor,
            fontSize: "24px",
            fontWeight: "700",
            width: "fit-content",
            marginBottom: "40px",
          }}
        >
          {truncate(post.cta, 30)}
        </div>

        {/* Hashtags */}
        <div
          style={{
            color: brand.textColor,
            opacity: 0.45,
            fontSize: "18px",
          }}
        >
          {(post.hashtags ?? "").substring(0, 60)}
        </div>
      </div>
    ),
    { width: 1024, height: 1024 }
  );

  return Buffer.from(await imageResponse.arrayBuffer());
}

async function renderSplitTemplate(brand: BrandContext, post: PostContent): Promise<Buffer> {
  const darkPanel = adjustColor(brand.primaryColor, -110);

  const imageResponse = new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "row",
          fontFamily: "system-ui",
        }}
      >
        {/* Left panel */}
        <div
          style={{
            flex: "0 0 55%",
            background: brand.primaryColor,
            display: "flex",
            flexDirection: "column",
            padding: "70px",
            justifyContent: "space-between",
          }}
        >
          <div>
            <div
              style={{
                color: brand.textColor,
                opacity: 0.6,
                fontSize: "16px",
                fontWeight: "700",
                letterSpacing: "3px",
                marginBottom: "60px",
              }}
            >
              {brand.name.toUpperCase().substring(0, 18)}
            </div>

            <div
              style={{
                color: brand.textColor,
                fontSize: "64px",
                fontWeight: "900",
                lineHeight: 1.2,
                marginBottom: "30px",
              }}
            >
              {truncate(post.hook, 70)}
            </div>

            <div
              style={{
                width: "220px",
                height: "3px",
                background: brand.textColor,
                opacity: 0.45,
                marginBottom: "30px",
              }}
            />

            <div
              style={{
                color: brand.textColor,
                opacity: 0.8,
                fontSize: "24px",
                lineHeight: 1.5,
              }}
            >
              {truncate(post.caption, 90)}
            </div>
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "rgba(255,255,255,0.9)",
              borderRadius: "30px",
              padding: "15px 45px",
              color: brand.primaryColor,
              fontSize: "22px",
              fontWeight: "700",
              width: "fit-content",
            }}
          >
            {truncate(post.cta, 26)}
          </div>
        </div>

        {/* Right panel */}
        <div
          style={{
            flex: 1,
            background: darkPanel,
            display: "flex",
            flexDirection: "column",
            padding: "70px",
            justifyContent: "flex-start",
          }}
        >
          <div
            style={{
              color: brand.primaryColor,
              fontSize: "32px",
              fontWeight: "900",
              opacity: 0.9,
              marginBottom: "40px",
            }}
          >
            {brand.businessType.toUpperCase().substring(0, 14)}
          </div>

          <div
            style={{
              color: "rgba(255,255,255,0.5)",
              fontSize: "14px",
              lineHeight: 2.2,
              whiteSpace: "pre-wrap",
            }}
          >
            {(post.hashtags ?? "").split(" ").slice(0, 4).join("\n")}
          </div>
        </div>
      </div>
    ),
    { width: 1024, height: 1024 }
  );

  return Buffer.from(await imageResponse.arrayBuffer());
}

async function renderEditorialTemplate(brand: BrandContext, post: PostContent): Promise<Buffer> {
  const bg = adjustColor(brand.primaryColor, -145);

  const imageResponse = new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          background: bg,
          display: "flex",
          flexDirection: "column",
          padding: "90px",
          fontFamily: "system-ui",
          position: "relative",
          justifyContent: "space-between",
        }}
      >
        {/* Top accent line */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "4px",
            background: brand.primaryColor,
          }}
        />

        <div>
          <div
            style={{
              color: brand.primaryColor,
              fontSize: "18px",
              fontWeight: "700",
              letterSpacing: "4px",
              opacity: 0.9,
              marginBottom: "30px",
            }}
          >
            {brand.name.toUpperCase().substring(0, 18)}
          </div>

          <div
            style={{
              width: "240px",
              height: "3px",
              background: brand.primaryColor,
              marginBottom: "50px",
            }}
          />

          <div
            style={{
              color: "white",
              fontSize: "60px",
              fontWeight: "800",
              lineHeight: 1.2,
              marginBottom: "30px",
              fontFamily: "serif",
            }}
          >
            {truncate(post.hook, 90)}
          </div>

          <div
            style={{
              width: "220px",
              height: "2px",
              background: brand.primaryColor,
              opacity: 0.8,
              marginBottom: "30px",
            }}
          />

          <div
            style={{
              color: "rgba(255,255,255,0.65)",
              fontSize: "26px",
              lineHeight: 1.55,
            }}
          >
            {truncate(post.caption, 90)}
          </div>
        </div>

        <div>
          <div
            style={{
              color: brand.primaryColor,
              fontSize: "24px",
              fontWeight: "700",
              marginBottom: "30px",
            }}
          >
            → {truncate(post.cta, 32)}
          </div>

          <div
            style={{
              color: "rgba(255,255,255,0.35)",
              fontSize: "16px",
            }}
          >
            {(post.hashtags ?? "").substring(0, 60)}
          </div>
        </div>

        {/* Bottom accent line */}
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: "4px",
            background: brand.primaryColor,
          }}
        />
      </div>
    ),
    { width: 1024, height: 1024 }
  );

  return Buffer.from(await imageResponse.arrayBuffer());
}

async function renderGradientTemplate(brand: BrandContext, post: PostContent): Promise<Buffer> {
  const imageResponse = new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          background: `linear-gradient(135deg, ${adjustColor(brand.primaryColor, 30)} 0%, ${brand.primaryColor} 45%, ${brand.secondaryColor} 100%)`,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "80px 100px",
          fontFamily: "system-ui",
          position: "relative",
          textAlign: "center",
          overflow: "hidden",
        }}
      >
        {/* Decorative circles */}
        <div
          style={{
            position: "absolute",
            top: "-150px",
            right: "-100px",
            width: "500px",
            height: "500px",
            borderRadius: "50%",
            background: "rgba(255,255,255,0.06)",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: "-150px",
            left: "-100px",
            width: "400px",
            height: "400px",
            borderRadius: "50%",
            background: "rgba(255,255,255,0.05)",
          }}
        />

        {/* Brand name */}
        <div
          style={{
            color: brand.textColor,
            opacity: 0.65,
            fontSize: "18px",
            fontWeight: "700",
            letterSpacing: "3px",
            marginBottom: "60px",
          }}
        >
          {brand.name.toUpperCase().substring(0, 20)}
        </div>

        {/* Hook */}
        <div
          style={{
            color: brand.textColor,
            fontSize: "68px",
            fontWeight: "900",
            lineHeight: 1.2,
            marginBottom: "50px",
          }}
        >
          {truncate(post.hook, 80)}
        </div>

        {/* Caption */}
        <div
          style={{
            color: brand.textColor,
            opacity: 0.78,
            fontSize: "28px",
            lineHeight: 1.5,
            marginBottom: "60px",
          }}
        >
          {truncate(post.caption, 100)}
        </div>

        {/* CTA Button */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "rgba(255,255,255,0.92)",
            borderRadius: "50px",
            padding: "20px 70px",
            color: brand.primaryColor,
            fontSize: "26px",
            fontWeight: "700",
            marginBottom: "40px",
          }}
        >
          {truncate(post.cta, 28)}
        </div>

        {/* Hashtags */}
        <div
          style={{
            color: brand.textColor,
            opacity: 0.45,
            fontSize: "18px",
          }}
        >
          {(post.hashtags ?? "").substring(0, 60)}
        </div>
      </div>
    ),
    { width: 1024, height: 1024 }
  );

  return Buffer.from(await imageResponse.arrayBuffer());
}

// ─── Image Overlay (on DALL-E background) ────────────────────

export async function renderImageOverlay(
  imageBuffer: Buffer,
  brand: BrandContext,
  post: PostContent,
  w: number,
  h: number
): Promise<Buffer> {
  const imageResponse = new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-end",
          fontFamily: "system-ui",
          background: "linear-gradient(to bottom, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0) 35%, rgba(0,0,0,0) 40%, rgba(0,0,0,0.88) 100%)",
          padding: "70px 80px",
        }}
      >
        <div
          style={{
            color: "white",
            fontSize: "62px",
            fontWeight: "900",
            lineHeight: 1.2,
            marginBottom: "25px",
            textShadow: "0 2px 8px rgba(0,0,0,0.5)",
          }}
        >
          {truncate(post.hook, 75)}
        </div>

        <div
          style={{
            color: "rgba(255,255,255,0.85)",
            fontSize: "24px",
            lineHeight: 1.5,
            marginBottom: "35px",
          }}
        >
          {truncate(post.caption, 90)}
        </div>

        <div
          style={{
            color: "rgba(255,255,255,0.5)",
            fontSize: "18px",
          }}
        >
          {(post.hashtags ?? "").substring(0, 60)}
        </div>

        {/* Brand accent bar at bottom */}
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: "5px",
            background: brand.primaryColor,
          }}
        />
      </div>
    ),
    { width: w, height: h }
  );

  const overlayBuffer = Buffer.from(await imageResponse.arrayBuffer());
  const resized = await sharp(imageBuffer).resize(w, h, { fit: "cover", position: "centre" }).toBuffer();

  return sharp(resized)
    .composite([{ input: overlayBuffer, top: 0, left: 0 }])
    .jpeg({ quality: 92 }).toBuffer();
}

// ─── Main Exports ──────────────────────────────────────────────

export async function renderSolidTemplate(
  brand: BrandContext, post: PostContent, template: TemplateName, _w: number, _h: number
): Promise<Buffer> {
  switch (template) {
    case "split":     return renderSplitTemplate(brand, post);
    case "editorial": return renderEditorialTemplate(brand, post);
    case "gradient":  return renderGradientTemplate(brand, post);
    case "bold":
    default:          return renderBoldTemplate(brand, post);
  }
}
