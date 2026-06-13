/**
 * Client-side Canvas Renderer
 * Uses fabric.js to render branded social media posts in the browser.
 * No server-side rendering — runs entirely on the user's machine.
 */

export interface BrandData {
  name: string;
  primaryColor: string;
  secondaryColor: string;
  textColor: string;
  businessType?: string;
  logoBase64?: string | null;
}

export interface PostData {
  hook: string;
  caption: string;
  cta: string;
  hashtags: string;
  imageUrl?: string | null;
  isBonus?: boolean;
  postIndex?: number;
  // Editor customizations
  hookFontScale?: number;
  hookColor?: string;
  fontFamily?: string;
  textAlign?: "left" | "center" | "right";  // hook alignment
  showCaption?: boolean;                     // show/hide caption (default: true)
  textBackdrop?: boolean;                    // semi-transparent pill behind text
  textY?: number;                            // 0-100: vertical position (0=top, 100=bottom)
  template?: "bold" | "gradient" | "split" | "editorial";  // override auto-selected
}

export type TemplateStyle = "bold" | "gradient" | "split" | "editorial";

function getContrastColor(hex: string): string {
  const clean = hex.replace("#", "").padEnd(6, "0");
  const r = parseInt(clean.slice(0, 2), 16);
  const g = parseInt(clean.slice(2, 4), 16);
  const b = parseInt(clean.slice(4, 6), 16);
  return (0.299 * r + 0.587 * g + 0.114 * b) / 255 > 0.45 ? "#111111" : "#ffffff";
}

function adjustColor(hex: string, amount: number): string {
  const clean = hex.replace("#", "").padEnd(6, "0");
  const r = Math.max(0, Math.min(255, parseInt(clean.slice(0, 2), 16) + amount));
  const g = Math.max(0, Math.min(255, parseInt(clean.slice(2, 4), 16) + amount));
  const b = Math.max(0, Math.min(255, parseInt(clean.slice(4, 6), 16) + amount));
  return `#${r.toString(16).padStart(2, "0")}${g.toString(16).padStart(2, "0")}${b.toString(16).padStart(2, "0")}`;
}

function truncate(text: string, max: number): string {
  return (text ?? "").length > max ? text.substring(0, max - 1) + "…" : (text ?? "");
}

function selectTemplate(postIndex: number): TemplateStyle {
  const cycle: TemplateStyle[] = ["bold", "gradient", "split", "editorial"];
  return cycle[(postIndex ?? 0) % cycle.length];
}

// Calculate text Y offset based on textY value (0-100)
// textY: 0=top, 50=center, 100=bottom
// contentHeight: approximate height of the text block
function calculateTextYOffset(size: number, contentHeight: number, textY: number = 100): number {
  const topSpace = 140;  // Space reserved at top
  const bottomSpace = 180;  // Space reserved at bottom
  const availableHeight = size - topSpace - bottomSpace;

  // Default bottom positioning
  const bottomY = size - bottomSpace;

  // Top positioning
  const topY = topSpace;

  // Interpolate based on textY
  return topY + (bottomY - topY) * (textY / 100);
}



// Load an image from URL into an HTMLImageElement
function loadImage(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = url;
  });
}

// Load Google Font
async function loadFont(fontName: string, weight: number = 400) {
  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.href = `https://fonts.googleapis.com/css2?family=${fontName.replace(" ", "+")}:wght@${weight}&display=swap`;
  document.head.appendChild(link);
  await document.fonts.ready;
}

/**
 * Main render function — renders a post to a canvas element
 * Returns a PNG blob URL
 */
export async function renderPost(
  post: PostData,
  brand: BrandData,
  size: number = 1024
): Promise<string> {
  // Load Inter as base + any custom font
  await loadFont("Inter", 400);
  await loadFont("Inter", 700);
  await loadFont("Inter", 900);
  if (post.fontFamily && post.fontFamily !== "Inter") {
    await loadFont(post.fontFamily, 400);
    await loadFont(post.fontFamily, 700);
    await loadFont(post.fontFamily, 900);
  }

  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d")!;

  // Use explicit template if provided in editor, otherwise auto-select
  const template = post.template ?? selectTemplate(post.postIndex ?? 0);
  const hasImage = !!post.imageUrl;

  if (hasImage && post.imageUrl) {
    await renderImagePost(ctx, canvas, post, brand, size);
  } else {
    await renderSolidPost(ctx, canvas, post, brand, size, template);
  }

  // Return as blob URL
  return new Promise((resolve) => {
    canvas.toBlob((blob) => {
      resolve(URL.createObjectURL(blob!));
    }, "image/jpeg", 0.92);
  });
}

