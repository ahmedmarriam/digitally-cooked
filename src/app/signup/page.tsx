"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SignupPage() {
  const router = useRouter();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || "Signup failed."); return; }
      router.push("/brand-profile");
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const inputStyle: React.CSSProperties = {
    width: "100%",
    padding: "12px 14px",
    borderRadius: "10px",
    background: "rgba(255,255,255,0.05)",
    border: "1px solid rgba(123,47,255,0.25)",
    color: "#F1F1F1",
    fontSize: "0.95rem",
    outline: "none",
    boxSizing: "border-box",
    transition: "border-color 0.2s",
  };

  return (
    <div style={{ minHeight: "100vh", background: "#0F0E1A", display: "flex", alignItems: "center", justifyContent: "center", padding: "24px", fontFamily: "var(--font-geist-sans), Arial, sans-serif" }}>
      {/* Background orbs */}
      <div style={{ position: "fixed", inset: 0, overflow: "hidden", pointerEvents: "none" }}>
        <div style={{ position: "absolute", width: "500px", height: "500px", borderRadius: "50%", background: "radial-gradient(circle, #7B2FFF 0%, transparent 70%)", top: "-100px", right: "-150px", opacity: 0.1, filter: "blur(80px)" }} />
        <div style={{ position: "absolute", width: "400px", height: "400px", borderRadius: "50%", background: "radial-gradient(circle, #f97316 0%, transparent 70%)", bottom: "-80px", left: "-80px", opacity: 0.08, filter: "blur(80px)" }} />
      </div>

      <div style={{ width: "100%", maxWidth: "420px", position: "relative" }}>
        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: "36px" }}>
          <a href="/" style={{ textDecoration: "none", display: "inline-flex", flexDirection: "column", alignItems: "center", gap: "12px" }}>
            <div style={{ width: "52px", height: "52px", borderRadius: "16px", background: "linear-gradient(135deg, #7B2FFF, #ec4899, #f97316)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "24px", boxShadow: "0 8px 28px rgba(123,47,255,0.4)" }}>🍳</div>
            <span style={{ fontWeight: 800, fontSize: "1.1rem", letterSpacing: "0.05em", color: "#F1F1F1" }}>
              DIGITALLY <span style={{ background: "linear-gradient(90deg, #a78bfa, #ec4899)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>COOKED</span>
            </span>
          </a>
          <p style={{ color: "rgba(241,241,241,0.45)", fontSize: "0.9rem", marginTop: "10px" }}>Create your account and start generating.</p>
        </div>

        {/* Card */}
        <div style={{ background: "#1C1B2E", border: "1px solid rgba(123,47,255,0.2)", borderRadius: "20px", padding: "36px 32px", boxShadow: "0 20px 60px rgba(0,0,0,0.5)" }}>
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
            {[
              { key: "name", label: "FULL NAME", type: "text", placeholder: "Jane Smith" },
              { key: "email", label: "EMAIL", type: "email", placeholder: "you@example.com" },
              { key: "password", label: "PASSWORD", type: "password", placeholder: "Min. 6 characters" },
            ].map(({ key, label, type, placeholder }) => (
              <div key={key}>
                <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 600, color: "rgba(241,241,241,0.6)", marginBottom: "7px", letterSpacing: "0.04em" }}>{label}</label>
                <input
                  type={type}
                  required
                  placeholder={placeholder}
                  value={form[key as keyof typeof form]}
                  onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                  style={inputStyle}
                  onFocus={(e) => (e.target.style.borderColor = "rgba(123,47,255,0.7)")}
                  onBlur={(e) => (e.target.style.borderColor = "rgba(123,47,255,0.25)")}
                />
              </div>
            ))}

            {error && (
              <div style={{ padding: "10px 14px", borderRadius: "8px", background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.25)", color: "#ef4444", fontSize: "0.85rem" }}>{error}</div>
            )}

            <button
              type="submit"
              disabled={loading}
              style={{ padding: "14px", borderRadius: "12px", background: loading ? "rgba(123,47,255,0.5)" : "#7B2FFF", color: "#fff", fontWeight: 700, fontSize: "1rem", border: "none", cursor: loading ? "not-allowed" : "pointer", boxShadow: "0 4px 20px rgba(123,47,255,0.4)", marginTop: "4px", transition: "background 0.2s" }}
              onMouseEnter={(e) => { if (!loading) (e.currentTarget as HTMLButtonElement).style.background = "#6920ee"; }}
              onMouseLeave={(e) => { if (!loading) (e.currentTarget as HTMLButtonElement).style.background = "#7B2FFF"; }}
            >
              {loading ? "Creating account..." : "Create Account →"}
            </button>
          </form>
        </div>

        <p style={{ textAlign: "center", marginTop: "24px", color: "rgba(241,241,241,0.4)", fontSize: "0.88rem" }}>
          Already have an account?{" "}
          <a href="/login" style={{ color: "#a78bfa", fontWeight: 600, textDecoration: "none" }}>Log in →</a>
        </p>
      </div>
    </div>
  );
}
