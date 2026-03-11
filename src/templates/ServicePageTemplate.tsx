import type { ServicePage, ServiceSection } from "@/types/content";

import {
  DeliverablesSectionView,
  PainPointsSectionView,
  ProcessSectionView,
  ServiceHeroSectionView,
} from "@/sections/service";
import {
  CaseCollectionSectionView,
  FaqSectionView,
  LeadCaptureSectionView,
} from "@/sections/shared";

function renderSection(section: ServiceSection) {
  switch (section.type) {
    case "serviceHero":
      return <ServiceHeroSectionView key={section.id} section={section} />;
    case "painPoints":
      return <PainPointsSectionView key={section.id} section={section} />;
    case "deliverables":
      return <DeliverablesSectionView key={section.id} section={section} />;
    case "process":
      return <ProcessSectionView key={section.id} section={section} />;
    case "caseCollection":
      return <CaseCollectionSectionView key={section.id} section={section} />;
    case "faq":
      return <FaqSectionView key={section.id} section={section} />;
    case "leadCapture":
      return <LeadCaptureSectionView key={section.id} section={section} />;
    default:
      return null;
  }
}

export function ServicePageTemplate({ page }: { page: ServicePage }) {
  return <main>{page.sections.map(renderSection)}</main>;
}
