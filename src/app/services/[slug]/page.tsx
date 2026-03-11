import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { getServicePageBySlug, getServicePages } from "@/content/mock/site";
import { buildMetadata } from "@/lib/seo";
import { ServicePageTemplate } from "@/templates/ServicePageTemplate";

interface ServicePageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateStaticParams() {
  return getServicePages().map((service) => ({
    slug: service.slug,
  }));
}

export async function generateMetadata({
  params,
}: ServicePageProps): Promise<Metadata> {
  const { slug } = await params;
  const page = getServicePageBySlug(slug);

  if (!page) {
    return {};
  }

  return buildMetadata(page.seo, `/services/${slug}`);
}

export default async function ServiceRoute({ params }: ServicePageProps) {
  const { slug } = await params;
  const page = getServicePageBySlug(slug);

  if (!page) {
    notFound();
  }

  return <ServicePageTemplate page={page} />;
}
