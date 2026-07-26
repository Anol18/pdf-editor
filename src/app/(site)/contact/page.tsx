import type { Metadata } from "next";
import { ContactForm } from "@/components/ContactForm";
import { siteConfig } from "@/config/site";
import { JsonLd } from "@/components/seo/JsonLd";
import { getBreadcrumbSchema } from "@/lib/seo-schemas";

export const metadata: Metadata = {
  title: "Contact Support & Feedback — CraftKit Pro",
  description:
    "Have feature requests, questions, or custom inquiries? Reach out to CraftKit Pro support team. We would love to hear from you.",
  keywords: [
    "contact craftkit pro",
    "pdf editor support",
    "feature requests",
    "pdf tool feedback",
    "contact media toolkit creator",
  ],
  alternates: {
    canonical: "/contact",
  },
  openGraph: {
    title: "Contact Support & Feedback — CraftKit Pro",
    description:
      "Have feature requests, questions, or custom inquiries? Reach out to CraftKit Pro support team.",
    url: `${siteConfig.url}/contact`,
    siteName: siteConfig.name,
    images: ["/opengraph-image"],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Contact Support & Feedback — CraftKit Pro",
    description:
      "Have feature requests, questions, or custom inquiries? Reach out to CraftKit Pro support team.",
    images: ["/opengraph-image"],
  },
};

export default function ContactPage() {
  const breadcrumbSchema = getBreadcrumbSchema([
    { name: "Home", item: "/" },
    { name: "Contact", item: "/contact" },
  ]);

  const contactSchema = {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    "name": "Contact CraftKit Pro",
    "url": `${siteConfig.url}/contact`,
    "description": "Send feedback, report issues, or suggest new features for CraftKit Pro.",
  };

  return (
    <div className="bg-[#0a0a0a] min-h-screen py-20 relative overflow-hidden">
      <JsonLd data={[breadcrumbSchema, contactSchema]} />
      {/* Background Gradients */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-[#0a84ff]/5 blur-[100px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[45%] h-[45%] rounded-full bg-[#00c6ff]/5 blur-[120px]" />
      </div>

      <div className="relative z-10 max-w-xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="text-center mb-10">
          <span className="px-3 py-1 text-xs font-semibold bg-[#0a84ff]/10 text-[#0a84ff] border border-[#0a84ff]/20 rounded-full mb-4 inline-block">
            ✉️ Get in Touch
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white mb-4">
            Contact Us
          </h1>
          <p className="text-[#8e8e93] text-[14px]">
            Send us feedback, report issues, or suggest new tool features.
          </p>
        </div>

        {/* Contact Form Wrapper */}
        <ContactForm />
      </div>
    </div>
  );
}
