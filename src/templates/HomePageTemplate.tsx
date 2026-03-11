import type { HomePage, HomeSection } from "@/types/content";

import {
  HomeAdvantageGridSectionView,
  HomeAgencyOverviewSectionView,
  HomeApproachSectionView,
  HomeCitiesSectionView,
  HomeFeatureNarrativeSectionView,
  HomeFeaturedCaseSectionView,
  HomeForecastSectionView,
  HomeHeroSectionView,
  HomeIndustriesSectionView,
  HomePartnersSectionView,
  HomePartnerProblemsSectionView,
  HomePricingSectionView,
  HomeProblemQuizSectionView,
  HomeProcessSectionView,
  HomeReasonsSectionView,
  HomeSeoIntroSectionView,
  HomeWorkBreakdownSectionView,
  ServiceCollectionSectionView,
  TrustPanelSectionView,
  HomeCostItemsSectionView,
} from "@/sections/home";
import {
  CaseCollectionSectionView,
  LeadCaptureSectionView,
  TestimonialsSectionView,
} from "@/sections/shared";

function renderSection(section: HomeSection) {
  switch (section.type) {
    case "homeHero":
      return <HomeHeroSectionView key={section.id} section={section} />;
    case "homeAgencyOverview":
      return <HomeAgencyOverviewSectionView key={section.id} section={section} />;
    case "homeSeoIntro":
      return <HomeSeoIntroSectionView key={section.id} section={section} />;
    case "homeReasons":
      return <HomeReasonsSectionView key={section.id} section={section} />;
    case "homeForecast":
      return <HomeForecastSectionView key={section.id} section={section} />;
    case "homeFeatureNarrative":
      return <HomeFeatureNarrativeSectionView key={section.id} section={section} />;
    case "homeWorkBreakdown":
      return <HomeWorkBreakdownSectionView key={section.id} section={section} />;
    case "homeCostItems":
      return <HomeCostItemsSectionView key={section.id} section={section} />;
    case "homePricing":
      return <HomePricingSectionView key={section.id} section={section} />;
    case "homeFeaturedCase":
      return <HomeFeaturedCaseSectionView key={section.id} section={section} />;
    case "homePartners":
      return <HomePartnersSectionView key={section.id} section={section} />;
    case "homePartnerProblems":
      return <HomePartnerProblemsSectionView key={section.id} section={section} />;
    case "homeAdvantageGrid":
      return <HomeAdvantageGridSectionView key={section.id} section={section} />;
    case "homeApproach":
      return <HomeApproachSectionView key={section.id} section={section} />;
    case "homeProblemQuiz":
      return <HomeProblemQuizSectionView key={section.id} section={section} />;
    case "homeCities":
      return <HomeCitiesSectionView key={section.id} section={section} />;
    case "homeIndustries":
      return <HomeIndustriesSectionView key={section.id} section={section} />;
    case "homeProcess":
      return <HomeProcessSectionView key={section.id} section={section} />;
    case "trustPanel":
      return <TrustPanelSectionView key={section.id} section={section} />;
    case "serviceCollection":
      return <ServiceCollectionSectionView key={section.id} section={section} />;
    case "caseCollection":
      return <CaseCollectionSectionView key={section.id} section={section} />;
    case "testimonials":
      return <TestimonialsSectionView key={section.id} section={section} />;
    case "leadCapture":
      return <LeadCaptureSectionView key={section.id} section={section} />;
    default:
      return null;
  }
}

export function HomePageTemplate({ page }: { page: HomePage }) {
  return (
    <main className="min-h-screen relative">
      {page.sections.map(renderSection)}
    </main>
  );
}
