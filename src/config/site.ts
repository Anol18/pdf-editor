export const siteConfig = {
  name: "CraftKit Pro",
  shortName: "CraftKit",
  description:
    "Free, privacy-first browser toolkit to edit PDFs, convert & resize images, upscale resolution, and remove backgrounds 100% client-side without cloud server uploads.",
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://pdf-editor-liard-delta.vercel.app",
  ogImage: "https://pdf-editor-liard-delta.vercel.app/opengraph-image",
  author: "CraftKit Pro Team",
  creator: "CraftKit Pro",
  publisher: "CraftKit Pro",
  keywords: [
    "pdf editor online",
    "free pdf editor",
    "edit pdf text free",
    "merge pdf online",
    "image compressor",
    "convert heic to jpg",
    "bg remover client side",
    "ai upscale image local",
    "pdf annotate browser",
    "privacy first pdf tools",
    "exif metadata cleaner",
    "strip gps metadata",
    "offline browser tools",
  ],
  themeColor: "#0a0a0a",
  googleVerification: "sm6hvo29FmY-cHELw56K6CxxWsIBp-m5zNdiG3DBgbY",
};

export type SiteConfig = typeof siteConfig;
