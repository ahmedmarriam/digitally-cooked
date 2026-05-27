"use client";

// Floating post card snippets drifting across the hero
const CARDS = [
  { hook: '"Stop posting randomly and watch your reach explode"', platform: "IG", color: "#ec4899", startX: 8, startY: 15, angle: 20, dur: 22, delay: 0 },
  { hook: '"I grew 10k followers in 30 days with this one trick"', platform: "TK", color: "#8b5cf6", startX: 72, startY: 55, angle: -15, dur: 28, delay: 4 },
  { hook: '"The algorithm wants you to do THIS"', platform: "LI", color: "#60a5fa", startX: 55, startY: 8, angle: 10, dur: 24, delay: 8 },
  { hook: '"Why your content gets zero engagement"', platform: "FB", color: "#818cf8", startX: 85, startY: 30, angle: -20, dur: 30, delay: 2 },
  { hook: '"Your brand voice is costing you clients"', platform: "YT", color: "#f87171", startX: 20, startY: 72, angle: 25, dur: 26, delay: 12 },
  { hook: '"Post smarter, not harder — here\'s how"', platform: "IG", color: "#ec4899", startX: 62, startY: 80, angle: -10, dur: 32, delay: 6 },
];

const PLATFORMS = [
  { icon: "📸", label: "Instagram", color: "#ec4899", x: 15, y: 45, dur: 18, delay: 1 },
  { icon: "🎵", label: "TikTok", color: "#8b5cf6", x: 80, y: 20, dur: 22, delay: 5 },
  { icon: "💼", label: "LinkedIn", color: "#60a5fa", x: 40, y: 85, dur: 20, delay: 9 },
  { icon: "👥", label: "Facebook", color: "#818cf8", x: 90, y: 65, dur: 25, delay: 3 },
  { icon: "▶️", label: "YouTube", color: "#f87171", x: 5, y: 60, dur: 19, delay: 7 },
];

// Generate stable particles (deterministic, no Math.random at render time)
const PARTICLES = Array.from({ length: 28 }, (_, i) => ({
  x: ((i * 37) % 100),
  y: ((i * 53) % 100),
  size: 2 + (i % 3),
  dur: 4 + (i % 5),
  delay: (i * 0.4) % 8,
  opacity: 0.3 + (i % 4) * 0.1,
}));

