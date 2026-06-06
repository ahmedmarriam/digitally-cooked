"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

// Webhook URL is handled server-side via /api/brand-profile/submit

const PLATFORMS = ["Instagram", "TikTok", "Facebook", "LinkedIn", "YouTube"];

const TONES = ["Professional", "Casual", "Humorous", "Inspirational", "Educational", "Bold"];
const STYLES = ["Minimal", "Bold", "Elegant", "Playful", "Corporate", "Lifestyle"];
const GOALS = ["Brand Awareness", "Lead Generation", "Sales", "Community Building", "Education"];
const FREQUENCIES = ["Daily", "3–4x per week", "2x per week", "Weekly"];
const BUSINESS_TYPES = ["Retail", "Service", "Restaurant", "Tech", "Healthcare", "Education", "Fitness", "Beauty", "Real Estate", "Other"];

const LANGUAGES = [
  "English", "Arabic", "Urdu", "French", "Spanish", "German", "Portuguese",
  "Hindi", "Indonesian", "Turkish", "Dutch", "Italian", "Russian", "Japanese",
  "Korean", "Chinese (Simplified)", "Polish", "Swedish", "Danish", "Norwegian",
];

export default function BrandProfilePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [logoName, setLogoName] = useState("");
  const [logoBase64, setLogoBase64] = useState("");
  const [scanUrl, setScanUrl] = useState("");
  const [scanning, setScanning] = useState(false);
  const [scanError, setScanError] = useState("");
  const [scanSuccess, setScanSuccess] = useState(false);
  const [colorSwatches, setColorSwatches] = useState<string[]>(["#7B2FFF"]);
  const [formVisible, setFormVisible] = useState(false);

  const [socialUrls, setSocialUrls] = useState<Record<string, string>>({});
  const [socialScreenshots, setSocialScreenshots] = useState<Record<string, string>>({});
  const [socialAnalysis, setSocialAnalysis] = useState<Record<string, Record<string, string>>>({});
  const [socialBlocked, setSocialBlocked] = useState<Record<string, boolean>>({});
  const [socialScanning, setSocialScanning] = useState<Record<string, boolean>>({});

  const [form, setForm] = useState({
    brandName: "",
    ownerName: "",
    businessType: "",
    location: "",
    businessDescription: "",
    topProducts: "",
    uniqueFactor: "",
    idealCustomer: "",
    contentTone: "",
    visualStyle: "",
    brandColors: "",
    monthlyGoal: "",
    postingFrequency: "",
    platforms: [] as string[],
    wantsReels: false,
    captionLanguages: ["English"] as string[],
    brandMission: "",
    brandVision: "",
    painPoints: ["", "", ""] as [string, string, string],
  });

  // Sync color swatches to form.brandColors
  useEffect(() => {
    setForm((prev) => ({ ...prev, brandColors: colorSwatches.join(", ") }));
  }, [colorSwatches]);

  // Auto-fill from Brand Kit if available
  useEffect(() => {
    try {
      const saved = localStorage.getItem("dc_brand_kit");
      if (!saved) return;
      const kit = JSON.parse(saved);
      setForm((prev) => ({
        ...prev,
        contentTone: kit.toneOfVoice ? (kit.toneOfVoice.charAt(0).toUpperCase() + kit.toneOfVoice.slice(1)) : prev.contentTone,
        brandColors: kit.colorPalette ? kit.colorPalette : prev.brandColors,
        monthlyGoal: Array.isArray(kit.contentGoal) && kit.contentGoal.length > 0 ? kit.contentGoal[0] : prev.monthlyGoal,
        idealCustomer: kit.interests ? `Age ${kit.ageRanges?.join(", ")} · ${kit.location} · ${kit.interests}` : prev.idealCustomer,
        uniqueFactor: kit.howYouDiffer || prev.uniqueFactor,
        businessDescription: kit.whatYouDo ? `We help ${kit.whoYouServe || "our customers"} ${kit.whatYouDo}.` : prev.businessDescription,
      }));
    } catch {}
  }, []);

  const handleScan = async () => {
    if (!scanUrl) return;
    setScanError("");
    setScanSuccess(false);
    setScanning(true);
    try {
      const res = await fetch("/api/brand-profile/scan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: scanUrl }),
      });
      const data = await res.json();
      if (!res.ok || !data.brand) {
        setScanError(data.error || "Scan failed. Please fill the form manually.");
        return;
      }
      const b = data.brand;
      setForm((prev) => ({
        ...prev,
        brandName: b.brandName || prev.brandName,
        businessType: BUSINESS_TYPES.includes(b.businessType) ? b.businessType : prev.businessType,
        location: b.location || prev.location,
        businessDescription: b.businessDescription || prev.businessDescription,
        topProducts: b.topProducts || prev.topProducts,
        uniqueFactor: b.uniqueFactor || prev.uniqueFactor,
        idealCustomer: b.idealCustomer || prev.idealCustomer,
        contentTone: TONES.includes(b.contentTone) ? b.contentTone : prev.contentTone,
        visualStyle: STYLES.includes(b.visualStyle) ? b.visualStyle : prev.visualStyle,
        brandColors: b.brandColors || prev.brandColors,
        brandMission: b.brandMission || prev.brandMission,
        brandVision: b.brandVision || prev.brandVision,
      }));
      setScanSuccess(true);
      setFormVisible(true);
    } catch {
      setScanError("Something went wrong. Please try again.");
    } finally {
      setScanning(false);
    }
  };

  const scanSocial = async (platform: string, screenshot?: string) => {
    setSocialScanning((s) => ({ ...s, [platform]: true }));
    try {
      const res = await fetch("/api/brand-profile/scan-social", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ platform, url: socialUrls[platform] || "", screenshot }),
      });
      const data = await res.json();
      if (data.blocked) {
        setSocialBlocked((s) => ({ ...s, [platform]: true }));
      } else if (data.success && data.analysis) {
        setSocialAnalysis((s) => ({ ...s, [platform]: data.analysis }));
        setSocialBlocked((s) => ({ ...s, [platform]: false }));
      }
    } catch {
      setSocialBlocked((s) => ({ ...s, [platform]: true }));
    } finally {
      setSocialScanning((s) => ({ ...s, [platform]: false }));
    }
  };

  const handleSocialScreenshot = (platform: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const b64 = reader.result as string;
      setSocialScreenshots((s) => ({ ...s, [platform]: b64 }));
      scanSocial(platform, b64);
    };
    reader.readAsDataURL(file);
  };

  const togglePlatform = (p: string) => {
    setForm((prev) => ({
      ...prev,
      platforms: prev.platforms.includes(p) ? prev.platforms.filter((x) => x !== p) : [...prev.platforms, p],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.platforms.length === 0) { setError("Please select at least one platform."); return; }
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/brand-profile/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          logoFileName: logoName,
          logoBase64,
          captionLanguage: form.captionLanguages.join(" and "),
          brandMission: form.brandMission,
          brandVision: form.brandVision,
          socialStyleContext: Object.entries(socialAnalysis).map(([platform, a]) =>
            `${platform}: Posting ${a.postingFrequency ?? "unknown frequency"} | Style: ${a.postingStyle ?? ""} | Tone: ${a.tone ?? ""} | What works: ${a.whatWorks ?? ""} | What doesn't: ${a.whatDoesntWork ?? ""} | Gaps: ${a.contentGaps ?? ""} | Strategy: ${a.recommendedStrategy ?? ""}`
          ).join("\n"),
        }),
      });
      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Failed to submit. Please try again.");
        setLoading(false);
        return;
      }
      router.push("/processing");
    } catch {
      setError("Failed to submit. Please try again.");
      setLoading(false);
    }
  };

  const inputStyle: React.CSSProperties = {
    width: "100%",
    padding: "12px 14px",
    borderRadius: "10px",
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(123,47,255,0.2)",
    color: "#F1F1F1",
    fontSize: "0.92rem",
    outline: "none",
    boxSizing: "border-box",
    transition: "border-color 0.2s",
  };

  const labelStyle: React.CSSProperties = {
    display: "block",
    fontSize: "0.75rem",
    fontWeight: 700,
    color: "rgba(241,241,241,0.55)",
    marginBottom: "7px",
    letterSpacing: "0.06em",
    textTransform: "uppercase",
  };

  return (
    <div style={{ minHeight: "100vh", background: "#0F0E1A", color: "#F1F1F1", fontFamily: "var(--font-geist-sans), Arial, sans-serif" }}>
      {/* Top bar */}
      <div style={{ borderBottom: "1px solid rgba(123,47,255,0.15)", padding: "16px 32px", display: "flex", alignItems: "center", justifyContent: "space-between", background: "rgba(8,7,20,0.8)", backdropFilter: "blur(12px)", position: "sticky", top: 0, zIndex: 10 }}>
        <a href="/" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: "10px" }}>
          <div style={{ width: "32px", height: "32px", borderRadius: "9px", background: "linear-gradient(135deg, #7B2FFF, #ec4899)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "15px" }}>🍳</div>
          <span style={{ fontWeight: 800, fontSize: "0.9rem", color: "#F1F1F1", letterSpacing: "0.04em" }}>DIGITALLY COOKED</span>
        </a>
        <div style={{ fontSize: "0.82rem", color: "rgba(241,241,241,0.4)" }}>{formVisible ? "Review & confirm your profile" : "Step 1 — Scan your website"}</div>
      </div>

      <div style={{ maxWidth: "760px", margin: "0 auto", padding: "48px 24px 80px" }}>

        {/* ── STEP 1: Website Scanner (always visible) ── */}
        <div style={{ marginBottom: formVisible ? "40px" : "0" }}>
          {!formVisible && (
            <div style={{ textAlign: "center", marginBottom: "48px" }}>
              <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", padding: "5px 14px", borderRadius: "100px", background: "rgba(123,47,255,0.12)", border: "1px solid rgba(123,47,255,0.3)", color: "#a78bfa", fontSize: "0.78rem", fontWeight: 600, marginBottom: "20px" }}>
                🍳 Let&apos;s build your brand profile
              </div>
              <h1 style={{ fontSize: "clamp(2rem, 5vw, 3rem)", fontWeight: 900, letterSpacing: "-0.02em", lineHeight: 1.1, marginBottom: "14px" }}>
                Paste your website.<br />
                <span style={{ background: "linear-gradient(90deg, #a78bfa, #ec4899)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>We&apos;ll do the rest.</span>
              </h1>
              <p style={{ color: "rgba(241,241,241,0.45)", fontSize: "1rem", lineHeight: 1.6, maxWidth: "480px", margin: "0 auto" }}>
                Our AI scans your website and fills in your entire brand profile automatically — in seconds.
              </p>
            </div>
          )}

          <div style={{ background: "linear-gradient(135deg, rgba(123,47,255,0.12), rgba(236,72,153,0.08))", border: "1px solid rgba(123,47,255,0.35)", borderRadius: "20px", padding: formVisible ? "20px 24px" : "32px 36px" }}>
            {!formVisible && (
              <p style={{ fontSize: "0.85rem", color: "rgba(241,241,241,0.5)", marginBottom: "16px", textAlign: "center" }}>
                ⚡ AI reads your site and fills everything in automatically
              </p>
            )}
            {formVisible && (
              <p style={{ fontSize: "0.8rem", fontWeight: 700, color: "#a78bfa", marginBottom: "12px" }}>⚡ Website scanned {scanSuccess ? "✓" : ""}</p>
            )}
            <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
              <input
                type="text"
                placeholder="https://yourbusiness.com"
                value={scanUrl}
                onChange={(e) => setScanUrl(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), handleScan())}
                style={{ flex: 1, minWidth: "220px", padding: formVisible ? "10px 14px" : "14px 18px", borderRadius: "12px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(123,47,255,0.3)", color: "#F1F1F1", fontSize: formVisible ? "0.9rem" : "1rem", outline: "none" }}
              />
              <button
                type="button"
                onClick={handleScan}
                disabled={scanning || !scanUrl}
                style={{ padding: formVisible ? "10px 20px" : "14px 28px", borderRadius: "12px", background: scanning ? "rgba(123,47,255,0.4)" : "linear-gradient(135deg, #7B2FFF, #ec4899)", border: "none", color: "#fff", fontWeight: 700, fontSize: formVisible ? "0.88rem" : "1rem", cursor: scanning || !scanUrl ? "not-allowed" : "pointer", whiteSpace: "nowrap", boxShadow: scanning || !scanUrl ? "none" : "0 4px 20px rgba(123,47,255,0.4)", transition: "all 0.2s" }}
              >
                {scanning ? "Scanning..." : "⚡ Scan Website"}
              </button>
            </div>

            {scanSuccess && (
              <div style={{ marginTop: "12px", padding: "10px 14px", borderRadius: "8px", background: "rgba(34,197,94,0.1)", border: "1px solid rgba(34,197,94,0.25)", color: "#34d399", fontSize: "0.83rem", fontWeight: 600 }}>
                ✓ Profile auto-filled from your website — review and adjust below.
              </div>
            )}
            {scanError && (
              <div style={{ marginTop: "12px", padding: "10px 14px", borderRadius: "8px", background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.25)", color: "#ef4444", fontSize: "0.83rem" }}>
                {scanError}
              </div>
            )}

            {/* Skip option — only before form is shown */}
            {!formVisible && (
              <div style={{ textAlign: "center", marginTop: "20px" }}>
                <button
                  type="button"
                  onClick={() => setFormVisible(true)}
                  style={{ background: "none", border: "none", color: "rgba(241,241,241,0.4)", fontSize: "0.85rem", cursor: "pointer", textDecoration: "underline", textUnderlineOffset: "3px" }}
                >
                  Don&apos;t have a website? Fill in manually →
                </button>
              </div>
            )}
          </div>
        </div>

        {/* ── STEP 2: Full form (revealed after scan or skip) ── */}
        {formVisible && (
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "28px" }}>
          {/* Section: Basic Info */}
          <Section title="Basic Information">
            <Grid2>
              <Field label="Brand Name" required>
                <input type="text" required placeholder="e.g. Bloom Bakery" value={form.brandName} onChange={(e) => setForm({ ...form, brandName: e.target.value })} style={inputStyle} onFocus={(e) => (e.target.style.borderColor = "#7B2FFF")} onBlur={(e) => (e.target.style.borderColor = "rgba(123,47,255,0.2)")} />
              </Field>
              <Field label="Owner / Contact Name" required>
                <input type="text" required placeholder="e.g. Sarah Ahmed" value={form.ownerName} onChange={(e) => setForm({ ...form, ownerName: e.target.value })} style={inputStyle} onFocus={(e) => (e.target.style.borderColor = "#7B2FFF")} onBlur={(e) => (e.target.style.borderColor = "rgba(123,47,255,0.2)")} />
              </Field>
            </Grid2>
            <Grid2>
              <Field label="Business Type" required>
                <select required value={form.businessType} onChange={(e) => setForm({ ...form, businessType: e.target.value })} style={{ ...inputStyle, appearance: "none" }}>
                  <option value="">Select type...</option>
                  {BUSINESS_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
                </select>
              </Field>
              <Field label="Location" required>
                <input type="text" required placeholder="e.g. Dubai, UAE" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} style={inputStyle} onFocus={(e) => (e.target.style.borderColor = "#7B2FFF")} onBlur={(e) => (e.target.style.borderColor = "rgba(123,47,255,0.2)")} />
              </Field>
            </Grid2>
          </Section>

          {/* Section: About the Business */}
          <Section title="About Your Business">
            <Field label="Business Description" required>
              <textarea required rows={3} placeholder="What does your business do? What problem do you solve?" value={form.businessDescription} onChange={(e) => setForm({ ...form, businessDescription: e.target.value })} style={{ ...inputStyle, resize: "vertical", lineHeight: 1.6 }} onFocus={(e) => (e.target.style.borderColor = "#7B2FFF")} onBlur={(e) => (e.target.style.borderColor = "rgba(123,47,255,0.2)")} />
            </Field>
            <Field label="Top Products / Services" required>
              <textarea required rows={2} placeholder="List your main products or services" value={form.topProducts} onChange={(e) => setForm({ ...form, topProducts: e.target.value })} style={{ ...inputStyle, resize: "vertical", lineHeight: 1.6 }} onFocus={(e) => (e.target.style.borderColor = "#7B2FFF")} onBlur={(e) => (e.target.style.borderColor = "rgba(123,47,255,0.2)")} />
            </Field>
            <Field label="What Makes You Unique?" required>
              <textarea required rows={2} placeholder="What sets you apart from competitors?" value={form.uniqueFactor} onChange={(e) => setForm({ ...form, uniqueFactor: e.target.value })} style={{ ...inputStyle, resize: "vertical", lineHeight: 1.6 }} onFocus={(e) => (e.target.style.borderColor = "#7B2FFF")} onBlur={(e) => (e.target.style.borderColor = "rgba(123,47,255,0.2)")} />
            </Field>
            <Field label="Ideal Customer" required>
              <textarea required rows={2} placeholder="Describe your target customer — age, interests, lifestyle" value={form.idealCustomer} onChange={(e) => setForm({ ...form, idealCustomer: e.target.value })} style={{ ...inputStyle, resize: "vertical", lineHeight: 1.6 }} onFocus={(e) => (e.target.style.borderColor = "#7B2FFF")} onBlur={(e) => (e.target.style.borderColor = "rgba(123,47,255,0.2)")} />
            </Field>
            <Field label="Top 3 Customer Pain Points" labelNote="(what problems do they face?)">
              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                {[0, 1, 2].map((i) => (
                  <input
                    key={i}
                    type="text"
                    placeholder={`Pain point ${i + 1}...`}
                    value={(form.painPoints ?? ["", "", ""])[i] ?? ""}
                    onChange={(e) => {
                      const updated = [...(form.painPoints ?? ["", "", ""])] as [string, string, string];
                      updated[i] = e.target.value;
                      setForm({ ...form, painPoints: updated });
                    }}
                    style={inputStyle}
                    onFocus={(e) => (e.target.style.borderColor = "#7B2FFF")}
                    onBlur={(e) => (e.target.style.borderColor = "rgba(123,47,255,0.2)")}
                  />
                ))}
              </div>
            </Field>
          </Section>

          {/* Section: Brand Style */}
          <Section title="Brand Style & Voice">
            <Grid2>
              <Field label="Content Tone" required>
                <select required value={form.contentTone} onChange={(e) => setForm({ ...form, contentTone: e.target.value })} style={{ ...inputStyle, appearance: "none" }}>
                  <option value="">Select tone...</option>
                  {TONES.map((t) => <option key={t} value={t}>{t}</option>)}
                </select>
              </Field>
              <Field label="Visual Style" required>
                <select required value={form.visualStyle} onChange={(e) => setForm({ ...form, visualStyle: e.target.value })} style={{ ...inputStyle, appearance: "none" }}>
                  <option value="">Select style...</option>
                  {STYLES.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </Field>
            </Grid2>
            <Field label="Brand Colours" labelNote="(click a swatch to change, up to 4)">
              <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap", padding: "12px 14px", borderRadius: "10px", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(123,47,255,0.2)" }}>
                {colorSwatches.map((color, idx) => (
                  <div key={idx} style={{ position: "relative", display: "inline-flex" }}>
                    <button
                      type="button"
                      title={color}
                      onClick={() => { const inp = document.getElementById(`color-inp-${idx}`) as HTMLInputElement; inp?.click(); }}
                      style={{ width: "40px", height: "40px", borderRadius: "50%", background: color, border: "2px solid rgba(255,255,255,0.25)", cursor: "pointer", boxShadow: "0 2px 8px rgba(0,0,0,0.4)", flexShrink: 0, transition: "transform 0.15s", position: "relative" }}
                      onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.transform = "scale(1.1)"; }}
                      onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.transform = "scale(1)"; }}
                    />
                    <input
                      id={`color-inp-${idx}`}
                      type="color"
                      value={color}
                      onChange={(e) => {
                        const updated = [...colorSwatches];
                        updated[idx] = e.target.value;
                        setColorSwatches(updated);
                      }}
                      style={{ position: "absolute", opacity: 0, width: "1px", height: "1px", pointerEvents: "none" }}
                    />
                    {colorSwatches.length > 1 && (
                      <button
                        type="button"
                        onClick={() => setColorSwatches(colorSwatches.filter((_, i) => i !== idx))}
                        style={{ position: "absolute", top: "-5px", right: "-5px", width: "16px", height: "16px", borderRadius: "50%", background: "#1C1B2E", border: "1px solid rgba(255,255,255,0.2)", color: "rgba(241,241,241,0.7)", fontSize: "10px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", lineHeight: 1, padding: 0 }}
                      >×</button>
                    )}
                  </div>
                ))}
                {colorSwatches.length < 4 && (
                  <button
                    type="button"
                    onClick={() => setColorSwatches([...colorSwatches, "#EC4899"])}
                    style={{ width: "40px", height: "40px", borderRadius: "50%", background: "rgba(123,47,255,0.12)", border: "2px dashed rgba(123,47,255,0.4)", color: "#a78bfa", fontSize: "20px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, transition: "background 0.15s" }}
                    onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "rgba(123,47,255,0.22)"; }}
                    onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "rgba(123,47,255,0.12)"; }}
                  >+</button>
                )}
                <span style={{ fontSize: "0.75rem", color: "rgba(241,241,241,0.3)", marginLeft: "4px" }}>{colorSwatches.join(", ")}</span>
              </div>
            </Field>
            <Field label="Brand Logo" labelNote="(optional)">
              <label style={{ display: "flex", alignItems: "center", gap: "14px", padding: "12px 14px", borderRadius: "10px", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(123,47,255,0.2)", cursor: "pointer", transition: "border-color 0.2s" }}
                onMouseEnter={(e) => ((e.currentTarget as HTMLLabelElement).style.borderColor = "#7B2FFF")}
                onMouseLeave={(e) => ((e.currentTarget as HTMLLabelElement).style.borderColor = "rgba(123,47,255,0.2)")}
              >
                <span style={{ fontSize: "1.4rem" }}>🖼️</span>
                <span style={{ fontSize: "0.88rem", color: logoName ? "#a78bfa" : "rgba(241,241,241,0.4)" }}>
                  {logoName || "Click to upload logo file"}
                </span>
                <input type="file" accept="image/*" style={{ display: "none" }} onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;
                  setLogoName(file.name);
                  const reader = new FileReader();
                  reader.onload = () => setLogoBase64(reader.result as string);
                  reader.readAsDataURL(file);
                }} />
              </label>
            </Field>
          </Section>

          {/* Section: Mission & Vision */}
          <Section title="Mission & Vision">
            <Field label="Brand Mission" labelNote="(what you do today)">
              <textarea rows={2} placeholder="e.g. We help small businesses show up consistently on social media without spending hours on content." value={form.brandMission} onChange={(e) => setForm({ ...form, brandMission: e.target.value })} style={{ ...inputStyle, resize: "vertical", lineHeight: 1.6 }} onFocus={(e) => (e.target.style.borderColor = "#7B2FFF")} onBlur={(e) => (e.target.style.borderColor = "rgba(123,47,255,0.2)")} />
            </Field>
            <Field label="Brand Vision" labelNote="(what you're building toward)">
              <textarea rows={2} placeholder="e.g. A world where every business has access to world-class content marketing." value={form.brandVision} onChange={(e) => setForm({ ...form, brandVision: e.target.value })} style={{ ...inputStyle, resize: "vertical", lineHeight: 1.6 }} onFocus={(e) => (e.target.style.borderColor = "#7B2FFF")} onBlur={(e) => (e.target.style.borderColor = "rgba(123,47,255,0.2)")} />
            </Field>
          </Section>

          {/* Section: Content Strategy */}
          <Section title="Content Strategy">
            <Grid2>
              <Field label="Monthly Goal" required>
                <select required value={form.monthlyGoal} onChange={(e) => setForm({ ...form, monthlyGoal: e.target.value })} style={{ ...inputStyle, appearance: "none" }}>
                  <option value="">Select goal...</option>
                  {GOALS.map((g) => <option key={g} value={g}>{g}</option>)}
                </select>
              </Field>
              <Field label="Posting Frequency" required>
                <select required value={form.postingFrequency} onChange={(e) => setForm({ ...form, postingFrequency: e.target.value })} style={{ ...inputStyle, appearance: "none" }}>
                  <option value="">Select frequency...</option>
                  {FREQUENCIES.map((f) => <option key={f} value={f}>{f}</option>)}
                </select>
              </Field>
            </Grid2>

            {/* Platforms */}
            <Field label="Platforms" required labelNote="(select all that apply)">
              <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
                {PLATFORMS.map((p) => {
                  const selected = form.platforms.includes(p);
                  return (
                    <button
                      key={p}
                      type="button"
                      onClick={() => togglePlatform(p)}
                      style={{ padding: "9px 20px", borderRadius: "100px", fontSize: "0.88rem", fontWeight: 600, cursor: "pointer", transition: "all 0.18s ease", background: selected ? "#7B2FFF" : "rgba(255,255,255,0.04)", border: `1.5px solid ${selected ? "#7B2FFF" : "rgba(123,47,255,0.2)"}`, color: selected ? "#fff" : "rgba(241,241,241,0.55)", boxShadow: selected ? "0 4px 14px rgba(123,47,255,0.4)" : "none" }}
                    >
                      {p}
                    </button>
                  );
                })}
              </div>
            </Field>

            {/* Social Profile Scan */}
            {form.platforms.length > 0 && (
              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 700, color: "rgba(241,241,241,0.55)", letterSpacing: "0.06em", textTransform: "uppercase" }}>
                  YOUR SOCIAL PROFILES <span style={{ fontWeight: 400, textTransform: "none", color: "rgba(241,241,241,0.35)", letterSpacing: 0 }}>(so we can study your style and make better content)</span>
                </label>
                {form.platforms.map((platform) => {
                  const isScanning = socialScanning[platform];
                  const isBlocked = socialBlocked[platform];
                  const analysis = socialAnalysis[platform];
                  const platformPlaceholders: Record<string, string> = {
                    Instagram: "https://instagram.com/yourbrand",
                    TikTok: "https://tiktok.com/@yourbrand",
                    Facebook: "https://facebook.com/yourbrand",
                    LinkedIn: "https://linkedin.com/company/yourbrand",
                    YouTube: "https://youtube.com/@yourbrand",
                  };
                  return (
                    <div key={platform} style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(123,47,255,0.15)", borderRadius: "12px", padding: "14px 16px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "10px" }}>
                        <span style={{ fontSize: "0.82rem", fontWeight: 700, color: "#a78bfa", minWidth: "80px" }}>{platform}</span>
                        <input
                          type="text"
                          placeholder={platformPlaceholders[platform] ?? `Your ${platform} URL`}
                          value={socialUrls[platform] ?? ""}
                          onChange={(e) => setSocialUrls((s) => ({ ...s, [platform]: e.target.value }))}
                          style={{ flex: 1, padding: "8px 12px", borderRadius: "8px", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(123,47,255,0.2)", color: "#F1F1F1", fontSize: "0.85rem", outline: "none" }}
                          onFocus={(e) => (e.target.style.borderColor = "#7B2FFF")}
                          onBlur={(e) => (e.target.style.borderColor = "rgba(123,47,255,0.2)")}
                        />
                        <button
                          type="button"
                          onClick={() => scanSocial(platform)}
                          disabled={isScanning || !socialUrls[platform]}
                          style={{ padding: "8px 14px", borderRadius: "8px", background: isScanning ? "rgba(123,47,255,0.3)" : "#7B2FFF", border: "none", color: "#fff", fontSize: "0.8rem", fontWeight: 700, cursor: isScanning || !socialUrls[platform] ? "not-allowed" : "pointer", whiteSpace: "nowrap", opacity: !socialUrls[platform] ? 0.4 : 1 }}
                        >
                          {isScanning ? "Scanning..." : "Scan"}
                        </button>
                      </div>

                      {/* Blocked — ask for screenshot */}
                      {isBlocked && !analysis && (
                        <div style={{ display: "flex", alignItems: "center", gap: "10px", padding: "10px 12px", borderRadius: "8px", background: "rgba(246,173,85,0.08)", border: "1px solid rgba(246,173,85,0.2)" }}>
                          <span style={{ fontSize: "0.8rem", color: "rgba(246,173,85,0.9)" }}>⚠️ {platform} blocks automated scanning.</span>
                          <label style={{ padding: "6px 12px", borderRadius: "7px", background: "rgba(123,47,255,0.2)", border: "1px solid rgba(123,47,255,0.4)", color: "#a78bfa", fontSize: "0.78rem", fontWeight: 700, cursor: "pointer", whiteSpace: "nowrap" }}>
                            📸 Upload Screenshot
                            <input type="file" accept="image/*" style={{ display: "none" }} onChange={(e) => handleSocialScreenshot(platform, e)} />
                          </label>
                        </div>
                      )}

                      {/* Analysis result */}
                      {analysis && (
                        <div style={{ padding: "10px 12px", borderRadius: "8px", background: "rgba(52,211,153,0.08)", border: "1px solid rgba(52,211,153,0.2)" }}>
                          <p style={{ fontSize: "0.72rem", fontWeight: 700, color: "#34d399", marginBottom: "6px", letterSpacing: "0.06em" }}>✓ {platform.toUpperCase()} ANALYSED</p>
                          <p style={{ fontSize: "0.8rem", color: "rgba(241,241,241,0.6)", lineHeight: 1.6 }}>
                            <strong style={{ color: "rgba(241,241,241,0.8)" }}>Style:</strong> {analysis.visualAesthetic}
                          </p>
                          <p style={{ fontSize: "0.8rem", color: "rgba(241,241,241,0.6)", lineHeight: 1.6 }}>
                            <strong style={{ color: "rgba(241,241,241,0.8)" }}>Frequency:</strong> {analysis.postingFrequency ?? "—"} &nbsp;·&nbsp;
                            <strong style={{ color: "rgba(241,241,241,0.8)" }}>Tone:</strong> {analysis.tone}
                          </p>
                          {analysis.whatWorks && (
                            <p style={{ fontSize: "0.78rem", color: "#34d399", marginTop: "4px" }}>✓ Works: {analysis.whatWorks}</p>
                          )}
                          {analysis.whatDoesntWork && (
                            <p style={{ fontSize: "0.78rem", color: "#f87171", marginTop: "2px" }}>✗ Not working: {analysis.whatDoesntWork}</p>
                          )}
                          {analysis.recommendedStrategy && (
                            <p style={{ fontSize: "0.78rem", color: "#a78bfa", marginTop: "4px" }}>✦ Strategy: {analysis.recommendedStrategy}</p>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}

            {/* Reels */}
            <Field label="Include Reels in your content?">
              <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
                <button
                  type="button"
                  onClick={() => setForm({ ...form, wantsReels: !form.wantsReels })}
                  style={{ position: "relative", width: "52px", height: "28px", borderRadius: "999px", border: "none", cursor: "pointer", transition: "background 0.2s", background: form.wantsReels ? "#7B2FFF" : "rgba(255,255,255,0.1)", flexShrink: 0 }}
                >
                  <span style={{ position: "absolute", top: "4px", left: form.wantsReels ? "28px" : "4px", width: "20px", height: "20px", borderRadius: "50%", background: "#fff", transition: "left 0.2s", boxShadow: "0 1px 4px rgba(0,0,0,0.3)", display: "block" }} />
                </button>
                <span style={{ fontSize: "0.88rem", color: "rgba(241,241,241,0.6)" }}>
                  {form.wantsReels ? "Yes — include Reels in my content mix 🎬" : "No — static posts and carousels only"}
                </span>
              </div>
            </Field>

            {/* Caption Language */}
            <Field label="Caption Language" required labelNote="(select up to 2 — bilingual captions supported)">
              <div style={{ marginBottom: "10px" }}>
                <span style={{ fontSize: "0.78rem", color: "rgba(241,241,241,0.4)" }}>
                  🌍 {form.captionLanguages.length === 2 ? `Bilingual: ${form.captionLanguages.join(" + ")}` : `Captions in ${form.captionLanguages[0] || "English"}`}
                </span>
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                {LANGUAGES.map((lang) => {
                  const curr = form.captionLanguages;
                  const selected = curr.includes(lang);
                  return (
                    <button
                      key={lang}
                      type="button"
                      onClick={() => {
                        if (selected) {
                          if (curr.length === 1) return;
                          setForm({ ...form, captionLanguages: curr.filter((l) => l !== lang) });
                        } else {
                          if (curr.length >= 2) return;
                          setForm({ ...form, captionLanguages: [...curr, lang] });
                        }
                      }}
                      style={{ padding: "7px 14px", borderRadius: "999px", fontSize: "0.82rem", fontWeight: 600, cursor: curr.length >= 2 && !selected ? "not-allowed" : "pointer", transition: "all 0.18s", background: selected ? "#7B2FFF" : "rgba(255,255,255,0.04)", border: `1.5px solid ${selected ? "#7B2FFF" : "rgba(123,47,255,0.2)"}`, color: selected ? "#fff" : "rgba(241,241,241,0.55)", opacity: curr.length >= 2 && !selected ? 0.4 : 1, boxShadow: selected ? "0 4px 14px rgba(123,47,255,0.4)" : "none" }}
                    >
                      {lang}
                    </button>
                  );
                })}
              </div>
            </Field>
          </Section>

          {/* Error */}
          {error && (
            <div style={{ padding: "12px 16px", borderRadius: "10px", background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.25)", color: "#ef4444", fontSize: "0.88rem" }}>{error}</div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            style={{ padding: "18px 32px", borderRadius: "14px", background: loading ? "rgba(123,47,255,0.5)" : "linear-gradient(135deg, #7B2FFF, #ec4899)", color: "#fff", fontWeight: 800, fontSize: "1.1rem", border: "none", cursor: loading ? "not-allowed" : "pointer", boxShadow: "0 6px 28px rgba(123,47,255,0.45)", transition: "all 0.2s ease", display: "flex", alignItems: "center", justifyContent: "center", gap: "10px" }}
            onMouseEnter={(e) => { if (!loading) (e.currentTarget as HTMLButtonElement).style.transform = "translateY(-2px)"; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.transform = "translateY(0)"; }}
          >
            {loading ? (
              <>
                <span style={{ display: "inline-block", width: "18px", height: "18px", borderRadius: "50%", border: "2px solid rgba(255,255,255,0.3)", borderTop: "2px solid #fff", animation: "spin 0.8s linear infinite" }} />
                Sending to AI...
              </>
            ) : (
              <>🍳 Generate My Content</>
            )}
          </button>
        </form>
        )}
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } } select option { background: #1C1B2E; color: #F1F1F1; }`}</style>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ background: "#1C1B2E", border: "1px solid rgba(123,47,255,0.15)", borderRadius: "16px", padding: "28px 24px" }}>
      <h3 style={{ fontSize: "0.8rem", fontWeight: 700, color: "#7B2FFF", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "20px" }}>{title}</h3>
      <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>{children}</div>
    </div>
  );
}

function Grid2({ children }: { children: React.ReactNode }) {
  return <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }} className="bp-grid">{children}
    <style>{`@media(max-width:600px){.bp-grid{grid-template-columns:1fr!important}}`}</style>
  </div>;
}

function Field({ label, labelNote, required, children }: { label: string; labelNote?: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div>
      <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 700, color: "rgba(241,241,241,0.55)", marginBottom: "7px", letterSpacing: "0.06em", textTransform: "uppercase" }}>
        {label} {labelNote && <span style={{ fontWeight: 400, textTransform: "none", color: "rgba(241,241,241,0.35)", letterSpacing: 0 }}>{labelNote}</span>} {required && <span style={{ color: "#7B2FFF" }}>*</span>}
      </label>
      {children}
    </div>
  );
}
