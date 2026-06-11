import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "PDFCraft Pro — Free Online browser-based PDF Editor & Merger",
  description:
    "Edit, annotate, whiteout, draw, and merge PDFs completely in your browser. Private, secure, fast, and 100% local processing. No files are uploaded to servers.",
  keywords: [
    "pdf editor",
    "merge pdf",
    "online pdf editor",
    "free pdf editor",
    "annotate pdf",
    "pdf whiteout",
    "pdf redaction",
    "local pdf processing",
    "secure pdf editor",
  ],
  openGraph: {
    title: "PDFCraft Pro — Free Online browser-based PDF Editor & Merger",
    description:
      "Edit, annotate, whiteout, draw, and merge PDFs completely in your browser. Private, secure, and fast.",
    type: "website",
  },
};

export default function LandingPage() {
  const tools = [
    {
      title: "PDF Editor & Annotator",
      description: "Directly insert and edit text, modify font size, family, colors, and styles in place.",
      icon: "✍️",
      link: "/pdf-editor",
    },
    {
      title: "PDF Merger & Page Manager",
      description: "Upload multiple PDFs to merge them into one. Reorder, duplicate, rotate, or delete pages easily.",
      icon: "🔀",
      link: "/pdf-editor",
    },
    {
      title: "Redact & Whiteout",
      description: "Apply secure background masks (whiteout) over existing PDF elements to cover sensitive text.",
      icon: "⬜",
      link: "/pdf-editor",
    },
    {
      title: "Draw & Markup",
      description: "Use the freehand pencil or highlighter to underline, circle, or annotate directly on the pages.",
      icon: "✏️",
      link: "/pdf-editor",
    },
  ];

  return (
    <div className="relative overflow-hidden bg-[#0a0a0a] min-h-screen flex flex-col justify-center">
      {/* Background Gradients */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-[#0a84ff]/10 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] rounded-full bg-[#00c6ff]/10 blur-[150px]" />
      </div>

      {/* Hero Section */}
      <section className="relative z-10 max-w-7xl mx-auto px-4 pt-20 pb-16 sm:px-6 lg:px-8 text-center">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold bg-[#0a84ff]/10 text-[#0a84ff] border border-[#0a84ff]/20 rounded-full mb-6">
          ✨ 100% Client-Side & Secure
        </span>
        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white mb-6 leading-tight max-w-4xl mx-auto">
          Craft & Edit Your PDFs with{" "}
          <span className="bg-gradient-to-r from-[#0a84ff] via-[#00c6ff] to-[#00f0ff] bg-clip-text text-transparent">
            Ultimate Control
          </span>
        </h1>
        <p className="text-lg sm:text-xl text-[#8e8e93] max-w-2xl mx-auto mb-10 leading-relaxed">
          The professional-grade, browser-based editor that lets you edit text, annotate, merge, and optimize PDFs completely locally. No sign-up, no server uploads, absolute privacy.
        </p>
        <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
          <Link
            href="/pdf-editor"
            className="w-full sm:w-auto px-8 py-4 text-base font-bold text-white bg-[#0a84ff] hover:bg-[#0070e3] active:scale-95 rounded-xl transition-all shadow-lg shadow-[#0a84ff]/30 text-center"
          >
            Launch Free Editor
          </Link>
          <Link
            href="#tools"
            className="w-full sm:w-auto px-8 py-4 text-base font-bold text-[#ebebf5] bg-[#1c1c1e] hover:bg-[#2c2c2e] border border-[#2a2a2d] active:scale-95 rounded-xl transition-all text-center"
          >
            Explore Tools
          </Link>
        </div>
      </section>

      {/* Trust & Security Highlight */}
      <section className="relative z-10 border-y border-[#2a2a2d] bg-[#111112]/50 backdrop-blur-sm py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
            <div className="flex flex-col gap-2">
              <span className="text-xl">🔒</span>
              <h3 className="text-sm font-semibold text-white">Absolute Privacy</h3>
              <p className="text-[13px] text-[#8e8e93]">
                Your documents never touch our servers. All processing and exporting happen directly inside your web browser.
              </p>
            </div>
            <div className="flex flex-col gap-2">
              <span className="text-xl">⚡</span>
              <h3 className="text-sm font-semibold text-white">Lightning Fast</h3>
              <p className="text-[13px] text-[#8e8e93]">
                Zero upload or download queues. Instant rendering, scaling, and edits powered by hardware-accelerated canvas.
              </p>
            </div>
            <div className="flex flex-col gap-2">
              <span className="text-xl">🆓</span>
              <h3 className="text-sm font-semibold text-white">No Limits, Free</h3>
              <p className="text-[13px] text-[#8e8e93]">
                Edit, compress, and export without watermarks, daily limits, or paid upgrades. The full toolset is yours.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Tools Section */}
      <section id="tools" className="relative z-10 max-w-7xl mx-auto px-4 py-24 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Everything You Need Under One Tool
          </h2>
          <p className="text-[#8e8e93] max-w-2xl mx-auto text-[15px]">
            Discover premium functionalities tailored for creators, developers, and professionals.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {tools.map((tool, index) => (
            <Link
              key={index}
              href={tool.link}
              className="group flex flex-col p-6 rounded-2xl bg-[#111112] border border-[#2a2a2d] hover:border-[#0a84ff]/50 hover:bg-[#151517] transition-all duration-300"
            >
              <div className="flex items-center gap-4 mb-4">
                <span className="text-3xl bg-[#1c1c1e] p-2.5 rounded-xl group-hover:bg-[#0a84ff]/10 group-hover:scale-110 transition-all">
                  {tool.icon}
                </span>
                <h3 className="text-lg font-bold text-white group-hover:text-[#0a84ff] transition-colors">
                  {tool.title}
                </h3>
              </div>
              <p className="text-[14px] text-[#8e8e93] leading-relaxed group-hover:text-[#ebebf5] transition-colors">
                {tool.description}
              </p>
              <span className="mt-4 text-[12px] font-semibold text-[#0a84ff] flex items-center gap-1 group-hover:translate-x-1.5 transition-transform">
                Launch tool <span>→</span>
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* Feature Walkthrough */}
      <section className="relative z-10 max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8 border-t border-[#2a2a2d]">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-bold text-white mb-6 leading-snug">
              Intuitive Interface Designed for Perfect Precision
            </h2>
            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[#0a84ff]/10 border border-[#0a84ff]/20 text-[#0a84ff] flex items-center justify-center font-bold text-sm">
                  1
                </div>
                <div>
                  <h4 className="text-white font-semibold mb-1">Drag and Drop Upload</h4>
                  <p className="text-xs text-[#8e8e93]">Quickly throw any PDF into the dropzone. It renders instantly.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[#0a84ff]/10 border border-[#0a84ff]/20 text-[#0a84ff] flex items-center justify-center font-bold text-sm">
                  2
                </div>
                <div>
                  <h4 className="text-white font-semibold mb-1">Add, Modify, and Align Elements</h4>
                  <p className="text-xs text-[#8e8e93]">Insert shapes, highlights, text, or draw directly. Use the properties panel to tweak colors, widths, opacity, and layering.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[#0a84ff]/10 border border-[#0a84ff]/20 text-[#0a84ff] flex items-center justify-center font-bold text-sm">
                  3
                </div>
                <div>
                  <h4 className="text-white font-semibold mb-1">Export Compressed PDF</h4>
                  <p className="text-xs text-[#8e8e93]">Select between Low, Medium, and High compression profiles to export files perfectly sized for email attachments.</p>
                </div>
              </div>
            </div>
            <Link
              href="/pdf-editor"
              className="inline-block mt-8 px-6 py-3 text-[14px] font-bold text-white bg-[#0a84ff] hover:bg-[#0070e3] rounded-lg transition-colors"
            >
              Get Started Now
            </Link>
          </div>
          <div className="relative rounded-2xl overflow-hidden border border-[#2a2a2d] bg-[#111112] p-4 aspect-video flex items-center justify-center">
            {/* Visual Representation of Editor UI */}
            <div className="w-full h-full border border-[#2a2a2d] rounded-lg bg-[#0a0a0a] flex flex-col overflow-hidden">
              <div className="h-8 border-b border-[#2a2a2d] bg-[#111112] flex items-center px-3 gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
                <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/80" />
                <div className="w-2.5 h-2.5 rounded-full bg-green-500/80" />
                <div className="ml-4 text-[10px] text-[#48484a]">pdfcraft-pro-editor.local</div>
              </div>
              <div className="flex-1 flex bg-[#141416]">
                <div className="w-16 border-r border-[#2a2a2d] bg-[#1c1c1e] flex flex-col gap-2 p-2">
                  <div className="h-6 w-full rounded bg-[#2c2c2e]" />
                  <div className="h-6 w-full rounded bg-[#0a84ff]" />
                  <div className="h-6 w-full rounded bg-[#2c2c2e]" />
                </div>
                <div className="flex-1 p-4 flex justify-center items-center">
                  <div className="w-[120px] h-[160px] bg-white rounded shadow-xl flex flex-col p-3 gap-2">
                    <div className="h-2 w-1/2 bg-gray-200 rounded" />
                    <div className="h-2 w-3/4 bg-gray-200 rounded" />
                    <div className="h-6 w-full border border-dashed border-[#0a84ff] flex items-center justify-center">
                      <span className="text-[6px] text-[#0a84ff]">Text Element</span>
                    </div>
                  </div>
                </div>
                <div className="w-24 border-l border-[#2a2a2d] bg-[#1c1c1e] p-2 gap-2 flex flex-col">
                  <div className="h-2 w-1/2 bg-gray-600 rounded" />
                  <div className="h-4 w-full bg-[#2c2c2e] rounded" />
                  <div className="h-4 w-full bg-[#2c2c2e] rounded" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
