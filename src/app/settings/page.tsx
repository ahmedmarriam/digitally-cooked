"use client";

import { useState, useEffect } from "react";
import AppSidebar from "@/components/AppSidebar";

const PLAN_LABELS: Record<string, { label: string; price: string; color: string }> = {
  starter:  { label: "Starter",  price: "$29/month", color: "#60a5fa" },
  growth:   { label: "Growth",   price: "$79/month", color: "#a78bfa" },
  agency:   { label: "Agency",   price: "$149/month", color: "#ec4899" },
};

const inputStyle: React.CSSProperties = {
  width: "100%", padding: "11px 14px", borderRadius: "10px",
  background: "rgba(255,255,255,0.04)", border: "1px solid rgba(123,47,255,0.2)",
  color: "#F1F1F1", fontSize: "0.9rem", outline: "none", boxSizing: "border-box",
  transition: "border-color 0.2s",
};

const labelStyle: React.CSSProperties = {
  display: "block", fontSize: "0.75rem", fontWeight: 700,
  color: "rgba(241,241,241,0.4)", letterSpacing: "0.05em", marginBottom: "6px",
};

function SectionCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ background: "#1C1B2E", border: "1px solid rgba(123,47,255,0.15)", borderRadius: "16px", padding: "28px", marginBottom: "20px" }}>
      <h2 style={{ fontSize: "1rem", fontWeight: 700, color: "#F1F1F1", marginBottom: "20px" }}>{title}</h2>
      {children}
    </div>
  );
}

