"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

const WIDTH_START_PCT = 88;
const WIDTH_END_PCT = 100;
/** Расширение начинается, когда верх блока на 75% высоты экрана от верха (ещё раньше по скроллу). */
const VIEWPORT_START = 0.75;
const VIEWPORT_END = -0.1;

/**
 * При скролле ширина обёртки плавно растёт от WIDTH_START_PCT до 100%.
 * Контент внутри можно держать в фиксированном max-width.
 */
export function ScrollExpandWidth({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const [widthPct, setWidthPct] = useState(WIDTH_START_PCT);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const update = () => {
      const rect = el.getBoundingClientRect();
      const vh = typeof window !== "undefined" ? window.innerHeight : 800;
      const startY = vh * VIEWPORT_START;
      const endY = vh * VIEWPORT_END;
      const t = (startY - rect.top) / (startY - endY);
      const clamped = Math.min(1, Math.max(0, t));
      setWidthPct(WIDTH_START_PCT + (WIDTH_END_PCT - WIDTH_START_PCT) * clamped);
    };

    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  return (
    <div ref={ref} className="mx-auto w-full" style={{ maxWidth: `${widthPct}%` }}>
      {children}
    </div>
  );
}
