// ============================================================
// src/components/image-tools/CropPanel.tsx
// ============================================================

"use client";

import React, { useState, useRef, useEffect } from "react";
import { useImageToolsStore } from "@/store/image-tools-store";
import { cropImageAction } from "@/actions/image-tools";
import { CropAspectRatio } from "@/types/image-tools";
import { Crop, Loader2, Maximize } from "lucide-react";

export function CropPanel() {
  const { files, cropSettings, updateCropSettings, updateFile } = useImageToolsStore();
  const [processing, setProcessing] = useState(false);
  const [imgLoaded, setImgLoaded] = useState(false);
  
  // Crop area in percentage (0 to 100)
  const [cropBox, setCropBox] = useState({ x: 10, y: 10, w: 80, h: 80 });
  const [activeHandle, setActiveHandle] = useState<string | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const dragStart = useRef({ x: 0, y: 0, boxX: 0, boxY: 0, boxW: 0, boxH: 0 });

  const activeFile = files[0]; // Crop active file

  const aspectRatios: { id: CropAspectRatio; name: string; value: number | null }[] = [
    { id: "free", name: "Free", value: null },
    { id: "1:1", name: "1:1 Square", value: 1 },
    { id: "4:3", name: "4:3 Standard", value: 4 / 3 },
    { id: "16:9", name: "16:9 Widescreen", value: 16 / 9 },
    { id: "9:16", name: "9:16 Story", value: 9 / 16 },
  ];

  // Adjust crop box size when aspect ratio changes
  const handleAspectChange = (aspect: CropAspectRatio) => {
    updateCropSettings({ aspect });
    
    const ratioItem = aspectRatios.find((r) => r.id === aspect);
    if (!ratioItem || ratioItem.value === null) return;

    const targetRatio = ratioItem.value;
    
    // Calculate new width and height inside boundary
    let newW = cropBox.w;
    let newH = newW / targetRatio;

    if (newH > 90) {
      newH = 80;
      newW = newH * targetRatio;
    }

    // Centered crop box
    setCropBox({
      x: Math.round((100 - newW) / 2),
      y: Math.round((100 - newH) / 2),
      w: Math.round(newW),
      h: Math.round(newH),
    });
  };

  const handleImageLoad = () => {
    setImgLoaded(true);
    // Initialize default crop box
    setCropBox({ x: 15, y: 15, w: 70, h: 70 });
  };

  const handleMouseDown = (e: React.MouseEvent, handle: string) => {
    e.preventDefault();
    e.stopPropagation();
    setActiveHandle(handle);
    dragStart.current = {
      x: e.clientX,
      y: e.clientY,
      boxX: cropBox.x,
      boxY: cropBox.y,
      boxW: cropBox.w,
      boxH: cropBox.h,
    };
  };

  const handleTouchStart = (e: React.TouchEvent, handle: string) => {
    e.stopPropagation();
    if (e.touches[0]) {
      setActiveHandle(handle);
      dragStart.current = {
        x: e.touches[0].clientX,
        y: e.touches[0].clientY,
        boxX: cropBox.x,
        boxY: cropBox.y,
        boxW: cropBox.w,
        boxH: cropBox.h,
      };
    }
  };

  useEffect(() => {
    const handleMove = (clientX: number, clientY: number) => {
      if (!activeHandle || !containerRef.current) return;

      const containerRect = containerRef.current.getBoundingClientRect();
      
      // Calculate delta in percentage
      const deltaX = ((clientX - dragStart.current.x) / containerRect.width) * 100;
      const deltaY = ((clientY - dragStart.current.y) / containerRect.height) * 100;

      const activeRatio = aspectRatios.find((r) => r.id === cropSettings.aspect)?.value;

      setCropBox((prev) => {
        let newX = prev.x;
        let newY = prev.y;
        let newW = prev.w;
        let newH = prev.h;

        if (activeHandle === "box") {
          // Dragging the crop box itself
          newX = Math.max(0, Math.min(100 - prev.w, dragStart.current.boxX + deltaX));
          newY = Math.max(0, Math.min(100 - prev.h, dragStart.current.boxY + deltaY));
        } else {
          // Dragging handles
          if (activeHandle.includes("right")) {
            newW = Math.max(10, Math.min(100 - prev.x, dragStart.current.boxW + deltaX));
          }
          if (activeHandle.includes("bottom")) {
            newH = Math.max(10, Math.min(100 - prev.y, dragStart.current.boxH + deltaY));
          }
          if (activeHandle.includes("left")) {
            const possibleW = dragStart.current.boxW - deltaX;
            if (possibleW >= 10 && dragStart.current.boxX + deltaX >= 0) {
              newX = dragStart.current.boxX + deltaX;
              newW = possibleW;
            }
          }
          if (activeHandle.includes("top")) {
            const possibleH = dragStart.current.boxH - deltaY;
            if (possibleH >= 10 && dragStart.current.boxY + deltaY >= 0) {
              newY = dragStart.current.boxY + deltaY;
              newH = possibleH;
            }
          }

          // Apply locked aspect ratio if active
          if (activeRatio) {
            if (activeHandle === "bottom-right" || activeHandle === "right" || activeHandle === "bottom") {
              newH = newW / activeRatio;
              if (newY + newH > 100) {
                newH = 100 - newY;
                newW = newH * activeRatio;
              }
            } else if (activeHandle === "top-left" || activeHandle === "left" || activeHandle === "top") {
              // Lock resizing based on width
              newH = newW / activeRatio;
              if (newY + newH > 100) {
                newH = 100 - newY;
                newW = newH * activeRatio;
              }
            }
          }
        }

        return {
          x: Math.round(newX),
          y: Math.round(newY),
          w: Math.round(newW),
          h: Math.round(newH),
        };
      });
    };

    const handleMouseMove = (e: MouseEvent) => {
      handleMove(e.clientX, e.clientY);
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches[0]) {
        handleMove(e.touches[0].clientX, e.touches[0].clientY);
      }
    };

    const handleMouseUp = () => {
      setActiveHandle(null);
    };

    if (activeHandle) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("touchmove", handleTouchMove);
      window.addEventListener("mouseup", handleMouseUp);
      window.addEventListener("touchend", handleMouseUp);
    }

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("mouseup", handleMouseUp);
      window.removeEventListener("touchend", handleMouseUp);
    };
  }, [activeHandle, cropSettings.aspect]);

  const handleCrop = async () => {
    if (!activeFile || processing) return;
    setProcessing(true);

    updateFile(activeFile.id, { status: "processing", progress: 30 });

    try {
      const origW = activeFile.width || 800;
      const origH = activeFile.height || 600;

      // Map percentage back to pixel coordinates
      const cropX = Math.round((cropBox.x / 100) * origW);
      const cropY = Math.round((cropBox.y / 100) * origH);
      const cropW = Math.round((cropBox.w / 100) * origW);
      const cropH = Math.round((cropBox.h / 100) * origH);

      const formData = new FormData();
      formData.append("file", activeFile.file);
      formData.append("x", cropX.toString());
      formData.append("y", cropY.toString());
      formData.append("width", cropW.toString());
      formData.append("height", cropH.toString());

      updateFile(activeFile.id, { progress: 70 });

      const res = await cropImageAction(formData);

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
          error: res.error || "Crop failed.",
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
        <h3 className="text-lg font-bold text-white mb-1">Crop Image</h3>
        <p className="text-xs text-[#8e8e93]">
          Drag and adjust the highlighted box over your image to select a cropping area. Supports fixed ratios.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Interactive Cropper Viewport */}
        <div className="lg:col-span-2 space-y-4">
          {activeFile ? (
            <div className="flex flex-col items-center justify-center p-4 bg-[#0d0d0e] border border-[#2a2a2d] rounded-2xl relative min-h-[300px]">
              <div
                ref={containerRef}
                className="relative overflow-hidden max-h-[400px] select-none"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  ref={imageRef}
                  src={activeFile.url}
                  alt="Crop Preview"
                  onLoad={handleImageLoad}
                  className="max-h-[400px] object-contain w-full block pointer-events-none"
                  style={{ userSelect: "none" }}
                />

                {imgLoaded && (
                  <>
                    {/* Shadow masking layers outside cropbox */}
                    <div
                      className="absolute bg-black/60 border border-white/20 pointer-events-auto"
                      style={{
                        left: `${cropBox.x}%`,
                        top: `${cropBox.y}%`,
                        width: `${cropBox.w}%`,
                        height: `${cropBox.h}%`,
                        boxShadow: "0 0 0 9999px rgba(0, 0, 0, 0.65)",
                        cursor: "move",
                      }}
                      onMouseDown={(e) => handleMouseDown(e, "box")}
                      onTouchStart={(e) => handleTouchStart(e, "box")}
                    >
                      {/* Rule of thirds grid lines */}
                      <div className="absolute inset-0 grid grid-cols-3 grid-rows-3 border border-[#0a84ff] pointer-events-none">
                        <div className="border-r border-dashed border-white/20" />
                        <div className="border-r border-dashed border-white/20" />
                        <div className="border-b border-dashed border-white/20 col-span-3 row-start-1" />
                        <div className="border-b border-dashed border-white/20 col-span-3 row-start-2" />
                      </div>

                      {/* Resize handles */}
                      <div
                        className="absolute w-3 h-3 bg-white border border-[#0a84ff] -top-1.5 -left-1.5 cursor-nwse-resize rounded-full"
                        onMouseDown={(e) => handleMouseDown(e, "top-left")}
                        onTouchStart={(e) => handleTouchStart(e, "top-left")}
                      />
                      <div
                        className="absolute w-3 h-3 bg-white border border-[#0a84ff] -top-1.5 -right-1.5 cursor-nesw-resize rounded-full"
                        onMouseDown={(e) => handleMouseDown(e, "top-right")}
                        onTouchStart={(e) => handleTouchStart(e, "top-right")}
                      />
                      <div
                        className="absolute w-3 h-3 bg-white border border-[#0a84ff] -bottom-1.5 -left-1.5 cursor-nesw-resize rounded-full"
                        onMouseDown={(e) => handleMouseDown(e, "bottom-left")}
                        onTouchStart={(e) => handleTouchStart(e, "bottom-left")}
                      />
                      <div
                        className="absolute w-3 h-3 bg-white border border-[#0a84ff] -bottom-1.5 -right-1.5 cursor-nwse-resize rounded-full"
                        onMouseDown={(e) => handleMouseDown(e, "bottom-right")}
                        onTouchStart={(e) => handleTouchStart(e, "bottom-right")}
                      />
                    </div>
                  </>
                )}
              </div>
            </div>
          ) : (
            <div className="h-[300px] border border-dashed border-[#2a2a2d] bg-[#111112] rounded-2xl flex flex-col items-center justify-center text-[#8e8e93] text-[13px]">
              Upload an image to crop.
            </div>
          )}
        </div>

        {/* Right: Settings Control Panel */}
        <div className="space-y-4">
          <div className="bg-[#111112] border border-[#2a2a2d] p-5 rounded-2xl space-y-5">
            <div className="space-y-2.5">
              <label className="text-[13px] font-bold text-[#ebebf5] uppercase tracking-wider block">
                Aspect Ratio
              </label>
              <div className="flex flex-col gap-1.5">
                {aspectRatios.map((ratio) => {
                  const isSelected = cropSettings.aspect === ratio.id;
                  return (
                    <button
                      key={ratio.id}
                      onClick={() => handleAspectChange(ratio.id)}
                      className={`
                        px-4 py-2.5 rounded-xl text-left text-[13px] font-bold transition-all flex items-center justify-between
                        ${isSelected
                          ? "bg-[#0a84ff] text-white"
                          : "bg-[#1c1c1e] text-[#8e8e93] border border-[#2a2a2d] hover:text-white hover:bg-[#2c2c2e]"
                        }
                      `}
                    >
                      <span>{ratio.name}</span>
                      {isSelected && <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded font-mono">LOCKED</span>}
                    </button>
                  );
                })}
              </div>
            </div>

            <button
              onClick={handleCrop}
              disabled={files.length === 0 || processing || !imgLoaded}
              className="w-full py-3 px-4 flex items-center justify-center gap-2 text-[14px] font-bold text-white bg-[#0a84ff] hover:bg-[#0070e3] disabled:opacity-50 disabled:cursor-not-allowed active:scale-98 rounded-xl transition-all shadow-md shadow-[#0a84ff]/20"
            >
              {processing ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Cropping Image...
                </>
              ) : (
                <>
                  <Crop size={16} />
                  Crop Image
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
