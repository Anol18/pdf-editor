// ============================================================
// src/components/image-tools/ToolSidebar.tsx
// ============================================================

"use client";

import React from "react";
import { useImageToolsStore } from "@/store/image-tools-store";
import { ImageToolType } from "@/types/image-tools";
import {
  RefreshCw,
  Zap,
  Ruler,
  Crop,
  RotateCw,
  Bookmark,
  Eraser,
  Sparkles,
  Info,
} from "lucide-react";

interface ToolItem {
  id: ImageToolType;
  name: string;
  description: string;
  icon: React.ReactNode;
}

export function ToolSidebar() {
  const { activeTool, setActiveTool } = useImageToolsStore();

  const tools: ToolItem[] = [
    {
      id: "convert",
      name: "Convert Format",
      description: "JPG, PNG, WEBP, AVIF, HEIC...",
      icon: <RefreshCw size={18} />,
    },
    {
      id: "compress",
      name: "Compress Image",
      description: "Optimize file size & quality",
      icon: <Zap size={18} />,
    },
    {
      id: "resize",
      name: "Resize Image",
      description: "Change dimensions & presets",
      icon: <Ruler size={18} />,
    },
    {
      id: "crop",
      name: "Crop Image",
      description: "Trim borders & ratios",
      icon: <Crop size={18} />,
    },
    {
      id: "rotate",
      name: "Rotate & Flip",
      description: "Turn or mirror images",
      icon: <RotateCw size={18} />,
    },
    {
      id: "watermark",
      name: "Add Watermark",
      description: "Text or image overlays",
      icon: <Bookmark size={18} />,
    },
    {
      id: "background-removal",
      name: "Remove Background",
      description: "Make background transparent",
      icon: <Eraser size={18} />,
    },
    {
      id: "upscale",
      name: "AI Upscale",
      description: "Increase resolution 2x or 4x",
      icon: <Sparkles size={18} />,
    },
    {
      id: "metadata-inspector",
      name: "Metadata Inspector",
      description: "Inspect & clean image EXIF",
      icon: <Info size={18} />,
    },
  ];

  return (
    <aside className="w-full md:w-64 flex-shrink-0 bg-[#111112] border-r md:border-r border-b md:border-b-0 border-[#2a2a2d] flex flex-col">
      {/* Sidebar Header */}
      <div className="p-4 border-b border-[#2a2a2d] hidden md:block">
        <h2 className="text-sm font-bold text-white uppercase tracking-wider">Image Studio</h2>
        <p className="text-[11px] text-[#8e8e93] mt-0.5">Production-grade image tools</p>
      </div>

      {/* Nav List */}
      <nav className="flex flex-row md:flex-col overflow-x-auto md:overflow-x-visible p-2 md:p-3 gap-1 scrollbar-none">
        {tools.map((tool) => {
          const isActive = activeTool === tool.id;
          return (
            <button
              key={tool.id}
              onClick={() => setActiveTool(tool.id)}
              className={`
                flex items-center gap-3 px-3 py-2.5 md:py-3 rounded-xl text-left transition-all duration-200 whitespace-nowrap md:whitespace-normal flex-shrink-0 md:flex-shrink-1 w-auto md:w-full
                ${isActive
                  ? "bg-[#0a84ff] text-white shadow-lg shadow-[#0a84ff]/10 font-medium"
                  : "text-[#8e8e93] hover:text-white hover:bg-[#1c1c1e]"
                }
              `}
            >
              <div
                className={`
                  p-1.5 rounded-lg flex items-center justify-center
                  ${isActive ? "bg-white/10 text-white" : "bg-[#1c1c1e] text-[#8e8e93]"}
                `}
              >
                {tool.icon}
              </div>
              <div className="hidden md:block">
                <p className="text-[13px] font-semibold leading-tight">{tool.name}</p>
                <p className={`text-[10px] mt-0.5 leading-none ${isActive ? "text-white/80" : "text-[#8e8e93]"}`}>
                  {tool.description}
                </p>
              </div>
              <span className="md:hidden text-[12px] font-medium px-1">{tool.name}</span>
            </button>
          );
        })}
      </nav>
    </aside>
  );
}
