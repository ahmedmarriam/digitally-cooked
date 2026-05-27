"use client";

import { useEffect, useState } from "react";

/* ── helpers ─────────────────────────────────────────────── */
const lerp  = (a: number, b: number, t: number) => a + (b - a) * t;
const clamp = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v));
const ss    = (t: number) => { const c = clamp(t, 0, 1); return c * c * (3 - 2 * c); };

/* ── feather colour pairs [base, tip] ────────────────────── */
const F_COLS: [string, string][] = [
  ["#ec4899", "#f97316"],   // innermost – pink/orange
  ["#f97316", "#fbbf24"],   // orange/yellow
  ["#fbbf24", "#a3e635"],   // yellow/lime
  ["#86efac", "#4ade80"],   // light-green
  ["#4ade80", "#22d3ee"],   // green/cyan
  ["#22d3ee", "#a78bfa"],   // cyan/violet – outermost
];

/* ── wing angles (degrees; SVG: 0=right, -90=up) ─────────── */
const L_FOLD: number[] = [-88, -90, -92, -94, -96, -98];   // compressed upward
const R_FOLD: number[] = [-92, -90, -88, -86, -84, -82];
const L_OPEN: number[] = [-90,-110,-130,-148,-165,-178];   // full fan left
const R_OPEN: number[] = [-90, -70, -50, -32, -15,  -2];  // full fan right

/* ── single feather ──────────────────────────────────────── */
function Feather({
  id, angle, len, cFill, cTip,
}: {
  id: string; angle: number; len: number; cFill: string; cTip: string;
}) {
  const w = 7.5;
  return (
    <g
      transform={`rotate(${angle})`}
      style={{ transformOrigin: "0px 0px", transition: "transform 0.55s cubic-bezier(0.34,1.3,0.64,1)" }}
    >
      <defs>
        <linearGradient id={id} x1="0%" y1="100%" x2="0%" y2="0%">
          <stop offset="0%"   stopColor={cFill} />
          <stop offset="100%" stopColor={cTip}  />
        </linearGradient>
      </defs>
      <path
        d={`M 0,0
            C ${-w},${-len*0.28} ${-w*0.65},${-len*0.68} 0,${-len}
            C  ${w*0.65},${-len*0.68}  ${w},${-len*0.28} 0,0`}
        fill={`url(#${id})`}
        opacity={0.9}
      />
    </g>
  );
}