/**
 * Render a post with DALL-E background image.
 * Text elements flow downward from a start point — no overlapping.
 */
async function renderImagePost(
  ctx: CanvasRenderingContext2D,
  canvas: HTMLCanvasElement,
  post: PostData,
  brand: BrandData,
  size: number
) {
  // Draw background image
  try {
    const img = await loadImage(post.imageUrl!);
    ctx.drawImage(img, 0, 0, size, size);
  } catch {
    ctx.fillStyle = brand.primaryColor;
    ctx.fillRect(0, 0, size, size);
  }

  // Base overlay — subtle darkening over the FULL canvas so text is always readable
  ctx.fillStyle = "rgba(0,0,0,0.28)";
  ctx.fillRect(0, 0, size, size);

  // Brand accent line at bottom
  ctx.fillStyle = brand.primaryColor;
  ctx.fillRect(0, size - 5, size, 5);

  const pad = 72;
  const font = post.fontFamily ?? "Inter";
  const hookFontSize = Math.floor(size * 0.075 * (post.hookFontScale ?? 1));
  const hookLineH = Math.floor(hookFontSize * 1.25);
  const capFontSize = Math.floor(size * 0.028);
  const capLineH = Math.floor(capFontSize * 1.45);

  // Measure how many lines the hook needs to find starting Y
  ctx.font = `900 ${hookFontSize}px ${font}, sans-serif`;
  const hookText = truncate(post.hook, 80);
  const hookLineCount = Math.min(3, measureLines(ctx, hookText, size - pad * 2));

  // Work out total text block height
  const capLineCount = post.showCaption !== false ? Math.min(2, measureLines(ctx, truncate(post.caption, 120), size - pad * 2)) : 0;
  const ctaHeight = post.cta ? capLineH + 8 : 0;
  const gapBetween = 20;
  const blockH = hookLineCount * hookLineH + gapBetween + capLineCount * capLineH + (capLineCount > 0 ? gapBetween : 0) + ctaHeight + 28;

  // Position text based on textY: 0=top, 50=center, 100=bottom
  const topY = pad + 30;
  const bottomY = size - 20 - blockH;
  const textYPos = post.textY ?? 100;  // Default to bottom
  let y = topY + (bottomY - topY) * (textYPos / 100);

  // Dark gradient scrim behind the text block so it's always readable
  const scrimPad = 24;
  const scrimTop = Math.max(0, y - scrimPad);
  const scrimBot = Math.min(size, y + blockH + scrimPad);
  const scrimGrad = ctx.createLinearGradient(0, scrimTop, 0, scrimBot);
  scrimGrad.addColorStop(0, "rgba(0,0,0,0)");
  scrimGrad.addColorStop(0.2, "rgba(0,0,0,0.65)");
  scrimGrad.addColorStop(0.8, "rgba(0,0,0,0.65)");
  scrimGrad.addColorStop(1, "rgba(0,0,0,0)");
  ctx.fillStyle = scrimGrad;
  ctx.fillRect(0, scrimTop, size, scrimBot - scrimTop);

  // Optional stronger backdrop pill
  if (post.textBackdrop) {
    const backdropPad = 16;
    const backdropH = blockH + backdropPad * 2;
    ctx.fillStyle = "rgba(0,0,0,0.55)";
    roundRect(ctx, pad - backdropPad, y - backdropPad, size - pad * 2 + backdropPad * 2, backdropH, 16);
    ctx.fill();
  }

  // Hook
  ctx.fillStyle = post.hookColor ?? "#ffffff";
  ctx.font = `900 ${hookFontSize}px ${font}, sans-serif`;
  ctx.shadowColor = "rgba(0,0,0,0.7)";
  ctx.shadowBlur = 12;
  ctx.textAlign = post.textAlign ?? "left";
  const drawnHookLines = wrapTextWithAlign(ctx, hookText, pad, y, size - pad * 2, hookLineH, 3, post.textAlign ?? "left");
  ctx.shadowBlur = 0;
  ctx.textAlign = "left";
  y += drawnHookLines * hookLineH + gapBetween;

  // Caption (optional)
  if (post.showCaption !== false && post.caption) {
    ctx.fillStyle = "rgba(255,255,255,0.82)";
    ctx.font = `400 ${capFontSize}px ${font}, sans-serif`;
    ctx.textAlign = post.textAlign ?? "left";
    const drawnCapLines = wrapTextWithAlign(ctx, truncate(post.caption, 130), pad, y, size - pad * 2, capLineH, 2, post.textAlign ?? "left");
    ctx.textAlign = "left";
    y += drawnCapLines * capLineH + gapBetween;
  }

  // CTA — brand-coloured arrow style
  if (post.cta) {
    ctx.fillStyle = brand.primaryColor;
    ctx.font = `700 ${Math.floor(size * 0.025)}px Inter, sans-serif`;
    ctx.shadowColor = "rgba(0,0,0,0.5)";
    ctx.shadowBlur = 6;
    ctx.fillText(`→ ${truncate(post.cta, 40)}`, pad, y);
    ctx.shadowBlur = 0;
    y += ctaHeight;
  }

  // Hashtags
  ctx.fillStyle = "rgba(255,255,255,0.38)";
  ctx.font = `400 ${Math.floor(size * 0.018)}px Inter, sans-serif`;
  ctx.fillText(truncate((post.hashtags ?? "").split(" ").slice(0, 5).join(" "), 60), pad, y + 14);

  // Logo
  await drawLogo(ctx, brand, size);
}

