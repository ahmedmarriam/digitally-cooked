const screens = [
  {
    step: "Step 1",
    label: "Fill Your Brand Profile",
    color: "#8b5cf6",
    description: "Tell us who you are in under 2 minutes.",
    mockup: "form",
  },
  {
    step: "Step 2",
    label: "AI Cooks Your Content",
    color: "#ec4899",
    description: "Our AI pipeline generates all 40 posts for your brand.",
    mockup: "processing",
  },
  {
    step: "Step 3",
    label: "Your Dashboard & Calendar",
    color: "#f97316",
    description: "Everything ready. Copy, paste, and post.",
    mockup: "dashboard",
  },
];

function FormMockup({ color }: { color: string }) {
  return (
    <div style={{ padding: "20px", display: "flex", flexDirection: "column", gap: "14px" }}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
        {["Brand Name", "Industry / Niche", "Business Location", "Tone of Voice"].map((label) => (
          <div key={label}>
            <div style={{ fontSize: "0.65rem", color: "rgba(255,255,255,0.35)", marginBottom: "5px", fontWeight: 600 }}>{label.toUpperCase()}</div>
            <div style={{ height: "30px", borderRadius: "8px", background: "rgba(255,255,255,0.04)", border: `1px solid ${color}25`, display: "flex", alignItems: "center", paddingLeft: "10px" }}>
              <div style={{ height: "7px", width: "55%", borderRadius: "3px", background: "rgba(255,255,255,0.1)" }} />
            </div>
          </div>
        ))}
      </div>
      <div>
        <div style={{ fontSize: "0.65rem", color: "rgba(255,255,255,0.35)", marginBottom: "5px", fontWeight: 600 }}>PLATFORMS</div>
        <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
          {["Instagram", "TikTok", "LinkedIn", "Facebook"].map((p, i) => (
            <div key={p} style={{ padding: "5px 12px", borderRadius: "100px", fontSize: "0.7rem", fontWeight: 600, background: i < 3 ? `${color}20` : "rgba(255,255,255,0.04)", border: `1px solid ${i < 3 ? color + "40" : "rgba(255,255,255,0.1)"}`, color: i < 3 ? color : "rgba(255,255,255,0.3)" }}>{p}</div>
          ))}
        </div>
      </div>
      <div>
        <div style={{ fontSize: "0.65rem", color: "rgba(255,255,255,0.35)", marginBottom: "5px", fontWeight: 600 }}>TARGET AUDIENCE</div>
        <div style={{ height: "56px", borderRadius: "8px", background: "rgba(255,255,255,0.04)", border: `1px solid ${color}25`, padding: "8px 10px" }}>
          <div style={{ height: "7px", width: "80%", borderRadius: "3px", background: "rgba(255,255,255,0.1)", marginBottom: "6px" }} />
          <div style={{ height: "7px", width: "60%", borderRadius: "3px", background: "rgba(255,255,255,0.07)" }} />
        </div>
      </div>
      <div style={{ height: "38px", borderRadius: "10px", background: `linear-gradient(135deg, ${color}, #ec4899)`, display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}>
        <span style={{ fontSize: "0.8rem", fontWeight: 700, color: "#fff" }}>🍳 Generate My 40 Posts</span>
      </div>
      {/* PLACEHOLDER NOTE */}
      <div style={{ textAlign: "center", fontSize: "0.65rem", color: "rgba(255,255,255,0.15)", fontStyle: "italic" }}>
        — App screenshot coming soon —
      </div>
    </div>
  );
}

function ProcessingMockup({ color }: { color: string }) {
  return (
    <div style={{ padding: "24px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%", gap: "20px" }}>
      {/* Spinner ring */}
      <div style={{ position: "relative", width: "80px", height: "80px" }}>
        <div
          style={{
            width: "80px",
            height: "80px",
            borderRadius: "50%",
            border: `3px solid ${color}20`,
            borderTop: `3px solid ${color}`,
            animation: "spin 1s linear infinite",
          }}
        />
        <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.8rem" }}>
          🤖
        </div>
      </div>
      <div style={{ textAlign: "center" }}>
        <div style={{ fontSize: "0.95rem", fontWeight: 700, marginBottom: "6px" }}>AI is cooking your content...</div>
        <div style={{ fontSize: "0.78rem", color: "rgba(255,255,255,0.4)" }}>AI is generating your 40 posts</div>
      </div>
      {/* Progress items */}
      <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: "8px" }}>
        {[
          { label: "Brand profile analysed", done: true },
          { label: "Generating hooks & captions", done: true },
          { label: "Creating image prompts", done: false, active: true },
          { label: "Building content calendar", done: false },
        ].map(({ label, done, active }) => (
          <div key={label} style={{ display: "flex", alignItems: "center", gap: "10px", padding: "8px 12px", borderRadius: "8px", background: done ? `${color}12` : active ? "rgba(255,255,255,0.04)" : "transparent", border: `1px solid ${done ? color + "30" : "rgba(255,255,255,0.05)"}` }}>
            <div style={{ width: "16px", height: "16px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, background: done ? color : active ? "transparent" : "rgba(255,255,255,0.05)", border: active ? `2px solid ${color}` : "none" }}>
              {done && <span style={{ fontSize: "9px", color: "#fff" }}>✓</span>}
              {active && <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: color, animation: "pulse 1s ease-in-out infinite" }} />}
            </div>
            <span style={{ fontSize: "0.75rem", color: done ? "rgba(255,255,255,0.8)" : active ? "rgba(255,255,255,0.6)" : "rgba(255,255,255,0.25)", fontWeight: done ? 600 : 400 }}>{label}</span>
          </div>
        ))}
      </div>
      <div style={{ textAlign: "center", fontSize: "0.65rem", color: "rgba(255,255,255,0.15)", fontStyle: "italic" }}>
        — App screenshot coming soon —
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } } @keyframes pulse { 0%,100%{opacity:1;} 50%{opacity:0.3;} }`}</style>
    </div>
  );
}

function DashboardMockup({ color }: { color: string }) {
  const dotColors = ["#8b5cf6", "#ec4899", "#f97316", "#22c55e", "#eab308", "#3b82f6"];
  return (
    <div style={{ padding: "16px", display: "flex", flexDirection: "column", gap: "12px" }}>
      {/* Tabs */}
      <div style={{ display: "flex", gap: "6px" }}>
        {["Calendar", "Posts", "Analytics"].map((tab, i) => (
          <div key={tab} style={{ padding: "5px 14px", borderRadius: "8px", fontSize: "0.72rem", fontWeight: 600, background: i === 0 ? `${color}20` : "transparent", border: `1px solid ${i === 0 ? color + "40" : "rgba(255,255,255,0.08)"}`, color: i === 0 ? color : "rgba(255,255,255,0.3)" }}>{tab}</div>
        ))}
        <div style={{ marginLeft: "auto", padding: "5px 12px", borderRadius: "8px", fontSize: "0.72rem", fontWeight: 700, background: `linear-gradient(135deg, ${color}, #ec4899)`, color: "#fff" }}>Export All</div>
      </div>
      {/* Calendar mini */}
      <div style={{ borderRadius: "12px", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", padding: "10px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
          <span style={{ fontSize: "0.7rem", fontWeight: 700, color: "rgba(255,255,255,0.5)" }}>May 2025</span>
          <div style={{ display: "flex", gap: "6px" }}>
            <div style={{ padding: "2px 10px", borderRadius: "6px", background: `${color}15`, border: `1px solid ${color}30`, fontSize: "0.65rem", color: color, fontWeight: 700 }}>40 Posts ✓</div>
          </div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: "3px" }}>
          {["M","T","W","T","F","S","S"].map((d,i) => <div key={i} style={{ textAlign: "center", fontSize: "0.55rem", color: "rgba(255,255,255,0.2)", paddingBottom: "3px" }}>{d}</div>)}
          {Array.from({ length: 28 }, (_, i) => (
            <div key={i} style={{ textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", padding: "2px 0" }}>
              <span style={{ fontSize: "0.6rem", color: "rgba(255,255,255,0.3)" }}>{i + 1}</span>
              {i % 7 !== 5 && i % 7 !== 6 && <div style={{ width: "5px", height: "5px", borderRadius: "50%", background: dotColors[i % dotColors.length], marginTop: "2px", boxShadow: `0 0 4px ${dotColors[i % dotColors.length]}` }} />}
            </div>
          ))}
        </div>
      </div>
      {/* Post rows */}
      {[
        { day: "Mon May 5", platform: "IG", platformColor: "#ec4899" },
        { day: "Wed May 7", platform: "TK", platformColor: "#8b5cf6" },
        { day: "Fri May 9", platform: "LI", platformColor: "#3b82f6" },
      ].map(({ day, platform, platformColor }) => (
        <div key={day} style={{ display: "flex", gap: "10px", alignItems: "center", padding: "8px 10px", borderRadius: "10px", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
          <div style={{ width: "32px", height: "32px", borderRadius: "8px", background: `${platformColor}20`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.7rem", fontWeight: 900, color: platformColor, flexShrink: 0 }}>{platform}</div>
          <div style={{ flex: 1 }}>
            <div style={{ height: "7px", width: "70%", borderRadius: "3px", background: "rgba(255,255,255,0.12)", marginBottom: "4px" }} />
            <div style={{ height: "6px", width: "50%", borderRadius: "3px", background: "rgba(255,255,255,0.07)" }} />
          </div>
          <div style={{ fontSize: "0.6rem", color: "rgba(255,255,255,0.25)" }}>{day}</div>
          <div style={{ padding: "3px 8px", borderRadius: "6px", background: `${color}15`, border: `1px solid ${color}25`, fontSize: "0.6rem", fontWeight: 600, color: color }}>Copy</div>
        </div>
      ))}
      <div style={{ textAlign: "center", fontSize: "0.65rem", color: "rgba(255,255,255,0.15)", fontStyle: "italic" }}>
        — App screenshot coming soon —
      </div>
    </div>
  );
}

export default function ProductScreenshots() {
  return (
    <section
      style={{
        padding: "100px 0",
        position: "relative",
        overflow: "hidden",
        borderTop: "1px solid rgba(139,92,246,0.08)",
      }}
    >
      <div
        className="glow-orb animate-orb-2"
        style={{
          width: "500px",
          height: "500px",
          background: "radial-gradient(circle, #ec4899 0%, transparent 70%)",
          top: "30%",
          right: "-200px",
          opacity: 0.07,
        }}
      />

      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 24px" }}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "64px" }}>
          <div className="section-label" style={{ marginBottom: "20px" }}>
            🖥️ Inside the Platform
          </div>
          <h2
            style={{
              fontSize: "clamp(2rem, 4.5vw, 3.2rem)",
              fontWeight: 900,
              letterSpacing: "-0.02em",
              lineHeight: 1.1,
              marginBottom: "16px",
            }}
          >
            From Form to{" "}
            <span className="gradient-text">Full Calendar</span>
          </h2>
          <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "1rem", maxWidth: "440px", margin: "0 auto" }}>
            Three screens. One seamless flow. No complexity.
          </p>
        </div>

        {/* Screenshot grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: "24px",
          }}
          className="screenshots-grid"
        >
          {screens.map((screen) => (
            <div key={screen.step} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
              {/* Label above */}
              <div>
                <div style={{ fontSize: "0.72rem", fontWeight: 700, color: screen.color, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "6px" }}>
                  {screen.step}
                </div>
                <h3 style={{ fontSize: "1.1rem", fontWeight: 800, marginBottom: "6px" }}>{screen.label}</h3>
                <p style={{ fontSize: "0.85rem", color: "rgba(255,255,255,0.45)" }}>{screen.description}</p>
              </div>

              {/* Browser frame */}
              <div
                style={{
                  borderRadius: "16px",
                  overflow: "hidden",
                  border: `1px solid ${screen.color}30`,
                  boxShadow: `0 0 30px ${screen.color}12, 0 20px 60px rgba(0,0,0,0.6)`,
                  background: "#080808",
                  minHeight: "340px",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                {/* Browser bar */}
                <div
                  style={{
                    height: "36px",
                    background: "#0d0d0d",
                    borderBottom: `1px solid ${screen.color}18`,
                    display: "flex",
                    alignItems: "center",
                    padding: "0 12px",
                    gap: "6px",
                    flexShrink: 0,
                  }}
                >
                  {["#ef4444", "#eab308", "#22c55e"].map((c) => (
                    <div key={c} style={{ width: "9px", height: "9px", borderRadius: "50%", background: c }} />
                  ))}
                  <div
                    style={{
                      marginLeft: "8px",
                      flex: 1,
                      height: "18px",
                      borderRadius: "5px",
                      background: `${screen.color}08`,
                      border: `1px solid ${screen.color}15`,
                      maxWidth: "220px",
                      display: "flex",
                      alignItems: "center",
                      paddingLeft: "8px",
                    }}
                  >
                    <div style={{ width: "70%", height: "6px", borderRadius: "3px", background: "rgba(255,255,255,0.08)" }} />
                  </div>
                </div>

                {/* Screen content */}
                <div style={{ flex: 1 }}>
                  {screen.mockup === "form" && <FormMockup color={screen.color} />}
                  {screen.mockup === "processing" && <ProcessingMockup color={screen.color} />}
                  {screen.mockup === "dashboard" && <DashboardMockup color={screen.color} />}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .screenshots-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  );
}
