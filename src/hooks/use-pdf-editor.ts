// ============================================================
// hooks/use-pdf-editor.ts
// ============================================================

import { useCallback, useRef } from "react";
import { usePDFEditorStore } from "@/store/pdf-editor-store";

import { nanoid } from "nanoid";
import type { PDFElement, ToolType } from "@/types/pdf-editor";

// Global pdf doc reference (not in Zustand — too large to serialize)
let pdfDocRef: AnyType = null;
export function setPdfDocRef(doc: AnyType) {
  pdfDocRef = doc;
}
export function getPdfDocRef() {
  return pdfDocRef;
}

export function usePDFLoader() {
  const { initProject, pages, setPages, setLoading, updatePageThumbnail } =
    usePDFEditorStore();

  const loadFile = useCallback(
    async (file: File) => {
      setLoading(true, "Loading PDF...");
      try {
        const { pages: loadedPages, pdfDoc } = await loadPDFFromFile(file);
        setPdfDocRef(pdfDoc);
        const { registerPdfDocForPage } = require("@/pdf/pdf-docs-map");
        loadedPages.forEach((p: any) => registerPdfDocForPage(p.id, pdfDoc));
        initProject(file.name.replace(".pdf", ""), file);
        setPages(loadedPages);
        setLoading(false);

        // Generate thumbnails in background
        for (let i = 0; i < loadedPages.length; i++) {
          const thumbnail = await renderPageToDataURL(pdfDoc, i, 0.3);
          updatePageThumbnail(loadedPages[i].id, thumbnail);
        }
      } catch (err) {
        console.error("PDF load error:", err);
        setLoading(false);
      }
    },
    [initProject, setPages, setLoading, updatePageThumbnail],
  );

  const importFile = useCallback(
    async (file: File) => {
      setLoading(true, "Importing PDF...");
      try {
        const { pages: newPages, pdfDoc } = await loadPDFFromFile(file);
        const { registerPdfDocForPage } = require("@/pdf/pdf-docs-map");
        newPages.forEach((p: any) => registerPdfDocForPage(p.id, pdfDoc));
        
        setPages([...pages, ...newPages]);
        setLoading(false);

        // Generate thumbnails in background
        for (let i = 0; i < newPages.length; i++) {
          const thumbnail = await renderPageToDataURL(pdfDoc, i, 0.3);
          updatePageThumbnail(newPages[i].id, thumbnail);
        }
      } catch (err) {
        console.error("PDF import error:", err);
        setLoading(false);
      }
    },
    [pages, setPages, setLoading, updatePageThumbnail],
  );

  return { loadFile, importFile };
}

export function usePDFExport() {
  const { pages, compressionLevel, name, setLoading, selectElement } = usePDFEditorStore();
  const stageRefsMap = useRef<Map<string, AnyType>>(new Map());

  const registerStage = useCallback((pageId: string, stage: AnyType) => {
    stageRefsMap.current.set(pageId, stage);
  }, []);

  const exportPDF = useCallback(async () => {
    selectElement(null);
    setLoading(true, "Generating PDF...");
    try {
      await exportToPDF(pages, stageRefsMap.current, compressionLevel, name);
    } finally {
      setLoading(false);
    }
  }, [pages, compressionLevel, name, setLoading, selectElement]);

  return { exportPDF, registerStage };
}

