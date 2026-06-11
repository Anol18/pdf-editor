// ============================================================
// src/components/image-tools/ResizePanel.tsx
// ============================================================

"use client";

import React, { useState, useEffect } from "react";
import { useImageToolsStore } from "@/store/image-tools-store";
import { resizeImageAction } from "@/actions/image-tools";
import { ResizePresetId } from "@/types/image-tools";
import { Ruler, Loader2, Check } from "lucide-react";

interface PresetItem {
  id: ResizePresetId;
  name: string;
  width: number;
  height: number;
  aspectRatio: string;
}

const PRESETS: PresetItem[] = [
  { id: "custom", name: "Custom Size", width: 800, height: 600, aspectRatio: "Custom" },
  { id: "insta_post", name: "Instagram Post", width: 1080, height: 1080, aspectRatio: "1:1" },
  { id: "insta_story", name: "Instagram Story", width: 1080, height: 1920, aspectRatio: "9:16" },
  { id: "fb_post", name: "Facebook Post", width: 940, height: 788, aspectRatio: "1.2:1" },
  { id: "x_post", name: "Twitter/X Post", width: 1600, height: 900, aspectRatio: "16:9" },
  { id: "linkedin_post", name: "LinkedIn Post", width: 1200, height: 628, aspectRatio: "1.91:1" },
  { id: "yt_thumb", name: "YouTube Thumbnail", width: 1280, height: 720, aspectRatio: "16:9" },
  { id: "yt_banner", name: "YouTube Banner", width: 2560, height: 1440, aspectRatio: "16:9" },
];

