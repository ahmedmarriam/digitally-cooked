const platforms = [
  {
    name: "Instagram",
    color: "#e1306c",
    bg: "#e1306c18",
    types: ["Feed Posts", "Reels Captions", "Stories"],
    icon: (
      <svg viewBox="0 0 24 24" width="32" height="32" fill="currentColor">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
      </svg>
    ),
  },
  {
    name: "TikTok",
    color: "#8b5cf6",
    bg: "#8b5cf618",
    types: ["Video Hooks", "Captions", "Trending Audio Cues"],
    icon: (
      <svg viewBox="0 0 24 24" width="32" height="32" fill="currentColor">
        <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.18 8.18 0 004.78 1.52V6.76a4.85 4.85 0 01-1.01-.07z" />
      </svg>
    ),
  },
  {
    name: "Facebook",
    color: "#3b82f6",
    bg: "#3b82f618",
    types: ["Page Posts", "Group Content", "Event Copy"],
    icon: (
      <svg viewBox="0 0 24 24" width="32" height="32" fill="currentColor">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
      </svg>
    ),
  },
  {
    name: "LinkedIn",
    color: "#0ea5e9",
    bg: "#0ea5e918",
    types: ["Thought Leadership", "Company Updates", "Articles"],
    icon: (
      <svg viewBox="0 0 24 24" width="32" height="32" fill="currentColor">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
      </svg>
    ),
  },
  {
    name: "YouTube",
    color: "#ef4444",
    bg: "#ef444418",
    types: ["Short Scripts", "Description Copy", "Community Posts"],
    icon: (
      <svg viewBox="0 0 24 24" width="32" height="32" fill="currentColor">
        <path d="M23.495 6.205a3.007 3.007 0 00-2.088-2.088c-1.87-.501-9.396-.501-9.396-.501s-7.507-.01-9.396.501A3.007 3.007 0 00.527 6.205a31.247 31.247 0 00-.522 5.805 31.247 31.247 0 00.522 5.783 3.007 3.007 0 002.088 2.088c1.868.502 9.396.502 9.396.502s7.506 0 9.396-.502a3.007 3.007 0 002.088-2.088 31.247 31.247 0 00.5-5.783 31.247 31.247 0 00-.5-5.805zM9.609 15.601V8.408l6.264 3.602z" />
      </svg>
    ),
  },
];

export default function Platforms() {
  return (
    <section
      style={{
        padding: "80px 0",
        position: "relative",
        overflow: "hidden",
        borderTop: "1px solid rgba(139,92,246,0.1)",
      }}
    >
      <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "0 24px" }}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "56px" }}>
          <div className="section-label" style={{ marginBottom: "20px" }}>
            📲 Multi-Platform
          </div>
          <h2
            style={{
              fontSize: "clamp(1.8rem, 4vw, 2.8rem)",
              fontWeight: 900,
              letterSpacing: "-0.02em",
              marginBottom: "14px",
            }}
          >
            Content for <span className="gradient-text">Every Platform</span>
          </h2>
          <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "1rem", maxWidth: "440px", margin: "0 auto" }}>
            One brand profile generates platform-specific posts for all 5 major channels.
          </p>
        </div>

        {/* Platform cards */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: "18px",
          }}
        >
          {platforms.map((platform) => (
            <div
              key={platform.name}
              className="card-glow"
              style={{
                borderRadius: "20px",
                padding: "28px 22px",
                textAlign: "center",
                borderColor: `${platform.color}25`,
                cursor: "default",
              }}
            >
              <div
                style={{
                  width: "64px",
                  height: "64px",
                  borderRadius: "18px",
                  background: platform.bg,
                  border: `1px solid ${platform.color}35`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto 16px",
                  color: platform.color,
                  boxShadow: `0 0 20px ${platform.color}20`,
                }}
              >
                {platform.icon}
              </div>
              <h3 style={{ fontWeight: 700, fontSize: "1.05rem", marginBottom: "12px" }}>
                {platform.name}
              </h3>
              <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                {platform.types.map((t) => (
                  <span
                    key={t}
                    style={{
                      fontSize: "0.75rem",
                      color: "rgba(255,255,255,0.5)",
                      padding: "3px 10px",
                      borderRadius: "100px",
                      background: `${platform.color}10`,
                      border: `1px solid ${platform.color}20`,
                      display: "inline-block",
                    }}
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
