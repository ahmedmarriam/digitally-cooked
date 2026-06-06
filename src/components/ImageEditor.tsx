"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { renderPost, BrandData, PostData } from "@/lib/canvasRenderer";

interface Post {
  id?: string;
  post_group?: number;
  post_number?: number;
  hook: string;
  caption: string;
  cta: string;
  hashtags: string | string[];
  platform: string;
  image_url?: string | null;
  image_prompt?: string | null;
  is_bonus?: boolean;
  format?: string;
}

interface Brand {
  id?: string;
  brand_name?: string;
  brand_colors?: string;
  content_tone?: string;
  visual_style?: string;
  business_type?: string;
  logo_url?: string | null;
  [key: string]: unknown;
}

interface Props {
  post: Post;
  brand: Brand | null;
  onClose: () => void;
  onSave?: (editedPost: Post) => void;
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
  return `#${Math.max(0,r-55).toString(16).padStart(2,"0")}${Math.max(0,g-55).toString(16).padStart(2,"0")}${Math.max(0,b-55).toString(16).padStart(2,"0")}`;
}
function getContrastColor(hex: string): string {
  const clean = hex.replace("#","").padEnd(6,"0");
  const r = parseInt(clean.slice(0,2),16), g = parseInt(clean.slice(2,4),16), b = parseInt(clean.slice(4,6),16);
  return (0.299*r+0.587*g+0.114*b)/255 > 0.45 ? "#111111" : "#ffffff";
}

const LABEL: React.CSSProperties = {
  display: "block", fontSize: "0.7rem", fontWeight: 700,
  color: "rgba(167,139,250,0.7)", letterSpacing: "0.06em", marginBottom: "6px",
};
const INPUT: React.CSSProperties = {
  width: "100%", padding: "9px 12px", borderRadius: "8px", boxSizing: "border-box",
  background: "rgba(255,255,255,0.04)", border: "1px solid rgba(123,47,255,0.2)",
  color: "#F1F1F1", fontSize: "0.88rem", outline: "none", resize: "vertical",
};

