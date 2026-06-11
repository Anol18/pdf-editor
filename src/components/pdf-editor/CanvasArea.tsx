"use client";
// ============================================================
// components/pdf-editor/CanvasArea.tsx
// ============================================================

import React, { useRef, useCallback, useEffect } from "react";
import { usePDFEditorStore } from "@/store/pdf-editor-store";
import { PageCanvas } from "./PageCanvas";

interface CanvasAreaProps {
  onStageReady: (pageId: string, stage: any) => void;
}

export function CanvasArea({ onStageReady }: CanvasAreaProps) {
  const { pages, activePageId, zoom, setActivePage, setZoom } = usePDFEditorStore();
  const scrollRef = useRef<HTMLDivElement>(null);
  const activePageRef = useRef<HTMLDivElement>(null);

  // Scroll active page into view
  useEffect(() => {
    activePageRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }, [activePageId]);

  // Ctrl+wheel zoom
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    const handler = (e: WheelEvent) => {
      if (!e.ctrlKey && !e.metaKey) return;
      e.preventDefault();
      const delta = e.deltaY < 0 ? 0.1 : -0.1;
      setZoom(zoom + delta);
    };

    el.addEventListener("wheel", handler, { passive: false });
    return () => el.removeEventListener("wheel", handler);
  }, [zoom, setZoom]);

  if (pages.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center bg-[#141416]">
        <div className="text-center">
          <div className="text-5xl mb-4 opacity-20">📄</div>
          <p className="text-[#48484a] text-[14px]">Upload a PDF to get started</p>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={scrollRef}
      className="flex-1 overflow-auto bg-[#141416]"
      style={{
        backgroundImage: `radial-gradient(circle, #2a2a2d 1px, transparent 1px)`,
        backgroundSize: "24px 24px",
      }}
    >
      <div className="flex flex-col items-center gap-8 py-8 px-4 min-h-full">
        {pages.map((page) => (
          <div
            key={page.id}
            ref={activePageId === page.id ? activePageRef : undefined}
            onClick={() => setActivePage(page.id)}
            className={`relative transition-all duration-200 ${
              activePageId === page.id
                ? "ring-2 ring-[#0a84ff] ring-offset-4 ring-offset-[#141416]"
                : "hover:ring-1 hover:ring-[#3a3a3d] hover:ring-offset-2 hover:ring-offset-[#141416]"
            }`}
            style={{
              transform: page.rotation !== 0 ? `rotate(${page.rotation}deg)` : undefined,
            }}
          >
            <PageCanvas
              page={page}
              isActive={activePageId === page.id}
              onStageReady={onStageReady}
            />
          </div>
        ))}

        {/* Bottom padding */}
        <div className="h-16" />
      </div>
    </div>
  );
}
