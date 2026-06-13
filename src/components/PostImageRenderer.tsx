"use client";

import { useEffect, useRef, useState } from "react";
import { renderPost, uploadRenderedImage, BrandData, PostData } from "@/lib/canvasRenderer";

interface Props {
  post: {
    id: string;
    post_group: number;
    hook: string;
    caption: string;
    cta: string;
    hashtags: string;
    image_url: string | null;
    image_prompt: string | null;
    is_bonus: boolean;
    post_number?: number;
    platform?: string;
  };
  brand: {
    id: string;
    brand_name: string;
    brand_colors: string;
    content_tone: string;
    visual_style: string;
    business_type: string;
    location?: string;
    logo_url: string | null;
  };
  nicheIntelligence?: string;  // Competitive insights to guide viral image generation
  cardIndex?: number;          // position in the grid — used to stagger image calls
  forceImage?: boolean;        // bypass ratio check — always generate AI image (used on regenerate)
  onImageReady?: (url: string) => void;
}

function parseFirstHex(s: string): string {
  const m = (s ?? "").match(/#[0-9A-Fa-f]{6}/);
  return m ? m[0].toLowerCase() : "#7b2fff";
}

function parseSecondHex(s: string, primary: string): string {
  const m = (s ?? "").match(/#[0-9A-Fa-f]{6}/g) ?? [];
  if (m.length >= 2) return m[1].toLowerCase();
  const r = parseInt(primary.slice(1, 3), 16);
  const g = parseInt(primary.slice(3, 5), 16);
  const b = parseInt(primary.slice(5, 7), 16);
  return `#${Math.max(0, r - 55).toString(16).padStart(2, "0")}${Math.max(0, g - 55).toString(16).padStart(2, "0")}${Math.max(0, b - 55).toString(16).padStart(2, "0")}`;
}

function getContrastColor(hex: string): string {
  const clean = hex.replace("#", "").padEnd(6, "0");
  const r = parseInt(clean.slice(0, 2), 16);
  const g = parseInt(clean.slice(2, 4), 16);
  const b = parseInt(clean.slice(4, 6), 16);
  return (0.299 * r + 0.587 * g + 0.114 * b) / 255 > 0.45 ? "#111111" : "#ffffff";
}

// 70% of regular posts get AI backgrounds, 80% of bonus posts.
// Uses post_group (1-based) as the cycle index — globally unique per concept.
// post_group % 10 → 1-7 = image (70%), 8-9,0 = solid for regular
// post_group % 10 → 1-8 = image (80%), 9,0 = solid for bonus
function shouldUseDalle(postGroup: number, isBonus: boolean): boolean {
  const g = isNaN(postGroup) || postGroup < 1 ? 1 : postGroup;
  const idx = g % 10;
  return isBonus ? idx < 8 : idx < 7;
}

async function fetchDalleImage(ctx: {
  imagePrompt: string | null;
  hook: string;
  caption: string;
  brandName: string;
  businessType: string;
  visualStyle?: string;
  location?: string;
  postIndex: number;
  nicheIntelligence?: string;
  platform?: string;
}): Promise<string | null> {
  try {
    const res = await fetch("/api/generate-single-image", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        imagePrompt: ctx.imagePrompt,
        hook: ctx.hook,
        caption: ctx.caption,
        brandName: ctx.brandName,
        businessType: ctx.businessType,
        visualStyle: ctx.visualStyle,
        location: ctx.location,
        postIndex: ctx.postIndex,
        nicheIntelligence: ctx.nicheIntelligence,
        platform: ctx.platform,
      }),
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data.imageUrl ?? null;
  } catch {
    return null;
  }
}

export default function PostImageRenderer({ post, brand, nicheIntelligence, cardIndex = 0, forceImage = false, onImageReady }: Props) {
  const [imageUrl, setImageUrl] = useState<string | null>(post.image_url);
  const [rendering, setRendering] = useState(false);
  const [renderStatus, setRenderStatus] = useState<string>("Rendering design...");
  const rendered = useRef(false);

  useEffect(() => {
    if (post.image_url) {
      setImageUrl(post.image_url);
      return;
    }

    if (rendered.current) return;
    rendered.current = true;

    const primary = parseFirstHex(brand.brand_colors ?? "");
    const secondary = parseSecondHex(brand.brand_colors ?? "", primary);
    const textColor = getContrastColor(primary);

    const brandData: BrandData = {
      name: brand.brand_name ?? "Brand",
      primaryColor: primary,
      secondaryColor: secondary,
      textColor,
      logoBase64: brand.logo_url ?? null,
      businessType: brand.business_type ?? "",
      visualStyle: brand.visual_style ?? "",
      rawColors: brand.brand_colors ?? "",
    };

    // Use post_group as the cycle index — globally consistent across all platforms
    const postGroup = post.post_group ?? 1;

    const postData: PostData = {
      hook: post.hook ?? "",
      caption: post.caption ?? "",
      cta: post.cta ?? "",
      hashtags: post.hashtags ?? "",
      imageUrl: null,
      isBonus: post.is_bonus ?? false,
      postIndex: postGroup,
    };

    async function render() {
      setRendering(true);

      // Stagger DALL-E calls so all posts don't fire simultaneously
      // Each card waits its turn: card 0 = instant, card 1 = 1.5s, card 2 = 3s etc.
      // forceImage=true on manual regenerate — always try AI image regardless of ratio
      const useDalle = forceImage || shouldUseDalle(postGroup, post.is_bonus ?? false);
      if (useDalle && cardIndex > 0) {
        setRenderStatus("Queued...");
        await new Promise((r) => setTimeout(r, cardIndex * 1500));
      }

      let dalleImageUrl: string | null = null;
      if (useDalle) {
        setRenderStatus("Generating AI image...");
        dalleImageUrl = await fetchDalleImage({
          imagePrompt: post.image_prompt,
          hook: post.hook,
          caption: post.caption,
          brandName: brand.brand_name,
          businessType: brand.business_type,
          visualStyle: brand.visual_style,
          location: brand.location,
          postIndex: postGroup,
          nicheIntelligence: nicheIntelligence,
          platform: post.platform,
        });
      }

      setRenderStatus("Rendering design...");
      try {
        const finalPostData: PostData = { ...postData, imageUrl: dalleImageUrl };
        const blobUrl = await renderPost(finalPostData, brandData, 1024);
        setImageUrl(blobUrl);

        setRenderStatus("Saving...");
        const uploadedUrl = await uploadRenderedImage(blobUrl, brand.id, post.post_group);
        if (uploadedUrl) {
          setImageUrl(uploadedUrl);
          onImageReady?.(uploadedUrl);
        }
      } catch (err) {
        console.error("Render error:", err);
      } finally {
        setRendering(false);
      }
    }

    render();
  }, [post.id]);

  if (rendering) {
    return (
      <div style={{ width: "100%", aspectRatio: "1/1", background: "linear-gradient(135deg, #1a1030, #2d1f50)", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: "10px" }}>
        <div style={{ width: "28px", height: "28px", border: "2px solid rgba(167,139,250,0.3)", borderTop: "2px solid #a78bfa", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        <p style={{ color: "rgba(167,139,250,0.6)", fontSize: "0.75rem", fontWeight: 500 }}>{renderStatus}</p>
      </div>
    );
  }

  if (!imageUrl) {
    return (
      <div style={{ width: "100%", aspectRatio: "1/1", background: "#1a1030", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <p style={{ color: "rgba(241,241,241,0.2)", fontSize: "0.8rem" }}>No image</p>
      </div>
    );
  }

  return (
    <img
      src={imageUrl}
      alt={post.hook}
      style={{ width: "100%", aspectRatio: "1/1", objectFit: "cover", display: "block" }}
    />
  );
}
