"use client";

/**
 * Частицы разного размера, движение по диагонали, плавное появление и исчезновение.
 * Данные детерминированы по индексу (без random) для совпадения SSR/клиент.
 */
const PARTICLE_COUNT = 28;
const SIZE_CLASSES = ["hero-particle--sm", "hero-particle--md", "hero-particle--lg"] as const;
const COLOR_CLASSES = ["hero-particle--warm", "hero-particle--accent", "hero-particle--soft"] as const;

function getParticleStyle(i: number): { left: string; top: string } {
  const left = 5 + ((i * 13) % 88);
  const top = 8 + ((i * 17) % 82);
  return { left: `${left}%`, top: `${top}%` };
}

export function HeroParticles({ className }: { className?: string }) {
  return (
    <div
      className={`pointer-events-none absolute inset-0 overflow-hidden ${className ?? ""}`.trim()}
      aria-hidden
    >
      {Array.from({ length: PARTICLE_COUNT }, (_, i) => {
        const sizeClass = SIZE_CLASSES[i % SIZE_CLASSES.length];
        const colorClass = COLOR_CLASSES[i % COLOR_CLASSES.length];
        const pulse = i % 3 === 1;
        const { left, top } = getParticleStyle(i);
        const delay = (i * 0.22) % 5;
        return (
          <div
            key={i}
            className={`hero-particle ${sizeClass} ${colorClass}${pulse ? " hero-particle--pulse" : ""}`}
            style={{
              left,
              top,
              animationDelay: pulse ? undefined : `${delay}s`,
              ...(pulse && { ['--hero-particle-drift-delay' as string]: `${delay}s` }),
            }}
          />
        );
      })}
    </div>
  );
}