// Count how many lines a piece of text will wrap into at a given maxWidth
function measureLines(ctx: CanvasRenderingContext2D, text: string, maxWidth: number): number {
  const words = text.split(" ");
  let line = "";
  let count = 1;
  for (const word of words) {
    const test = line ? `${line} ${word}` : word;
    if (ctx.measureText(test).width > maxWidth && line) {
      line = word;
      count++;
    } else {
      line = test;
    }
  }
  return count;
}

/**
 * Render a solid branded post (no DALL-E background)
 */
async function renderSolidPost(
  ctx: CanvasRenderingContext2D,
  canvas: HTMLCanvasElement,
  post: PostData,
  brand: BrandData,
  size: number,
  template: TemplateStyle
) {
  switch (template) {
    case "bold":    await renderBold(ctx, post, brand, size); break;
    case "gradient": await renderGradient(ctx, post, brand, size); break;
    case "split":   await renderSplit(ctx, post, brand, size); break;
    case "editorial": await renderEditorial(ctx, post, brand, size); break;
  }
  await drawLogo(ctx, brand, size);
}

// ─── Template: BOLD ──────────────────────────────────────────
// Dark base, large brand color block at bottom, dominant hook text

async function renderBold(ctx: CanvasRenderingContext2D, post: PostData, brand: BrandData, size: number) {
  const pad = 72;
  const font = post.fontFamily ?? "Inter";
  const hookColor = post.hookColor ?? "#ffffff";
  const dark = adjustColor(brand.primaryColor, -160);

  // Deep dark background
  ctx.fillStyle = dark;
  ctx.fillRect(0, 0, size, size);

  // Bold brand color block — bottom third
  ctx.fillStyle = brand.primaryColor;
  ctx.fillRect(0, size * 0.72, size, size * 0.28);

  // Thin horizontal rule separating sections
  ctx.fillStyle = "rgba(255,255,255,0.12)";
  ctx.fillRect(0, size * 0.72, size, 1);

  // Large ghost initial — top right, decorative
  const initial = (brand.name ?? "B").charAt(0).toUpperCase();
  ctx.fillStyle = "rgba(255,255,255,0.03)";
  ctx.font = `900 ${Math.floor(size * 0.7)}px ${font}, sans-serif`;
  ctx.textAlign = "right";
  ctx.fillText(initial, size + size * 0.05, size * 0.68);
  ctx.textAlign = "left";

  // Brand name — small, top left, spaced
  ctx.fillStyle = brand.primaryColor;
  ctx.globalAlpha = 0.9;
  ctx.font = `700 ${Math.floor(size * 0.019)}px ${font}, sans-serif`;
  ctx.letterSpacing = "3px";
  ctx.fillText(brand.name.toUpperCase().substring(0, 18), pad, 80);
  ctx.letterSpacing = "0px";
  ctx.globalAlpha = 1;

  // Thin accent bar below brand name
  ctx.fillStyle = brand.primaryColor;
  ctx.globalAlpha = 0.6;
  ctx.fillRect(pad, 96, size * 0.08, 2);
  ctx.globalAlpha = 1;

  // Hook — large, white, dominant
  const hookFontSize = Math.floor(size * 0.076 * (post.hookFontScale ?? 1));
  const hookLineH = Math.floor(hookFontSize * 1.22);
  ctx.fillStyle = hookColor;
  ctx.font = `900 ${hookFontSize}px ${font}, sans-serif`;
  ctx.textAlign = post.textAlign ?? "left";
  const hookLines = wrapTextWithAlign(ctx, truncate(post.hook, 72), pad, size * 0.18, size - pad * 2, hookLineH, 4, post.textAlign ?? "left");
  ctx.textAlign = "left";

  // Caption — inside the color block, white
  if (post.showCaption !== false && post.caption) {
    ctx.fillStyle = "rgba(255,255,255,0.88)";
    ctx.font = `400 ${Math.floor(size * 0.027)}px Inter, sans-serif`;
    ctx.textAlign = post.textAlign ?? "left";
    wrapTextWithAlign(ctx, truncate(post.caption, 100), pad, size * 0.755, size - pad * 2, Math.floor(size * 0.034), 2, post.textAlign ?? "left");
    ctx.textAlign = "left";
  }

  // CTA — bottom of color block, arrow style
  ctx.fillStyle = "rgba(255,255,255,0.95)";
  ctx.font = `700 ${Math.floor(size * 0.024)}px Inter, sans-serif`;
  ctx.fillText(`→ ${truncate(post.cta, 36)}`, pad, size - 36);

  // Hashtags — far right, small
  ctx.fillStyle = "rgba(255,255,255,0.4)";
  ctx.font = `400 ${Math.floor(size * 0.017)}px Inter, sans-serif`;
  ctx.textAlign = "right";
  ctx.fillText(truncate((post.hashtags ?? "").split(" ").slice(0, 4).join(" "), 50), size - pad, size - 36);
  ctx.textAlign = "left";

  void hookLines;
}

