import type { Metadata } from "next";

import { getHomePage } from "@/content/mock/site";
import { buildMetadata } from "@/lib/seo";
import { HomeHeroSectionView } from "@/sections/home";

const page = getHomePage();
const heroSection = page.sections.find((s) => s.type === "homeHero");

export const metadata: Metadata = buildMetadata(page.seo, "/");

export default function Home() {
  if (!heroSection || heroSection.type !== "homeHero") return null;
  return <HomeHeroSectionView section={heroSection} />;
}
