"use client";
// ============================================================
// components/pdf-editor/PageCanvas.tsx
// ============================================================

import React, { useEffect, useRef, useState, useCallback } from "react";
import { usePDFEditorStore } from "@/store/pdf-editor-store";
import { useElementActions } from "@/hooks/use-pdf-editor";
import { getPdfDocRef } from "@/hooks/use-pdf-editor";

import type {
  PDFPage,
  PDFElement,
  TextElement,
  ImageElement,
  ShapeElement,
  HighlightElement,
  DrawElement,
  EraserElement,
} from "@/types/pdf-editor";
import { AnyType } from "@/types";
import { renderPageToFullDataURL } from "@/pdf/pdf-loader";

// Dynamically import Konva to avoid SSR issues
let Stage: AnyType,
  Layer: AnyType,
  Image: AnyType,
  Text: AnyType,
  Rect: AnyType,
  Circle: AnyType,
  Line: AnyType,
  Transformer: AnyType,
  Group: AnyType;

async function loadKonva() {
  const konva = await import("react-konva");
  Stage = konva.Stage;
  Layer = konva.Layer;
  Image = konva.Image;
  Text = konva.Text;
  Rect = konva.Rect;
  Circle = konva.Circle;
  Line = konva.Line;
  Transformer = konva.Transformer;
  Group = konva.Group;
}

interface PageCanvasProps {
  page: PDFPage;
  isActive: boolean;
  onStageReady?: (pageId: string, stage: AnyType) => void;
}

