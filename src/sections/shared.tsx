import type {
  CaseCollectionSection,
  FAQSection,
  LeadCaptureSection,
  TestimonialsSection,
} from "@/types/content";

import { Container } from "@/components/layout/container";
import { ButtonLink } from "@/components/ui/button-link";
import { CaseGalleryCenterMode } from "@/components/ui/case-gallery-center";
import { SectionHeading } from "@/components/ui/section-heading";
import { SurfaceCard } from "@/components/ui/surface-card";

export function CaseCollectionSectionView({
  section,
}: {
  section: CaseCollectionSection;
}) {
  return (
    <section id={section.id} className="section-space section-bg-white">
      <Container>
        <CaseGalleryCenterMode
          cases={section.data.cases}
          title={section.data.title}
          eyebrow={section.data.eyebrow}
          description={section.data.description}
        />
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
      <Container className="space-y-10">
        <SectionHeading
          eyebrow={section.data.eyebrow}
          title={section.data.title}
          description={section.data.description}
        />

        <div className="grid gap-6 lg:grid-cols-3">
          {section.data.reviews.map((review) => (
            <SurfaceCard key={`${review.name}-${review.company}`} className="h-full border-2 border-[var(--color-primary)]/10 bg-white shadow-md">
              <p className="text-sm leading-7 text-[var(--color-muted)]">
                “{review.quote}”
              </p>
              <div className="mt-8 border-t border-[var(--color-primary)]/15 pt-5">
                <p className="font-semibold text-[var(--color-foreground)]">{review.name}</p>
                <p className="mt-1 text-sm text-[var(--color-muted)]">
                  {review.company} · {review.role}
                </p>
              </div>
            </SurfaceCard>
          ))}
        </div>
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
