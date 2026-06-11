"use client";
// ============================================================
// components/pdf-editor/ThumbnailSidebar.tsx
// ============================================================

import React, { useCallback, useRef } from "react";
import { usePDFEditorStore } from "@/store/pdf-editor-store";
import { usePDFLoader } from "@/hooks/use-pdf-editor";

export function ThumbnailSidebar() {
  const {
    pages,
    thumbnails,
    activePageId,
    setActivePage,
    deletePage,
    duplicatePage,
    rotatePage,
    addPage,
    reorderPages,
  } = usePDFEditorStore();

  const { importFile } = usePDFLoader();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      importFile(file);
    }
  }, [importFile]);

  const handleDragStart = useCallback((e: React.DragEvent, index: number) => {
    e.dataTransfer.setData("pageIndex", String(index));
  }, []);

  const handleDrop = useCallback((e: React.DragEvent, toIndex: number) => {
    e.preventDefault();
    const fromIndex = Number(e.dataTransfer.getData("pageIndex"));
    if (fromIndex !== toIndex) reorderPages(fromIndex, toIndex);
  }, [reorderPages]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
  }, []);

  return (
    <div className="w-[140px] shrink-0 bg-[#1c1c1e] border-r border-[#2a2a2d] flex flex-col overflow-hidden">
      <div className="px-3 py-2 border-b border-[#2a2a2d]">
        <span className="text-[11px] font-semibold text-[#8e8e93] uppercase tracking-wider">
          Pages
        </span>
      </div>

      <div className="flex-1 overflow-y-auto py-2 px-2 space-y-2 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-[#3a3a3d]">
        {pages.map((page, index) => (
          <div
            key={page.id}
            draggable
            onDragStart={(e) => handleDragStart(e, index)}
            onDrop={(e) => handleDrop(e, index)}
            onDragOver={handleDragOver}
            onClick={() => setActivePage(page.id)}
            className={`
              group relative cursor-pointer rounded-lg overflow-hidden border-2 transition-all
              ${activePageId === page.id
                ? "border-[#0a84ff] shadow-lg shadow-blue-500/20"
                : "border-[#3a3a3d] hover:border-[#5a5a5d]"
              }
            `}
            style={{
              transform: page.rotation !== 0 ? `rotate(${page.rotation}deg)` : undefined,
              transformOrigin: "center",
            }}
          >
            {/* Thumbnail */}
            <div
              className="relative bg-white"
              style={{ aspectRatio: `${page.width}/${page.height}` }}
            >
              {thumbnails[page.id] ? (
                <img
                  src={thumbnails[page.id]}
                  alt={`Page ${index + 1}`}
                  className="w-full h-full object-cover"
                  draggable={false}
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center bg-[#2c2c2e]">
                  <div className="w-5 h-5 border-2 border-[#0a84ff] border-t-transparent rounded-full animate-spin" />
                </div>
              )}
            </div>

            {/* Page number */}
            <div className="absolute bottom-0 inset-x-0 bg-black/60 text-white text-[10px] text-center py-0.5 font-medium">
              {index + 1}
            </div>

            {/* Hover actions */}
            <div className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col gap-0.5">
              <PageActionButton
                icon="⊕"
                title="Duplicate"
                onClick={(e) => { e.stopPropagation(); duplicatePage(page.id); }}
              />
              <PageActionButton
                icon="↺"
                title="Rotate"
                onClick={(e) => { e.stopPropagation(); rotatePage(page.id, 90); }}
              />
              {pages.length > 1 && (
                <PageActionButton
                  icon="✕"
                  title="Delete"
                  onClick={(e) => { e.stopPropagation(); deletePage(page.id); }}
                  danger
                />
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Add page buttons */}
      <div className="p-2 border-t border-[#2a2a2d] flex flex-col gap-2">
        <button
          onClick={() => addPage(activePageId ?? undefined)}
          className="w-full py-1.5 flex items-center justify-center gap-1.5 text-[11px] text-[#ebebf5] hover:bg-white/5 bg-[#2c2c2e] border border-[#3a3a3d] rounded-lg transition-colors font-medium"
        >
          Add Blank Page
        </button>
        <button
          onClick={() => fileInputRef.current?.click()}
          className="w-full py-1.5 flex items-center justify-center gap-1.5 text-[11px] text-[#0a84ff] bg-[#0a84ff]/10 hover:bg-[#0a84ff]/20 rounded-lg transition-colors font-medium"
        >
          Merge/Import PDF
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept="application/pdf"
          className="hidden"
          onChange={handleFileChange}
        />
      </div>
    </div>
  );
}

interface PageActionButtonProps {
  icon: string;
  title: string;
  onClick: (e: React.MouseEvent) => void;
  danger?: boolean;
}

function PageActionButton({ icon, title, onClick, danger }: PageActionButtonProps) {
  return (
    <button
      title={title}
      onClick={onClick}
      className={`
        w-5 h-5 flex items-center justify-center rounded text-[10px] font-bold
        transition-colors backdrop-blur-sm
        ${danger
          ? "bg-red-500/80 hover:bg-red-500 text-white"
          : "bg-black/60 hover:bg-black/80 text-white"
        }
      `}
    >
      {icon}
    </button>
  );
}
