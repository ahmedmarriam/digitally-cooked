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
  rawColors?: string;
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

// ─── Smart Brand Color Helpers ────────────────────────────────

// Parse all hex colors from a brand_colors string
function parseAllHex(s: string): string[] {
  const matches = (s ?? "").match(/#[0-9A-Fa-f]{6}/g) ?? [];
  return matches.length > 0 ? matches : [];
}

// Find the most visually vibrant color (high saturation, not pure black/white)
function getMostVibrant(colors: string[]): string {
  if (colors.length === 0) return "#7B2FFF";
  let best = colors[0];
  let bestScore = -1;
  for (const hex of colors) {
    const c = hex.replace("#", "").padEnd(6, "0");
    const r = parseInt(c.slice(0,2),16)/255;
    const g = parseInt(c.slice(2,4),16)/255;
    const b = parseInt(c.slice(4,6),16)/255;
    const max = Math.max(r,g,b), min = Math.min(r,g,b);
    const sat = max === 0 ? 0 : (max - min) / max;
    const lum = 0.299*r + 0.587*g + 0.114*b;
    // Prefer saturated colors, penalise near-black and near-white
    const score = sat * (1 - Math.pow(lum * 2 - 1, 2) * 0.7);
    if (score > bestScore) { bestScore = score; best = hex; }
  }
  return best;
}

// Create a very dark background tinted by the accent color (looks branded, not generic black)
function getDarkBg(accent: string): string {
  const c = accent.replace("#", "").padEnd(6, "0");
  const r = Math.max(8, Math.round(parseInt(c.slice(0,2),16) * 0.07));
  const g = Math.max(8, Math.round(parseInt(c.slice(2,4),16) * 0.07));
  const b = Math.max(8, Math.round(parseInt(c.slice(4,6),16) * 0.07));
  return `#${r.toString(16).padStart(2,"0")}${g.toString(16).padStart(2,"0")}${b.toString(16).padStart(2,"0")}`;
}

// Smart brand colors — always finds the best accent from ALL brand colors
function getSmartColors(brand: BrandData): { bg: string; accent: string; onAccent: string } {
  const all = parseAllHex(brand.rawColors ?? "");
  const candidates = all.length > 0 ? all : [brand.primaryColor, brand.secondaryColor];
  const accent = getMostVibrant(candidates);
  const bg = getDarkBg(accent);
  const onAccent = getContrastColor(accent);
  return { bg, accent, onAccent };
}

// ─── Template: BOLD ──────────────────────────────────────────
// Dark base, large brand color block at bottom, dominant hook text

async function renderBold(ctx: CanvasRenderingContext2D, post: PostData, brand: BrandData, size: number) {
  const { bg, accent, onAccent } = getSmartColors(brand);
  const pad = 72;
  const font = post.fontFamily ?? "Inter";

  // Dark tinted background
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, size, size);

  // Ghost initial watermark — subtle, top right
  const initial = (brand.name ?? "B").charAt(0).toUpperCase();
  ctx.save();
  ctx.globalAlpha = 0.06;
  ctx.fillStyle = accent;
  ctx.font = `900 ${Math.floor(size * 0.70)}px ${font}, sans-serif`;
  ctx.textAlign = "right";
  ctx.fillText(initial, size + size * 0.06, size * 0.70);
  ctx.textAlign = "left";
  ctx.restore();

  // Accent color block — bottom 30%
  ctx.fillStyle = accent;
  ctx.fillRect(0, size * 0.70, size, size * 0.30);

  // Thin separator
  ctx.fillStyle = "rgba(255,255,255,0.15)";
  ctx.fillRect(0, size * 0.70, size, 1.5);

  // Brand name — top left, accent colored
  ctx.fillStyle = accent;
  ctx.font = `700 ${Math.floor(size * 0.019)}px ${font}, sans-serif`;
  Object.assign(ctx, { letterSpacing: "3px" });
  ctx.fillText(brand.name.toUpperCase().substring(0, 18), pad, 78);
  Object.assign(ctx, { letterSpacing: "0px" });

  // Thin accent bar under brand name
  ctx.save();
  ctx.globalAlpha = 0.5;
  ctx.fillStyle = accent;
  ctx.fillRect(pad, 94, size * 0.09, 2);
  ctx.restore();

  // Hook — huge, white, dominant
  const hookFontSize = Math.floor(size * 0.076 * (post.hookFontScale ?? 1));
  const hookLineH = Math.floor(hookFontSize * 1.22);
  ctx.fillStyle = post.hookColor ?? "#ffffff";
  ctx.font = `900 ${hookFontSize}px ${font}, sans-serif`;
  ctx.textAlign = post.textAlign ?? "left";
  wrapTextWithAlign(ctx, truncate(post.hook, 72), pad, size * 0.18, size - pad * 2, hookLineH, 4, post.textAlign ?? "left");
  ctx.textAlign = "left";

  // Caption — inside accent block
  if (post.showCaption !== false && post.caption) {
    ctx.fillStyle = onAccent === "#111111" ? "rgba(0,0,0,0.82)" : "rgba(255,255,255,0.90)";
    ctx.font = `400 ${Math.floor(size * 0.027)}px Inter, sans-serif`;
    ctx.textAlign = post.textAlign ?? "left";
    wrapTextWithAlign(ctx, truncate(post.caption, 100), pad, size * 0.745, size - pad * 2, Math.floor(size * 0.034), 2, post.textAlign ?? "left");
    ctx.textAlign = "left";
  }

  // CTA — bottom of block
  ctx.fillStyle = onAccent === "#111111" ? "rgba(0,0,0,0.92)" : "rgba(255,255,255,0.96)";
  ctx.font = `700 ${Math.floor(size * 0.024)}px Inter, sans-serif`;
  ctx.fillText(`→ ${truncate(post.cta, 36)}`, pad, size - 34);

  // Hashtags — right side
  ctx.fillStyle = onAccent === "#111111" ? "rgba(0,0,0,0.45)" : "rgba(255,255,255,0.45)";
  ctx.font = `400 ${Math.floor(size * 0.017)}px Inter, sans-serif`;
  ctx.textAlign = "right";
  ctx.fillText(truncate((post.hashtags ?? "").split(" ").slice(0, 4).join(" "), 50), size - pad, size - 34);
  ctx.textAlign = "left";
}

