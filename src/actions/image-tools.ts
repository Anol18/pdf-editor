// ============================================================
// src/actions/image-tools.ts
// ============================================================

"use server";

import * as processor from "@/services/image-processor";
import { getUpscaleProvider } from "@/services/upscale-provider";
import { WatermarkSettings } from "@/types/image-tools";

interface ActionResponse {
  success: boolean;
  dataUrl?: string;
  size?: number;
  format?: string;
  error?: string;
}

/**
 * Helper to convert File to Buffer
 */
async function fileToBuffer(file: File): Promise<Buffer> {
  const arrayBuffer = await file.arrayBuffer();
  return Buffer.from(arrayBuffer);
}

/**
 * Server Action to convert an image's format.
 */
export async function convertImageAction(formData: FormData): Promise<ActionResponse> {
  try {
    const file = formData.get("file") as File;
    if (!file) throw new Error("File not found in request.");

    const targetFormat = formData.get("targetFormat") as "png" | "jpeg" | "webp" | "avif" | "gif";
    const quality = parseInt(formData.get("quality") as string) || 80;
    const sourceFormat = file.name.split(".").pop();

    const inputBuffer = await fileToBuffer(file);
    const outputBuffer = await processor.convertImage(
      inputBuffer,
      targetFormat,
      quality,
      sourceFormat
    );

    const base64 = outputBuffer.toString("base64");
    const mimeType = targetFormat === "jpeg" ? "image/jpeg" : `image/${targetFormat}`;

    return {
      success: true,
      dataUrl: `data:${mimeType};base64,${base64}`,
      size: outputBuffer.length,
      format: targetFormat,
    };
  } catch (err) {
    return { success: false, error: (err as Error).message };
  }
}

/**
 * Server Action to compress an image's size.
 */
export async function compressImageAction(formData: FormData): Promise<ActionResponse> {
  try {
    const file = formData.get("file") as File;
    if (!file) throw new Error("File not found in request.");

    const quality = parseInt(formData.get("quality") as string) || 75;
    const sourceFormat = file.name.split(".").pop();

    const inputBuffer = await fileToBuffer(file);
    const { buffer: outputBuffer, format } = await processor.compressImage(
      inputBuffer,
      quality,
      sourceFormat
    );

    const base64 = outputBuffer.toString("base64");
    const mimeType = format === "jpeg" ? "image/jpeg" : `image/${format}`;

    return {
      success: true,
      dataUrl: `data:${mimeType};base64,${base64}`,
      size: outputBuffer.length,
      format,
    };
  } catch (err) {
    return { success: false, error: (err as Error).message };
  }
}

/**
 * Server Action to resize an image.
 */
export async function resizeImageAction(formData: FormData): Promise<ActionResponse> {
  try {
    const file = formData.get("file") as File;
    if (!file) throw new Error("File not found in request.");

    const width = parseInt(formData.get("width") as string) || 0;
    const height = parseInt(formData.get("height") as string) || 0;
    const lockAspectRatio = formData.get("lockAspectRatio") === "true";
    const sourceFormat = file.name.split(".").pop();

    const inputBuffer = await fileToBuffer(file);
    const outputBuffer = await processor.resizeImage(
      inputBuffer,
      width,
      height,
      lockAspectRatio,
      sourceFormat
    );

    const base64 = outputBuffer.toString("base64");
    const outFormat = sourceFormat?.toLowerCase() === "heic" || sourceFormat?.toLowerCase() === "heif" 
      ? "jpeg" 
      : sourceFormat || "png";
    const mimeType = outFormat === "jpeg" || outFormat === "jpg" ? "image/jpeg" : `image/${outFormat}`;

    return {
      success: true,
      dataUrl: `data:${mimeType};base64,${base64}`,
      size: outputBuffer.length,
      format: outFormat,
    };
  } catch (err) {
    return { success: false, error: (err as Error).message };
  }
}

/**
 * Server Action to crop an image.
 */
