/*
Copyright (c) 2026 Sabareesh M (saba1207B). All Rights Reserved.

This source code is proprietary and confidential.

Unauthorized copying, redistribution, modification, or use — including
any use for artificial intelligence / machine learning training —
is strictly prohibited.

See the LICENSE and COPYRIGHT files in the repository root for full terms.
*/

/* ═══════════════════════════════════════════════════════════════
   ANTIGRAVITY — REACTIVE PARTICLE FIELD
   Replicates the Google Antigravity mouse-reactive particle system:
   radial repulsion + spring return to home origin + idle drift.
   ═══════════════════════════════════════════════════════════════ */

import { useEffect, useRef } from "react";

interface RGBColor {
  r: number;
  g: number;
  b: number;
  hex: string;
}

interface ParticleNode {
  originX: number;
  originY: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: RGBColor;
  alpha: number;
  angle: number;
  baseAngle: number;
  shape: "dot" | "dash" | "star" | "star5" | "ring" | "diamond";
  driftPhaseX: number;
  driftPhaseY: number;
  driftSpeedX: number;
  driftSpeedY: number;
}

interface TrailSpark {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  alpha: number;
  age: number;
  maxAge: number;
}

interface AntigravityCanvasProps {
  mode: "blue-rainbow" | "white-rainbow" | "dark-gold";
  showConstellationNodes?: boolean;
  particleDensity?: number;
  className?: string;
}

// ─── Color Palettes ───
// High-contrast Google Rainbow for white/paper backgrounds
const GOOGLE_RAINBOW_COLORS: RGBColor[] = [
  { r: 234, g: 67,  b: 53,  hex: "#EA4335" }, // Google Red
  { r: 66,  g: 133, b: 244, hex: "#4285F4" }, // Google Blue
  { r: 245, g: 158, b: 11,  hex: "#F59E0B" }, // Google Amber / Warm Gold
  { r: 52,  g: 168, b: 83,  hex: "#34A853" }, // Google Green
  { r: 48,  g: 71,  b: 236, hex: "#3047EC" }, // Cobalt
  { r: 255, g: 87,  b: 34,  hex: "#FF5722" }, // Vivid Coral
  { r: 142, g: 36,  b: 170, hex: "#8E24AA" }, // Purple
];

const BLUE_COBALT_COLORS: RGBColor[] = [
  { r: 255, g: 216, b: 77,  hex: "#ffd84d" },
  { r: 169, g: 234, b: 217, hex: "#a9ead9" },
  { r: 255, g: 117, b: 109, hex: "#ff756d" },
  { r: 201, g: 183, b: 255, hex: "#c9b7ff" },
  { r: 158, g: 220, b: 255, hex: "#9edcff" },
  { r: 255, g: 255, b: 255, hex: "#ffffff" },
];

const DARK_GOLD_COLORS: RGBColor[] = [
  { r: 255, g: 215, b: 0,   hex: "#FFD700" },
  { r: 255, g: 193, b: 7,   hex: "#FFC107" },
  { r: 255, g: 224, b: 130, hex: "#FFE082" },
  { r: 255, g: 250, b: 141, hex: "#FFFA8D" },
  { r: 245, g: 158, b: 11,  hex: "#F59E0B" },
];

function angleDiff(target: number, current: number): number {
  let diff = target - current;
  while (diff > Math.PI) diff -= Math.PI * 2;
  while (diff < -Math.PI) diff += Math.PI * 2;
  return diff;
}