// ─── Template: GRADIENT ──────────────────────────────────────
// Rich radial glow, centered composition, magazine feel

async function renderGradient(ctx: CanvasRenderingContext2D, post: PostData, brand: BrandData, size: number) {
  const { bg, accent } = getSmartColors(brand);
  const pad = 80;

  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, size, size);

  // Large radial glow — much more visible than before
  const radial = ctx.createRadialGradient(size * 0.5, size * 0.42, 0, size * 0.5, size * 0.42, size * 0.60);
  radial.addColorStop(0, accent + "55");
  radial.addColorStop(0.45, accent + "22");
  radial.addColorStop(1, "transparent");
  ctx.fillStyle = radial;
  ctx.fillRect(0, 0, size, size);

  // Top stripe
  ctx.fillStyle = accent;
  ctx.fillRect(0, 0, size, 6);

  // Bottom stripe
  ctx.save();
  ctx.globalAlpha = 0.5;
  ctx.fillStyle = accent;
  ctx.fillRect(0, size - 4, size, 4);
  ctx.restore();

  // Brand name — centered top
  ctx.fillStyle = accent;
  ctx.font = `700 ${Math.floor(size * 0.019)}px Inter, sans-serif`;
  ctx.textAlign = "center";
  Object.assign(ctx, { letterSpacing: "4px" });
  ctx.fillText(brand.name.toUpperCase().substring(0, 18), size / 2, 70);
  Object.assign(ctx, { letterSpacing: "0px" });
  ctx.textAlign = "left";

  // Hook — centered, large, white
  const hookFontSize = Math.floor(size * 0.072 * (post.hookFontScale ?? 1));
  ctx.fillStyle = post.hookColor ?? "#ffffff";
  ctx.font = `900 ${hookFontSize}px ${post.fontFamily ?? "Inter"}, sans-serif`;
  ctx.textAlign = post.textAlign ?? "center";
  const hX = (post.textAlign === "left") ? pad : (post.textAlign === "right") ? size - pad : size / 2;
  wrapTextWithAlign(ctx, truncate(post.hook, 80), hX, size * 0.29, size - pad * 2, Math.floor(hookFontSize * 1.22), 3, post.textAlign ?? "center");
  ctx.textAlign = "left";

  // Accent divider — centered, visible
  ctx.save();
  ctx.globalAlpha = 0.8;
  ctx.fillStyle = accent;
  ctx.fillRect(size * 0.32, size * 0.635, size * 0.36, 2.5);
  ctx.restore();

  // Caption
  if (post.showCaption !== false && post.caption) {
    ctx.fillStyle = "rgba(255,255,255,0.72)";
    ctx.font = `400 ${Math.floor(size * 0.026)}px Inter, sans-serif`;
    ctx.textAlign = post.textAlign ?? "center";
    const cX = (post.textAlign === "left") ? pad : (post.textAlign === "right") ? size - pad : size / 2;
    wrapTextWithAlign(ctx, truncate(post.caption, 100), cX, size * 0.67, size - pad * 2, Math.floor(size * 0.033), 2, post.textAlign ?? "center");
    ctx.textAlign = "left";
  }

  // CTA — accent filled pill
  const ctaText = truncate(post.cta, 30);
  ctx.font = `700 ${Math.floor(size * 0.024)}px Inter, sans-serif`;
  const ctaW = Math.min(size - pad * 4, ctx.measureText(ctaText).width + 80);
  const ctaX = (size - ctaW) / 2;
  const ctaY = size - 148;
  ctx.fillStyle = accent;
  roundRect(ctx, ctaX, ctaY, ctaW, 56, 28);
  ctx.fill();
  ctx.fillStyle = getContrastColor(accent);
  ctx.font = `700 ${Math.floor(size * 0.024)}px Inter, sans-serif`;
  ctx.textAlign = "center";
  ctx.fillText(ctaText, size / 2, ctaY + 38);
  ctx.textAlign = "left";

  // Hashtags
  ctx.fillStyle = "rgba(255,255,255,0.35)";
  ctx.font = `400 ${Math.floor(size * 0.017)}px Inter, sans-serif`;
  ctx.textAlign = "center";
  ctx.fillText(truncate((post.hashtags ?? "").split(" ").slice(0, 5).join(" "), 55), size / 2, size - 26);
  ctx.textAlign = "left";
}

