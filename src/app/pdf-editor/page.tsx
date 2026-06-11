// ============================================================
// app/pdf-tools/page.tsx
// ============================================================

import type { Metadata } from "next";
import { PDFEditorClient } from "./client";

export const metadata: Metadata = {
  title: "PDF Editor — Edit, Annotate & Export PDFs",
  description:
    "A powerful browser-based PDF editor. Edit text, add images, draw shapes, annotate, manage pages, and export compressed PDFs.",
};

export default function PDFToolsPage() {
  return <PDFEditorClient />;
}
