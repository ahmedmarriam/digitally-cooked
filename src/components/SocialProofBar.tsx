const stats = [
  { value: "40", label: "Posts Per Month", icon: "📅" },
  { value: "5", label: "Platforms Supported", icon: "📲" },
  { value: "100%", label: "AI-Generated", icon: "🤖" },
  { value: "<5 min", label: "Generation Time", icon: "⚡" },
  { value: "∞", label: "Brands & Niches", icon: "🏷️" },
];

const platforms = [
  "Instagram", "TikTok", "Facebook", "LinkedIn", "YouTube",
  "Instagram", "TikTok", "Facebook", "LinkedIn", "YouTube",
];

export default function SocialProofBar() {
  return (
    <section
      style={{
        position: "relative",
        padding: "70px 0",
        overflow: "hidden",
        borderTop: "1px solid rgba(139,92,246,0.1)",
        borderBottom: "1px solid rgba(139,92,246,0.1)",
      }}
    >
      {/* Stats grid */}
      <div
        style={{
          maxWidth: "1100px",
          margin: "0 auto",
          padding: "0 24px",
          display: "flex",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: "32px",
          marginBottom: "56px",
        }}
      >
        {stats.map(({ value, label, icon }) => (
          <div key={label} style={{ textAlign: "center", flex: "1", minWidth: "120px" }}>
            <div style={{ fontSize: "2.4rem", marginBottom: "6px" }}>{icon}</div>
            <div
              className="gradient-text"
              style={{ fontSize: "2.2rem", fontWeight: 900, lineHeight: 1, letterSpacing: "-0.02em" }}
            >
              {value}
            </div>
            <div style={{ fontSize: "0.82rem", color: "rgba(255,255,255,0.45)", marginTop: "6px", fontWeight: 500 }}>
              {label}
            </div>
          </div>
        ))}
      </div>

      {/* Divider */}
      <div
        style={{
          maxWidth: "200px",
          margin: "0 auto 40px",
          height: "1px",
          background: "linear-gradient(90deg, transparent, rgba(139,92,246,0.5), transparent)",
        }}
      />

      {/* Marquee — platform names */}
      <div style={{ overflow: "hidden", position: "relative" }}>
        {/* Fade edges */}
        <div
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            bottom: 0,
            width: "120px",
            background: "linear-gradient(90deg, var(--dc-bg), transparent)",
            zIndex: 2,
            pointerEvents: "none",
          }}
        />
        <div
          style={{
            position: "absolute",
            right: 0,
            top: 0,
            bottom: 0,
            width: "120px",
            background: "linear-gradient(-90deg, var(--dc-bg), transparent)",
            zIndex: 2,
            pointerEvents: "none",
          }}
        />

        <div className="animate-marquee" style={{ display: "flex", gap: "48px", width: "max-content" }}>
          {[...platforms, ...platforms].map((p, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                padding: "10px 24px",
                borderRadius: "100px",
                border: "1px solid rgba(139,92,246,0.2)",
                background: "rgba(14,12,46,0.5)",
                whiteSpace: "nowrap",
                fontSize: "0.88rem",
                fontWeight: 600,
                color: "rgba(255,255,255,0.6)",
              }}
            >
              <PlatformIcon name={p} />
              {p}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function PlatformIcon({ name }: { name: string }) {
  const icons: Record<string, string> = {
    Instagram: "📸",
    TikTok: "🎵",
    Facebook: "👥",
    LinkedIn: "💼",
    YouTube: "▶️",
  };
  return <span style={{ fontSize: "1rem" }}>{icons[name] ?? "📱"}</span>;
}
