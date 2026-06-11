// ============================================================
// src/components/image-tools/WatermarkPanel.tsx
// ============================================================

"use client";

import React, { useState, useRef } from "react";
import { useImageToolsStore } from "@/store/image-tools-store";
import { watermarkImageAction } from "@/actions/image-tools";
import { WatermarkPosition } from "@/types/image-tools";
import { Type, Image as ImageIcon, Sliders, Upload, Loader2, Bookmark } from "lucide-react";

export function WatermarkPanel() {
  const { files, watermarkSettings, updateWatermarkSettings, updateFile } = useImageToolsStore();
  const [processing, setProcessing] = useState(false);
  const [wmFilename, setWmFilename] = useState<string | null>(null);
  const wmFileInputRef = useRef<HTMLInputElement>(null);

  const activeFile = files[0]; // Watermark active file

  const positions: { id: WatermarkPosition; label: string }[] = [
    { id: "top-left", label: "Top Left" },
    { id: "top-center", label: "Top Center" },
    { id: "top-right", label: "Top Right" },
    { id: "center", label: "Center" },
    { id: "bottom-left", label: "Bottom Left" },
    { id: "bottom-center", label: "Bottom Center" },
    { id: "bottom-right", label: "Bottom Right" },
  ];

  const handleWatermarkImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setWmFilename(file.name);

    const reader = new FileReader();
    reader.onload = (ev) => {
      const base64Data = ev.target?.result as string;
      updateWatermarkSettings({ imageWatermarkUrl: base64Data });
    };
    reader.readAsDataURL(file);
  };

  const handleApply = async () => {
    if (!activeFile || processing) return;
    setProcessing(true);

    updateFile(activeFile.id, { status: "processing", progress: 30 });

    try {
      const formData = new FormData();
      formData.append("file", activeFile.file);
      formData.append("settings", JSON.stringify(watermarkSettings));

      updateFile(activeFile.id, { progress: 70 });

      const res = await watermarkImageAction(formData);

      if (res.success && res.dataUrl) {
        updateFile(activeFile.id, {
          status: "success",
          progress: 100,
          resultUrl: res.dataUrl,
          resultSize: res.size,
          resultType: `image/${res.format}`,
        });
      } else {
        updateFile(activeFile.id, {
          status: "error",
          progress: 0,
          error: res.error || "Failed to apply watermark.",
        });
      }
    } catch (err) {
      updateFile(activeFile.id, {
        status: "error",
        progress: 0,
        error: (err as Error).message,
      });
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-bold text-white mb-1">Add Watermark</h3>
        <p className="text-xs text-[#8e8e93]">
          Protect your images by stamping a custom text watermark or logo image on top of them.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Preview */}
        <div className="lg:col-span-2 space-y-4">
          {activeFile ? (
            <div className="flex flex-col items-center justify-center p-4 bg-[#0d0d0e] border border-[#2a2a2d] rounded-2xl relative min-h-[300px]">
              {/* Image Preview Container */}
              <div className="relative max-h-[400px] overflow-hidden select-none">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={activeFile.resultUrl || activeFile.url}
                  alt="Watermark Preview"
                  className="max-h-[400px] object-contain w-full block rounded-lg"
                />

                {/* Live mock text watermark overlay on client for instant feedback */}
                {!activeFile.resultUrl && watermarkSettings.type === "text" && (
                  <div
                    className="absolute pointer-events-none text-center font-bold font-sans drop-shadow-md select-none"
                    style={{
                      color: watermarkSettings.color,
                      fontSize: `${watermarkSettings.fontSize * 0.75}px`,
                      opacity: watermarkSettings.opacity,
                      ...getLivePositionStyle(watermarkSettings.position),
                    }}
                  >
                    {watermarkSettings.text}
                  </div>
                )}

                {/* Live mock image watermark overlay */}
                {!activeFile.resultUrl && watermarkSettings.type === "image" && watermarkSettings.imageWatermarkUrl && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={watermarkSettings.imageWatermarkUrl}
                    alt="Logo Overlay"
                    className="absolute pointer-events-none object-contain select-none"
                    style={{
                      width: `${watermarkSettings.imageWatermarkWidth}%`,
                      opacity: watermarkSettings.opacity,
                      ...getLivePositionStyle(watermarkSettings.position),
                    }}
                  />
                )}
              </div>
            </div>
          ) : (
            <div className="h-[300px] border border-dashed border-[#2a2a2d] bg-[#111112] rounded-2xl flex flex-col items-center justify-center text-[#8e8e93] text-[13px]">
              Upload an image to watermark.
            </div>
          )}
        </div>

        {/* Right: Settings Control Panel */}
        <div className="space-y-4">
          <div className="bg-[#111112] border border-[#2a2a2d] p-5 rounded-2xl space-y-5">
            {/* Watermark Type Toggle */}
            <div className="flex bg-[#1c1c1e] p-1 border border-[#2a2a2d] rounded-xl">
              <button
                onClick={() => updateWatermarkSettings({ type: "text" })}
                className={`
                  flex-1 py-2 rounded-lg text-[12px] font-bold flex items-center justify-center gap-1.5 transition-all
                  ${watermarkSettings.type === "text" ? "bg-[#0a84ff] text-white" : "text-[#8e8e93] hover:text-white"}
                `}
              >
                <Type size={14} />
                Text
              </button>
              <button
                onClick={() => updateWatermarkSettings({ type: "image" })}
                className={`
                  flex-1 py-2 rounded-lg text-[12px] font-bold flex items-center justify-center gap-1.5 transition-all
                  ${watermarkSettings.type === "image" ? "bg-[#0a84ff] text-white" : "text-[#8e8e93] hover:text-white"}
                `}
              >
                <ImageIcon size={14} />
                Image
              </button>
            </div>

            {/* Type Specific Fields */}
            {watermarkSettings.type === "text" ? (
              <div className="space-y-4">
                {/* Text string */}
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-[#8e8e93] uppercase tracking-wider">
                    Watermark Text
                  </label>
                  <input
                    type="text"
                    value={watermarkSettings.text}
                    onChange={(e) => updateWatermarkSettings({ text: e.target.value })}
                    className="w-full bg-[#1c1c1e] text-white border border-[#2a2a2d] hover:border-[#3a3a3d] focus:border-[#0a84ff] rounded-xl px-4 py-2.5 text-[14px] outline-none transition-colors"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  {/* Font Size */}
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold text-[#8e8e93] uppercase tracking-wider">
                      Size (px)
                    </label>
                    <input
                      type="number"
                      value={watermarkSettings.fontSize}
                      onChange={(e) => updateWatermarkSettings({ fontSize: parseInt(e.target.value) || 12 })}
                      className="w-full bg-[#1c1c1e] text-white border border-[#2a2a2d] hover:border-[#3a3a3d] focus:border-[#0a84ff] rounded-xl px-3 py-2.5 text-[14px] outline-none transition-colors"
                    />
                  </div>

                  {/* Color Picker */}
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold text-[#8e8e93] uppercase tracking-wider">
                      Color
                    </label>
                    <div className="flex items-center bg-[#1c1c1e] border border-[#2a2a2d] rounded-xl p-1.5 h-[42px]">
                      <input
                        type="color"
                        value={watermarkSettings.color}
                        onChange={(e) => updateWatermarkSettings({ color: e.target.value })}
                        className="w-8 h-8 rounded border border-[#2a2a2d] bg-transparent cursor-pointer outline-none"
                      />
                      <span className="text-[12px] text-white ml-2 uppercase font-mono">
                        {watermarkSettings.color}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Logo file upload */}
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-[#8e8e93] uppercase tracking-wider block">
                    Watermark Image
                  </label>
                  <input
                    ref={wmFileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleWatermarkImageUpload}
                  />
                  <button
                    onClick={() => wmFileInputRef.current?.click()}
                    className="w-full py-2.5 border-2 border-dashed border-[#2a2a2d] hover:border-[#3a3a3d] hover:bg-[#151517] bg-[#111112] rounded-xl text-[13px] text-[#8e8e93] hover:text-white flex items-center justify-center gap-2 transition-all"
                  >
                    <Upload size={14} />
                    {wmFilename ? wmFilename.substring(0, 15) + "..." : "Select Logo Image"}
                  </button>
                </div>

                {/* Logo Size/Scale */}
                {watermarkSettings.imageWatermarkUrl && (
                  <div className="space-y-2">
                    <div className="flex justify-between items-center text-[12px] text-[#ebebf5]">
                      <span>Watermark Scale</span>
                      <span>{watermarkSettings.imageWatermarkWidth}%</span>
                    </div>
                    <input
                      type="range"
                      min="5"
                      max="60"
                      value={watermarkSettings.imageWatermarkWidth || 20}
                      onChange={(e) => updateWatermarkSettings({ imageWatermarkWidth: parseInt(e.target.value) })}
                      className="w-full h-1 bg-[#1c1c1e] rounded-lg appearance-none cursor-pointer accent-[#0a84ff]"
                    />
                  </div>
                )}
              </div>
            )}

            {/* Opacity slider */}
            <div className="space-y-2 pt-2 border-t border-[#2a2a2d]">
              <div className="flex justify-between items-center text-[13px]">
                <label className="font-bold text-[#ebebf5] uppercase tracking-wider flex items-center gap-1.5">
                  <Sliders size={14} className="text-[#0a84ff]" />
                  Opacity
                </label>
                <span className="font-bold text-white bg-[#1c1c1e] px-2 py-0.5 rounded border border-[#2a2a2d]">
                  {Math.round(watermarkSettings.opacity * 100)}%
                </span>
              </div>
              <input
                type="range"
                min="10"
                max="100"
                value={watermarkSettings.opacity * 100}
                onChange={(e) => updateWatermarkSettings({ opacity: parseInt(e.target.value) / 100 })}
                className="w-full h-1.5 bg-[#1c1c1e] rounded-lg appearance-none cursor-pointer accent-[#0a84ff] border border-[#2a2a2d]"
              />
            </div>

            {/* Position grid selector */}
            <div className="space-y-2 pt-2 border-t border-[#2a2a2d]">
              <label className="text-[13px] font-bold text-[#ebebf5] uppercase tracking-wider block">
                Position
              </label>
              {/* 3x3 layout Grid selector */}
              <div className="grid grid-cols-3 gap-1 bg-[#1c1c1e] p-1.5 rounded-xl border border-[#2a2a2d] w-[180px] mx-auto">
                <GridPosButton pos="top-left" current={watermarkSettings.position} onClick={(p) => updateWatermarkSettings({ position: p })} />
                <GridPosButton pos="top-center" current={watermarkSettings.position} onClick={(p) => updateWatermarkSettings({ position: p })} />
                <GridPosButton pos="top-right" current={watermarkSettings.position} onClick={(p) => updateWatermarkSettings({ position: p })} />
                <GridPosButton pos="center-left" displayLabel="←" current={watermarkSettings.position} onClick={() => updateWatermarkSettings({ position: "center" })} />
                <GridPosButton pos="center" displayLabel="•" current={watermarkSettings.position} onClick={(p) => updateWatermarkSettings({ position: p })} />
                <GridPosButton pos="center-right" displayLabel="→" current={watermarkSettings.position} onClick={() => updateWatermarkSettings({ position: "center" })} />
                <GridPosButton pos="bottom-left" current={watermarkSettings.position} onClick={(p) => updateWatermarkSettings({ position: p })} />
                <GridPosButton pos="bottom-center" current={watermarkSettings.position} onClick={(p) => updateWatermarkSettings({ position: p })} />
                <GridPosButton pos="bottom-right" current={watermarkSettings.position} onClick={(p) => updateWatermarkSettings({ position: p })} />
              </div>
            </div>

            <button
              onClick={handleApply}
              disabled={files.length === 0 || processing}
              className="w-full py-3 px-4 flex items-center justify-center gap-2 text-[14px] font-bold text-white bg-[#0a84ff] hover:bg-[#0070e3] disabled:opacity-50 disabled:cursor-not-allowed active:scale-98 rounded-xl transition-all shadow-md shadow-[#0a84ff]/20"
            >
              {processing ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Stamping Watermark...
                </>
              ) : (
                <>
                  <Bookmark size={16} />
                  Apply Watermark
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Grid position button item helper
 */
interface GridPosProps {
  pos: string;
  displayLabel?: string;
  current: WatermarkPosition;
  onClick: (pos: WatermarkPosition) => void;
}
function GridPosButton({ pos, displayLabel = "", current, onClick }: GridPosProps) {
  // Map our 3x3 names to WatermarkPosition
  let isSelected = current === pos;
  if (pos === "center-left" || pos === "center-right") {
    isSelected = current === "center";
  }

  return (
    <button
      onClick={() => onClick(pos as WatermarkPosition)}
      className={`
        h-9 rounded flex items-center justify-center text-[10px] font-bold font-mono transition-all
        ${isSelected 
          ? "bg-[#0a84ff] text-white" 
          : "bg-[#111112] text-[#48484a] hover:bg-[#2c2c2e] hover:text-[#8e8e93]"
        }
      `}
      title={pos.replace("-", " ").toUpperCase()}
    >
      {displayLabel || "■"}
    </button>
  );
}

/**
 * Helper to position overlay dynamically on the client preview container
 */
function getLivePositionStyle(position: WatermarkPosition): React.CSSProperties {
  const pad = "12px";
  switch (position) {
    case "top-left":
      return { top: pad, left: pad };
    case "top-center":
      return { top: pad, left: "50%", transform: "translateX(-50%)" };
    case "top-right":
      return { top: pad, right: pad };
    case "center":
      return { top: "50%", left: "50%", transform: "translate(-50%, -50%)" };
    case "bottom-left":
      return { bottom: pad, left: pad };
    case "bottom-center":
      return { bottom: pad, left: "50%", transform: "translateX(-50%)" };
    case "bottom-right":
    default:
      return { bottom: pad, right: pad };
  }
}
