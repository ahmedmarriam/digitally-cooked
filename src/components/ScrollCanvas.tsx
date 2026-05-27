"use client";

import { useEffect, useRef } from "react";

/* ── helpers ────────────────────────────────────────────────── */
const ss  = (t: number) => { const c = Math.max(0, Math.min(1, t)); return c * c * (3 - 2 * c); };
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
/** Map a scroll-progress value [sp] from range [s→e] into [0→1] with smoothstep */
const phase = (sp: number, s: number, e: number) => ss((sp - s) / (e - s));

/* ── static data ────────────────────────────────────────────── */
const TASK_LABELS = [
  "Write captions",    "Design graphics",  "Schedule posts",
  "Track analytics",   "Research hashtags","Plan calendar",
  "Post on Instagram", "Reply to comments","Create TikToks",
  "Monitor LinkedIn",  "Build YouTube",    "Boost Facebook",
  "Edit videos",       "Source images",    "Write blog posts",
  "A/B test content",  "Create reels",     "Update bio",
];

const PLATFORMS = [
  { short: "IG", color: "#ec4899" },
  { short: "TK", color: "#a78bfa" },
  { short: "LI", color: "#60a5fa" },
  { short: "FB", color: "#818cf8" },
  { short: "YT", color: "#f87171" },
  { short: "X",  color: "#38bdf8" },
  { short: "PI", color: "#f43f5e" },
];

const BAR_COLORS = ["#8b5cf6","#ec4899","#60a5fa","#22c55e","#f97316"];
const BAR_VALS   = [0.42, 0.60, 0.78, 0.56, 0.90];

/* ── types ──────────────────────────────────────────────────── */
interface Task {
  label: string;
  x: number; y: number;       // chaos drifting position
  drift: number;              // drift angle
  speed: number;
  size: number;
}

interface PlatNode {
  short: string; color: string;
  tx: number; ty: number;     // target position (ring)
}

