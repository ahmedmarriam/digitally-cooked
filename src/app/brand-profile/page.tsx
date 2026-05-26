"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const WEBHOOK_URL = "https://hook.us2.make.com/aba6mfll6svmbqt1zdxrya28p6t4ac1d";

const PLATFORMS = ["Instagram", "TikTok", "Facebook", "LinkedIn", "YouTube"];

const TONES = ["Professional", "Casual", "Humorous", "Inspirational", "Educational", "Bold"];
const STYLES = ["Minimal", "Bold", "Elegant", "Playful", "Corporate", "Lifestyle"];
const GOALS = ["Brand Awareness", "Lead Generation", "Sales", "Community Building", "Education"];
const FREQUENCIES = ["Daily", "3–4x per week", "2x per week", "Weekly"];
const BUSINESS_TYPES = ["Retail", "Service", "Restaurant", "Tech", "Healthcare", "Education", "Fitness", "Beauty", "Real Estate", "Other"];

export default function BrandProfilePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [logoName, setLogoName] = useState("");

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
  });

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
      await fetch(WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, logoFileName: logoName }),
        mode: "no-cors",
      });
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
        <div style={{ fontSize: "0.82rem", color: "rgba(241,241,241,0.4)" }}>Step 1 of 3 — Brand Profile</div>
      </div>

      <div style={{ maxWidth: "760px", margin: "0 auto", padding: "48px 24px 80px" }}>
        {/* Header */}
        <div style={{ marginBottom: "40px" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", padding: "5px 14px", borderRadius: "100px", background: "rgba(123,47,255,0.12)", border: "1px solid rgba(123,47,255,0.3)", color: "#a78bfa", fontSize: "0.78rem", fontWeight: 600, marginBottom: "16px" }}>
            🍳 Tell us about your brand
          </div>
          <h1 style={{ fontSize: "clamp(1.8rem, 4vw, 2.6rem)", fontWeight: 900, letterSpacing: "-0.02em", lineHeight: 1.1, marginBottom: "10px" }}>
            Your Brand Profile
          </h1>
          <p style={{ color: "rgba(241,241,241,0.5)", fontSize: "1rem", lineHeight: 1.6 }}>
            Fill in the details below. The more you share, the better your content will match your brand voice.
          </p>
        </div>

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
              <textarea required rows={2} placeholder="Describe your target customer — age, interests, pain points" value={form.idealCustomer} onChange={(e) => setForm({ ...form, idealCustomer: e.target.value })} style={{ ...inputStyle, resize: "vertical", lineHeight: 1.6 }} onFocus={(e) => (e.target.style.borderColor = "#7B2FFF")} onBlur={(e) => (e.target.style.borderColor = "rgba(123,47,255,0.2)")} />
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
            <Field label="Brand Colours" labelNote="(hex codes or colour names)">
              <input type="text" placeholder="e.g. #FF5733, Navy Blue, Gold" value={form.brandColors} onChange={(e) => setForm({ ...form, brandColors: e.target.value })} style={inputStyle} onFocus={(e) => (e.target.style.borderColor = "#7B2FFF")} onBlur={(e) => (e.target.style.borderColor = "rgba(123,47,255,0.2)")} />
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
                <input type="file" accept="image/*" style={{ display: "none" }} onChange={(e) => setLogoName(e.target.files?.[0]?.name || "")} />
              </label>
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
