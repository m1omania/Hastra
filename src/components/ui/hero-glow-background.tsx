"use client";

import { useCallback, useEffect, useRef } from "react";

/**
 * Фон для hero в духе CodePen Tibixx/xmOaWe:
 * canvas с анимированными градиентными полосами + радиальное свечение + виньетка.
 */
export function HeroGlowBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const bgGlowRef = useRef<HTMLDivElement>(null);

  const md = 100;
  const maxWidth = 15;
  const minWidth = 2;
  const maxSpeed = 35;
  const minSpeed = 6;
  const maxSpeedY = 2.2;
  const minSpeedY = 0.6;
  const hue = 200;
  const hueDif = 65;
  const hueYellow = 52;
  const hueDifYellow = 18;
  const yellowShare = 0.17;
  const glow = 0;
  const saturation = 78;
  const lightness = 58;
  const lightnessYellow = 62;

  const pushDots = useCallback(
    (w: number, h: number) => {
      const maxH = h * 0.9;
      const minH = h * 0.5;
      const dots: { x: number; y: number; h: number; w: number; c: number; m: number; vy: number; s: number; l: number }[] = [];
      for (let i = 1; i < md; i++) {
        const useYellow = Math.random() < yellowShare;
        const dotHue = useYellow
          ? Math.random() * (hueDifYellow * 2) + (hueYellow - hueDifYellow)
          : Math.random() * (hueDif * 2) + (hue - hueDif);
        const dotL = useYellow ? lightnessYellow : lightness;
        const lineH = Math.random() * (maxH - minH) + minH;
        dots.push({
          x: Math.random() * w,
          y: h + Math.random() * (maxH * 0.5),
          h: lineH,
          w: Math.random() * (maxWidth - minWidth) + minWidth,
          c: dotHue,
          s: saturation,
          l: dotL,
          m: Math.random() * (maxSpeed - minSpeed) + minSpeed,
          vy: -(Math.random() * (maxSpeedY - minSpeedY) + minSpeedY),
        });
      }
      return dots;
    },
    []
  );

  useEffect(() => {
    const canvas = canvasRef.current;
    const bgGlow = bgGlowRef.current;
    if (!canvas || !bgGlow) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let w = 0;
    let h = 0;
    let dots: { x: number; y: number; h: number; w: number; c: number; m: number; vy: number; s: number; l: number }[] = [];
    let rafId: number;

    const resize = () => {
      const rect = canvas.parentElement?.getBoundingClientRect();
      if (!rect) return;
      w = rect.width;
      h = rect.height;
      canvas.width = w;
      canvas.height = h;
      dots = pushDots(w, h);
      ctx.globalCompositeOperation = "lighter";
      if (bgGlow) {
        bgGlow.style.background = `radial-gradient(ellipse at center, hsla(${hue},${saturation}%,${lightness}%,0.12) 0%,rgba(0,0,0,0) 70%)`;
      }
    };

    const render = () => {
      if (w === 0 || h === 0) {
        rafId = requestAnimationFrame(render);
        return;
      }
      const angle = Math.PI / 4;
      ctx.clearRect(0, 0, w, h);
      for (let i = 1; i < dots.length; i++) {
        const d = dots[i];
        const cx = d.x + d.w / 2;
        const cy = d.y + d.h / 2;
        ctx.save();
        ctx.translate(cx, cy);
        ctx.rotate(angle);
        ctx.beginPath();
        const grd = ctx.createLinearGradient(-d.w / 2, -d.h / 2, d.w / 2, d.h / 2);
        grd.addColorStop(0, `hsla(${d.c},${d.s}%,${d.l}%,0)`);
        grd.addColorStop(0.2, `hsla(${d.c + 20},${d.s}%,${d.l}%,0.6)`);
        grd.addColorStop(0.5, `hsla(${d.c + 50},${Math.min(90, d.s + 10)}%,${Math.min(70, d.l + 8)}%,0.92)`);
        grd.addColorStop(0.8, `hsla(${d.c + 80},${d.s}%,${d.l}%,0.6)`);
        grd.addColorStop(1, `hsla(${d.c + 100},${d.s}%,${d.l}%,0)`);
        ctx.fillStyle = grd;
        ctx.fillRect(-d.w / 2, -d.h / 2, d.w, d.h);
        ctx.restore();
        d.x += d.m / 100;
        d.y += d.vy;
        if (d.x > w + maxWidth) d.x = -maxWidth;
        if (d.y + d.h < 0) {
          d.y = h + Math.random() * (h * 0.4);
          d.x = Math.random() * w;
        }
      }
      rafId = requestAnimationFrame(render);
    };

    resize();
    rafId = requestAnimationFrame(render);

    const ro = new ResizeObserver(resize);
    ro.observe(canvas.parentElement!);

    return () => {
      ro.disconnect();
      cancelAnimationFrame(rafId);
    };
  }, [pushDots]);

  return (
    <>
      <div
        ref={bgGlowRef}
        className="hero-glow-bg absolute inset-0 z-0"
        aria-hidden
      />
      <canvas
        ref={canvasRef}
        className="hero-glow-canvas absolute inset-0 z-[1] w-full h-full block"
        style={{ width: "100%", height: "100%" }}
        aria-hidden
      />
      <div
        className="hero-glow-overlay absolute inset-0 z-[2] pointer-events-none"
        aria-hidden
      />
    </>
  );
}
