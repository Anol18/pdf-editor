import type { Metadata } from "next";
import Link from "next/link";
import { 
  Sparkles, 
  FileText, 
  Image as ImageIcon, 
  Video, 
  Music, 
  ArrowRight, 
  ShieldCheck, 
  Zap, 
  HardDrive, 
  Edit3, 
  Merge, 
  Eraser, 
  Ruler, 
  Maximize,
  ArrowUpRight,
  Check,
  X,
  Lock,
  Globe,
  EyeOff
} from "lucide-react";
import { InteractiveSandbox } from "@/components/landing/InteractiveSandbox";
import { FaqSection } from "@/components/landing/FaqSection";
import { JsonLd } from "@/components/seo/JsonLd";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "CraftKit Pro — Free Online PDF Editor, Image Studio & Media Toolkit",
  description:
    "Edit, compress, merge PDFs and batch process, resize, crop, remove backgrounds, or upscale images in your browser. 100% private, local processing. No sign-up.",
  keywords: siteConfig.keywords,
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "CraftKit Pro — Free Online PDF Editor, Image Studio & Media Toolkit",
    description:
      "Your all-in-one privacy-first browser toolkit. Edit PDFs, convert & resize images, upscale, and remove backgrounds 100% client-side.",
    url: siteConfig.url,
    siteName: siteConfig.name,
    images: ["/opengraph-image"],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "CraftKit Pro — Free Online PDF Editor, Image Studio & Media Toolkit",
    description:
      "Your all-in-one privacy-first browser toolkit. Edit PDFs, convert & resize images, upscale, and remove backgrounds 100% client-side.",
    images: ["/opengraph-image"],
  },
};

