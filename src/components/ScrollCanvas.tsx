"use client";

import { useEffect, useRef } from "react";

interface Node {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
  pulse: number;
  pulseSpeed: number;
  colorVariant: number; // 0 = purple, 1 = pink accent
}

export default function ScrollCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let rafId: number;
    let mouseX = -9999;
    let mouseY = -9999;

    /* ── resize ─────────────────────────────────────────────── */
    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();

    const onResize = () => resize();
    const onMouse = (e: MouseEvent) => { mouseX = e.clientX; mouseY = e.clientY; };
    const onMouseLeave = () => { mouseX = -9999; mouseY = -9999; };

    window.addEventListener("resize", onResize);
    window.addEventListener("mousemove", onMouse, { passive: true });
    document.addEventListener("mouseleave", onMouseLeave);

    /* ── nodes ──────────────────────────────────────────────── */
    const isMobile = window.innerWidth < 768;
    const COUNT = isMobile ? 50 : 105;
    const MAX_DIST = isMobile ? 140 : 175;
    const MOUSE_DIST = 130;

    const nodes: Node[] = Array.from({ length: COUNT }, () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      vx: (Math.random() - 0.5) * 0.22,
      vy: (Math.random() - 0.5) * 0.22,
      r: Math.random() * 1.1 + 0.55,
      pulse: Math.random() * Math.PI * 2,
      pulseSpeed: 0.007 + Math.random() * 0.011,
      colorVariant: Math.random() < 0.85 ? 0 : 1,
    }));

    let lastTime = 0;

    /* ── animation loop ─────────────────────────────────────── */
    const animate = (time: number) => {
      rafId = requestAnimationFrame(animate);
      const dt = Math.min((time - lastTime) / 16.67, 2.5);
      lastTime = time;

      const w = canvas.width;
      const h = canvas.height;
      ctx.clearRect(0, 0, w, h);

      /* update positions */
      for (const n of nodes) {
        n.pulse += n.pulseSpeed;
        n.x += n.vx * dt;
        n.y += n.vy * dt;

        /* mouse repel */
        const dx = n.x - mouseX;
        const dy = n.y - mouseY;
        const d = Math.sqrt(dx * dx + dy * dy);
        if (d < MOUSE_DIST && d > 1) {
          const f = ((MOUSE_DIST - d) / MOUSE_DIST) * 0.45;
          n.vx += (dx / d) * f * dt;
          n.vy += (dy / d) * f * dt;
        }

        /* dampen + small random drift */
        n.vx *= 0.993;
        n.vy *= 0.993;
        if (Math.abs(n.vx) < 0.07) n.vx += (Math.random() - 0.5) * 0.012;
        if (Math.abs(n.vy) < 0.07) n.vy += (Math.random() - 0.5) * 0.012;

        /* wrap edges */
        if (n.x < -30) n.x = w + 30;
        else if (n.x > w + 30) n.x = -30;
        if (n.y < -30) n.y = h + 30;
        else if (n.y > h + 30) n.y = -30;
      }

      /* draw connections */
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          // quick bbox cull
          if (Math.abs(dx) > MAX_DIST || Math.abs(dy) > MAX_DIST) continue;
          const d = Math.sqrt(dx * dx + dy * dy);
          if (d < MAX_DIST) {
            const alpha = (1 - d / MAX_DIST) * 0.1;
            ctx.beginPath();
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
            ctx.strokeStyle = `rgba(139,92,246,${alpha.toFixed(3)})`;
            ctx.lineWidth = 0.65;
            ctx.stroke();
          }
        }
      }

      /* draw nodes */
      for (const n of nodes) {
        const pulseFactor = 0.75 + Math.sin(n.pulse) * 0.25;
        const baseAlpha = n.colorVariant === 0 ? 0.28 : 0.18;
        const alpha = baseAlpha * pulseFactor;
        const radius = n.r * (0.92 + Math.sin(n.pulse) * 0.08);

        /* subtle glow behind large nodes */
        if (n.r > 1.3) {
          const grad = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, radius * 5);
          grad.addColorStop(0, n.colorVariant === 0
            ? `rgba(139,92,246,${(alpha * 0.22).toFixed(3)})`
            : `rgba(236,72,153,${(alpha * 0.18).toFixed(3)})`);
          grad.addColorStop(1, "rgba(0,0,0,0)");
          ctx.beginPath();
          ctx.arc(n.x, n.y, radius * 5, 0, Math.PI * 2);
          ctx.fillStyle = grad;
          ctx.fill();
        }

        /* node dot */
        ctx.beginPath();
        ctx.arc(n.x, n.y, radius, 0, Math.PI * 2);
        ctx.fillStyle = n.colorVariant === 0
          ? `rgba(139,92,246,${alpha.toFixed(3)})`
          : `rgba(236,72,153,${alpha.toFixed(3)})`;
        ctx.fill();
      }
    };

    rafId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("mousemove", onMouse);
      document.removeEventListener("mouseleave", onMouseLeave);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        zIndex: 0,
        pointerEvents: "none",
        display: "block",
      }}
    />
  );
}