// ─── Template: GRADIENT ──────────────────────────────────────
// Rich radial glow, centered composition, magazine feel

async function renderGradient(ctx: CanvasRenderingContext2D, post: PostData, brand: BrandData, size: number) {
  const pad = 80;
  const dark = adjustColor(brand.primaryColor, -155);
  const mid = adjustColor(brand.primaryColor, -80);

  // Dark background
  ctx.fillStyle = dark;
  ctx.fillRect(0, 0, size, size);

  // Radial glow from center — rich depth
  const radial = ctx.createRadialGradient(size * 0.5, size * 0.45, 0, size * 0.5, size * 0.45, size * 0.65);
  radial.addColorStop(0, adjustColor(brand.primaryColor, -20) + "55");
  radial.addColorStop(0.5, mid + "22");
  radial.addColorStop(1, "transparent");
  ctx.fillStyle = radial;
  ctx.fillRect(0, 0, size, size);

  // Top edge accent — full width brand color stripe
  ctx.fillStyle = brand.primaryColor;
  ctx.fillRect(0, 0, size, 5);

  // Bottom edge stripe
  ctx.fillStyle = brand.primaryColor;
  ctx.globalAlpha = 0.4;
  ctx.fillRect(0, size - 3, size, 3);
  ctx.globalAlpha = 1;

  // Brand name — centered top
  ctx.fillStyle = brand.primaryColor;
  ctx.globalAlpha = 0.95;
  ctx.font = `700 ${Math.floor(size * 0.019)}px Inter, sans-serif`;
  ctx.textAlign = "center";
  ctx.letterSpacing = "4px";
  ctx.fillText(brand.name.toUpperCase().substring(0, 18), size / 2, 75);
  ctx.letterSpacing = "0px";
  ctx.globalAlpha = 1;

  // Hook — centered, very large
  const hookFontSize = Math.floor(size * 0.072 * (post.hookFontScale ?? 1));
  ctx.fillStyle = post.hookColor ?? "#ffffff";
  ctx.font = `900 ${hookFontSize}px ${post.fontFamily ?? "Inter"}, sans-serif`;
  ctx.textAlign = post.textAlign ?? "center";
  const hX = (post.textAlign === "left") ? pad : (post.textAlign === "right") ? size - pad : size / 2;
  wrapTextWithAlign(ctx, truncate(post.hook, 80), hX, size * 0.3, size - pad * 2, Math.floor(hookFontSize * 1.2), 3, post.textAlign ?? "center");
  ctx.textAlign = "left";

  // Thin divider line — centered
  ctx.fillStyle = brand.primaryColor;
  ctx.globalAlpha = 0.7;
  ctx.fillRect(size * 0.35, size * 0.62, size * 0.3, 2);
  ctx.globalAlpha = 1;

  // Caption — centered, below divider
  if (post.showCaption !== false && post.caption) {
    ctx.fillStyle = "rgba(255,255,255,0.72)";
    ctx.font = `400 ${Math.floor(size * 0.026)}px Inter, sans-serif`;
    ctx.textAlign = post.textAlign ?? "center";
    const cX = (post.textAlign === "left") ? pad : (post.textAlign === "right") ? size - pad : size / 2;
    wrapTextWithAlign(ctx, truncate(post.caption, 100), cX, size * 0.66, size - pad * 2, Math.floor(size * 0.033), 2, post.textAlign ?? "center");
    ctx.textAlign = "left";
  }

  // CTA pill — centered
  const ctaText = truncate(post.cta, 30);
  ctx.font = `700 ${Math.floor(size * 0.024)}px Inter, sans-serif`;
  const ctaW = ctx.measureText(ctaText).width + 80;
  const ctaX = (size - ctaW) / 2;
  const ctaY = size - 156;
  ctx.fillStyle = brand.primaryColor;
  roundRect(ctx, ctaX, ctaY, ctaW, 56, 28);
  ctx.fill();
  ctx.fillStyle = "#ffffff";
  ctx.textAlign = "center";
  ctx.fillText(ctaText, size / 2, ctaY + 38);
  ctx.textAlign = "left";

  // Hashtags
  ctx.fillStyle = "rgba(255,255,255,0.35)";
  ctx.font = `400 ${Math.floor(size * 0.017)}px Inter, sans-serif`;
  ctx.textAlign = "center";
  ctx.fillText(truncate((post.hashtags ?? "").split(" ").slice(0, 5).join(" "), 55), size / 2, size - 28);
  ctx.textAlign = "left";
}

