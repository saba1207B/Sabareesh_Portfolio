import { useEffect, useRef, useState } from "react";

export default function DynamicCursor() {
  const [cursorState, setCursorState] = useState<{
    text: string | null;
    isHovering: boolean;
    isClicking: boolean;
    isVisible: boolean;
  }>({
    text: null,
    isHovering: false,
    isClicking: false,
    isVisible: false,
  });

  const cursorRef = useRef<HTMLDivElement | null>(null);
  const pillRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    // Only enable on pointer-fine devices (desktops/laptops with mouse)
    if (!window.matchMedia("(pointer: fine)").matches) {
      return;
    }

    let targetX = -100;
    let targetY = -100;
    let currentX = -100;
    let currentY = -100;
    let rafId: number;

    const onPointerMove = (e: PointerEvent) => {
      targetX = e.clientX;
      targetY = e.clientY;
      setCursorState((prev) => (prev.isVisible ? prev : { ...prev, isVisible: true }));
    };

    const onPointerDown = () => {
      setCursorState((prev) => ({ ...prev, isClicking: true }));
    };

    const onPointerUp = () => {
      setCursorState((prev) => ({ ...prev, isClicking: false }));
    };

    const onPointerLeave = () => {
      setCursorState((prev) => ({ ...prev, isVisible: false }));
    };

    const onMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;

      // 1. Check for explicit data-cursor
      const cursorTarget = target.closest("[data-cursor]") as HTMLElement | null;
      if (cursorTarget) {
        const customText = cursorTarget.getAttribute("data-cursor");
        setCursorState((prev) => ({
          ...prev,
          text: customText || null,
          isHovering: true,
        }));
        return;
      }

      // 2. Check for project cards
      const projectCard = target.closest(".project-card") as HTMLElement | null;
      if (projectCard) {
        const isDemo = projectCard.querySelector(".project-link");
        setCursorState((prev) => ({
          ...prev,
          text: isDemo ? "View Code ↗" : "Explore ✦",
          isHovering: true,
        }));
        return;
      }

      // 3. Check for terminal
      const terminal = target.closest(".dev-terminal") as HTMLElement | null;
      if (terminal) {
        setCursorState((prev) => ({
          ...prev,
          text: "Terminal ⌘",
          isHovering: true,
        }));
        return;
      }

      // 4. Check for interactive links and buttons
      const interactive = target.closest("a, button, [role='tab'], input, select");
      if (interactive) {
        setCursorState((prev) => ({
          ...prev,
          text: null,
          isHovering: true,
        }));
        return;
      }

      // Default state
      setCursorState((prev) => ({
        ...prev,
        text: null,
        isHovering: false,
      }));
    };

    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("pointerup", onPointerUp);
    document.addEventListener("mouseleave", onPointerLeave);
    document.addEventListener("mouseover", onMouseOver);

    const loop = () => {
      const lerp = 0.22;
      currentX += (targetX - currentX) * lerp;
      currentY += (targetY - currentY) * lerp;

      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate3d(${currentX}px, ${currentY}px, 0)`;
      }

      rafId = requestAnimationFrame(loop);
    };

    loop();

    return () => {
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("pointerup", onPointerUp);
      document.removeEventListener("mouseleave", onPointerLeave);
      document.removeEventListener("mouseover", onMouseOver);
      cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <div
      ref={cursorRef}
      className={`antigravity-cursor-container ${cursorState.isVisible ? "visible" : ""} ${
        cursorState.isHovering ? "hovering" : ""
      } ${cursorState.text ? "has-text" : ""} ${cursorState.isClicking ? "clicking" : ""}`}
      aria-hidden="true"
    >
      {cursorState.text ? (
        <div ref={pillRef} className="cursor-pill-badge">
          <span className="pill-dot">✦</span>
          <span className="pill-label">{cursorState.text}</span>
        </div>
      ) : (
        <div className="cursor-ring">
          <div className="cursor-dot" />
        </div>
      )}
    </div>
  );
}
