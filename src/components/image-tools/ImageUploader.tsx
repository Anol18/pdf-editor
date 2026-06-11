// ============================================================
// src/components/image-tools/ImageUploader.tsx
// ============================================================

"use client";

import React, { useRef, useState } from "react";
import { useImageToolsStore } from "@/store/image-tools-store";
import { Upload, FileImage, AlertCircle, X, Trash2 } from "lucide-react";

const SUPPORTED_EXTENSIONS = [
  "jpg", "jpeg", "png", "webp", "avif", "bmp", "gif", "tiff", "heic", "heif", "svg"
];

export function ImageUploader() {
  const { files, addFiles, removeFile, clearAll } = useImageToolsStore();
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateAndAddFiles = (fileList: FileList | null) => {
    if (!fileList || fileList.length === 0) return;
    setError(null);

    const validFiles: File[] = [];
    const invalidFiles: string[] = [];

    Array.from(fileList).forEach((file) => {
      const ext = file.name.split(".").pop()?.toLowerCase() || "";
      if (SUPPORTED_EXTENSIONS.includes(ext)) {
        validFiles.push(file);
      } else {
        invalidFiles.push(file.name);
      }
    });

    if (invalidFiles.length > 0) {
      setError(`Unsupported files: ${invalidFiles.join(", ")}. Supported formats: ${SUPPORTED_EXTENSIONS.join(", ").toUpperCase()}`);
    }

    if (validFiles.length > 0) {
      addFiles(validFiles);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files) {
      validateAndAddFiles(e.dataTransfer.files);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      validateAndAddFiles(e.target.files);
    }
    // Reset input value so same file can be uploaded again if removed
    if (e.target) {
      e.target.value = "";
    }
  };

  const triggerInput = () => {
    fileInputRef.current?.click();
  };

  const formatSize = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  return (
    <div className="w-full space-y-4">
      {/* Upload Drag & Drop Area */}
      <div
        onDragEnter={handleDrag}
        onDragOver={handleDrag}
        onDragLeave={handleDrag}
        onDrop={handleDrop}
        onClick={triggerInput}
        className={`
          relative flex flex-col items-center justify-center border-2 border-dashed rounded-2xl p-10 cursor-pointer
          transition-all duration-300 min-h-[200px] text-center
          ${dragActive 
            ? "border-[#0a84ff] bg-[#0a84ff]/5 shadow-lg shadow-[#0a84ff]/10 scale-[1.01]" 
            : "border-[#2a2a2d] bg-[#111112] hover:border-[#3a3a3d] hover:bg-[#151517]"
          }
        `}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept=".jpg,.jpeg,.png,.webp,.avif,.bmp,.gif,.tiff,.heic,.heif,.svg"
          className="hidden"
          onChange={handleChange}
        />

        <div className="flex flex-col items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-[#1c1c1e] flex items-center justify-center text-[#8e8e93] border border-[#2a2a2d] transition-colors duration-200">
            <Upload size={24} className="text-[#0a84ff]" />
          </div>
          <div>
            <p className="text-[15px] font-semibold text-white">
              Drag & drop images here, or <span className="text-[#0a84ff]">browse</span>
            </p>
            <p className="text-[12px] text-[#8e8e93] mt-1">
              Supports JPG, PNG, WEBP, AVIF, HEIC, GIF, SVG, BMP, TIFF
            </p>
          </div>
        </div>
      </div>

      {/* Error state */}
      {error && (
        <div className="flex items-start gap-3 p-3 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl text-[13px]">
          <AlertCircle size={18} className="flex-shrink-0 mt-0.5" />
          <div className="flex-1">{error}</div>
          <button onClick={() => setError(null)} className="text-red-400/50 hover:text-red-400">
            <X size={16} />
          </button>
        </div>
      )}

      {/* Files List Summary */}
      {files.length > 0 && (
        <div className="flex items-center justify-between p-3 bg-[#111112] border border-[#2a2a2d] rounded-xl">
          <div className="flex items-center gap-2 text-[14px]">
            <FileImage size={18} className="text-[#0a84ff]" />
            <span className="font-semibold text-white">{files.length}</span>
            <span className="text-[#8e8e93]">{files.length === 1 ? "image" : "images"} uploaded</span>
          </div>
          <button
            onClick={clearAll}
            className="flex items-center gap-1.5 px-3 py-1.5 text-[12px] font-medium text-red-400 hover:text-white bg-red-500/10 hover:bg-red-500/20 rounded-lg transition-colors border border-red-500/20"
          >
            <Trash2 size={13} />
            Clear All
          </button>
        </div>
      )}
    </div>
  );
}
