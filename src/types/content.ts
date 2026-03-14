export type SectionVariant = "v1";

export interface SeoMeta {
  title: string;
  description: string;
  keywords?: string[];
}

export interface CtaLink {
  label: string;
  href: string;
  intent?: "primary" | "secondary" | "ghost";
}

export interface Stat {
  label: string;
  value: string;
}

export interface LogoItem {
  name: string;
  src?: string;
}

export interface Review {
  name: string;
  company: string;
  role: string;
  quote: string;
}

export interface FAQItem {
  question: string;
  answer: string;
}

export interface ServiceSummary {
  slug: string;
  href?: string;
  title: string;
  teaser: string;
  outcome: string;
  tags: string[];
}

export interface CaseSummary {
  slug: string;
  href?: string;
  client: string;
  title: string;
  excerpt: string;
  industry: string;
  metrics: Stat[];
}

export interface Deliverable {
  title: string;
  description: string;
}

export interface ProcessStep {
  title: string;
  description: string;
}

export interface ResultMetric {
  label: string;
  before?: string;
  after: string;
  impact: string;
}

export interface IconTextItem {
  title: string;
  description: string;
}

export interface ForecastSeries {
  label: string;
  values: number[];
}

export interface CalculatorField {
  label: string;
  value: string;
}

export interface PricingPlan {
  name: string;
  subtitle: string;
  price: string;
  features: string[];
  featured?: boolean;
}

export interface IndustryItem {
  title: string;
}

export interface ProcessMilestone {
  step: string;
  title: string;
  description: string;
}

export interface SectionBase<TType extends string, TData> {
  id: string;
  type: TType;
  variant: SectionVariant;
  data: TData;
}

export type HomeHeroSection = SectionBase<
  "homeHero",
  {
    eyebrow: string;
    title: string;
    description: string;
    badges: string[];
    logos?: LogoItem[];
    breadcrumb?: string;
    formPlaceholder?: string;
    formNote?: string;
    sideTitle?: string;
    sideDescription?: string;
    primaryCta: CtaLink;
    secondaryCta: CtaLink;
  }
>;

export type HomeAgencyOverviewSection = SectionBase<
  "homeAgencyOverview",
  {
    eyebrow: string;
    title: string;
    lead: string;
    paragraphs: string[];
    sideNotes: string[];
  }
>;

export interface QuizStep {
  step: string;
  title: string;
  options?: string[];
  description?: string;
}

export type HomeProblemQuizSection = SectionBase<
  "homeProblemQuiz",
  {
    eyebrow: string;
    title: string;
    problems: string[];
    quizTitle: string;
    quizSubtitle: string;
    quizSteps: QuizStep[];
    finalTitle: string;
    finalDescription: string;
  }
>;

export type HomeCitiesSection = SectionBase<
  "homeCities",
  {
    eyebrow: string;
    title: string;
    cities: string[];
  }
>;

export type TrustPanelSection = SectionBase<
  "trustPanel",
  {
    eyebrow: string;
    title: string;
    description: string;
    stats: Stat[];
    highlights: string[];
    logos: LogoItem[];
  }
>;

export type HomeSeoIntroSection = SectionBase<
  "homeSeoIntro",
  {
    eyebrow: string;
    title: string;
    paragraphs: IconTextItem[];
    sideCardTitle: string;
    sideCardDescription: string;
  }
>;

export type HomeReasonsSection = SectionBase<
  "homeReasons",
  {
    eyebrow: string;
    title: string;
    reasons: IconTextItem[];
  }
>;

export type HomeForecastSection = SectionBase<
  "homeForecast",
  {
    eyebrow: string;
    title: string;
    description: string;
    fields: CalculatorField[];
    labels: string[];
    series: ForecastSeries[];
    ctaTitle: string;
    ctaDescription: string;
  }
>;

export type HomeFeatureNarrativeSection = SectionBase<
  "homeFeatureNarrative",
  {
    eyebrow: string;
    title: string;
    paragraphs: string[];
    highlights: string[];
  }
>;

export type HomeWorkBreakdownSection = SectionBase<
  "homeWorkBreakdown",
  {
    eyebrow: string;
    title: string;
    description: string;
    items: Deliverable[];
  }
>;

export type HomeCostItemsSection = SectionBase<
  "homeCostItems",
  {
    eyebrow: string;
    title: string;
    items: string[];
  }
>;

export type HomePricingSection = SectionBase<
  "homePricing",
  {
    eyebrow: string;
    title: string;
    plans: PricingPlan[];
  }
>;

export type HomeFeaturedCaseSection = SectionBase<
  "homeFeaturedCase",
  {
    eyebrow: string;
    title: string;
    challenge: string;
    solution: string;
    metrics: ResultMetric[];
    cta: CtaLink;
  }
>;

export type HomePartnersSection = SectionBase<
  "homePartners",
  {
    eyebrow: string;
    title: string;
    logos: LogoItem[];
  }
>;

export type HomePartnerProblemsSection = SectionBase<
  "homePartnerProblems",
  {
    eyebrow?: string;
    title: string;
    problemsLeft: string[];
    problemsRight: string[];
  }
>;

export type HomeGrowthApproachSection = SectionBase<
  "homeGrowthApproach",
  {
    title: string;
    subtitle: string;
    items: { title: string; body: string }[];
  }
>;

export type HomeAdvantageGridSection = SectionBase<
  "homeAdvantageGrid",
  {
    eyebrow: string;
    title: string;
    items: string[];
  }
>;

