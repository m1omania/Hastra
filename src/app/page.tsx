import type { Metadata } from "next";

import { getHomePage } from "@/content/mock/site";
import { buildMetadata } from "@/lib/seo";
import { HomePageTemplate } from "@/templates/HomePageTemplate";

const page = getHomePage();

export const metadata: Metadata = buildMetadata(page.seo, "/");

export default function Home() {
  return <HomePageTemplate page={page} />;
}
