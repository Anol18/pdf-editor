// ============================================================
// src/components/image-tools/MetadataSummary.tsx
// ============================================================

"use client";

import React from "react";
import { CheckCircle2, FileUp, Sparkles, AlertCircle } from "lucide-react";

interface MetadataSummaryProps {
  originalSize: number;
  cleanedSize: number;
  fieldsRemoved: number;
}

export function MetadataSummary({
  originalSize,
  cleanedSize,
  fieldsRemoved,
}: MetadataSummaryProps) {
  // Helper to format bytes
  const formatBytes = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const savings = originalSize - cleanedSize;
  const savingsPercent = originalSize > 0 ? Math.max(0, Math.round((savings / originalSize) * 100)) : 0;

  return (
    <div className="space-y-4 bg-[#141416]/50 border border-[#2a2a2d] p-5 rounded-2xl">
      <div className="flex items-center gap-2 text-green-400">
        <CheckCircle2 size={18} />
        <h4 className="text-[14px] font-bold text-white">Image Successfully Cleaned!</h4>
      </div>

      <div className="grid grid-cols-3 gap-3">
        {/* Original Size */}
        <div className="bg-[#1c1c1e] border border-[#2a2a2d] p-3 rounded-xl flex flex-col gap-1">
          <span className="text-[10px] font-bold text-[#8e8e93] uppercase tracking-wider">
            Original Size
          </span>
          <span className="text-[13px] font-bold text-white">
            {formatBytes(originalSize)}
          </span>
        </div>

        {/* Cleaned Size */}
        <div className="bg-[#1c1c1e] border border-[#2a2a2d] p-3 rounded-xl flex flex-col gap-1">
          <span className="text-[10px] font-bold text-[#8e8e93] uppercase tracking-wider">
            Cleaned Size
          </span>
          <span className="text-[13px] font-bold text-white">
            {formatBytes(cleanedSize)}
          </span>
          {savings > 0 && (
            <span className="text-[9px] font-semibold text-green-400">
              Saved {formatBytes(savings)} ({savingsPercent}%)
            </span>
          )}
        </div>

        {/* Removed Fields */}
        <div className="bg-[#1c1c1e] border border-[#2a2a2d] p-3 rounded-xl flex flex-col gap-1">
          <span className="text-[10px] font-bold text-[#8e8e93] uppercase tracking-wider">
            Fields Removed
          </span>
          <span className="text-[13px] font-bold text-amber-400 flex items-center gap-1">
            <Sparkles size={12} />
            {fieldsRemoved} fields
          </span>
        </div>
      </div>

      <p className="text-[11px] text-[#8e8e93] leading-relaxed">
        Privacy metadata has been stripped according to your settings. The pixel data, color definitions, and resolution are fully preserved. You can now securely download this file.
      </p>
    </div>
  );
}
