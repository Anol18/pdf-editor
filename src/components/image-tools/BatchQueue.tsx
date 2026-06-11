// ============================================================
// src/components/image-tools/BatchQueue.tsx
// ============================================================

"use client";

import React from "react";
import { useImageToolsStore } from "@/store/image-tools-store";
import { X, CheckCircle2, Loader2, AlertTriangle, FileImage } from "lucide-react";

export function BatchQueue() {
  const { files, removeFile } = useImageToolsStore();

  const formatSize = (bytes: number): string => {
    if (bytes === 0) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
  };

  const getSavedPercent = (orig: number, result?: number): string => {
    if (!result) return "";
    const pct = Math.round(((orig - result) / orig) * 100);
    if (pct <= 0) return "";
    return `(-${pct}%)`;
  };

  if (files.length === 0) return null;

  return (
    <div className="bg-[#111112] border border-[#2a2a2d] rounded-2xl overflow-hidden">
      <div className="px-4 py-3 border-b border-[#2a2a2d] bg-[#151517]">
        <h3 className="text-[13px] font-bold text-white uppercase tracking-wider">Processing Queue</h3>
      </div>

      <div className="divide-y divide-[#2a2a2d] max-h-[250px] overflow-y-auto">
        {files.map((file) => (
          <div key={file.id} className="p-3 flex items-center justify-between gap-3 text-[13px]">
            <div className="flex items-center gap-3 min-w-0 flex-1">
              {/* File Icon */}
              <div className="w-9 h-9 bg-[#1c1c1e] rounded-lg border border-[#2a2a2d] flex items-center justify-center text-[#8e8e93] flex-shrink-0">
                <FileImage size={18} />
              </div>

              {/* File details & progress */}
              <div className="min-w-0 flex-1 space-y-1">
                <div className="flex items-center gap-2">
                  <p className="font-semibold text-white truncate max-w-[200px] sm:max-w-[300px]">
                    {file.name}
                  </p>
                  <span className="text-[11px] text-[#8e8e93] flex-shrink-0">
                    {formatSize(file.size)}
                  </span>
                </div>

                {/* Progress bar */}
                {file.status === "processing" && (
                  <div className="w-full bg-[#1c1c1e] rounded-full h-1.5 overflow-hidden">
                    <div
                      className="bg-[#0a84ff] h-full transition-all duration-300 rounded-full"
                      style={{ width: `${file.progress}%` }}
                    />
                  </div>
                )}

                {/* Saved sizes */}
                {file.status === "success" && file.resultSize && (
                  <p className="text-[11px] text-emerald-400 font-medium">
                    Compressed to {formatSize(file.resultSize)}{" "}
                    <span className="font-bold">{getSavedPercent(file.size, file.resultSize)}</span>
                  </p>
                )}

                {/* Error */}
                {file.status === "error" && (
                  <p className="text-[11px] text-red-400 truncate max-w-[300px]">
                    {file.error || "Processing failed"}
                  </p>
                )}
              </div>
            </div>

            {/* Status & Actions */}
            <div className="flex items-center gap-2 flex-shrink-0">
              {file.status === "processing" && (
                <Loader2 size={16} className="text-[#0a84ff] animate-spin" />
              )}
              {file.status === "success" && (
                <CheckCircle2 size={16} className="text-emerald-400" />
              )}
              {file.status === "error" && (
                <AlertTriangle size={16} className="text-red-400" />
              )}

              <button
                onClick={() => removeFile(file.id)}
                className="p-1 rounded bg-[#1c1c1e] hover:bg-[#2c2c2e] text-[#8e8e93] hover:text-white border border-[#2a2a2d] transition-colors"
                title="Remove from queue"
              >
                <X size={14} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