export default function AntigravityCanvas({
  mode,
  showConstellationNodes = false,
  particleDensity = 1,
  className = "",
}: AntigravityCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    const parent = canvas.parentElement;
    if (!parent) return;

    const prefersReducedMotion =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) return;

    const isMobile =
      typeof window !== "undefined" &&
      (window.innerWidth <= 768 || window.matchMedia("(pointer: coarse)").matches);

    // ─── Google Antigravity Physics Configuration (High Intensity) ───
    const CONFIG = {
      repulsionRadius: isMobile ? 160 : 240,     // Force field radius (px)
      repulsionStrength: isMobile ? 9.5 : 15.0,  // Powerful repulsion impulse
      velocityDamping: 0.915,                   // Smooth momentum decay
      springStiffness: 0.048,                   // Snappy elastic spring return
      driftAmplitude: isMobile ? 10 : 16,       // Idle floating drift amplitude (px)
      driftSpeed: 0.00095,                      // Idle floating speed
      dashLength: 3.6,
      globalAlpha: mode === "white-rainbow" ? 0.96 : 0.90,
    };

    const palette =
      mode === "white-rainbow"
        ? GOOGLE_RAINBOW_COLORS
        : mode === "dark-gold"
        ? DARK_GOLD_COLORS
        : BLUE_COBALT_COLORS;

    let rafId: number;
    let width = parent.clientWidth;
    let height = parent.clientHeight;
    let lastInitHeight = 0;

    let mouseX = -9999;
    let mouseY = -9999;
    let lastX = -9999;
    let lastY = -9999;
    let isMouseActive = false;
    let isIntersecting = false;
    let isRunning = false;

    const nodes: ParticleNode[] = [];
    const trailSparks: TrailSpark[] = [];

    // ─── Generate Evenly-Spaced Constellation Grid ───
    const initNodes = (targetW: number, targetH: number) => {
      nodes.length = 0;
      if (!showConstellationNodes) return;

      // Area-proportional density, with a per-section multiplier and a safe cap.
      const rawCount = Math.floor((targetW * targetH) / (isMobile ? 32000 : 24000));
      const minCount = isMobile ? 10 : 18;
      const maxCount = isMobile ? 54 : 120;
      const requestedCount = Math.round(Math.max(minCount, rawCount) * particleDensity);
      const count = Math.min(maxCount, Math.max(minCount, requestedCount));

      const shapes: ("dot" | "dash" | "star" | "star5" | "ring" | "diamond")[] = isMobile
        ? ["star", "dot", "star", "dash", "ring", "star5"]
        : ["star", "star", "dot", "dash", "ring", "star5", "diamond", "dot"];

      const margin = isMobile ? 25 : 45;
      const availW = Math.max(100, targetW - margin * 2);
      const availH = Math.max(100, targetH - margin * 2);

      // Distribute in a jittered grid so nodes never cluster on top of text
      const cols = Math.max(2, Math.round(Math.sqrt((count * availW) / availH)));
      const rows = Math.max(2, Math.ceil(count / cols));
      const cellW = availW / cols;
      const cellH = availH / rows;

      let created = 0;
      for (let r = 0; r < rows && created < count; r++) {
        for (let c = 0; c < cols && created < count; c++) {
          const ox = margin + (c + 0.5 + (Math.random() - 0.5) * 0.65) * cellW;
          const oy = margin + (r + 0.5 + (Math.random() - 0.5) * 0.65) * cellH;

          const shape = shapes[Math.floor(Math.random() * shapes.length)];
          const color = palette[Math.floor(Math.random() * palette.length)];
          const isProminent = Math.random() < 0.35;

          // Bigger particle sizing
          const size = isMobile
            ? isProminent ? Math.random() * 3.0 + 7.0 : Math.random() * 2.0 + 5.0
            : isProminent ? Math.random() * 4.5 + 9.0 : Math.random() * 3.0 + 6.5;

          const baseAngle = Math.random() * Math.PI * 2;

          nodes.push({
            originX: ox,
            originY: oy,
            x: ox,
            y: oy,
            vx: 0,
            vy: 0,
            size,
            color,
            alpha: Math.random() * 0.18 + (mode === "white-rainbow" ? 0.82 : 0.65),
            angle: baseAngle,
            baseAngle,
            shape,
            driftPhaseX: Math.random() * Math.PI * 2,
            driftPhaseY: Math.random() * Math.PI * 2,
            driftSpeedX: CONFIG.driftSpeed * (0.6 + Math.random() * 0.8),
            driftSpeedY: CONFIG.driftSpeed * (0.6 + Math.random() * 0.8),
          });
          created++;
        }
      }
    };

    // ─── Trail Particles Spawn ───
    const spawnTrailSparks = (px: number, py: number, intensity: number) => {
      const sparkCount = isMobile
        ? Math.min(4, Math.round(intensity * 2.5))
        : Math.min(8, Math.round(intensity * 4.5));

      for (let i = 0; i < sparkCount; i++) {
        const colorObj = palette[Math.floor(Math.random() * palette.length)];
        const theta = Math.random() * Math.PI * 2;
        const speed = Math.random() * 2.8 + 0.8;
        trailSparks.push({
          x: px + (Math.random() - 0.5) * 10,
          y: py + (Math.random() - 0.5) * 10,
          vx: Math.cos(theta) * speed,
          vy: Math.sin(theta) * speed,
          size: Math.random() * 4.0 + 3.0,
          color: colorObj.hex,
          alpha: 1.0,
          age: 0,
          maxAge: isMobile ? 22 + Math.random() * 10 : 32 + Math.random() * 16,
        });
      }
    };

    // ─── Click / Tap Shockwave Impulse ───
    const triggerImpulse = (clientX: number, clientY: number) => {
      if (!canvas || !isIntersecting) return;
      const rect = canvas.getBoundingClientRect();
      const px = clientX - rect.left;
      const py = clientY - rect.top;

      if (px < -30 || px > width + 30 || py < -30 || py > height + 30) return;

      const impulseRadius = isMobile ? 220 : 320;
      const impulseStrength = isMobile ? 18 : 28;

      for (let i = 0; i < nodes.length; i++) {
        const p = nodes[i];
        const dx = p.x - px;
        const dy = p.y - py;
        const dist = Math.hypot(dx, dy);
        if (dist < impulseRadius && dist > 1) {
          const force = (1 - dist / impulseRadius) * impulseStrength;
          const angle = Math.atan2(dy, dx);
          p.vx += Math.cos(angle) * force;
          p.vy += Math.sin(angle) * force;
        }
      }

      const burstCount = isMobile ? 8 : 16;
      for (let i = 0; i < burstCount; i++) {
        const colorObj = palette[Math.floor(Math.random() * palette.length)];
        const theta = Math.random() * Math.PI * 2;
        const speed = Math.random() * 4.2 + 1.2;
        trailSparks.push({
          x: px,
          y: py,
          vx: Math.cos(theta) * speed,
          vy: Math.sin(theta) * speed,
          size: Math.random() * 4.5 + 2.5,
          color: colorObj.hex,
          alpha: 1.0,
          age: 0,
          maxAge: isMobile ? 24 + Math.random() * 10 : 36 + Math.random() * 14,
        });
      }

      startLoop();
    };

    // ─── DPR & Full Section Dimension Synchronization ───
    const handleResize = () => {
      if (!parent || !canvas) return;
      const dpr = isMobile ? 1 : Math.min(window.devicePixelRatio || 1, 1.25);
      width = parent.clientWidth;
      height = parent.clientHeight;

      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.position = "absolute";
      canvas.style.top = "0";
      canvas.style.left = "0";
      canvas.style.width = "100%";
      canvas.style.height = "100%";
      canvas.style.pointerEvents = "none";
      canvas.style.zIndex = "1";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      if (showConstellationNodes) {
        if (nodes.length === 0 || Math.abs(height - lastInitHeight) > 120) {
          lastInitHeight = height;
          initNodes(width, height);
        }
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    const resizeObserver = new ResizeObserver(() => {
      handleResize();
    });
    resizeObserver.observe(parent);

    // ─── Mouse & Touch Tracking ───
    const updatePointer = (clientX: number, clientY: number, isTouch = false) => {
      if (!canvas || !parent || !isIntersecting) return;
      const rect = canvas.getBoundingClientRect();
      const x = clientX - rect.left;
      const y = clientY - rect.top;

      const pad = isTouch ? 40 : 15;
      if (x < -pad || x > width + pad || y < -pad || y > height + pad) {
        if (!isTouch) isMouseActive = false;
        return;
      }

      isMouseActive = true;
      startLoop();
      mouseX = Math.max(0, Math.min(width, x));
      mouseY = Math.max(0, Math.min(height, y));

      const dx = mouseX - lastX;
      const dy = mouseY - lastY;
      const dist = Math.hypot(dx, dy);

      if (dist > (isTouch ? 6 : 4)) {
        const intensity = Math.min(1.5, dist / 6);
        spawnTrailSparks(mouseX, mouseY, intensity);
        lastX = mouseX;
        lastY = mouseY;
      }
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!isIntersecting) return;
      updatePointer(e.clientX, e.clientY, false);
    };

    const onMouseDown = (e: MouseEvent) => {
      triggerImpulse(e.clientX, e.clientY);
    };

    const onMouseLeave = () => {
      isMouseActive = false;
      mouseX = -9999;
      mouseY = -9999;
    };

    const onTouchStart = (e: TouchEvent) => {
      if (!canvas || !parent || !isIntersecting || e.touches.length === 0) return;
      const t = e.touches[0];
      updatePointer(t.clientX, t.clientY, true);
      triggerImpulse(t.clientX, t.clientY);
    };

    const onTouchMove = (e: TouchEvent) => {
      if (!isIntersecting || e.touches.length === 0) return;
      const t = e.touches[0];
      updatePointer(t.clientX, t.clientY, true);
    };

    const onTouchEnd = () => {
      isMouseActive = false;
      mouseX = -9999;
      mouseY = -9999;
    };

    window.addEventListener("mousemove", onMouseMove, { passive: true });
    window.addEventListener("mousedown", onMouseDown, { passive: true });
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: true });
    window.addEventListener("touchend", onTouchEnd, { passive: true });
    parent.addEventListener("mouseleave", onMouseLeave);

    // ─── Animation Loop with Radial Repulsion + Spring Return Physics ───
    const render = (time: number) => {
      if (!isIntersecting || !isRunning) return;

      ctx.clearRect(0, 0, width, height);

      // 1. Constellation Inter-Node Connecting Lines (Flexes with spring physics!)
      if (showConstellationNodes && nodes.length > 0) {
        const maxDist = isMobile ? 95 : 140;
        const maxDistSq = maxDist * maxDist;
        const count = nodes.length;

        for (let i = 0; i < count; i++) {
          for (let j = i + 1; j < count; j++) {
            const p1 = nodes[i];
            const p2 = nodes[j];
            const dx = p1.x - p2.x;
            const dy = p1.y - p2.y;
            const distSq = dx * dx + dy * dy;

            if (distSq < maxDistSq) {
              const baseAlpha = mode === "white-rainbow" ? 0.38 : 0.28;
              const alpha = (1 - Math.sqrt(distSq) / maxDist) * baseAlpha;
              ctx.save();
              ctx.globalAlpha = alpha;
              ctx.strokeStyle = p1.color.hex;
              ctx.lineWidth = mode === "white-rainbow" ? 1.6 : 1.2;
              ctx.beginPath();
              ctx.moveTo(p1.x, p1.y);
              ctx.lineTo(p2.x, p2.y);
              ctx.stroke();
              ctx.restore();
            }
          }
        }
      }

      // 2. Update & Draw Constellation Nodes (Google Antigravity Physics)
      const radiusSq = CONFIG.repulsionRadius * CONFIG.repulsionRadius;

      for (let i = 0; i < nodes.length; i++) {
        const p = nodes[i];

        // ─── Mouse Repulsion ───
        const dx = p.x - mouseX;
        const dy = p.y - mouseY;
        const distSq = dx * dx + dy * dy;

        if (isMouseActive && distSq < radiusSq && distSq > 0.01) {
          const dist = Math.sqrt(distSq);
          const force = (1 - dist / CONFIG.repulsionRadius) * CONFIG.repulsionStrength;
          const angle = Math.atan2(dy, dx);
          p.vx += Math.cos(angle) * force;
          p.vy += Math.sin(angle) * force;
        }

        // ─── Spring Return to Origin + Idle Drift ───
        const driftX = Math.sin(time * p.driftSpeedX + p.driftPhaseX) * CONFIG.driftAmplitude;
        const driftY = Math.cos(time * p.driftSpeedY + p.driftPhaseY) * CONFIG.driftAmplitude * 0.7;

        const targetX = p.originX + driftX;
        const targetY = p.originY + driftY;

        p.vx += (targetX - p.x) * CONFIG.springStiffness;
        p.vy += (targetY - p.y) * CONFIG.springStiffness;

        // ─── Apply Damping ───
        p.vx *= CONFIG.velocityDamping;
        p.vy *= CONFIG.velocityDamping;
        p.x += p.vx;
        p.y += p.vy;

        // ─── Velocity-Aligned Rotation ───
        const speed = Math.hypot(p.vx, p.vy);
        if (speed > 0.4) {
          const velocityAngle = Math.atan2(p.vy, p.vx);
          const blendFactor = Math.min(speed / 7, 1) * 0.35;
          p.angle += angleDiff(velocityAngle, p.angle) * blendFactor;
        } else {
          p.angle += angleDiff(p.baseAngle, p.angle) * 0.02;
        }

        // ─── Render Node ───
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.angle);
        ctx.globalAlpha = p.alpha * CONFIG.globalAlpha;
        const { r, g, b } = p.color;
        ctx.fillStyle = `rgb(${r},${g},${b})`;
        ctx.strokeStyle = `rgb(${r},${g},${b})`;

        if (p.shape === "dot") {
          ctx.beginPath();
          ctx.arc(0, 0, p.size * 0.75, 0, Math.PI * 2);
          ctx.fill();
        } else if (p.shape === "dash") {
          const halfW = p.size * CONFIG.dashLength * 0.52;
          const halfH = p.size * 0.45;
          const r2 = halfH;
          ctx.beginPath();
          ctx.moveTo(-halfW + r2, -halfH);
          ctx.lineTo(halfW - r2, -halfH);
          ctx.arcTo(halfW, -halfH, halfW, -halfH + r2, r2);
          ctx.lineTo(halfW, halfH - r2);
          ctx.arcTo(halfW, halfH, halfW - r2, halfH, r2);
          ctx.lineTo(-halfW + r2, halfH);
          ctx.arcTo(-halfW, halfH, -halfW, halfH - r2, r2);
          ctx.lineTo(-halfW, -halfH + r2);
          ctx.arcTo(-halfW, -halfH, -halfW + r2, -halfH, r2);
          ctx.closePath();
          ctx.fill();
        } else if (p.shape === "star") {
          const outer = p.size * 1.85;
          const inner = outer * 0.28;
          ctx.beginPath();
          for (let step = 0; step < 8; step++) {
            const a = (step * Math.PI) / 4;
            const rad = step % 2 === 0 ? outer : inner;
            const sx = Math.cos(a) * rad;
            const sy = Math.sin(a) * rad;
            if (step === 0) ctx.moveTo(sx, sy);
            else ctx.lineTo(sx, sy);
          }
          ctx.closePath();
          ctx.fill();
          // Center highlight
          ctx.fillStyle = "#ffffff";
          ctx.beginPath();
          ctx.arc(0, 0, Math.max(1.8, p.size * 0.24), 0, Math.PI * 2);
          ctx.fill();
        } else if (p.shape === "star5") {
          const outer = p.size * 1.65;
          const inner = outer * 0.42;
          ctx.beginPath();
          for (let step = 0; step < 10; step++) {
            const a = (step * Math.PI) / 5 - Math.PI / 2;
            const rad = step % 2 === 0 ? outer : inner;
            const sx = Math.cos(a) * rad;
            const sy = Math.sin(a) * rad;
            if (step === 0) ctx.moveTo(sx, sy);
            else ctx.lineTo(sx, sy);
          }
          ctx.closePath();
          ctx.fill();
        } else if (p.shape === "ring") {
          ctx.lineWidth = Math.max(2.5, p.size * 0.32);
          ctx.beginPath();
          ctx.arc(0, 0, p.size * 1.25, 0, Math.PI * 2);
          ctx.stroke();
        } else if (p.shape === "diamond") {
          const s = p.size * 1.45;
          ctx.beginPath();
          ctx.moveTo(0, -s);
          ctx.lineTo(s, 0);
          ctx.lineTo(0, s);
          ctx.lineTo(-s, 0);
          ctx.closePath();
          ctx.fill();
        }

        ctx.restore();
      }

      // 3. Render Cursor Trail Sparks
      for (let i = trailSparks.length - 1; i >= 0; i--) {
        const s = trailSparks[i];
        s.x += s.vx;
        s.y += s.vy;
        s.age++;

        const lifeRatio = s.age / s.maxAge;
        const fade = Math.max(0, 1 - lifeRatio);

        if (s.age >= s.maxAge) {
          trailSparks.splice(i, 1);
          continue;
        }

        ctx.save();
        ctx.globalAlpha = s.alpha * fade;
        ctx.fillStyle = s.color;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.size * (1 - lifeRatio * 0.35), 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      // Cap sparks array to maintain 60 FPS
      if (trailSparks.length > 80) {
        trailSparks.splice(0, trailSparks.length - 80);
      }

      // Idle sleep check
      if (!showConstellationNodes && trailSparks.length === 0 && !isMouseActive) {
        ctx.clearRect(0, 0, width, height);
        isRunning = false;
        return;
      }

      if (isRunning && isIntersecting) {
        rafId = requestAnimationFrame(render);
      }
    };

    // ─── Lifecycle Controller ───
    const startLoop = () => {
      if (isRunning) return;
      isRunning = true;
      rafId = requestAnimationFrame(render);
    };

    const stopLoop = () => {
      if (!isRunning) return;
      isRunning = false;
      cancelAnimationFrame(rafId);
      ctx.clearRect(0, 0, width, height);
      if (trailSparks.length > 0) trailSparks.length = 0;
    };

    const visibilityObserver = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        isIntersecting = entry.isIntersecting;
        if (isIntersecting) {
          startLoop();
        } else {
          stopLoop();
        }
      },
      { rootMargin: "60px 0px 60px 0px", threshold: 0 }
    );
    visibilityObserver.observe(parent);

    return () => {
      visibilityObserver.disconnect();
      stopLoop();
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("touchend", onTouchEnd);
      resizeObserver.disconnect();
      if (parent) {
        parent.removeEventListener("mouseleave", onMouseLeave);
      }
      cancelAnimationFrame(rafId);
    };
  }, [mode, showConstellationNodes]);

  return (
    <canvas
      ref={canvasRef}
      className={`antigravity-layer-canvas ${className}`}
      aria-hidden="true"
    />
  );
}
