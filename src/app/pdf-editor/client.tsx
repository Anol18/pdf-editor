"use client";
// ============================================================
// app/pdf-tools/client.tsx
// ============================================================

import dynamic from "next/dynamic";

// Dynamically import PDFEditor to avoid SSR issues
// (Konva, pdf.js, and pdf-lib all require browser APIs)
const PDFEditor = dynamic(
  () => import("@/components/pdf-editor/PDFEditor").then((m) => m.PDFEditor),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-screen items-center justify-center bg-[#141416]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-2 border-[#0a84ff] border-t-transparent rounded-full animate-spin" />
          <p className="text-[#8e8e93] text-[14px]">Loading PDF Editor...</p>
        </div>
      </div>
    ),
  },
);

export function PDFEditorClient() {
  return <PDFEditor />;
}
