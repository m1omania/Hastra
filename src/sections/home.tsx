import Image from "next/image";
import Link from "next/link";
import type {
  HomeAdvantageGridSection,
  HomeAdvantagesWorkSection,
  HomeAgencyOverviewSection,
  HomeApproachSection,
  HomeCitiesSection,
  HomeFeatureNarrativeSection,
  HomeFeaturedCaseSection,
  HomeFocusCardSection,
  HomeFocusTextPanelSection,
  HomeForecastSection,
  HomeGrowthApproachSection,
  HomeHeroSection,
  HomeIndustriesSection,
  HomePartnersSection,
  HomePartnerProblemsSection,
  HomePricingSection,
  HomeProblemQuizSection,
  HomeProcessSection,
  HomeReasonsSection,
  HomeSeoIntroSection,
  HomeWorkBreakdownSection,
  ServiceCollectionSection,
  TrustPanelSection,
  HomeCostItemsSection,
} from "@/types/content";

import { Container } from "@/components/layout/container";
import { ButtonLink } from "@/components/ui/button-link";
import { HeroAvatarStageWebGL } from "@/components/ui/hero-avatar-stage-webgl";
import { HeroContent } from "@/components/ui/hero-content";
import { HeroFiguresScroll } from "@/components/ui/hero-figures-scroll";
import { HeroParticles } from "@/components/ui/hero-particles";
import { FocusTextPanelAnimated } from "@/components/ui/focus-text-panel-animated";
import { GrowthApproachStack } from "@/components/ui/growth-approach-stack";
import { ProblemQuizBlock } from "@/components/ui/problem-quiz-block";
import { CitiesMapOverlay } from "@/components/ui/cities-map-overlay";
import { ScrollExpandWidth } from "@/components/ui/scroll-expand-width";
import { RevealBlock } from "@/components/ui/reveal-block";
import { SectionHeading } from "@/components/ui/section-heading";
import { SurfaceCard } from "@/components/ui/surface-card";

const HERO_DESCRIPTION_SPLIT = " клиентов";

function HeroInlineLogoRibbon({ logos }: { logos: { name: string; src?: string }[] }) {
  const duplicated = [...logos, ...logos];
  return (
    <span className="hero-inline-logos align-middle">
      <span className="hero-inline-logos-track">
        {duplicated.map((logo, i) => (
          <span key={`${logo.name}-${i}`} className="hero-inline-logo">
            {logo.src ? (
              <Image
                src={logo.src}
                alt={logo.name}
                width={64}
                height={28}
                className="h-6 w-auto max-w-12 object-contain object-center opacity-80"
              />
            ) : (
              <span className="text-xs font-medium text-neutral-500">{logo.name}</span>
            )}
          </span>
        ))}
      </span>
    </span>
  );
}

/** Копия блока с фигурами hero — статичный блок (без fixed, без scroll-анимации). compact: меньшая высота для вставки в блок услуг. */
export function HeroFiguresBlock({ compact }: { compact?: boolean } = {}) {
  return (
    <section
      className={`relative w-full overflow-hidden ${compact ? "min-h-[380px] bg-transparent" : "min-h-[70vh] flex justify-center"}`}
      aria-hidden
    >
      <div
        className={`hero-figures-block absolute top-0 bottom-0 w-full ${compact ? "hero-figures-block--no-bg left-1/2 -translate-x-1/2 max-w-4xl" : "left-1/2 -translate-x-1/2 max-w-7xl"}`}
      >
        <div className="hero-backdrop__bg absolute inset-0">
          {!compact && <HeroParticles className="absolute inset-0" />}
        </div>
        <div className="hero-figures absolute inset-0">
          <HeroAvatarStageWebGL className="absolute inset-0 w-full h-full" transparentBackground />
        </div>
      </div>
    </section>
  );
}

