"use client";

import gsap from "gsap";
import { useCallback, useEffect, useRef, useState } from "react";

const DOT_SIZE_PX = 6;
const GAP_PX = 20;
const THRESHOLD = 120;
const SPEED_THRESHOLD = 80;
const SHOCK_RADIUS = 220;
const SHOCK_POWER = 4;
const MAX_SPEED = 4000;
const COLORS = { base: "#2a3548", active: "#fbd701" };

function interpolateColor(t: number): string {
  const a = [0x2a, 0x35, 0x48];
  const b = [0xfb, 0xd7, 0x01];
  const r = Math.round(a[0] + (b[0] - a[0]) * t);
  const g = Math.round(a[1] + (b[1] - a[1]) * t);
  const bl = Math.round(a[2] + (b[2] - a[2]) * t);
  return `#${r.toString(16).padStart(2, "0")}${g.toString(16).padStart(2, "0")}${bl.toString(16).padStart(2, "0")}`;
}

export function DynamicDotsBackground() {
  const containerRef = useRef<HTMLDivElement>(null);
  const dotCentersRef = useRef<{ el: HTMLDivElement; x: number; y: number }[]>([]);
  const lastMoveRef = useRef({ time: 0, x: 0, y: 0 });
  const [grid, setGrid] = useState({ cols: 0, rows: 0 });

  const buildGrid = useCallback(() => {
    const el = containerRef.current;
    if (!el) return;
    const w = el.clientWidth;
    const h = el.clientHeight;
    const cols = Math.max(1, Math.floor((w + GAP_PX) / (DOT_SIZE_PX + GAP_PX)));
    const rows = Math.max(1, Math.floor((h + GAP_PX) / (DOT_SIZE_PX + GAP_PX)));
    setGrid({ cols, rows });
  }, []);

  useEffect(() => {
    buildGrid();
    const ro = new ResizeObserver(buildGrid);
    if (containerRef.current) ro.observe(containerRef.current);
    return () => ro.disconnect();
  }, [buildGrid]);

  useEffect(() => {
    if (grid.cols === 0 || grid.rows === 0) return;
    const raf = requestAnimationFrame(() => {
      const container = containerRef.current;
      if (!container) return;
      const dots = container.querySelectorAll<HTMLDivElement>(".dots-grid-dot");
      dotCentersRef.current = Array.from(dots).map((el) => {
        const r = el.getBoundingClientRect();
        return {
          el,
          x: r.left + window.scrollX + r.width / 2,
          y: r.top + window.scrollY + r.height / 2,
        };
      });
    });
    return () => cancelAnimationFrame(raf);
  }, [grid]);

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      const now = performance.now();
      const { time: lastTime, x: lastX, y: lastY } = lastMoveRef.current;
      const dt = now - lastTime || 16;
      let dx = e.pageX - lastX;
      let dy = e.pageY - lastY;
      let vx = (dx / dt) * 1000;
      let vy = (dy / dt) * 1000;
      let speed = Math.hypot(vx, vy);
      if (speed > MAX_SPEED) {
        const scale = MAX_SPEED / speed;
        vx *= scale;
        vy *= scale;
        speed = MAX_SPEED;
      }
      lastMoveRef.current = { time: now, x: e.pageX, y: e.pageY };

      requestAnimationFrame(() => {
        dotCentersRef.current.forEach(({ el, x, y }) => {
          const dist = Math.hypot(x - e.pageX, y - e.pageY);
          const t = Math.max(0, 1 - dist / THRESHOLD);
          gsap.set(el, { backgroundColor: interpolateColor(t) });

          const inertia = (el as HTMLDivElement & { _inertia?: boolean })._inertia;
          if (speed > SPEED_THRESHOLD && dist < THRESHOLD && !inertia) {
            (el as HTMLDivElement & { _inertia?: boolean })._inertia = true;
            const pushX = (x - e.pageX) + vx * 0.004;
            const pushY = (y - e.pageY) + vy * 0.004;
            gsap.to(el, {
              x: pushX,
              y: pushY,
              duration: 0.15,
              ease: "power2.out",
              onComplete: () => {
                gsap.to(el, {
                  x: 0,
                  y: 0,
                  duration: 1.2,
                  ease: "elastic.out(1, 0.7)",
                  onComplete: () => {
                    (el as HTMLDivElement & { _inertia?: boolean })._inertia = false;
                  },
                });
              },
            });
          }
        });
      });
    };

    const onClick = (e: MouseEvent) => {
      requestAnimationFrame(() => {
        dotCentersRef.current.forEach(({ el, x, y }) => {
          const dist = Math.hypot(x - e.pageX, y - e.pageY);
          const inertia = (el as HTMLDivElement & { _inertia?: boolean })._inertia;
          if (dist < SHOCK_RADIUS && !inertia) {
            (el as HTMLDivElement & { _inertia?: boolean })._inertia = true;
            const falloff = Math.max(0, 1 - dist / SHOCK_RADIUS);
            const pushX = (x - e.pageX) * SHOCK_POWER * falloff;
            const pushY = (y - e.pageY) * SHOCK_POWER * falloff;
            gsap.to(el, {
              x: pushX,
              y: pushY,
              duration: 0.2,
              ease: "power2.out",
              onComplete: () => {
                gsap.to(el, {
                  x: 0,
                  y: 0,
                  duration: 1.2,
                  ease: "elastic.out(1, 0.7)",
                  onComplete: () => {
                    (el as HTMLDivElement & { _inertia?: boolean })._inertia = false;
                  },
                });
              },
            });
          }
        });
      });
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    window.addEventListener("click", onClick);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("click", onClick);
    };
  }, []);

  const total = grid.cols * grid.rows;
  if (total === 0) return null;

  return (
    <div
      ref={containerRef}
      className="dots-background"
      aria-hidden
    >
      <div
        className="dots-container"
        style={{
          gridTemplateColumns: `repeat(${grid.cols}, ${DOT_SIZE_PX}px)`,
          gridTemplateRows: `repeat(${grid.rows}, ${DOT_SIZE_PX}px)`,
          gap: GAP_PX,
        }}
      >
        {Array.from({ length: total }, (_, i) => (
          <div
            key={i}
            className="dots-grid-dot"
            style={{
              width: DOT_SIZE_PX,
              height: DOT_SIZE_PX,
              backgroundColor: COLORS.base,
            }}
          />
        ))}
      </div>
    </div>
  );
}
