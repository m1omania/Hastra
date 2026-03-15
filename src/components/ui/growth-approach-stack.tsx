"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Стопка карточек при скролле — как в Med (quizstart.vue): список с sticky и разными top/z-index,
 * между карточками margin, без обёртки и без спейсера.
 */
const STICKY_TOP_BASE_REM = 16;
const STICKY_TOP_STEP_REM = 2.5;

export function GrowthApproachStack({
  items,
}: {
  items: { title: string; body: string }[];
}) {
  const list = items;
  const refs = useRef<(HTMLLIElement | null)[]>([]);
  const [scales, setScales] = useState<number[]>(() => list.map(() => 1));

  const getStickyTop = (index: number) => {
    const rem = STICKY_TOP_BASE_REM + index * STICKY_TOP_STEP_REM;
    return `${rem}rem`;
  };

  useEffect(() => {
    const cards = refs.current;
    const updateScales = () => {
      const newScales = list.map(() => 1);
      for (let i = 0; i < list.length - 1; i++) {
        const curr = cards[i];
        const next = cards[i + 1];
        if (!curr || !next) continue;
        const r1 = curr.getBoundingClientRect();
        const r2 = next.getBoundingClientRect();
        const overlap =
          r1.height > 0
            ? Math.max(0, Math.min(1, (r1.bottom - r2.top) / r1.height))
            : 0;
        newScales[i] = 1 - 0.08 * overlap;
      }
      setScales(newScales);
    };

    updateScales();
    let rafId = 0;
    const onScroll = () => {
      if (rafId) return;
      rafId = requestAnimationFrame(() => {
        updateScales();
        rafId = 0;
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", updateScales);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", updateScales);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [list.length]);

  return (
    <ul className="growth-approach-stack growth-approach-stack--list relative mt-16 md:mt-20">
      {list.map((item, i) => (
        <li
          key={item.title}
          ref={(el) => {
            refs.current[i] = el;
          }}
          className={`growth-approach-stack__card sticky origin-top min-h-[14rem] flex flex-col justify-center transition-transform duration-200 ${i > 0 ? "mt-6" : ""} ${i === list.length - 1 ? "pb-8" : ""}`}
          style={{ transform: `scale(${scales[i]})`, top: getStickyTop(i), zIndex: 10 + Math.min(i, 8) }}
        >
          <span
            className="growth-approach-stack__card-index !bg-[var(--color-accent)] !text-[#1c2338]"
            style={{ color: "#1c2338" }}
          >
            {String(i + 1).padStart(2, "0")}
          </span>
          <h3 className="growth-approach-stack__card-title">{item.title}</h3>
          <p className="growth-approach-stack__card-body">{item.body}</p>
        </li>
      ))}
    </ul>
  );
}
