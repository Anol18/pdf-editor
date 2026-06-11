// ============================================================
// types/pdf-editor.ts
// ============================================================

export type DeviceMode = "mobile" | "tablet" | "desktop";

export type TextElement = {
  id: string;
  type: "text";
  x: number;
  y: number;
  text: string;
  fontSize: number;
  fontFamily: string;
  color: string;
  editable: boolean;
  width?: number;
  fontStyle?: "normal" | "bold" | "italic";
  align?: "left" | "center" | "right";
  opacity?: number;
  rotation?: number;
  hasBackgroundMask?: boolean;
  backgroundMaskColor?: string;
};

export type ImageElement = {
  id: string;
  type: "image";
  x: number;
  y: number;
  width: number;
  height: number;
  src: string;
  opacity?: number;
  rotation?: number;
};

export type ShapeElement = {
  id: string;
  type: "shape";
  shapeType: "rect" | "circle" | "line";
  x: number;
  y: number;
  width?: number;
  height?: number;
  radius?: number;
  points?: number[];
  stroke: string;
  strokeWidth?: number;
  fill?: string;
  opacity?: number;
  rotation?: number;
};

export type HighlightElement = {
  id: string;
  type: "highlight";
  x: number;
  y: number;
  width: number;
  height: number;
  color: string;
  opacity: number;
  rotation?: number;
};

export type DrawElement = {
  id: string;
  type: "draw";
  points: number[];
  stroke: string;
  strokeWidth: number;
  opacity?: number;
  rotation?: number;
};



export type EraserElement = {
  id: string;
  type: "eraser";
  points: number[];
  strokeWidth: number;
  opacity?: number;
};

export type PDFElement =
  | TextElement
  | ImageElement
  | ShapeElement
  | HighlightElement
  | DrawElement
  | EraserElement;

export type PDFPage = {
  id: string;
  width: number;
  height: number;
  rotation: number;
  elements: PDFElement[];
  pdfPageIndex: number; // original PDF page index
};

export type PDFProjectHistory = {
  undoStack: PDFPage[][];
  redoStack: PDFPage[][];
};

export type CompressionLevel = "low" | "medium" | "high";

export type PDFProject = {
  id: string;
  name: string;
  deviceMode: DeviceMode;
  pages: PDFPage[];
  thumbnails: Record<string, string>;
  activePageId: string | null;
  selectedElementId: string | null;
  zoom: number;
  tool: ToolType;

  defaultEraserSize: number;
  defaultDrawSize: number;
  defaultDrawColor: string;
  history: PDFProjectHistory;
  compressionLevel: CompressionLevel;
  isLoading: boolean;
  loadingMessage: string;
  originalFile: File | null;
};

export type ToolType =
  | "select"
  | "text"
  | "image"
  | "rect"
  | "circle"
  | "line"
  | "highlight"
  | "draw"
  | "pan"
  | "eraser";

export type ExportOptions = {
  compressionLevel: CompressionLevel;
  quality: number;
  filename: string;
};
