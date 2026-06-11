// ============================================================
// src/components/image-tools/UpscalePanel.tsx
// ============================================================

"use client";

import React, { useState } from "react";
import { useImageToolsStore } from "@/store/image-tools-store";
import { upscaleImageAction } from "@/actions/image-tools";
import { ImagePreview } from "./ImagePreview";
import { Sparkles, Loader2, Cpu } from "lucide-react";

export function UpscalePanel() {
  const { files, upscaleSettings, updateUpscaleSettings, updateFile } = useImageToolsStore();
  const [processing, setProcessing] = useState(false);

  const activeFile = files[0]; // Upscale active file

  const providers = [
    { id: "mock", name: "Local Mock", desc: "Fast Lanczos3 interpolation (Sharp)" },
    { id: "replicate", name: "Replicate AI", desc: "Real-ESRGAN cloud (requires API token)" },
    { id: "runpod", name: "RunPod AI", desc: "Serverless container (requires Endpoint)" },
    { id: "modal", name: "Modal AI", desc: "Custom Python GPU runner (requires Endpoint)" },
  ];

  const handleUpscale = async () => {
    if (!activeFile || processing) return;
    setProcessing(true);

    updateFile(activeFile.id, { status: "processing", progress: 20 });

    try {
      const formData = new FormData();
      formData.append("file", activeFile.file);
      formData.append("scale", upscaleSettings.scale.toString());
      formData.append("provider", upscaleSettings.provider);

      updateFile(activeFile.id, { progress: 65 });

      const res = await upscaleImageAction(formData);

      if (res.success && res.dataUrl) {
        updateFile(activeFile.id, {
          status: "success",
          progress: 100,
          resultUrl: res.dataUrl,
          resultSize: res.size,
          resultType: `image/${res.format}`,
          // Update client-side dimensions representation
          width: activeFile.width ? activeFile.width * upscaleSettings.scale : undefined,
          height: activeFile.height ? activeFile.height * upscaleSettings.scale : undefined,
        });
      } else {
        updateFile(activeFile.id, {
          status: "error",
          progress: 0,
          error: res.error || "Upscale failed.",
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
        <h3 className="text-lg font-bold text-white mb-1">AI Upscale</h3>
        <p className="text-xs text-[#8e8e93]">
          Enhance and increase the resolution of your images. Choose between 2x and 4x multipliers.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Preview Slider */}
        <div className="lg:col-span-2 space-y-4">
          {activeFile ? (
            <div className="space-y-3">
              <ImagePreview
                originalUrl={activeFile.url}
                resultUrl={activeFile.resultUrl}
                originalLabel={activeFile.width && activeFile.height ? `Original (${activeFile.width}x${activeFile.height})` : "Original"}
                resultLabel={
                  activeFile.resultUrl && activeFile.width && activeFile.height
                    ? `Upscaled (${activeFile.width * upscaleSettings.scale}x${activeFile.height * upscaleSettings.scale})`
                    : "Upscaled"
                }
              />
            </div>
          ) : (
            <div className="h-[300px] border border-dashed border-[#2a2a2d] bg-[#111112] rounded-2xl flex flex-col items-center justify-center text-[#8e8e93] text-[13px]">
              Upload an image to upscale.
            </div>
          )}
        </div>

        {/* Right: Settings Control Panel */}
        <div className="space-y-4">
          <div className="bg-[#111112] border border-[#2a2a2d] p-5 rounded-2xl space-y-5">
            {/* Scale Options */}
            <div className="space-y-2.5">
              <label className="text-[13px] font-bold text-[#ebebf5] uppercase tracking-wider block">
                Scale Factor
              </label>
              <div className="grid grid-cols-2 gap-2">
                {[2, 4].map((s) => (
                  <button
                    key={s}
                    onClick={() => updateUpscaleSettings({ scale: s as 2 | 4 })}
                    className={`
                      py-2.5 rounded-xl text-center text-[13px] font-bold transition-all
                      ${upscaleSettings.scale === s
                        ? "bg-[#0a84ff] text-white shadow-lg shadow-[#0a84ff]/15"
                        : "bg-[#1c1c1e] text-[#8e8e93] border border-[#2a2a2d] hover:text-white hover:bg-[#2c2c2e]"
                      }
                    `}
                  >
                    {s}x Scale
                  </button>
                ))}
              </div>
            </div>

            {/* Provider Abstraction Options */}
            <div className="space-y-2.5 pt-2 border-t border-[#2a2a2d]">
              <label className="text-[13px] font-bold text-[#ebebf5] uppercase tracking-wider block">
                Upscale Engine Provider
              </label>
              <div className="flex flex-col gap-1.5">
                {providers.map((p) => {
                  const isSelected = upscaleSettings.provider === p.id;
                  return (
                    <button
                      key={p.id}
                      onClick={() => updateUpscaleSettings({ provider: p.id as any })}
                      className={`
                        p-3 rounded-xl border text-left transition-all duration-200
                        ${isSelected
                          ? "bg-[#0a84ff]/10 text-white border-[#0a84ff] shadow-md shadow-[#0a84ff]/5"
                          : "bg-[#1c1c1e] text-[#8e8e93] border-[#2a2a2d] hover:border-[#3a3a3d] hover:text-white"
                        }
                      `}
                    >
                      <p className="text-[12px] font-bold flex items-center gap-1.5">
                        <Cpu size={12} className={isSelected ? "text-[#0a84ff]" : "text-[#8e8e93]"} />
                        {p.name}
                      </p>
                      <p className="text-[10px] opacity-75 mt-0.5 leading-tight">{p.desc}</p>
                    </button>
                  );
                })}
              </div>
            </div>

            <button
              onClick={handleUpscale}
              disabled={files.length === 0 || processing}
              className="w-full py-3 px-4 flex items-center justify-center gap-2 text-[14px] font-bold text-white bg-[#0a84ff] hover:bg-[#0070e3] disabled:opacity-50 disabled:cursor-not-allowed active:scale-98 rounded-xl transition-all shadow-md shadow-[#0a84ff]/20"
            >
              {processing ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Upscaling Subject...
                </>
              ) : (
                <>
                  <Sparkles size={16} />
                  Upscale Image
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
