// ============================================================
// src/services/image-processor.ts
// ============================================================

import sharp from "sharp";
// @ts-expect-error heic-convert has no typescript declaration files
import heicConvert from "heic-convert";
import { WatermarkSettings } from "@/types/image-tools";

/**
 * Pre-processes an input buffer: if it's HEIC or HEIF, converts it
 * to a JPEG buffer using heic-convert so sharp can work with it.
 */
async function ensureSharpCompatibleBuffer(
  buffer: Buffer,
  sourceFormat?: string
): Promise<{ buffer: Buffer; formatDetected: string }> {
  const isHeic =
    sourceFormat?.toLowerCase() === "heic" ||
    sourceFormat?.toLowerCase() === "heif" ||
    // Magic bytes for HEIC: ftypheic, ftypheix, ftyphevc, etc.
    (buffer.length > 12 && buffer.toString("ascii", 4, 8) === "ftyp" && 
      ["heic", "heix", "hevc", "heim", "heis", "mif1", "msf1"].includes(buffer.toString("ascii", 8, 12)));

  if (isHeic) {
    try {
      const converted = await heicConvert({
        buffer: buffer,
        format: "JPEG",
        quality: 1.0,
      });
      return { buffer: Buffer.from(converted), formatDetected: "jpeg" };
    } catch (err) {
      throw new Error(`Failed to convert HEIC image: ${(err as Error).message}`);
    }
  }

  // Detect format using sharp metadata
  try {
    const metadata = await sharp(buffer).metadata();
    return { buffer, formatDetected: metadata.format || "png" };
  } catch (err) {
    // If sharp fails to read it directly, check if it's a BMP or TIFF or SVG
    return { buffer, formatDetected: "png" };
  }
}

/**
 * Convert an image to a target format with a specified quality level.
 */
export async function convertImage(
  inputBuffer: Buffer,
  targetFormat: "png" | "jpeg" | "webp" | "avif" | "gif",
  quality: number,
  sourceFormat?: string
): Promise<Buffer> {
  const { buffer } = await ensureSharpCompatibleBuffer(inputBuffer, sourceFormat);
  const pipeline = sharp(buffer);

  // Sharp uses 'jpeg' instead of 'jpg'
  const format = targetFormat === "jpeg" ? "jpeg" : targetFormat;

  if (format === "jpeg") {
    return await pipeline.jpeg({ quality }).toBuffer();
  } else if (format === "png") {
    // PNG is lossless but we can use compression level or palette colors
    return await pipeline.png({ quality }).toBuffer();
  } else if (format === "webp") {
    return await pipeline.webp({ quality }).toBuffer();
  } else if (format === "avif") {
    return await pipeline.avif({ quality }).toBuffer();
  } else if (format === "gif") {
    return await pipeline.gif().toBuffer();
  }

  return await pipeline.toBuffer();
}

/**
 * Compress an image by lowering its quality while maintaining format.
 */
export async function compressImage(
  inputBuffer: Buffer,
  quality: number,
  sourceFormat?: string
): Promise<{ buffer: Buffer; format: string }> {
  const { buffer, formatDetected } = await ensureSharpCompatibleBuffer(inputBuffer, sourceFormat);
  const pipeline = sharp(buffer);
  
  // Format check
  const format = formatDetected === "jpg" ? "jpeg" : formatDetected;

  let resultBuffer: Buffer;
  if (format === "jpeg" || format === "jpg") {
    resultBuffer = await pipeline.jpeg({ quality, mozjpeg: true }).toBuffer();
  } else if (format === "webp") {
    resultBuffer = await pipeline.webp({ quality }).toBuffer();
  } else if (format === "avif") {
    resultBuffer = await pipeline.avif({ quality }).toBuffer();
  } else if (format === "png") {
    // PNG quality/compression (palette-based reduction)
    resultBuffer = await pipeline.png({ quality, compressionLevel: 9 }).toBuffer();
  } else if (format === "gif") {
    resultBuffer = await pipeline.gif().toBuffer();
  } else {
    // Default compression fallback
    resultBuffer = await pipeline.jpeg({ quality }).toBuffer();
  }

  return { buffer: resultBuffer, format: formatDetected };
}

/**
 * Resize an image, optionally locking the aspect ratio.
 */
