import type { HomePage, HomeSection } from "@/types/content";

import { RevealBlock } from "@/components/ui/reveal-block";
import { ScrollExpandWidth } from "@/components/ui/scroll-expand-width";
import {
  HomeAdvantageGridSectionView,
  HomeAgencyOverviewSectionView,
  HomeApproachSectionView,
  HomeCitiesSectionView,
  HomeFeatureNarrativeSectionView,
  HomeFeaturedCaseSectionView,
  HomeForecastSectionView,
  HomeGrowthApproachSectionView,
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
    case "homeGrowthApproach":
      return <HomeGrowthApproachSectionView key={section.id} section={section} />;
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
  const [firstSection, ...restSections] = page.sections;
  return (
    <main className="min-h-screen relative">
      {firstSection ? renderSection(firstSection) : null}
      {restSections.length > 0 ? (
        <ScrollExpandWidth>
          <div className="blocks-glass relative z-10 flex flex-col gap-y-16 rounded-t-3xl bg-[rgb(15_23_42/0.94)] backdrop-blur-3xl px-6 py-10 sm:gap-y-20 sm:px-10 sm:py-12 lg:gap-y-24 lg:px-16 lg:py-14 xl:px-24">
            {restSections.map((section) =>
            section.type === "homePartners" ? (
              <div
                key={section.id}
                className="-mx-6 overflow-hidden rounded-2xl sm:-mx-10 lg:-mx-16 xl:-mx-24"
              >
                {renderSection(section)}
              </div>
            ) : section.type === "homePartnerProblems" ? (
              <div
                key={section.id}
                className="-mx-6 sm:-mx-10 lg:-mx-16 xl:-mx-24"
              >
                {renderSection(section)}
              </div>
            ) : section.type === "homeGrowthApproach" ||
              section.type === "caseCollection" ||
              section.type === "serviceCollection" ? (
              <RevealBlock key={section.id} variant="fadeUp" start="top 88%">
                <div className="py-10 px-6 sm:py-12 sm:px-8 lg:py-14 lg:px-10">
                  {renderSection(section)}
                </div>
              </RevealBlock>
            ) : (
              <RevealBlock key={section.id} variant="fadeUp" start="top 88%">
                <div className="py-10 px-6 sm:py-12 sm:px-8 lg:py-14 lg:px-10">
                  {renderSection(section)}
                </div>
              </RevealBlock>
            )
            )}
          </div>
        </ScrollExpandWidth>
      ) : null}
    </main>
  );
}
