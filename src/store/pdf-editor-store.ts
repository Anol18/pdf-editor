// ============================================================
// store/pdf-editor-store.ts
// ============================================================

import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { nanoid } from "nanoid";
import type {
  PDFProject,
  PDFPage,
  PDFElement,
  ToolType,
  CompressionLevel,
  DeviceMode,
} from "@/types/pdf-editor";

const MAX_HISTORY = 100;

let lastHistoryTime = 0;

interface PDFEditorActions {
  // Project
  initProject: (name: string, file: File) => void;
  setDeviceMode: (mode: DeviceMode) => void;
  setLoading: (isLoading: boolean, message?: string) => void;

  // Pages
  setPages: (pages: PDFPage[]) => void;
  addPage: (afterPageId?: string) => void;
  deletePage: (pageId: string) => void;
  duplicatePage: (pageId: string) => void;
  reorderPages: (fromIndex: number, toIndex: number) => void;
  rotatePage: (pageId: string, degrees: 90 | -90 | 180) => void;
  setActivePage: (pageId: string) => void;
  updatePageThumbnail: (pageId: string, thumbnail: string) => void;

  // Elements
  addElement: (pageId: string, element: PDFElement) => void;
  updateElement: (pageId: string, elementId: string, updates: Partial<PDFElement>) => void;
  deleteElement: (pageId: string, elementId: string) => void;
  selectElement: (elementId: string | null) => void;
  duplicateElement: (pageId: string, elementId: string) => void;
  bringToFront: (pageId: string, elementId: string) => void;
  sendToBack: (pageId: string, elementId: string) => void;

  // Tool
  setTool: (tool: ToolType) => void;

  // Zoom
  setZoom: (zoom: number) => void;
  zoomIn: () => void;
  zoomOut: () => void;
  resetZoom: () => void;

  // History
  pushHistory: () => void;
  undo: () => void;
  redo: () => void;

  // Export
  setCompressionLevel: (level: CompressionLevel) => void;

  // Global Settings
  setDefaultEraserSize: (size: number) => void;
  setDefaultDrawSize: (size: number) => void;
  setDefaultDrawColor: (color: string) => void;

  // Reset
  reset: () => void;
}

const initialState: PDFProject = {
  id: nanoid(),
  name: "Untitled Document",
  deviceMode: "desktop",
  pages: [],
  thumbnails: {},
  activePageId: null,
  selectedElementId: null,
  zoom: 1,
  tool: "select",
  defaultEraserSize: 20,
  defaultDrawSize: 3,
  defaultDrawColor: "#1a1a1a",
  history: { undoStack: [], redoStack: [] },
  compressionLevel: "medium",
  isLoading: false,
  loadingMessage: "",
  originalFile: null,
};

type PDFEditorStore = PDFProject & PDFEditorActions;