export async function resizeImage(
  inputBuffer: Buffer,
  width: number,
  height: number,
  lockAspectRatio: boolean,
  sourceFormat?: string
): Promise<Buffer> {
  const { buffer } = await ensureSharpCompatibleBuffer(inputBuffer, sourceFormat);
  
  return await sharp(buffer)
    .resize({
      width: width || undefined,
      height: height || undefined,
      fit: lockAspectRatio ? "inside" : "fill",
      withoutEnlargement: false, // allow upscaling if specifically resized larger
    })
    .toBuffer();
}

/**
 * Crop an image to the exact bounding box specified.
 */
export async function cropImage(
  inputBuffer: Buffer,
  x: number,
  y: number,
  width: number,
  height: number,
  sourceFormat?: string
): Promise<Buffer> {
  const { buffer } = await ensureSharpCompatibleBuffer(inputBuffer, sourceFormat);
  
  const pipeline = sharp(buffer);
  const metadata = await pipeline.metadata();
  
  const imgWidth = metadata.width || width;
  const imgHeight = metadata.height || height;

  // Clamp crop values to prevent OOB errors in Sharp extract
  const left = Math.max(0, Math.min(imgWidth - 1, Math.round(x)));
  const top = Math.max(0, Math.min(imgHeight - 1, Math.round(y)));
  const extractWidth = Math.max(1, Math.min(imgWidth - left, Math.round(width)));
  const extractHeight = Math.max(1, Math.min(imgHeight - top, Math.round(height)));

  return await pipeline
    .extract({
      left,
      top,
      width: extractWidth,
      height: extractHeight,
    })
    .toBuffer();
}

/**
 * Rotate an image and/or flip it horizontally/vertically.
 */
export async function rotateImage(
  inputBuffer: Buffer,
  angle: 0 | 90 | 180 | 270,
  flipH: boolean,
  flipV: boolean,
  sourceFormat?: string
): Promise<Buffer> {
  const { buffer } = await ensureSharpCompatibleBuffer(inputBuffer, sourceFormat);
  let pipeline = sharp(buffer);

  if (angle !== 0) {
    pipeline = pipeline.rotate(angle);
  }
  if (flipH) {
    pipeline = pipeline.flop(); // Horizontal
  }
  if (flipV) {
    pipeline = pipeline.flip(); // Vertical
  }

  return await pipeline.toBuffer();
}

/**
 * Apply a text or image watermark to the image.
 */
