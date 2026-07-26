import type { Metadata } from "next";
import { siteConfig } from "@/config/site";
import { JsonLd } from "@/components/seo/JsonLd";
import { getBreadcrumbSchema } from "@/lib/seo-schemas";
import { FileText, CheckCircle2 } from "lucide-react";

export const metadata: Metadata = {
  title: "Terms of Service — CraftKit Pro",
  description:
    "Review the Terms of Service for using CraftKit Pro online PDF & image studio tools.",
  alternates: {
    canonical: "/terms",
  },
  openGraph: {
    title: "Terms of Service — CraftKit Pro",
    description:
      "Review the Terms of Service for using CraftKit Pro online PDF & image studio tools.",
    url: `${siteConfig.url}/terms`,
    siteName: siteConfig.name,
    images: ["/opengraph-image"],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Terms of Service — CraftKit Pro",
    description:
      "Review the Terms of Service for using CraftKit Pro online PDF & image studio tools.",
    images: ["/opengraph-image"],
  },
};

export default function TermsPage() {
  const breadcrumbSchema = getBreadcrumbSchema([
    { name: "Home", item: "/" },
    { name: "Terms of Service", item: "/terms" },
  ]);

  return (
    <div className="bg-[#0a0a0a] min-h-screen py-20 relative overflow-hidden">
      <JsonLd data={breadcrumbSchema} />

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center space-y-4">
          <span className="px-3 py-1 text-xs font-semibold bg-[#0a84ff]/10 text-[#0a84ff] border border-[#0a84ff]/20 rounded-full inline-block">
            ⚖️ Terms & Usage
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-white">
            Terms of Service
          </h1>
          <p className="text-[#8e8e93] text-sm max-w-xl mx-auto">
            Clear, transparent guidelines for using CraftKit Pro tools.
          </p>
        </div>

        <div className="p-8 bg-[#111112] border border-[#2a2a2d] rounded-2xl space-y-8 text-white">
          <section className="space-y-3">
            <h2 className="text-xl font-bold text-[#0a84ff] flex items-center gap-2">
              <FileText size={20} /> 1. Acceptance of Terms
            </h2>
            <p className="text-sm text-[#8e8e93] leading-relaxed">
              By accessing and using CraftKit Pro, you agree to comply with and be bound by these terms. If you do not agree with any part of these terms, you should not use the software.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-[#00c6ff] flex items-center gap-2">
              <CheckCircle2 size={20} /> 2. Permitted Use
            </h2>
            <p className="text-sm text-[#8e8e93] leading-relaxed">
              CraftKit Pro is provided free of charge for personal and commercial file editing, annotation, compression, and media optimization. You retain 100% full ownership and copyright of all document and image files processed using the tools.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-white">3. Disclaimer of Warranties</h2>
            <p className="text-sm text-[#8e8e93] leading-relaxed">
              The tools and services are provided &quot;as is&quot; without warranties of any kind, whether express or implied. Users assume all responsibility for verifying modified file outputs prior to final distribution or archival.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