/* ── component ──────────────────────────────────────────────── */
export default function ScrollCanvas() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let raf: number;
    let sp  = 0;   // scroll progress 0-1
    let t   = 0;   // time counter

    let tasks: Task[] = [];
    let plats: PlatNode[] = [];

    /* ── setup / resize ──────────────────────────────────────── */
    const setup = () => {
      const w = canvas.width = window.innerWidth;
      const h = canvas.height = window.innerHeight;
      const cx = w / 2, cy = h / 2;

      // Scatter task words in a loose ring, avoiding centre
      tasks = TASK_LABELS.map((label, i) => {
        const ang = (i / TASK_LABELS.length) * Math.PI * 2 + Math.random() * 0.6;
        const minR = Math.min(w, h) * 0.26;
        const maxR = Math.min(w, h) * 0.50;
        const r = minR + Math.random() * (maxR - minR);
        return {
          label, size: 11 + (i % 3) * 1.5,
          x: cx + Math.cos(ang) * r * (0.85 + Math.random() * 0.3),
          y: cy + Math.sin(ang) * r * 0.7,
          drift: Math.random() * Math.PI * 2,
          speed: 0.10 + Math.random() * 0.12,
        };
      });

      // Platform ring
      const platR = Math.min(w, h) * 0.34;
      plats = PLATFORMS.map((p, i) => {
        const ang = (i / PLATFORMS.length) * Math.PI * 2 - Math.PI / 2;
        return { ...p, tx: cx + Math.cos(ang) * platR, ty: cy + Math.sin(ang) * platR };
      });
    };

    setup();
    window.addEventListener("resize", setup);
    window.addEventListener("scroll", () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      sp = max > 0 ? Math.min(1, window.scrollY / max) : 0;
    }, { passive: true });

    /* ── rounded rect ─────────────────────────────────────────── */
    const rr = (x: number, y: number, w: number, h: number, r: number) => {
      ctx.beginPath();
      ctx.moveTo(x + r, y);
      ctx.lineTo(x + w - r, y);
      ctx.arcTo(x + w, y,     x + w, y + r,     r);
      ctx.lineTo(x + w, y + h - r);
      ctx.arcTo(x + w, y + h, x + w - r, y + h, r);
      ctx.lineTo(x + r, y + h);
      ctx.arcTo(x, y + h,     x, y + h - r,     r);
      ctx.lineTo(x, y + r);
      ctx.arcTo(x, y,         x + r, y,         r);
      ctx.closePath();
    };

    /* ── hex helper (alpha byte) ─────────────────────────────── */
    const ha = (v: number) => Math.round(Math.max(0, Math.min(1, v)) * 255)
      .toString(16).padStart(2, "0");

    /* ── main loop ───────────────────────────────────────────── */
    const draw = () => {
      raf = requestAnimationFrame(draw);
      t += 0.01;

      const w  = canvas.width;
      const h  = canvas.height;
      const cx = w / 2, cy = h / 2;

      ctx.clearRect(0, 0, w, h);

      /* phase values */
      const pConverge  = phase(sp, 0.12, 0.42);   // words → centre
      const pOrb       = Math.max(phase(sp, 0.12, 0.38) * 0.55, phase(sp, 0.35, 0.62));
      const pRays      = phase(sp, 0.35, 0.62);    // AI processing rays
      const pPlats     = phase(sp, 0.55, 0.82);    // platform nodes expand
      const pGrowth    = phase(sp, 0.78, 1.00);    // analytics bars

      /* ═══ 1. CHAOS WORDS ════════════════════════════════════ */
      if (sp < 0.58) {
        tasks.forEach((task) => {
          /* drift only while not yet converging */
          if (pConverge < 0.25) {
            task.drift += 0.003 + task.speed * 0.002;
            task.x += Math.cos(task.drift) * task.speed * 0.4;
            task.y += Math.sin(task.drift) * task.speed * 0.3;
            if (task.x < -130) task.x = w + 130;
            else if (task.x > w + 130) task.x = -130;
            if (task.y < -60)  task.y = h + 60;
            else if (task.y > h + 60)  task.y = -60;
          }

          /* lerp toward centre as convergence rises */
          const dx = lerp(task.x, cx, ss(pConverge));
          const dy = lerp(task.y, cy, ss(pConverge));

          /* fade: full opacity before converge, gone when fully converged */
          const alpha = (1 - Math.pow(pConverge, 1.6)) * 0.52;
          if (alpha < 0.01) return;

          ctx.save();
          ctx.globalAlpha = alpha;
          ctx.font        = `${task.size}px 'Inter',system-ui,sans-serif`;
          ctx.fillStyle   = "#a78bfa";
          ctx.textAlign   = "center";
          ctx.textBaseline = "middle";
          ctx.fillText(task.label, dx, dy);
          ctx.restore();
        });
      }

      /* ═══ 2. CENTRAL PROCESSOR ORB ═══════════════════════════ */
      if (pOrb > 0.01) {
        /* glow rings */
        for (let ri = 3; ri >= 1; ri--) {
          const rr2 = (26 + ri * 26) * pOrb * (1 + Math.sin(t * 1.3 + ri) * 0.04);
          const g   = ctx.createRadialGradient(cx, cy, 0, cx, cy, rr2);
          g.addColorStop(0, `rgba(139,92,246,${(0.07 * pOrb).toFixed(3)})`);
          g.addColorStop(1, "rgba(0,0,0,0)");
          ctx.beginPath(); ctx.arc(cx, cy, rr2, 0, Math.PI * 2);
          ctx.fillStyle = g; ctx.fill();
        }
        /* core */
        const cR  = 13 * pOrb;
        const cG  = ctx.createRadialGradient(cx, cy, 0, cx, cy, cR * 2.2);
        cG.addColorStop(0,   `rgba(225,215,255,${pOrb.toFixed(3)})`);
        cG.addColorStop(0.45,`rgba(139,92,246,${(pOrb * 0.65).toFixed(3)})`);
        cG.addColorStop(1,   "rgba(0,0,0,0)");
        ctx.beginPath(); ctx.arc(cx, cy, cR * 2.2, 0, Math.PI * 2);
        ctx.fillStyle = cG; ctx.fill();
        /* solid inner dot */
        ctx.beginPath(); ctx.arc(cx, cy, cR * 0.42, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(245,240,255,${pOrb.toFixed(3)})`; ctx.fill();
      }

      /* ═══ 3. PROCESSING RAYS ══════════════════════════════════ */
      if (pRays > 0.05 && pPlats < 0.92) {
        const rAlpha = pRays * (1 - pPlats * 0.75) * 0.18;
        for (let ri = 0; ri < 12; ri++) {
          const ang = (ri / 12) * Math.PI * 2 + t * 0.22;
          const len = (45 + (ri % 3) * 22) * pRays;
          ctx.beginPath();
          ctx.moveTo(cx, cy);
          ctx.lineTo(cx + Math.cos(ang) * len, cy + Math.sin(ang) * len);
          ctx.strokeStyle = `rgba(139,92,246,${rAlpha.toFixed(3)})`;
          ctx.lineWidth = 0.7; ctx.stroke();
          /* tip dot */
          ctx.beginPath();
          ctx.arc(cx + Math.cos(ang) * len, cy + Math.sin(ang) * len, 1.8 * pRays, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(180,150,255,${(rAlpha * 2.2).toFixed(3)})`; ctx.fill();
        }
      }

      /* ═══ 4. PLATFORM NODES + DATA STREAMS ════════════════════ */
      if (pPlats > 0.02) {
        plats.forEach((p, i) => {
          const stagger = (i / plats.length) * 0.32;
          const pa      = ss((pPlats - stagger) / (1 - stagger));
          if (pa < 0.01) return;

          /* animate from centre outward */
          const px = lerp(cx, p.tx, pa);
          const py = lerp(cy, p.ty, pa);

          /* stream line */
          const lA = pa * 0.17 * (1 - pGrowth * 0.55);
          if (lA > 0.01) {
            ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(px, py);
            ctx.strokeStyle = p.color + ha(lA);
            ctx.lineWidth = 0.9; ctx.stroke();
          }

          /* animated data dots along line */
          if (pa > 0.38) {
            for (let d = 0; d < 3; d++) {
              const tD  = ((t * 0.32 + d / 3 + i * 0.18) % 1);
              const dA  = Math.sin(tD * Math.PI) * pa * 0.6;
              ctx.beginPath();
              ctx.arc(lerp(cx, px, tD), lerp(cy, py, tD), 2.2, 0, Math.PI * 2);
              ctx.fillStyle = p.color + ha(dA); ctx.fill();
            }
          }

          /* platform pill */
          const pW = 44, pH = 22;
          ctx.save(); ctx.globalAlpha = pa;
          rr(px - pW / 2, py - pH / 2, pW, pH, 11);
          ctx.fillStyle = p.color + "20"; ctx.fill();
          rr(px - pW / 2, py - pH / 2, pW, pH, 11);
          ctx.strokeStyle = p.color + "88"; ctx.lineWidth = 1; ctx.stroke();
          ctx.font         = "bold 10px 'Inter',system-ui,sans-serif";
          ctx.fillStyle    = p.color;
          ctx.textAlign    = "center"; ctx.textBaseline = "middle";
          ctx.fillText(p.short, px, py);
          ctx.restore();
        });
      }

      /* ═══ 5. GROWTH / ANALYTICS ═══════════════════════════════ */
      if (pGrowth > 0.02) {
        const totalW = 190, bW = 22;
        const gap    = (totalW - BAR_VALS.length * bW) / (BAR_VALS.length - 1);
        const baseY  = cy + 108;
        const maxH   = 90;
        const startX = cx - totalW / 2;

        BAR_VALS.forEach((val, i) => {
          const barH = val * maxH * pGrowth;
          const x    = startX + i * (bW + gap);
          const a    = pGrowth * 0.52;
          const g    = ctx.createLinearGradient(x, baseY - barH, x, baseY);
          g.addColorStop(0, BAR_COLORS[i] + ha(a));
          g.addColorStop(1, BAR_COLORS[i] + "11");
          rr(x, baseY - barH, bW, barH, 3);
          ctx.fillStyle = g; ctx.fill();
        });

        /* label */
        if (pGrowth > 0.5) {
          const la = (pGrowth - 0.5) * 2;
          ctx.font          = "bold 12px 'Inter',system-ui,sans-serif";
          ctx.fillStyle     = `rgba(167,139,250,${(la * 0.62).toFixed(3)})`;
          ctx.textAlign     = "center"; ctx.textBaseline = "top";
          ctx.fillText("↑ Your Growth", cx, baseY + 10);
        }
      }
    };

    raf = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", setup);
    };
  }, []);

  return (
    <canvas
      ref={ref}
      style={{
        position: "fixed",
        top: 0, left: 0,
        width: "100%", height: "100%",
        zIndex: 0,
        pointerEvents: "none",
        display: "block",
      }}
    />
  );
}
