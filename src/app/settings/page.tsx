"use client";

import AppSidebar from "@/components/AppSidebar";

export default function SettingsPage() {
  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#0F0E1A", fontFamily: "var(--font-geist-sans), Arial, sans-serif" }}>
      <AppSidebar />

      <main style={{ flex: 1, overflowY: "auto", padding: "36px 32px" }}>
        <div style={{ maxWidth: "600px" }}>
          <h1 style={{ fontSize: "1.6rem", fontWeight: 800, color: "#F1F1F1", marginBottom: "6px", letterSpacing: "-0.02em" }}>
            Settings
          </h1>
          <p style={{ color: "rgba(241,241,241,0.45)", fontSize: "0.9rem", marginBottom: "36px" }}>
            Manage your account and preferences
          </p>

          {/* Account section */}
          <div style={{ background: "#1C1B2E", border: "1px solid rgba(123,47,255,0.15)", borderRadius: "16px", padding: "28px", marginBottom: "20px" }}>
            <h2 style={{ fontSize: "1rem", fontWeight: 700, color: "#F1F1F1", marginBottom: "20px" }}>Account</h2>
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              {[
                { label: "FULL NAME", value: "Jane Smith" },
                { label: "EMAIL", value: "jane@example.com" },
              ].map(({ label, value }) => (
                <div key={label}>
                  <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 700, color: "rgba(241,241,241,0.4)", letterSpacing: "0.05em", marginBottom: "6px" }}>{label}</label>
                  <input
                    defaultValue={value}
                    style={{ width: "100%", padding: "11px 14px", borderRadius: "10px", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(123,47,255,0.2)", color: "#F1F1F1", fontSize: "0.9rem", outline: "none", boxSizing: "border-box" }}
                  />
                </div>
              ))}
              <button style={{ padding: "11px 20px", borderRadius: "10px", background: "#7B2FFF", border: "none", color: "#fff", fontWeight: 700, fontSize: "0.88rem", cursor: "pointer", alignSelf: "flex-start" }}>
                Save Changes
              </button>
            </div>
          </div>

          {/* Password section */}
          <div style={{ background: "#1C1B2E", border: "1px solid rgba(123,47,255,0.15)", borderRadius: "16px", padding: "28px", marginBottom: "20px" }}>
            <h2 style={{ fontSize: "1rem", fontWeight: 700, color: "#F1F1F1", marginBottom: "20px" }}>Password</h2>
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              {["CURRENT PASSWORD", "NEW PASSWORD", "CONFIRM NEW PASSWORD"].map((label) => (
                <div key={label}>
                  <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 700, color: "rgba(241,241,241,0.4)", letterSpacing: "0.05em", marginBottom: "6px" }}>{label}</label>
                  <input
                    type="password"
                    placeholder="••••••••"
                    style={{ width: "100%", padding: "11px 14px", borderRadius: "10px", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(123,47,255,0.2)", color: "#F1F1F1", fontSize: "0.9rem", outline: "none", boxSizing: "border-box" }}
                  />
                </div>
              ))}
              <button style={{ padding: "11px 20px", borderRadius: "10px", background: "#7B2FFF", border: "none", color: "#fff", fontWeight: 700, fontSize: "0.88rem", cursor: "pointer", alignSelf: "flex-start" }}>
                Update Password
              </button>
            </div>
          </div>

          {/* Plan section */}
          <div style={{ background: "#1C1B2E", border: "1px solid rgba(123,47,255,0.15)", borderRadius: "16px", padding: "28px" }}>
            <h2 style={{ fontSize: "1rem", fontWeight: 700, color: "#F1F1F1", marginBottom: "16px" }}>Current Plan</h2>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 20px", borderRadius: "12px", background: "rgba(123,47,255,0.1)", border: "1px solid rgba(123,47,255,0.25)" }}>
              <div>
                <p style={{ fontWeight: 700, color: "#a78bfa", fontSize: "0.95rem" }}>Growth Plan</p>
                <p style={{ color: "rgba(241,241,241,0.45)", fontSize: "0.82rem", marginTop: "2px" }}>$79 / month · Renews June 1, 2026</p>
              </div>
              <button style={{ padding: "8px 16px", borderRadius: "8px", background: "transparent", border: "1px solid rgba(123,47,255,0.35)", color: "#a78bfa", fontSize: "0.8rem", fontWeight: 600, cursor: "pointer" }}>
                Manage
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