// ─── Template: SPLIT ─────────────────────────────────────────
// Bold left color block + dark right panel — editorial asymmetry

async function renderSplit(ctx: CanvasRenderingContext2D, post: PostData, brand: BrandData, size: number) {
  const splitX = size * 0.54;
  const pad = 68;
  const dark = adjustColor(brand.primaryColor, -150);
  const rightW = size - splitX;

  // Right panel — very dark
  ctx.fillStyle = dark;
  ctx.fillRect(0, 0, size, size);

  // Left panel — brand primary
  ctx.fillStyle = brand.primaryColor;
  ctx.fillRect(0, 0, splitX, size);

  // Subtle diagonal overlay on left panel for depth
  const leftGrad = ctx.createLinearGradient(0, 0, splitX, size);
  leftGrad.addColorStop(0, "rgba(255,255,255,0.12)");
  leftGrad.addColorStop(1, "rgba(0,0,0,0.18)");
  ctx.fillStyle = leftGrad;
  ctx.fillRect(0, 0, splitX, size);

  // Right panel: huge ghost text — brand name
  ctx.fillStyle = "rgba(255,255,255,0.04)";
  ctx.font = `900 ${Math.floor(size * 0.22)}px Inter, sans-serif`;
  ctx.textAlign = "center";
  ctx.fillText((brand.name ?? "").substring(0, 4).toUpperCase(), splitX + rightW / 2, size * 0.55);
  ctx.textAlign = "left";

  // Right panel: brand name small — vertical center
  ctx.fillStyle = brand.primaryColor;
  ctx.globalAlpha = 0.85;
  ctx.font = `600 ${Math.floor(size * 0.017)}px Inter, sans-serif`;
  ctx.textAlign = "center";
  ctx.letterSpacing = "3px";
  ctx.fillText(brand.name.toUpperCase().substring(0, 12), splitX + rightW / 2, size * 0.88);
  ctx.letterSpacing = "0px";
  ctx.globalAlpha = 1;
  ctx.textAlign = "left";

  // Right panel: small accent dot
  ctx.beginPath();
  ctx.arc(splitX + rightW / 2, size * 0.92, 3, 0, Math.PI * 2);
  ctx.fillStyle = brand.primaryColor;
  ctx.globalAlpha = 0.6;
  ctx.fill();
  ctx.globalAlpha = 1;

  // Left: brand name — top, small
  ctx.fillStyle = "rgba(255,255,255,0.9)";
  ctx.font = `700 ${Math.floor(size * 0.018)}px Inter, sans-serif`;
  ctx.fillText(brand.name.toUpperCase().substring(0, 16), pad, 76);

  // Left: bold white horizontal rule
  ctx.fillStyle = "rgba(255,255,255,0.5)";
  ctx.fillRect(pad, 92, size * 0.12, 2);

  // Left: hook — large, white
  const hookFontSize = Math.floor(size * 0.068 * (post.hookFontScale ?? 1));
  ctx.fillStyle = post.hookColor ?? "#ffffff";
  ctx.font = `900 ${hookFontSize}px ${post.fontFamily ?? "Inter"}, sans-serif`;
  ctx.textAlign = post.textAlign ?? "left";
  const hookLines = wrapTextWithAlign(ctx, truncate(post.hook, 62), pad, size * 0.2, splitX - pad * 1.5, Math.floor(hookFontSize * 1.2), 4, post.textAlign ?? "left");
  ctx.textAlign = "left";

  // Left: thin divider
  const divY = size * 0.2 + hookLines * Math.floor(hookFontSize * 1.2) + 24;
  ctx.fillStyle = "rgba(255,255,255,0.3)";
  ctx.fillRect(pad, divY, size * 0.14, 1.5);

  // Left: caption
  if (post.showCaption !== false && post.caption) {
    ctx.fillStyle = "rgba(255,255,255,0.78)";
    ctx.font = `400 ${Math.floor(size * 0.024)}px Inter, sans-serif`;
    ctx.textAlign = post.textAlign ?? "left";
    wrapTextWithAlign(ctx, truncate(post.caption, 85), pad, divY + 40, splitX - pad * 1.5, Math.floor(size * 0.031), 3, post.textAlign ?? "left");
    ctx.textAlign = "left";
  }

  // Left: CTA — bottom, outlined pill
  const ctaY = size - 148;
  const ctaText = truncate(post.cta, 24);
  ctx.font = `700 ${Math.floor(size * 0.022)}px Inter, sans-serif`;
  const ctaW = Math.min(splitX - pad * 1.8, ctx.measureText(ctaText).width + 56);
  ctx.strokeStyle = "rgba(255,255,255,0.8)";
  ctx.lineWidth = 1.5;
  roundRect(ctx, pad, ctaY, ctaW, 50, 25);
  ctx.stroke();
  ctx.fillStyle = "rgba(255,255,255,0.95)";
  ctx.textAlign = "center";
  ctx.fillText(ctaText, pad + ctaW / 2, ctaY + 33);
  ctx.textAlign = "left";

  // Left: hashtags
  ctx.fillStyle = "rgba(255,255,255,0.35)";
  ctx.font = `400 ${Math.floor(size * 0.016)}px Inter, sans-serif`;
  ctx.fillText(truncate((post.hashtags ?? "").split(" ").slice(0, 4).join(" "), 44), pad, size - 30);
}

