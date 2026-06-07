"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

// ─── Constants ────────────────────────────────────────────────
const PLATFORMS = ["Instagram", "TikTok", "Facebook", "LinkedIn", "YouTube"];
const BUSINESS_TYPES = ["Retail", "Service", "Restaurant", "Tech", "Healthcare", "Education", "Fitness", "Beauty", "Real Estate", "Other"];
const FREQUENCIES = ["Daily", "3–4x per week", "2x per week", "Weekly"];
const LANGUAGES = [
  "English", "Arabic", "Urdu", "French", "Spanish", "German", "Portuguese",
  "Hindi", "Indonesian", "Turkish", "Dutch", "Italian", "Russian", "Japanese",
  "Korean", "Chinese (Simplified)", "Polish", "Swedish", "Danish", "Norwegian",
];

const VIBES = ["Professional", "Creative", "Playful", "Sophisticated", "Bold", "Authentic", "Innovative", "Community-driven", "Luxury", "Minimalist"];
const FORMALITY_OPTIONS = ["Very Casual", "Casual", "Balanced", "Formal", "Very Formal"];
const EMOTIONS = ["Inspired", "Empowered", "Excited", "Calm", "Confident", "Entertained", "Motivated", "Trusted"];
const BUSINESS_SIZES = ["Solo / Freelancer", "Small team (2–10)", "Growing (11–50)", "Established brand (50+)"];
const AGE_RANGES = ["13–17", "18–24", "25–34", "35–44", "45–54", "55–64", "65+"];
const CONTENT_GOALS = ["Brand Awareness", "Lead Generation", "Sales", "Community Building", "Education", "Viral Growth"];
const VISUAL_STYLES = ["Minimal", "Bold", "Elegant", "Playful", "Corporate", "Lifestyle"];

const TONES = [
  { key: "warm", label: "Warm & Inspiring", icon: "🌸", preview: '"Your dreams are valid, and we\'re here every step of the way."' },
  { key: "bold", label: "Bold & Direct", icon: "⚡", preview: '"Stop playing small. Here\'s exactly what you need to do — and why."' },
  { key: "professional", label: "Professional & Authoritative", icon: "💼", preview: '"Our data-driven approach delivers measurable, evidence-based results."' },
  { key: "humorous", label: "Humorous & Relatable", icon: "😄", preview: '"We said what we said. Your brand deserves better than winging it."' },
  { key: "educational", label: "Educational & Informative", icon: "📚", preview: '"Today we\'re breaking down the three concepts you need to grow your presence."' },
];

// ─── Styles ───────────────────────────────────────────────────
const inputStyle: React.CSSProperties = {
  width: "100%", padding: "12px 14px", borderRadius: "10px", boxSizing: "border-box",
  background: "rgba(255,255,255,0.04)", border: "1px solid rgba(123,47,255,0.2)",
  color: "#F1F1F1", fontSize: "0.92rem", outline: "none", transition: "border-color 0.2s",
};

