"use client";

const footerLinks = {
  Product: [
    { label: "Features", href: "#features" },
    { label: "How It Works", href: "#how-it-works" },
    { label: "Pricing", href: "#pricing" },
    { label: "Sample Output", href: "#" },
  ],
  Platforms: [
    { label: "Instagram", href: "#" },
    { label: "TikTok", href: "#" },
    { label: "Facebook", href: "#" },
    { label: "LinkedIn", href: "#" },
    { label: "YouTube", href: "#" },
  ],
  Support: [
    { label: "FAQ", href: "#faq" },
    { label: "Contact Us", href: "mailto:hello@digitallycookedai.com" },
    { label: "Privacy Policy", href: "#" },
    { label: "Terms of Service", href: "#" },
  ],
};

export default function Footer() {
  return (
    <footer
      style={{
        borderTop: "1px solid rgba(139,92,246,0.15)",
        padding: "64px 0 32px",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "0 24px" }}>
        {/* Top row */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "2fr 1fr 1fr 1fr",
            gap: "48px",
            marginBottom: "60px",
          }}
          className="footer-grid"
        >
          {/* Brand column */}
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "16px" }}>
              <div
                style={{
                  width: "36px",
                  height: "36px",
                  borderRadius: "10px",
                  background: "linear-gradient(135deg, #8b5cf6, #ec4899, #f97316)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "18px",
                }}
              >
                🍳
              </div>
              <span style={{ fontWeight: 800, fontSize: "1rem", letterSpacing: "0.04em" }}>
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
            </div>
            <p
              style={{
                color: "rgba(255,255,255,0.45)",
                fontSize: "0.88rem",
                lineHeight: 1.7,
                maxWidth: "280px",
                marginBottom: "24px",
              }}
            >
              AI-powered social media content generation. One brand profile. 40 ready-to-post pieces of content. Every month.
            </p>
            {/* Powered by */}
            <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
              {["Claude AI", "Ideogram", "Runway ML"].map((tech) => (
                <span
                  key={tech}
                  style={{
                    padding: "4px 12px",
                    borderRadius: "100px",
                    fontSize: "0.72rem",
                    fontWeight: 600,
                    background: "rgba(139,92,246,0.1)",
                    border: "1px solid rgba(139,92,246,0.25)",
                    color: "#a78bfa",
                  }}
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(footerLinks).map(([section, links]) => (
            <div key={section}>
              <h4
                style={{
                  fontSize: "0.78rem",
                  fontWeight: 700,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  color: "rgba(255,255,255,0.4)",
                  marginBottom: "16px",
                }}
              >
                {section}
              </h4>
              <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "10px" }}>
                {links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      style={{
                        color: "rgba(255,255,255,0.55)",
                        textDecoration: "none",
                        fontSize: "0.88rem",
                        transition: "color 0.2s ease",
                      }}
                      onMouseEnter={(e) => ((e.currentTarget as HTMLAnchorElement).style.color = "#fff")}
                      onMouseLeave={(e) => ((e.currentTarget as HTMLAnchorElement).style.color = "rgba(255,255,255,0.55)")}
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Divider */}
        <div
          style={{
            height: "1px",
            background: "linear-gradient(90deg, transparent, rgba(139,92,246,0.3), transparent)",
            marginBottom: "32px",
          }}
        />

        {/* Bottom row */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "16px",
          }}
        >
          <p style={{ color: "rgba(255,255,255,0.3)", fontSize: "0.82rem" }}>
            © {new Date().getFullYear()} Digitally Cooked. All rights reserved.
          </p>
          <p
            style={{
              color: "rgba(255,255,255,0.2)",
              fontSize: "0.78rem",
              display: "flex",
              alignItems: "center",
              gap: "6px",
            }}
          >
            Powered by{" "}
            <span
              style={{
                background: "linear-gradient(90deg, #a78bfa, #ec4899)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                fontWeight: 700,
              }}
            >
              Claude AI · Ideogram · Runway ML
            </span>
          </p>
        </div>
      </div>

      <style>{`
        @media (max-width: 800px) {
          .footer-grid { grid-template-columns: 1fr 1fr !important; }
        }
        @media (max-width: 500px) {
          .footer-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </footer>
  );
}