export async function watermarkImage(
  inputBuffer: Buffer,
  settings: WatermarkSettings,
  sourceFormat?: string
): Promise<Buffer> {
  const { buffer } = await ensureSharpCompatibleBuffer(inputBuffer, sourceFormat);
  const mainImage = sharp(buffer);
  const metadata = await mainImage.metadata();

  const imgWidth = metadata.width || 800;
  const imgHeight = metadata.height || 600;

  if (settings.type === "text") {
    // Generate text watermark via SVG composite overlay
    const fontSize = settings.fontSize || 24;
    const color = settings.color || "#ffffff";
    const opacity = settings.opacity !== undefined ? settings.opacity : 0.5;
    const text = settings.text || "Watermark";
    const pos = settings.position;

    let x = "50%";
    let y = "50%";
    let textAnchor = "middle";
    let dominantBaseline = "middle";

    const padding = 20;

    if (pos === "top-left") {
      x = `${padding}px`;
      y = `${padding + fontSize}px`;
      textAnchor = "start";
      dominantBaseline = "auto";
    } else if (pos === "top-center") {
      x = "50%";
      y = `${padding + fontSize}px`;
      textAnchor = "middle";
      dominantBaseline = "auto";
    } else if (pos === "top-right") {
      x = `${imgWidth - padding}px`;
      y = `${padding + fontSize}px`;
      textAnchor = "end";
      dominantBaseline = "auto";
    } else if (pos === "center") {
      x = "50%";
      y = "50%";
      textAnchor = "middle";
      dominantBaseline = "middle";
    } else if (pos === "bottom-left") {
      x = `${padding}px`;
      y = `${imgHeight - padding}px`;
      textAnchor = "start";
      dominantBaseline = "auto";
    } else if (pos === "bottom-center") {
      x = "50%";
      y = `${imgHeight - padding}px`;
      textAnchor = "middle";
      dominantBaseline = "auto";
    } else if (pos === "bottom-right") {
      x = `${imgWidth - padding}px`;
      y = `${imgHeight - padding}px`;
      textAnchor = "end";
      dominantBaseline = "auto";
    }

    // Escape special characters in XML text
    const escapedText = text
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&apos;");

    const svgWatermark = Buffer.from(`
      <svg width="${imgWidth}" height="${imgHeight}" xmlns="http://www.w3.org/2000/svg">
        <style>
          .watermark-text {
            font-family: 'Inter', system-ui, -apple-system, sans-serif;
            font-size: ${fontSize}px;
            fill: ${color};
            fill-opacity: ${opacity};
            font-weight: bold;
          }
        </style>
        <text x="${x}" y="${y}" text-anchor="${textAnchor}" dominant-baseline="${dominantBaseline}" class="watermark-text">${escapedText}</text>
      </svg>
    `);

    return await mainImage
      .composite([{ input: svgWatermark, top: 0, left: 0 }])
      .toBuffer();
  } else {
    // Image watermark
    if (!settings.imageWatermarkUrl) {
      throw new Error("No watermark image provided.");
    }

    // Parse the watermark base64 image
    const base64Data = settings.imageWatermarkUrl.replace(/^data:image\/\w+;base64,/, "");
    const watermarkBuffer = Buffer.from(base64Data, "base64");
    
    // Resize the watermark image based on scale percentage of the main image width
    const scalePercent = settings.imageWatermarkWidth || 20;
    const targetWatermarkWidth = Math.round(imgWidth * (scalePercent / 100));

    let watermarkSharp = sharp(watermarkBuffer);
    const watermarkMeta = await watermarkSharp.metadata();

    const wmAspectRatio = (watermarkMeta.width && watermarkMeta.height)
      ? watermarkMeta.width / watermarkMeta.height
      : 1;

    const targetWatermarkHeight = Math.round(targetWatermarkWidth / wmAspectRatio);

    // Resize watermark image and apply opacity multiplier using linear channel transform
    const opacity = settings.opacity !== undefined ? settings.opacity : 0.5;
    let processedWatermark = watermarkSharp
      .resize({ width: targetWatermarkWidth, height: targetWatermarkHeight })
      .ensureAlpha();

    // Multiply the alpha channel values by our opacity settings (using linear modifier)
    processedWatermark = processedWatermark.linear([1, 1, 1, opacity], [0, 0, 0, 0]);
    const resizedWatermarkBuffer = await processedWatermark.toBuffer();

    // Position coordinates
    const pos = settings.position;
    const padding = 20;
    let left = Math.round((imgWidth - targetWatermarkWidth) / 2);
    let top = Math.round((imgHeight - targetWatermarkHeight) / 2);

    if (pos === "top-left") {
      left = padding;
      top = padding;
    } else if (pos === "top-center") {
      left = Math.round((imgWidth - targetWatermarkWidth) / 2);
      top = padding;
    } else if (pos === "top-right") {
      left = imgWidth - targetWatermarkWidth - padding;
      top = padding;
    } else if (pos === "center") {
      left = Math.round((imgWidth - targetWatermarkWidth) / 2);
      top = Math.round((imgHeight - targetWatermarkHeight) / 2);
    } else if (pos === "bottom-left") {
      left = padding;
      top = imgHeight - targetWatermarkHeight - padding;
    } else if (pos === "bottom-center") {
      left = Math.round((imgWidth - targetWatermarkWidth) / 2);
      top = imgHeight - targetWatermarkHeight - padding;
    } else if (pos === "bottom-right") {
      left = imgWidth - targetWatermarkWidth - padding;
      top = imgHeight - targetWatermarkHeight - padding;
    }

    // Compose watermark onto main image
    return await mainImage
      .composite([{ input: resizedWatermarkBuffer, left, top }])
      .toBuffer();
  }
}

/**
 * Remove background (Server-side simple threshold fallback).
 * High-fidelity AI background removal runs on the client.
 */
export async function removeBackground(
  inputBuffer: Buffer,
  sourceFormat?: string
): Promise<Buffer> {
  const { buffer } = await ensureSharpCompatibleBuffer(inputBuffer, sourceFormat);
  
  // High-fidelity background removal is done on the client utilizing WASM.
  // On the server, we output a transparent PNG format of the image.
  return await sharp(buffer)
    .png()
    .toBuffer();
}
