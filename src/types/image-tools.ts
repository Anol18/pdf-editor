// ============================================================
// src/types/image-tools.ts
// ============================================================

export type ImageToolType =
  | "convert"
  | "compress"
  | "resize"
  | "crop"
  | "rotate"
  | "watermark"
  | "background-removal"
  | "upscale"
  | "metadata-inspector";

export interface MetadataSettings {
  removeGps: boolean;
  removeAuthor: boolean;
  removeSoftware: boolean;
  removeAll: boolean;
}

export interface ImageFile {
  id: string;
  name: string;
  size: number;
  type: string; // e.g. image/png, image/jpeg
  url: string; // Object URL for client-side preview
  file: File; // Raw File object for processing
  width?: number;
  height?: number;
  status: "idle" | "processing" | "success" | "error";
  progress: number;
  error?: string;
  resultUrl?: string; // Data URL or Object URL of processed result
  resultSize?: number;
  resultType?: string;
  metadata?: Record<string, any>;
  privacyReport?: {
    riskLevel: "Low" | "Medium" | "High";
    explanation: string;
    findings: string[];
  };
  metadataRemovedCount?: number;
}

export interface ConvertSettings {
  targetFormat: "png" | "jpeg" | "webp" | "avif" | "gif";
  quality: number; // 1 to 100
}

export interface CompressSettings {
  quality: number; // 1 to 100
}

export type ResizePresetId =
  | "custom"
  | "insta_post"
  | "insta_story"
  | "fb_post"
  | "x_post"
  | "linkedin_post"
  | "yt_thumb"
  | "yt_banner";

export interface ResizePreset {
  id: ResizePresetId;
  name: string;
  width: number;
  height: number;
  aspectRatio: string;
}

export interface ResizeSettings {
  width: number;
  height: number;
  lockAspectRatio: boolean;
  presetId: ResizePresetId;
}

export type CropAspectRatio = "free" | "1:1" | "4:3" | "16:9" | "9:16";

export interface CropArea {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface CropSettings {
  aspect: CropAspectRatio;
  cropArea?: CropArea;
}

export interface RotateSettings {
  angle: 0 | 90 | 180 | 270;
  flipH: boolean;
  flipV: boolean;
}

export type WatermarkPosition =
  | "top-left"
  | "top-center"
  | "top-right"
  | "center"
  | "bottom-left"
  | "bottom-center"
  | "bottom-right";

export interface WatermarkSettings {
  type: "text" | "image";
  text: string;
  fontSize: number;
  color: string;
  opacity: number; // 0 to 1
  position: WatermarkPosition;
  imageWatermarkUrl?: string; // Data URL or object URL of watermark image
  imageWatermarkWidth?: number; // Percent of target image size, e.g. 20 (for 20%)
}

export interface BackgroundRemovalSettings {
  transparent: boolean;
}

export interface UpscaleSettings {
  scale: 2 | 4;
  provider: "mock" | "replicate" | "runpod" | "modal";
}
