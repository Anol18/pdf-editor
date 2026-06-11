// ============================================================
// src/components/image-tools/ImageToolsLayout.tsx
// ============================================================

"use client";

import React from "react";
import { useImageToolsStore } from "@/store/image-tools-store";
import { ToolSidebar } from "./ToolSidebar";
import { ImageUploader } from "./ImageUploader";
import { BatchQueue } from "./BatchQueue";
import { DownloadSection } from "./DownloadSection";
import { ConvertPanel } from "./ConvertPanel";
import { CompressPanel } from "./CompressPanel";
import { ResizePanel } from "./ResizePanel";
import { CropPanel } from "./CropPanel";
import { RotatePanel } from "./RotatePanel";
import { WatermarkPanel } from "./WatermarkPanel";
import { BackgroundRemovalPanel } from "./BackgroundRemovalPanel";
import { UpscalePanel } from "./UpscalePanel";
import { MetadataInspectorPanel } from "./MetadataInspectorPanel";
import { FileImage, ChevronRight } from "lucide-react";
import Link from "next/link";

export function ImageToolsLayout() {
  const { activeTool, files } = useImageToolsStore();

  const renderActivePanel = () => {
    switch (activeTool) {
      case "convert":
        return <ConvertPanel />;
      case "compress":
        return <CompressPanel />;
      case "resize":
        return <ResizePanel />;
      case "crop":
        return <CropPanel />;
      case "rotate":
        return <RotatePanel />;
      case "watermark":
        return <WatermarkPanel />;
      case "background-removal":
        return <BackgroundRemovalPanel />;
      case "upscale":
        return <UpscalePanel />;
      case "metadata-inspector":
        return <MetadataInspectorPanel />;
      default:
        return <ConvertPanel />;
    }
  };

  const getToolTitle = () => {
    switch (activeTool) {
      case "convert": return "Convert Format";
      case "compress": return "Compress Image";
      case "resize": return "Resize Image";
      case "crop": return "Crop Image";
      case "rotate": return "Rotate & Flip";
      case "watermark": return "Add Watermark";
      case "background-removal": return "Remove Background";
      case "upscale": return "AI Upscale";
      case "metadata-inspector": return "Metadata Inspector";
    }
  };

  return (
    <div className="flex-1 flex flex-col md:flex-row min-h-[calc(100vh-4rem)] bg-[#0a0a0a] text-white">
      {/* SaaS Sidebar */}
      <ToolSidebar />

      {/* Main Workspace Area */}
      <main className="flex-1 flex flex-col p-4 sm:p-6 lg:p-8 overflow-y-auto space-y-6 max-w-7xl mx-auto w-full">
        {/* Breadcrumb / Title */}
        <div className="flex items-center gap-2 text-[12px] text-[#8e8e93] font-medium">
          <Link href="/" className="hover:text-white transition-colors">Home</Link>
          <ChevronRight size={12} />
          <span className="text-[#ebebf5]">{getToolTitle()}</span>
        </div>

        {/* Empty state when no images are uploaded */}
        {files.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center py-10 max-w-2xl mx-auto w-full space-y-8 text-center">
            <div className="space-y-3">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold bg-[#0a84ff]/10 text-[#0a84ff] border border-[#0a84ff]/20 rounded-full mb-2">
                ✨ Fast, Local, and Secure
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                No Images Uploaded Yet
              </h2>
              <p className="text-sm text-[#8e8e93] leading-relaxed max-w-md mx-auto">
                Add one or multiple image files below. Everything is processed directly in the workspace or via high-performance cloud pipelines.
              </p>
            </div>

            <ImageUploader />
          </div>
        ) : (
          /* Active Tool Panel with Workspace Queue */
          <div className="space-y-6">
            {/* Active Control Panel */}
            <div className="bg-[#111112]/40 border border-[#2a2a2d]/80 rounded-2xl p-5 md:p-6 backdrop-blur-sm">
              {renderActivePanel()}
            </div>

            {/* Queue & Add Files */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Batch Process Queue (Span 2) */}
              <div className="lg:col-span-2 space-y-4">
                <BatchQueue />
                <DownloadSection />
              </div>

              {/* Upload zone for adding more files */}
              <div className="space-y-3">
                <label className="text-[12px] font-bold text-[#8e8e93] uppercase tracking-wider block">
                  Add More Images
                </label>
                <ImageUploader />
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
