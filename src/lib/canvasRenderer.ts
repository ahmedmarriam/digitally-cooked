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

async function renderBold(ctx: CanvasRenderingContext2D, post: PostData, brand: BrandData, size: number) {
  const lighter = adjustColor(brand.primaryColor, 40);
  const darker = adjustColor(brand.primaryColor, -60);
  const tc = brand.textColor;
  const pad = 80;
  const font = post.fontFamily ?? "Inter";
  const hookColor = post.hookColor ?? tc;

  // Background gradient — diagonal
  const grad = ctx.createLinearGradient(0, 0, size * 0.4, size);
  grad.addColorStop(0, lighter);
  grad.addColorStop(1, darker);
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, size, size);

  // Decorative circles
  ctx.beginPath();
  ctx.arc(size * 0.88, size * 0.12, size * 0.3, 0, Math.PI * 2);
  ctx.fillStyle = "rgba(255,255,255,0.07)";
  ctx.fill();

  ctx.beginPath();
  ctx.arc(size * 0.08, size * 0.9, size * 0.2, 0, Math.PI * 2);
  ctx.fillStyle = "rgba(255,255,255,0.04)";
  ctx.fill();

  // Brand name — small caps, top
  ctx.fillStyle = tc;
  ctx.globalAlpha = 0.55;
  ctx.font = `700 ${Math.floor(size * 0.02)}px ${font}, sans-serif`;
  ctx.fillText(brand.name.toUpperCase().substring(0, 20), pad, 86);
  ctx.globalAlpha = 1;

  // Calculate text Y position based on textY (0=top, 100=bottom)
  const baseHookY = 195;
  const textYPos = post.textY ?? 100;
  const yOffset = calculateTextYOffset(size, 200, textYPos) - (baseHookY + 100);  // Center point

  // Hook — large, punchy
  ctx.fillStyle = hookColor;
  ctx.font = `900 ${Math.floor(size * 0.07 * (post.hookFontScale ?? 1))}px ${font}, sans-serif`;
  ctx.textAlign = post.textAlign ?? "left";
  const hookY = baseHookY + yOffset;
  const hookLines = wrapTextWithAlign(ctx, truncate(post.hook, 70), pad, hookY, size - pad * 2, Math.floor(size * 0.085 * (post.hookFontScale ?? 1)), 3, post.textAlign ?? "left");
  ctx.textAlign = "left";

  // Thin accent line after hook
  const divY = hookY + hookLines * Math.floor(size * 0.085) + 28;
  ctx.fillStyle = tc;
  ctx.globalAlpha = 0.35;
  ctx.fillRect(pad, divY, size * 0.22, 2);
  ctx.globalAlpha = 1;

  // Caption — readable body text (respect showCaption flag)
  if (post.showCaption !== false) {
    ctx.fillStyle = tc;
    ctx.globalAlpha = 0.78;
    ctx.font = `400 ${Math.floor(size * 0.028)}px Inter, sans-serif`;
    ctx.textAlign = post.textAlign ?? "left";
    wrapTextWithAlign(ctx, truncate(post.caption, 110), pad, divY + 46, size - pad * 2, Math.floor(size * 0.036), 3, post.textAlign ?? "left");
    ctx.textAlign = "left";
    ctx.globalAlpha = 1;
  }

  // CTA — solid white pill
  const ctaY = size - 190;
  const ctaW = Math.min(size * 0.62, post.cta.length * 15 + 80);
  ctx.fillStyle = "rgba(255,255,255,0.18)";
  roundRect(ctx, pad, ctaY, ctaW, 62, 31);
  ctx.fill();
  ctx.strokeStyle = tc;
  ctx.lineWidth = 1.5;
  ctx.globalAlpha = 0.5;
  roundRect(ctx, pad, ctaY, ctaW, 62, 31);
  ctx.stroke();
  ctx.globalAlpha = 1;

  ctx.fillStyle = tc;
  ctx.font = `700 ${Math.floor(size * 0.025)}px Inter, sans-serif`;
  ctx.textAlign = "center";
  ctx.fillText(truncate(post.cta, 32), pad + ctaW / 2, ctaY + 40);
  ctx.textAlign = "left";

}

// ─── Template: GRADIENT ──────────────────────────────────────

