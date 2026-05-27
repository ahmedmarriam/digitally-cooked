"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import AppSidebar from "@/components/AppSidebar";

// ─── Types ────────────────────────────────────────────────────
interface BrandKit {
  // Step 1
  primaryVibe: string;
  formalityLevel: string;
  customerEmotion: string;
  businessSize: string;
  contentGoal: string;
  // Step 2
  toneOfVoice: string;
  // Step 3
  ageRanges: string[];
  location: string;
  interests: string;
  painPoints: [string, string, string];
  // Step 4
  whatYouDo: string;
  whoYouServe: string;
  howYouDiffer: string;
  // Step 5
  colorPalette: string;
  // Step 6
  mission: string;
  vision: string;
  values: string;
}

const EMPTY: BrandKit = {
  primaryVibe: "", formalityLevel: "", customerEmotion: "", businessSize: "", contentGoal: "",
  toneOfVoice: "",
  ageRanges: [], location: "", interests: "", painPoints: ["", "", ""],
  whatYouDo: "", whoYouServe: "", howYouDiffer: "",
  colorPalette: "",
  mission: "", vision: "", values: "",
};

// ─── Step data ────────────────────────────────────────────────
const TONES = [
  { key: "warm", label: "Warm & Inspiring", icon: "🌸", preview: '"Your dreams are valid, and we\'re here to help you achieve them. Every step forward counts — no matter how small."' },
  { key: "bold", label: "Bold & Direct", icon: "⚡", preview: '"Stop playing small. Here\'s exactly what you need to do, and why you need to do it now."' },
  { key: "professional", label: "Professional & Authoritative", icon: "💼", preview: '"Our data-driven approach delivers measurable results. Here\'s the evidence-based framework we recommend."' },
  { key: "humorous", label: "Humorous & Relatable", icon: "😄", preview: '"We said what we said. Your brand deserves better than \'just winging it\' — and yes, we all know you\'ve been winging it."' },
  { key: "educational", label: "Educational & Informative", icon: "📚", preview: '"In today\'s post we\'re breaking down the three core concepts you need to understand before you can truly grow your presence."' },
];

const PALETTES = [
  { key: "royal", label: "Royal Purple", colors: ["#7B2FFF", "#a78bfa", "#1C1B2E", "#F1F1F1"], desc: "Bold, premium, tech-forward" },
  { key: "sunset", label: "Sunset Energy", colors: ["#f97316", "#ec4899", "#1a0a0a", "#fff"], desc: "Vibrant, energetic, creative" },
  { key: "ocean", label: "Ocean Trust", colors: ["#0ea5e9", "#22d3ee", "#0a1628", "#f0f9ff"], desc: "Calm, trustworthy, professional" },
  { key: "earth", label: "Warm Earth", colors: ["#d97706", "#92400e", "#1c1410", "#fef3c7"], desc: "Natural, authentic, grounded" },
  { key: "midnight", label: "Midnight Elite", colors: ["#6366f1", "#818cf8", "#080714", "#e2e8f0"], desc: "Sophisticated, exclusive, modern" },
  { key: "forest", label: "Forest Growth", colors: ["#16a34a", "#4ade80", "#0a1a0e", "#f0fdf4"], desc: "Growth, health, sustainability" },
];

const inputStyle: React.CSSProperties = {
  width: "100%", padding: "11px 14px", borderRadius: "10px",
  background: "rgba(255,255,255,0.04)", border: "1px solid rgba(123,47,255,0.2)",
  color: "#F1F1F1", fontSize: "0.9rem", outline: "none", boxSizing: "border-box",
  transition: "border-color 0.2s",
};

const labelStyle: React.CSSProperties = {
  display: "block", fontSize: "0.78rem", fontWeight: 700,
  color: "rgba(241,241,241,0.5)", letterSpacing: "0.05em", marginBottom: "7px",
};

