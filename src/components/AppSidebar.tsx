"use client";

import { usePathname, useRouter } from "next/navigation";

const navItems = [
  { label: "Dashboard", href: "/dashboard", icon: "▦" },
  { label: "Calendar", href: "/calendar", icon: "◫" },
  { label: "Settings", href: "/settings", icon: "⚙" },
];

export default function AppSidebar() {
  const pathname = usePathname();
  const router = useRouter();

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
