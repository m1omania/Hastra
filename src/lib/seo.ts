import type { Metadata } from "next";

import type { SeoMeta } from "@/types/content";

const siteName = "Hastra Prototype";
const baseUrl = "https://hastra.vercel.app";

export function buildMetadata(seo: SeoMeta, pathname = "/"): Metadata {
  const url = new URL(pathname, baseUrl).toString();

  return {
    title: seo.title,
    description: seo.description,
    keywords: seo.keywords,
    metadataBase: new URL(baseUrl),
    alternates: {
      canonical: pathname,
    },
    openGraph: {
      title: seo.title,
      description: seo.description,
      siteName,
      type: "website",
      url,
    },
    twitter: {
      card: "summary_large_image",
      title: seo.title,
      description: seo.description,
    },
  };
}
