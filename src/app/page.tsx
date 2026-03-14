import type { Metadata } from "next";

import { getHomePage } from "@/content/mock/site";
import { buildMetadata } from "@/lib/seo";
import { HomePageTemplate } from "@/templates/HomePageTemplate";

const page = getHomePage();
const visibleSectionTypes = new Set(["homeHero", "homeGrowthApproach", "homeFocusTextPanel", "serviceCollection", "caseCollection", "testimonials", "homeAboutCompany", "homeFaq", "homeProblemQuiz", "homeCities"]);
const pageWithHeroProblemsAndSolutions = {
  ...page,
  sections: page.sections.filter((section) => visibleSectionTypes.has(section.type)),
};

export const metadata: Metadata = buildMetadata(
  { title: "Hastra", description: "Hastra" },
  "/"
);

export default function Home() {
  return <HomePageTemplate page={pageWithHeroProblemsAndSolutions} />;
}
