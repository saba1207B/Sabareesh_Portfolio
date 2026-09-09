import { useEffect, useRef } from "react";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  alpha: number;
  angle: number;
  length: number;
  type: "rainbow-dash" | "rainbow-dot" | "gold-dust" | "gold-sparkle" | "node";
  nodeShape?: "circle" | "cross" | "diamond" | "ring" | "star" | "star5";
  rotation?: number;
  rotationSpeed?: number;
  age: number;
  maxAge: number;
  twinkleSpeed?: number;
}

interface AntigravityCanvasProps {
  mode: "blue-rainbow" | "white-rainbow" | "dark-gold";
  showConstellationNodes?: boolean;
  className?: string;
}

const GOLD_PALETTE = ["#FFD700", "#FFC107", "#FFE082", "#FFFA8D", "#FFFDF0", "#F59E0B"];
const BLUE_PALETTE = ["#ffd84d", "#a9ead9", "#ff756d", "#c9b7ff", "#9edcff", "#ffffff"];

export default function AntigravityCanvas({
  mode,
  showConstellationNodes = false,
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

    const isMobile =
      typeof window !== "undefined" &&
      (window.innerWidth <= 768 || window.matchMedia("(pointer: coarse)").matches);

    let rafId: number;
    let width = parent.clientWidth;
    let height = parent.clientHeight;

    let mouseX = -1000;
    let mouseY = -1000;
    let lastX = -1000;
    let lastY = -1000;
    let isHovering = false;
    let isIntersecting = false;
    let isRunning = false;

    const particles: Particle[] = [];
    const constellationNodes: Particle[] = [];

    // Constellation nodes (tuned for bold presence & smooth performance)
    if (showConstellationNodes) {
      const maxNodes = isMobile ? 18 : 46;
      const divisor = isMobile ? 22000 : 14000;
      const count = Math.min(maxNodes, Math.max(8, Math.floor((width * height) / divisor)));

      const shapes: ("circle" | "cross" | "diamond" | "ring" | "star" | "star5")[] = isMobile
        ? ["star", "circle", "star", "ring", "star5", "diamond"]
        : ["star", "star", "circle", "circle", "ring", "star5", "cross", "diamond"];

      for (let i = 0; i < count; i++) {
        const shape = shapes[Math.floor(Math.random() * shapes.length)];
        const color = BLUE_PALETTE[Math.floor(Math.random() * BLUE_PALETTE.length)];
        const isProminent = Math.random() < 0.35;
        // Increased size for clearly visible, bold stars, circles, and shapes in blue background
        const rad = isMobile
          ? isProminent ? Math.random() * 3.5 + 6.0 : Math.random() * 2.5 + 4.0
          : isProminent ? Math.random() * 5.0 + 8.5 : Math.random() * 3.5 + 5.5;

        const speed = (Math.random() - 0.5) * (isMobile ? 0.35 : 0.55);
        const rotSpeed = (Math.random() - 0.5) * 0.025;

        const p: Particle = {
          x: Math.random() * width,
          y: Math.random() * height,
          vx: speed,
          vy: speed,
          size: rad,
          color,
          alpha: Math.random() * 0.4 + 0.5,
          angle: 0,
          length: 0,
          type: "node",
          nodeShape: shape,
          rotation: Math.random() * Math.PI * 2,
          rotationSpeed: rotSpeed,
          age: 0,
          maxAge: Infinity,
        };
        constellationNodes.push(p);
      }
    }

    // DPR Capping: On mobile screens, DPR 1 saves 75-90% of GPU memory and avoids VRAM crashes!
    const handleResize = () => {
      if (!parent || !canvas) return;
      const dpr = isMobile ? 1 : Math.min(window.devicePixelRatio || 1, 2);
      width = parent.clientWidth;
      height = parent.clientHeight;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = "100%";
      canvas.style.height = "100%";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    const resizeObserver = new ResizeObserver(() => {
      handleResize();
    });
    resizeObserver.observe(parent);

    // --- Particle Spawn Helpers (Budget-limited for mobile 60 FPS) ---
    const spawnTrailParticles = (px: number, py: number, intensity = 1) => {
      if (mode === "dark-gold") {
        const maxSpawn = isMobile ? 3 : 6;
        const count = Math.min(maxSpawn, Math.max(1, Math.round(intensity * 2)));

        for (let i = 0; i < count; i++) {
          const angle = Math.random() * Math.PI * 2;
          const speed = Math.random() * 1.5 + 0.3;
          const isSparkle = Math.random() > (isMobile ? 0.75 : 0.62);

          particles.push({
            x: px + (Math.random() - 0.5) * 14,
            y: py + (Math.random() - 0.5) * 14,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed - 0.4,
            size: isSparkle ? Math.random() * 3 + 1.8 : Math.random() * 1.8 + 1,
            color: GOLD_PALETTE[Math.floor(Math.random() * GOLD_PALETTE.length)],
            alpha: 0.9,
            angle: Math.random() * Math.PI,
            length: 0,
            type: isSparkle ? "gold-sparkle" : "gold-dust",
            age: 0,
            maxAge: isMobile ? 22 + Math.random() * 14 : 32 + Math.random() * 24,
            twinkleSpeed: 0.15 + Math.random() * 0.2,
          });
        }
      } else {
        const rings = isMobile
          ? [
              { count: 1, minR: 8, maxR: 35, color: "#EA4335" },
              { count: 1, minR: 35, maxR: 70, color: "#FBBC04" },
              { count: 1, minR: 70, maxR: 120, color: "#34A853" },
              { count: 1, minR: 120, maxR: 180, color: "#4285F4" },
            ]
          : [
              { count: Math.max(1, Math.round(3 * intensity)), minR: 8, maxR: 45, color: "#EA4335" },
              { count: Math.max(1, Math.round(3 * intensity)), minR: 45, maxR: 90, color: "#FBBC04" },
              { count: Math.max(1, Math.round(2 * intensity)), minR: 90, maxR: 140, color: "#34A853" },
              { count: Math.max(1, Math.round(2 * intensity)), minR: 140, maxR: 210, color: "#4285F4" },
            ];

        for (const ring of rings) {
          for (let i = 0; i < ring.count; i++) {
            const r = ring.minR + Math.random() * (ring.maxR - ring.minR);
            const theta = Math.random() * Math.PI * 2;
            const ppx = px + Math.cos(theta) * r;
            const ppy = py + Math.sin(theta) * r;
            const isDash = Math.random() > 0.45;

            particles.push({
              x: ppx,
              y: ppy,
              vx: Math.cos(theta) * (Math.random() * 0.4 + 0.1),
              vy: Math.sin(theta) * (Math.random() * 0.4 + 0.1),
              size: Math.random() * 3.2 + 2.8,
              color: ring.color,
              alpha: Math.max(0.25, 0.9 - (r / 200) * 0.45),
              angle: theta,
              length: isDash ? Math.random() * 8 + 5 : 0,
              type: isDash ? "rainbow-dash" : "rainbow-dot",
              age: 0,
              maxAge: isMobile ? 18 + Math.random() * 12 : 24 + Math.random() * 16,
            });
          }
        }
      }
    };

    const spawnBurstParticles = (cx: number, cy: number) => {
      const burstCount = isMobile ? 8 : 14;

      if (mode === "dark-gold") {
        for (let i = 0; i < burstCount; i++) {
          const angle = (Math.PI * 2 * i) / burstCount + Math.random() * 0.2;
          const speed = Math.random() * 3 + 1.2;
          particles.push({
            x: cx,
            y: cy,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed - 0.4,
            size: Math.random() * 3 + 1.4,
            color: GOLD_PALETTE[Math.floor(Math.random() * GOLD_PALETTE.length)],
            alpha: 1,
            angle: Math.random() * Math.PI,
            length: 0,
            type: Math.random() > 0.5 ? "gold-sparkle" : "gold-dust",
            age: 0,
            maxAge: isMobile ? 22 + Math.random() * 12 : 32 + Math.random() * 16,
            twinkleSpeed: 0.2,
          });
        }
      } else {
        const colors = ["#EA4335", "#FBBC04", "#34A853", "#4285F4", "#ffd84d", "#ff756d"];
        for (let i = 0; i < burstCount; i++) {
          const angle = (Math.PI * 2 * i) / burstCount + Math.random() * 0.2;
          const speed = Math.random() * 2.8 + 1.2;
          particles.push({
            x: cx,
            y: cy,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed,
            size: Math.random() * 3.5 + 3.0,
            color: colors[Math.floor(Math.random() * colors.length)],
            alpha: 1,
            angle: angle,
            length: Math.random() * 10 + 5,
            type: "rainbow-dash",
            age: 0,
            maxAge: isMobile ? 20 + Math.random() * 10 : 28 + Math.random() * 14,
          });
        }
      }
    };

    // --- Interactive Tracking & Event Handling ---
    let lastClientX: number | null = null;
    let lastClientY: number | null = null;
    let lastTouchTime = 0;
    let scrollIdleTimer: number | null = null;

    const handlePointerMove = (clientX: number, clientY: number, isTouch = false) => {
      if (!canvas || !parent || !isIntersecting) return;
      lastClientX = clientX;
      lastClientY = clientY;
      lastTouchTime = performance.now();

      const rect = parent.getBoundingClientRect();
      const x = clientX - rect.left;
      const y = clientY - rect.top;

      const pad = isTouch ? 30 : 10;
      if (x < -pad || x > rect.width + pad || y < -pad || y > rect.height + pad) {
        if (!isTouch) isHovering = false;
        return;
      }

      isHovering = true;
      mouseX = Math.max(0, Math.min(rect.width, x));
      mouseY = Math.max(0, Math.min(rect.height, y));

      const dx = mouseX - lastX;
      const dy = mouseY - lastY;
      const dist = Math.sqrt(dx * dx + dy * dy);

      const threshold = isTouch ? 6 : 5;
      if (dist > threshold) {
        const intensity = isTouch ? Math.min(1.2, dist / 9) : Math.min(1.2, dist / 6);
        spawnTrailParticles(mouseX, mouseY, intensity);
        lastX = mouseX;
        lastY = mouseY;
      }
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!isIntersecting) return;
      handlePointerMove(e.clientX, e.clientY, false);
    };

    const onTouchStart = (e: TouchEvent) => {
      if (!canvas || !parent || !isIntersecting || e.touches.length === 0) return;
      const touch = e.touches[0];
      lastClientX = touch.clientX;
      lastClientY = touch.clientY;
      lastTouchTime = performance.now();

      const rect = parent.getBoundingClientRect();
      const x = touch.clientX - rect.left;
      const y = touch.clientY - rect.top;

      if (x >= -10 && x <= rect.width + 10 && y >= -10 && y <= rect.height + 10) {
        isHovering = true;
        mouseX = Math.max(0, Math.min(rect.width, x));
        mouseY = Math.max(0, Math.min(rect.height, y));
        lastX = mouseX;
        lastY = mouseY;
        spawnBurstParticles(mouseX, mouseY);
      }
    };

    const onTouchMove = (e: TouchEvent) => {
      if (!isIntersecting || e.touches.length === 0) return;
      const touch = e.touches[0];
      handlePointerMove(touch.clientX, touch.clientY, true);
    };

    const onTouchEnd = () => {
      if (!isIntersecting) return;
      if (scrollIdleTimer) window.clearTimeout(scrollIdleTimer);
      scrollIdleTimer = window.setTimeout(() => {
        isHovering = false;
      }, 300);
    };

    const onMouseLeave = () => {
      isHovering = false;
      mouseX = -1000;
      mouseY = -1000;
    };

    const onClick = (e: MouseEvent) => {
      if (!isIntersecting) return;
      const rect = canvas.getBoundingClientRect();
      const cx = e.clientX - rect.left;
      const cy = e.clientY - rect.top;
      spawnBurstParticles(cx, cy);
    };

    let lastScrollY = typeof window !== "undefined" ? window.scrollY : 0;
    let lastScrollSpawnX = -1000;
    let lastScrollSpawnY = -1000;

    const onScroll = () => {
      // Crucial optimization: If this canvas is offscreen, immediately return!
      // This prevents 12 simultaneous calls to getBoundingClientRect() on every scroll event!
      if (!canvas || !parent || !isIntersecting) return;

      const currentScrollY = window.scrollY;
      const delta = Math.abs(currentScrollY - lastScrollY);
      lastScrollY = currentScrollY;

      if (delta < 3) return;

      const rect = parent.getBoundingClientRect();
      const winH = window.innerHeight;
      const winW = window.innerWidth;

      if (rect.bottom < -20 || rect.top > winH + 20) {
        return;
      }

      const now = performance.now();
      let screenX = winW * 0.5;
      let screenY = winH * 0.5;

      if (lastClientX !== null && lastClientY !== null && now - lastTouchTime < 1400) {
        screenX = lastClientX;
        screenY = lastClientY;
      } else {
        screenX = winW * 0.5 + Math.sin(currentScrollY * 0.012) * (winW * 0.2);
        screenY = Math.min(winH * 0.7, Math.max(winH * 0.3, winH * 0.5 + Math.cos(currentScrollY * 0.008) * 50));
      }

      const cx = screenX - rect.left;
      const cy = screenY - rect.top;

      if (cx >= 0 && cx <= rect.width && cy >= 0 && cy <= rect.height) {
        isHovering = true;
        mouseX = cx;
        mouseY = cy;

        const dist = Math.hypot(cx - lastScrollSpawnX, cy - lastScrollSpawnY);
        if (dist > (isMobile ? 10 : 6)) {
          const intensity = Math.min(1.2, Math.max(0.5, delta / 14));
          spawnTrailParticles(cx, cy, intensity);
          lastScrollSpawnX = cx;
          lastScrollSpawnY = cy;
          lastX = cx;
          lastY = cy;
        }

        if (scrollIdleTimer) window.clearTimeout(scrollIdleTimer);
        scrollIdleTimer = window.setTimeout(() => {
          isHovering = false;
        }, 250);
      }
    };

    window.addEventListener("mousemove", onMouseMove, { passive: true });
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: true });
    window.addEventListener("touchend", onTouchEnd, { passive: true });
    window.addEventListener("touchcancel", onTouchEnd, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true });
    parent.addEventListener("mouseleave", onMouseLeave);
    parent.addEventListener("click", onClick);

    // --- Animation Render Loop with Offscreen Pause ---
    const render = () => {
      if (!isIntersecting || !isRunning) return;

      ctx.clearRect(0, 0, width, height);

      // 1. Constellation Nodes (if enabled)
      if (showConstellationNodes && constellationNodes.length > 0) {
        const maxDist = isMobile ? 80 : 120;
        const count = constellationNodes.length;
        for (let i = 0; i < count; i++) {
          for (let j = i + 1; j < count; j++) {
            const p1 = constellationNodes[i];
            const p2 = constellationNodes[j];
            const dx = p1.x - p2.x;
            const dy = p1.y - p2.y;
            const distSq = dx * dx + dy * dy;
            if (distSq < maxDist * maxDist) {
              const alpha = (1 - Math.sqrt(distSq) / maxDist) * 0.22;
              ctx.save();
              ctx.globalAlpha = alpha;
              ctx.strokeStyle = p1.color;
              ctx.lineWidth = 1.0;
              ctx.beginPath();
              ctx.moveTo(p1.x, p1.y);
              ctx.lineTo(p2.x, p2.y);
              ctx.stroke();
              ctx.restore();
            }
          }
        }

        // Draw and update nodes
        for (let i = 0; i < constellationNodes.length; i++) {
          const p = constellationNodes[i];
          p.x += p.vx;
          p.y += p.vy;
          if (p.rotation !== undefined && p.rotationSpeed !== undefined) {
            p.rotation += p.rotationSpeed;
          }

          if (p.x < -30) p.x = width + 30;
          if (p.x > width + 30) p.x = -30;
          if (p.y < -30) p.y = height + 30;
          if (p.y > height + 30) p.y = -30;

          // Mouse / Touch repulsion
          if (isHovering) {
            const dx = p.x - mouseX;
            const dy = p.y - mouseY;
            const distSq = dx * dx + dy * dy;
            const repDist = isMobile ? 110 : 145;
            if (distSq < repDist * repDist && distSq > 0) {
              const dist = Math.sqrt(distSq);
              const force = (1 - dist / repDist) * 3.5;
              p.x += (dx / dist) * force;
              p.y += (dy / dist) * force;
            }
          }

          ctx.save();
          ctx.globalAlpha = p.alpha;
          ctx.fillStyle = p.color;
          ctx.strokeStyle = p.color;
          ctx.lineWidth = Math.max(1.6, p.size * 0.25);
          ctx.translate(p.x, p.y);
          if (p.rotation !== undefined) {
            ctx.rotate(p.rotation);
          }

          if (p.nodeShape === "circle") {
            ctx.beginPath();
            ctx.arc(0, 0, p.size, 0, Math.PI * 2);
            ctx.fill();
            // Subtle aura for prominent circles
            if (p.size > 7.5) {
              ctx.globalAlpha = p.alpha * 0.22;
              ctx.beginPath();
              ctx.arc(0, 0, p.size * 1.45, 0, Math.PI * 2);
              ctx.fill();
            }
          } else if (p.nodeShape === "ring") {
            ctx.beginPath();
            ctx.arc(0, 0, p.size * 1.25, 0, Math.PI * 2);
            ctx.lineWidth = Math.max(2.2, p.size * 0.32);
            ctx.stroke();
          } else if (p.nodeShape === "star") {
            // 4-pointed sparkle star (✦)
            const outer = p.size * 1.75;
            const inner = outer * 0.26;
            ctx.beginPath();
            for (let step = 0; step < 8; step++) {
              const a = (step * Math.PI) / 4;
              const r = step % 2 === 0 ? outer : inner;
              const sx = Math.cos(a) * r;
              const sy = Math.sin(a) * r;
              if (step === 0) ctx.moveTo(sx, sy);
              else ctx.lineTo(sx, sy);
            }
            ctx.closePath();
            ctx.fill();
            // Star center sparkle highlight
            ctx.fillStyle = "#ffffff";
            ctx.beginPath();
            ctx.arc(0, 0, Math.max(1.2, p.size * 0.2), 0, Math.PI * 2);
            ctx.fill();
          } else if (p.nodeShape === "star5") {
            // 5-pointed classic star (★)
            const outer = p.size * 1.55;
            const inner = outer * 0.42;
            ctx.beginPath();
            for (let step = 0; step < 10; step++) {
              const a = (step * Math.PI) / 5 - Math.PI / 2;
              const r = step % 2 === 0 ? outer : inner;
              const sx = Math.cos(a) * r;
              const sy = Math.sin(a) * r;
              if (step === 0) ctx.moveTo(sx, sy);
              else ctx.lineTo(sx, sy);
            }
            ctx.closePath();
            ctx.fill();
          } else if (p.nodeShape === "diamond") {
            const s = p.size * 1.4;
            ctx.beginPath();
            ctx.moveTo(0, -s);
            ctx.lineTo(s, 0);
            ctx.lineTo(0, s);
            ctx.lineTo(-s, 0);
            ctx.closePath();
            ctx.fill();
          } else if (p.nodeShape === "cross") {
            const s = p.size * 1.35;
            ctx.lineWidth = Math.max(2.2, p.size * 0.35);
            ctx.lineCap = "round";
            ctx.beginPath();
            ctx.moveTo(-s, 0);
            ctx.lineTo(s, 0);
            ctx.moveTo(0, -s);
            ctx.lineTo(0, s);
            ctx.stroke();
          }
          ctx.restore();
        }
      }

      // 2. Cursor Trail Particles (Rainbow or Golden Dust)
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.age++;

        const lifeRatio = p.age / p.maxAge;
        const fade = Math.max(0, 1 - lifeRatio);

        if (p.age >= p.maxAge) {
          particles.splice(i, 1);
          continue;
        }

        ctx.save();

        if (p.type === "gold-dust") {
          ctx.globalAlpha = p.alpha * fade;
          ctx.fillStyle = p.color;

          // On desktop, use shadowBlur. On mobile, use fast hardware-accelerated soft arc to save CPU!
          if (!isMobile) {
            ctx.shadowColor = "#FFD700";
            ctx.shadowBlur = 6;
          }

          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size * (1 - lifeRatio * 0.3), 0, Math.PI * 2);
          ctx.fill();

          if (isMobile && p.size > 2) {
            ctx.globalAlpha = p.alpha * fade * 0.3;
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size * 1.6, 0, Math.PI * 2);
            ctx.fill();
          }
        } else if (p.type === "gold-sparkle") {
          const tw = p.twinkleSpeed || 0.15;
          ctx.globalAlpha = p.alpha * fade * (0.7 + 0.3 * Math.sin(p.age * tw));
          ctx.fillStyle = p.color;

          if (!isMobile) {
            ctx.shadowColor = "#FFE082";
            ctx.shadowBlur = 8;
          }

          ctx.translate(p.x, p.y);
          ctx.rotate(p.angle + p.age * 0.05);

          const s = p.size;
          ctx.beginPath();
          ctx.moveTo(0, -s);
          ctx.lineTo(s * 0.28, -s * 0.28);
          ctx.lineTo(s, 0);
          ctx.lineTo(s * 0.28, s * 0.28);
          ctx.lineTo(0, s);
          ctx.lineTo(-s * 0.28, s * 0.28);
          ctx.lineTo(-s, 0);
          ctx.lineTo(-s * 0.28, -s * 0.28);
          ctx.closePath();
          ctx.fill();
        } else if (p.type === "rainbow-dash") {
          ctx.globalAlpha = p.alpha * fade;
          ctx.strokeStyle = p.color;
          ctx.lineWidth = p.size;
          ctx.lineCap = "round";

          const halfL = p.length / 2;
          const cdx = Math.cos(p.angle) * halfL;
          const cdy = Math.sin(p.angle) * halfL;

          ctx.beginPath();
          ctx.moveTo(p.x - cdx, p.y - cdy);
          ctx.lineTo(p.x + cdx, p.y + cdy);
          ctx.stroke();
        } else if (p.type === "rainbow-dot") {
          ctx.globalAlpha = p.alpha * fade;
          ctx.fillStyle = p.color;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fill();
        }

        ctx.restore();
      }

      // Memory cap
      const maxParticleBuffer = isMobile ? 50 : 180;
      if (particles.length > maxParticleBuffer) {
        particles.splice(0, particles.length - maxParticleBuffer);
      }

      // Continue animation loop only while visible
      if (isRunning && isIntersecting) {
        rafId = requestAnimationFrame(render);
      }
    };

    // --- Visibility Lifecycle Controller (Crucial CPU & Memory Saver!) ---
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
      if (particles.length > 0) particles.length = 0;
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
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("touchend", onTouchEnd);
      window.removeEventListener("touchcancel", onTouchEnd);
      window.removeEventListener("scroll", onScroll);
      resizeObserver.disconnect();
      if (scrollIdleTimer) window.clearTimeout(scrollIdleTimer);
      if (parent) {
        parent.removeEventListener("mouseleave", onMouseLeave);
        parent.removeEventListener("click", onClick);
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
