"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Стопка карточек при скролле — как в Med (quizstart.vue): список с sticky и разными top/z-index,
 * между карточками margin, без обёртки и без спейсера.
 */
const STICKY_TOPS = ["top-6 md:top-8", "top-14 md:top-16", "top-20 md:top-24", "top-28 md:top-32"];
const Z_INDICES = ["z-10", "z-20", "z-30", "z-40"];

export function GrowthApproachStack({
  items,
}: {
  items: { title: string; body: string }[];
}) {
  const list = items.slice(0, 4);
  const refs = useRef<(HTMLLIElement | null)[]>([]);
  const [scales, setScales] = useState<number[]>(() => list.map(() => 1));

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
          className={`growth-approach-stack__card sticky origin-top min-h-[14rem] flex flex-col justify-center transition-transform duration-200 ${STICKY_TOPS[i]} ${Z_INDICES[i]} ${i > 0 ? "mt-6" : ""} ${i === list.length - 1 ? "pb-8" : ""}`}
          style={{ transform: `scale(${scales[i]})` }}
        >
          <h3 className="growth-approach-stack__card-title">{item.title}</h3>
          <span className="growth-approach-stack__card-line" aria-hidden />
          <p className="growth-approach-stack__card-body">{item.body}</p>
        </li>
      ))}
    </ul>
  );
}
