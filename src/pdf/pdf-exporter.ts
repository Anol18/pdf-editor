// ============================================================
// lib/pdf/pdf-exporter.ts
// ============================================================

import type { PDFPage, PDFElement, CompressionLevel } from "@/types/pdf-editor";

function getCompressionQuality(level: CompressionLevel): number {
  switch (level) {
    case "low":    return 0.92;
    case "medium": return 0.75;
    case "high":   return 0.5;
  }
}

async function compressImageDataURL(
  src: string,
  quality: number
): Promise<string> {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d")!;
      ctx.drawImage(img, 0, 0);
      resolve(canvas.toDataURL("image/jpeg", quality));
    };
    img.onerror = () => resolve(src);
    img.src = src;
  });
}

interface KonvaStageRef {
  toDataURL: (config?: { pixelRatio?: number; mimeType?: string; quality?: number }) => string;
}

/**
 * Export pages from Konva stages to PDF using pdf-lib
 */
export async function exportToPDF(
  pages: PDFPage[],
  stageRefs: Map<string, KonvaStageRef>,
  compressionLevel: CompressionLevel,
  filename: string = "document.pdf"
): Promise<void> {
  const { PDFDocument, rgb } = await import("pdf-lib");
  const quality = getCompressionQuality(compressionLevel);
  const pdfDoc = await PDFDocument.create();

  for (const page of pages) {
    const stage = stageRefs.get(page.id);
    let imageDataURL: string;

    if (stage) {
      imageDataURL = stage.toDataURL({ pixelRatio: 2, mimeType: "image/jpeg", quality });
    } else {
      // Fallback: blank page
      const canvas = document.createElement("canvas");
      canvas.width = page.width;
      canvas.height = page.height;
      const ctx = canvas.getContext("2d")!;
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, page.width, page.height);
      imageDataURL = canvas.toDataURL("image/jpeg", quality);
    }

    // Compress further if needed
    const compressedDataURL = compressionLevel !== "low"
      ? await compressImageDataURL(imageDataURL, quality)
      : imageDataURL;

    const base64 = compressedDataURL.split(",")[1];
    const imageBytes = Uint8Array.from(atob(base64), (c) => c.charCodeAt(0));
    const embeddedImage = await pdfDoc.embedJpg(imageBytes);

    const pdfPage = pdfDoc.addPage([page.width, page.height]);
    pdfPage.drawImage(embeddedImage, {
      x: 0,
      y: 0,
      width: page.width,
      height: page.height,
    });
  }

  const pdfBytes = await pdfDoc.save();
  const blob = new Blob([pdfBytes as any], { type: "application/pdf" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename.endsWith(".pdf") ? filename : `${filename}.pdf`;
  link.click();
  URL.revokeObjectURL(url);
}
