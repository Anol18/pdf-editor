import type { Metadata } from "next";
import { siteConfig } from "@/config/site";
import { JsonLd } from "@/components/seo/JsonLd";
import { getBreadcrumbSchema } from "@/lib/seo-schemas";

export const metadata: Metadata = {
  title: "About Us — The Mission Behind CraftKit Pro",
  description:
    "Learn about the mission, architecture, and client-side technology behind CraftKit Pro. Designed to build the world's most secure and private PDF & media suite.",
  keywords: [
    "about craftkit pro",
    "offline first tools creator",
    "pdf editor technology stack",
    "private web development",
    "privacy first media tools",
  ],
  alternates: {
    canonical: "/about",
  },
  openGraph: {
    title: "About Us — The Mission Behind CraftKit Pro",
    description:
      "Learn about the mission, architecture, and client-side technology behind CraftKit Pro. Designed to build the world's most secure and private PDF & media suite.",
    url: `${siteConfig.url}/about`,
    siteName: siteConfig.name,
    images: ["/opengraph-image"],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "About Us — The Mission Behind CraftKit Pro",
    description:
      "Learn about the mission, architecture, and client-side technology behind CraftKit Pro.",
    images: ["/opengraph-image"],
  },
};

export default function AboutPage() {
  const breadcrumbSchema = getBreadcrumbSchema([
    { name: "Home", item: "/" },
    { name: "About", item: "/about" },
  ]);

  const aboutSchema = {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    "name": "About CraftKit Pro",
    "url": `${siteConfig.url}/about`,
    "description":
      "CraftKit Pro is an open, client-side developer toolkit designed to process media assets locally with total privacy.",
  };

  return (
    <div className="bg-[#0a0a0a] min-h-screen py-20 relative overflow-hidden">
      <JsonLd data={[breadcrumbSchema, aboutSchema]} />
      {/* Background Gradients */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[35%] h-[35%] rounded-full bg-[#00c6ff]/5 blur-[90px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-[#0a84ff]/5 blur-[100px]" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="text-center mb-16">
          <span className="px-3 py-1 text-xs font-semibold bg-[#0a84ff]/10 text-[#0a84ff] border border-[#0a84ff]/20 rounded-full mb-4 inline-block">
            👋 Developer & Mission
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white mb-4">
            About PDFCraft
          </h1>
          <p className="text-[#8e8e93] max-w-xl mx-auto text-[14px]">
            Building private, powerful, and accessible developer tools for everyone.
          </p>
        </div>

        {/* Content Section */}
        <div className="space-y-10 text-white">
          <section className="p-6 bg-[#111112] border border-[#2a2a2d] rounded-2xl">
            <h2 className="text-lg font-bold mb-3 text-[#0a84ff]">The Mission: Complete Privacy</h2>
            <p className="text-[13px] text-[#8e8e93] leading-relaxed">
              Every day, millions of people upload highly sensitive PDFs—tax records, business agreements, medical invoices—to free online PDF tools. What they don't realize is that these files are stored, parsed, and analyzed on remote servers.
            </p>
            <p className="text-[13px] text-[#8e8e93] leading-relaxed mt-3">
              PDFCraft was built to solve this security issue. By running modern libraries (like PDFJS-dist, PDF-lib, and react-konva) in a client-side sandbox, your file processing happens 100% locally. Your files never touch a server, meaning your data remains completely yours.
            </p>
          </section>

          <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 bg-[#111112] border border-[#2a2a2d] rounded-2xl">
              <h3 className="text-sm font-bold mb-2 text-white">The Tech Stack</h3>
              <ul className="space-y-2 text-[13px] text-[#8e8e93]">
                <li>🚀 <strong className="text-white">Next.js</strong> — Fast, modern web framework</li>
                <li>🎨 <strong className="text-white">React Konva & Canvas</strong> — Hardware-accelerated editing</li>
                <li>📝 <strong className="text-white">PDF-Lib</strong> — Merging, creating, and modifying files</li>
                <li>⚡ <strong className="text-white">Web Workers</strong> — Non-blocking processing threads</li>
              </ul>
            </div>

            <div className="p-6 bg-[#111112] border border-[#2a2a2d] rounded-2xl">
              <h3 className="text-sm font-bold mb-2 text-white">Our Commitments</h3>
              <ul className="space-y-2 text-[13px] text-[#8e8e93]">
                <li>✨ <strong className="text-white">Zero Watermarks</strong> — Your clean files only</li>
                <li>💰 <strong className="text-white">Always Free</strong> — Full capabilities unlocked</li>
                <li>🚫 <strong className="text-white">No Ads / Trackers</strong> — Clean, bloat-free design</li>
                <li>🛡️ <strong className="text-white">Open & Transparent</strong> — Client-side processing</li>
              </ul>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
