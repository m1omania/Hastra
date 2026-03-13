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
  /**
   * При fadeUpStagger: анимация привязана к скроллу (предложения по одному пока крутишь).
   * Число — сглаживание scrub (0.3–1). true → 0.55.
   */
  scrub?: number | boolean;
  /** Длина «дорожки» скролла для scrub (px), по умолчанию от числа элементов */
  scrubScrollPx?: number;
  /** При scrub: цвет предложения при появлении (например жёлтый). */
  staggerFromColor?: string;
  /** При scrub: цвет после перехода (по умолчанию белый). */
  staggerToColor?: string;
}

export function RevealBlock({
  children,
  variant = "fadeUp",
  delay = 0,
  staggerSelector,
  staggerDelay = 0.08,
  start = "top 85%",
  className,
  scrub,
  scrubScrollPx,
  staggerFromColor,
  staggerToColor = "#ffffff",
}: RevealBlockProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const refreshSoon = () => {
      requestAnimationFrame(() => ScrollTrigger.refresh());
      const t = window.setTimeout(() => ScrollTrigger.refresh(), 200);
      return () => window.clearTimeout(t);
    };
    const cancelRefresh = refreshSoon();

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
        const initialColor = staggerFromColor ?? undefined;
        const onlyColorTransition = initialColor != null && scrub !== undefined && scrub !== false;
        const revealColor = staggerToColor;
        gsap.set(
          targets,
          onlyColorTransition
            ? { opacity: 1, y: 0, color: revealColor }
            : { opacity: 0, y: 24, ...(initialColor && { color: initialColor }) },
        );

        if (scrub !== undefined && scrub !== false) {
          const endDistance =
            scrubScrollPx ?? Math.min(1400, Math.max(480, targets.length * 100));
          const n = targets.length;
          const yellow = initialColor ?? "#fbd701";
          const white = staggerToColor;

          if (onlyColorTransition) {
            // Белый по умолчанию; жёлтым только текущее предложение; при переходе к следующему предыдущее снова белое
            const applyColors = (progress: number) => {
              const currentIndex = Math.max(-1, Math.min(n - 1, Math.floor(progress * n - 0.5)));
              targets.forEach((node, i) => {
                (node as HTMLElement).style.color = i === currentIndex ? yellow : white;
              });
            };
            const st = ScrollTrigger.create({
              trigger: el,
              start: startStr,
              end: `+=${endDistance}`,
              onUpdate: (self) => applyColors(self.progress),
              invalidateOnRefresh: true,
            });
            ScrollTrigger.refresh();
            applyColors(st.progress);
            return () => {
              cancelRefresh();
              st.kill();
            };
          }

          const scrubAmount = scrub === true ? 0.55 : Number(scrub);
          const tl = gsap.timeline({
            scrollTrigger: {
              trigger: el,
              start: startStr,
              end: `+=${endDistance}`,
              scrub: scrubAmount,
              invalidateOnRefresh: true,
            },
          });
          targets.forEach((node, i) => {
            const startPos = i * 0.12;
            tl.to(
              node,
              { opacity: 1, y: 0, duration: 0.35, ease: "power2.out" },
              startPos,
            );
            if (staggerFromColor) {
              tl.to(
                node,
                { color: staggerToColor, duration: 0.25, ease: "power2.out" },
                startPos + 0.18,
              );
            }
          });
          return () => {
            cancelRefresh();
            tl.scrollTrigger?.kill();
            tl.kill();
          };
        }

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
            invalidateOnRefresh: true,
          },
        });
        return () => {
          cancelRefresh();
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
        invalidateOnRefresh: true,
      },
    });

    return () => {
      cancelRefresh();
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, [variant, delay, staggerSelector, staggerDelay, start, scrub, scrubScrollPx, staggerFromColor, staggerToColor]);

  return (
    <div ref={ref} className={className ?? undefined}>
      {children}
    </div>
  );
}
