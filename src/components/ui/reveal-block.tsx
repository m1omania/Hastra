"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect, useRef, type ReactNode } from "react";

gsap.registerPlugin(ScrollTrigger);

export type RevealVariant = "fadeUp" | "fadeIn" | "fadeUpStagger" | "scaleIn";

const defaultFrom: gsap.TweenVars = {
  opacity: 0,
  y: 32,
};
const defaultTo: gsap.TweenVars = {
  opacity: 1,
  y: 0,
  duration: 0.7,
  ease: "power3.out",
};

interface RevealBlockProps {
  children: ReactNode;
  variant?: RevealVariant;
  delay?: number;
  /** Селектор дочерних элементов для stagger (для fadeUpStagger) */
  staggerSelector?: string;
  staggerDelay?: number;
  /** Отступ от viewport для срабатывания (0–1 или "top bottom") */
  start?: string | number;
  className?: string;
}

export function RevealBlock({
  children,
  variant = "fadeUp",
  delay = 0,
  staggerSelector,
  staggerDelay = 0.08,
  start = "top 85%",
  className,
}: RevealBlockProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const from: gsap.TweenVars = { ...defaultFrom };
    const to: gsap.TweenVars = { ...defaultTo, delay, overwrite: true };

    if (variant === "fadeIn") {
      from.y = 0;
    }
    if (variant === "scaleIn") {
      from.y = 0;
      (from as Record<string, unknown>).scale = 0.96;
      (to as Record<string, unknown>).scale = 1;
    }

    const startStr = typeof start === "number" ? `top ${(1 - start) * 100}%` : start;

    if (variant === "fadeUpStagger" && staggerSelector) {
      const targets = el.querySelectorAll(staggerSelector);
      if (targets.length) {
        gsap.set(targets, { opacity: 0, y: 24 });
        const tween = gsap.to(targets, {
          opacity: 1,
          y: 0,
          duration: 0.6,
          ease: "power3.out",
          stagger: staggerDelay,
          delay,
          scrollTrigger: {
            trigger: el,
            start: startStr,
            toggleActions: "play none none none",
          },
        });
        return () => {
          tween.scrollTrigger?.kill();
          tween.kill();
        };
      }
    }

    gsap.set(el, from);
    const tween = gsap.to(el, {
      ...to,
      scrollTrigger: {
        trigger: el,
        start: startStr,
        toggleActions: "play none none none",
      },
    });

    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, [variant, delay, staggerSelector, staggerDelay, start]);

  return (
    <div ref={ref} className={className ?? undefined}>
      {children}
    </div>
  );
}
