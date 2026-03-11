import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { getCasePageBySlug, getCasePages } from "@/content/mock/site";
import { buildMetadata } from "@/lib/seo";
import { CasePageTemplate } from "@/templates/CasePageTemplate";

interface CasePageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateStaticParams() {
  return getCasePages().map((item) => ({
    slug: item.slug,
  }));
}

export async function generateMetadata({
  params,
}: CasePageProps): Promise<Metadata> {
  const { slug } = await params;
  const page = getCasePageBySlug(slug);

  if (!page) {
    return {};
  }

  return buildMetadata(page.seo, `/cases/${slug}`);
}

export default async function CaseRoute({ params }: CasePageProps) {
  const { slug } = await params;
  const page = getCasePageBySlug(slug);

  if (!page) {
    notFound();
  }

  return <CasePageTemplate page={page} />;
}