export async function cropImageAction(formData: FormData): Promise<ActionResponse> {
  try {
    const file = formData.get("file") as File;
    if (!file) throw new Error("File not found in request.");

    const x = parseFloat(formData.get("x") as string);
    const y = parseFloat(formData.get("y") as string);
    const width = parseFloat(formData.get("width") as string);
    const height = parseFloat(formData.get("height") as string);
    const sourceFormat = file.name.split(".").pop();

    const inputBuffer = await fileToBuffer(file);
    const outputBuffer = await processor.cropImage(
      inputBuffer,
      x,
      y,
      width,
      height,
      sourceFormat
    );

    const base64 = outputBuffer.toString("base64");
    const outFormat = sourceFormat?.toLowerCase() === "heic" || sourceFormat?.toLowerCase() === "heif" 
      ? "jpeg" 
      : sourceFormat || "png";
    const mimeType = outFormat === "jpeg" || outFormat === "jpg" ? "image/jpeg" : `image/${outFormat}`;

    return {
      success: true,
      dataUrl: `data:${mimeType};base64,${base64}`,
      size: outputBuffer.length,
      format: outFormat,
    };
  } catch (err) {
    return { success: false, error: (err as Error).message };
  }
}

/**
 * Server Action to rotate and flip an image.
 */
export async function rotateImageAction(formData: FormData): Promise<ActionResponse> {
  try {
    const file = formData.get("file") as File;
    if (!file) throw new Error("File not found in request.");

    const angle = (parseInt(formData.get("angle") as string) || 0) as 0 | 90 | 180 | 270;
    const flipH = formData.get("flipH") === "true";
    const flipV = formData.get("flipV") === "true";
    const sourceFormat = file.name.split(".").pop();

    const inputBuffer = await fileToBuffer(file);
    const outputBuffer = await processor.rotateImage(
      inputBuffer,
      angle,
      flipH,
      flipV,
      sourceFormat
    );

    const base64 = outputBuffer.toString("base64");
    const outFormat = sourceFormat?.toLowerCase() === "heic" || sourceFormat?.toLowerCase() === "heif" 
      ? "jpeg" 
      : sourceFormat || "png";
    const mimeType = outFormat === "jpeg" || outFormat === "jpg" ? "image/jpeg" : `image/${outFormat}`;

    return {
      success: true,
      dataUrl: `data:${mimeType};base64,${base64}`,
      size: outputBuffer.length,
      format: outFormat,
    };
  } catch (err) {
    return { success: false, error: (err as Error).message };
  }
}

/**
 * Server Action to apply a text or image watermark.
 */
export async function watermarkImageAction(formData: FormData): Promise<ActionResponse> {
  try {
    const file = formData.get("file") as File;
    if (!file) throw new Error("File not found in request.");

    const settingsJson = formData.get("settings") as string;
    const settings = JSON.parse(settingsJson) as WatermarkSettings;
    const sourceFormat = file.name.split(".").pop();

    const inputBuffer = await fileToBuffer(file);
    const outputBuffer = await processor.watermarkImage(
      inputBuffer,
      settings,
      sourceFormat
    );

    const base64 = outputBuffer.toString("base64");
    const outFormat = sourceFormat?.toLowerCase() === "heic" || sourceFormat?.toLowerCase() === "heif" 
      ? "jpeg" 
      : sourceFormat || "png";
    const mimeType = outFormat === "jpeg" || outFormat === "jpg" ? "image/jpeg" : `image/${outFormat}`;

    return {
      success: true,
      dataUrl: `data:${mimeType};base64,${base64}`,
      size: outputBuffer.length,
      format: outFormat,
    };
  } catch (err) {
    return { success: false, error: (err as Error).message };
  }
}

/**
 * Server Action to remove background.
 */
