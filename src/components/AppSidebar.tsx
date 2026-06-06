"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

const navItems = [
  { label: "Dashboard", href: "/dashboard", icon: "▦" },
  { label: "Calendar", href: "/calendar", icon: "◫" },
  { label: "Brand Kit", href: "/brand-kit", icon: "✦" },
  { label: "Settings", href: "/settings", icon: "⚙" },
];

export default function AppSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [brands, setBrands] = useState<{id: string; brand_name: string; business_type: string}[]>([]);
  const [selectedBrandId, setSelectedBrandId] = useState<string>("");
  const [plan, setPlan] = useState<string>("starter");

  useEffect(() => {
    // Fetch user plan
    fetch("/api/user/me")
      .then(r => r.json())
      .then(data => { if (data.user?.plan) setPlan(data.user.plan); })
      .catch(() => {});

    // Fetch brands
    fetch("/api/brands")
      .then(r => r.json())
      .then(data => {
        if (data.brands?.length > 0) {
          setBrands(data.brands);
          const stored = localStorage.getItem("dc_selected_brand");
          const valid = stored && data.brands.find((b: {id: string}) => b.id === stored);
          setSelectedBrandId(valid ? stored : data.brands[0].id);
        }
      })
      .catch(() => {});
  }, []);

  const canSwitchBrands = plan === "growth" || plan === "agency";

  const switchBrand = (id: string) => {
    setSelectedBrandId(id);
    localStorage.setItem("dc_selected_brand", id);
    window.location.reload();
  };

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
  };

  return (
    <aside
      style={{
        width: "240px",
        minHeight: "100vh",
        background: "#080714",
        borderRight: "1px solid rgba(123,47,255,0.15)",
        display: "flex",
        flexDirection: "column",
        padding: "28px 16px",
        flexShrink: 0,
      }}
    >
      {/* Logo */}
      <a
        href="/"
        style={{
          display: "flex",
          alignItems: "center",
          gap: "10px",
          textDecoration: "none",
          marginBottom: "40px",
          padding: "0 8px",
        }}
      >
        <div
          style={{
            width: "34px",
            height: "34px",
            borderRadius: "10px",
            background: "linear-gradient(135deg, #7B2FFF, #ec4899, #f97316)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "16px",
            flexShrink: 0,
          }}
        >
          🍳
        </div>
        <span
          style={{
            fontWeight: 800,
            fontSize: "0.9rem",
            letterSpacing: "0.04em",
            color: "#F1F1F1",
          }}
        >
          DIGITALLY{" "}
          <span
            style={{
              background: "linear-gradient(90deg, #a78bfa, #ec4899)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            COOKED
          </span>
        </span>
      </a>

      {/* Brand Switcher */}
      {brands.length > 0 && (
        <div style={{ marginBottom: "20px", padding: "0 8px" }}>
          {canSwitchBrands && brands.length > 1 ? (
            <div>
              <p style={{ fontSize: "0.68rem", color: "rgba(241,241,241,0.35)", fontWeight: 700, letterSpacing: "0.06em", marginBottom: "6px", paddingLeft: "2px" }}>ACTIVE BRAND</p>
              <select
                value={selectedBrandId}
                onChange={(e) => switchBrand(e.target.value)}
                style={{ width: "100%", padding: "8px 10px", borderRadius: "8px", background: "rgba(123,47,255,0.08)", border: "1px solid rgba(123,47,255,0.2)", color: "#F1F1F1", fontSize: "0.82rem", fontWeight: 600, outline: "none", cursor: "pointer" }}
              >
                {brands.map((b) => (
                  <option key={b.id} value={b.id} style={{ background: "#1C1B2E" }}>{b.brand_name}</option>
                ))}
              </select>
            </div>
          ) : (
            <div style={{ padding: "8px 10px", borderRadius: "8px", background: "rgba(123,47,255,0.08)", border: "1px solid rgba(123,47,255,0.15)" }}>
              <p style={{ fontSize: "0.68rem", color: "rgba(241,241,241,0.35)", fontWeight: 700, letterSpacing: "0.06em", marginBottom: "3px" }}>ACTIVE BRAND</p>
              <p style={{ fontSize: "0.82rem", color: "#F1F1F1", fontWeight: 600, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{brands[0].brand_name}</p>
            </div>
          )}
        </div>
      )}

      {/* Nav */}
      <nav style={{ display: "flex", flexDirection: "column", gap: "4px", flex: 1 }}>
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <a
              key={item.href}
              href={item.href}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                padding: "11px 14px",
                borderRadius: "10px",
                textDecoration: "none",
                fontSize: "0.9rem",
                fontWeight: isActive ? 700 : 500,
                color: isActive ? "#fff" : "rgba(241,241,241,0.55)",
                background: isActive ? "rgba(123,47,255,0.2)" : "transparent",
                border: `1px solid ${isActive ? "rgba(123,47,255,0.35)" : "transparent"}`,
                transition: "all 0.18s ease",
              }}
              onMouseEnter={(e) => {
                if (!isActive) {
                  (e.currentTarget as HTMLAnchorElement).style.background = "rgba(123,47,255,0.08)";
                  (e.currentTarget as HTMLAnchorElement).style.color = "#F1F1F1";
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive) {
                  (e.currentTarget as HTMLAnchorElement).style.background = "transparent";
                  (e.currentTarget as HTMLAnchorElement).style.color = "rgba(241,241,241,0.55)";
                }
              }}
            >
              <span style={{ fontSize: "1.1rem", opacity: isActive ? 1 : 0.6 }}>{item.icon}</span>
              {item.label}
            </a>
          );
        })}
      </nav>

      {/* New content button */}
      <a
        href="/brand-profile"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "8px",
          padding: "12px",
          borderRadius: "12px",
          background: "linear-gradient(135deg, #7B2FFF, #ec4899)",
          color: "#fff",
          fontWeight: 700,
          fontSize: "0.88rem",
          textDecoration: "none",
          marginBottom: "12px",
          boxShadow: "0 4px 18px rgba(123,47,255,0.35)",
          transition: "opacity 0.2s ease, transform 0.2s ease",
        }}
        onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.opacity = "0.88"; }}
        onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.opacity = "1"; }}
      >
        🍳 New Content
      </a>

      {/* Logout */}
      <button
        onClick={handleLogout}
        style={{
          display: "flex",
          alignItems: "center",
          gap: "10px",
          padding: "11px 14px",
          borderRadius: "10px",
          background: "transparent",
          border: "1px solid rgba(239,68,68,0.2)",
          color: "rgba(239,68,68,0.7)",
          fontSize: "0.88rem",
          fontWeight: 500,
          cursor: "pointer",
          width: "100%",
          transition: "all 0.18s ease",
        }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLButtonElement).style.background = "rgba(239,68,68,0.08)";
          (e.currentTarget as HTMLButtonElement).style.color = "#ef4444";
          (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(239,68,68,0.4)";
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLButtonElement).style.background = "transparent";
          (e.currentTarget as HTMLButtonElement).style.color = "rgba(239,68,68,0.7)";
          (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(239,68,68,0.2)";
        }}
      >
        <span>⎋</span> Logout
      </button>
    </aside>
  );
}
