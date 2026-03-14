import type {
  CaseCollectionSection,
  CaseSummary,
  FAQSection,
  LeadCaptureSection,
  TestimonialsSection,
} from "@/types/content";

import Link from "next/link";

import { Container } from "@/components/layout/container";
import { AnimatedMetricValue } from "@/components/ui/animated-metric-value";
import { ButtonLink } from "@/components/ui/button-link";
import { CaseGalleryCenterMode } from "@/components/ui/case-gallery-center";
import { RevealBlock } from "@/components/ui/reveal-block";
import { SectionHeading } from "@/components/ui/section-heading";
import { SurfaceCard } from "@/components/ui/surface-card";
import { TestimonialsSliderWithHeader } from "@/components/ui/testimonials-slider";

/** Карточка кейса для сетки 3-2-3 (тот же контент, что в галерее) */
function CaseGridCard({ item, className }: { item: CaseSummary; className?: string }) {
  const renderMetricValue = (rawValue: string) => {
    const trimmed = rawValue.trim();
    const isPositive = trimmed.startsWith("+");
    const isNegative = trimmed.startsWith("-");
    const numericValue = (isPositive || isNegative) ? trimmed.slice(1) : trimmed;

    return (
      <span className="inline-flex items-center gap-1.5">
        {isPositive ? (
          <span className="text-[0.85em] leading-none text-[var(--color-accent)]" aria-hidden>
            ▲
          </span>
        ) : null}
        {isNegative ? (
          <span className="text-[0.85em] leading-none text-[var(--color-accent)]" aria-hidden>
            ▼
          </span>
        ) : null}
        <AnimatedMetricValue value={numericValue} />
      </span>
    );
  };

  return (
    <Link
      href={item.href ?? `/cases/${item.slug}`}
      data-case-card
      className={`case-grid__card group flex min-h-[320px] flex-col overflow-hidden rounded-2xl border border-[#303266] bg-white p-0 transition-transform duration-300 ease-out hover:scale-[1.02] sm:min-h-[360px] ${className ?? ""}`.trim()}
    >
      <div className="flex-1 bg-white p-8 sm:p-9">
        <h3 className="font-display text-xl font-semibold text-[#111]">{item.title}</h3>
        <p className="mt-3 text-sm leading-7 text-[#333] line-clamp-3">{item.excerpt}</p>
      </div>
      <div className="mt-auto w-full bg-[var(--color-primary)] px-8 py-6 sm:px-9 min-h-[130px] sm:min-h-[140px]">
        <div className="flex h-full flex-col justify-center gap-2.5">
        {item.metrics.slice(0, 2).map((m) => (
          <div key={m.label} className="text-[var(--color-accent)]">
            <span className="text-2xl font-semibold sm:text-[1.8rem]">{renderMetricValue(m.value)}</span>
            <span className="ml-1.5 text-sm font-medium text-white/90">{m.label}</span>
          </div>
        ))}
        </div>
      </div>
    </Link>
  );
}

/** Сетка кейсов: ряд 1 — 3, ряд 2 — 2, ряд 3 — 2 карточки + ячейка «Смотреть все» */
function CaseCollectionGrid332({ cases }: { cases: CaseSummary[] }) {
  const list = cases.slice(0, 7);
  return (
    <div className="case-grid">
      <div className="case-grid__row case-grid__row--3">
        {list.slice(0, 3).map((item) => (
          <CaseGridCard key={item.slug} item={item} />
        ))}
      </div>
      <div className="case-grid__row case-grid__row--2">
        {list.slice(3, 5).map((item) => (
          <CaseGridCard key={item.slug} item={item} />
        ))}
      </div>
      <div className="case-grid__row case-grid__row--3">
        {list.slice(5, 7).map((item) => (
          <CaseGridCard key={item.slug} item={item} />
        ))}
        <Link
          href="/cases"
          data-case-card
          className="case-grid__view-all group flex min-h-[320px] flex-col items-center justify-center rounded-2xl border border-[#303266] bg-white p-8 text-black transition-transform transition-colors duration-300 ease-out hover:scale-[1.02] hover:bg-neutral-50 sm:min-h-[360px] sm:p-9"
        >
          <span className="font-display text-xl font-semibold text-[#111]">Смотреть все</span>
          <span className="mt-3 inline-flex text-2xl leading-none text-[var(--color-accent)] transition-transform duration-300 ease-out group-hover:translate-x-1" aria-hidden>
            →
          </span>
        </Link>
      </div>
    </div>
  );
}