export async function removeBackgroundAction(formData: FormData): Promise<ActionResponse> {
  try {
    const file = formData.get("file") as File;
    if (!file) throw new Error("File not found in request.");

    const sourceFormat = file.name.split(".").pop();
    const inputBuffer = await fileToBuffer(file);
    
    // Server-side fallback (transparency convert)
    const outputBuffer = await processor.removeBackground(inputBuffer, sourceFormat);

    const base64 = outputBuffer.toString("base64");
    return {
      success: true,
      dataUrl: `data:image/png;base64,${base64}`,
      size: outputBuffer.length,
      format: "png",
    };
  } catch (err) {
    return { success: false, error: (err as Error).message };
  }
}

/**
 * Server Action to upscale an image using a selected AI provider.
 */
export async function upscaleImageAction(formData: FormData): Promise<ActionResponse> {
  try {
    const file = formData.get("file") as File;
    if (!file) throw new Error("File not found in request.");

    const scale = (parseInt(formData.get("scale") as string) || 2) as 2 | 4;
    const providerName = formData.get("provider") as string || "mock";
    const sourceFormat = file.name.split(".").pop();

    const inputBuffer = await fileToBuffer(file);
    
    // Perform upscale via selected provider
    const provider = getUpscaleProvider(providerName);
    const outputBuffer = await provider.upscale(inputBuffer, scale);

    const base64 = outputBuffer.toString("base64");
    const outFormat = sourceFormat?.toLowerCase() === "heic" || sourceFormat?.toLowerCase() === "heif" 
      ? "jpeg" 
      : sourceFormat || "png";
    const mimeType = outFormat === "jpeg" || outFormat === "jpg" ? "image/jpeg" : `image/${outFormat}`;

    return {
      success: true,
      dataUrl: `data:${mimeType};base64,${base64}`,
      size: outputBuffer.length,
      format: outFormat,
    };
  } catch (err) {
    return { success: false, error: (err as Error).message };
  }
}

/**
 * Server Action to extract image metadata using ExifTool.
 */
export async function extractMetadataAction(formData: FormData): Promise<{ success: boolean; data?: any; error?: string }> {
  try {
    const file = formData.get("file") as File;
    if (!file) throw new Error("File not found in request.");

    const metadataService = await import("@/services/metadata-service");
    const inputBuffer = await fileToBuffer(file);
    const data = await metadataService.extractMetadata(inputBuffer, file.name);

    return {
      success: true,
      data,
    };
  } catch (err) {
    return { success: false, error: (err as Error).message };
  }
}

/**
 * Server Action to clean image metadata based on selected settings.
 */
export async function cleanMetadataAction(formData: FormData): Promise<{ success: boolean; dataUrl?: string; size?: number; fieldsRemovedCount?: number; error?: string }> {
  try {
    const file = formData.get("file") as File;
    if (!file) throw new Error("File not found in request.");

    const removeGps = formData.get("removeGps") === "true";
    const removeAuthor = formData.get("removeAuthor") === "true";
    const removeSoftware = formData.get("removeSoftware") === "true";
    const removeAll = formData.get("removeAll") === "true";

    const metadataService = await import("@/services/metadata-service");
    const inputBuffer = await fileToBuffer(file);
    const { buffer: outputBuffer, fieldsRemovedCount } = await metadataService.cleanMetadata(
      inputBuffer,
      file.name,
      { removeGps, removeAuthor, removeSoftware, removeAll }
    );

    const base64 = outputBuffer.toString("base64");
    const sourceFormat = file.name.split(".").pop() || "png";
    const mimeType = file.type || `image/${sourceFormat}`;

    return {
      success: true,
      dataUrl: `data:${mimeType};base64,${base64}`,
      size: outputBuffer.length,
      fieldsRemovedCount,
    };
  } catch (err) {
    return { success: false, error: (err as Error).message };
  }
}

/**
 * Server Action to generate a privacy report based on extracted metadata.
 */
export async function generatePrivacyReportAction(metadataJson: string): Promise<{ success: boolean; report?: any; error?: string }> {
  try {
    const metadataService = await import("@/services/metadata-service");
    const parsed = JSON.parse(metadataJson);
    const report = metadataService.generatePrivacyReport(parsed);

    return {
      success: true,
      report,
    };
  } catch (err) {
    return { success: false, error: (err as Error).message };
  }
}

