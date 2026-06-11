"use client";
// ============================================================
// components/pdf-editor/PDFEditor.tsx
// ============================================================

import React, { useCallback, useRef } from "react";

import { EditorHeader } from "./EditorHeader";
import { Toolbar } from "./Toolbar";
import { ThumbnailSidebar } from "./ThumbnailSidebar";
import { CanvasArea } from "./CanvasArea";
import { PropertiesPanel } from "./PropertiesPanel";
import { UploadZone } from "./UploadZone";
import { usePDFEditorStore } from "@/store/pdf-editor-store";
import { useKeyboardShortcuts, usePDFExport } from "@/hooks/use-pdf-editor";

export function PDFEditor() {
  const { pages } = usePDFEditorStore();
  const { exportPDF, registerStage } = usePDFExport();

  // Register keyboard shortcuts
  useKeyboardShortcuts();

  const hasPages = pages.length > 0;

  return (
    <div className="flex flex-col h-screen bg-[#141416] text-[#ebebf5] overflow-hidden">
      {/* Top bar */}
      <EditorHeader onExport={exportPDF} />

      {/* Main layout */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left: Tool sidebar */}
        {hasPages && <Toolbar />}

        {/* Middle-left: Page thumbnails */}
        {hasPages && <ThumbnailSidebar />}

        {/* Center: Canvas / Upload zone */}
        {hasPages ? (
          <CanvasArea onStageReady={registerStage} />
        ) : (
          <UploadZone />
        )}

        {/* Right: Properties panel */}
        {hasPages && <PropertiesPanel />}
      </div>
    </div>
  );
}
