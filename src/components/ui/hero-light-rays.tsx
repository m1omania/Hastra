"use client";

/** Округление для одинакового SSR/клиент рендера (избегаем hydration mismatch из-за float) */
function r(n: number, decimals = 2): number {
  const k = 10 ** decimals;
  return Math.round(n * k) / k;
}

/**
 * Видимые лучи света из правого верхнего угла hero-секции.
 */
export function HeroLightRays({ className }: { className?: string }) {
  const rayCount = 7;
  const spreadDeg = 90;
  // Углы от «вниз» (90°) до «влево» (180°) — лучи из правого верхнего угла идут вниз-влево
  const startAngle = 90;
  const angleStep = spreadDeg / (rayCount - 1);

  return (
    <div
      className={`pointer-events-none absolute inset-0 overflow-hidden ${className ?? ""}`.trim()}
      aria-hidden
    >
      <svg
        className="absolute right-0 top-0 h-full min-h-[100vh] w-full min-w-[120%] [filter:blur(18px)]"
        viewBox="0 0 200 120"
        preserveAspectRatio="xMaxYMin meet"
      >
        <defs>
          {/* Градиент от источника (справа сверху) вниз-влево — в координатах viewBox */}
          {/* Основные лучи: тёплый свет с лёгким оттенком */}
          <linearGradient
            id="hero-ray-gradient"
            x1="220"
            y1="-20"
            x2="-20"
            y2="140"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0%" stopColor="#fff8eb" stopOpacity="0.08" />
            <stop offset="30%" stopColor="#fff5e0" stopOpacity="0.035" />
            <stop offset="60%" stopColor="#fffaf2" stopOpacity="0.012" />
            <stop offset="100%" stopColor="#fff" stopOpacity="0" />
          </linearGradient>
          {/* Акцентные лучи: мягкий жёлтый/янтарный */}
          <linearGradient
            id="hero-ray-accent"
            x1="220"
            y1="-20"
            x2="-20"
            y2="140"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0%" stopColor="#fbd701" stopOpacity="0.045" />
            <stop offset="40%" stopColor="#f5d040" stopOpacity="0.02" />
            <stop offset="100%" stopColor="#fbd701" stopOpacity="0" />
          </linearGradient>
        </defs>
        {Array.from({ length: rayCount }, (_, i) => {
          const angle1 = (startAngle + angleStep * i) * (Math.PI / 180);
          const angle2 = (startAngle + angleStep * (i + 0.65)) * (Math.PI / 180);
          const radius = 320;
          const x0 = 210;
          const y0 = -15;
          const x1 = r(x0 + radius * Math.cos(angle1));
          const y1 = r(y0 + radius * Math.sin(angle1));
          const x2 = r(x0 + radius * Math.cos(angle2));
          const y2 = r(y0 + radius * Math.sin(angle2));
          const d = `M ${x0} ${y0} L ${x1} ${y1} L ${x2} ${y2} Z`;
          return (
            <g key={i} className="hero-light-ray-wrap" style={{ animationDelay: `${i * 0.95}s` }}>
              <path
                d={d}
                fill="url(#hero-ray-gradient)"
                className="hero-light-ray"
              />
            </g>
          );
        })}
        {Array.from({ length: 4 }, (_, i) => {
          const angle1 = (startAngle + angleStep * (i * 1.8)) * (Math.PI / 180);
          const angle2 = (startAngle + angleStep * (i * 1.8 + 0.5)) * (Math.PI / 180);
          const radius = 280;
          const x0 = 210;
          const y0 = -15;
          const x1 = r(x0 + radius * Math.cos(angle1));
          const y1 = r(y0 + radius * Math.sin(angle1));
          const x2 = r(x0 + radius * Math.cos(angle2));
          const y2 = r(y0 + radius * Math.sin(angle2));
          const d = `M ${x0} ${y0} L ${x1} ${y1} L ${x2} ${y2} Z`;
          return (
            <g key={`accent-${i}`} className="hero-light-ray-wrap hero-light-ray-wrap--accent" style={{ animationDelay: `${(i + 7) * 0.7}s` }}>
              <path
                d={d}
                fill="url(#hero-ray-accent)"
                className="hero-light-ray hero-light-ray--accent"
              />
            </g>
          );
        })}
      </svg>
    </div>
  );
}