export function useElementActions(pageId: string) {
  const { addElement, updateElement, deleteElement, selectElement, tool } =
    usePDFEditorStore();

  const addText = useCallback(
    (x: number, y: number) => {
      const el: PDFElement = {
        id: nanoid(),
        type: "text",
        x,
        y,
        text: "Double-click to edit",
        fontSize: 16,
        fontFamily: "Arial",
        color: "#1a1a1a",
        editable: false,
        width: 200,
      };
      addElement(pageId, el);
    },
    [pageId, addElement],
  );

  const addImage = useCallback(
    (src: string, x: number, y: number, width: number, height: number) => {
      const el: PDFElement = {
        id: nanoid(),
        type: "image",
        x,
        y,
        width,
        height,
        src,
      };
      addElement(pageId, el);
    },
    [pageId, addElement],
  );

  const addShape = useCallback(
    (shapeType: "rect" | "circle" | "line", x: number, y: number) => {
      const el: PDFElement = {
        id: nanoid(),
        type: "shape",
        shapeType,
        x,
        y,
        width: shapeType === "line" ? 100 : 80,
        height: shapeType === "line" ? 0 : 80,
        stroke: "#2563eb",
        strokeWidth: 2,
        fill: shapeType !== "line" ? "rgba(37,99,235,0.1)" : "transparent",
      };
      addElement(pageId, el);
    },
    [pageId, addElement],
  );

  const addHighlight = useCallback(
    (x: number, y: number) => {
      const el: PDFElement = {
        id: nanoid(),
        type: "highlight",
        x,
        y,
        width: 120,
        height: 20,
        color: "#fde047",
        opacity: 0.5,
      };
      addElement(pageId, el);
    },
    [pageId, addElement],
  );



  const detectPageText = useCallback(async (pdfPageIndex: number) => {
    const pdfDoc = getPdfDocRef();
    if (!pdfDoc || pdfPageIndex < 0) return;

    try {
      const page = await pdfDoc.getPage(pdfPageIndex + 1);
      const textContent = await page.getTextContent();
      const viewport = page.getViewport({ scale: 1 });

      textContent.items.forEach((item: any) => {
        if (!item.str || item.str.trim() === "") return;

        const tx = item.transform;
        // PDF space to Viewport space
        const [x, y] = viewport.convertToViewportPoint(tx[4], tx[5]);

        // item.height is generally more reliable for bounding box height in pdf.js than transform scale
        // Font size in pixels
        const fontSize = item.height || Math.abs(tx[3]) || 12;

        // Try to get font family from styles
        let fontFamily = "Arial";
        if (item.fontName && textContent.styles[item.fontName]) {
          const fontObj = textContent.styles[item.fontName];
          if (fontObj.fontFamily) {
            const parsed = fontObj.fontFamily.split(",")[0].replace(/['"]/g, "");
            if (parsed) fontFamily = parsed;
          }
        }

        const el: PDFElement = {
          id: nanoid(),
          type: "text",
          // The y-coordinate in pdf.js text items is typically the baseline of the text.
          // Konva draws text from the top-left. We subtract ~80% of font size to find the top edge.
          x: x,
          y: y - (fontSize * 0.8), 
          text: item.str,
          fontSize: fontSize,
          fontFamily,
          color: "#000000",
          editable: true,
          width: item.width * (viewport.scale || 1),
          hasBackgroundMask: true,
          backgroundMaskColor: "#ffffff",
        };
        addElement(pageId, el);
      });
    } catch (err) {
      console.error("Failed to detect text:", err);
    }
  }, [pageId, addElement]);

  return {
    addText,
    addImage,
    addShape,
    addHighlight,
    updateElement,
    deleteElement,
    selectElement,
    detectPageText,
  };
}

// ============================================================
// hooks/use-keyboard-shortcuts.ts
// ============================================================

import { useEffect } from "react";
import { loadPDFFromFile, renderPageToDataURL } from "@/pdf/pdf-loader";
import { exportToPDF } from "@/pdf/pdf-exporter";
import { AnyType } from "@/types";

export function useKeyboardShortcuts() {
  const {
    undo,
    redo,
    deleteElement,
    selectedElementId,
    activePageId,
    setTool,
    zoomIn,
    zoomOut,
    resetZoom,
  } = usePDFEditorStore();

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const isInput = ["INPUT", "TEXTAREA"].includes(
        (e.target as HTMLElement)?.tagName,
      );
      if (isInput) return;

      const isMac = navigator.platform.includes("Mac");
      const ctrl = isMac ? e.metaKey : e.ctrlKey;

      if (ctrl && e.key === "z" && !e.shiftKey) {
        e.preventDefault();
        undo();
      }
      if (ctrl && (e.key === "y" || (e.key === "z" && e.shiftKey))) {
        e.preventDefault();
        redo();
      }
      if (ctrl && e.key === "=") {
        e.preventDefault();
        zoomIn();
      }
      if (ctrl && e.key === "-") {
        e.preventDefault();
        zoomOut();
      }
      if (ctrl && e.key === "0") {
        e.preventDefault();
        resetZoom();
      }
      if (
        (e.key === "Delete" || e.key === "Backspace") &&
        selectedElementId &&
        activePageId
      ) {
        deleteElement(activePageId, selectedElementId);
      }
      if (e.key === "v") setTool("select");
      if (e.key === "t") setTool("text");
      if (e.key === "h") setTool("highlight");
      if (e.key === "p") setTool("draw");
      if (e.key === "e") setTool("eraser");
      if (e.key === "Escape") {
        setTool("select");
      }
    };

    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [
    undo,
    redo,
    deleteElement,
    selectedElementId,
    activePageId,
    setTool,
    zoomIn,
    zoomOut,
    resetZoom,
  ]);
}
