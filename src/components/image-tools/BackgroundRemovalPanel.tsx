// ============================================================
// src/components/image-tools/BackgroundRemovalPanel.tsx
// ============================================================

"use client";

import React, { useState } from "react";
import { useImageToolsStore } from "@/store/image-tools-store";
import { removeBackgroundAction } from "@/actions/image-tools";
import { ImagePreview } from "./ImagePreview";
import { Eraser, Loader2, Sparkles } from "lucide-react";

// Singleton segmentator promise to prevent re-initializing model on multiple runs
let segmentatorPromise: any = null;
async function getSegmentator() {
  if (!segmentatorPromise) {
    const { pipeline } = await import("@huggingface/transformers");
    segmentatorPromise = pipeline("image-segmentation", "briaai/RMBG-1.4");
  }
  return segmentatorPromise;
}

export function BackgroundRemovalPanel() {
  const { files, updateFile } = useImageToolsStore();
  const [processing, setProcessing] = useState(false);
  const [statusText, setStatusText] = useState("");

  const activeFile = files[0]; // Process active file

  const handleRemoveBackground = async () => {
    if (!activeFile || processing) return;
    setProcessing(true);
    setStatusText("Initializing AI Model...");

    updateFile(activeFile.id, { status: "processing", progress: 10 });

    let imageUrl = "";

    try {
      // 1. Client-side AI Processing using MIT-licensed Transformers.js (briaai/RMBG-1.4)
      setStatusText("Initializing model (briaai/RMBG-1.4)...");
      updateFile(activeFile.id, { progress: 20 });

      const segmentator = await getSegmentator();
      
      updateFile(activeFile.id, { progress: 50 });
      setStatusText("Analyzing image structure...");

      // Convert File to object URL
      imageUrl = URL.createObjectURL(activeFile.file);
      
      const { RawImage } = await import("@huggingface/transformers");
      const rawImage = await RawImage.fromURL(imageUrl);

      setStatusText("Isolating subjects...");
      updateFile(activeFile.id, { progress: 70 });
      
      const result = await segmentator(rawImage);
      const mask = result[0].mask;

      updateFile(activeFile.id, { progress: 85 });
      setStatusText("Compositing transparency...");

      // Apply the mask alpha onto canvas
      const canvas = document.createElement("canvas");
      canvas.width = rawImage.width;
      canvas.height = rawImage.height;
      const ctx = canvas.getContext("2d");
      if (!ctx) throw new Error("Could not create canvas context");

      // Draw original image onto canvas
      const originalCanvas = await rawImage.toCanvas();
      ctx.drawImage(originalCanvas, 0, 0);

      // Get canvas image data
      const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imgData.data;

      // Get mask canvas
      const maskCanvas = await mask.toCanvas();
      const maskCtx = maskCanvas.getContext("2d");
      if (!maskCtx) throw new Error("Could not create mask canvas context");
      const maskData = maskCtx.getImageData(0, 0, canvas.width, canvas.height).data;

      // Replace alpha channel of original image with mask's red/grayscale channel value
      for (let i = 0; i < data.length; i += 4) {
        data[i + 3] = maskData[i]; 
      }

      // Put image data back to canvas
      ctx.putImageData(imgData, 0, 0);

      // Convert canvas to blob
      const outputBlob = await new Promise<Blob>((resolve, reject) => {
        canvas.toBlob((blob) => {
          if (blob) resolve(blob);
          else reject(new Error("Canvas to blob failed"));
        }, "image/png");
      });

      const resultUrl = URL.createObjectURL(outputBlob);

      updateFile(activeFile.id, {
        status: "success",
        progress: 100,
        resultUrl: resultUrl,
        resultSize: outputBlob.size,
        resultType: "image/png",
      });
      setStatusText("Background removed successfully!");

    } catch (clientErr) {
      console.warn("Client-side WASM background removal failed, falling back to Server Action:", clientErr);
      
      // 2. Fallback to Server Action
      setStatusText("WASM unsupported. Falling back to server-side pipeline...");
      updateFile(activeFile.id, { progress: 40 });

      try {
        const formData = new FormData();
        formData.append("file", activeFile.file);

        const res = await removeBackgroundAction(formData);

        if (res.success && res.dataUrl) {
          updateFile(activeFile.id, {
            status: "success",
            progress: 100,
            resultUrl: res.dataUrl,
            resultSize: res.size,
            resultType: "image/png",
          });
          setStatusText("Background transparent converted (Server-side).");
        } else {
          updateFile(activeFile.id, {
            status: "error",
            progress: 0,
            error: res.error || "Server-side background removal failed.",
          });
          setStatusText("Background removal failed.");
        }
      } catch (serverErr) {
        updateFile(activeFile.id, {
          status: "error",
          progress: 0,
          error: (serverErr as Error).message,
        });
        setStatusText("Background removal failed.");
      }
    } finally {
      if (imageUrl) {
        URL.revokeObjectURL(imageUrl);
      }
      setProcessing(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-bold text-white mb-1">Remove Background</h3>
        <p className="text-xs text-[#8e8e93]">
          Uses edge-detection neural network models to isolate subjects and make image backgrounds transparent.
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
                originalLabel="Original"
                resultLabel="Transparent PNG"
              />
            </div>
          ) : (
            <div className="h-[300px] border border-dashed border-[#2a2a2d] bg-[#111112] rounded-2xl flex flex-col items-center justify-center text-[#8e8e93] text-[13px]">
              Upload an image to remove background.
            </div>
          )}
        </div>

        {/* Right: Settings Control Panel */}
        <div className="space-y-4">
          <div className="bg-[#111112] border border-[#2a2a2d] p-5 rounded-2xl space-y-5">
            <div className="space-y-3">
              <h4 className="text-[12px] font-bold text-[#ebebf5] uppercase tracking-wider">
                AI Mode Settings
              </h4>
              <div className="p-3 bg-[#1c1c1e] border border-[#2a2a2d] rounded-xl text-[12px] text-[#8e8e93] leading-relaxed space-y-2">
                <p className="flex items-center gap-1.5 text-white font-semibold">
                  <Sparkles size={14} className="text-amber-400" />
                  Local AI Processing (MIT)
                </p>
                <p>
                  Downloads an ONNX segmentation model (~45MB) locally to your browser on the first run. 100% private and commercial-friendly.
                </p>
              </div>
            </div>

            <button
              onClick={handleRemoveBackground}
              disabled={files.length === 0 || processing}
              className="w-full py-3 px-4 flex items-center justify-center gap-2 text-[14px] font-bold text-white bg-[#0a84ff] hover:bg-[#0070e3] disabled:opacity-50 disabled:cursor-not-allowed active:scale-98 rounded-xl transition-all shadow-md shadow-[#0a84ff]/20"
            >
              {processing ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  <span>{statusText || "Removing..."}</span>
                </>
              ) : (
                <>
                  <Eraser size={16} />
                  Remove Background
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
