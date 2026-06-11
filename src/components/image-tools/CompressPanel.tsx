// ============================================================
// src/components/image-tools/CompressPanel.tsx
// ============================================================

"use client";

import React, { useState } from "react";
import { useImageToolsStore } from "@/store/image-tools-store";
import { compressImageAction } from "@/actions/image-tools";
import { ImagePreview } from "./ImagePreview";
import { Sliders, Loader2, Zap } from "lucide-react";

export function CompressPanel() {
  const { files, compressSettings, updateCompressSettings, updateFile } = useImageToolsStore();
  const [processing, setProcessing] = useState(false);
  const [selectedFileId, setSelectedFileId] = useState<string | null>(null);

  const activeFile = files.find((f) => f.id === selectedFileId) || files[0];

  // Auto-set selected file if not set and files exist
  if (files.length > 0 && !selectedFileId) {
    setSelectedFileId(files[0].id);
  }

  const handleCompress = async () => {
    if (files.length === 0) return;
    setProcessing(true);

    const promises = files.map(async (fileItem) => {
      if (fileItem.status === "success") return;
      updateFile(fileItem.id, { status: "processing", progress: 20 });

      try {
        const formData = new FormData();
        formData.append("file", fileItem.file);
        formData.append("quality", compressSettings.quality.toString());

        updateFile(fileItem.id, { progress: 60 });

        const res = await compressImageAction(formData);

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
            error: res.error || "Compression failed.",
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

  const getSavedPercent = (orig: number, result?: number): string => {
    if (!result) return "";
    const pct = Math.round(((orig - result) / orig) * 100);
    return pct > 0 ? `Saved ${pct}%` : "No size reduction";
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-bold text-white mb-1">Compress Image</h3>
        <p className="text-xs text-[#8e8e93]">
          Reduce image file sizes by applying smart compression algorithms. Click on a file in the queue to preview its changes.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left / Center: Image Preview */}
        <div className="lg:col-span-2 space-y-4">
          {activeFile ? (
            <div className="space-y-3">
              <ImagePreview
                originalUrl={activeFile.url}
                resultUrl={activeFile.resultUrl}
                originalLabel={`Original (${(activeFile.size / 1024).toFixed(1)} KB)`}
                resultLabel={
                  activeFile.resultSize
                    ? `Compressed (${(activeFile.resultSize / 1024).toFixed(1)} KB) - ${getSavedPercent(activeFile.size, activeFile.resultSize)}`
                    : "Compressed"
                }
              />

              {/* File selection tabs */}
              {files.length > 1 && (
                <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
                  {files.map((file) => (
                    <button
                      key={file.id}
                      onClick={() => setSelectedFileId(file.id)}
                      className={`
                        px-3 py-1.5 rounded-lg text-[11px] font-bold border transition-all whitespace-nowrap
                        ${file.id === activeFile.id
                          ? "bg-[#0a84ff]/10 text-[#0a84ff] border-[#0a84ff]"
                          : "bg-[#111112] text-[#8e8e93] border-[#2a2a2d] hover:text-white"
                        }
                      `}
                    >
                      {file.name.substring(0, 12)}...
                    </button>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="h-[300px] border border-dashed border-[#2a2a2d] bg-[#111112] rounded-2xl flex flex-col items-center justify-center text-[#8e8e93] text-[13px]">
              Upload images to preview compression.
            </div>
          )}
        </div>

        {/* Right: Settings Control Panel */}
        <div className="space-y-4">
          <div className="bg-[#111112] border border-[#2a2a2d] p-5 rounded-2xl space-y-5">
            <div className="space-y-2.5">
              <div className="flex justify-between items-center text-[13px]">
                <label className="font-bold text-[#ebebf5] uppercase tracking-wider flex items-center gap-1.5">
                  <Sliders size={14} className="text-[#0a84ff]" />
                  Compression Level
                </label>
                <span className="font-bold text-white bg-[#1c1c1e] px-2 py-0.5 rounded border border-[#2a2a2d]">
                  {compressSettings.quality}%
                </span>
              </div>
              <input
                type="range"
                min="10"
                max="95"
                value={compressSettings.quality}
                onChange={(e) => updateCompressSettings({ quality: parseInt(e.target.value) })}
                className="w-full h-1.5 bg-[#1c1c1e] rounded-lg appearance-none cursor-pointer accent-[#0a84ff] border border-[#2a2a2d]"
              />
              <div className="flex justify-between text-[10px] text-[#8e8e93]">
                <span>Low Compression (Best Quality)</span>
                <span>High Compression (Smallest File)</span>
              </div>
            </div>

            <button
              onClick={handleCompress}
              disabled={files.length === 0 || processing}
              className="w-full py-3 px-4 flex items-center justify-center gap-2 text-[14px] font-bold text-white bg-[#0a84ff] hover:bg-[#0070e3] disabled:opacity-50 disabled:cursor-not-allowed active:scale-98 rounded-xl transition-all shadow-md shadow-[#0a84ff]/20"
            >
              {processing ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Compressing Queue...
                </>
              ) : (
                <>
                  <Zap size={16} />
                  Compress Images
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