async function renderGradient(ctx: CanvasRenderingContext2D, post: PostData, brand: BrandData, size: number) {
  const tc = brand.textColor;
  const pad = 100;

  // Diagonal gradient
  const grad = ctx.createLinearGradient(0, 0, size, size);
  grad.addColorStop(0, adjustColor(brand.primaryColor, 30));
  grad.addColorStop(0.5, brand.primaryColor);
  grad.addColorStop(1, brand.secondaryColor);
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, size, size);

  // Decorative circles
  ctx.beginPath();
  ctx.arc(size * 0.9, size * 0.1, size * 0.3, 0, Math.PI * 2);
  ctx.fillStyle = "rgba(255,255,255,0.06)";
  ctx.fill();

  ctx.beginPath();
  ctx.arc(size * 0.1, size * 0.85, size * 0.24, 0, Math.PI * 2);
  ctx.fillStyle = "rgba(255,255,255,0.05)";
  ctx.fill();

  // Brand name (centered)
  ctx.fillStyle = tc;
  ctx.globalAlpha = 0.65;
  ctx.font = `700 ${Math.floor(size * 0.02)}px Inter, sans-serif`;
  ctx.textAlign = "center";
  ctx.fillText(brand.name.toUpperCase().substring(0, 20), size / 2, 90);
  ctx.globalAlpha = 1;

  // Calculate text Y position based on textY (0=top, 100=bottom)
  const baseHookY = 280;
  const textYPos = post.textY ?? 100;
  const yOffset = calculateTextYOffset(size, 200, textYPos) - (baseHookY + 100);

  // Hook (use textAlign if customized, else centered)
  const hookY = baseHookY + yOffset;
  ctx.fillStyle = post.hookColor ?? tc;
  ctx.font = `900 ${Math.floor(size * 0.065 * (post.hookFontScale ?? 1))}px ${post.fontFamily ?? "Inter"}, sans-serif`;
  if (post.textAlign && post.textAlign !== "center") {
    // Use custom alignment
    ctx.textAlign = post.textAlign;
    const alignX = post.textAlign === "right" ? size - pad : pad;
    wrapTextWithAlign(ctx, truncate(post.hook, 80), alignX, hookY, size - pad * 2, Math.floor(size * 0.08), 3, post.textAlign);
  } else {
    // Default centered
    ctx.textAlign = "center";
    wrapTextCentered(ctx, truncate(post.hook, 80), size / 2, hookY, size - pad * 2, Math.floor(size * 0.08), 3);
  }

  // Caption (centered by default, respects showCaption flag)
  if (post.showCaption !== false) {
    ctx.fillStyle = tc;
    ctx.globalAlpha = 0.78;
    ctx.font = `400 ${Math.floor(size * 0.027)}px Inter, sans-serif`;
    const captionY = hookY + 250;  // Offset from hook
    if (post.textAlign && post.textAlign !== "center") {
      ctx.textAlign = post.textAlign;
      const alignX = post.textAlign === "right" ? size - pad : pad;
      wrapTextWithAlign(ctx, truncate(post.caption, 100), alignX, captionY, size - pad * 2, Math.floor(size * 0.034), 2, post.textAlign);
    } else {
      ctx.textAlign = "center";
      wrapTextCentered(ctx, truncate(post.caption, 100), size / 2, captionY, size - pad * 2, Math.floor(size * 0.034), 2);
    }
    ctx.globalAlpha = 1;
  }

  // CTA Button (centered)
  const ctaW = Math.min(size * 0.5, post.cta.length * 18 + 100);
  const ctaX = (size - ctaW) / 2;
  const ctaY = size - 200;
  ctx.fillStyle = "rgba(255,255,255,0.92)";
  roundRect(ctx, ctaX, ctaY, ctaW, 68, 34);
  ctx.fill();

  ctx.fillStyle = brand.primaryColor;
  ctx.font = `700 ${Math.floor(size * 0.027)}px Inter, sans-serif`;
  ctx.textAlign = "center";
  ctx.fillText(truncate(post.cta, 28), size / 2, ctaY + 44);

  // Hashtags (centered)
  ctx.fillStyle = tc;
  ctx.globalAlpha = 0.45;
  ctx.font = `400 ${Math.floor(size * 0.019)}px Inter, sans-serif`;
  ctx.textAlign = "center";
  ctx.fillText(truncate((post.hashtags ?? "").split(" ").slice(0, 5).join(" "), 60), size / 2, size - 30);
  ctx.globalAlpha = 1;
  ctx.textAlign = "left";
}

