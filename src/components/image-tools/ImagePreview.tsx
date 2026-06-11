// ============================================================
// src/components/image-tools/ImagePreview.tsx
// ============================================================

"use client";

import React, { useState, useRef, useEffect } from "react";
import { Eye, ArrowLeftRight } from "lucide-react";

interface ImagePreviewProps {
  originalUrl: string;
  resultUrl?: string;
  className?: string;
  originalLabel?: string;
  resultLabel?: string;
}

export function ImagePreview({
  originalUrl,
  resultUrl,
  className = "",
  originalLabel = "Original",
  resultLabel = "Processed",
}: ImagePreviewProps) {
  const [sliderPosition, setSliderPosition] = useState(50); // 0 to 100
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMove = (clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderPosition(percentage);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    handleMove(e.clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    if (e.touches[0]) {
      handleMove(e.touches[0].clientX);
    }
  };

  useEffect(() => {
    const handleMouseUp = () => setIsDragging(false);
    if (isDragging) {
      window.addEventListener("mouseup", handleMouseUp);
      window.addEventListener("touchend", handleMouseUp);
    }
    return () => {
      window.removeEventListener("mouseup", handleMouseUp);
      window.removeEventListener("touchend", handleMouseUp);
    };
  }, [isDragging]);

  if (!resultUrl) {
    return (
      <div className={`relative flex items-center justify-center bg-[#0a0a0a] rounded-2xl border border-[#2a2a2d] overflow-hidden group ${className}`}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={originalUrl}
          alt="Original Preview"
          className="max-h-[400px] object-contain w-full select-none"
        />
        <div className="absolute top-3 left-3 px-2 py-1 text-[11px] font-semibold bg-black/60 backdrop-blur-md text-[#8e8e93] border border-[#2a2a2d] rounded">
          {originalLabel}
        </div>
      </div>
    );
  }

  return (
    <div className={`flex flex-col gap-3 ${className}`}>
      {/* Slider Viewport */}
      <div
        ref={containerRef}
        className="relative h-[400px] w-full bg-[#0d0d0e] border border-[#2a2a2d] rounded-2xl overflow-hidden select-none cursor-ew-resize"
        onMouseDown={() => setIsDragging(true)}
        onTouchStart={() => setIsDragging(true)}
        onMouseMove={handleMouseMove}
        onTouchMove={handleTouchMove}
      >
        {/* Underlay Image: Original */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={originalUrl}
          alt="Original"
          className="absolute inset-0 w-full h-full object-contain pointer-events-none"
          style={{ userSelect: "none" }}
        />
        <div className="absolute bottom-3 left-3 z-10 px-2 py-1 text-[11px] font-semibold bg-black/60 backdrop-blur-md text-white border border-[#2a2a2d] rounded">
          {originalLabel}
        </div>

        {/* Overlay Image: Processed (clipped by width percentage) */}
        <div
          className="absolute inset-0 overflow-hidden pointer-events-none"
          style={{ width: `${sliderPosition}%` }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={resultUrl}
            alt="Processed"
            className="absolute inset-0 w-full h-full object-contain max-w-none"
            style={{
              width: containerRef.current?.getBoundingClientRect().width || "100%",
              height: containerRef.current?.getBoundingClientRect().height || "100%",
              userSelect: "none",
            }}
          />
        </div>
        <div className="absolute bottom-3 right-3 z-10 px-2 py-1 text-[11px] font-semibold bg-[#0a84ff]/80 backdrop-blur-md text-white border border-[#0a84ff]/20 rounded">
          {resultLabel}
        </div>

        {/* Slider Handle Line */}
        <div
          className="absolute top-0 bottom-0 w-0.5 bg-[#0a84ff] cursor-ew-resize z-20 pointer-events-none"
          style={{ left: `${sliderPosition}%` }}
        >
          {/* Handle Badge */}
          <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-[#0a84ff] border border-white flex items-center justify-center text-white shadow-lg shadow-[#0a84ff]/40">
            <ArrowLeftRight size={14} className="animate-pulse" />
          </div>
        </div>
      </div>

      <div className="flex justify-center items-center gap-2 text-[12px] text-[#8e8e93]">
        <Eye size={14} />
        <span>Drag the slider left and right to compare before & after</span>
      </div>
    </div>
  );
}
