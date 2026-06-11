import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Blog & Guide — Learn PDF Edits, Security & Optimization | PDFCraft Pro",
  description:
    "Discover the latest tutorials, security guidelines, and step-by-step guides on editing, merging, and compressing PDFs safely in the browser.",
  keywords: [
    "pdf guides",
    "how to edit pdf text",
    "secure pdf merging",
    "pdf compression tutorial",
    "browser pdf editor safety",
  ],
};

const POSTS = [
  {
    slug: "edit-pdf-text-online-locally",
    title: "How to Edit PDF Text Online Without Uploading to Servers",
    excerpt: "Most online PDF editors upload your sensitive files to cloud servers. Discover how browser-based WebAssembly editors let you edit PDF text 100% locally.",
    date: "June 11, 2026",
    readTime: "4 min read",
    category: "Security & Privacy",
  },
  {
    slug: "merge-multiple-pdfs-guide",
    title: "Merging PDFs: Why Local-First Web Tools are the Future",
    excerpt: "Need to combine tax documents, design portfolios, or reports? Learn why local-first merging tools are faster, safer, and completely limit-free.",
    date: "June 08, 2026",
    readTime: "5 min read",
    category: "Productivity",
  },
  {
    slug: "pdf-compression-explained",
    title: "PDF Compression Demystified: Low vs High Quality Profiles",
    excerpt: "Struggling with email attachment size limits? We break down how PDF image compression works, what DPI is right for you, and how to shrink files without blur.",
    date: "May 29, 2026",
    readTime: "6 min read",
    category: "Guides",
  },
];

export default function BlogPage() {
  return (
    <div className="bg-[#0a0a0a] min-h-screen py-20 relative overflow-hidden">
      {/* Background Gradients */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-[#0a84ff]/5 blur-[100px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[45%] h-[45%] rounded-full bg-[#00c6ff]/5 blur-[120px]" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="text-center mb-16">
          <span className="px-3 py-1 text-xs font-semibold bg-[#0a84ff]/10 text-[#0a84ff] border border-[#0a84ff]/20 rounded-full mb-4 inline-block">
            📚 Articles & Guides
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white mb-4">
            Insights & Guides
          </h1>
          <p className="text-[#8e8e93] max-w-xl mx-auto text-[14px]">
            Master PDF editing, document security, and file optimization with our expert-written articles.
          </p>
        </div>

        {/* Blog Posts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {POSTS.map((post) => (
            <article
              key={post.slug}
              className="flex flex-col p-6 bg-[#111112] border border-[#2a2a2d] hover:border-[#0a84ff]/40 rounded-2xl transition-all duration-200 group"
            >
              <div className="flex items-center justify-between gap-2 mb-4">
                <span className="px-2.5 py-0.5 text-[10px] font-semibold bg-[#2c2c2e] text-[#ebebf5] rounded-full">
                  {post.category}
                </span>
                <span className="text-[11px] text-[#8e8e93]">{post.readTime}</span>
              </div>
              <h2 className="text-base font-bold text-white mb-3 leading-snug group-hover:text-[#0a84ff] transition-colors line-clamp-2">
                {post.title}
              </h2>
              <p className="text-[12px] text-[#8e8e93] leading-relaxed mb-6 flex-1 line-clamp-4">
                {post.excerpt}
              </p>
              <div className="border-t border-[#2a2a2d] pt-4 mt-auto flex items-center justify-between">
                <span className="text-[11px] text-[#48484a]">{post.date}</span>
                <span className="text-[11px] font-bold text-[#0a84ff] hover:underline flex items-center gap-1">
                  Read Guide <span>→</span>
                </span>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