export function PageCanvas({ page, isActive, onStageReady }: PageCanvasProps) {
  const {
    zoom,
    tool,
    selectedElementId,
    activePageId,
    selectElement,
    setTool,
    defaultEraserSize,
    defaultDrawSize,
    defaultDrawColor,
  } = usePDFEditorStore();
  const { updateElement, deleteElement } = useElementActions(page.id);
  const { addText, addShape, addHighlight } = useElementActions(
    page.id,
  );

  const stageRef = useRef<AnyType>(null);
  const transformerRef = useRef<AnyType>(null);
  const [konvaLoaded, setKonvaLoaded] = useState(false);
  const [bgImage, setBgImage] = useState<HTMLImageElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [editingTextId, setEditingTextId] = useState<string | null>(null);
  const drawPointsRef = useRef<number[]>([]);
  const currentDrawId = useRef<string | null>(null);
  const { addElement } = usePDFEditorStore();
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { nanoid } = require("nanoid");
  const scaledW = page.width * zoom;
  const scaledH = page.height * zoom;

  // Load Konva
  useEffect(() => {
    loadKonva().then(() => setKonvaLoaded(true));
  }, []);

  // Register stage ref for export
  useEffect(() => {
    if (stageRef.current && onStageReady) {
      onStageReady(page.id, stageRef.current);
    }
  }, [konvaLoaded, page.id, onStageReady]);

  // Load background PDF page
  useEffect(() => {
    const { getPdfDocForPage } = require("@/pdf/pdf-docs-map");
    const pdfDoc = getPdfDocForPage(page.id) || getPdfDocRef();
    if (!pdfDoc || page.pdfPageIndex < 0) {
      // Blank page
      const canvas = document.createElement("canvas");
      canvas.width = page.width;
      canvas.height = page.height;
      const ctx = canvas.getContext("2d")!;
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, page.width, page.height);
      const img = new window.Image();
      img.src = canvas.toDataURL();
      img.onload = () => setBgImage(img);
      return;
    }
    renderPageToFullDataURL(pdfDoc, page.pdfPageIndex, 1.5).then((dataURL) => {
      const img = new window.Image();
      img.onload = () => setBgImage(img);
      img.src = dataURL;
    });
  }, [page.pdfPageIndex, page.width, page.height]);

  // Update transformer on selection
  useEffect(() => {
    if (!transformerRef.current || !stageRef.current) return;
    if (selectedElementId && activePageId === page.id) {
      const node = stageRef.current.findOne(`#${selectedElementId}`);
      if (node) {
        transformerRef.current.nodes([node]);
        transformerRef.current.getLayer()?.batchDraw();
      }
    } else {
      transformerRef.current.nodes([]);
      transformerRef.current.getLayer()?.batchDraw();
    }
  }, [selectedElementId, activePageId, page.id, konvaLoaded]);

  const handleStagePointerDown = useCallback(
    (e: AnyType) => {
      if (e.target === e.target.getStage() || e.target.name() === "bg") {
        selectElement(null);

        const pos = e.target.getStage().getPointerPosition();
        if (!pos) return;
        const x = pos.x / zoom;
        const y = pos.y / zoom;

        if (tool === "text") {
          addText(x, y);
          setTool("select");
        } else if (tool === "rect") {
          addShape("rect", x, y);
          setTool("select");
        } else if (tool === "circle") {
          addShape("circle", x, y);
          setTool("select");
        } else if (tool === "line") {
          addShape("line", x, y);
          setTool("select");
        } else if (tool === "highlight") {
          addHighlight(x, y);
          setTool("select");
        }
      }
    },
    [
      tool,
      zoom,
      addText,
      addShape,
      addHighlight,
      selectElement,
      setTool,
    ],
  );

  // Draw tool handlers
  const handleMouseDown = useCallback(
    (e: AnyType) => {
      if (tool !== "draw" && tool !== "eraser") return;
      setIsDrawing(true);
      const pos = e.target.getStage().getPointerPosition();
      const id = nanoid();
      currentDrawId.current = id;
      const pts = [pos.x / zoom, pos.y / zoom];
      drawPointsRef.current = pts;

      if (tool === "draw") {
        addElement(page.id, {
          id,
          type: "draw",
          points: pts,
          stroke: defaultDrawColor,
          strokeWidth: defaultDrawSize,
        });
      } else {
        addElement(page.id, {
          id,
          type: "eraser",
          points: pts,
          strokeWidth: defaultEraserSize,
        });
      }
    },
    [tool, zoom, addElement, page.id, defaultEraserSize, defaultDrawSize, defaultDrawColor],
  );

  const handleMouseMove = useCallback(
    (e: AnyType) => {
      if (!isDrawing || (tool !== "draw" && tool !== "eraser") || !currentDrawId.current) return;
      const pos = e.target.getStage().getPointerPosition();
      const next = [...drawPointsRef.current, pos.x / zoom, pos.y / zoom];
      drawPointsRef.current = next;
      updateElement(page.id, currentDrawId.current!, {
        points: next,
      } as AnyType);
    },
    [isDrawing, tool, zoom, updateElement, page.id],
  );

  const handleMouseUp = useCallback(() => {
    setIsDrawing(false);
    currentDrawId.current = null;
    // We intentionally do not switch back to "select" here so the user can continue drawing/erasing!
  }, []);

  if (!konvaLoaded) {
    return (
      <div
        style={{ width: scaledW, height: scaledH }}
        className="bg-white shadow-2xl flex items-center justify-center"
      >
        <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const cursorMap: Record<string, string> = {
    select: "default",
    text: "text",
    image: "crosshair",
    rect: "crosshair",
    circle: "crosshair",
    line: "crosshair",
    highlight: "crosshair",
    eraser: "crosshair",
    draw: "crosshair",
    pan: "grab",
  };

  const handleEditEnd = (id: string, newText: string) => {
    updateElement(page.id, id, { text: newText } as AnyType);
    setEditingTextId(null);
  };

  return (
    <div
      style={{
        width: scaledW,
        height: scaledH,
        cursor: cursorMap[tool] || "default",
      }}
      className="relative shadow-2xl overflow-hidden"
    >
      <Stage

        ref={stageRef}
        width={scaledW}
        height={scaledH}
        scaleX={zoom}
        scaleY={zoom}
        onPointerDown={(e: AnyType) => {
          handleStagePointerDown(e);
          handleMouseDown(e);
        }}
        onPointerMove={handleMouseMove}
        onPointerUp={handleMouseUp}
      >
        {/* Background Layer */}
        <Layer>
          {bgImage && (
            <Image
              name="bg"
              image={bgImage}
              width={page.width}
              height={page.height}
              listening={true}
            />
          )}
        </Layer>

        {/* Content Layer */}
        <Layer>
          {page.elements.map((el) => (
            <ElementRenderer
              key={el.id}
              element={el}
              isSelected={
                selectedElementId === el.id && activePageId === page.id
              }
              onSelect={(e: AnyType) => {
                if (e) e.cancelBubble = true;
                if (tool === "select") selectElement(el.id);
              }}
              onChange={(updates) => updateElement(page.id, el.id, updates)}
              onDoubleClick={() => {
                if (el.type === "text") setEditingTextId(el.id);
              }}
            />
          ))}
        </Layer>

        {/* Interaction Layer (Transformer) */}
        <Layer>
          <Transformer
            ref={transformerRef}
            boundBoxFunc={(oldBox: AnyType, newBox: AnyType) => {
              if (newBox.width < 10 || newBox.height < 10) return oldBox;
              return newBox;
            }}
            enabledAnchors={[
              "top-left",
              "top-center",
              "top-right",
              "middle-left",
              "middle-right",
              "bottom-left",
              "bottom-center",
              "bottom-right",
            ]}
            rotateEnabled={true}
            keepRatio={false}
          />
        </Layer>
      </Stage>

      {/* HTML Overlay for Text Editing */}
      {editingTextId && (
        <TextEditorOverlay
          element={page.elements.find((e) => e.id === editingTextId) as TextElement}
          zoom={zoom}
          onClose={(newText) => handleEditEnd(editingTextId, newText)}
        />
      )}
    </div>
  );
}

// ----------------------------------------------------------------
// Element Renderer
// ----------------------------------------------------------------
interface ElementRendererProps {
  element: PDFElement;
  isSelected: boolean;
  onSelect: (e?: AnyType) => void;
  onChange: (updates: Partial<PDFElement>) => void;
  onDoubleClick?: () => void;
}

function ElementRenderer({
  element,
  isSelected,
  onSelect,
  onChange,
  onDoubleClick,
}: ElementRendererProps) {
  const nodeRef = useRef<AnyType>(null);

  const commonProps = {
    id: element.id,
    ref: nodeRef,
    draggable: true,
    rotation: (element as AnyType).rotation || 0,
    onPointerDown: onSelect,
    onDragStart: onSelect,
    onTransformStart: onSelect,
    onDragEnd: (e: AnyType) =>
      onChange({ x: e.target.x(), y: e.target.y() } as AnyType),
    onTransformEnd: (e: AnyType) => {
      const node = e.target;
      onChange({
        x: node.x(),
        y: node.y(),
        width: node.width() * node.scaleX(),
        height: node.height() * node.scaleY(),
        rotation: node.rotation(),
      } as AnyType);
      node.scaleX(1);
      node.scaleY(1);
    },
    opacity: (element as AnyType).opacity ?? 1,
  };

  if (element.type === "text") {
    const el = element as TextElement;

    return (
      <Group {...commonProps} x={el.x} y={el.y} onDblClick={onDoubleClick}>
        {/* Transparent hit area or visible background mask */}
        <Rect
          x={0}
          y={0}
          width={el.width ? el.width + 10 : (el.text.length * (el.fontSize * 0.6)) + 10}
          height={el.fontSize * 1.2}
          fill={el.hasBackgroundMask ? (el.backgroundMaskColor || "#ffffff") : "transparent"}
        />
        <Text
          x={0}
          y={0}
          text={el.text}
          fontSize={el.fontSize}
          fontFamily={el.fontFamily}
          fill={el.color}
          width={el.width ? el.width + 10 : undefined}
          wrap="none"
          fontStyle={el.fontStyle}
          align={el.align}
        />
      </Group>
    );
  }

  if (element.type === "image") {
    const el = element as ImageElement;
    return <KonvaImageEl {...commonProps} el={el} onChange={onChange} />;
  }

  if (element.type === "shape") {
    const el = element as ShapeElement;
    if (el.shapeType === "rect") {
      return (
        <Rect
          {...commonProps}
          x={el.x}
          y={el.y}
          width={el.width ?? 80}
          height={el.height ?? 80}
          stroke={el.stroke}
          strokeWidth={el.strokeWidth ?? 2}
          fill={el.fill ?? "rgba(37,99,235,0.1)"}
        />
      );
    }
    if (el.shapeType === "circle") {
      return (
        <Circle
          {...commonProps}
          x={el.x + (el.width ?? 80) / 2}
          y={el.y + (el.height ?? 80) / 2}
          radiusX={(el.width ?? 80) / 2}
          radiusY={(el.height ?? 80) / 2}
          stroke={el.stroke}
          strokeWidth={el.strokeWidth ?? 2}
          fill={el.fill ?? "rgba(37,99,235,0.1)"}
        />
      );
    }
    if (el.shapeType === "line") {
      return (
        <Line
          {...commonProps}
          points={el.points ?? [el.x, el.y, el.x + 100, el.y]}
          stroke={el.stroke}
          strokeWidth={el.strokeWidth ?? 2}
        />
      );
    }
  }

  if (element.type === "highlight") {
    const el = element as HighlightElement;
    return (
      <Rect
        {...commonProps}
        x={el.x}
        y={el.y}
        width={el.width}
        height={el.height}
        fill={el.color}
        opacity={el.opacity}
      />
    );
  }

  if (element.type === "draw") {
    const el = element as DrawElement;
    return (
      <Line
        {...commonProps}
        points={el.points}
        stroke={el.stroke}
        strokeWidth={el.strokeWidth}
        tension={0.5}
        lineCap="round"
        lineJoin="round"
        globalCompositeOperation="source-over"
      />
    );
  }

  if (element.type === "eraser") {
    const el = element as EraserElement;
    return (
      <Line
        {...commonProps}
        draggable={false}
        listening={false}
        points={el.points}
        stroke="#ffffff"
        strokeWidth={el.strokeWidth}
        tension={0.5}
        lineCap="round"
        lineJoin="round"
        globalCompositeOperation="source-over"
      />
    );
  }

  return null;
}

// Konva image component with async image loading
function KonvaImageEl({ el, onChange, ...rest }: AnyType) {
  const [image, setImage] = useState<HTMLImageElement | null>(null);

  useEffect(() => {
    const img = new window.Image();
    img.onload = () => setImage(img);
    img.src = el.src;
    img.crossOrigin = "anonymous";
  }, [el.src]);

  return (
    <Image
      {...rest}
      x={el.x}
      y={el.y}
      width={el.width}
      height={el.height}
      image={image || undefined}
    />
  );
}

// ----------------------------------------------------------------
// HTML Overlay for In-Place Text Editing
// ----------------------------------------------------------------
function TextEditorOverlay({
  element,
  zoom,
  onClose,
}: {
  element: TextElement;
  zoom: number;
  onClose: (newText: string) => void;
}) {
  const [val, setVal] = useState(element.text);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose(element.text);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [element.text, onClose]);

  if (!element) return null;

  return (
    <textarea
      value={val}
      onChange={(e) => setVal(e.target.value)}
      onBlur={() => onClose(val)}
      autoFocus
      style={{
        position: "absolute",
        top: element.y * zoom,
        left: element.x * zoom,
        width: Math.max((element.width || 100) * zoom, val.length * (element.fontSize * zoom * 0.6)),
        height: Math.max(element.fontSize * zoom * 1.5, 40),
        fontSize: `${element.fontSize * zoom}px`,
        fontFamily: element.fontFamily,
        color: element.color,
        fontWeight: element.fontStyle === "bold" ? "bold" : "normal",
        fontStyle: element.fontStyle === "italic" ? "italic" : "normal",
        lineHeight: 1.2,
        padding: 0,
        margin: 0,
        border: "1px dashed #0a84ff",
        background: "white",
        outline: "none",
        resize: "none",
        zIndex: 50,
        whiteSpace: "nowrap",
        overflow: "hidden",
      }}
    />
  );
}
