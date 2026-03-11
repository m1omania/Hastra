import type {
  DeliverablesSection,
  PainPointsSection,
  ProcessSection,
  ServiceHeroSection,
} from "@/types/content";

import { Container } from "@/components/layout/container";
import { ButtonLink } from "@/components/ui/button-link";
import { SectionHeading } from "@/components/ui/section-heading";
import { SurfaceCard } from "@/components/ui/surface-card";

export function ServiceHeroSectionView({
  section,
}: {
  section: ServiceHeroSection;
}) {
  return (
    <section className="section-space pt-18 sm:pt-24">
      <Container>
        <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--color-accent)]">
              {section.data.eyebrow}
            </p>
            <h1 className="mt-5 max-w-4xl font-display text-5xl font-semibold leading-none tracking-tight text-white sm:text-6xl">
              {section.data.title}
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-[var(--color-muted)]">
              {section.data.description}
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <ButtonLink href={section.data.primaryCta.href} intent={section.data.primaryCta.intent}>
                {section.data.primaryCta.label}
              </ButtonLink>
              <ButtonLink
                href={section.data.secondaryCta.href}
                intent={section.data.secondaryCta.intent}
              >
                {section.data.secondaryCta.label}
              </ButtonLink>
            </div>
          </div>

          <SurfaceCard className="grid gap-4">
            {section.data.stats.map((stat) => (
              <div key={stat.label} className="rounded-2xl border border-white/10 bg-white/5 p-5">
                <p className="font-display text-3xl font-semibold text-white">{stat.value}</p>
                <p className="mt-2 text-xs uppercase tracking-[0.2em] text-[var(--color-muted)]">
                  {stat.label}
                </p>
              </div>
            ))}
          </SurfaceCard>
        </div>
      </Container>
    </section>
  );
}

export function PainPointsSectionView({
  section,
}: {
  section: PainPointsSection;
}) {
  return (
    <section className="section-space">
      <Container className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
        <SurfaceCard className="h-full">
          <SectionHeading
            eyebrow={section.data.eyebrow}
            title={section.data.title}
            description={section.data.description}
          />
          <p className="mt-8 rounded-3xl border border-[var(--color-accent)]/20 bg-[var(--color-accent)]/8 p-5 text-sm leading-7 text-white">
            {section.data.opportunity}
          </p>
        </SurfaceCard>

        <div className="grid gap-4">
          {section.data.painPoints.map((item) => (
            <SurfaceCard key={item}>
              <p className="text-sm leading-7 text-white">{item}</p>
            </SurfaceCard>
          ))}
        </div>
      </Container>
    </section>
  );
}

export function DeliverablesSectionView({
  section,
}: {
  section: DeliverablesSection;
}) {
  return (
    <section className="section-space">
      <Container className="space-y-10">
        <SectionHeading
          eyebrow={section.data.eyebrow}
          title={section.data.title}
          description={section.data.description}
        />

        <div className="grid gap-6 md:grid-cols-2">
          {section.data.deliverables.map((item) => (
            <SurfaceCard key={item.title}>
              <h3 className="font-display text-2xl font-semibold text-white">{item.title}</h3>
              <p className="mt-4 text-sm leading-7 text-[var(--color-muted)]">
                {item.description}
              </p>
            </SurfaceCard>
          ))}
        </div>
      </Container>
    </section>
  );
}

export function ProcessSectionView({ section }: { section: ProcessSection }) {
  return (
    <section className="section-space">
      <Container className="space-y-10">
        <SectionHeading
          eyebrow={section.data.eyebrow}
          title={section.data.title}
          description={section.data.description}
        />

        <div className="grid gap-6 lg:grid-cols-4">
          {section.data.steps.map((step, index) => (
            <SurfaceCard key={step.title}>
              <p className="text-xs uppercase tracking-[0.24em] text-[var(--color-accent)]">
                Шаг {index + 1}
              </p>
              <h3 className="mt-4 font-display text-2xl font-semibold text-white">
                {step.title}
              </h3>
              <p className="mt-3 text-sm leading-7 text-[var(--color-muted)]">
                {step.description}
              </p>
            </SurfaceCard>
          ))}
        </div>
      </Container>
    </section>
  );
}
