import type { Metadata } from "next";
import { PDFEditorClient } from "./client";
import { siteConfig } from "@/config/site";
import { JsonLd } from "@/components/seo/JsonLd";
import { getWebApplicationSchema, getBreadcrumbSchema } from "@/lib/seo-schemas";

export const metadata: Metadata = {
  title: "Online PDF Editor — Edit, Annotate, Redact & Merge PDFs Free",
  description:
    "A powerful, 100% private browser-based PDF editor. Edit text, insert images, draw annotations, whiteout sensitive text, combine PDF files, and export securely with zero server uploads.",
  keywords: [
    "online pdf editor",
    "edit pdf text online",
    "pdf annotator",
    "pdf whiteout tool",
    "merge pdf files free",
    "browser pdf editor",
    "privacy pdf editor",
    "pdf organizer",
  ],
  alternates: {
    canonical: "/pdf-editor",
  },
  openGraph: {
    title: "Online PDF Editor — Edit, Annotate, Redact & Merge PDFs Free",
    description:
      "Modify text, draw annotations, redact private details, and merge PDF pages directly in your browser. 100% client-side security.",
    url: `${siteConfig.url}/pdf-editor`,
    siteName: siteConfig.name,
    images: ["/opengraph-image"],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Online PDF Editor — Edit, Annotate, Redact & Merge PDFs Free",
    description:
      "Modify text, draw annotations, redact private details, and merge PDF pages directly in your browser. 100% client-side security.",
    images: ["/opengraph-image"],
  },
};

export default function PDFToolsPage() {
  const appSchema = getWebApplicationSchema({
    name: "CraftKit Pro PDF Editor & Annotator",
    url: `${siteConfig.url}/pdf-editor`,
    description:
      "Modify text, annotate documents, redact sensitive info, and organize pages 100% locally in your browser.",
    applicationCategory: "BusinessApplication",
    featureList: [
      "PDF text editing and font customization",
      "Drawing and visual annotations",
      "Redaction and whiteout masking",
      "Page merging and re-ordering",
      "Client-side compressed export",
    ],
  });

  const breadcrumbSchema = getBreadcrumbSchema([
    { name: "Home", item: "/" },
    { name: "PDF Editor", item: "/pdf-editor" },
  ]);

  return (
    <>
      <JsonLd data={[appSchema, breadcrumbSchema]} />
      <PDFEditorClient />
    </>
  );
}