export default function BrandProfilePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [scanUrl, setScanUrl] = useState("");
  const [scanning, setScanning] = useState(false);
  const [scanError, setScanError] = useState("");
  const [scanSuccess, setScanSuccess] = useState(false);
  const [formVisible, setFormVisible] = useState(false);
  const [colorSwatches, setColorSwatches] = useState<string[]>(["#7B2FFF"]);
  const [logoName, setLogoName] = useState("");
  const [logoBase64, setLogoBase64] = useState("");

  // Competitor intelligence — per platform
  const [platformCompetitors, setPlatformCompetitors] = useState<Record<string, { name: string; posts: string }[]>>({});
  const [platformAnalysing, setPlatformAnalysing] = useState<Record<string, boolean>>({});
  const [platformNicheIntelligence, setPlatformNicheIntelligence] = useState<Record<string, Record<string, string>>>({});
  const [platformNicheError, setPlatformNicheError] = useState<Record<string, string>>({});

  // Social scanning
  const [socialUrls, setSocialUrls] = useState<Record<string, string>>({});
  const [socialScreenshots, setSocialScreenshots] = useState<Record<string, string>>({});
  const [socialAnalysis, setSocialAnalysis] = useState<Record<string, Record<string, string>>>({});
  const [socialBlocked, setSocialBlocked] = useState<Record<string, boolean>>({});
  const [socialScanning, setSocialScanning] = useState<Record<string, boolean>>({});

  const [form, setForm] = useState({
    // Basics
    brandName: "", ownerName: "", businessType: "", location: "", businessDescription: "",
    topProducts: "", uniqueFactor: "", idealCustomer: "",
    painPoints: ["", "", ""] as [string, string, string],
    brandMission: "", brandVision: "",
    // Brand Personality (from brand kit)
    primaryVibe: [] as string[],
    formalityLevel: "",
    customerEmotion: [] as string[],
    businessSize: "",
    // Voice
    toneOfVoice: "",
    visualStyle: "",
    // Audience
    ageRanges: [] as string[],
    interests: "",
    // Content Strategy
    contentGoals: [] as string[],
    postingFrequency: "",
    platforms: [] as string[],
    wantsReels: false,
    captionLanguages: ["English"] as string[],
  });

  // Sync color swatches → form
  useEffect(() => {
    // colors stored separately via colorSwatches state
  }, [colorSwatches]);

  const handleScan = async () => {
    if (!scanUrl) return;
    setScanError(""); setScanSuccess(false); setScanning(true);
    try {
      const res = await fetch("/api/brand-profile/scan", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: scanUrl }),
      });
      const data = await res.json();
      if (!res.ok || !data.brand) { setScanError(data.error || "Scan failed. Fill the form manually."); return; }
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
        toneOfVoice: TONES.find(t => t.key === b.contentTone?.toLowerCase()) ? b.contentTone?.toLowerCase() : prev.toneOfVoice,
        visualStyle: VISUAL_STYLES.includes(b.visualStyle) ? b.visualStyle : prev.visualStyle,
        brandMission: b.brandMission || prev.brandMission,
        brandVision: b.brandVision || prev.brandVision,
      }));
      if (b.brandColors) {
        const hexes = [...(b.brandColors.match(/#[0-9A-Fa-f]{6}/g) ?? [])];
        if (hexes.length > 0) setColorSwatches(hexes.slice(0, 4));
      }
      setScanSuccess(true);
      setFormVisible(true);
    } catch { setScanError("Something went wrong. Please try again."); }
    finally { setScanning(false); }
  };

  const scanSocial = async (platform: string, screenshot?: string) => {
    setSocialScanning((s) => ({ ...s, [platform]: true }));
    try {
      const res = await fetch("/api/brand-profile/scan-social", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ platform, url: socialUrls[platform] || "", screenshot }),
      });
      const data = await res.json();
      if (data.blocked) setSocialBlocked((s) => ({ ...s, [platform]: true }));
      else if (data.success && data.analysis) {
        setSocialAnalysis((s) => ({ ...s, [platform]: data.analysis }));
        setSocialBlocked((s) => ({ ...s, [platform]: false }));
      }
    } catch { setSocialBlocked((s) => ({ ...s, [platform]: true })); }
    finally { setSocialScanning((s) => ({ ...s, [platform]: false })); }
  };

  const handleSocialScreenshot = (platform: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => { const b64 = reader.result as string; setSocialScreenshots((s) => ({ ...s, [platform]: b64 })); scanSocial(platform, b64); };
    reader.readAsDataURL(file);
  };

  const analyseNiche = async (platform: string) => {
    const comps = (platformCompetitors[platform] ?? []).filter((c) => c.name.trim() && c.posts.trim());
    if (comps.length === 0) {
      setPlatformNicheError((e) => ({ ...e, [platform]: "Add at least one competitor name and their posts." }));
      return;
    }
    setPlatformNicheError((e) => ({ ...e, [platform]: "" }));
    setPlatformAnalysing((a) => ({ ...a, [platform]: true }));
    try {
      const res = await fetch("/api/competitor-scan", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ competitors: comps, platform }),
      });
      const data = await res.json();
      if (!res.ok || !data.intelligence) {
        setPlatformNicheError((e) => ({ ...e, [platform]: data.error || "Analysis failed. Try again." }));
        return;
      }
      setPlatformNicheIntelligence((ni) => ({ ...ni, [platform]: data.intelligence }));
    } catch {
      setPlatformNicheError((e) => ({ ...e, [platform]: "Something went wrong. Try again." }));
    } finally {
      setPlatformAnalysing((a) => ({ ...a, [platform]: false }));
    }
  };

  const getDefaultCompetitors = (platform: string) =>
    platformCompetitors[platform] ?? [{ name: "", posts: "" }, { name: "", posts: "" }, { name: "", posts: "" }];

  const updateCompetitor = (platform: string, idx: number, field: "name" | "posts", value: string) => {
    const current = getDefaultCompetitors(platform);
    const updated = current.map((c, i) => i === idx ? { ...c, [field]: value } : c);
    setPlatformCompetitors((pc) => ({ ...pc, [platform]: updated }));
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setLogoName(file.name);
    const reader = new FileReader();
    reader.onload = () => setLogoBase64(reader.result as string);
    reader.readAsDataURL(file);
  };

  const toggle = (field: "primaryVibe" | "customerEmotion" | "platforms" | "contentGoals" | "ageRanges" | "captionLanguages", val: string, max?: number) => {
    const current = form[field] as string[];
    const already = current.includes(val);
    if (!already && max && current.length >= max) return;
    setForm((prev) => ({ ...prev, [field]: already ? current.filter((x) => x !== val) : [...current, val] }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.platforms.length === 0) { setError("Please select at least one platform."); return; }
    if (!form.toneOfVoice) { setError("Please select a tone of voice."); return; }
    setError(""); setLoading(true);

    const socialStyleContext = Object.entries(socialAnalysis).map(([platform, a]) =>
      `${platform}: Posting ${a.postingFrequency ?? "unknown"} | Style: ${a.postingStyle ?? ""} | Tone: ${a.tone ?? ""} | What works: ${a.whatWorks ?? ""} | Gaps: ${a.contentGaps ?? ""} | Strategy: ${a.recommendedStrategy ?? ""}`
    ).join("\n");

    try {
      const res = await fetch("/api/brand-profile/submit", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          brandName: form.brandName,
          ownerName: form.ownerName,
          businessType: form.businessType,
          location: form.location,
          businessDescription: form.businessDescription,
          topProducts: form.topProducts,
          uniqueFactor: form.uniqueFactor,
          idealCustomer: form.idealCustomer,
          painPoints: form.painPoints,
          brandMission: form.brandMission,
          brandVision: form.brandVision,
          contentTone: form.toneOfVoice,
          visualStyle: form.visualStyle,
          brandColors: colorSwatches.join(", "),
          monthlyGoal: form.contentGoals[0] ?? "",
          postingFrequency: form.postingFrequency,
          platforms: form.platforms,
          wantsReels: form.wantsReels,
          captionLanguage: form.captionLanguages.join(" and "),
          logoFileName: logoName,
          logoBase64,
          socialStyleContext,
          nicheIntelligence: Object.keys(platformNicheIntelligence).length > 0 ? JSON.stringify(platformNicheIntelligence) : null,
          // Brand personality (from brand kit)
          primaryVibe: form.primaryVibe.join(", "),
          formalityLevel: form.formalityLevel,
          customerEmotion: form.customerEmotion.join(", "),
          businessSize: form.businessSize,
          ageRanges: form.ageRanges.join(", "),
          interests: form.interests,
          contentGoals: form.contentGoals.join(", "),
        }),
      });
      if (!res.ok) { const data = await res.json(); setError(data.error || "Failed to submit."); setLoading(false); return; }
      router.push("/processing");
    } catch { setError("Failed to submit. Please try again."); setLoading(false); }
  };

  const pillBtn = (selected: boolean, small = false): React.CSSProperties => ({
    padding: small ? "7px 16px" : "9px 20px",
    borderRadius: "100px", fontSize: small ? "0.82rem" : "0.88rem", fontWeight: 600,
    cursor: "pointer", transition: "all 0.15s",
    background: selected ? "#7B2FFF" : "rgba(255,255,255,0.04)",
    border: `1.5px solid ${selected ? "#7B2FFF" : "rgba(123,47,255,0.2)"}`,
    color: selected ? "#fff" : "rgba(241,241,241,0.55)",
    boxShadow: selected ? "0 4px 14px rgba(123,47,255,0.4)" : "none",
  });

  return (
    <div style={{ minHeight: "100vh", background: "#0F0E1A", color: "#F1F1F1", fontFamily: "var(--font-geist-sans), Arial, sans-serif" }}>
      {/* Top bar */}
      <div style={{ borderBottom: "1px solid rgba(123,47,255,0.15)", padding: "16px 32px", display: "flex", alignItems: "center", justifyContent: "space-between", background: "rgba(8,7,20,0.9)", backdropFilter: "blur(12px)", position: "sticky", top: 0, zIndex: 10 }}>
        <a href="/" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: "10px" }}>
          <div style={{ width: "32px", height: "32px", borderRadius: "9px", background: "linear-gradient(135deg, #7B2FFF, #ec4899)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "15px" }}>🍳</div>
          <span style={{ fontWeight: 800, fontSize: "0.9rem", letterSpacing: "0.04em" }}>DIGITALLY COOKED</span>
        </a>
        <div style={{ fontSize: "0.82rem", color: "rgba(241,241,241,0.4)" }}>
          {!formVisible ? "Step 1 — Scan your website" : "Step 2 — Tell us about your brand"}
        </div>
      </div>

      <div style={{ maxWidth: "780px", margin: "0 auto", padding: "48px 24px 100px" }}>

        {/* ── SCAN ── */}
        <div style={{ marginBottom: formVisible ? "40px" : "0" }}>
          {!formVisible && (
            <div style={{ textAlign: "center", marginBottom: "48px" }}>
              <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", padding: "5px 14px", borderRadius: "100px", background: "rgba(123,47,255,0.12)", border: "1px solid rgba(123,47,255,0.3)", color: "#a78bfa", fontSize: "0.78rem", fontWeight: 600, marginBottom: "20px" }}>
                🍳 Let&apos;s build your brand profile
              </div>
              <h1 style={{ fontSize: "clamp(2rem,5vw,3rem)", fontWeight: 900, letterSpacing: "-0.02em", lineHeight: 1.1, marginBottom: "14px" }}>
                Paste your website.<br />
                <span style={{ background: "linear-gradient(90deg, #a78bfa, #ec4899)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>We&apos;ll do the rest.</span>
              </h1>
              <p style={{ color: "rgba(241,241,241,0.45)", fontSize: "1rem", lineHeight: 1.6, maxWidth: "480px", margin: "0 auto" }}>
                Our AI scans your website and fills in your brand profile automatically — in seconds.
              </p>
            </div>
          )}

          <div style={{ background: "linear-gradient(135deg,rgba(123,47,255,0.12),rgba(236,72,153,0.08))", border: "1px solid rgba(123,47,255,0.35)", borderRadius: "20px", padding: formVisible ? "20px 24px" : "32px 36px" }}>
            {formVisible && <p style={{ fontSize: "0.8rem", fontWeight: 700, color: "#a78bfa", marginBottom: "12px" }}>⚡ Website scanned {scanSuccess ? "✓" : ""}</p>}
            {!formVisible && <p style={{ fontSize: "0.85rem", color: "rgba(241,241,241,0.5)", marginBottom: "16px", textAlign: "center" }}>⚡ AI reads your site and fills everything in automatically</p>}
            <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
              <input type="text" placeholder="https://yourbusiness.com" value={scanUrl} onChange={(e) => setScanUrl(e.target.value)} onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), handleScan())}
                style={{ flex: 1, minWidth: "220px", padding: formVisible ? "10px 14px" : "14px 18px", borderRadius: "12px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(123,47,255,0.3)", color: "#F1F1F1", fontSize: formVisible ? "0.9rem" : "1rem", outline: "none" }} />
              <button type="button" onClick={handleScan} disabled={scanning || !scanUrl}
                style={{ padding: formVisible ? "10px 20px" : "14px 28px", borderRadius: "12px", background: scanning ? "rgba(123,47,255,0.4)" : "linear-gradient(135deg,#7B2FFF,#ec4899)", border: "none", color: "#fff", fontWeight: 700, fontSize: formVisible ? "0.88rem" : "1rem", cursor: scanning || !scanUrl ? "not-allowed" : "pointer", whiteSpace: "nowrap", boxShadow: scanning || !scanUrl ? "none" : "0 4px 20px rgba(123,47,255,0.4)", transition: "all 0.2s" }}>
                {scanning ? "Scanning..." : "⚡ Scan Website"}
              </button>
            </div>
            {scanSuccess && <div style={{ marginTop: "12px", padding: "10px 14px", borderRadius: "8px", background: "rgba(34,197,94,0.1)", border: "1px solid rgba(34,197,94,0.25)", color: "#34d399", fontSize: "0.83rem", fontWeight: 600 }}>✓ Profile auto-filled — review and adjust below.</div>}
            {scanError && <div style={{ marginTop: "12px", padding: "10px 14px", borderRadius: "8px", background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.25)", color: "#ef4444", fontSize: "0.83rem" }}>{scanError}</div>}
            {!formVisible && (
              <div style={{ textAlign: "center", marginTop: "20px" }}>
                <button type="button" onClick={() => setFormVisible(true)} style={{ background: "none", border: "none", color: "rgba(241,241,241,0.4)", fontSize: "0.85rem", cursor: "pointer", textDecoration: "underline", textUnderlineOffset: "3px" }}>
                  Don&apos;t have a website? Fill in manually →
                </button>
              </div>
            )}
          </div>
        </div>

        {/* ── FORM ── */}
        {formVisible && (
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "24px" }}>

            {/* ── BRAND BASICS ── */}
            <Section title="Who You Are">
              <Grid2>
                <Field label="Brand Name" required>
                  <input type="text" required placeholder="e.g. Bloom Bakery" value={form.brandName} onChange={(e) => setForm({ ...form, brandName: e.target.value })} style={inputStyle} onFocus={(e) => (e.target.style.borderColor = "#7B2FFF")} onBlur={(e) => (e.target.style.borderColor = "rgba(123,47,255,0.2)")} />
                </Field>
                <Field label="Owner / Contact Name">
                  <input type="text" placeholder="e.g. Sarah Ahmed" value={form.ownerName} onChange={(e) => setForm({ ...form, ownerName: e.target.value })} style={inputStyle} onFocus={(e) => (e.target.style.borderColor = "#7B2FFF")} onBlur={(e) => (e.target.style.borderColor = "rgba(123,47,255,0.2)")} />
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
              <Field label="Business Description" required>
                <textarea required rows={3} placeholder="What does your business do? What problem do you solve?" value={form.businessDescription} onChange={(e) => setForm({ ...form, businessDescription: e.target.value })} style={{ ...inputStyle, resize: "vertical", lineHeight: 1.6 }} onFocus={(e) => (e.target.style.borderColor = "#7B2FFF")} onBlur={(e) => (e.target.style.borderColor = "rgba(123,47,255,0.2)")} />
              </Field>
              <Field label="Business Size">
                <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                  {BUSINESS_SIZES.map((s) => (
                    <button key={s} type="button" onClick={() => setForm({ ...form, businessSize: s })} style={pillBtn(form.businessSize === s, true)}>{s}</button>
                  ))}
                </div>
              </Field>
            </Section>

            {/* ── BRAND PERSONALITY ── */}
            <Section title="Your Brand Personality">
              <Field label="Primary Vibe" labelNote="(pick all that apply)">
                <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                  {VIBES.map((v) => (
                    <button key={v} type="button" onClick={() => toggle("primaryVibe", v)} style={pillBtn(form.primaryVibe.includes(v), true)}>{v}</button>
                  ))}
                </div>
              </Field>
              <Field label="How formal is your brand?">
                <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                  {FORMALITY_OPTIONS.map((f) => (
                    <button key={f} type="button" onClick={() => setForm({ ...form, formalityLevel: f })} style={pillBtn(form.formalityLevel === f, true)}>{f}</button>
                  ))}
                </div>
              </Field>
              <Field label="How do you want customers to feel?" labelNote="(pick all that apply)">
                <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                  {EMOTIONS.map((em) => (
                    <button key={em} type="button" onClick={() => toggle("customerEmotion", em)} style={pillBtn(form.customerEmotion.includes(em), true)}>{em}</button>
                  ))}
                </div>
              </Field>
            </Section>

            {/* ── TONE OF VOICE ── */}
            <Section title="Your Voice">
              <Field label="Tone of Voice" required>
                <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                  {TONES.map((t) => (
                    <button key={t.key} type="button" onClick={() => setForm({ ...form, toneOfVoice: t.key })}
                      style={{ padding: "14px 16px", borderRadius: "12px", textAlign: "left", cursor: "pointer", transition: "all 0.15s", background: form.toneOfVoice === t.key ? "rgba(123,47,255,0.18)" : "rgba(255,255,255,0.03)", border: `1.5px solid ${form.toneOfVoice === t.key ? "#7B2FFF" : "rgba(123,47,255,0.15)"}`, boxShadow: form.toneOfVoice === t.key ? "0 0 0 1px rgba(123,47,255,0.3)" : "none" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: form.toneOfVoice === t.key ? "8px" : "0" }}>
                        <span style={{ fontSize: "1.2rem" }}>{t.icon}</span>
                        <span style={{ fontSize: "0.88rem", fontWeight: 700, color: form.toneOfVoice === t.key ? "#a78bfa" : "rgba(241,241,241,0.8)" }}>{t.label}</span>
                      </div>
                      {form.toneOfVoice === t.key && (
                        <p style={{ fontSize: "0.8rem", color: "rgba(241,241,241,0.5)", fontStyle: "italic", lineHeight: 1.5, marginLeft: "30px" }}>{t.preview}</p>
                      )}
                    </button>
                  ))}
                </div>
              </Field>
              <Field label="Visual Style">
                <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                  {["Minimal", "Bold", "Elegant", "Playful", "Corporate", "Lifestyle"].map((s) => (
                    <button key={s} type="button" onClick={() => setForm({ ...form, visualStyle: s })} style={pillBtn(form.visualStyle === s, true)}>{s}</button>
                  ))}
                </div>
              </Field>
            </Section>

            {/* ── AUDIENCE ── */}
            <Section title="Your Audience">
              <Field label="Age Ranges" labelNote="(select all that apply)">
                <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                  {AGE_RANGES.map((a) => (
                    <button key={a} type="button" onClick={() => toggle("ageRanges", a)} style={pillBtn(form.ageRanges.includes(a), true)}>{a}</button>
                  ))}
                </div>
              </Field>
              <Field label="Ideal Customer" required>
                <textarea required rows={2} placeholder="Describe your target customer — age, interests, lifestyle, mindset" value={form.idealCustomer} onChange={(e) => setForm({ ...form, idealCustomer: e.target.value })} style={{ ...inputStyle, resize: "vertical", lineHeight: 1.6 }} onFocus={(e) => (e.target.style.borderColor = "#7B2FFF")} onBlur={(e) => (e.target.style.borderColor = "rgba(123,47,255,0.2)")} />
              </Field>
              <Field label="Customer Interests">
                <input type="text" placeholder="e.g. fitness, travel, self-improvement, cooking" value={form.interests} onChange={(e) => setForm({ ...form, interests: e.target.value })} style={inputStyle} onFocus={(e) => (e.target.style.borderColor = "#7B2FFF")} onBlur={(e) => (e.target.style.borderColor = "rgba(123,47,255,0.2)")} />
              </Field>
              <Field label="Top 3 Customer Pain Points" labelNote="(what problems do they face?)">
                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                  {[0, 1, 2].map((i) => (
                    <input key={i} type="text" placeholder={`Pain point ${i + 1}...`} value={(form.painPoints ?? ["", "", ""])[i] ?? ""}
                      onChange={(e) => { const up = [...(form.painPoints ?? ["", "", ""])] as [string, string, string]; up[i] = e.target.value; setForm({ ...form, painPoints: up }); }}
                      style={inputStyle} onFocus={(e) => (e.target.style.borderColor = "#7B2FFF")} onBlur={(e) => (e.target.style.borderColor = "rgba(123,47,255,0.2)")} />
                  ))}
                </div>
              </Field>
            </Section>

            {/* ── BRAND STORY ── */}
            <Section title="Your Brand Story">
              <Field label="Top Products / Services" required>
                <textarea required rows={2} placeholder="List your main products or services" value={form.topProducts} onChange={(e) => setForm({ ...form, topProducts: e.target.value })} style={{ ...inputStyle, resize: "vertical", lineHeight: 1.6 }} onFocus={(e) => (e.target.style.borderColor = "#7B2FFF")} onBlur={(e) => (e.target.style.borderColor = "rgba(123,47,255,0.2)")} />
              </Field>
              <Field label="What Makes You Unique?" required>
                <textarea required rows={2} placeholder="What sets you apart from competitors?" value={form.uniqueFactor} onChange={(e) => setForm({ ...form, uniqueFactor: e.target.value })} style={{ ...inputStyle, resize: "vertical", lineHeight: 1.6 }} onFocus={(e) => (e.target.style.borderColor = "#7B2FFF")} onBlur={(e) => (e.target.style.borderColor = "rgba(123,47,255,0.2)")} />
              </Field>
              <Field label="Brand Mission">
                <textarea rows={2} placeholder="e.g. We help small businesses show up consistently without spending hours on content." value={form.brandMission} onChange={(e) => setForm({ ...form, brandMission: e.target.value })} style={{ ...inputStyle, resize: "vertical", lineHeight: 1.6 }} onFocus={(e) => (e.target.style.borderColor = "#7B2FFF")} onBlur={(e) => (e.target.style.borderColor = "rgba(123,47,255,0.2)")} />
              </Field>
              <Field label="Brand Vision">
                <textarea rows={2} placeholder="e.g. A world where every business has a powerful digital presence." value={form.brandVision} onChange={(e) => setForm({ ...form, brandVision: e.target.value })} style={{ ...inputStyle, resize: "vertical", lineHeight: 1.6 }} onFocus={(e) => (e.target.style.borderColor = "#7B2FFF")} onBlur={(e) => (e.target.style.borderColor = "rgba(123,47,255,0.2)")} />
              </Field>
            </Section>

            {/* ── CONTENT STRATEGY ── */}
            <Section title="Content Strategy">
              <Field label="Content Goals" labelNote="(select all that apply)">
                <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                  {CONTENT_GOALS.map((g) => (
                    <button key={g} type="button" onClick={() => toggle("contentGoals", g)} style={pillBtn(form.contentGoals.includes(g), true)}>{g}</button>
                  ))}
                </div>
              </Field>
              <Grid2>
                <Field label="Posting Frequency" required>
                  <select required value={form.postingFrequency} onChange={(e) => setForm({ ...form, postingFrequency: e.target.value })} style={{ ...inputStyle, appearance: "none" }}>
                    <option value="">Select frequency...</option>
                    {FREQUENCIES.map((f) => <option key={f} value={f}>{f}</option>)}
                  </select>
                </Field>
                <Field label="Include Reels?">
                  <div style={{ display: "flex", alignItems: "center", gap: "14px", height: "46px" }}>
                    <button type="button" onClick={() => setForm({ ...form, wantsReels: !form.wantsReels })}
                      style={{ position: "relative", width: "52px", height: "28px", borderRadius: "999px", border: "none", cursor: "pointer", background: form.wantsReels ? "#7B2FFF" : "rgba(255,255,255,0.1)", flexShrink: 0, transition: "background 0.2s" }}>
                      <span style={{ position: "absolute", top: "4px", left: form.wantsReels ? "28px" : "4px", width: "20px", height: "20px", borderRadius: "50%", background: "#fff", transition: "left 0.2s", display: "block", boxShadow: "0 1px 4px rgba(0,0,0,0.3)" }} />
                    </button>
                    <span style={{ fontSize: "0.85rem", color: "rgba(241,241,241,0.6)" }}>{form.wantsReels ? "Yes — include Reels 🎬" : "No — static only"}</span>
                  </div>
                </Field>
              </Grid2>
              <Field label="Platforms" required labelNote="(select all that apply)">
                <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
                  {PLATFORMS.map((p) => (
                    <button key={p} type="button" onClick={() => toggle("platforms", p)} style={pillBtn(form.platforms.includes(p))}>{p}</button>
                  ))}
                </div>
              </Field>

              {/* Social Profile Scan — shows after platforms selected */}
              {form.platforms.length > 0 && (
                <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                  <label style={{ fontSize: "0.75rem", fontWeight: 700, color: "rgba(241,241,241,0.55)", letterSpacing: "0.06em", textTransform: "uppercase" }}>
                    YOUR SOCIAL PROFILES <span style={{ fontWeight: 400, textTransform: "none", color: "rgba(241,241,241,0.35)", letterSpacing: 0 }}>(so we can study your style)</span>
                  </label>
                  {form.platforms.map((platform) => {
                    const isScanning = socialScanning[platform];
                    const isBlocked = socialBlocked[platform];
                    const analysis = socialAnalysis[platform];
                    const placeholders: Record<string, string> = { Instagram: "https://instagram.com/yourbrand", TikTok: "https://tiktok.com/@yourbrand", Facebook: "https://facebook.com/yourbrand", LinkedIn: "https://linkedin.com/company/yourbrand", YouTube: "https://youtube.com/@yourbrand" };
                    return (
                      <div key={platform} style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(123,47,255,0.15)", borderRadius: "12px", padding: "14px 16px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "8px" }}>
                          <span style={{ fontSize: "0.82rem", fontWeight: 700, color: "#a78bfa", minWidth: "80px" }}>{platform}</span>
                          <input type="text" placeholder={placeholders[platform] ?? `Your ${platform} URL`} value={socialUrls[platform] ?? ""} onChange={(e) => setSocialUrls((s) => ({ ...s, [platform]: e.target.value }))}
                            style={{ flex: 1, padding: "8px 12px", borderRadius: "8px", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(123,47,255,0.2)", color: "#F1F1F1", fontSize: "0.85rem", outline: "none" }}
                            onFocus={(e) => (e.target.style.borderColor = "#7B2FFF")} onBlur={(e) => (e.target.style.borderColor = "rgba(123,47,255,0.2)")} />
                          <button type="button" onClick={() => scanSocial(platform)} disabled={isScanning || !socialUrls[platform]}
                            style={{ padding: "8px 14px", borderRadius: "8px", background: isScanning ? "rgba(123,47,255,0.3)" : "#7B2FFF", border: "none", color: "#fff", fontSize: "0.8rem", fontWeight: 700, cursor: isScanning || !socialUrls[platform] ? "not-allowed" : "pointer", whiteSpace: "nowrap", opacity: !socialUrls[platform] ? 0.4 : 1 }}>
                            {isScanning ? "Scanning..." : "Scan"}
                          </button>
                        </div>
                        {isBlocked && !analysis && (
                          <div style={{ display: "flex", alignItems: "center", gap: "10px", padding: "10px 12px", borderRadius: "8px", background: "rgba(246,173,85,0.08)", border: "1px solid rgba(246,173,85,0.2)" }}>
                            <span style={{ fontSize: "0.8rem", color: "rgba(246,173,85,0.9)" }}>⚠️ {platform} blocks scanning.</span>
                            <label style={{ padding: "6px 12px", borderRadius: "7px", background: "rgba(123,47,255,0.2)", border: "1px solid rgba(123,47,255,0.4)", color: "#a78bfa", fontSize: "0.78rem", fontWeight: 700, cursor: "pointer", whiteSpace: "nowrap" }}>
                              📸 Upload Screenshot
                              <input type="file" accept="image/*" style={{ display: "none" }} onChange={(e) => handleSocialScreenshot(platform, e)} />
                            </label>
                          </div>
                        )}
                        {analysis && (
                          <div style={{ padding: "10px 12px", borderRadius: "8px", background: "rgba(52,211,153,0.08)", border: "1px solid rgba(52,211,153,0.2)" }}>
                            <p style={{ fontSize: "0.72rem", fontWeight: 700, color: "#34d399", marginBottom: "6px", letterSpacing: "0.06em" }}>✓ {platform.toUpperCase()} ANALYSED</p>
                            <p style={{ fontSize: "0.8rem", color: "rgba(241,241,241,0.6)", lineHeight: 1.6 }}><strong style={{ color: "rgba(241,241,241,0.8)" }}>Style:</strong> {analysis.visualAesthetic}</p>
                            <p style={{ fontSize: "0.8rem", color: "rgba(241,241,241,0.6)", lineHeight: 1.6 }}><strong style={{ color: "rgba(241,241,241,0.8)" }}>Tone:</strong> {analysis.tone}</p>
                            {analysis.whatWorks && <p style={{ fontSize: "0.78rem", color: "#34d399", marginTop: "4px" }}>✓ Works: {analysis.whatWorks}</p>}
                            {analysis.recommendedStrategy && <p style={{ fontSize: "0.78rem", color: "#a78bfa", marginTop: "2px" }}>✦ Strategy: {analysis.recommendedStrategy}</p>}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}

              <Field label="Caption Language" labelNote="(select up to 2 — bilingual supported)">
                <div style={{ marginBottom: "10px" }}>
                  <span style={{ fontSize: "0.78rem", color: "rgba(241,241,241,0.4)" }}>
                    🌍 {form.captionLanguages.length === 2 ? `Bilingual: ${form.captionLanguages.join(" + ")}` : `Captions in ${form.captionLanguages[0] || "English"}`}
                  </span>
                </div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                  {LANGUAGES.map((lang) => {
                    const selected = form.captionLanguages.includes(lang);
                    const maxed = form.captionLanguages.length >= 2 && !selected;
                    return (
                      <button key={lang} type="button" onClick={() => { if (selected) { if (form.captionLanguages.length === 1) return; setForm({ ...form, captionLanguages: form.captionLanguages.filter(l => l !== lang) }); } else { if (maxed) return; setForm({ ...form, captionLanguages: [...form.captionLanguages, lang] }); } }}
                        style={{ ...pillBtn(selected, true), opacity: maxed ? 0.4 : 1, cursor: maxed ? "not-allowed" : "pointer" }}>
                        {lang}
                      </button>
                    );
                  })}
                </div>
              </Field>
            </Section>

            {/* ── NICHE INTELLIGENCE — per platform ── */}
            {form.platforms.length > 0 && (
              <Section title="🔍 Niche Intelligence (Optional — but powerful)">
                <div style={{ padding: "12px 16px", borderRadius: "10px", background: "rgba(167,139,250,0.06)", border: "1px solid rgba(167,139,250,0.2)" }}>
                  <p style={{ fontSize: "0.83rem", color: "rgba(241,241,241,0.6)", lineHeight: 1.6 }}>
                    For each platform, add 2–3 top creators in your niche and paste their best performing hooks. Our AI studies <strong style={{ color: "#a78bfa" }}>what makes their content work on that specific platform</strong> — then writes yours to beat it. We never copy, only learn the principles.
                  </p>
                </div>

                {form.platforms.map((platform) => {
                  const comps = getDefaultCompetitors(platform);
                  const isAnalysing = platformAnalysing[platform] ?? false;
                  const intelligence = platformNicheIntelligence[platform] ?? null;
                  const err = platformNicheError[platform] ?? "";
                  const platformPlaceholders: Record<string, string> = {
                    Instagram: "'Stop scrolling if you want to grow'\n'Nobody tells you this about Instagram'\n'3 mistakes killing your reach'",
                    TikTok: "'POV: you finally figured out content'\n'Things I wish someone told me earlier'\n'This blew up overnight and here's why'",
                    LinkedIn: "'After 10 years in [industry], here's what I learned'\n'Unpopular opinion: [bold take]'\n'Most people get this wrong about [topic]'",
                    Facebook: "'I almost gave up until I tried this'\n'Can anyone else relate to [situation]?'\n'Share this if you agree'",
                    YouTube: "'I tested [thing] for 30 days. Here's what happened'\n'The truth about [topic] nobody talks about'\n'Stop doing this if you want results'",
                  };

                  return (
                    <div key={platform} style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(123,47,255,0.15)", borderRadius: "14px", padding: "20px" }}>
                      <p style={{ fontSize: "0.78rem", fontWeight: 700, color: "#a78bfa", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: "14px" }}>
                        {platform} Competitors
                      </p>

                      <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginBottom: "14px" }}>
                        {comps.map((comp, i) => (
                          <div key={i} style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(123,47,255,0.1)", borderRadius: "10px", padding: "12px" }}>
                            <p style={{ fontSize: "0.68rem", fontWeight: 700, color: "rgba(167,139,250,0.6)", letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: "8px" }}>Competitor {i + 1}</p>
                            <input
                              type="text"
                              placeholder={`${platform} handle or brand name (e.g. @creator)`}
                              value={comp.name}
                              onChange={(e) => updateCompetitor(platform, i, "name", e.target.value)}
                              style={{ ...inputStyle, marginBottom: "8px", fontSize: "0.85rem" }}
                              onFocus={(e) => (e.target.style.borderColor = "#7B2FFF")}
                              onBlur={(e) => (e.target.style.borderColor = "rgba(123,47,255,0.2)")}
                            />
                            <textarea
                              rows={3}
                              placeholder={`Paste their top 3–5 hooks or captions...\n\n${platformPlaceholders[platform] ?? ""}`}
                              value={comp.posts}
                              onChange={(e) => updateCompetitor(platform, i, "posts", e.target.value)}
                              style={{ ...inputStyle, resize: "vertical", lineHeight: 1.6, fontFamily: "inherit", fontSize: "0.83rem" }}
                              onFocus={(e) => (e.target.style.borderColor = "#7B2FFF")}
                              onBlur={(e) => (e.target.style.borderColor = "rgba(123,47,255,0.2)")}
                            />
                          </div>
                        ))}
                      </div>

                      {err && (
                        <div style={{ padding: "8px 12px", borderRadius: "8px", background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.25)", color: "#ef4444", fontSize: "0.8rem", marginBottom: "10px" }}>{err}</div>
                      )}

                      <button type="button" onClick={() => analyseNiche(platform)} disabled={isAnalysing}
                        style={{ padding: "10px 20px", borderRadius: "9px", background: isAnalysing ? "rgba(123,47,255,0.3)" : intelligence ? "rgba(52,211,153,0.15)" : "rgba(123,47,255,0.15)", border: `1px solid ${intelligence ? "rgba(52,211,153,0.4)" : "rgba(123,47,255,0.4)"}`, color: intelligence ? "#34d399" : "#a78bfa", fontWeight: 700, fontSize: "0.83rem", cursor: isAnalysing ? "not-allowed" : "pointer", transition: "all 0.2s" }}>
                        {isAnalysing ? `🔍 Analysing ${platform}...` : intelligence ? `✓ ${platform} Analysed — Re-analyse` : `🔍 Analyse ${platform} Niche`}
                      </button>

                      {intelligence && (
                        <div style={{ marginTop: "12px", padding: "14px", borderRadius: "10px", background: "rgba(52,211,153,0.05)", border: "1px solid rgba(52,211,153,0.2)" }}>
                          <p style={{ fontSize: "0.7rem", fontWeight: 700, color: "#34d399", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: "10px" }}>✓ {platform} Niche Intelligence Ready</p>
                          {intelligence.hookPatterns && (
                            <p style={{ fontSize: "0.78rem", color: "rgba(241,241,241,0.5)", lineHeight: 1.5, marginBottom: "6px" }}><strong style={{ color: "rgba(241,241,241,0.7)" }}>Hook patterns:</strong> {intelligence.hookPatterns}</p>
                          )}
                          {intelligence.whatMakesItWork && (
                            <p style={{ fontSize: "0.78rem", color: "rgba(241,241,241,0.5)", lineHeight: 1.5, marginBottom: "6px" }}><strong style={{ color: "rgba(241,241,241,0.7)" }}>What works:</strong> {intelligence.whatMakesItWork}</p>
                          )}
                          {intelligence.howToDoItBetter && (
                            <p style={{ fontSize: "0.78rem", color: "rgba(167,139,250,0.7)", lineHeight: 1.5 }}><strong style={{ color: "#a78bfa" }}>How we&apos;ll beat them:</strong> {intelligence.howToDoItBetter}</p>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </Section>
            )}

            {/* ── BRAND IDENTITY ── */}
            <Section title="Brand Identity">
              <Field label="Brand Colours" labelNote="(click a swatch to change, up to 4)">
                <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap", padding: "12px 14px", borderRadius: "10px", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(123,47,255,0.2)" }}>
                  {colorSwatches.map((color, idx) => (
                    <div key={idx} style={{ position: "relative", display: "inline-flex" }}>
                      <button type="button" title={color} onClick={() => { const inp = document.getElementById(`color-inp-${idx}`) as HTMLInputElement; inp?.click(); }}
                        style={{ width: "40px", height: "40px", borderRadius: "50%", background: color, border: "2px solid rgba(255,255,255,0.25)", cursor: "pointer", boxShadow: "0 2px 8px rgba(0,0,0,0.4)", flexShrink: 0, transition: "transform 0.15s" }}
                        onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.transform = "scale(1.1)"; }}
                        onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.transform = "scale(1)"; }} />
                      <input id={`color-inp-${idx}`} type="color" value={color}
                        onChange={(e) => { const u = [...colorSwatches]; u[idx] = e.target.value; setColorSwatches(u); }}
                        style={{ position: "absolute", opacity: 0, width: "1px", height: "1px", pointerEvents: "none" }} />
                      {colorSwatches.length > 1 && (
                        <button type="button" onClick={() => setColorSwatches(colorSwatches.filter((_, i) => i !== idx))}
                          style={{ position: "absolute", top: "-5px", right: "-5px", width: "16px", height: "16px", borderRadius: "50%", background: "#1C1B2E", border: "1px solid rgba(255,255,255,0.2)", color: "rgba(241,241,241,0.7)", fontSize: "10px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", padding: 0 }}>×</button>
                      )}
                    </div>
                  ))}
                  {colorSwatches.length < 4 && (
                    <button type="button" onClick={() => setColorSwatches([...colorSwatches, "#7B2FFF"])}
                      style={{ width: "40px", height: "40px", borderRadius: "50%", background: "transparent", border: "2px dashed rgba(123,47,255,0.4)", cursor: "pointer", color: "rgba(123,47,255,0.7)", fontSize: "20px", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>+</button>
                  )}
                  <span style={{ fontSize: "0.78rem", color: "rgba(241,241,241,0.35)", marginLeft: "4px" }}>
                    {colorSwatches.map(c => c).join("  ·  ")}
                  </span>
                </div>
              </Field>
              <Field label="Logo" labelNote="(optional — PNG or JPG)">
                <label style={{ display: "flex", alignItems: "center", gap: "12px", padding: "12px 16px", borderRadius: "10px", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(123,47,255,0.2)", cursor: "pointer", transition: "border-color 0.2s" }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLLabelElement).style.borderColor = "#7B2FFF"; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLLabelElement).style.borderColor = "rgba(123,47,255,0.2)"; }}>
                  <span style={{ fontSize: "1.3rem" }}>🖼️</span>
                  <div>
                    <p style={{ fontSize: "0.88rem", color: logoName ? "#a78bfa" : "rgba(241,241,241,0.5)", fontWeight: logoName ? 600 : 400 }}>{logoName || "Click to upload your logo"}</p>
                    {!logoName && <p style={{ fontSize: "0.75rem", color: "rgba(241,241,241,0.3)" }}>PNG, JPG up to 5MB</p>}
                  </div>
                  <input type="file" accept="image/*" style={{ display: "none" }} onChange={handleLogoUpload} />
                </label>
              </Field>
            </Section>

            {/* Error */}
            {error && <div style={{ padding: "12px 16px", borderRadius: "10px", background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.25)", color: "#ef4444", fontSize: "0.88rem" }}>{error}</div>}

            {/* Submit */}
            <button type="submit" disabled={loading}
              style={{ padding: "18px 32px", borderRadius: "14px", background: loading ? "rgba(123,47,255,0.5)" : "linear-gradient(135deg,#7B2FFF,#ec4899)", color: "#fff", fontWeight: 800, fontSize: "1.1rem", border: "none", cursor: loading ? "not-allowed" : "pointer", boxShadow: "0 6px 28px rgba(123,47,255,0.45)", transition: "all 0.2s ease", display: "flex", alignItems: "center", justifyContent: "center", gap: "10px" }}
              onMouseEnter={(e) => { if (!loading) (e.currentTarget as HTMLButtonElement).style.transform = "translateY(-2px)"; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.transform = "translateY(0)"; }}>
              {loading ? (
                <><span style={{ display: "inline-block", width: "18px", height: "18px", borderRadius: "50%", border: "2px solid rgba(255,255,255,0.3)", borderTop: "2px solid #fff", animation: "spin 0.8s linear infinite" }} />Sending to AI...</>
              ) : "🍳 Generate My Content →"}
            </button>

          </form>
        )}
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        select option { background: #1C1B2E; color: #F1F1F1; }
      `}</style>
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
  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }} className="bp-grid">
      {children}
      <style>{`@media(max-width:600px){.bp-grid{grid-template-columns:1fr!important}}`}</style>
    </div>
  );
}

function Field({ label, labelNote, required, children }: { label: string; labelNote?: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div>
      <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 700, color: "rgba(241,241,241,0.55)", marginBottom: "7px", letterSpacing: "0.06em", textTransform: "uppercase" }}>
        {label}{labelNote && <span style={{ fontWeight: 400, textTransform: "none", color: "rgba(241,241,241,0.35)", letterSpacing: 0 }}> {labelNote}</span>}{required && <span style={{ color: "#7B2FFF" }}> *</span>}
      </label>
      {children}
    </div>
  );
}