export default function HeroBackground() {
  return (
    <div
      aria-hidden
      style={{
        position: "absolute",
        inset: 0,
        overflow: "hidden",
        pointerEvents: "none",
        zIndex: 0,
      }}
    >
      <style>{`
        @keyframes floatCard {
          0%   { transform: translate(0, 0) rotate(0deg);   opacity: 0; }
          8%   { opacity: 1; }
          92%  { opacity: 1; }
          100% { transform: translate(120px, -180px) rotate(6deg); opacity: 0; }
        }
        @keyframes floatCardAlt {
          0%   { transform: translate(0, 0) rotate(0deg);   opacity: 0; }
          8%   { opacity: 1; }
          92%  { opacity: 1; }
          100% { transform: translate(-100px, -150px) rotate(-5deg); opacity: 0; }
        }
        @keyframes floatCardUp {
          0%   { transform: translate(0, 0) rotate(0deg);   opacity: 0; }
          8%   { opacity: 1; }
          92%  { opacity: 1; }
          100% { transform: translate(60px, -200px) rotate(3deg); opacity: 0; }
        }
        @keyframes driftPill {
          0%   { transform: translateY(0);   opacity: 0; }
          10%  { opacity: 1; }
          90%  { opacity: 1; }
          100% { transform: translateY(-120px); opacity: 0; }
        }
        @keyframes particlePulse {
          0%, 100% { transform: scale(1);   opacity: var(--op); }
          50%       { transform: scale(1.8); opacity: calc(var(--op) * 0.4); }
        }
        @keyframes scanLine {
          0%   { transform: translateY(-100%); opacity: 0.06; }
          100% { transform: translateY(100vh);  opacity: 0; }
        }
        @keyframes gridPulse {
          0%, 100% { opacity: 0.03; }
          50%       { opacity: 0.07; }
        }
      `}</style>

      {/* Animated grid overlay */}
      <div style={{
        position: "absolute", inset: 0,
        backgroundImage: "linear-gradient(rgba(123,47,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(123,47,255,0.05) 1px, transparent 1px)",
        backgroundSize: "48px 48px",
        animation: "gridPulse 6s ease-in-out infinite",
      }} />

      {/* Scan line */}
      <div style={{
        position: "absolute", left: 0, right: 0, height: "2px",
        background: "linear-gradient(90deg, transparent, rgba(123,47,255,0.3), transparent)",
        animation: "scanLine 8s linear infinite",
      }} />

      {/* Floating post cards */}
      {CARDS.map(({ hook, platform, color, startX, startY, dur, delay }, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            left: `${startX}%`,
            top: `${startY}%`,
            width: "200px",
            padding: "10px 12px",
            borderRadius: "12px",
            background: "rgba(15,14,26,0.85)",
            border: `1px solid ${color}35`,
            backdropFilter: "blur(8px)",
            boxShadow: `0 8px 32px rgba(0,0,0,0.4), 0 0 0 1px ${color}15`,
            animation: `${i % 3 === 0 ? "floatCard" : i % 3 === 1 ? "floatCardAlt" : "floatCardUp"} ${dur}s ease-in-out ${delay}s infinite`,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "7px" }}>
            <div style={{ width: "18px", height: "18px", borderRadius: "5px", background: `${color}22`, border: `1px solid ${color}50`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "9px", fontWeight: 800, color }}>
              {platform}
            </div>
            <div style={{ height: "4px", flex: 1, borderRadius: "2px", background: `${color}25` }} />
          </div>
          <div style={{ fontSize: "0.68rem", color: "rgba(255,255,255,0.7)", fontWeight: 600, lineHeight: 1.4, fontStyle: "italic" }}>
            {hook}
          </div>
          <div style={{ display: "flex", gap: "4px", marginTop: "7px" }}>
            {[70, 50, 80].map((w, j) => (
              <div key={j} style={{ height: "3px", width: `${w}%`, borderRadius: "2px", background: "rgba(255,255,255,0.1)" }} />
            ))}
          </div>
        </div>
      ))}

      {/* Floating platform pills */}
      {PLATFORMS.map(({ icon, label, color, x, y, dur, delay }, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            left: `${x}%`,
            top: `${y}%`,
            display: "flex",
            alignItems: "center",
            gap: "6px",
            padding: "6px 12px",
            borderRadius: "999px",
            background: `${color}12`,
            border: `1px solid ${color}30`,
            fontSize: "0.75rem",
            fontWeight: 700,
            color,
            animation: `driftPill ${dur}s ease-in-out ${delay}s infinite`,
          }}
        >
          <span style={{ fontSize: "0.85rem" }}>{icon}</span>
          {label}
        </div>
      ))}

      {/* Particles */}
      {PARTICLES.map((p, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: `${p.size}px`,
            height: `${p.size}px`,
            borderRadius: "50%",
            background: i % 3 === 0 ? "#7B2FFF" : i % 3 === 1 ? "#ec4899" : "#a78bfa",
            "--op": p.opacity,
            animation: `particlePulse ${p.dur}s ease-in-out ${p.delay}s infinite`,
          } as React.CSSProperties}
        />
      ))}

      {/* Large glow blobs */}
      <div style={{ position: "absolute", width: "500px", height: "500px", borderRadius: "50%", background: "radial-gradient(circle, #7B2FFF 0%, transparent 70%)", top: "-80px", left: "-120px", opacity: 0.12, filter: "blur(80px)" }} />
      <div style={{ position: "absolute", width: "400px", height: "400px", borderRadius: "50%", background: "radial-gradient(circle, #ec4899 0%, transparent 70%)", bottom: "-60px", right: "-100px", opacity: 0.09, filter: "blur(80px)" }} />
      <div style={{ position: "absolute", width: "300px", height: "300px", borderRadius: "50%", background: "radial-gradient(circle, #f97316 0%, transparent 70%)", top: "50%", right: "30%", opacity: 0.06, filter: "blur(60px)" }} />
    </div>
  );
}