/* ── component ───────────────────────────────────────────── */
export default function BirdMascot() {
  const [prog,    setprog]    = useState(0);
  const [entered, setEntered] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setEntered(true), 350);

    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setprog(max > 0 ? clamp(window.scrollY / max, 0, 1) : 0);
    };
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      clearTimeout(t);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  const spread   = ss(prog);
  const atBottom = prog > 0.88;
  const size     = Math.round(lerp(88, 260, spread));
  const opacity  = lerp(0.88, 0.10, spread);

  const lAngles = L_FOLD.map((f, i) => lerp(f, L_OPEN[i], spread));
  const rAngles = R_FOLD.map((f, i) => lerp(f, R_OPEN[i], spread));

  /* position: top-right perch → bottom-left perch */
  const topPx  = atBottom
    ? `calc(100vh - ${size + 28}px)`
    : entered ? "14px" : "-320px";
  const leftPx = atBottom
    ? "14px"
    : `calc(100vw - ${size + 18}px)`;

  const FLEN = 70;

  return (
    <div
      style={{
        position:      "fixed",
        top:           topPx,
        left:          leftPx,
        width:         `${size}px`,
        height:        `${size}px`,
        opacity,
        pointerEvents: "none",
        zIndex:        50,
        transition:
          "top 1.15s cubic-bezier(0.34,1.56,0.64,1), " +
          "left 1.15s cubic-bezier(0.34,1.56,0.64,1), " +
          "width 0.4s ease, height 0.4s ease, opacity 0.35s ease",
      }}
    >
      <svg viewBox="-125 -125 250 205" width="100%" height="100%" overflow="visible">
        <defs>
          {/* soft glow */}
          <filter id="bird-glow" x="-60%" y="-60%" width="220%" height="220%">
            <feGaussianBlur stdDeviation="4.5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          <radialGradient id="body-g" cx="35%" cy="30%">
            <stop offset="0%"   stopColor="#fde68a" />
            <stop offset="55%"  stopColor="#f97316" />
            <stop offset="100%" stopColor="#ea580c" />
          </radialGradient>

          <radialGradient id="head-g" cx="32%" cy="28%">
            <stop offset="0%"   stopColor="#fed7aa" />
            <stop offset="100%" stopColor="#f97316" />
          </radialGradient>

          {/* head-turn keyframe */}
          <style>{`
            @keyframes birdLook {
              0%,100% { transform: rotate(-16deg); }
              50%     { transform: rotate(16deg);  }
            }
            @keyframes birdBob {
              0%,100% { transform: translateY(0px); }
              50%     { transform: translateY(-3px); }
            }
          `}</style>
        </defs>

        {/* whole bird bobs gently */}
        <g filter="url(#bird-glow)"
          style={{ animation: "birdBob 3.5s ease-in-out infinite" }}>

          {/* ── tail feathers ──────────────────────────────── */}
          {([
            { rot: 163, len: 53, c1: "#f97316", c2: "#ef4444", id: "t0" },
            { rot: 180, len: 65, c1: "#3b82f6", c2: "#8b5cf6", id: "t1" },
            { rot: 197, len: 53, c1: "#ec4899", c2: "#f97316", id: "t2" },
          ] as const).map(({ rot, len, c1, c2, id }) => (
            <g key={id} transform={`translate(0,12) rotate(${rot})`}>
              <Feather id={id} angle={0} len={len} cFill={c1} cTip={c2} />
            </g>
          ))}

          {/* ── left wing ──────────────────────────────────── */}
          {lAngles.map((angle, i) => (
            <Feather
              key={`l${i}`} id={`lf${i}`}
              angle={angle} len={FLEN + i * 5}
              cFill={F_COLS[i][0]} cTip={F_COLS[i][1]}
            />
          ))}

          {/* ── right wing ─────────────────────────────────── */}
          {rAngles.map((angle, i) => (
            <Feather
              key={`r${i}`} id={`rf${i}`}
              angle={angle} len={FLEN + i * 5}
              cFill={F_COLS[i][0]} cTip={F_COLS[i][1]}
            />
          ))}

          {/* ── body ───────────────────────────────────────── */}
          <ellipse cx={0} cy={0} rx={13} ry={17} fill="url(#body-g)" />

          {/* ── neck ───────────────────────────────────────── */}
          <ellipse cx={0} cy={-18} rx={7} ry={7} fill="#f97316" />

          {/* ── head (turns left/right) ────────────────────── */}
          <g transform="translate(2,-28)">
            <g style={{
              animation:       "birdLook 4s ease-in-out infinite",
              transformOrigin: "0px 0px",
              transformBox:    "fill-box",
            }}>
              <circle cx={0} cy={0} r={9}   fill="url(#head-g)" />
              {/* eye */}
              <circle cx={3}   cy={-2}   r={2.2} fill="#1e1b4b" />
              <circle cx={3.7} cy={-2.7} r={0.75} fill="white" />
              {/* beak */}
              <path d="M 5,-0.5 L 12,1.5 L 5,2.5 Z" fill="#fbbf24" />
            </g>
          </g>

          {/* ── crown plumes ───────────────────────────────── */}
          <g transform="translate(2,-36)">
            {([-12, 0, 12] as const).map((a, i) => (
              <g key={i} transform={`rotate(${a})`}>
                <line
                  x1={0} y1={0} x2={0} y2={-11}
                  stroke={(["#4ade80","#fbbf24","#f97316"] as const)[i]}
                  strokeWidth={1.5}
                />
                <circle
                  cx={0} cy={-11} r={1.9}
                  fill={(["#4ade80","#fbbf24","#f97316"] as const)[i]}
                />
              </g>
            ))}
          </g>

        </g>
      </svg>
    </div>
  );
}
