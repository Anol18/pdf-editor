// ============================================================
// src/components/image-tools/RotatePanel.tsx
// ============================================================

"use client";

import React, { useState } from "react";
import { useImageToolsStore } from "@/store/image-tools-store";
import { rotateImageAction } from "@/actions/image-tools";
import { RotateCw, RotateCcw, FlipHorizontal, FlipVertical, Loader2 } from "lucide-react";

export function RotatePanel() {
  const { files, rotateSettings, updateRotateSettings, updateFile } = useImageToolsStore();
  const [processing, setProcessing] = useState(false);

  const activeFile = files[0]; // Rotate active file

  const rotateRight = () => {
    const nextAngle = ((rotateSettings.angle + 90) % 360) as 0 | 90 | 180 | 270;
    updateRotateSettings({ angle: nextAngle });
  };

  const rotateLeft = () => {
    // Adding 270 is equivalent to subtracting 90 modulo 360
    const nextAngle = ((rotateSettings.angle + 270) % 360) as 0 | 90 | 180 | 270;
    updateRotateSettings({ angle: nextAngle });
  };

  const toggleFlipH = () => {
    updateRotateSettings({ flipH: !rotateSettings.flipH });
  };

  const toggleFlipV = () => {
    updateRotateSettings({ flipV: !rotateSettings.flipV });
  };

  const handleApply = async () => {
    if (!activeFile || processing) return;
    setProcessing(true);

    updateFile(activeFile.id, { status: "processing", progress: 30 });

    try {
      const formData = new FormData();
      formData.append("file", activeFile.file);
      formData.append("angle", rotateSettings.angle.toString());
      formData.append("flipH", rotateSettings.flipH.toString());
      formData.append("flipV", rotateSettings.flipV.toString());

      updateFile(activeFile.id, { progress: 75 });

      const res = await rotateImageAction(formData);

      if (res.success && res.dataUrl) {
        updateFile(activeFile.id, {
          status: "success",
          progress: 100,
          resultUrl: res.dataUrl,
          resultSize: res.size,
          resultType: `image/${res.format}`,
        });
        
        // Reset transformation settings on client preview since they are baked in
        updateRotateSettings({ angle: 0, flipH: false, flipV: false });
      } else {
        updateFile(activeFile.id, {
          status: "error",
          progress: 0,
          error: res.error || "Rotation failed.",
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
        <h3 className="text-lg font-bold text-white mb-1">Rotate & Flip</h3>
        <p className="text-xs text-[#8e8e93]">
          Turn your image left or right, and mirror it horizontally or vertically.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Live Interactive CSS-Transform Preview */}
        <div className="lg:col-span-2 space-y-4">
          {activeFile ? (
            <div className="flex flex-col items-center justify-center p-8 bg-[#0d0d0e] border border-[#2a2a2d] rounded-2xl relative min-h-[300px] overflow-hidden">
              <div 
                className="transition-transform duration-300 ease-out max-h-[350px] max-w-full flex items-center justify-center"
                style={{
                  transform: `rotate(${rotateSettings.angle}deg) scaleX(${rotateSettings.flipH ? -1 : 1}) scaleY(${rotateSettings.flipV ? -1 : 1})`,
                }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={activeFile.url}
                  alt="Rotate Preview"
                  className="max-h-[300px] object-contain rounded-lg border border-white/5 shadow-2xl select-none"
                  style={{ userSelect: "none" }}
                />
              </div>
            </div>
          ) : (
            <div className="h-[300px] border border-dashed border-[#2a2a2d] bg-[#111112] rounded-2xl flex flex-col items-center justify-center text-[#8e8e93] text-[13px]">
              Upload an image to rotate or flip.
            </div>
          )}
        </div>

        {/* Right: Settings Control Panel */}
        <div className="space-y-4">
          <div className="bg-[#111112] border border-[#2a2a2d] p-5 rounded-2xl space-y-5">
            {/* Rotation Controls */}
            <div className="space-y-2.5">
              <label className="text-[13px] font-bold text-[#ebebf5] uppercase tracking-wider block">
                Rotation
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={rotateLeft}
                  className="py-3 bg-[#1c1c1e] text-[#8e8e93] hover:text-white border border-[#2a2a2d] hover:bg-[#2c2c2e] rounded-xl flex items-center justify-center gap-2 text-[13px] font-bold transition-all"
                >
                  <RotateCcw size={16} />
                  Left 90°
                </button>
                <button
                  onClick={rotateRight}
                  className="py-3 bg-[#1c1c1e] text-[#8e8e93] hover:text-white border border-[#2a2a2d] hover:bg-[#2c2c2e] rounded-xl flex items-center justify-center gap-2 text-[13px] font-bold transition-all"
                >
                  <RotateCw size={16} />
                  Right 90°
                </button>
              </div>
            </div>

            {/* Mirror Controls */}
            <div className="space-y-2.5 pt-2 border-t border-[#2a2a2d]">
              <label className="text-[13px] font-bold text-[#ebebf5] uppercase tracking-wider block">
                Mirror / Flip
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={toggleFlipH}
                  className={`
                    py-3 border rounded-xl flex items-center justify-center gap-2 text-[13px] font-bold transition-all
                    ${rotateSettings.flipH
                      ? "bg-[#0a84ff]/10 border-[#0a84ff] text-[#0a84ff]"
                      : "bg-[#1c1c1e] text-[#8e8e93] border-[#2a2a2d] hover:text-white hover:bg-[#2c2c2e]"
                    }
                  `}
                >
                  <FlipHorizontal size={16} />
                  Horizontal
                </button>
                <button
                  onClick={toggleFlipV}
                  className={`
                    py-3 border rounded-xl flex items-center justify-center gap-2 text-[13px] font-bold transition-all
                    ${rotateSettings.flipV
                      ? "bg-[#0a84ff]/10 border-[#0a84ff] text-[#0a84ff]"
                      : "bg-[#1c1c1e] text-[#8e8e93] border-[#2a2a2d] hover:text-white hover:bg-[#2c2c2e]"
                    }
                  `}
                >
                  <FlipVertical size={16} />
                  Vertical
                </button>
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
                  Baking Rotation...
                </>
              ) : (
                <>
                  <RotateCw size={16} />
                  Apply Transformations
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
