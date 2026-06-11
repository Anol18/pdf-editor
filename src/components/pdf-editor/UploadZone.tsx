"use client";
// ============================================================
// components/pdf-editor/UploadZone.tsx
// ============================================================

import React, { useCallback, useState, useRef } from "react";
import { usePDFLoader } from "@/hooks/use-pdf-editor";

export function UploadZone() {
  const { loadFile } = usePDFLoader();
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback((file: File) => {
    if (file.type !== "application/pdf") {
      alert("Please upload a PDF file.");
      return;
    }
    loadFile(file);
  }, [loadFile]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  }, [handleFile]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
    e.target.value = "";
  }, [handleFile]);

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-8 bg-[#141416]">
      {/* Drop zone */}
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => fileInputRef.current?.click()}
        className={`
          relative w-full max-w-lg aspect-video rounded-2xl border-2 border-dashed
          flex flex-col items-center justify-center gap-4 cursor-pointer
          transition-all duration-300
          ${isDragging
            ? "border-[#0a84ff] bg-[#0a84ff]/10 scale-[1.02]"
            : "border-[#3a3a3d] hover:border-[#5a5a5d] hover:bg-[#1c1c1e]"
          }
        `}
      >
        {/* Icon */}
        <div className={`text-6xl transition-transform duration-300 ${isDragging ? "scale-110" : ""}`}>
          📄
        </div>

        <div className="text-center">
          <p className="text-[16px] font-semibold text-[#ebebf5] mb-1">
            {isDragging ? "Drop your PDF here" : "Upload a PDF"}
          </p>
          <p className="text-[13px] text-[#8e8e93]">
            Drag and drop, or click to browse
          </p>
        </div>

        <div className="px-4 py-2 bg-[#0a84ff] hover:bg-[#0070e0] rounded-xl text-white text-[13px] font-semibold transition-colors shadow-lg shadow-blue-500/20">
          Choose File
        </div>

        <p className="text-[11px] text-[#48484a]">PDF files only · Max 50MB</p>
      </div>

      {/* Features list */}
      <div className="mt-10 grid grid-cols-2 sm:grid-cols-3 gap-4 max-w-lg w-full">
        {[
          { icon: "✏️", label: "Edit Text" },
          { icon: "🖼️", label: "Add Images" },
          { icon: "🔷", label: "Draw Shapes" },
          { icon: "📝", label: "Annotate" },
          { icon: "🗂️", label: "Manage Pages" },
          { icon: "📦", label: "Export & Compress" },
        ].map((f) => (
          <div
            key={f.label}
            className="flex items-center gap-2 px-3 py-2 rounded-xl bg-[#1c1c1e] border border-[#2a2a2d]"
          >
            <span className="text-lg">{f.icon}</span>
            <span className="text-[12px] text-[#8e8e93] font-medium">{f.label}</span>
          </div>
        ))}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="application/pdf"
        className="hidden"
        onChange={handleInputChange}
      />
    </div>
  );
}
