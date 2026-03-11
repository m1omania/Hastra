import type { CasePage, CaseSection } from "@/types/content";

import {
  CaseHeroSectionView,
  CaseResultsSectionView,
  CaseStorySectionView,
} from "@/sections/case";
import {
  LeadCaptureSectionView,
  TestimonialsSectionView,
} from "@/sections/shared";

function renderSection(section: CaseSection) {
  switch (section.type) {
    case "caseHero":
      return <CaseHeroSectionView key={section.id} section={section} />;
    case "caseStory":
      return <CaseStorySectionView key={section.id} section={section} />;
    case "caseResults":
      return <CaseResultsSectionView key={section.id} section={section} />;
    case "testimonials":
      return <TestimonialsSectionView key={section.id} section={section} />;
    case "leadCapture":
      return <LeadCaptureSectionView key={section.id} section={section} />;
    default:
      return null;
  }
}

export function CasePageTemplate({ page }: { page: CasePage }) {
  return <main>{page.sections.map(renderSection)}</main>;
}
