// ============================================================
// src/app/(site)/image-tools/page.tsx
// ============================================================

import type { Metadata } from "next";
import { ImageToolsLayout } from "@/components/image-tools/ImageToolsLayout";

export const metadata: Metadata = {
  title: "Image Studio — Online Image Processing, Metadata Inspector & Cleaner Tools",
  description:
    "Production-ready suite of image editing tools. Convert formats, compress sizes, crop, resize, rotate, add watermarks, upscale, remove backgrounds, and inspect or clean EXIF metadata locally.",
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
};

export default function ImageToolsPage() {
  return <ImageToolsLayout />;
}