// ─── Template: EDITORIAL ─────────────────────────────────────
// Dark magazine — typographic hierarchy, brand color as sole accent

async function renderEditorial(ctx: CanvasRenderingContext2D, post: PostData, brand: BrandData, size: number) {
  const pad = 80;
  const dark = adjustColor(brand.primaryColor, -158);

  // Almost-black background
  ctx.fillStyle = dark;
  ctx.fillRect(0, 0, size, size);

  // Left edge brand color stripe — bold, narrow
  ctx.fillStyle = brand.primaryColor;
  ctx.fillRect(0, 0, 6, size);

  // Top right corner accent block
  ctx.fillStyle = brand.primaryColor;
  ctx.globalAlpha = 0.15;
  ctx.fillRect(size * 0.7, 0, size * 0.3, size * 0.3);
  ctx.globalAlpha = 1;

  // Brand name — top, brand color
  ctx.fillStyle = brand.primaryColor;
  ctx.font = `700 ${Math.floor(size * 0.02)}px Inter, sans-serif`;
  ctx.letterSpacing = "5px";
  ctx.fillText(brand.name.toUpperCase().substring(0, 16), pad, 78);
  ctx.letterSpacing = "0px";

  // Issue line — editorial feel
  ctx.fillStyle = "rgba(255,255,255,0.25)";
  ctx.font = `400 ${Math.floor(size * 0.016)}px Inter, sans-serif`;
  ctx.letterSpacing = "2px";
  ctx.fillText("CONTENT STRATEGY", pad, 108);
  ctx.letterSpacing = "0px";

  // Thick divider under header area
  ctx.fillStyle = brand.primaryColor;
  ctx.globalAlpha = 0.4;
  ctx.fillRect(pad, 124, size - pad * 2, 1);
  ctx.globalAlpha = 1;

  // Hook — large, white, left-aligned dominance
  const hookFontSize = Math.floor(size * 0.074 * (post.hookFontScale ?? 1));
  ctx.fillStyle = post.hookColor ?? "#ffffff";
  ctx.font = `900 ${hookFontSize}px ${post.fontFamily ?? "Inter"}, sans-serif`;
  ctx.textAlign = post.textAlign ?? "left";
  const hookLines = wrapTextWithAlign(ctx, truncate(post.hook, 80), pad, size * 0.19, size - pad * 2, Math.floor(hookFontSize * 1.22), 4, post.textAlign ?? "left");
  ctx.textAlign = "left";

  // Brand color accent line — after hook
  const accentY = size * 0.19 + hookLines * Math.floor(hookFontSize * 1.22) + 28;
  ctx.fillStyle = brand.primaryColor;
  ctx.fillRect(pad, accentY, size * 0.1, 3);

  // Caption — subdued, below accent
  if (post.showCaption !== false && post.caption) {
    ctx.fillStyle = "rgba(255,255,255,0.6)";
    ctx.font = `300 ${Math.floor(size * 0.027)}px Inter, sans-serif`;
    ctx.textAlign = post.textAlign ?? "left";
    wrapTextWithAlign(ctx, truncate(post.caption, 100), pad, accentY + 48, size - pad * 2, Math.floor(size * 0.034), 3, post.textAlign ?? "left");
    ctx.textAlign = "left";
  }

  // Bottom bar — brand color background for CTA
  ctx.fillStyle = brand.primaryColor;
  ctx.fillRect(0, size - 100, size, 100);

  // CTA — inside bottom bar, white
  ctx.fillStyle = "#ffffff";
  ctx.font = `700 ${Math.floor(size * 0.026)}px Inter, sans-serif`;
  ctx.fillText(`→ ${truncate(post.cta, 36)}`, pad, size - 56);

  // Hashtags — right side of bottom bar
  ctx.fillStyle = "rgba(255,255,255,0.55)";
  ctx.font = `400 ${Math.floor(size * 0.017)}px Inter, sans-serif`;
  ctx.textAlign = "right";
  ctx.fillText(truncate((post.hashtags ?? "").split(" ").slice(0, 4).join(" "), 50), size - pad, size - 56);
  ctx.textAlign = "left";

  void hookLines;
}