export function HomeHeroSectionView({ section }: { section: HomeHeroSection }) {
  return (
    <section className="relative section-space pt-18 pb-16 sm:pt-24 sm:pb-20 lg:pt-28 lg:pb-20 min-h-[100vh] flex items-center">
      {/* Один фиксированный контейнер: подложка (лучи, частицы) + слой фигур поверх */}
      <div className="hero-backdrop">
        <div className="hero-backdrop__bg">
          <HeroParticles className="absolute inset-0" />
        </div>
        <HeroFiguresScroll>
          <HeroAvatarStageWebGL className="absolute inset-0 w-full h-full" transparentBackground />
        </HeroFiguresScroll>
      </div>
      <Container className="relative z-10">
        <div className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr] lg:items-center lg:gap-12">
          <HeroContent>
            <div className="max-w-3xl space-y-8 text-left">
              <h1
                data-hero-title
                className="font-display text-4xl font-semibold lowercase leading-tight tracking-tight text-white sm:text-5xl lg:text-7xl first-letter:uppercase"
              >
                {section.data.title}
              </h1>
              <p data-hero-desc className="text-lg leading-relaxed text-white/90 sm:text-xl max-w-2xl">
                {section.data.description}
              </p>
              <div data-hero-actions className="flex flex-wrap gap-4 pt-4">
                <ButtonLink href={section.data.primaryCta.href} intent="primary" className="rounded-full px-8 py-4 text-base">
                  {section.data.primaryCta.label}
                </ButtonLink>
                <ButtonLink href={section.data.secondaryCta.href} intent="secondary" className="rounded-full px-8 py-4 text-base backdrop-blur-sm bg-white/5 border-white/10">
                  {section.data.secondaryCta.label}
                </ButtonLink>
              </div>
            </div>
          </HeroContent>
          <div className="pointer-events-none hidden lg:block h-[500px]" />
        </div>
      </Container>
    </section>
  );
}

export function HomeAgencyOverviewSectionView({
  section,
}: {
  section: HomeAgencyOverviewSection;
}) {
  return (
    <section className="section-space section-bg-white">
      <Container className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="space-y-6">
          <SectionHeading
            eyebrow={section.data.eyebrow}
            title={section.data.title}
            description={section.data.lead}
          />
          {section.data.paragraphs.map((item) => (
            <p key={item} className="text-sm leading-8 text-[var(--color-muted)]">
              {item}
            </p>
          ))}
        </div>

        <RevealBlock variant="fadeUpStagger" staggerSelector="[data-reveal-item]" staggerDelay={0.1}>
          <div className="grid gap-5">
            {section.data.sideNotes.map((note, index) => (
              <SurfaceCard key={note} className="min-h-44" data-reveal-item>
                <p className="text-xs uppercase tracking-[0.22em] text-[var(--color-accent)]">
                  0{index + 1}
                </p>
                <p className="mt-4 text-sm leading-7 text-[var(--color-muted)]">{note}</p>
              </SurfaceCard>
            ))}
          </div>
        </RevealBlock>
      </Container>
    </section>
  );
}

export function HomeSeoIntroSectionView({
  section,
}: {
  section: HomeSeoIntroSection;
}) {
  return (
    <section className="section-space bg-white/0">
      <Container className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-4">
          <SectionHeading eyebrow={section.data.eyebrow} title={section.data.title} />
          <div className="grid gap-4">
            {section.data.paragraphs.map((item) => (
              <SurfaceCard key={item.title} className="flex gap-4 bg-white/[0.03]">
                <div className="mt-1 h-11 w-11 rounded-2xl border border-white/10 bg-white/5" />
                <div>
                  <h3 className="text-base font-semibold text-white">{item.title}</h3>
                  <p className="mt-2 text-sm leading-7 text-[var(--color-muted)]">
                    {item.description}
                  </p>
                </div>
              </SurfaceCard>
            ))}
          </div>
        </div>

        <SurfaceCard className="flex min-h-[420px] flex-col justify-between overflow-hidden">
          <div>
            <p className="text-xs uppercase tracking-[0.24em] text-[var(--color-accent)]">
              SEO Audit
            </p>
            <h3 className="mt-4 font-display text-3xl font-semibold text-white">
              {section.data.sideCardTitle}
            </h3>
            <p className="mt-4 text-sm leading-7 text-[var(--color-muted)]">
              {section.data.sideCardDescription}
            </p>
          </div>
          <div className="grid gap-4">
            <div className="rounded-[2rem] border border-white/10 bg-[linear-gradient(135deg,rgba(251,215,1,0.12),rgba(251,215,1,0.05))] p-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-2xl bg-slate-950/35 p-4">
                  <p className="text-xs uppercase tracking-[0.18em] text-[var(--color-muted)]">
                    Видимость
                  </p>
                  <p className="mt-2 text-2xl font-semibold text-white">+64%</p>
                </div>
                <div className="rounded-2xl bg-slate-950/35 p-4">
                  <p className="text-xs uppercase tracking-[0.18em] text-[var(--color-muted)]">
                    Ошибки
                  </p>
                  <p className="mt-2 text-2xl font-semibold text-white">-38%</p>
                </div>
              </div>
            </div>
            <div className="rounded-[2rem] border border-white/10 bg-white/5 p-5 text-sm leading-7 text-[var(--color-muted)]">
              Мы не копируем старый WordPress-лендинг, а переводим его в более
              чистую систему секций, которую затем можно будет привязать к CMS.
            </div>
          </div>
        </SurfaceCard>
      </Container>
    </section>
  );
}