export const usePDFEditorStore = create<PDFEditorStore>()(
  immer((set, get) => ({
    ...initialState,

    initProject: (name, file) =>
      set((state) => {
        state.id = nanoid();
        state.name = name;
        state.originalFile = file as unknown as null;
        state.pages = [];
        state.thumbnails = {};
        state.activePageId = null;
        state.selectedElementId = null;
        state.zoom = 1;
        state.tool = "select";
        state.defaultEraserSize = 20;
        state.defaultDrawSize = 3;
        state.defaultDrawColor = "#1a1a1a";
        state.history = { undoStack: [], redoStack: [] };
      }),

    setDeviceMode: (mode) =>
      set((state) => {
        state.deviceMode = mode;
      }),

    setLoading: (isLoading, message = "") =>
      set((state) => {
        state.isLoading = isLoading;
        state.loadingMessage = message;
      }),

    setPages: (pages) =>
      set((state) => {
        state.pages = pages as typeof state.pages;
        if (pages.length > 0 && !state.activePageId) {
          state.activePageId = pages[0].id;
        }
      }),

    addPage: (afterPageId) => {
      get().pushHistory();
      set((state) => {
        const newPage: PDFPage = {
          id: nanoid(),
          width: 595,
          height: 842,
          rotation: 0,
          elements: [],
          pdfPageIndex: -1,
        };
        if (afterPageId) {
          const idx = state.pages.findIndex((p) => p.id === afterPageId);
          state.pages.splice(idx + 1, 0, newPage as typeof state.pages[0]);
        } else {
          state.pages.push(newPage as typeof state.pages[0]);
        }
        state.activePageId = newPage.id;
      });
    },

    deletePage: (pageId) => {
      if (get().pages.length <= 1) return;
      get().pushHistory();
      set((state) => {
        const idx = state.pages.findIndex((p) => p.id === pageId);
        state.pages.splice(idx, 1);
        if (state.activePageId === pageId) {
          state.activePageId = state.pages[Math.max(0, idx - 1)]?.id ?? null;
        }
      });
    },

    duplicatePage: (pageId) => {
      const page = get().pages.find((p) => p.id === pageId);
      if (!page) return;
      get().pushHistory();
      
      const { getPdfDocForPage, registerPdfDocForPage } = require("@/pdf/pdf-docs-map");
      const doc = getPdfDocForPage(pageId);

      set((state) => {
        const statePage = state.pages.find((p) => p.id === pageId)!;
        const newPage = {
          ...JSON.parse(JSON.stringify(page)),
          id: nanoid(),
          elements: (page.elements as PDFElement[]).map((el) => ({ ...el, id: nanoid() })),
        };
        if (doc) registerPdfDocForPage(newPage.id, doc);
        const idx = state.pages.findIndex((p) => p.id === pageId);
        state.pages.splice(idx + 1, 0, newPage);
        state.activePageId = newPage.id;
      });
    },

    reorderPages: (fromIndex, toIndex) => {
      get().pushHistory();
      set((state) => {
        const [removed] = state.pages.splice(fromIndex, 1);
        state.pages.splice(toIndex, 0, removed);
      });
    },

    rotatePage: (pageId, degrees) => {
      const page = get().pages.find((p) => p.id === pageId);
      if (!page) return;
      get().pushHistory();
      set((state) => {
        const statePage = state.pages.find((p) => p.id === pageId)!;
        statePage.rotation = ((statePage.rotation + degrees) % 360 + 360) % 360;
      });
    },

    setActivePage: (pageId) =>
      set((state) => {
        if (state.activePageId === pageId) return;
        state.activePageId = pageId;
        state.selectedElementId = null;
      }),

    updatePageThumbnail: (pageId, thumbnail) =>
      set((state) => {
        state.thumbnails[pageId] = thumbnail;
      }),

    addElement: (pageId, element) => {
      get().pushHistory();
      set((state) => {
        const page = state.pages.find((p) => p.id === pageId);
        if (!page) return;
        (page.elements as PDFElement[]).push(element);
        state.selectedElementId = element.id;
      });
    },

    updateElement: (pageId, elementId, updates) => {
      const now = Date.now();
      if (now - lastHistoryTime > 1000) {
        get().pushHistory();
      }
      lastHistoryTime = now;
      
      set((state) => {
        const page = state.pages.find((p) => p.id === pageId);
        if (!page) return;
        const elIdx = page.elements.findIndex((el) => el.id === elementId);
        if (elIdx === -1) return;
        Object.assign(page.elements[elIdx], updates);
      });
    },

    deleteElement: (pageId, elementId) => {
      get().pushHistory();
      set((state) => {
        const page = state.pages.find((p) => p.id === pageId);
        if (!page) return;
        page.elements = page.elements.filter((el) => el.id !== elementId) as typeof page.elements;
        if (state.selectedElementId === elementId) state.selectedElementId = null;
      });
    },

    selectElement: (elementId) =>
      set((state) => {
        state.selectedElementId = elementId;
      }),

    duplicateElement: (pageId, elementId) => {
      get().pushHistory();
      set((state) => {
        const page = state.pages.find((p) => p.id === pageId);
        if (!page) return;
        const el = page.elements.find((e) => e.id === elementId);
        if (!el) return;
        const newEl = { ...JSON.parse(JSON.stringify(el)), id: nanoid(), x: (el as any).x + 20, y: (el as any).y + 20 };
        (page.elements as PDFElement[]).push(newEl);
        state.selectedElementId = newEl.id;
      });
    },

    bringToFront: (pageId, elementId) => {
      get().pushHistory();
      set((state) => {
        const page = state.pages.find((p) => p.id === pageId);
        if (!page) return;
        const idx = page.elements.findIndex((e) => e.id === elementId);
        if (idx === -1) return;
        const [el] = page.elements.splice(idx, 1);
        page.elements.push(el);
      });
    },

    sendToBack: (pageId, elementId) => {
      get().pushHistory();
      set((state) => {
        const page = state.pages.find((p) => p.id === pageId);
        if (!page) return;
        const idx = page.elements.findIndex((e) => e.id === elementId);
        if (idx === -1) return;
        const [el] = page.elements.splice(idx, 1);
        page.elements.unshift(el);
      });
    },

    setTool: (tool) =>
      set((state) => {
        state.tool = tool;
      }),

    setZoom: (zoom) =>
      set((state) => {
        state.zoom = Math.min(4, Math.max(0.25, zoom));
      }),

    zoomIn: () => set((state) => { state.zoom = Math.min(4, state.zoom + 0.25); }),
    zoomOut: () => set((state) => { state.zoom = Math.max(0.25, state.zoom - 0.25); }),
    resetZoom: () => set((state) => { state.zoom = 1; }),

    pushHistory: () => {
      const state = get();
      const snapshot = JSON.parse(JSON.stringify(state.pages));
      
      set((s) => {
        // Only push if different from last snapshot
        const last = s.history.undoStack[s.history.undoStack.length - 1];
        if (last && JSON.stringify(last) === JSON.stringify(snapshot)) {
          return;
        }
        s.history.undoStack.push(snapshot);
        if (s.history.undoStack.length > MAX_HISTORY) s.history.undoStack.shift();
        s.history.redoStack = [];
      });
    },

    undo: () => {
      lastHistoryTime = 0; // reset debounce timer
      set((state) => {
        if (state.history.undoStack.length === 0) return;
        const snapshot = state.history.undoStack.pop()!;
        state.history.redoStack.push(JSON.parse(JSON.stringify(state.pages)));
        state.pages = snapshot;
      });
    },

    redo: () => {
      lastHistoryTime = 0; // reset debounce timer
      set((state) => {
        if (state.history.redoStack.length === 0) return;
        const snapshot = state.history.redoStack.pop()!;
        state.history.undoStack.push(JSON.parse(JSON.stringify(state.pages)));
        state.pages = snapshot;
      });
    },

    setCompressionLevel: (level) =>
      set((state) => {
        state.compressionLevel = level;
      }),

    setDefaultEraserSize: (size) =>
      set((state) => {
        state.defaultEraserSize = size;
      }),

    setDefaultDrawSize: (size) =>
      set((state) => {
        state.defaultDrawSize = size;
      }),

    setDefaultDrawColor: (color) =>
      set((state) => {
        state.defaultDrawColor = color;
      }),

    reset: () => set(() => ({ ...initialState, id: nanoid() })),
  }))
);