export function ResizePanel() {
  const { files, resizeSettings, updateResizeSettings, updateFile } = useImageToolsStore();
  const [processing, setProcessing] = useState(false);
  
  const activeFile = files[0]; // Reference image for aspect ratio

  // Aspect ratio helper
  const getAspectRatio = () => {
    if (activeFile && activeFile.width && activeFile.height) {
      return activeFile.width / activeFile.height;
    }
    return 4 / 3;
  };

  const handleWidthChange = (val: number) => {
    if (resizeSettings.lockAspectRatio) {
      const ratio = getAspectRatio();
      const calculatedHeight = Math.round(val / ratio);
      updateResizeSettings({ width: val, height: calculatedHeight, presetId: "custom" });
    } else {
      updateResizeSettings({ width: val, presetId: "custom" });
    }
  };

  const handleHeightChange = (val: number) => {
    if (resizeSettings.lockAspectRatio) {
      const ratio = getAspectRatio();
      const calculatedWidth = Math.round(val * ratio);
      updateResizeSettings({ height: val, width: calculatedWidth, presetId: "custom" });
    } else {
      updateResizeSettings({ height: val, presetId: "custom" });
    }
  };

  const selectPreset = (preset: PresetItem) => {
    if (preset.id === "custom") {
      updateResizeSettings({ presetId: "custom" });
    } else {
      updateResizeSettings({
        presetId: preset.id,
        width: preset.width,
        height: preset.height,
        lockAspectRatio: false, // Presets define explicit width & height
      });
    }
  };

  const handleResize = async () => {
    if (files.length === 0) return;
    setProcessing(true);

    const promises = files.map(async (fileItem) => {
      if (fileItem.status === "success") return;
      updateFile(fileItem.id, { status: "processing", progress: 20 });

      try {
        const formData = new FormData();
        formData.append("file", fileItem.file);
        formData.append("width", resizeSettings.width.toString());
        formData.append("height", resizeSettings.height.toString());
        formData.append("lockAspectRatio", resizeSettings.lockAspectRatio.toString());

        updateFile(fileItem.id, { progress: 60 });

        const res = await resizeImageAction(formData);

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
            error: res.error || "Resize failed.",
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

  // Sync initial inputs with uploaded file dimensions if custom is selected and inputs are empty or default
  useEffect(() => {
    if (activeFile && activeFile.width && activeFile.height && resizeSettings.presetId === "custom") {
      updateResizeSettings({
        width: activeFile.width,
        height: activeFile.height,
      });
    }
  }, [activeFile]);

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-bold text-white mb-1">Resize Image</h3>
        <p className="text-xs text-[#8e8e93]">
          Adjust the width and height dimensions of your images. Choose from common social media presets.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Presets Grid */}
        <div className="lg:col-span-2 space-y-4">
          <label className="text-[13px] font-bold text-[#ebebf5] uppercase tracking-wider block">
            Presets & Layouts
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {PRESETS.map((preset) => {
              const isSelected = resizeSettings.presetId === preset.id;
              return (
                <button
                  key={preset.id}
                  onClick={() => selectPreset(preset)}
                  className={`
                    p-4 rounded-xl flex items-center justify-between border text-left transition-all duration-200
                    ${isSelected
                      ? "bg-[#0a84ff]/10 text-white border-[#0a84ff] shadow-md shadow-[#0a84ff]/5"
                      : "bg-[#111112] text-[#8e8e93] border-[#2a2a2d] hover:border-[#3a3a3d] hover:bg-[#151517] hover:text-white"
                    }
                  `}
                >
                  <div className="space-y-1">
                    <p className="text-[14px] font-bold">{preset.name}</p>
                    <p className="text-[11px] opacity-75">
                      {preset.width} × {preset.height} px • {preset.aspectRatio}
                    </p>
                  </div>
                  {isSelected && (
                    <div className="w-5 h-5 rounded-full bg-[#0a84ff] flex items-center justify-center text-white">
                      <Check size={12} strokeWidth={3} />
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Right: Settings Control Panel */}
        <div className="space-y-4">
          <div className="bg-[#111112] border border-[#2a2a2d] p-5 rounded-2xl space-y-5">
            <div className="space-y-3.5">
              {/* Width */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-[#8e8e93] uppercase tracking-wider">
                  Width (px)
                </label>
                <input
                  type="number"
                  value={resizeSettings.width || ""}
                  onChange={(e) => handleWidthChange(parseInt(e.target.value) || 0)}
                  className="w-full bg-[#1c1c1e] text-white border border-[#2a2a2d] hover:border-[#3a3a3d] focus:border-[#0a84ff] rounded-xl px-4 py-2.5 text-[14px] outline-none transition-colors"
                />
              </div>

              {/* Height */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-[#8e8e93] uppercase tracking-wider">
                  Height (px)
                </label>
                <input
                  type="number"
                  value={resizeSettings.height || ""}
                  onChange={(e) => handleHeightChange(parseInt(e.target.value) || 0)}
                  className="w-full bg-[#1c1c1e] text-white border border-[#2a2a2d] hover:border-[#3a3a3d] focus:border-[#0a84ff] rounded-xl px-4 py-2.5 text-[14px] outline-none transition-colors"
                />
              </div>

              {/* Lock Ratio */}
              <label className="flex items-center gap-2.5 text-[13px] text-white font-medium cursor-pointer py-1.5">
                <input
                  type="checkbox"
                  checked={resizeSettings.lockAspectRatio}
                  onChange={(e) => {
                    const lock = e.target.checked;
                    updateResizeSettings({ lockAspectRatio: lock });
                    if (lock) {
                      // Recalculate height from current width
                      handleWidthChange(resizeSettings.width);
                    }
                  }}
                  className="rounded border-[#2a2a2d] bg-[#1c1c1e] text-[#0a84ff] w-4.5 h-4.5 focus:ring-[#0a84ff] cursor-pointer"
                />
                Lock Aspect Ratio
              </label>
            </div>

            <button
              onClick={handleResize}
              disabled={files.length === 0 || processing}
              className="w-full py-3 px-4 flex items-center justify-center gap-2 text-[14px] font-bold text-white bg-[#0a84ff] hover:bg-[#0070e3] disabled:opacity-50 disabled:cursor-not-allowed active:scale-98 rounded-xl transition-all shadow-md shadow-[#0a84ff]/20"
            >
              {processing ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Resizing Queue...
                </>
              ) : (
                <>
                  <Ruler size={16} />
                  Resize Images
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