export default function ImageEditor({ post, brand, onClose, onSave }: Props) {
  // Text content
  const [hook, setHook] = useState(post.hook ?? "");
  const [caption, setCaption] = useState(post.caption ?? "");
  const [cta, setCta] = useState(post.cta ?? "");

  // Typography
  const [hookScale, setHookScale] = useState(1.0);
  const [hookColor, setHookColor] = useState("#ffffff");
  const [fontFamily, setFontFamily] = useState("Inter");
  const [textAlign, setTextAlign] = useState<"left" | "center" | "right">("left");

  // Layout
  const [showCaption, setShowCaption] = useState(true);
  const [textBackdrop, setTextBackdrop] = useState(false);
  const [template, setTemplate] = useState<"bold" | "gradient" | "split" | "editorial">("bold");
  const [textY, setTextY] = useState(100);  // 0=top, 50=center, 100=bottom (default bottom)

  // Preview
  const [previewUrl, setPreviewUrl] = useState<string | null>(post.image_url ?? null);
  const [rendering, setRendering] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const buildBrandData = useCallback((): BrandData => {
    const colors = brand?.brand_colors ?? "";
    const primary = parseFirstHex(colors);
    const secondary = parseSecondHex(colors, primary);
    return {
      name: brand?.brand_name ?? "Brand",
      primaryColor: primary,
      secondaryColor: secondary,
      textColor: getContrastColor(primary),
      logoBase64: (brand?.logo_url as string) ?? null,
      businessType: (brand?.business_type as string) ?? "",
    };
  }, [brand]);

  const buildPostData = useCallback((): PostData => {
    const postIndex = Math.max(0, ((post.post_number ?? post.post_group ?? 1) - 1));
    return {
      hook,
      caption,
      cta,
      hashtags: "",  // removed from display
      imageUrl: post.image_url ?? null,
      isBonus: post.is_bonus ?? false,
      postIndex,
      hookFontScale: hookScale,
      hookColor,
      fontFamily,
      textAlign,
      showCaption,
      textBackdrop,
      textY,
      template,
    };
  }, [hook, caption, cta, hookScale, hookColor, fontFamily, textAlign, showCaption, textBackdrop, textY, template, post]);

  const renderPreview = useCallback(async () => {
    if (!brand) return;
    setRendering(true);
    try {
      const brandData = buildBrandData();
      const postData = buildPostData();
      const blobUrl = await renderPost(postData, brandData, 512);
      setPreviewUrl(blobUrl);
    } catch (err) {
      console.error("Editor preview error:", err);
    } finally {
      setRendering(false);
    }
  }, [buildBrandData, buildPostData, brand]);

  // Debounce preview on changes
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => { renderPreview(); }, 500);
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
  }, [hook, caption, cta, hookScale, hookColor, fontFamily, textAlign, showCaption, textBackdrop, textY, template, renderPreview]);

  useEffect(() => { renderPreview(); }, []);

  const handleSaveEdits = async () => {
    if (!brand || !onSave) return;
    setDownloading(true);
    try {
      const brandData = buildBrandData();
      const postData = buildPostData();
      const url = await renderPost(postData, brandData, 1024);
      const res = await fetch(url);
      const blob = await res.blob();
      const formData = new FormData();
      formData.append("file", blob, `post-${post.post_group}.jpg`);
      formData.append("brandId", brand.id ?? "");
      formData.append("postGroup", String(post.post_group));

      const uploadRes = await fetch("/api/upload-post-image", {
        method: "POST",
        body: formData,
      });

      if (uploadRes.ok) {
        const data = await uploadRes.json();
        onSave({ ...post, image_url: data.url });
        onClose();
      }
    } catch (err) {
      console.error("Save error:", err);
    } finally {
      setDownloading(false);
    }
  };

  const handleDownload = () => {
    if (!previewUrl || !brand) return;
    setDownloading(true);
    const brandData = buildBrandData();
    const postData = buildPostData();
    renderPost(postData, brandData, 1024).then((url) => {
      const a = document.createElement("a");
      a.download = `post-${post.platform}-${Date.now()}.jpg`;
      a.href = url;
      a.click();
    }).catch(console.error).finally(() => setDownloading(false));
  };

  return (
    <div
      style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.88)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 200, padding: "16px", backdropFilter: "blur(8px)" }}
      onClick={onClose}
    >
      <div
        style={{ background: "#1C1B2E", border: "1px solid rgba(123,47,255,0.3)", borderRadius: "20px", width: "100%", maxWidth: "1000px", maxHeight: "92vh", display: "flex", flexDirection: "column", boxShadow: "0 30px 80px rgba(0,0,0,0.8)", overflow: "hidden" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "18px 24px", borderBottom: "1px solid rgba(255,255,255,0.06)", flexShrink: 0 }}>
          <div>
            <h2 style={{ color: "#F1F1F1", fontWeight: 800, fontSize: "1rem", marginBottom: "2px" }}>✎ Edit Post</h2>
            <p style={{ color: "rgba(241,241,241,0.35)", fontSize: "0.78rem" }}>Text, design, and layout — live preview</p>
          </div>
          <button onClick={onClose} style={{ background: "none", border: "none", color: "rgba(241,241,241,0.5)", fontSize: "22px", cursor: "pointer", lineHeight: 1 }}>×</button>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", flex: 1, overflow: "hidden", gap: "1px", background: "rgba(255,255,255,0.06)" }}>

          {/* LEFT: Controls */}
          <div style={{ overflowY: "auto", padding: "20px", background: "#1C1B2E", display: "flex", flexDirection: "column", gap: "16px" }}>

            {/* Text Content */}
            <div>
              <p style={{ fontSize: "0.75rem", fontWeight: 700, color: "#a78bfa", letterSpacing: "0.08em", marginBottom: "10px" }}>TEXT CONTENT</p>
              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                <div>
                  <label style={LABEL}>HOOK</label>
                  <textarea value={hook} onChange={(e) => setHook(e.target.value)} rows={2} style={{ ...INPUT, fontWeight: 700 }} onFocus={(e) => (e.target.style.borderColor = "rgba(123,47,255,0.6)")} onBlur={(e) => (e.target.style.borderColor = "rgba(123,47,255,0.2)")} />
                </div>
                <div>
                  <label style={LABEL}>CAPTION</label>
                  <textarea value={caption} onChange={(e) => setCaption(e.target.value)} rows={3} style={INPUT} onFocus={(e) => (e.target.style.borderColor = "rgba(123,47,255,0.6)")} onBlur={(e) => (e.target.style.borderColor = "rgba(123,47,255,0.2)")} />
                </div>
                <div>
                  <label style={LABEL}>CTA</label>
                  <input value={cta} onChange={(e) => setCta(e.target.value)} style={{ ...INPUT, resize: undefined as any }} onFocus={(e) => (e.target.style.borderColor = "rgba(123,47,255,0.6)")} onBlur={(e) => (e.target.style.borderColor = "rgba(123,47,255,0.2)")} />
                </div>
              </div>
            </div>

            {/* Typography */}
            <div>
              <p style={{ fontSize: "0.75rem", fontWeight: 700, color: "#a78bfa", letterSpacing: "0.08em", marginBottom: "10px" }}>TYPOGRAPHY</p>
              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                <div>
                  <label style={LABEL}>HOOK SIZE — {hookScale < 0.8 ? "Small" : hookScale < 1.1 ? "Medium" : hookScale < 1.4 ? "Large" : "X-Large"}</label>
                  <input type="range" min={60} max={180} step={10} value={Math.round(hookScale * 100)} onChange={(e) => setHookScale(Number(e.target.value) / 100)} style={{ width: "100%", accentColor: "#7B2FFF" }} />
                </div>
                <div>
                  <label style={LABEL}>HOOK COLOUR</label>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <input type="color" value={hookColor} onChange={(e) => setHookColor(e.target.value)} style={{ width: "40px", height: "40px", borderRadius: "8px", border: "1px solid rgba(123,47,255,0.3)", cursor: "pointer", padding: "2px" }} />
                    <div style={{ display: "flex", gap: "6px", flex: 1, flexWrap: "wrap" }}>
                      {["#ffffff","#000000","#a78bfa","#ec4899","#34d399","#f97316"].map((c) => (
                        <button key={c} onClick={() => setHookColor(c)} style={{ width: "22px", height: "22px", borderRadius: "4px", background: c, border: hookColor === c ? "2px solid #fff" : "1px solid rgba(255,255,255,0.1)", cursor: "pointer", transition: "box-shadow 0.15s", boxShadow: hookColor === c ? "0 0 0 2px #7B2FFF" : "none" }} />
                      ))}
                    </div>
                  </div>
                </div>
                <div>
                  <label style={LABEL}>FONT</label>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "6px" }}>
                    {["Inter", "Montserrat", "Poppins", "Oswald", "Raleway", "Playfair Display", "Merriweather", "Lora"].map((f) => (
                      <button key={f} onClick={() => setFontFamily(f)} style={{ padding: "6px 10px", borderRadius: "6px", border: `1px solid ${fontFamily === f ? "rgba(123,47,255,0.6)" : "rgba(255,255,255,0.08)"}`, background: fontFamily === f ? "rgba(123,47,255,0.2)" : "rgba(255,255,255,0.03)", color: fontFamily === f ? "#a78bfa" : "rgba(241,241,241,0.5)", fontSize: "0.75rem", fontWeight: fontFamily === f ? 700 : 400, cursor: "pointer", whiteSpace: "nowrap" }}>
                        {f}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Layout */}
            <div>
              <p style={{ fontSize: "0.75rem", fontWeight: 700, color: "#a78bfa", letterSpacing: "0.08em", marginBottom: "10px" }}>LAYOUT</p>
              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                <div>
                  <label style={LABEL}>ALIGNMENT</label>
                  <div style={{ display: "flex", gap: "6px" }}>
                    {["left", "center", "right"].map((a) => (
                      <button key={a} onClick={() => setTextAlign(a as any)} style={{ flex: 1, padding: "6px", borderRadius: "6px", border: `1px solid ${textAlign === a ? "rgba(123,47,255,0.6)" : "rgba(255,255,255,0.08)"}`, background: textAlign === a ? "rgba(123,47,255,0.2)" : "rgba(255,255,255,0.03)", color: textAlign === a ? "#a78bfa" : "rgba(241,241,241,0.5)", fontSize: "0.75rem", fontWeight: textAlign === a ? 700 : 400, cursor: "pointer", textTransform: "capitalize" }}>
                        {a}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label style={LABEL}>TEMPLATE</label>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "6px" }}>
                    {["bold", "gradient", "split", "editorial"].map((t) => (
                      <button key={t} onClick={() => setTemplate(t as any)} style={{ padding: "8px", borderRadius: "6px", border: `1px solid ${template === t ? "rgba(123,47,255,0.6)" : "rgba(255,255,255,0.08)"}`, background: template === t ? "rgba(123,47,255,0.2)" : "rgba(255,255,255,0.03)", color: template === t ? "#a78bfa" : "rgba(241,241,241,0.5)", fontSize: "0.75rem", fontWeight: template === t ? 700 : 400, cursor: "pointer", textTransform: "capitalize" }}>
                        {t}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label style={LABEL}>TEXT POSITION — {textY === 0 ? "↑ Top" : textY === 50 ? "↕ Center" : textY === 100 ? "↓ Bottom" : `${textY}%`}</label>
                  <div style={{ display: "flex", gap: "6px", marginBottom: "8px" }}>
                    {[["Top", 0], ["Center", 50], ["Bottom", 100]].map(([label, value]) => (
                      <button key={label} onClick={() => setTextY(value as number)} style={{ flex: 1, padding: "6px", borderRadius: "6px", border: `1px solid ${textY === value ? "rgba(123,47,255,0.6)" : "rgba(255,255,255,0.08)"}`, background: textY === value ? "rgba(123,47,255,0.2)" : "rgba(255,255,255,0.03)", color: textY === value ? "#a78bfa" : "rgba(241,241,241,0.5)", fontSize: "0.7rem", fontWeight: textY === value ? 700 : 400, cursor: "pointer" }}>
                        {label}
                      </button>
                    ))}
                  </div>
                  <input type="range" min={0} max={100} step={5} value={textY} onChange={(e) => setTextY(Number(e.target.value))} style={{ width: "100%", accentColor: "#7B2FFF" }} />
                </div>
                <div>
                  <button onClick={() => setShowCaption(!showCaption)} style={{ width: "100%", padding: "8px", borderRadius: "6px", border: `1px solid ${showCaption ? "rgba(34,197,94,0.3)" : "rgba(255,255,255,0.08)"}`, background: showCaption ? "rgba(34,197,94,0.1)" : "rgba(255,255,255,0.03)", color: showCaption ? "#34d399" : "rgba(241,241,241,0.5)", fontSize: "0.75rem", fontWeight: 600, cursor: "pointer" }}>
                    {showCaption ? "✓ Show caption" : "Hide caption"}
                  </button>
                </div>
                <div>
                  <button onClick={() => setTextBackdrop(!textBackdrop)} style={{ width: "100%", padding: "8px", borderRadius: "6px", border: `1px solid ${textBackdrop ? "rgba(168,85,247,0.3)" : "rgba(255,255,255,0.08)"}`, background: textBackdrop ? "rgba(168,85,247,0.1)" : "rgba(255,255,255,0.03)", color: textBackdrop ? "#d8b4fe" : "rgba(241,241,241,0.5)", fontSize: "0.75rem", fontWeight: 600, cursor: "pointer" }}>
                    {textBackdrop ? "✓ Backdrop on" : "Backdrop off"}
                  </button>
                </div>
              </div>
            </div>

            <button onClick={() => { setHook(post.hook ?? ""); setCaption(post.caption ?? ""); setCta(post.cta ?? ""); setHookScale(1.0); setHookColor("#ffffff"); setFontFamily("Inter"); setTextAlign("left"); setTextY(100); setShowCaption(true); setTextBackdrop(false); setTemplate("bold"); }} style={{ padding: "8px", borderRadius: "8px", background: "transparent", border: "1px solid rgba(255,255,255,0.08)", color: "rgba(241,241,241,0.35)", fontSize: "0.75rem", cursor: "pointer" }}>
              ↩ Reset all
            </button>
          </div>

          {/* RIGHT: Preview */}
          <div style={{ overflowY: "auto", padding: "20px", display: "flex", flexDirection: "column", gap: "14px" }}>
            <label style={LABEL}>LIVE PREVIEW</label>
            <div style={{ borderRadius: "12px", overflow: "hidden", background: "#0F0E1A", border: "1px solid rgba(255,255,255,0.06)", aspectRatio: "1/1", position: "relative", flexShrink: 0 }}>
              {previewUrl ? (
                <img src={previewUrl} alt="preview" style={{ width: "100%", height: "100%", objectFit: "cover", opacity: rendering ? 0.5 : 1, transition: "opacity 0.2s" }} />
              ) : (
                <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", color: "rgba(241,241,241,0.2)" }}>
                  {rendering ? "Rendering..." : "No preview"}
                </div>
              )}
              {rendering && (
                <div style={{ position: "absolute", bottom: "10px", right: "10px", display: "flex", alignItems: "center", gap: "6px", padding: "5px 10px", borderRadius: "999px", background: "rgba(0,0,0,0.6)", backdropFilter: "blur(6px)" }}>
                  <div style={{ width: "10px", height: "10px", borderRadius: "50%", border: "2px solid rgba(167,139,250,0.4)", borderTopColor: "#a78bfa", animation: "spin 0.7s linear infinite" }} />
                  <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
                  <span style={{ color: "rgba(167,139,250,0.8)", fontSize: "0.65rem", fontWeight: 600 }}>Updating...</span>
                </div>
              )}
            </div>
            <div style={{ display: "flex", gap: "8px" }}>
              <button onClick={handleSaveEdits} disabled={downloading || !previewUrl} style={{ flex: 1, padding: "11px", borderRadius: "10px", background: previewUrl ? "linear-gradient(135deg,#7B2FFF,#ec4899)" : "rgba(123,47,255,0.3)", border: "none", color: "#fff", fontWeight: 700, fontSize: "0.85rem", cursor: previewUrl ? "pointer" : "not-allowed", boxShadow: previewUrl ? "0 4px 18px rgba(123,47,255,0.35)" : "none" }}>
                {downloading ? "Saving..." : "💾 Save to post"}
              </button>
              <button onClick={handleDownload} disabled={downloading || !previewUrl} style={{ flex: 1, padding: "11px", borderRadius: "10px", background: previewUrl ? "rgba(255,255,255,0.05)" : "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.1)", color: previewUrl ? "rgba(241,241,241,0.7)" : "rgba(241,241,241,0.2)", fontWeight: 600, fontSize: "0.85rem", cursor: previewUrl ? "pointer" : "not-allowed" }}>
                ⬇ Download
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
