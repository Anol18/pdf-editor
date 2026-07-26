import type { Metadata } from "next";
import { ImageToolsLayout } from "@/components/image-tools/ImageToolsLayout";
import { siteConfig } from "@/config/site";
import { JsonLd } from "@/components/seo/JsonLd";
import { getWebApplicationSchema, getBreadcrumbSchema } from "@/lib/seo-schemas";

export const metadata: Metadata = {
  title: "Image Studio — Free Online Image Converter, Compressor & AI BG Remover",
  description:
    "Production-ready suite of client-side image editing tools. Convert formats (HEIC, PNG, JPG, WebP), batch compress, crop, resize, watermark, upscale, remove backgrounds, and clean EXIF GPS metadata locally.",
  keywords: [
    "convert format",
    "image compressor",
    "batch resize",
    "image cropper",
    "watermark stamp",
    "transparent png removal",
    "ai upscale",
    "heic to jpg",
    "metadata inspector",
    "clean exif",
    "strip gps metadata",
    "image privacy cleaner",
  ],
  alternates: {
    canonical: "/image-tools",
  },
  openGraph: {
    title: "Image Studio — Free Online Image Converter, Compressor & AI BG Remover",
    description:
      "Convert HEIC/PNG/WebP, compress file sizes, remove backgrounds with AI, and sanitize EXIF metadata 100% locally.",
    url: `${siteConfig.url}/image-tools`,
    siteName: siteConfig.name,
    images: ["/opengraph-image"],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Image Studio — Free Online Image Converter, Compressor & AI BG Remover",
    description:
      "Convert HEIC/PNG/WebP, compress file sizes, remove backgrounds with AI, and sanitize EXIF metadata 100% locally.",
    images: ["/opengraph-image"],
  },
};

export default function ImageToolsPage() {
  const appSchema = getWebApplicationSchema({
    name: "CraftKit Pro Image Studio",
    url: `${siteConfig.url}/image-tools`,
    description:
      "Batch convert, compress, crop, watermark, upscale images, remove backgrounds, and strip EXIF location metadata.",
    applicationCategory: "MultimediaApplication",
    featureList: [
      "HEIC, WebP, PNG, JPG format conversion",
      "Batch compression and resolution resizing",
      "AI-powered background removal",
      "EXIF and GPS metadata inspector & cleaner",
      "Hardware-accelerated upscaling",
    ],
  });

  const breadcrumbSchema = getBreadcrumbSchema([
    { name: "Home", item: "/" },
    { name: "Image Studio", item: "/image-tools" },
  ]);

  return (
    <>
      <JsonLd data={[appSchema, breadcrumbSchema]} />
      <ImageToolsLayout />
    </>
  );
}
