"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect, useRef } from "react";

gsap.registerPlugin(ScrollTrigger);

export function FocusTextPanelAnimated({ lines }: { lines: string[] }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const targets = el.querySelectorAll(".focus-text-panel__word");
    if (!targets.length) return;

    gsap.set(targets, { color: "#ffffff" });
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: el,
        start: "top 82%",
        end: `+=${Math.max(700, targets.length * 26)}`,
        scrub: 0.7,
        invalidateOnRefresh: true,
      },
    });

    targets.forEach((node, i) => {
      tl.to(
        node,
        { color: "var(--color-accent)", duration: 0.2, ease: "power2.out" },
        i * 0.03,
      );
    });

    return () => {
      tl.scrollTrigger?.kill();
      tl.kill();
    };
  }, [lines]);

  return (
    <div ref={ref} className="partner-problems-ladder space-y-4 text-left text-white">
      {lines.map((line, i) => {
        const words = line.trim().split(/\s+/);
        return (
          <p key={i} className="partner-problems-ladder__text">
            {words.map((word, wordIndex) => (
              <span key={`${i}-${wordIndex}`} className="focus-text-panel__word">
                {word}
                {wordIndex < words.length - 1 ? " " : ""}
              </span>
            ))}
          </p>
        );
      })}
    </div>
  );
}