// ─── Component ────────────────────────────────────────────────
export default function BrandKitPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [kit, setKit] = useState<BrandKit>(EMPTY);
  const [done, setDone] = useState(false);

  const totalSteps = 6;
  const progress = (step / totalSteps) * 100;

  const set = (key: keyof BrandKit, val: unknown) => setKit((k) => ({ ...k, [key]: val }));

  const toggleAge = (age: string) => {
    const current = kit.ageRanges;
    set("ageRanges", current.includes(age) ? current.filter((a) => a !== age) : [...current, age]);
  };

  const positioningStatement =
    kit.whatYouDo && kit.whoYouServe && kit.howYouDiffer
      ? `We help ${kit.whoYouServe} ${kit.whatYouDo}, unlike anyone else because ${kit.howYouDiffer}.`
      : "";

  const handleFinish = () => {
    // Save to localStorage so brand-profile can auto-fill
    try { localStorage.setItem("dc_brand_kit", JSON.stringify(kit)); } catch {}
    setDone(true);
  };

  const canNext = () => {
    if (step === 1) return kit.primaryVibe && kit.formalityLevel && kit.customerEmotion && kit.businessSize && kit.contentGoal;
    if (step === 2) return !!kit.toneOfVoice;
    if (step === 3) return kit.ageRanges.length > 0 && kit.location;
    if (step === 4) return kit.whatYouDo && kit.whoYouServe && kit.howYouDiffer;
    if (step === 5) return !!kit.colorPalette;
    if (step === 6) return kit.mission && kit.vision;
    return false;
  };

  // ── Done screen ──────────────────────────────────────────────
  if (done) {
    const palette = PALETTES.find((p) => p.key === kit.colorPalette);
    return (
      <div style={{ display: "flex", minHeight: "100vh", background: "#0F0E1A", fontFamily: "var(--font-geist-sans), Arial, sans-serif" }}>
        <AppSidebar />
        <main style={{ flex: 1, overflowY: "auto", padding: "36px 32px", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ maxWidth: "620px", width: "100%", textAlign: "center" }}>
            {/* Celebration */}
            <div style={{ fontSize: "4rem", marginBottom: "16px" }}>🎉</div>
            <h1 style={{ fontSize: "2rem", fontWeight: 800, color: "#F1F1F1", marginBottom: "12px" }}>Your Brand Kit is Ready!</h1>
            <p style={{ color: "rgba(241,241,241,0.5)", marginBottom: "36px" }}>This has been saved and will auto-fill your brand profile when you generate content.</p>

            {/* Brand Kit Card */}
            <div style={{ background: "#1C1B2E", border: "1px solid rgba(123,47,255,0.3)", borderRadius: "20px", padding: "28px", textAlign: "left", marginBottom: "28px", boxShadow: "0 20px 60px rgba(0,0,0,0.4)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "24px" }}>
                <div style={{ width: "48px", height: "48px", borderRadius: "14px", background: "linear-gradient(135deg, #7B2FFF, #ec4899)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "22px" }}>✦</div>
                <div>
                  <p style={{ fontSize: "0.72rem", color: "rgba(241,241,241,0.4)", fontWeight: 700, letterSpacing: "0.06em" }}>BRAND KIT</p>
                  <p style={{ fontSize: "1.1rem", fontWeight: 800, color: "#F1F1F1" }}>{kit.primaryVibe} · {kit.toneOfVoice}</p>
                </div>
              </div>

              {positioningStatement && (
                <div style={{ padding: "14px 18px", borderRadius: "12px", background: "rgba(123,47,255,0.1)", border: "1px solid rgba(123,47,255,0.2)", marginBottom: "18px" }}>
                  <p style={{ fontSize: "0.7rem", fontWeight: 700, color: "#a78bfa", letterSpacing: "0.06em", marginBottom: "6px" }}>POSITIONING STATEMENT</p>
                  <p style={{ fontSize: "0.88rem", color: "#F1F1F1", lineHeight: 1.6 }}>{positioningStatement}</p>
                </div>
              )}

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px", marginBottom: "18px" }}>
                {[
                  { label: "TONE OF VOICE", value: TONES.find(t => t.key === kit.toneOfVoice)?.label },
                  { label: "AUDIENCE", value: `${kit.ageRanges.join(", ")} · ${kit.location}` },
                  { label: "CONTENT GOAL", value: kit.contentGoal },
                  { label: "BRAND SIZE", value: kit.businessSize },
                ].map(({ label, value }) => (
                  <div key={label} style={{ padding: "12px 14px", borderRadius: "10px", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
                    <p style={{ fontSize: "0.68rem", fontWeight: 700, color: "rgba(241,241,241,0.35)", letterSpacing: "0.06em", marginBottom: "4px" }}>{label}</p>
                    <p style={{ fontSize: "0.82rem", color: "rgba(241,241,241,0.8)", fontWeight: 500 }}>{value || "—"}</p>
                  </div>
                ))}
              </div>

              {palette && (
                <div>
                  <p style={{ fontSize: "0.7rem", fontWeight: 700, color: "rgba(241,241,241,0.35)", letterSpacing: "0.06em", marginBottom: "8px" }}>COLOR PALETTE — {palette.label}</p>
                  <div style={{ display: "flex", gap: "8px" }}>
                    {palette.colors.map((c) => (
                      <div key={c} style={{ width: "36px", height: "36px", borderRadius: "8px", background: c, border: "1px solid rgba(255,255,255,0.1)" }} />
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div style={{ display: "flex", gap: "12px", justifyContent: "center" }}>
              <a href="/brand-profile" style={{ padding: "14px 28px", borderRadius: "12px", background: "linear-gradient(135deg, #7B2FFF, #ec4899)", color: "#fff", fontWeight: 700, fontSize: "0.95rem", textDecoration: "none", boxShadow: "0 4px 20px rgba(123,47,255,0.4)" }}>
                🍳 Generate My Content →
              </a>
              <button onClick={() => router.push("/dashboard")} style={{ padding: "14px 28px", borderRadius: "12px", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", color: "rgba(241,241,241,0.6)", fontWeight: 600, fontSize: "0.95rem", cursor: "pointer" }}>
                Back to Dashboard
              </button>
            </div>
          </div>
        </main>
      </div>
    );
  }

  // ── Wizard ────────────────────────────────────────────────────
  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#0F0E1A", fontFamily: "var(--font-geist-sans), Arial, sans-serif" }}>
      <AppSidebar />
      <main style={{ flex: 1, overflowY: "auto", padding: "36px 32px" }}>
        <div style={{ maxWidth: "680px", margin: "0 auto" }}>

          {/* Header */}
          <div style={{ marginBottom: "36px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "6px" }}>
              <span style={{ fontSize: "0.72rem", fontWeight: 700, color: "#a78bfa", letterSpacing: "0.08em" }}>STEP {step} OF {totalSteps}</span>
            </div>
            <h1 style={{ fontSize: "1.6rem", fontWeight: 800, color: "#F1F1F1", letterSpacing: "-0.02em" }}>Brand Kit Builder ✦</h1>
            <p style={{ color: "rgba(241,241,241,0.4)", fontSize: "0.88rem", marginTop: "4px" }}>Build your brand strategy before generating content.</p>

            {/* Progress bar */}
            <div style={{ height: "4px", background: "rgba(255,255,255,0.06)", borderRadius: "999px", marginTop: "20px", overflow: "hidden" }}>
              <div style={{ height: "100%", width: `${progress}%`, background: "linear-gradient(90deg, #7B2FFF, #ec4899)", borderRadius: "999px", transition: "width 0.4s ease" }} />
            </div>

            {/* Step tabs */}
            <div style={{ display: "flex", gap: "6px", marginTop: "16px" }}>
              {["Personality", "Tone", "Audience", "Positioning", "Colours", "Mission"].map((s, i) => (
                <button
                  key={s}
                  onClick={() => i + 1 < step && setStep(i + 1)}
                  style={{ flex: 1, padding: "6px 4px", borderRadius: "8px", fontSize: "0.68rem", fontWeight: 600, border: "none", cursor: i + 1 < step ? "pointer" : "default", background: step === i + 1 ? "rgba(123,47,255,0.25)" : i + 1 < step ? "rgba(123,47,255,0.12)" : "rgba(255,255,255,0.03)", color: step === i + 1 ? "#a78bfa" : i + 1 < step ? "rgba(167,139,250,0.7)" : "rgba(241,241,241,0.25)", transition: "all 0.2s" }}
                >
                  {i + 1 < step ? "✓" : `${i + 1}`} {s}
                </button>
              ))}
            </div>
          </div>

          {/* ── STEP 1: Brand Personality ── */}
          {step === 1 && (
            <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
              <StepCard title="What's your brand's primary vibe?" icon="🎯">
                <OptionGrid
                  options={["Inspiring", "Bold & Disruptive", "Professional", "Playful", "Elegant & Luxury"]}
                  selected={kit.primaryVibe}
                  onSelect={(v) => set("primaryVibe", v)}
                />
              </StepCard>
              <StepCard title="How formal is your communication style?" icon="🗣️">
                <OptionGrid
                  options={["Very Casual", "Casual & Friendly", "Balanced", "Formal", "Very Formal"]}
                  selected={kit.formalityLevel}
                  onSelect={(v) => set("formalityLevel", v)}
                />
              </StepCard>
              <StepCard title="What emotion should your audience feel?" icon="💡">
                <OptionGrid
                  options={["Excited & Energised", "Trusted & Safe", "Inspired", "Empowered", "Entertained"]}
                  selected={kit.customerEmotion}
                  onSelect={(v) => set("customerEmotion", v)}
                />
              </StepCard>
              <StepCard title="What size is your business?" icon="🏢">
                <OptionGrid
                  options={["Solo Creator", "Small Business (2-10)", "Growing Team (11-50)", "Agency / Multi-Brand", "Enterprise"]}
                  selected={kit.businessSize}
                  onSelect={(v) => set("businessSize", v)}
                />
              </StepCard>
              <StepCard title="What's your #1 content goal?" icon="🚀">
                <OptionGrid
                  options={["Build Brand Awareness", "Drive Sales & Leads", "Build Community", "Educate My Audience", "Position as Expert"]}
                  selected={kit.contentGoal}
                  onSelect={(v) => set("contentGoal", v)}
                />
              </StepCard>
            </div>
          )}

          {/* ── STEP 2: Tone of Voice ── */}
          {step === 2 && (
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <p style={{ color: "rgba(241,241,241,0.5)", fontSize: "0.9rem", marginBottom: "8px" }}>Select the tone that best matches your brand. See how each sounds in the preview below.</p>
              {TONES.map(({ key, label, icon, preview }) => {
                const active = kit.toneOfVoice === key;
                return (
                  <div
                    key={key}
                    onClick={() => set("toneOfVoice", key)}
                    style={{ padding: "20px 22px", borderRadius: "14px", background: active ? "rgba(123,47,255,0.12)" : "#1C1B2E", border: `1.5px solid ${active ? "rgba(123,47,255,0.5)" : "rgba(255,255,255,0.06)"}`, cursor: "pointer", transition: "all 0.2s" }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "10px" }}>
                      <span style={{ fontSize: "1.2rem" }}>{icon}</span>
                      <span style={{ fontWeight: 700, color: active ? "#F1F1F1" : "rgba(241,241,241,0.7)", fontSize: "0.95rem" }}>{label}</span>
                      {active && <span style={{ marginLeft: "auto", fontSize: "0.72rem", padding: "3px 10px", borderRadius: "999px", background: "rgba(123,47,255,0.3)", color: "#a78bfa", fontWeight: 700 }}>Selected</span>}
                    </div>
                    <p style={{ fontSize: "0.82rem", color: active ? "rgba(241,241,241,0.7)" : "rgba(241,241,241,0.4)", fontStyle: "italic", lineHeight: 1.5, paddingLeft: "30px" }}>
                      {preview}
                    </p>
                  </div>
                );
              })}
            </div>
          )}

          {/* ── STEP 3: Target Audience ── */}
          {step === 3 && (
            <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
              <StepCard title="Age range (select all that apply)" icon="👤">
                <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                  {["Under 18", "18–24", "25–34", "35–44", "45–54", "55+"].map((age) => (
                    <button
                      key={age}
                      onClick={() => toggleAge(age)}
                      style={{ padding: "8px 16px", borderRadius: "999px", border: `1px solid ${kit.ageRanges.includes(age) ? "rgba(123,47,255,0.6)" : "rgba(255,255,255,0.1)"}`, background: kit.ageRanges.includes(age) ? "rgba(123,47,255,0.2)" : "rgba(255,255,255,0.03)", color: kit.ageRanges.includes(age) ? "#a78bfa" : "rgba(241,241,241,0.5)", fontSize: "0.85rem", fontWeight: 600, cursor: "pointer", transition: "all 0.18s" }}
                    >
                      {age}
                    </button>
                  ))}
                </div>
              </StepCard>
              <StepCard title="Where is your audience located?" icon="🌍">
                <input value={kit.location} onChange={(e) => set("location", e.target.value)} placeholder="e.g. United States, UK, Global" style={inputStyle} onFocus={(e) => (e.target.style.borderColor = "rgba(123,47,255,0.6)")} onBlur={(e) => (e.target.style.borderColor = "rgba(123,47,255,0.2)")} />
              </StepCard>
              <StepCard title="What are their main interests?" icon="❤️">
                <input value={kit.interests} onChange={(e) => set("interests", e.target.value)} placeholder="e.g. entrepreneurship, fitness, personal development" style={inputStyle} onFocus={(e) => (e.target.style.borderColor = "rgba(123,47,255,0.6)")} onBlur={(e) => (e.target.style.borderColor = "rgba(123,47,255,0.2)")} />
              </StepCard>
              <StepCard title="What are their 3 biggest pain points?" icon="😤">
                {(["Pain point 1...", "Pain point 2...", "Pain point 3..."] as const).map((ph, i) => (
                  <input
                    key={i}
                    value={kit.painPoints[i]}
                    onChange={(e) => {
                      const next: [string, string, string] = [...kit.painPoints] as [string, string, string];
                      next[i] = e.target.value;
                      set("painPoints", next);
                    }}
                    placeholder={ph}
                    style={{ ...inputStyle, marginBottom: i < 2 ? "10px" : 0 }}
                    onFocus={(e) => (e.target.style.borderColor = "rgba(123,47,255,0.6)")}
                    onBlur={(e) => (e.target.style.borderColor = "rgba(123,47,255,0.2)")}
                  />
                ))}
              </StepCard>
            </div>
          )}

          {/* ── STEP 4: Positioning ── */}
          {step === 4 && (
            <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
              <p style={{ color: "rgba(241,241,241,0.5)", fontSize: "0.9rem" }}>Fill in the three pieces below and we&apos;ll auto-generate your positioning statement.</p>
              <div>
                <label style={labelStyle}>WHAT DO YOU HELP PEOPLE DO?</label>
                <input value={kit.whatYouDo} onChange={(e) => set("whatYouDo", e.target.value)} placeholder="e.g. grow their social media presence without spending hours on content" style={inputStyle} onFocus={(e) => (e.target.style.borderColor = "rgba(123,47,255,0.6)")} onBlur={(e) => (e.target.style.borderColor = "rgba(123,47,255,0.2)")} />
              </div>
              <div>
                <label style={labelStyle}>WHO DO YOU SERVE?</label>
                <input value={kit.whoYouServe} onChange={(e) => set("whoYouServe", e.target.value)} placeholder="e.g. small business owners and personal brands" style={inputStyle} onFocus={(e) => (e.target.style.borderColor = "rgba(123,47,255,0.6)")} onBlur={(e) => (e.target.style.borderColor = "rgba(123,47,255,0.2)")} />
              </div>
              <div>
                <label style={labelStyle}>WHAT MAKES YOU DIFFERENT?</label>
                <input value={kit.howYouDiffer} onChange={(e) => set("howYouDiffer", e.target.value)} placeholder="e.g. we automate everything end-to-end in under 5 minutes" style={inputStyle} onFocus={(e) => (e.target.style.borderColor = "rgba(123,47,255,0.6)")} onBlur={(e) => (e.target.style.borderColor = "rgba(123,47,255,0.2)")} />
              </div>

              {positioningStatement && (
                <div style={{ padding: "18px 20px", borderRadius: "14px", background: "rgba(123,47,255,0.1)", border: "1px solid rgba(123,47,255,0.3)" }}>
                  <p style={{ fontSize: "0.7rem", fontWeight: 700, color: "#a78bfa", letterSpacing: "0.06em", marginBottom: "8px" }}>✦ YOUR POSITIONING STATEMENT</p>
                  <p style={{ fontSize: "0.95rem", color: "#F1F1F1", lineHeight: 1.6, fontWeight: 500 }}>{positioningStatement}</p>
                </div>
              )}
            </div>
          )}

          {/* ── STEP 5: Color Palette ── */}
          {step === 5 && (
            <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
              <p style={{ color: "rgba(241,241,241,0.5)", fontSize: "0.9rem", marginBottom: "8px" }}>Choose the palette that best represents your brand&apos;s feel.</p>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" }}>
                {PALETTES.map(({ key, label, colors, desc }) => {
                  const active = kit.colorPalette === key;
                  return (
                    <div
                      key={key}
                      onClick={() => set("colorPalette", key)}
                      style={{ padding: "18px", borderRadius: "14px", background: active ? "rgba(123,47,255,0.1)" : "#1C1B2E", border: `1.5px solid ${active ? "rgba(123,47,255,0.5)" : "rgba(255,255,255,0.06)"}`, cursor: "pointer", transition: "all 0.2s" }}
                    >
                      <div style={{ display: "flex", gap: "7px", marginBottom: "12px" }}>
                        {colors.map((c) => <div key={c} style={{ width: "28px", height: "28px", borderRadius: "7px", background: c, border: "1px solid rgba(255,255,255,0.1)", flexShrink: 0 }} />)}
                      </div>
                      <p style={{ fontSize: "0.88rem", fontWeight: 700, color: active ? "#F1F1F1" : "rgba(241,241,241,0.7)", marginBottom: "4px" }}>{label}</p>
                      <p style={{ fontSize: "0.75rem", color: "rgba(241,241,241,0.35)" }}>{desc}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ── STEP 6: Mission + Vision ── */}
          {step === 6 && (
            <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
              <div>
                <label style={labelStyle}>BRAND MISSION — What do you do today?</label>
                <textarea
                  value={kit.mission}
                  onChange={(e) => set("mission", e.target.value)}
                  placeholder="e.g. We empower small business owners to show up consistently on social media without it taking over their lives."
                  rows={3}
                  style={{ ...inputStyle, resize: "vertical" }}
                  onFocus={(e) => (e.target.style.borderColor = "rgba(123,47,255,0.6)")}
                  onBlur={(e) => (e.target.style.borderColor = "rgba(123,47,255,0.2)")}
                />
              </div>
              <div>
                <label style={labelStyle}>BRAND VISION — What are you building toward?</label>
                <textarea
                  value={kit.vision}
                  onChange={(e) => set("vision", e.target.value)}
                  placeholder="e.g. A world where every business, regardless of size or budget, has access to world-class content marketing."
                  rows={3}
                  style={{ ...inputStyle, resize: "vertical" }}
                  onFocus={(e) => (e.target.style.borderColor = "rgba(123,47,255,0.6)")}
                  onBlur={(e) => (e.target.style.borderColor = "rgba(123,47,255,0.2)")}
                />
              </div>
              <div>
                <label style={labelStyle}>CORE VALUES (comma-separated)</label>
                <input
                  value={kit.values}
                  onChange={(e) => set("values", e.target.value)}
                  placeholder="e.g. Authenticity, Innovation, Simplicity, Results"
                  style={inputStyle}
                  onFocus={(e) => (e.target.style.borderColor = "rgba(123,47,255,0.6)")}
                  onBlur={(e) => (e.target.style.borderColor = "rgba(123,47,255,0.2)")}
                />
                {kit.values && (
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "7px", marginTop: "10px" }}>
                    {kit.values.split(",").map((v) => v.trim()).filter(Boolean).map((v) => (
                      <span key={v} style={{ padding: "4px 12px", borderRadius: "999px", background: "rgba(123,47,255,0.15)", border: "1px solid rgba(123,47,255,0.3)", fontSize: "0.78rem", color: "#a78bfa", fontWeight: 600 }}>{v}</span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ── Navigation ── */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "36px", paddingTop: "24px", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
            <button
              onClick={() => setStep((s) => Math.max(1, s - 1))}
              disabled={step === 1}
              style={{ padding: "12px 24px", borderRadius: "10px", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", color: step === 1 ? "rgba(241,241,241,0.2)" : "rgba(241,241,241,0.6)", fontSize: "0.9rem", fontWeight: 600, cursor: step === 1 ? "not-allowed" : "pointer" }}
            >
              ← Back
            </button>

            {step < totalSteps ? (
              <button
                onClick={() => canNext() && setStep((s) => s + 1)}
                disabled={!canNext()}
                style={{ padding: "12px 32px", borderRadius: "10px", background: canNext() ? "#7B2FFF" : "rgba(123,47,255,0.3)", border: "none", color: "#fff", fontSize: "0.9rem", fontWeight: 700, cursor: canNext() ? "pointer" : "not-allowed", boxShadow: canNext() ? "0 4px 18px rgba(123,47,255,0.4)" : "none", transition: "all 0.2s" }}
              >
                Next Step →
              </button>
            ) : (
              <button
                onClick={() => canNext() && handleFinish()}
                disabled={!canNext()}
                style={{ padding: "12px 32px", borderRadius: "10px", background: canNext() ? "linear-gradient(135deg, #7B2FFF, #ec4899)" : "rgba(123,47,255,0.3)", border: "none", color: "#fff", fontSize: "0.9rem", fontWeight: 700, cursor: canNext() ? "pointer" : "not-allowed", boxShadow: canNext() ? "0 4px 20px rgba(123,47,255,0.4)" : "none", transition: "all 0.2s" }}
              >
                ✦ Complete Brand Kit →
              </button>
            )}
          </div>

        </div>
      </main>
    </div>
  );
}

// ─── Sub-components ───────────────────────────────────────────
function StepCard({ title, icon, children }: { title: string; icon: string; children: React.ReactNode }) {
  return (
    <div style={{ background: "#1C1B2E", border: "1px solid rgba(123,47,255,0.15)", borderRadius: "14px", padding: "22px 24px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "16px" }}>
        <span style={{ fontSize: "1.1rem" }}>{icon}</span>
        <p style={{ fontWeight: 700, color: "#F1F1F1", fontSize: "0.95rem" }}>{title}</p>
      </div>
      {children}
    </div>
  );
}

function OptionGrid({ options, selected, onSelect }: { options: string[]; selected: string; onSelect: (v: string) => void }) {
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
      {options.map((opt) => {
        const active = selected === opt;
        return (
          <button
            key={opt}
            onClick={() => onSelect(opt)}
            style={{ padding: "9px 16px", borderRadius: "10px", border: `1px solid ${active ? "rgba(123,47,255,0.6)" : "rgba(255,255,255,0.08)"}`, background: active ? "rgba(123,47,255,0.2)" : "rgba(255,255,255,0.03)", color: active ? "#a78bfa" : "rgba(241,241,241,0.6)", fontSize: "0.85rem", fontWeight: active ? 700 : 500, cursor: "pointer", transition: "all 0.18s" }}
          >
            {active ? "✓ " : ""}{opt}
          </button>
        );
      })}
    </div>
  );
}