// ─── Template: SPLIT ─────────────────────────────────────────
// Bold left color block + dark right panel — editorial asymmetry

async function renderSplit(ctx: CanvasRenderingContext2D, post: PostData, brand: BrandData, size: number) {
  const { bg, accent, onAccent } = getSmartColors(brand);
  const splitX = size * 0.52;
  const pad = 60;
  const rightW = size - splitX;

  // Right dark panel
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, size, size);

  // Left accent panel — the hero element
  ctx.fillStyle = accent;
  ctx.fillRect(0, 0, splitX, size);

  // Subtle depth on left panel
  const leftGrad = ctx.createLinearGradient(0, 0, 0, size);
  leftGrad.addColorStop(0, "rgba(255,255,255,0.10)");
  leftGrad.addColorStop(1, "rgba(0,0,0,0.15)");
  ctx.fillStyle = leftGrad;
  ctx.fillRect(0, 0, splitX, size);

  // Right: ghost brand name watermark
  ctx.save();
  ctx.globalAlpha = 0.05;
  ctx.fillStyle = accent;
  ctx.font = `900 ${Math.floor(size * 0.20)}px Inter, sans-serif`;
  ctx.textAlign = "center";
  ctx.fillText((brand.name ?? "").substring(0, 5).toUpperCase(), splitX + rightW / 2, size * 0.52);
  ctx.textAlign = "left";
  ctx.restore();

  // Right: small brand name — bottom center
  ctx.save();
  ctx.globalAlpha = 0.65;
  ctx.fillStyle = accent;
  ctx.font = `600 ${Math.floor(size * 0.017)}px Inter, sans-serif`;
  ctx.textAlign = "center";
  Object.assign(ctx, { letterSpacing: "3px" });
  ctx.fillText(brand.name.toUpperCase().substring(0, 12), splitX + rightW / 2, size * 0.88);
  Object.assign(ctx, { letterSpacing: "0px" });
  ctx.textAlign = "left";
  ctx.restore();

  // Left: brand name top
  ctx.save();
  ctx.globalAlpha = 0.85;
  ctx.fillStyle = onAccent;
  ctx.font = `700 ${Math.floor(size * 0.018)}px Inter, sans-serif`;
  Object.assign(ctx, { letterSpacing: "2px" });
  ctx.fillText(brand.name.toUpperCase().substring(0, 16), pad, 75);
  Object.assign(ctx, { letterSpacing: "0px" });
  ctx.restore();

  // Left: thin rule
  ctx.save();
  ctx.globalAlpha = 0.35;
  ctx.fillStyle = onAccent;
  ctx.fillRect(pad, 90, size * 0.11, 1.5);
  ctx.restore();

  // Left: hook — on accent color (black text on green = stunning)
  const hookFontSize = Math.floor(size * 0.066 * (post.hookFontScale ?? 1));
  const hookLineH = Math.floor(hookFontSize * 1.22);
  ctx.fillStyle = onAccent;
  ctx.font = `900 ${hookFontSize}px ${post.fontFamily ?? "Inter"}, sans-serif`;
  ctx.textAlign = post.textAlign ?? "left";
  const hookLines = wrapTextWithAlign(ctx, truncate(post.hook, 58), pad, size * 0.20, splitX - pad * 1.6, hookLineH, 4, post.textAlign ?? "left");
  ctx.textAlign = "left";

  // Left: divider after hook
  const divY = size * 0.20 + hookLines * hookLineH + 22;
  ctx.save();
  ctx.globalAlpha = 0.30;
  ctx.fillStyle = onAccent;
  ctx.fillRect(pad, divY, size * 0.13, 1.5);
  ctx.restore();

  // Left: caption
  if (post.showCaption !== false && post.caption) {
    ctx.save();
    ctx.globalAlpha = onAccent === "#111111" ? 0.70 : 0.80;
    ctx.fillStyle = onAccent;
    ctx.font = `400 ${Math.floor(size * 0.024)}px Inter, sans-serif`;
    ctx.textAlign = post.textAlign ?? "left";
    wrapTextWithAlign(ctx, truncate(post.caption, 85), pad, divY + 36, splitX - pad * 1.6, Math.floor(size * 0.031), 3, post.textAlign ?? "left");
    ctx.textAlign = "left";
    ctx.restore();
  }

  // Left: CTA outlined pill
  const ctaY = size - 148;
  const ctaText = truncate(post.cta, 22);
  ctx.font = `700 ${Math.floor(size * 0.022)}px Inter, sans-serif`;
  const ctaW = Math.min(splitX - pad * 1.8, ctx.measureText(ctaText).width + 52);
  ctx.strokeStyle = onAccent === "#111111" ? "rgba(0,0,0,0.70)" : "rgba(255,255,255,0.80)";
  ctx.lineWidth = 2;
  roundRect(ctx, pad, ctaY, ctaW, 50, 25);
  ctx.stroke();
  ctx.fillStyle = onAccent === "#111111" ? "rgba(0,0,0,0.88)" : "rgba(255,255,255,0.95)";
  ctx.textAlign = "center";
  ctx.fillText(ctaText, pad + ctaW / 2, ctaY + 33);
  ctx.textAlign = "left";

  // Left: hashtags
  ctx.save();
  ctx.globalAlpha = 0.40;
  ctx.fillStyle = onAccent;
  ctx.font = `400 ${Math.floor(size * 0.016)}px Inter, sans-serif`;
  ctx.fillText(truncate((post.hashtags ?? "").split(" ").slice(0, 3).join(" "), 36), pad, size - 28);
  ctx.restore();
}

