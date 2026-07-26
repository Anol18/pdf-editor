import type { Metadata } from "next";
import { siteConfig } from "@/config/site";
import { JsonLd } from "@/components/seo/JsonLd";
import { getBreadcrumbSchema } from "@/lib/seo-schemas";
import { ShieldCheck, Lock, EyeOff } from "lucide-react";

export const metadata: Metadata = {
  title: "Privacy Policy — 100% Client-Side Data Guarantee",
  description:
    "Read our Privacy Policy. CraftKit Pro processes all PDF documents and images locally inside your browser. No server uploads, no data collection.",
  alternates: {
    canonical: "/privacy",
  },
  openGraph: {
    title: "Privacy Policy — 100% Client-Side Data Guarantee",
    description:
      "CraftKit Pro processes all PDF documents and images locally inside your browser. No server uploads, no data collection.",
    url: `${siteConfig.url}/privacy`,
    siteName: siteConfig.name,
    images: ["/opengraph-image"],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Privacy Policy — 100% Client-Side Data Guarantee",
    description:
      "CraftKit Pro processes all PDF documents and images locally inside your browser. No server uploads, no data collection.",
    images: ["/opengraph-image"],
  },
};

export default function PrivacyPage() {
  const breadcrumbSchema = getBreadcrumbSchema([
    { name: "Home", item: "/" },
    { name: "Privacy Policy", item: "/privacy" },
  ]);

  return (
    <div className="bg-[#0a0a0a] min-h-screen py-20 relative overflow-hidden">
      <JsonLd data={breadcrumbSchema} />

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center space-y-4">
          <span className="px-3 py-1 text-xs font-semibold bg-[#0a84ff]/10 text-[#0a84ff] border border-[#0a84ff]/20 rounded-full inline-block">
            🔒 Privacy Guarantee
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-white">
            Privacy Policy
          </h1>
          <p className="text-[#8e8e93] text-sm max-w-xl mx-auto">
            Your data is yours alone. We built CraftKit Pro with absolute client-side architecture.
          </p>
        </div>

        <div className="p-8 bg-[#111112] border border-[#2a2a2d] rounded-2xl space-y-8 text-white">
          <section className="space-y-3">
            <h2 className="text-xl font-bold text-[#0a84ff] flex items-center gap-2">
              <ShieldCheck size={20} /> 1. Zero Server Uploads
            </h2>
            <p className="text-sm text-[#8e8e93] leading-relaxed">
              When you load files into CraftKit Pro (PDFs, images, documents), all operations run completely inside your device’s local browser memory using HTML5, WebAssembly, and JavaScript engine sandboxes. No files, metadata, thumbnails, or text contents are ever uploaded to any backend server.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-[#00c6ff] flex items-center gap-2">
              <Lock size={20} /> 2. Personal Data & Cookies
            </h2>
            <p className="text-sm text-[#8e8e93] leading-relaxed">
              CraftKit Pro does not require user accounts, registration, passwords, or personal identifying information. We do not use persistent tracking cookies for cross-site targeting or sell data to any third-party advertisers.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-[#00f0ff] flex items-center gap-2">
              <EyeOff size={20} /> 3. Analytics
            </h2>
            <p className="text-sm text-[#8e8e93] leading-relaxed">
              We may utilize anonymized telemetry tools (such as Microsoft Clarity or Google Analytics) solely to analyze overall page traffic volume and performance metrics. These tools do not record file content or file metadata.
            </p>
          </section>

          <section className="border-t border-[#2a2a2d] pt-6 space-y-2">
            <h3 className="text-sm font-bold text-white">Contact Regarding Privacy</h3>
            <p className="text-xs text-[#8e8e93]">
              If you have any questions or feedback about our privacy architecture, feel free to reach out via our contact page.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
