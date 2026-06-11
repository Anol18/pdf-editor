// ============================================================
// src/components/image-tools/ConvertPanel.tsx
// ============================================================

"use client";

import React, { useState } from "react";
import { useImageToolsStore } from "@/store/image-tools-store";
import { convertImageAction } from "@/actions/image-tools";
import { RefreshCw, Sliders, CheckCircle, Loader2 } from "lucide-react";

export function ConvertPanel() {
  const { files, convertSettings, updateConvertSettings, updateFile } = useImageToolsStore();
  const [processing, setProcessing] = useState(false);

  const formats: ("png" | "jpeg" | "webp" | "avif" | "gif")[] = [
    "png", "jpeg", "webp", "avif", "gif"
  ];

  const handleConvert = async () => {
    if (files.length === 0) return;
    setProcessing(true);

    // Process files sequentially or in parallel
    const promises = files.map(async (fileItem) => {
      if (fileItem.status === "success") return;

      updateFile(fileItem.id, { status: "processing", progress: 20 });

      try {
        const formData = new FormData();
        formData.append("file", fileItem.file);
        formData.append("targetFormat", convertSettings.targetFormat);
        formData.append("quality", convertSettings.quality.toString());

        updateFile(fileItem.id, { progress: 60 });

        const res = await convertImageAction(formData);

        if (res.success && res.dataUrl) {
          updateFile(fileItem.id, {
            status: "success",
            progress: 100,
            resultUrl: res.dataUrl,
            resultSize: res.size,
            resultType: `image/${res.format}`,
          });
        } else {
          updateFile(fileItem.id, {
            status: "error",
            progress: 0,
            error: res.error || "Failed to convert.",
          });
        }
      } catch (err) {
        updateFile(fileItem.id, {
          status: "error",
          progress: 0,
          error: (err as Error).message,
        });
      }
    });

    await Promise.all(promises);
    setProcessing(false);
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-bold text-white mb-1">Convert Format</h3>
        <p className="text-xs text-[#8e8e93]">
          Batch convert your images to any modern web format with customizable quality.
        </p>
      </div>

      <div className="bg-[#111112] border border-[#2a2a2d] p-5 rounded-2xl space-y-5">
        {/* Format selector */}
        <div className="space-y-2.5">
          <label className="text-[13px] font-bold text-[#ebebf5] uppercase tracking-wider">
            Target Format
          </label>
          <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
            {formats.map((fmt) => (
              <button
                key={fmt}
                onClick={() => updateConvertSettings({ targetFormat: fmt })}
                className={`
                  py-2.5 rounded-xl text-center text-[13px] font-bold transition-all uppercase
                  ${convertSettings.targetFormat === fmt
                    ? "bg-[#0a84ff] text-white shadow-lg shadow-[#0a84ff]/15"
                    : "bg-[#1c1c1e] text-[#8e8e93] border border-[#2a2a2d] hover:text-white hover:bg-[#2c2c2e]"
                  }
                `}
              >
                {fmt}
              </button>
            ))}
          </div>
        </div>

        {/* Quality slider (not relevant for PNG lossless, but useful for JPEG/WEBP/AVIF) */}
        {convertSettings.targetFormat !== "png" && convertSettings.targetFormat !== "gif" && (
          <div className="space-y-2.5 pt-2 border-t border-[#2a2a2d]">
            <div className="flex justify-between items-center text-[13px]">
              <label className="font-bold text-[#ebebf5] uppercase tracking-wider flex items-center gap-1.5">
                <Sliders size={14} className="text-[#0a84ff]" />
                Image Quality
              </label>
              <span className="font-bold text-white bg-[#1c1c1e] px-2 py-0.5 rounded border border-[#2a2a2d]">
                {convertSettings.quality}%
              </span>
            </div>
            <input
              type="range"
              min="10"
              max="100"
              value={convertSettings.quality}
              onChange={(e) => updateConvertSettings({ quality: parseInt(e.target.value) })}
              className="w-full h-1.5 bg-[#1c1c1e] rounded-lg appearance-none cursor-pointer accent-[#0a84ff] border border-[#2a2a2d]"
            />
            <div className="flex justify-between text-[10px] text-[#8e8e93]">
              <span>Smaller Size (Lower Quality)</span>
              <span>Larger Size (Higher Quality)</span>
            </div>
          </div>
        )}

        <button
          onClick={handleConvert}
          disabled={files.length === 0 || processing}
          className="w-full py-3 px-4 flex items-center justify-center gap-2 text-[14px] font-bold text-white bg-[#0a84ff] hover:bg-[#0070e3] disabled:opacity-50 disabled:cursor-not-allowed active:scale-98 rounded-xl transition-all shadow-md shadow-[#0a84ff]/20"
        >
          {processing ? (
            <>
              <Loader2 size={16} className="animate-spin" />
              Converting Queue...
            </>
          ) : (
            <>
              <RefreshCw size={16} />
              Convert Images
            </>
          )}
        </button>
      </div>
    </div>
  );
}
