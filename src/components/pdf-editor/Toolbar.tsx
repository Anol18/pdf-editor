"use client";
// ============================================================
// components/pdf-editor/Toolbar.tsx
// ============================================================

import React, { useRef } from "react";
import { usePDFEditorStore } from "@/store/pdf-editor-store";
import { useElementActions } from "@/hooks/use-pdf-editor";
import type { ToolType } from "@/types/pdf-editor";

import {
  MousePointer2,
  Type,
  Image as ImageIcon,
  Square,
  Circle,
  Minus,
  Highlighter,
  Pen,
  Eraser,
  Hand,
  Undo2,
  Redo2,
  ZoomIn,
  ZoomOut,
  Maximize,
  Trash2,
  ScanText
} from "lucide-react";

const TOOLS: { id: ToolType; label: string; icon: React.ReactNode; shortcut?: string }[] = [
  { id: "select", label: "Select", icon: <MousePointer2 size={18} strokeWidth={2} />, shortcut: "V" },
  { id: "text", label: "Text", icon: <Type size={18} strokeWidth={2} />, shortcut: "T" },
  { id: "image", label: "Image", icon: <ImageIcon size={18} strokeWidth={2} /> },
  { id: "rect", label: "Rectangle", icon: <Square size={18} strokeWidth={2} /> },
  { id: "circle", label: "Circle", icon: <Circle size={18} strokeWidth={2} /> },
  { id: "line", label: "Line", icon: <Minus size={18} strokeWidth={2} /> },
  { id: "highlight", label: "Highlight", icon: <Highlighter size={18} strokeWidth={2} />, shortcut: "H" },
  { id: "draw", label: "Draw", icon: <Pen size={18} strokeWidth={2} />, shortcut: "P" },
  { id: "eraser", label: "Eraser (Whiteout)", icon: <Eraser size={18} strokeWidth={2} />, shortcut: "E" },
  { id: "pan", label: "Pan", icon: <Hand size={18} strokeWidth={2} /> },
];

interface ToolbarProps {
  className?: string;
}

export function Toolbar({ className = "" }: ToolbarProps) {
  const { tool, setTool, activePageId, selectedElementId, selectElement, deleteElement, undo, redo, history, zoomIn, zoomOut, zoom, resetZoom, pages } = usePDFEditorStore();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const actions = activePageId ? useElementActions(activePageId) : null;

  const handleToolClick = (t: ToolType) => {
    if (t === "image") {
      fileInputRef.current?.click();
      return;
    }
    setTool(t);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !actions) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const src = ev.target?.result as string;
      const img = new Image();
      img.onload = () => {
        const maxW = 300;
        const ratio = Math.min(maxW / img.width, maxW / img.height);
        actions.addImage(src, 50, 50, img.width * ratio, img.height * ratio);
      };
      img.src = src;
    };
    reader.readAsDataURL(file);
    e.target.value = "";
    setTool("select");
  };

  const canUndo = history.undoStack.length > 0;
  const canRedo = history.redoStack.length > 0;

  return (
    <div className={`flex flex-col items-center gap-1 py-3 px-2 bg-[#1c1c1e] border-r border-[#2a2a2d] ${className}`}>
      {/* History */}
      <div className="flex flex-col gap-1 mb-2">
        <ToolButton
          icon={<Undo2 size={18} strokeWidth={2} />}
          label="Undo"
          onClick={() => undo()}
          disabled={!canUndo}
          shortcut="⌘Z"
        />
        <ToolButton
          icon={<Redo2 size={18} strokeWidth={2} />}
          label="Redo"
          onClick={() => redo()}
          disabled={!canRedo}
          shortcut="⌘Y"
        />
      </div>

      <div className="w-8 h-px bg-[#3a3a3d] my-1" />

      {/* Tools */}
      {TOOLS.map((t) => (
        <ToolButton
          key={t.id}
          icon={t.icon}
          label={t.label}
          shortcut={t.shortcut}
          active={tool === t.id}
          onClick={() => handleToolClick(t.id)}
        />
      ))}

      <div className="w-8 h-px bg-[#3a3a3d] my-1" />

      {/* Zoom */}
      <ToolButton icon={<ZoomIn size={18} strokeWidth={2} />} label="Zoom In" onClick={zoomIn} shortcut="⌘+" />
      <div className="text-[10px] text-[#8e8e93] font-mono text-center w-full my-1">
        {Math.round(zoom * 100)}%
      </div>
      <ToolButton icon={<ZoomOut size={18} strokeWidth={2} />} label="Zoom Out" onClick={zoomOut} shortcut="⌘-" />
      <ToolButton icon={<Maximize size={18} strokeWidth={2} />} label="Reset Zoom" onClick={resetZoom} shortcut="⌘0" />

      {/* Detect Text */}
      {activePageId && (
        <>
          <div className="w-8 h-px bg-[#3a3a3d] my-1" />
          <ToolButton
            icon={<ScanText size={18} strokeWidth={2} />}
            label="Make Text Editable"
            onClick={() => {
              const activePage = pages.find((p) => p.id === activePageId);
              if (activePage && activePage.pdfPageIndex >= 0 && actions) {
                actions.detectPageText(activePage.pdfPageIndex);
              }
            }}
            className="text-[#0a84ff] hover:bg-[#0a84ff]/10 font-bold"
          />
        </>
      )}

      {/* Delete selected */}
      {selectedElementId && activePageId && (
        <>
          <div className="w-8 h-px bg-[#3a3a3d] my-1" />
          <ToolButton
            icon={<Trash2 size={18} strokeWidth={2} />}
            label="Delete"
            onClick={() => deleteElement(activePageId, selectedElementId)}
            className="text-red-400 hover:bg-red-500/10"
            shortcut="Del"
          />
        </>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleImageUpload}
      />
    </div>
  );
}

interface ToolButtonProps {
  icon: React.ReactNode;
  label: string;
  shortcut?: string;
  active?: boolean;
  disabled?: boolean;
  onClick: () => void;
  className?: string;
}

function ToolButton({ icon, label, shortcut, active, disabled, onClick, className = "" }: ToolButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      title={`${label}${shortcut ? ` (${shortcut})` : ""}`}
      className={`
        group relative w-9 h-9 flex items-center justify-center rounded-lg text-sm
        transition-all duration-150
        ${active
          ? "bg-[#0a84ff] text-white shadow-lg shadow-blue-500/20"
          : disabled
            ? "text-[#48484a] cursor-not-allowed"
            : `text-[#ebebf5] hover:bg-[#2c2c2e] hover:text-white ${className}`
        }
      `}
    >
      <span className="flex items-center justify-center">{icon}</span>
      {/* Tooltip */}
      <span className="absolute left-full ml-2 px-2 py-1 bg-[#2c2c2e] text-white text-xs rounded whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none z-50 transition-opacity">
        {label}
        {shortcut && <span className="ml-1 text-[#8e8e93]">{shortcut}</span>}
      </span>
    </button>
  );
}