// ─── Logo Overlay ─────────────────────────────────────────────

async function drawLogo(ctx: CanvasRenderingContext2D, brand: BrandData, size: number) {
  const src = brand.logoBase64;
  if (!src) return;
  // Accept both base64 data URLs and HTTPS URLs
  if (!src.startsWith("data:") && !src.startsWith("http")) return;
  try {
    const img = await loadImage(src);
    const logoSize = Math.floor(size * 0.12);
    const pad = Math.floor(size * 0.045);

    // White rounded background for logo
    ctx.fillStyle = "rgba(255,255,255,0.15)";
    roundRect(ctx, size - logoSize - pad - 8, pad - 8, logoSize + 16, logoSize + 16, 12);
    ctx.fill();

    ctx.drawImage(img, size - logoSize - pad, pad, logoSize, logoSize);
  } catch {
    // Logo failed to load — skip silently
  }
}

// ─── Canvas Utilities ─────────────────────────────────────────

function wrapText(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  lineHeight: number,
  maxLines: number
): number {
  const words = text.split(" ");
  let line = "";
  let lineCount = 0;

  for (const word of words) {
    const test = line ? `${line} ${word}` : word;
    if (ctx.measureText(test).width > maxWidth && line) {
      ctx.fillText(line, x, y + lineCount * lineHeight);
      line = word;
      lineCount++;
      if (lineCount >= maxLines) break;
    } else {
      line = test;
    }
  }
  if (lineCount < maxLines && line) {
    ctx.fillText(line, x, y + lineCount * lineHeight);
    lineCount++;
  }
  return lineCount;
}