// ─── Template: SPLIT ─────────────────────────────────────────

async function renderSplit(ctx: CanvasRenderingContext2D, post: PostData, brand: BrandData, size: number) {
  const splitX = size * 0.58;
  const pad = 72;
  const tc = brand.textColor;
  const rightBg = adjustColor(brand.primaryColor, -90);
  const rightW = size - splitX;

  // Left panel — brand primary color
  ctx.fillStyle = brand.primaryColor;
  ctx.fillRect(0, 0, splitX, size);

  // Right panel — darker shade
  ctx.fillStyle = rightBg;
  ctx.fillRect(splitX, 0, rightW, size);

  // Right panel: large decorative brand initial letter
  const initial = (brand.name ?? "B").charAt(0).toUpperCase();
  ctx.fillStyle = "rgba(255,255,255,0.06)";
  ctx.font = `900 ${Math.floor(size * 0.55)}px Inter, sans-serif`;
  ctx.textAlign = "center";
  ctx.fillText(initial, splitX + rightW / 2, size * 0.68);
  ctx.textAlign = "left";

  // Right panel: vertical brand name
  ctx.save();
  ctx.translate(splitX + rightW / 2, size * 0.85);
  ctx.fillStyle = "rgba(255,255,255,0.35)";
  ctx.font = `700 ${Math.floor(size * 0.018)}px Inter, sans-serif`;
  ctx.textAlign = "center";
  ctx.fillText(brand.name.toUpperCase().substring(0, 14), 0, 0);
  ctx.restore();
  ctx.textAlign = "left";

  // Right panel: accent line
  ctx.fillStyle = tc;
  ctx.globalAlpha = 0.25;
  ctx.fillRect(splitX + rightW * 0.2, size * 0.88, rightW * 0.6, 2);
  ctx.globalAlpha = 1;

  // Left: brand name top
  ctx.fillStyle = tc;
  ctx.globalAlpha = 0.55;
  ctx.font = `700 ${Math.floor(size * 0.019)}px Inter, sans-serif`;
  ctx.letterSpacing = "2px";
  ctx.fillText(brand.name.toUpperCase().substring(0, 18), pad, 88);
  ctx.letterSpacing = "0px";
  ctx.globalAlpha = 1;

  // Calculate text Y position based on textY (0=top, 100=bottom)
  const baseHookY = 210;
  const textYPos = post.textY ?? 100;
  const yOffset = calculateTextYOffset(size, 200, textYPos) - (baseHookY + 100);

  // Left: hook — large and bold (use editor customizations)
  const hookY = baseHookY + yOffset;
  ctx.fillStyle = post.hookColor ?? tc;
  ctx.font = `900 ${Math.floor(size * 0.064 * (post.hookFontScale ?? 1))}px ${post.fontFamily ?? "Inter"}, sans-serif`;
  ctx.textAlign = post.textAlign ?? "left";
  const hookLines = wrapTextWithAlign(ctx, truncate(post.hook, 65), pad, hookY, splitX - pad * 1.6, Math.floor(size * 0.078), 3, post.textAlign ?? "left");
  ctx.textAlign = "left";

  // Left: thin divider after hook
  const divY = hookY + hookLines * Math.floor(size * 0.078) + 24;
  ctx.fillStyle = tc;
  ctx.globalAlpha = 0.35;
  ctx.fillRect(pad, divY, size * 0.18, 2);
  ctx.globalAlpha = 1;

  // Left: caption (respects showCaption flag)
  if (post.showCaption !== false) {
    ctx.fillStyle = tc;
    ctx.globalAlpha = 0.75;
    ctx.font = `400 ${Math.floor(size * 0.025)}px Inter, sans-serif`;
    ctx.textAlign = post.textAlign ?? "left";
    wrapTextWithAlign(ctx, truncate(post.caption, 90), pad, divY + 44, splitX - pad * 1.6, Math.floor(size * 0.032), 3, post.textAlign ?? "left");
    ctx.textAlign = "left";
    ctx.globalAlpha = 1;
  }

  // Left: CTA button
  const ctaY = size - 168;
  const ctaW = Math.min(splitX - pad * 2, post.cta.length * 13 + 64);
  ctx.fillStyle = "rgba(255,255,255,0.92)";
  roundRect(ctx, pad, ctaY, ctaW, 56, 28);
  ctx.fill();

  ctx.fillStyle = brand.primaryColor;
  ctx.font = `700 ${Math.floor(size * 0.023)}px Inter, sans-serif`;
  ctx.textAlign = "center";
  ctx.fillText(truncate(post.cta, 26), pad + ctaW / 2, ctaY + 37);
  ctx.textAlign = "left";

  // Left: hashtags — small, bottom
  ctx.fillStyle = tc;
  ctx.globalAlpha = 0.38;
  ctx.font = `400 ${Math.floor(size * 0.017)}px Inter, sans-serif`;
  ctx.fillText(truncate((post.hashtags ?? "").split(" ").slice(0, 4).join(" "), 50), pad, size - 28);
  ctx.globalAlpha = 1;
}