export default function LandingPage() {
  const pdfTools = [
    { name: "Annotate & Edit", desc: "Modify text, styles, fonts, and colors directly.", icon: Edit3 },
    { name: "Merge & Organize", desc: "Combine multiple PDFs and reorder, rotate, or delete pages.", icon: Merge },
    { name: "Redact & Whiteout", desc: "Conceal sensitive content using secure whiteout masking.", icon: EyeOff },
  ];

  const imageTools = [
    { name: "Convert & Compress", desc: "Batch transform formats and shrink image file sizes.", icon: Ruler },
    { name: "AI BG Remover", desc: "Locally extract subjects to make backgrounds transparent.", icon: Eraser },
    { name: "AI Upscaling", desc: "Enhance resolution up to 4x using interpolation models.", icon: Maximize },
  ];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "CraftKit Pro",
    "url": siteConfig.url,
    "description": "Your all-in-one privacy-first browser toolkit. Edit PDFs, convert & resize images, upscale, and remove backgrounds 100% client-side.",
    "applicationCategory": "MultimediaApplication",
    "operatingSystem": "All modern web browsers",
    "browserRequirements": "Requires HTML5, WebAssembly, WebGL",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    },
    "featureList": [
      "PDF editing and annotation",
      "PDF merging and organization",
      "Batch image compression and resizing",
      "AI background removal",
      "AI image upscaling"
    ],
    "mainEntity": {
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "Are my files uploaded to any servers?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "No, never. CraftKit Pro operates 100% client-side. The tools leverage WebAssembly, HTML5 APIs, and WebGPU/WebGL to process your PDF documents and images locally directly inside your browser. No files, logs, or metadata are ever transmitted or stored on any server."
          }
        },
        {
          "@type": "Question",
          "name": "Why is it completely free and uncapped?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Since all file processing runs on your local computer's processor (CPU/GPU) instead of our servers, we don't have to pay massive cloud computing bills. This allows us to keep the entire toolkit completely free, with no paywalls, subscriptions, watermark stamps, or file count limits."
          }
        }
      ]
    }
  };

  return (
    <div className="relative overflow-hidden bg-[#0a0a0a] min-h-screen flex flex-col justify-center">
      {/* JSON-LD Structured Data */}
      <JsonLd data={jsonLd} />

      {/* Premium Glassmorphic Glows */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-[#0a84ff]/10 blur-[130px]" />
        <div className="absolute top-[30%] right-[-15%] w-[50%] h-[50%] rounded-full bg-[#00c6ff]/10 blur-[160px]" />
        <div className="absolute bottom-[-10%] left-[10%] w-[50%] h-[50%] rounded-full bg-[#00f0ff]/5 blur-[140px]" />
        {/* Subtle grid pattern background */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f1f23_1px,transparent_1px),linear-gradient(to_bottom,#1f1f23_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-30" />
      </div>

      {/* Hero Headline Section */}
      <header className="relative z-10 max-w-7xl mx-auto px-4 pt-28 pb-12 sm:px-6 lg:px-8 text-center">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold bg-[#0a84ff]/10 text-[#0a84ff] border border-[#0a84ff]/20 rounded-full mb-6 select-none">
          <Sparkles size={12} className="text-[#0a84ff] animate-pulse" /> 100% Browser-Based & Secure
        </span>
        <h1 className="text-4xl sm:text-7xl font-extrabold tracking-tight text-white mb-6 leading-tight max-w-5xl mx-auto">
          Craft & Optimize Your Media with{" "}
          <span className="bg-gradient-to-r from-[#0a84ff] via-[#00c6ff] to-[#00f0ff] bg-clip-text text-transparent">
            Absolute Privacy
          </span>
        </h1>
        <p className="text-base sm:text-xl text-[#8e8e93] max-w-3xl mx-auto mb-10 leading-relaxed">
          The professional-grade client-side suite. Process your documents and images completely locally inside your browser. No files are uploaded to servers, no registration required, 100% free.
        </p>
        <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
          <Link
            href="/pdf-editor"
            className="w-full sm:w-auto px-8 py-4 text-base font-bold text-white bg-[#0a84ff] hover:bg-[#0070e3] active:scale-95 rounded-xl transition-all shadow-lg shadow-[#0a84ff]/20 text-center flex items-center justify-center gap-2 group"
          >
            Launch PDF Studio
            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link
            href="/image-tools"
            className="w-full sm:w-auto px-8 py-4 text-base font-bold text-[#ebebf5] bg-[#1c1c1e] hover:bg-[#2c2c2e] border border-[#2a2a2d] active:scale-95 rounded-xl transition-all text-center flex items-center justify-center gap-2"
          >
            Launch Image Studio
            <ArrowUpRight size={18} />
          </Link>
        </div>
      </header>

      {/* Interactive Local Processor Sandbox (Try-It Section) */}
      <section className="relative z-10 py-12 px-4 sm:px-6 lg:px-8">
        <InteractiveSandbox />
      </section>

      {/* Privacy & Engine Highlights */}
      <section className="relative z-10 border-y border-[#2a2a2d] bg-[#111112]/40 backdrop-blur-md py-12 my-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-[#1c1c1e] border border-[#2a2a2d] rounded-2xl text-[#0a84ff] shadow-inner">
                <ShieldCheck size={24} />
              </div>
              <div className="space-y-1">
                <h3 className="text-[16px] font-bold text-white">Zero File Uploads</h3>
                <p className="text-xs sm:text-sm text-[#8e8e93] leading-relaxed">
                  WebAssembly & HTML5 scripts process your data locally. Your sensitive files never leave your computer.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="p-3 bg-[#1c1c1e] border border-[#2a2a2d] rounded-2xl text-[#00c6ff] shadow-inner">
                <Zap size={24} />
              </div>
              <div className="space-y-1">
                <h3 className="text-[16px] font-bold text-white">Instant Rendering</h3>
                <p className="text-xs sm:text-sm text-[#8e8e93] leading-relaxed">
                  Direct hardware-accelerated processing means zero upload queues, zero wait times, and lightning-fast exports.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="p-3 bg-[#1c1c1e] border border-[#2a2a2d] rounded-2xl text-[#00f0ff] shadow-inner">
                <HardDrive size={24} />
              </div>
              <div className="space-y-1">
                <h3 className="text-[16px] font-bold text-white">100% Free & Uncapped</h3>
                <p className="text-xs sm:text-sm text-[#8e8e93] leading-relaxed">
                  No subscriptions, paywalls, watermark stamps, or daily constraints. The complete professional suite is yours.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Studio Portals Grid */}
      <section className="relative z-10 max-w-7xl mx-auto px-4 py-20 sm:px-6 lg:px-8 space-y-16">
        <div className="text-center space-y-3">
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            Explore Creative Studios
          </h2>
          <p className="text-[#8e8e93] max-w-2xl mx-auto text-[15px] sm:text-base">
            Choose a specialized studio suite to begin crafting your digital assets.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* PDF Craft Studio Portal */}
          <div className="group relative rounded-3xl border border-[#2a2a2d] bg-[#111112]/90 hover:border-[#0a84ff]/60 hover:bg-[#141416]/95 p-8 flex flex-col justify-between transition-all duration-300 shadow-lg">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="p-4 bg-[#0a84ff]/10 border border-[#0a84ff]/20 rounded-2xl text-[#0a84ff] group-hover:scale-110 transition-transform">
                  <FileText size={32} />
                </div>
                <span className="px-3 py-1 text-[10px] font-bold text-[#0a84ff] bg-[#0a84ff]/10 border border-[#0a84ff]/20 rounded-full uppercase tracking-wider">
                  PDF Suite
                </span>
              </div>
              <div className="space-y-2">
                <h3 className="text-2xl font-bold text-white group-hover:text-[#0a84ff] transition-colors">
                  PDF Craft Studio
                </h3>
                <p className="text-sm text-[#8e8e93] leading-relaxed">
                  An advanced browser-based PDF compiler and annotator. Edit text in-place, manage layout pagination, and markup pages locally.
                </p>
              </div>
              <div className="pt-4 border-t border-[#2a2a2d] space-y-3">
                {pdfTools.map((t, idx) => (
                  <div key={idx} className="flex items-center gap-3">
                    <t.icon size={16} className="text-[#0a84ff]" />
                    <span className="text-[13px] text-[#ebebf5] font-semibold">{t.name}</span>
                    <span className="text-[11px] text-[#8e8e93]">— {t.desc}</span>
                  </div>
                ))}
              </div>
            </div>
            <Link
              href="/pdf-editor"
              className="mt-8 py-4 px-6 flex items-center justify-center gap-2 rounded-xl text-[14px] font-bold text-white bg-[#0a84ff] hover:bg-[#0070e3] shadow-lg shadow-[#0a84ff]/10 transition-all active:scale-98"
            >
              Enter PDF Studio <ArrowRight size={16} />
            </Link>
          </div>

          {/* Image Craft Studio Portal */}
          <div className="group relative rounded-3xl border border-[#2a2a2d] bg-[#111112]/90 hover:border-[#00c6ff]/60 hover:bg-[#141416]/95 p-8 flex flex-col justify-between transition-all duration-300 shadow-lg">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="p-4 bg-[#00c6ff]/10 border border-[#00c6ff]/20 rounded-2xl text-[#00c6ff] group-hover:scale-110 transition-transform">
                  <ImageIcon size={32} />
                </div>
                <span className="px-3 py-1 text-[10px] font-bold text-[#00c6ff] bg-[#00c6ff]/10 border border-[#00c6ff]/20 rounded-full uppercase tracking-wider">
                  Image Suite
                </span>
              </div>
              <div className="space-y-2">
                <h3 className="text-2xl font-bold text-white group-hover:text-[#00c6ff] transition-colors">
                  Image Studio
                </h3>
                <p className="text-sm text-[#8e8e93] leading-relaxed">
                  A high-performance batch image processor. Compress, resize, crop, watermark, run client-side transparent AI background isolation, and upscale.
                </p>
              </div>
              <div className="pt-4 border-t border-[#2a2a2d] space-y-3">
                {imageTools.map((t, idx) => (
                  <div key={idx} className="flex items-center gap-3">
                    <t.icon size={16} className="text-[#00c6ff]" />
                    <span className="text-[13px] text-[#ebebf5] font-semibold">{t.name}</span>
                    <span className="text-[11px] text-[#8e8e93]">— {t.desc}</span>
                  </div>
                ))}
              </div>
            </div>
            <Link
              href="/image-tools"
              className="mt-8 py-4 px-6 flex items-center justify-center gap-2 rounded-xl text-[14px] font-bold text-white bg-[#00c6ff] hover:bg-[#00b2e6] shadow-lg shadow-[#00c6ff]/10 transition-all active:scale-98"
            >
              Enter Image Studio <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* Local Processing vs Cloud Comparison Section */}
      <section className="relative z-10 max-w-7xl mx-auto px-4 py-20 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center space-y-3">
          <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
            How Local Processing Compares
          </h2>
          <p className="text-[#8e8e93] max-w-2xl mx-auto text-sm sm:text-[15px]">
            Why shifting computing tasks to the browser's local sandbox changes everything.
          </p>
        </div>

        <div className="w-full overflow-x-auto rounded-2xl border border-[#2a2a2d] bg-[#111112]/40 backdrop-blur-md">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#2a2a2d] bg-[#1c1c1e]/50">
                <th className="p-4 sm:p-5 text-xs sm:text-sm font-extrabold text-white">Feature comparison</th>
                <th className="p-4 sm:p-5 text-xs sm:text-sm font-extrabold text-[#0a84ff] flex items-center gap-1.5">
                  <Lock size={14} /> CraftKit Pro (Local)
                </th>
                <th className="p-4 sm:p-5 text-xs sm:text-sm font-extrabold text-[#8e8e93] table-cell">
                  <Globe size={14} className="inline mr-1" /> Cloud-based Tools
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#2a2a2d]/50 text-xs sm:text-sm">
              <tr>
                <td className="p-4 sm:p-5 font-bold text-white">Privacy & Protection</td>
                <td className="p-4 sm:p-5 text-[#30d158] font-semibold flex items-center gap-1">
                  <Check size={16} /> 100% Private (No uploads)
                </td>
                <td className="p-4 sm:p-5 text-[#ff453a] font-semibold table-cell">
                  <X size={16} className="inline mr-1" /> Risk of server breaches
                </td>
              </tr>
              <tr>
                <td className="p-4 sm:p-5 font-bold text-white">Upload & Render Speed</td>
                <td className="p-4 sm:p-5 text-[#30d158] font-semibold">
                  <Check size={16} className="inline mr-1" /> Instant local rendering
                </td>
                <td className="p-4 sm:p-5 text-[#ff453a] font-semibold table-cell">
                  <X size={16} className="inline mr-1" /> Network-bandwidth bottleneck
                </td>
              </tr>
              <tr>
                <td className="p-4 sm:p-5 font-bold text-white">Subscription Costs</td>
                <td className="p-4 sm:p-5 text-[#30d158] font-semibold">
                  <Check size={16} className="inline mr-1" /> 100% Free & Unlimited
                </td>
                <td className="p-4 sm:p-5 text-[#ff453a] font-semibold table-cell">
                  <X size={16} className="inline mr-1" /> Heavy monthly fees
                </td>
              </tr>
              <tr>
                <td className="p-4 sm:p-5 font-bold text-white">Export Stamps / Watermarks</td>
                <td className="p-4 sm:p-5 text-[#30d158] font-semibold">
                  <Check size={16} className="inline mr-1" /> Zero watermarks
                </td>
                <td className="p-4 sm:p-5 text-[#ff453a] font-semibold table-cell">
                  <X size={16} className="inline mr-1" /> Watermarks on free plans
                </td>
              </tr>
              <tr>
                <td className="p-4 sm:p-5 font-bold text-white">Offline Capability</td>
                <td className="p-4 sm:p-5 text-[#30d158] font-semibold">
                  <Check size={16} className="inline mr-1" /> Works offline entirely
                </td>
                <td className="p-4 sm:p-5 text-[#ff453a] font-semibold table-cell">
                  <X size={16} className="inline mr-1" /> Fails completely offline
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* Dynamic Roadmapped/Future Studios Teaser Grid */}
      <section className="relative z-10 max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8 space-y-6">
        <div className="border-t border-[#2a2a2d] pt-16 text-center space-y-2">
          <h3 className="text-xl font-bold text-white">Upcoming Free Platforms</h3>
          <p className="text-xs sm:text-sm text-[#8e8e93]">
            We are continuously building new local processors to expand your workspace toolkit.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="p-6 bg-[#111112]/30 border border-[#2a2a2d]/50 rounded-2xl flex items-center gap-4 opacity-70 hover:opacity-100 transition-opacity">
            <div className="p-3 bg-[#1c1c1e] rounded-xl text-[#8e8e93]">
              <Video size={24} />
            </div>
            <div>
              <h4 className="text-[15px] font-bold text-white">Video Craft Studio</h4>
              <p className="text-xs text-[#8e8e93]">Client-side FFmpeg MP4 trim, conversion, and optimization.</p>
            </div>
          </div>
          <div className="p-6 bg-[#111112]/30 border border-[#2a2a2d]/50 rounded-2xl flex items-center gap-4 opacity-70 hover:opacity-100 transition-opacity">
            <div className="p-3 bg-[#1c1c1e] rounded-xl text-[#8e8e93]">
              <Music size={24} />
            </div>
            <div>
              <h4 className="text-[15px] font-bold text-white">Audio Craft Studio</h4>
              <p className="text-xs text-[#8e8e93]">Local WAV/MP3 compression, splicing, and formatting.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive FAQ Section */}
      <section className="relative z-10 max-w-7xl mx-auto px-4 py-20 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center space-y-3">
          <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
            Frequently Asked Questions
          </h2>
          <p className="text-[#8e8e93] max-w-2xl mx-auto text-sm sm:text-[15px]">
            Have questions about security, features, or restrictions? We have answers.
          </p>
        </div>
        <FaqSection />
      </section>
    </div>
  );
}