// ─── Template: EDITORIAL ─────────────────────────────────────
// Dark magazine — typographic hierarchy, brand color as sole accent

async function renderEditorial(ctx: CanvasRenderingContext2D, post: PostData, brand: BrandData, size: number) {
  const { bg, accent, onAccent } = getSmartColors(brand);
  const pad = 82;

  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, size, size);

  // Left edge — thick accent stripe
  ctx.fillStyle = accent;
  ctx.fillRect(0, 0, 8, size);

  // Top right corner accent block
  ctx.save();
  ctx.globalAlpha = 0.18;
  ctx.fillStyle = accent;
  ctx.fillRect(size * 0.68, 0, size * 0.32, size * 0.32);
  ctx.restore();

  // Inner corner detail (nested accent block)
  ctx.save();
  ctx.globalAlpha = 0.32;
  ctx.fillStyle = accent;
  ctx.fillRect(size * 0.78, size * 0.04, size * 0.18, size * 0.18);
  ctx.restore();

  // Brand name — top left, accent color
  ctx.fillStyle = accent;
  ctx.font = `700 ${Math.floor(size * 0.020)}px Inter, sans-serif`;
  Object.assign(ctx, { letterSpacing: "5px" });
  ctx.fillText(brand.name.toUpperCase().substring(0, 16), pad, 76);
  Object.assign(ctx, { letterSpacing: "0px" });

  // Editorial label
  ctx.fillStyle = "rgba(255,255,255,0.22)";
  ctx.font = `400 ${Math.floor(size * 0.016)}px Inter, sans-serif`;
  Object.assign(ctx, { letterSpacing: "2px" });
  ctx.fillText("SOCIAL CONTENT", pad, 106);
  Object.assign(ctx, { letterSpacing: "0px" });

  // Header divider
  ctx.save();
  ctx.globalAlpha = 0.35;
  ctx.fillStyle = accent;
  ctx.fillRect(pad, 122, size - pad * 2, 1);
  ctx.restore();

  // Hook — very large, white, dominant
  const hookFontSize = Math.floor(size * 0.074 * (post.hookFontScale ?? 1));
  const hookLineH = Math.floor(hookFontSize * 1.22);
  ctx.fillStyle = post.hookColor ?? "#ffffff";
  ctx.font = `900 ${hookFontSize}px ${post.fontFamily ?? "Inter"}, sans-serif`;
  ctx.textAlign = post.textAlign ?? "left";
  const hookLines = wrapTextWithAlign(ctx, truncate(post.hook, 80), pad, size * 0.195, size - pad * 2, hookLineH, 4, post.textAlign ?? "left");
  ctx.textAlign = "left";

  // Accent underline after hook
  const accentY = size * 0.195 + hookLines * hookLineH + 24;
  ctx.fillStyle = accent;
  ctx.fillRect(pad, accentY, size * 0.12, 3);

  // Caption
  if (post.showCaption !== false && post.caption) {
    ctx.fillStyle = "rgba(255,255,255,0.60)";
    ctx.font = `300 ${Math.floor(size * 0.027)}px Inter, sans-serif`;
    ctx.textAlign = post.textAlign ?? "left";
    wrapTextWithAlign(ctx, truncate(post.caption, 100), pad, accentY + 46, size - pad * 2, Math.floor(size * 0.034), 3, post.textAlign ?? "left");
    ctx.textAlign = "left";
  }

  // Bottom accent bar
  ctx.fillStyle = accent;
  ctx.fillRect(0, size - 98, size, 98);

  // CTA in bottom bar
  ctx.fillStyle = onAccent === "#111111" ? "rgba(0,0,0,0.90)" : "rgba(255,255,255,0.97)";
  ctx.font = `700 ${Math.floor(size * 0.026)}px Inter, sans-serif`;
  ctx.fillText(`→ ${truncate(post.cta, 36)}`, pad, size - 54);

  // Hashtags right side of bottom bar
  ctx.fillStyle = onAccent === "#111111" ? "rgba(0,0,0,0.50)" : "rgba(255,255,255,0.55)";
  ctx.font = `400 ${Math.floor(size * 0.017)}px Inter, sans-serif`;
  ctx.textAlign = "right";
  ctx.fillText(truncate((post.hashtags ?? "").split(" ").slice(0, 4).join(" "), 50), size - pad, size - 54);
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