// ─── Template: EDITORIAL ─────────────────────────────────────

async function renderEditorial(ctx: CanvasRenderingContext2D, post: PostData, brand: BrandData, size: number) {
  const bg = adjustColor(brand.primaryColor, -145);
  const pad = 90;

  // Background
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, size, size);

  // Top accent line
  ctx.fillStyle = brand.primaryColor;
  ctx.fillRect(0, 0, size, 4);

  // Bottom accent line
  ctx.fillStyle = brand.primaryColor;
  ctx.fillRect(0, size - 4, size, 4);

  // Brand name
  ctx.fillStyle = brand.primaryColor;
  ctx.globalAlpha = 0.9;
  ctx.font = `700 ${Math.floor(size * 0.02)}px Inter, sans-serif`;
  ctx.letterSpacing = "4px";
  ctx.fillText(brand.name.toUpperCase().substring(0, 18), pad, 90);
  ctx.globalAlpha = 1;

  // Accent line
  ctx.fillStyle = brand.primaryColor;
  ctx.fillRect(pad, 120, size * 0.2, 3);

  // Calculate text Y position based on textY (0=top, 100=bottom)
  const baseHookY = 280;
  const textYPos = post.textY ?? 100;
  const yOffset = calculateTextYOffset(size, 200, textYPos) - (baseHookY + 100);

  // Hook (serif style, use editor customizations)
  const hookY = baseHookY + yOffset;
  ctx.fillStyle = post.hookColor ?? "white";
  ctx.font = `800 ${Math.floor(size * 0.062 * (post.hookFontScale ?? 1))}px ${post.fontFamily ?? "Georgia"}, serif`;
  ctx.textAlign = post.textAlign ?? "left";
  wrapTextWithAlign(ctx, truncate(post.hook, 90), pad, hookY, size - pad * 2, Math.floor(size * 0.076), 3, post.textAlign ?? "left");
  ctx.textAlign = "left";

  // Secondary accent line (offset based on hook)
  const accentY = hookY + 170;
  ctx.fillStyle = brand.primaryColor;
  ctx.globalAlpha = 0.8;
  ctx.fillRect(pad, accentY, size * 0.18, 2);
  ctx.globalAlpha = 1;

  // Caption (respects showCaption flag)
  if (post.showCaption !== false) {
    ctx.fillStyle = "rgba(255,255,255,0.65)";
    ctx.font = `400 ${Math.floor(size * 0.026)}px Inter, sans-serif`;
    ctx.textAlign = post.textAlign ?? "left";
    const captionY = accentY + 50;
    wrapTextWithAlign(ctx, truncate(post.caption, 90), pad, captionY, size - pad * 2, Math.floor(size * 0.033), 2, post.textAlign ?? "left");
    ctx.textAlign = "left";
  }

  // CTA arrow style
  ctx.fillStyle = brand.primaryColor;
  ctx.font = `700 ${Math.floor(size * 0.026)}px Inter, sans-serif`;
  ctx.fillText(`→ ${truncate(post.cta, 32)}`, pad, size - 130);

  // Hashtags
  ctx.fillStyle = "rgba(255,255,255,0.3)";
  ctx.font = `400 ${Math.floor(size * 0.018)}px Inter, sans-serif`;
  ctx.fillText(truncate((post.hashtags ?? "").split(" ").slice(0, 5).join(" "), 60), pad, size - 30);
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