export function HomeReasonsSectionView({
  section,
}: {
  section: HomeReasonsSection;
}) {
  return (
    <section className="section-space section-bg-white">
      <Container className="space-y-10">
        <SectionHeading
          eyebrow={section.data.eyebrow}
          title={section.data.title}
          align="center"
        />
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {section.data.reasons.map((item, index) => (
            <SurfaceCard key={item.title} className="text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-[var(--color-accent)]/30 bg-[var(--color-accent)]/10 text-[var(--color-accent)]">
                {index + 1}
              </div>
              <h3 className="mt-5 text-sm font-semibold uppercase tracking-[0.18em] text-white">
                {item.title}
              </h3>
              <p className="mt-3 text-sm leading-7 text-[var(--color-muted)]">
                {item.description}
              </p>
            </SurfaceCard>
          ))}
        </div>
      </Container>
    </section>
  );
}

export function HomeForecastSectionView({
  section,
}: {
  section: HomeForecastSection;
}) {
  const maxValue = Math.max(...section.data.series.flatMap((item) => item.values));

  return (
    <section className="section-space">
      <Container className="space-y-8">
        <SectionHeading
          eyebrow={section.data.eyebrow}
          title={section.data.title}
          description={section.data.description}
          align="center"
        />

        <SurfaceCard className="space-y-8">
          <div className="grid gap-4 lg:grid-cols-4">
            {section.data.fields.map((field) => (
              <div
                key={field.label}
                className="rounded-[1.5rem] border border-white/10 bg-white/5 p-4"
              >
                <p className="text-xs uppercase tracking-[0.18em] text-[var(--color-muted)]">
                  {field.label}
                </p>
                <p className="mt-2 text-sm text-white">{field.value}</p>
              </div>
            ))}
          </div>

          <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
            <div className="rounded-[1.75rem] border border-white/10 bg-slate-950/30 p-5">
              <div className="flex flex-wrap gap-3">
                {section.data.series.map((item, index) => (
                  <div key={item.label} className="flex items-center gap-2 text-xs text-[var(--color-muted)]">
                    <span
                      className="h-2.5 w-2.5 rounded-full"
                      style={{
                        backgroundColor: index === 0 ? "#fb7185" : "#fbd701",
                      }}
                    />
                    {item.label}
                  </div>
                ))}
              </div>

              <div className="mt-8 flex h-72 items-end gap-3">
                {section.data.labels.map((label, index) => (
                  <div key={label} className="flex flex-1 flex-col items-center gap-3">
                    <div className="flex w-full items-end justify-center gap-1">
                      {section.data.series.map((item, seriesIndex) => {
                        const height = `${(item.values[index] / maxValue) * 100}%`;

                        return (
                          <div
                            key={`${item.label}-${label}`}
                            className="w-full rounded-t-full"
                            style={{
                              height,
                              background:
                                seriesIndex === 0
                                  ? "linear-gradient(180deg,#fb7185,#be123c)"
                                  : "linear-gradient(180deg,#fbd701,#b98d00)",
                            }}
                          />
                        );
                      })}
                    </div>
                    <span className="text-[10px] uppercase tracking-[0.14em] text-[var(--color-muted)]">
                      {label}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <SurfaceCard>
                <h3 className="font-display text-2xl font-semibold text-white">
                  {section.data.ctaTitle}
                </h3>
                <p className="mt-4 text-sm leading-7 text-[var(--color-muted)]">
                  {section.data.ctaDescription}
                </p>
                <div className="mt-6 grid gap-3">
                  {["Ваше имя", "Номер телефона"].map((item) => (
                    <div
                      key={item}
                      className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white/60"
                    >
                      {item}
                    </div>
                  ))}
                </div>
                <ButtonLink href="#lead" className="mt-6">
                  Обсудить проект
                </ButtonLink>
              </SurfaceCard>
            </div>
          </div>
        </SurfaceCard>
      </Container>
    </section>
  );
}

export function HomeFeatureNarrativeSectionView({
  section,
}: {
  section: HomeFeatureNarrativeSection;
}) {
  return (
    <section className="section-space">
      <Container className="grid gap-8 lg:grid-cols-[0.92fr_1.08fr]">
        <SurfaceCard className="min-h-[480px] bg-[linear-gradient(180deg,rgba(251,215,1,0.08),rgba(8,15,30,0.15))]">
          <div className="flex h-full flex-col justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.24em] text-[var(--color-accent)]">
                SEO Features
              </p>
              <div className="mt-8 grid gap-4">
                {section.data.highlights.map((item) => (
                  <div key={item} className="rounded-2xl border border-white/10 bg-slate-950/35 p-4 text-sm text-white">
                    {item}
                  </div>
                ))}
              </div>
            </div>
            <div className="rounded-[1.5rem] border border-white/10 bg-white/5 p-5 text-sm leading-7 text-[var(--color-muted)]">
              SEO в таком формате подается как долгосрочный актив: медленнее
              платной рекламы, но устойчивее по результату и экономике.
            </div>
          </div>
        </SurfaceCard>

        <div className="space-y-6">
          <SectionHeading eyebrow={section.data.eyebrow} title={section.data.title} />
          {section.data.paragraphs.map((item) => (
            <p key={item} className="text-sm leading-8 text-[var(--color-muted)]">
              {item}
            </p>
          ))}
        </div>
      </Container>
    </section>
  );
}

export function HomeWorkBreakdownSectionView({
  section,
}: {
  section: HomeWorkBreakdownSection;
}) {
  return (
    <section className="section-space">
      <Container className="space-y-10">
        <SectionHeading
          eyebrow={section.data.eyebrow}
          title={section.data.title}
          description={section.data.description}
          align="center"
        />
        <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr]">
          <div className="space-y-3">
            {section.data.items.map((item, index) => (
              <details
                key={item.title}
                open={index === 0}
                className="group rounded-[1.5rem] border border-white/10 bg-white/[0.03] p-0"
              >
                <summary className="cursor-pointer list-none px-5 py-4 text-sm font-medium text-white marker:hidden">
                  <div className="flex items-center justify-between gap-4">
                    <span>
                      {String(index + 1).padStart(2, "0")} {item.title}
                    </span>
                    <span className="text-[var(--color-accent)] transition group-open:rotate-45">
                      +
                    </span>
                  </div>
                </summary>
                <div className="px-5 pb-5 text-sm leading-7 text-[var(--color-muted)]">
                  {item.description}
                </div>
              </details>
            ))}
          </div>

          <SurfaceCard className="min-h-[480px] bg-[radial-gradient(circle_at_top,rgba(251,215,1,0.12),transparent_34%),linear-gradient(180deg,rgba(5,11,22,0.55),rgba(15,23,42,0.55))]">
            <div className="flex h-full items-end">
              <div className="grid w-full gap-4">
                <div className="rounded-[1.75rem] border border-white/10 bg-slate-950/30 p-5">
                  <p className="text-xs uppercase tracking-[0.22em] text-[var(--color-accent)]">
                    SEO Roadmap
                  </p>
                  <p className="mt-3 text-sm leading-7 text-[var(--color-muted)]">
                    Блок собран как long-form секция: его можно потом перенести в
                    гибкое контентное поле WordPress почти без изменения структуры данных.
                  </p>
                </div>
              </div>
            </div>
          </SurfaceCard>
        </div>
      </Container>
    </section>
  );
}

export function HomeCostItemsSectionView({
  section,
}: {
  section: HomeCostItemsSection;
}) {
  return (
    <section className="section-space">
      <Container className="space-y-10">
        <SectionHeading
          eyebrow={section.data.eyebrow}
          title={section.data.title}
          align="center"
        />
        <div className="grid gap-3 md:grid-cols-2">
          {section.data.items.map((item) => (
            <SurfaceCard key={item} className="flex items-center justify-between gap-4 py-5">
              <p className="text-sm text-white">{item}</p>
              <span className="text-[var(--color-accent)]">+</span>
            </SurfaceCard>
          ))}
        </div>
      </Container>
    </section>
  );
}

export function HomePricingSectionView({
  section,
}: {
  section: HomePricingSection;
}) {
  return (
    <section className="section-space">
      <Container className="space-y-10">
        <SectionHeading
          eyebrow={section.data.eyebrow}
          title={section.data.title}
          align="center"
        />
        <div className="grid gap-6 lg:grid-cols-3">
          {section.data.plans.map((plan) => (
            <SurfaceCard
              key={plan.name}
              className={plan.featured ? "relative border-[var(--color-accent)]/35 bg-white/[0.06]" : ""}
            >
              {plan.featured ? (
                <div className="absolute right-5 top-5 rounded-full bg-[var(--color-accent)] px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-950">
                  Популярный
                </div>
              ) : null}
              <div className="text-center">
                <h3 className="font-display text-2xl font-semibold text-white">{plan.name}</h3>
                <p className="mt-2 text-sm text-[var(--color-muted)]">{plan.subtitle}</p>
              </div>
              <div className="mt-6 space-y-3">
                {plan.features.map((feature) => (
                  <div key={feature} className="rounded-2xl bg-white/5 px-4 py-3 text-sm text-[var(--color-muted)]">
                    {feature}
                  </div>
                ))}
              </div>
              <div className="mt-8 border-t border-white/10 pt-6 text-center">
                <p className="font-display text-3xl font-semibold text-white">{plan.price}</p>
                <p className="mt-1 text-sm text-[var(--color-muted)]">в месяц</p>
                <ButtonLink href="#lead" className="mt-6 w-full">
                  Заказать
                </ButtonLink>
              </div>
            </SurfaceCard>
          ))}
        </div>
      </Container>
    </section>
  );
}

export function HomeFeaturedCaseSectionView({
  section,
}: {
  section: HomeFeaturedCaseSection;
}) {
  return (
    <section className="section-space">
      <Container className="space-y-10">
        <SectionHeading
          eyebrow={section.data.eyebrow}
          title={section.data.title}
          align="center"
        />
        <SurfaceCard className="overflow-hidden p-0">
          <div className="grid gap-8 lg:grid-cols-[0.42fr_0.58fr]">
            <div className="min-h-[320px] bg-[radial-gradient(circle_at_top,rgba(251,215,1,0.14),transparent_38%),linear-gradient(180deg,#102037,#0a1326)] p-8">
              <p className="text-xs uppercase tracking-[0.24em] text-[var(--color-accent)]">
                Featured Case
              </p>
              <div className="mt-8 grid gap-4">
                <div className="rounded-2xl border border-rose-300/15 bg-rose-400/10 p-4">
                  <p className="text-xs uppercase tracking-[0.2em] text-rose-200">Проблема</p>
                  <p className="mt-2 text-sm leading-7 text-white">{section.data.challenge}</p>
                </div>
                <div className="rounded-2xl border border-emerald-300/15 bg-emerald-400/10 p-4">
                  <p className="text-xs uppercase tracking-[0.2em] text-emerald-200">Решение</p>
                  <p className="mt-2 text-sm leading-7 text-white">{section.data.solution}</p>
                </div>
              </div>
            </div>
            <div className="p-8 lg:p-10">
              <div className="grid gap-4">
                {section.data.metrics.map((metric) => (
                  <div
                    key={metric.label}
                    className="grid gap-3 rounded-[1.5rem] border border-white/10 bg-white/5 p-5 sm:grid-cols-[1fr_auto]"
                  >
                    <div>
                      <p className="text-sm font-semibold text-white">{metric.label}</p>
                      <p className="mt-2 text-sm leading-7 text-[var(--color-muted)]">
                        {metric.impact}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-[var(--color-muted)]">{metric.before}</p>
                      <p className="font-display text-3xl font-semibold text-white">{metric.after}</p>
                    </div>
                  </div>
                ))}
              </div>
              <ButtonLink href={section.data.cta.href} className="mt-8">
                {section.data.cta.label}
              </ButtonLink>
            </div>
          </div>
        </SurfaceCard>
      </Container>
    </section>
  );
}

export function HomePartnersSectionView({
  section,
}: {
  section: HomePartnersSection;
}) {
  const marqueeItems = [...section.data.logos, ...section.data.logos];

  return (
    <section className="pt-8 pb-0">
      <Container className="pb-6 text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-neutral-500">
          {section.data.eyebrow}
        </p>
        <h2 className="mt-2 font-display text-xl font-semibold tracking-tight text-neutral-900 sm:text-2xl">
          {section.data.title}
        </h2>
      </Container>
      <div className="logo-marquee">
        <div className="logo-track">
          {marqueeItems.map((logo, index) => (
            <div
              key={`${logo.name}-${index}`}
              className="flex h-20 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04] px-8 py-4"
            >
              {logo.src ? (
                <Image
                  src={logo.src}
                  alt={logo.name}
                  width={140}
                  height={52}
                  className="h-9 w-auto object-contain opacity-90 transition duration-300 hover:opacity-100"
                />
              ) : (
                <span className="text-sm text-[var(--color-muted)]">{logo.name}</span>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function HomePartnerProblemsSectionView({
  section,
}: {
  section: HomePartnerProblemsSection;
}) {
  const items = [...section.data.problemsLeft, ...section.data.problemsRight];
  return (
    <section id={section.id} className="section-space relative py-16 md:py-20">
      <Container className="space-y-10">
        <h2 className="text-center font-display text-3xl font-semibold tracking-tight text-white sm:text-4xl">
          {section.data.title}
        </h2>
        <RevealBlock
          variant="fadeUpStagger"
          staggerSelector=".partner-problems-list__item"
          staggerDelay={0.12}
          start="top 85%"
          scrub={0.65}
          scrubScrollPx={1200}
        >
          <div className="mx-auto max-w-3xl space-y-4">
            {items.map((item) => (
              <div
                key={item}
                className="partner-problems-list__item rounded-2xl border border-white/10 bg-white/[0.04] px-6 py-5 sm:px-7"
              >
                <p className="text-[1.5rem] font-semibold leading-tight text-white">
                  {item}
                </p>
              </div>
            ))}
          </div>
        </RevealBlock>
      </Container>
    </section>
  );
}

export function HomeGrowthApproachSectionView({
  section,
}: {
  section: HomeGrowthApproachSection;
}) {
  const { title, subtitle, items } = section.data;
  return (
    <section id={section.id} className="section-space growth-approach-section">
      <div className="sticky top-20 z-30 md:top-24">
        <Container className="space-y-6 text-center pb-12 md:pb-16">
          <h2 className="font-display text-2xl font-semibold tracking-tight text-white sm:text-3xl lg:text-4xl">
            {title}
          </h2>
          <p className="mx-auto max-w-2xl text-sm leading-7 text-white/80 sm:text-base">
            {subtitle}
          </p>
        </Container>
      </div>
      <Container>
        <GrowthApproachStack items={items} />
      </Container>
    </section>
  );
}

export function HomeFocusCardSectionView({
  section,
}: {
  section: HomeFocusCardSection;
}) {
  const { index, title, body } = section.data;
  return (
    <section id={section.id} className="section-space">
      <Container>
        <div className="growth-approach-stack growth-approach-stack--list relative">
          <div className="growth-approach-stack__card min-h-[14rem] flex flex-col justify-center">
            <span
              className="growth-approach-stack__card-index !bg-[var(--color-accent)] !text-[#1c2338]"
              style={{ color: "#1c2338" }}
            >
              {index}
            </span>
            <h3 className="growth-approach-stack__card-title mt-0">{title}</h3>
            <p className="growth-approach-stack__card-body">{body}</p>
          </div>
        </div>
      </Container>
    </section>
  );
}

export function HomeFocusTextPanelSectionView({
  section,
}: {
  section: HomeFocusTextPanelSection;
}) {
  const lineTexts = section.data.lines.map((line) => line.text);
  return (
    <section id={section.id} className="section-space relative py-16 md:py-20">
      <div className="w-full">
        <div className="partner-problems-panel rounded-none py-10 sm:py-12 md:py-14">
          <div className="mx-auto max-w-5xl px-6 sm:px-10 md:px-12">
            <FocusTextPanelAnimated lines={lineTexts} />
          </div>
        </div>
      </div>
    </section>
  );
}

export function HomeAdvantageGridSectionView({
  section,
}: {
  section: HomeAdvantageGridSection;
}) {
  return (
    <section className="section-space section-bg-white">
      <Container className="space-y-10">
        <SectionHeading eyebrow={section.data.eyebrow} title={section.data.title} align="center" />
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {section.data.items.map((item) => (
            <SurfaceCard key={item} className="text-center">
              <div className="mx-auto h-16 w-16 rounded-full border-2 border-[var(--color-accent)]/40 bg-[var(--color-accent)]/15" />
              <p className="mt-5 text-sm leading-7 text-[var(--color-foreground)]">{item}</p>
            </SurfaceCard>
          ))}
        </div>
      </Container>
    </section>
  );
}

export function HomeAdvantagesWorkSectionView({
  section,
}: {
  section: HomeAdvantagesWorkSection;
}) {
  return (
    <section id={section.id} className="section-space">
      <Container className="space-y-10">
        <div className="section-heading text-center">
          <h2 className="uppercase">{section.data.title}</h2>
          <p className="mt-2 text-base text-[var(--color-muted)] sm:text-lg">
            {section.data.description}
          </p>
        </div>
        <div className="grid gap-5 sm:grid-cols-2">
          {section.data.items.map((item, index) => (
            <div
              key={item.title}
              className="rounded-2xl bg-[#0C0E4A] p-6"
            >
              <span className="inline-flex items-center justify-center rounded-full bg-[var(--color-accent)] px-3 py-1.5 text-sm font-bold text-[#1c2338]">
                {String(index + 1).padStart(2, "0")}
              </span>
              <h3 className="mt-4 text-base font-semibold text-white sm:text-lg">
                {item.title}
              </h3>
              <p className="mt-2 text-sm leading-7 text-white/80">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}

export function HomeApproachSectionView({
  section,
}: {
  section: HomeApproachSection;
}) {
  return (
    <section className="section-space section-bg-white">
      <Container className="grid gap-8 lg:grid-cols-[1.04fr_0.96fr]">
        <div className="space-y-4">
          <SectionHeading eyebrow={section.data.eyebrow} title={section.data.title} />
          {section.data.paragraphs.map((item) => (
            <SurfaceCard key={item} className="flex gap-4">
              <div className="mt-1 h-10 w-10 rounded-2xl border border-white/10 bg-white/5" />
              <p className="text-sm leading-7 text-[var(--color-muted)]">{item}</p>
            </SurfaceCard>
          ))}
        </div>
        <SurfaceCard className="min-h-[520px] bg-[var(--color-primary)]">
          <div className="flex h-full flex-col justify-end">
            <div className="rounded-2xl border border-white/15 bg-white/5 p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--color-accent)]">
                Team mindset
              </p>
              <p className="mt-4 text-sm leading-7 text-white/90">
                В этой версии блок «подход к работе» говорит не только о
                компетенциях, но и о формате взаимодействия: скорость, гибкость,
                индивидуальный подход и долгосрочное партнерство.
              </p>
            </div>
          </div>
        </SurfaceCard>
      </Container>
    </section>
  );
}

export function HomeProblemQuizSectionView({
  section,
}: {
  section: HomeProblemQuizSection;
}) {
  return (
    <ProblemQuizBlock title={section.data.quizTitle} steps={section.data.quizSteps} />
  );
}

export function HomeCitiesSectionView({
  section,
}: {
  section: HomeCitiesSection;
}) {
  return (
    <section className="section-space">
      <Container>
        <CitiesMapOverlay title={section.data.title} cities={section.data.cities} />
      </Container>
    </section>
  );
}

export function HomeIndustriesSectionView({
  section,
}: {
  section: HomeIndustriesSection;
}) {
  return (
    <section className="section-space">
      <Container className="space-y-10">
        <SectionHeading
          eyebrow={section.data.eyebrow}
          title={section.data.title}
          description={section.data.description}
          align="center"
        />
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6">
          {section.data.industries.map((item) => (
            <div
              key={item.title}
              className="rounded-[1.35rem] border border-white/10 bg-white/[0.03] px-4 py-4 text-sm text-[var(--color-muted)] transition hover:border-white/20 hover:text-white"
            >
              {item.title}
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}

export function HomeProcessSectionView({
  section,
}: {
  section: HomeProcessSection;
}) {
  return (
    <section className="section-space">
      <Container className="space-y-10">
        <SectionHeading eyebrow={section.data.eyebrow} title={section.data.title} align="center" />
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-6">
          {section.data.items.map((item, index) => (
            <SurfaceCard key={item.step} className={index === 0 ? "border-[var(--color-accent)]/25" : ""}>
              <div className="flex h-12 w-12 items-center justify-center rounded-full border border-white/10 bg-slate-950/40 font-semibold text-white">
                {index + 1}
              </div>
              <p className="mt-4 text-xs uppercase tracking-[0.2em] text-[var(--color-accent)]">
                {item.step}
              </p>
              <h3 className="mt-3 text-base font-semibold text-white">{item.title}</h3>
              <p className="mt-3 text-sm leading-7 text-[var(--color-muted)]">
                {item.description}
              </p>
            </SurfaceCard>
          ))}
        </div>
        <SurfaceCard>
          <h3 className="font-display text-2xl font-semibold text-white">
            {section.data.spotlightTitle}
          </h3>
          <p className="mt-4 text-sm leading-7 text-[var(--color-muted)]">
            {section.data.spotlightDescription}
          </p>
        </SurfaceCard>
      </Container>
    </section>
  );
}

export function TrustPanelSectionView({ section }: { section: TrustPanelSection }) {
  return (
    <section className="section-space">
      <Container className="space-y-10">
        <SectionHeading
          eyebrow={section.data.eyebrow}
          title={section.data.title}
          description={section.data.description}
        />

        <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <SurfaceCard className="grid gap-4">
            {section.data.highlights.map((item) => (
              <div key={item} className="rounded-2xl bg-white/5 p-5">
                <p className="text-sm leading-7 text-white">{item}</p>
              </div>
            ))}
          </SurfaceCard>

          <div className="grid gap-6">
            <div className="grid gap-4 sm:grid-cols-3">
              {section.data.stats.map((stat) => (
                <SurfaceCard key={stat.label}>
                  <p className="font-display text-3xl font-semibold text-white">{stat.value}</p>
                  <p className="mt-2 text-xs uppercase tracking-[0.2em] text-[var(--color-muted)]">
                    {stat.label}
                  </p>
                </SurfaceCard>
              ))}
            </div>

            <SurfaceCard>
              <p className="text-xs uppercase tracking-[0.24em] text-[var(--color-accent)]">
                Нам доверяют
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                {section.data.logos.map((logo) => (
                  <span
                    key={logo.name}
                    className="rounded-full border border-white/10 px-4 py-2 text-sm text-[var(--color-muted)]"
                  >
                    {logo.name}
                  </span>
                ))}
              </div>
            </SurfaceCard>
          </div>
        </div>
      </Container>
    </section>
  );
}

export function ServiceCollectionSectionView({
  section,
}: {
  section: ServiceCollectionSection;
}) {
  const services = section.data.services.slice(0, 6);
  const iconFiles = [
    "/icons/seo.svg",
    "/icons/cont.svg",
    "/icons/target.svg",
    "/icons/app.svg",
    "/icons/rep.svg",
    "/icons/strat.svg",
  ] as const;
  const serviceGradientColors = [
    ["255", "59", "48"],
    ["56", "189", "248"],
    ["167", "139", "250"],
    ["244", "114", "182"],
    ["251", "191", "36"],
    ["132", "204", "22"],
  ] as const;
  return (
    <section className="section-space section-bg-white section-services relative">
      <Container className="space-y-10">
        <div className="mx-auto max-w-4xl space-y-4 text-center">
          <h2 className="font-display text-3xl font-semibold tracking-tight text-white sm:text-4xl">
            {section.data.title}
          </h2>
          <p className="text-base leading-8 text-[var(--color-muted)]">
            {section.data.description}
          </p>
        </div>
        <RevealBlock variant="fadeUpStagger" staggerSelector="[data-service-card]" staggerDelay={0.12} start="top 86%">
          <ul className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {services.map((service, index) => (
              <li key={service.slug} className="h-full" data-service-card>
                <Link
                  href={service.href ?? `/services/${service.slug}`}
                className="service-card-link service-card service-card-gradient group flex h-full flex-col items-start rounded-2xl border-0 bg-white p-6 text-left transition-transform transition-colors duration-300 ease-out hover:scale-[1.02] hover:bg-neutral-50"
                style={
                  {
                    "--service-grad-start-rgb": serviceGradientColors[index % serviceGradientColors.length].join(", "),
                    "--service-grad-end-rgb": serviceGradientColors[(index + 2) % serviceGradientColors.length].join(", "),
                  } as React.CSSProperties
                }
                >
                  <span className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-full border border-[var(--color-accent)] bg-[var(--color-accent)] text-[#111]" aria-hidden>
                    <Image
                      src={iconFiles[index % iconFiles.length]}
                      alt=""
                      width={20}
                      height={20}
                      className="h-5 w-5 object-contain"
                    />
                  </span>
                  <h3 className="font-display text-xl font-semibold text-[#111]">
                    {service.title}
                  </h3>
                  {(service.outcome || service.teaser) ? (
                    <p className="mt-3 text-sm leading-7 text-[#333]">
                      {service.outcome ?? service.teaser}
                    </p>
                  ) : null}
                  <span className="mt-auto pt-5 inline-flex text-2xl leading-none text-[var(--color-accent)] transition-transform duration-300 ease-out group-hover:translate-x-1" aria-hidden>
                    →
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </RevealBlock>
      </Container>
    </section>
  );
}
