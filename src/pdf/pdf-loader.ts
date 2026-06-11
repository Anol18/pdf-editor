// ============================================================
// lib/pdf/pdf-loader.ts
// ============================================================

import { nanoid } from "nanoid";
import type { PDFPage } from "@/types/pdf-editor";

let pdfjsLib: any = null;

async function getPdfJs() {
  if (pdfjsLib) return pdfjsLib;
  const pdfjs = await import("pdfjs-dist");
  pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;
  pdfjsLib = pdfjs;
  return pdfjs;
}

export async function loadPDFFromFile(file: File): Promise<{ pages: PDFPage[]; pdfDoc: any }> {
  const pdfjs = await getPdfJs();
  const arrayBuffer = await file.arrayBuffer();
  const pdfDoc = await pdfjs.getDocument({ data: arrayBuffer }).promise;
  const numPages = pdfDoc.numPages;
  const pages: PDFPage[] = [];

  for (let i = 1; i <= numPages; i++) {
    const page = await pdfDoc.getPage(i);
    const viewport = page.getViewport({ scale: 1 });
    pages.push({
      id: nanoid(),
      width: viewport.width,
      height: viewport.height,
      rotation: 0,
      elements: [],
      pdfPageIndex: i - 1,
    });
  }

  return { pages, pdfDoc };
}

export async function renderPageToCanvas(
  pdfDoc: any,
  pageIndex: number,
  scale: number = 1.5
): Promise<HTMLCanvasElement> {
  const page = await pdfDoc.getPage(pageIndex + 1);
  const viewport = page.getViewport({ scale });
  const canvas = document.createElement("canvas");
  canvas.width = viewport.width;
  canvas.height = viewport.height;
  const ctx = canvas.getContext("2d")!;
  await page.render({ canvasContext: ctx, viewport }).promise;
  return canvas;
}

export async function renderPageToDataURL(
  pdfDoc: any,
  pageIndex: number,
  scale: number = 0.3
): Promise<string> {
  const canvas = await renderPageToCanvas(pdfDoc, pageIndex, scale);
  return canvas.toDataURL("image/jpeg", 0.7);
}

export async function renderPageToFullDataURL(
  pdfDoc: any,
  pageIndex: number,
  scale: number = 1.5
): Promise<string> {
  const canvas = await renderPageToCanvas(pdfDoc, pageIndex, scale);
  return canvas.toDataURL("image/png");
}
