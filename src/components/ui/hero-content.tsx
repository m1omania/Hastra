"use client";

import gsap from "gsap";
import { useEffect, useRef, type ReactNode } from "react";

export function HeroContent({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const title = el.querySelector("[data-hero-title]");
    const desc = el.querySelector("[data-hero-desc]");
    const actions = el.querySelector("[data-hero-actions]");

    const from = { opacity: 0, y: 28 };
    const to = { opacity: 1, y: 0, duration: 0.85, ease: "power3.out" };

    [title, desc, actions].forEach((node) => node && gsap.set(node, from));

    const tl = gsap.timeline({ defaults: to });
    if (title) tl.to(title, { ...to, delay: 0.2 });
    if (desc) tl.to(desc, { ...to, delay: 0.15 }, "<");
    if (actions) tl.to(actions, { ...to, delay: 0.15 }, "<");

    return () => tl.kill();
  }, []);

  return <div ref={ref}>{children}</div>;
}
