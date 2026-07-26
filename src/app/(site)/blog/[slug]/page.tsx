import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { siteConfig } from "@/config/site";
import { JsonLd } from "@/components/seo/JsonLd";
import { getArticleSchema, getBreadcrumbSchema } from "@/lib/seo-schemas";
import { ArrowLeft, Calendar, Clock, ShieldCheck, Tag } from "lucide-react";

interface Post {
  slug: string;
  title: string;
  excerpt: string;
  content: string[];
  date: string;
  readTime: string;
  category: string;
}

const POSTS_DATA: Record<string, Post> = {
  "edit-pdf-text-online-locally": {
    slug: "edit-pdf-text-online-locally",
    title: "How to Edit PDF Text Online Without Uploading to Servers",
    excerpt:
      "Most online PDF editors upload your sensitive files to cloud servers. Discover how browser-based WebAssembly editors let you edit PDF text 100% locally.",
    category: "Security & Privacy",
    date: "2026-06-11",
    readTime: "4 min read",
    content: [
      "When you use a conventional online PDF editor, your file is transmitted over the internet to a third-party server. There, cloud workers modify your file and send it back. While convenient, this poses a severe security risk for confidential contracts, financial sheets, and legal documents.",
      "With modern WebAssembly and client-side JavaScript APIs, PDF parsing and modification can run entirely inside your web browser sandbox. Libraries like PDF-lib and PDF.js allow rendering and modifying text, font styles, vectors, and annotations directly on your device's memory.",
      "Key Benefits of Client-Side PDF Editing:",
      "1. Absolute Privacy: No files leave your machine.",
      "2. Zero Latency: Immediate rendering without upload/download delays.",
      "3. Offline Capability: Continues working even without an internet connection.",
      "CraftKit Pro uses this local-first architecture to ensure your sensitive media assets remain 100% private and protected.",
    ],
  },
  "merge-multiple-pdfs-guide": {
    slug: "merge-multiple-pdfs-guide",
    title: "Merging PDFs: Why Local-First Web Tools are the Future",
    excerpt:
      "Need to combine tax documents, design portfolios, or reports? Learn why local-first merging tools are faster, safer, and completely limit-free.",
    category: "Productivity",
    date: "2026-06-08",
    readTime: "5 min read",
    content: [
      "Combining multiple PDF documents into a single cohesive report is one of the most common document workflows. Traditional online tools often restrict free users to 2 or 3 merges per day or enforce maximum file size thresholds.",
      "By utilizing browser-native memory streaming, local-first PDF tools remove artificial paywalls and file count limits completely. Because server bandwidth costs do not exist for local execution, you can merge dozens of high-resolution PDFs instantly.",
      "Step-by-Step for Efficient PDF Merging:",
      "1. Drag and drop all PDF source files into the browser workspace.",
      "2. Reorder pages using visual thumbnail previews.",
      "3. Rotate or delete unwanted pages in place.",
      "4. Click Export to bundle all pages into a new clean PDF.",
    ],
  },
  "pdf-compression-explained": {
    slug: "pdf-compression-explained",
    title: "PDF Compression Demystified: Low vs High Quality Profiles",
    excerpt:
      "Struggling with email attachment size limits? We break down how PDF image compression works, what DPI is right for you, and how to shrink files without blur.",
    category: "Guides",
    date: "2026-05-29",
    readTime: "6 min read",
    content: [
      "Large PDF files are almost always caused by high-res embedded raster images (scanned contracts, photos, designs). When compressing a PDF, algorithms downsample these images and adjust JPEG quality ratios.",
      "Understanding DPI & Quality Trade-Offs:",
      "• High Quality (150-300 DPI): Best for print distribution and official archives.",
      "• Web/Email Profile (72-100 DPI): Optimal for quick email attachments and fast mobile web downloads.",
      "Using local compression algorithms guarantees that image resampling happens on your CPU GPU acceleration, preserving visual crispness while drastically dropping file size.",
    ],
  },
};

export async function generateStaticParams() {
  return Object.keys(POSTS_DATA).map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = POSTS_DATA[slug];

  if (!post) {
    return {
      title: "Article Not Found",
    };
  }

  return {
    title: `${post.title} | ${siteConfig.name}`,
    description: post.excerpt,
    alternates: {
      canonical: `/blog/${post.slug}`,
    },
    openGraph: {
      title: post.title,
      description: post.excerpt,
      url: `${siteConfig.url}/blog/${post.slug}`,
      siteName: siteConfig.name,
      type: "article",
      publishedTime: post.date,
      authors: [siteConfig.name],
      images: ["/opengraph-image"],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.excerpt,
      images: ["/opengraph-image"],
    },
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = POSTS_DATA[slug];

  if (!post) {
    notFound();
  }

  const breadcrumbSchema = getBreadcrumbSchema([
    { name: "Home", item: "/" },
    { name: "Blog", item: "/blog" },
    { name: post.title, item: `/blog/${post.slug}` },
  ]);

  const articleSchema = getArticleSchema({
    title: post.title,
    description: post.excerpt,
    url: `${siteConfig.url}/blog/${post.slug}`,
    datePublished: post.date,
  });

  return (
    <article className="bg-[#0a0a0a] min-h-screen py-20 relative overflow-hidden">
      <JsonLd data={[breadcrumbSchema, articleSchema]} />

      {/* Background Gradients */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-[#0a84ff]/5 blur-[100px]" />
      </div>

      <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 text-xs font-semibold text-[#8e8e93] hover:text-[#0a84ff] transition-colors mb-8"
        >
          <ArrowLeft size={14} /> Back to Articles
        </Link>

        <div className="space-y-4 mb-10">
          <div className="flex items-center gap-3 flex-wrap">
            <span className="px-3 py-1 text-xs font-semibold bg-[#0a84ff]/10 text-[#0a84ff] border border-[#0a84ff]/20 rounded-full inline-flex items-center gap-1.5">
              <Tag size={12} /> {post.category}
            </span>
            <span className="text-xs text-[#8e8e93] flex items-center gap-1">
              <Calendar size={12} /> {post.date}
            </span>
            <span className="text-xs text-[#8e8e93] flex items-center gap-1">
              <Clock size={12} /> {post.readTime}
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold text-white leading-tight">
            {post.title}
          </h1>

          <p className="text-base text-[#8e8e93] leading-relaxed italic border-l-2 border-[#0a84ff] pl-4 py-1">
            {post.excerpt}
          </p>
        </div>

        <div className="p-6 bg-[#111112] border border-[#2a2a2d] rounded-2xl space-y-6 text-[#ebebf5] text-sm leading-relaxed">
          {post.content.map((paragraph, idx) => (
            <p key={idx}>{paragraph}</p>
          ))}
        </div>

        <div className="mt-12 p-6 bg-[#0a84ff]/10 border border-[#0a84ff]/20 rounded-2xl flex items-center gap-4">
          <ShieldCheck size={28} className="text-[#0a84ff] shrink-0" />
          <div>
            <h4 className="text-sm font-bold text-white">Privacy Guarantee</h4>
            <p className="text-xs text-[#8e8e93]">
              CraftKit Pro tools process all document and image files locally inside your browser sandbox.
            </p>
          </div>
        </div>
      </div>
    </article>
  );
}
