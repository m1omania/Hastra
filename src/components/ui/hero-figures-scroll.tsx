"use client";

import { useEffect, useRef, type ReactNode } from "react";

/**
 * Слой с фигурами hero: при скролле только этот слой сдвигается за край экрана, фон остаётся на месте.
 */
const SCROLL_RANGE_PX = 600;
const MOVE_X_PERCENT = 100;
const MOVE_Y_PERCENT = -55;

export function HeroFiguresScroll({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const onScroll = () => {
      const y = typeof window !== "undefined" ? window.scrollY : 0;
      const t = Math.min(1, y / SCROLL_RANGE_PX);
      const ease = 1 - (1 - t) ** 2;
      const x = (ease * MOVE_X_PERCENT).toFixed(1);
      const vy = (ease * MOVE_Y_PERCENT).toFixed(1);
      el.style.transform = `translate(${x}%, ${vy}%)`;
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div ref={ref} className="hero-figures transition-transform duration-150 ease-out">
      {children}
    </div>
  );
}