export default function SettingsPage() {
  const [user, setUser] = useState<{ id: string; name: string; email: string; plan: string; created_at: string } | null>(null);
  const [loading, setLoading] = useState(true);

  // Profile form
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [profileMsg, setProfileMsg] = useState("");
  const [profileSaving, setProfileSaving] = useState(false);

  // Password form
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordMsg, setPasswordMsg] = useState("");
  const [passwordSaving, setPasswordSaving] = useState(false);

  // Delete account
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState("");
  const [deleting, setDeleting] = useState(false);
  const [deleteMsg, setDeleteMsg] = useState("");

  useEffect(() => {
    fetch("/api/user/me")
      .then((r) => r.json())
      .then((data) => {
        if (data.user) {
          setUser(data.user);
          setName(data.user.name || "");
          setEmail(data.user.email || "");
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const saveProfile = async () => {
    if (!name || !email) { setProfileMsg("Name and email are required."); return; }
    setProfileSaving(true);
    setProfileMsg("");
    try {
      const res = await fetch("/api/user/update", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "profile", name, email }),
      });
      const data = await res.json();
      if (res.ok) {
        setProfileMsg("✓ Profile updated successfully.");
        setUser((u) => u ? { ...u, name, email } : u);
      } else {
        setProfileMsg(data.error || "Failed to save.");
      }
    } catch {
      setProfileMsg("Something went wrong.");
    } finally {
      setProfileSaving(false);
      setTimeout(() => setProfileMsg(""), 4000);
    }
  };

  const savePassword = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) { setPasswordMsg("All fields required."); return; }
    if (newPassword !== confirmPassword) { setPasswordMsg("New passwords don't match."); return; }
    if (newPassword.length < 8) { setPasswordMsg("Password must be at least 8 characters."); return; }
    setPasswordSaving(true);
    setPasswordMsg("");
    try {
      const res = await fetch("/api/user/update", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "password", currentPassword, newPassword }),
      });
      const data = await res.json();
      if (res.ok) {
        setPasswordMsg("✓ Password updated successfully.");
        setCurrentPassword(""); setNewPassword(""); setConfirmPassword("");
      } else {
        setPasswordMsg(data.error || "Failed to update password.");
      }
    } catch {
      setPasswordMsg("Something went wrong.");
    } finally {
      setPasswordSaving(false);
      setTimeout(() => setPasswordMsg(""), 4000);
    }
  };

  const deleteAccount = async () => {
    if (deleteConfirmText !== "DELETE") { setDeleteMsg("Type DELETE to confirm."); return; }
    setDeleting(true);
    setDeleteMsg("");
    try {
      const res = await fetch("/api/user/delete", { method: "DELETE" });
      if (res.ok) {
        window.location.href = "/";
      } else {
        const data = await res.json();
        setDeleteMsg(data.error || "Failed to delete account.");
        setDeleting(false);
      }
    } catch {
      setDeleteMsg("Something went wrong.");
      setDeleting(false);
    }
  };

  const plan = PLAN_LABELS[user?.plan ?? "starter"] ?? PLAN_LABELS.starter;
  const memberSince = user?.created_at ? new Date(user.created_at).toLocaleDateString("en-GB", { month: "long", year: "numeric" }) : "—";

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#0F0E1A", fontFamily: "var(--font-geist-sans), Arial, sans-serif" }}>
      <AppSidebar />
      <main style={{ flex: 1, overflowY: "auto", padding: "36px 32px" }}>
        <div style={{ maxWidth: "600px" }}>

          <h1 style={{ fontSize: "1.6rem", fontWeight: 800, color: "#F1F1F1", marginBottom: "6px", letterSpacing: "-0.02em" }}>Settings</h1>
          <p style={{ color: "rgba(241,241,241,0.45)", fontSize: "0.9rem", marginBottom: "36px" }}>Manage your account and preferences</p>

          {loading && <p style={{ color: "rgba(241,241,241,0.4)", fontSize: "0.9rem" }}>Loading...</p>}

          {!loading && (
            <>
              {/* Profile */}
              <SectionCard title="Account">
                <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                  <div>
                    <label style={labelStyle}>FULL NAME</label>
                    <input value={name} onChange={(e) => setName(e.target.value)} style={inputStyle} onFocus={(e) => (e.target.style.borderColor = "#7B2FFF")} onBlur={(e) => (e.target.style.borderColor = "rgba(123,47,255,0.2)")} />
                  </div>
                  <div>
                    <label style={labelStyle}>EMAIL</label>
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} style={inputStyle} onFocus={(e) => (e.target.style.borderColor = "#7B2FFF")} onBlur={(e) => (e.target.style.borderColor = "rgba(123,47,255,0.2)")} />
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
                    <button
                      onClick={saveProfile}
                      disabled={profileSaving}
                      style={{ padding: "11px 20px", borderRadius: "10px", background: profileSaving ? "rgba(123,47,255,0.4)" : "#7B2FFF", border: "none", color: "#fff", fontWeight: 700, fontSize: "0.88rem", cursor: profileSaving ? "not-allowed" : "pointer" }}
                    >
                      {profileSaving ? "Saving..." : "Save Changes"}
                    </button>
                    {profileMsg && (
                      <span style={{ fontSize: "0.83rem", color: profileMsg.startsWith("✓") ? "#34d399" : "#ef4444", fontWeight: 600 }}>{profileMsg}</span>
                    )}
                  </div>
                </div>
              </SectionCard>

              {/* Password */}
              <SectionCard title="Password">
                <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                  {[
                    { label: "CURRENT PASSWORD", value: currentPassword, set: setCurrentPassword },
                    { label: "NEW PASSWORD", value: newPassword, set: setNewPassword },
                    { label: "CONFIRM NEW PASSWORD", value: confirmPassword, set: setConfirmPassword },
                  ].map(({ label, value, set }) => (
                    <div key={label}>
                      <label style={labelStyle}>{label}</label>
                      <input type="password" value={value} onChange={(e) => set(e.target.value)} placeholder="••••••••" style={inputStyle} onFocus={(e) => (e.target.style.borderColor = "#7B2FFF")} onBlur={(e) => (e.target.style.borderColor = "rgba(123,47,255,0.2)")} />
                    </div>
                  ))}
                  <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
                    <button
                      onClick={savePassword}
                      disabled={passwordSaving}
                      style={{ padding: "11px 20px", borderRadius: "10px", background: passwordSaving ? "rgba(123,47,255,0.4)" : "#7B2FFF", border: "none", color: "#fff", fontWeight: 700, fontSize: "0.88rem", cursor: passwordSaving ? "not-allowed" : "pointer" }}
                    >
                      {passwordSaving ? "Updating..." : "Update Password"}
                    </button>
                    {passwordMsg && (
                      <span style={{ fontSize: "0.83rem", color: passwordMsg.startsWith("✓") ? "#34d399" : "#ef4444", fontWeight: 600 }}>{passwordMsg}</span>
                    )}
                  </div>
                </div>
              </SectionCard>

              {/* Plan */}
              <SectionCard title="Current Plan">
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 20px", borderRadius: "12px", background: `${plan.color}12`, border: `1px solid ${plan.color}40`, marginBottom: "14px" }}>
                  <div>
                    <p style={{ fontWeight: 700, color: plan.color, fontSize: "0.95rem" }}>{plan.label} Plan</p>
                    <p style={{ color: "rgba(241,241,241,0.45)", fontSize: "0.82rem", marginTop: "2px" }}>{plan.price} · Member since {memberSince}</p>
                  </div>
                  <a href="/brand-profile" style={{ padding: "8px 16px", borderRadius: "8px", background: "transparent", border: `1px solid ${plan.color}50`, color: plan.color, fontSize: "0.8rem", fontWeight: 600, cursor: "pointer", textDecoration: "none" }}>
                    Upgrade
                  </a>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "10px" }}>
                  {[
                    { label: "Posts / month", value: user?.plan === "agency" ? "Unlimited" : user?.plan === "growth" ? "120" : "40" },
                    { label: "Platforms", value: user?.plan === "agency" ? "All" : user?.plan === "growth" ? "4" : "2" },
                    { label: "Bonus posts", value: user?.plan === "agency" ? "30" : "10" },
                  ].map(({ label, value }) => (
                    <div key={label} style={{ padding: "14px", borderRadius: "10px", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)", textAlign: "center" }}>
                      <p style={{ fontSize: "1.1rem", fontWeight: 800, color: "#F1F1F1", marginBottom: "4px" }}>{value}</p>
                      <p style={{ fontSize: "0.72rem", color: "rgba(241,241,241,0.4)", fontWeight: 600 }}>{label}</p>
                    </div>
                  ))}
                </div>
              </SectionCard>

              {/* Danger zone */}
              <SectionCard title="Account Actions">
                <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
                  <a href="/api/auth/logout" style={{ padding: "10px 20px", borderRadius: "10px", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", color: "rgba(241,241,241,0.6)", fontSize: "0.85rem", fontWeight: 600, textDecoration: "none" }}>
                    Sign Out
                  </a>
                  <button onClick={() => setShowDeleteModal(true)} style={{ padding: "10px 20px", borderRadius: "10px", background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)", color: "#ef4444", fontSize: "0.85rem", fontWeight: 600, cursor: "pointer" }}>
                    Delete Account
                  </button>
                </div>
              </SectionCard>
            </>
          )}
        </div>
      </main>

      {/* Delete Account Modal */}
      {showDeleteModal && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", backdropFilter: "blur(6px)", zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center", padding: "24px" }}>
          <div style={{ background: "#1C1B2E", border: "1px solid rgba(239,68,68,0.3)", borderRadius: "20px", padding: "32px", maxWidth: "420px", width: "100%" }}>
            <div style={{ fontSize: "2rem", marginBottom: "12px", textAlign: "center" }}>⚠️</div>
            <h2 style={{ fontSize: "1.1rem", fontWeight: 800, color: "#F1F1F1", marginBottom: "8px", textAlign: "center" }}>Delete your account?</h2>
            <p style={{ color: "rgba(241,241,241,0.45)", fontSize: "0.85rem", textAlign: "center", marginBottom: "24px", lineHeight: 1.6 }}>
              This will permanently delete your account, all brands, and all generated posts. This cannot be undone.
            </p>
            <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 700, color: "rgba(239,68,68,0.7)", letterSpacing: "0.05em", marginBottom: "8px" }}>
              TYPE &ldquo;DELETE&rdquo; TO CONFIRM
            </label>
            <input
              value={deleteConfirmText}
              onChange={(e) => setDeleteConfirmText(e.target.value.toUpperCase())}
              placeholder="DELETE"
              style={{ width: "100%", padding: "11px 14px", borderRadius: "10px", background: "rgba(239,68,68,0.06)", border: "1px solid rgba(239,68,68,0.25)", color: "#F1F1F1", fontSize: "0.9rem", outline: "none", boxSizing: "border-box", marginBottom: "16px" }}
            />
            {deleteMsg && (
              <p style={{ color: "#ef4444", fontSize: "0.82rem", marginBottom: "12px" }}>{deleteMsg}</p>
            )}
            <div style={{ display: "flex", gap: "10px" }}>
              <button onClick={() => { setShowDeleteModal(false); setDeleteConfirmText(""); setDeleteMsg(""); }} style={{ flex: 1, padding: "11px", borderRadius: "10px", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", color: "rgba(241,241,241,0.6)", fontWeight: 600, fontSize: "0.88rem", cursor: "pointer" }}>
                Cancel
              </button>
              <button onClick={deleteAccount} disabled={deleting || deleteConfirmText !== "DELETE"} style={{ flex: 1, padding: "11px", borderRadius: "10px", background: deleting || deleteConfirmText !== "DELETE" ? "rgba(239,68,68,0.2)" : "rgba(239,68,68,0.85)", border: "none", color: "#fff", fontWeight: 700, fontSize: "0.88rem", cursor: deleting || deleteConfirmText !== "DELETE" ? "not-allowed" : "pointer", transition: "background 0.2s" }}>
                {deleting ? "Deleting..." : "Delete Forever"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