function wrapTextCentered(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  lineHeight: number,
  maxLines: number
): number {
  const words = text.split(" ");
  let line = "";
  let lineCount = 0;

  for (const word of words) {
    const test = line ? `${line} ${word}` : word;
    if (ctx.measureText(test).width > maxWidth && line) {
      ctx.fillText(line, x, y + lineCount * lineHeight);
      line = word;
      lineCount++;
      if (lineCount >= maxLines) break;
    } else {
      line = test;
    }
  }
  if (lineCount < maxLines && line) {
    ctx.fillText(line, x, y + lineCount * lineHeight);
    lineCount++;
  }
  return lineCount;
}

function wrapTextWithAlign(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  lineHeight: number,
  maxLines: number,
  align: "left" | "center" | "right"
): number {
  const words = text.split(" ");
  let line = "";
  let lineCount = 0;

  // Save original textAlign
  const originalAlign = ctx.textAlign as CanvasTextAlign;

  for (const word of words) {
    const test = line ? `${line} ${word}` : word;
    if (ctx.measureText(test).width > maxWidth && line) {
      ctx.textAlign = align;
      const drawX = align === "center" ? x + maxWidth / 2 : align === "right" ? x + maxWidth : x;
      ctx.fillText(line, drawX, y + lineCount * lineHeight);
      line = word;
      lineCount++;
      if (lineCount >= maxLines) break;
    } else {
      line = test;
    }
  }
  if (lineCount < maxLines && line) {
    ctx.textAlign = align;
    const drawX = align === "center" ? x + maxWidth / 2 : align === "right" ? x + maxWidth : x;
    ctx.fillText(line, drawX, y + lineCount * lineHeight);
    lineCount++;
  }

  // Restore original textAlign
  ctx.textAlign = originalAlign;
  return lineCount;
}

function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number, y: number,
  w: number, h: number,
  r: number
) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.arcTo(x + w, y, x + w, y + r, r);
  ctx.lineTo(x + w, y + h - r);
  ctx.arcTo(x + w, y + h, x + w - r, y + h, r);
  ctx.lineTo(x + r, y + h);
  ctx.arcTo(x, y + h, x, y + h - r, r);
  ctx.lineTo(x, y + r);
  ctx.arcTo(x, y, x + r, y, r);
  ctx.closePath();
}

/**
 * Upload rendered canvas blob to Supabase
 */
export async function uploadRenderedImage(
  blobUrl: string,
  brandId: string,
  postGroup: number
): Promise<string | null> {
  try {
    const response = await fetch(blobUrl);
    const blob = await response.blob();
    const formData = new FormData();
    formData.append("file", blob, `post-${postGroup}.jpg`);
    formData.append("brandId", brandId);
    formData.append("postGroup", String(postGroup));

    const res = await fetch("/api/upload-post-image", {
      method: "POST",
      body: formData,
    });

    if (!res.ok) return null;
    const data = await res.json();
    return data.url ?? null;
  } catch {
    return null;
  }
}