export function CaseCollectionSectionView({
  section,
}: {
  section: CaseCollectionSection;
}) {
  const isGrid332 = section.data.layout === "grid332";

  return (
    <section
      id={section.id}
      className={`section-space section-bg-white ${isGrid332 ? "section-cases" : ""}`.trim()}
    >
      <Container>
        {isGrid332 ? (
          <>
            <SectionHeading
              eyebrow={section.data.eyebrow}
              title={section.data.title}
              description={section.data.description}
              align="center"
            />
            <RevealBlock variant="fadeUpStagger" staggerSelector="[data-case-card]" staggerDelay={0.12} start="top 86%">
              <CaseCollectionGrid332 cases={section.data.cases} />
            </RevealBlock>
          </>
        ) : (
          <CaseGalleryCenterMode
            cases={section.data.cases}
            title={section.data.title}
            eyebrow={section.data.eyebrow}
            description={section.data.description}
          />
        )}
      </Container>
    </section>
  );
}

export function TestimonialsSectionView({
  section,
}: {
  section: TestimonialsSection;
}) {
  return (
    <section id={section.id} className="section-space section-bg-white">
      <Container>
        <TestimonialsSliderWithHeader
          title={section.data.title}
          description={section.data.description}
          reviews={section.data.reviews}
        />
      </Container>
    </section>
  );
}

export function FaqSectionView({ section }: { section: FAQSection }) {
  return (
    <section id={section.id} className="section-space">
      <Container className="space-y-10">
        <SectionHeading
          eyebrow={section.data.eyebrow}
          title={section.data.title}
          description={section.data.description}
        />

        <div className="grid gap-4">
          {section.data.items.map((item) => (
            <SurfaceCard key={item.question}>
              <h3 className="text-lg font-semibold text-white">{item.question}</h3>
              <p className="mt-3 text-sm leading-7 text-[var(--color-muted)]">
                {item.answer}
              </p>
            </SurfaceCard>
          ))}
        </div>
      </Container>
    </section>
  );
}

export function LeadCaptureSectionView({
  section,
}: {
  section: LeadCaptureSection;
}) {
  return (
    <section id="lead" className="section-space">
      <Container>
        <SurfaceCard className="overflow-hidden p-0">
          <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="space-y-6 p-8 lg:p-10">
              <SectionHeading
                eyebrow={section.data.eyebrow}
                title={section.data.title}
                description={section.data.description}
              />

              <div className="grid gap-3">
                {section.data.checklist.map((item) => (
                  <div
                    key={item}
                    className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white"
                  >
                    {item}
                  </div>
                ))}
              </div>

              <ButtonLink href={section.data.primaryCta.href} intent={section.data.primaryCta.intent}>
                {section.data.primaryCta.label}
              </ButtonLink>
            </div>

            <div className="border-t border-white/10 bg-[linear-gradient(180deg,rgba(15,23,42,0.72),rgba(8,15,30,0.95))] p-8 lg:border-l lg:border-t-0 lg:p-10">
              <div className="rounded-[1.75rem] border border-white/10 bg-slate-950/40 p-6">
                <p className="text-xs uppercase tracking-[0.24em] text-[var(--color-accent)]">
                  Prototype Form
                </p>
                <div className="mt-6 grid gap-4">
                  {["Имя", "Компания", "Телефон или email"].map((label) => (
                    <label key={label} className="grid gap-2 text-sm text-[var(--color-muted)]">
                      {label}
                      <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white/70">
                        Поле формы
                      </div>
                    </label>
                  ))}
                </div>
                <p className="mt-6 text-sm leading-6 text-[var(--color-muted)]">
                  {section.data.note}
                </p>
              </div>
            </div>
          </div>
        </SurfaceCard>
      </Container>
    </section>
  );
}
