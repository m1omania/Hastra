import type { Metadata } from "next";

import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata(
  { title: "Hastra", description: "Hastra" },
  "/"
);

export default function Home() {
  return null;
}
