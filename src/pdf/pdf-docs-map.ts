import { AnyType } from "@/types";

const pdfDocsMap = new Map<string, AnyType>();

export function registerPdfDocForPage(pageId: string, doc: AnyType) {
  pdfDocsMap.set(pageId, doc);
}

export function getPdfDocForPage(pageId: string): AnyType {
  return pdfDocsMap.get(pageId);
}
