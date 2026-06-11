"use client";
// ============================================================
// components/pdf-editor/EditorHeader.tsx
// ============================================================

import React, { useState } from "react";
import { usePDFEditorStore } from "@/store/pdf-editor-store";
import { usePDFExport } from "@/hooks/use-pdf-editor";
import Link from "next/link";
import type { CompressionLevel } from "@/types/pdf-editor";

const COMPRESSION_OPTIONS: { value: CompressionLevel; label: string; desc: string }[] = [
  { value: "low",    label: "Low",    desc: "High quality, larger file" },
  { value: "medium", label: "Medium", desc: "Balanced" },
  { value: "high",   label: "High",   desc: "Smallest file, lower quality" },
];

interface EditorHeaderProps {
  onExport: () => void;
}

export function EditorHeader({ onExport }: EditorHeaderProps) {
  const { name, pages, compressionLevel, setCompressionLevel, isLoading, loadingMessage } = usePDFEditorStore();
  const [showCompression, setShowCompression] = useState(false);

  return (
    <header className="h-12 shrink-0 bg-[#1c1c1e] border-b border-[#2a2a2d] flex items-center px-4 gap-3 z-10">
      {/* Logo / Brand */}
      <Link href="/" className="flex items-center gap-2 mr-2 hover:opacity-80 transition-opacity">
        <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#0a84ff] to-[#5e5ce6] flex items-center justify-center">
          <span className="text-white text-[11px] font-bold">P</span>
        </div>
        <span className="text-[13px] font-semibold text-[#ebebf5] hidden sm:block">PDFCraft</span>
      </Link>

      <div className="w-px h-6 bg-[#2a2a2d]" />

      {/* Document name */}
      <div className="flex-1 min-w-0">
        <span className="text-[13px] text-[#ebebf5] font-medium truncate block max-w-[200px]">
          {name || "Untitled"}
        </span>
        <span className="text-[11px] text-[#8e8e93]">
          {pages.length} page{pages.length !== 1 ? "s" : ""}
        </span>
      </div>

      {/* Loading indicator */}
      {isLoading && (
        <div className="flex items-center gap-2 text-[12px] text-[#8e8e93]">
          <div className="w-4 h-4 border-2 border-[#0a84ff] border-t-transparent rounded-full animate-spin" />
          <span className="hidden sm:block">{loadingMessage}</span>
        </div>
      )}

      {/* Compression selector */}
      <div className="relative">
        <button
          onClick={() => setShowCompression(!showCompression)}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-[#2c2c2e] hover:bg-[#3a3a3d] rounded-lg text-[12px] text-[#ebebf5] transition-colors border border-[#3a3a3d]"
        >
          <span>⚙</span>
          <span className="hidden sm:block capitalize">{compressionLevel}</span>
          <span className="text-[10px]">▾</span>
        </button>

        {showCompression && (
          <div className="absolute right-0 top-full mt-1 bg-[#2c2c2e] border border-[#3a3a3d] rounded-xl shadow-2xl z-50 min-w-[180px] overflow-hidden">
            <div className="px-3 py-2 border-b border-[#3a3a3d]">
              <span className="text-[11px] font-semibold text-[#8e8e93] uppercase tracking-wider">Compression</span>
            </div>
            {COMPRESSION_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                onClick={() => { setCompressionLevel(opt.value); setShowCompression(false); }}
                className={`w-full flex flex-col px-3 py-2 text-left hover:bg-[#3a3a3d] transition-colors ${
                  compressionLevel === opt.value ? "text-[#0a84ff]" : "text-[#ebebf5]"
                }`}
              >
                <span className="text-[13px] font-medium">{opt.label}</span>
                <span className="text-[11px] text-[#8e8e93]">{opt.desc}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Export button */}
      <button
        onClick={onExport}
        disabled={isLoading || pages.length === 0}
        className="flex items-center gap-2 px-4 py-1.5 bg-[#0a84ff] hover:bg-[#0070e0] disabled:opacity-40 disabled:cursor-not-allowed rounded-lg text-[13px] font-semibold text-white transition-colors shadow-lg shadow-blue-500/20"
      >
        <span>↓</span>
        <span className="hidden sm:block">Export PDF</span>
      </button>

      {/* Close overlay when clicking outside */}
      {showCompression && (
        <div className="fixed inset-0 z-40" onClick={() => setShowCompression(false)} />
      )}
    </header>
  );
}