export type HomeApproachSection = SectionBase<
  "homeApproach",
  {
    eyebrow: string;
    title: string;
    paragraphs: string[];
  }
>;

export type HomeIndustriesSection = SectionBase<
  "homeIndustries",
  {
    eyebrow: string;
    title: string;
    description: string;
    industries: IndustryItem[];
  }
>;

export type HomeProcessSection = SectionBase<
  "homeProcess",
  {
    eyebrow: string;
    title: string;
    items: ProcessMilestone[];
    spotlightTitle: string;
    spotlightDescription: string;
  }
>;

export type ServiceCollectionSection = SectionBase<
  "serviceCollection",
  {
    eyebrow: string;
    title: string;
    description: string;
    services: ServiceSummary[];
  }
>;

export type CaseCollectionSection = SectionBase<
  "caseCollection",
  {
    eyebrow: string;
    title: string;
    description: string;
    cases: CaseSummary[];
    /** Раскладка 3-2-3 с последней ячейкой «Смотреть все» (для главной) */
    layout?: "grid332";
  }
>;

export type HomeAboutCompanySection = SectionBase<
  "homeAboutCompany",
  {
    title: string;
    paragraphs: string[];
    approachTitle: string;
    approachItems: IconTextItem[];
  }
>;

export type HomeAdvantagesWorkSection = SectionBase<
  "homeAdvantagesWork",
  {
    title: string;
    description: string;
    items: IconTextItem[];
  }
>;

export type TestimonialsSection = SectionBase<
  "testimonials",
  {
    eyebrow: string;
    title: string;
    description: string;
    reviews: Review[];
  }
>;

export type LeadCaptureSection = SectionBase<
  "leadCapture",
  {
    eyebrow: string;
    title: string;
    description: string;
    checklist: string[];
    primaryCta: CtaLink;
    note: string;
  }
>;

export type PainPointsSection = SectionBase<
  "painPoints",
  {
    eyebrow: string;
    title: string;
    description: string;
    painPoints: string[];
    opportunity: string;
  }
>;

export type DeliverablesSection = SectionBase<
  "deliverables",
  {
    eyebrow: string;
    title: string;
    description: string;
    deliverables: Deliverable[];
  }
>;

export type ProcessSection = SectionBase<
  "process",
  {
    eyebrow: string;
    title: string;
    description: string;
    steps: ProcessStep[];
  }
>;

export type HomeFaqSection = SectionBase<
  "homeFaq",
  {
    title: string;
    items: FAQItem[];
  }
>;

export type HomeFocusCardSection = SectionBase<
  "homeFocusCard",
  {
    index: string;
    title: string;
    body: string;
  }
>;

export type HomeFocusTextPanelSection = SectionBase<
  "homeFocusTextPanel",
  {
    number: string;
    lines: { text: string; bold?: boolean }[];
  }
>;

export type FAQSection = SectionBase<
  "faq",
  {
    eyebrow: string;
    title: string;
    description: string;
    items: FAQItem[];
  }
>;

export type ServiceHeroSection = SectionBase<
  "serviceHero",
  {
    eyebrow: string;
    title: string;
    description: string;
    stats: Stat[];
    primaryCta: CtaLink;
    secondaryCta: CtaLink;
  }
>;

export type CaseHeroSection = SectionBase<
  "caseHero",
  {
    eyebrow: string;
    client: string;
    title: string;
    summary: string;
    industry: string;
    duration: string;
    services: string[];
  }
>;

export type CaseStorySection = SectionBase<
  "caseStory",
  {
    eyebrow: string;
    title: string;
    challenge: string;
    strategy: string[];
    execution: string[];
  }
>;

export type CaseResultsSection = SectionBase<
  "caseResults",
  {
    eyebrow: string;
    title: string;
    description: string;
    metrics: ResultMetric[];
    outcomes: string[];
  }
>;

export type HomeSection =
  | HomeHeroSection
  | HomeAgencyOverviewSection
  | HomeAboutCompanySection
  | HomeAdvantagesWorkSection
  | HomeSeoIntroSection
  | HomeReasonsSection
  | HomeForecastSection
  | HomeFeatureNarrativeSection
  | HomeWorkBreakdownSection
  | HomeCostItemsSection
  | HomePricingSection
  | HomeFeaturedCaseSection
  | HomePartnersSection
  | HomePartnerProblemsSection
  | HomeGrowthApproachSection
  | HomeAdvantageGridSection
  | HomeApproachSection
  | HomeProblemQuizSection
  | HomeCitiesSection
  | HomeIndustriesSection
  | HomeProcessSection
  | TrustPanelSection
  | ServiceCollectionSection
  | CaseCollectionSection
  | TestimonialsSection
  | HomeFaqSection
  | HomeFocusCardSection
  | HomeFocusTextPanelSection
  | LeadCaptureSection;

export type ServiceSection =
  | ServiceHeroSection
  | PainPointsSection
  | DeliverablesSection
  | ProcessSection
  | CaseCollectionSection
  | FAQSection
  | LeadCaptureSection;

export type CaseSection =
  | CaseHeroSection
  | CaseStorySection
  | CaseResultsSection
  | TestimonialsSection
  | LeadCaptureSection;

export interface HomePage {
  slug: "home";
  seo: SeoMeta;
  sections: HomeSection[];
}

export interface ServicePage {
  slug: string;
  seo: SeoMeta;
  sections: ServiceSection[];
}

export interface CasePage {
  slug: string;
  seo: SeoMeta;
  sections: CaseSection[];
  linkedServiceSlug: string;
}
