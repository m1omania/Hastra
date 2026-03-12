import type {
  CaseHeroSection,
  CaseResultsSection,
  CaseStorySection,
} from "@/types/content";

import { Container } from "@/components/layout/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { SurfaceCard } from "@/components/ui/surface-card";

export function CaseHeroSectionView({ section }: { section: CaseHeroSection }) {
  return (
    <section className="section-space pt-18 sm:pt-24">
      <Container className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
        <div>
          <p className="text-sm uppercase tracking-[0.18em] text-[var(--color-muted)]">
            {section.data.client}
          </p>
          <h1 className="mt-4 font-display text-5xl font-semibold leading-none tracking-tight text-white sm:text-6xl">
            {section.data.title}
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-[var(--color-muted)]">
            {section.data.summary}
          </p>
        </div>

        <SurfaceCard className="grid gap-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl bg-white/5 p-5">
              <p className="text-xs uppercase tracking-[0.2em] text-[var(--color-muted)]">
                Ниша
              </p>
              <p className="mt-2 text-lg text-white">{section.data.industry}</p>
            </div>
            <div className="rounded-2xl bg-white/5 p-5">
              <p className="text-xs uppercase tracking-[0.2em] text-[var(--color-muted)]">
                Длительность
              </p>
              <p className="mt-2 text-lg text-white">{section.data.duration}</p>
            </div>
          </div>

          <div className="rounded-2xl bg-white/5 p-5">
            <p className="text-xs uppercase tracking-[0.2em] text-[var(--color-muted)]">
              Стек работ
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              {section.data.services.map((service) => (
                <span
                  key={service}
                  className="rounded-full border border-white/10 px-3 py-1 text-xs uppercase tracking-[0.14em] text-white"
                >
                  {service}
                </span>
              ))}
            </div>
          </div>
        </SurfaceCard>
      </Container>
    </section>
  );
}

export function CaseStorySectionView({ section }: { section: CaseStorySection }) {
  return (
    <section className="section-space">
      <Container className="space-y-10">
        <SectionHeading eyebrow={section.data.eyebrow} title={section.data.title} />

        <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <SurfaceCard>
            <p className="text-xs uppercase tracking-[0.24em] text-[var(--color-accent)]">
              Задача
            </p>
            <p className="mt-4 text-sm leading-7 text-white">{section.data.challenge}</p>
          </SurfaceCard>

          <div className="grid gap-6 md:grid-cols-2">
            <SurfaceCard>
              <p className="text-xs uppercase tracking-[0.24em] text-[var(--color-accent)]">
                Стратегия
              </p>
              <div className="mt-4 grid gap-3">
                {section.data.strategy.map((item) => (
                  <p key={item} className="text-sm leading-7 text-[var(--color-muted)]">
                    {item}
                  </p>
                ))}
              </div>
            </SurfaceCard>

            <SurfaceCard>
              <p className="text-xs uppercase tracking-[0.24em] text-[var(--color-accent)]">
                Реализация
              </p>
              <div className="mt-4 grid gap-3">
                {section.data.execution.map((item) => (
                  <p key={item} className="text-sm leading-7 text-[var(--color-muted)]">
                    {item}
                  </p>
                ))}
              </div>
            </SurfaceCard>
          </div>
        </div>
      </Container>
    </section>
  );
}

export function CaseResultsSectionView({
  section,
}: {
  section: CaseResultsSection;
}) {
  return (
    <section className="section-space">
      <Container className="space-y-10">
        <SectionHeading
          eyebrow={section.data.eyebrow}
          title={section.data.title}
          description={section.data.description}
        />

        <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="grid gap-4">
            {section.data.metrics.map((metric) => (
              <SurfaceCard key={metric.label}>
                <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                  <div>
                    <p className="text-xs uppercase tracking-[0.2em] text-[var(--color-muted)]">
                      {metric.label}
                    </p>
                    <p className="mt-2 font-display text-4xl font-semibold text-white">
                      {metric.after}
                    </p>
                  </div>
                  {metric.before ? (
                    <p className="text-sm text-[var(--color-muted)]">До старта: {metric.before}</p>
                  ) : null}
                </div>
                <p className="mt-4 text-sm leading-7 text-[var(--color-muted)]">
                  {metric.impact}
                </p>
              </SurfaceCard>
            ))}
          </div>

          <SurfaceCard className="h-full">
            <p className="text-xs uppercase tracking-[0.24em] text-[var(--color-accent)]">
              Business takeaway
            </p>
            <div className="mt-4 grid gap-4">
              {section.data.outcomes.map((item) => (
                <p key={item} className="text-sm leading-7 text-[var(--color-muted)]">
                  {item}
                </p>
              ))}
            </div>
          </SurfaceCard>
        </div>
      </Container>
    </section>
  );
}
