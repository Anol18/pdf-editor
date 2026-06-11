"use client";
// ============================================================
// components/pdf-editor/PropertiesPanel.tsx
// ============================================================

import React from "react";
import { usePDFEditorStore } from "@/store/pdf-editor-store";
import type { TextElement, ShapeElement, HighlightElement, DrawElement } from "@/types/pdf-editor";

const FONT_FAMILIES = ["Arial", "Times New Roman", "Georgia", "Verdana", "Courier New", "Trebuchet MS"];
const COLORS = ["#1a1a1a", "#ef4444", "#f97316", "#eab308", "#22c55e", "#3b82f6", "#8b5cf6", "#ec4899", "#ffffff"];

export function PropertiesPanel() {
  const { pages, activePageId, selectedElementId, updateElement, deleteElement, bringToFront, sendToBack, duplicateElement, tool, defaultEraserSize, setDefaultEraserSize, defaultDrawSize, setDefaultDrawSize, defaultDrawColor, setDefaultDrawColor } = usePDFEditorStore();

  const activePage = pages.find((p) => p.id === activePageId);
  const selectedElement = activePage?.elements.find((e) => e.id === selectedElementId);

  if (!selectedElement || !activePageId) {
    if (tool === "eraser") {
      return (
        <div className="w-[220px] shrink-0 bg-[#1c1c1e] border-l border-[#2a2a2d] flex flex-col">
          <div className="px-4 py-3 border-b border-[#2a2a2d]">
            <span className="text-[11px] font-semibold text-[#8e8e93] uppercase tracking-wider">Eraser Settings</span>
          </div>
          <div className="p-4 flex flex-col gap-2">
            <span className="text-[11px] text-[#8e8e93]">Default Width</span>
            <input
              type="range"
              min={1}
              max={100}
              value={defaultEraserSize}
              onChange={(e) => setDefaultEraserSize(Number(e.target.value))}
              className="w-full accent-[#0a84ff] h-1.5"
            />
            <span className="text-[11px] text-[#ebebf5]">{defaultEraserSize}px</span>
          </div>
        </div>
      );
    }

    if (tool === "draw") {
      return (
        <div className="w-[220px] shrink-0 bg-[#1c1c1e] border-l border-[#2a2a2d] flex flex-col">
          <div className="px-4 py-3 border-b border-[#2a2a2d]">
            <span className="text-[11px] font-semibold text-[#8e8e93] uppercase tracking-wider">Draw Settings</span>
          </div>
          <div className="p-4 flex flex-col gap-4">
            <Section title="Color">
              <ColorPicker
                value={defaultDrawColor}
                onChange={(c) => setDefaultDrawColor(c)}
              />
            </Section>
            <Section title="Stroke Width">
              <div className="flex items-center gap-2">
                <input
                  type="range"
                  min={1}
                  max={20}
                  value={defaultDrawSize}
                  onChange={(e) => setDefaultDrawSize(Number(e.target.value))}
                  className="w-full accent-[#0a84ff] h-1.5"
                />
                <span className="text-[11px] text-[#ebebf5]">{defaultDrawSize}px</span>
              </div>
            </Section>
          </div>
        </div>
      );
    }

    return (
      <div className="w-[220px] shrink-0 bg-[#1c1c1e] border-l border-[#2a2a2d] flex flex-col">
        <div className="px-4 py-3 border-b border-[#2a2a2d]">
          <span className="text-[11px] font-semibold text-[#8e8e93] uppercase tracking-wider">Properties</span>
        </div>
        <div className="flex-1 flex items-center justify-center">
          <p className="text-[12px] text-[#48484a] text-center px-4">Select an element to edit its properties</p>
        </div>
      </div>
    );
  }

  const update = (updates: any) => updateElement(activePageId, selectedElement.id, updates);

  return (
    <div className="w-[220px] shrink-0 bg-[#1c1c1e] border-l border-[#2a2a2d] flex flex-col overflow-hidden">
      <div className="px-4 py-3 border-b border-[#2a2a2d] flex items-center justify-between">
        <span className="text-[11px] font-semibold text-[#8e8e93] uppercase tracking-wider">Properties</span>
        <span className="text-[11px] text-[#0a84ff] capitalize">{selectedElement.type}</span>
      </div>

      <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-track-transparent scrollbar-thumb-[#3a3a3d]">
        <div className="p-3 space-y-4">

          {/* Position */}
          <Section title="Position">
            <div className="grid grid-cols-2 gap-2">
              <LabeledInput
                label="X"
                type="number"
                value={Math.round((selectedElement as any).x ?? 0)}
                onChange={(v) => update({ x: Number(v) })}
              />
              <LabeledInput
                label="Y"
                type="number"
                value={Math.round((selectedElement as any).y ?? 0)}
                onChange={(v) => update({ y: Number(v) })}
              />
            </div>
          </Section>

          {/* Size for image/shape/highlight */}
          {["image", "shape", "highlight"].includes(selectedElement.type) && (
            <Section title="Size">
              <div className="grid grid-cols-2 gap-2">
                <LabeledInput
                  label="W"
                  type="number"
                  value={Math.round((selectedElement as any).width ?? 0)}
                  onChange={(v) => update({ width: Number(v) })}
                />
                <LabeledInput
                  label="H"
                  type="number"
                  value={Math.round((selectedElement as any).height ?? 0)}
                  onChange={(v) => update({ height: Number(v) })}
                />
              </div>
            </Section>
          )}

          {/* Opacity */}
          <Section title="Opacity">
            <div className="flex items-center gap-2">
              <input
                type="range"
                min={0.1}
                max={1}
                step={0.05}
                value={(selectedElement as any).opacity ?? 1}
                onChange={(e) => update({ opacity: Number(e.target.value) })}
                className="flex-1 accent-[#0a84ff] h-1.5"
              />
              <span className="text-[11px] text-[#ebebf5] w-8 text-right">
                {Math.round(((selectedElement as any).opacity ?? 1) * 100)}%
              </span>
            </div>
          </Section>

          {/* Text-specific */}
          {selectedElement.type === "text" && (
            <TextProperties el={selectedElement as TextElement} update={update} />
          )}

          {/* Shape / Highlight color */}
          {(selectedElement.type === "shape" || selectedElement.type === "highlight") && (
            <Section title="Color">
              <ColorPicker
                value={(selectedElement as any).stroke || (selectedElement as any).color || "#1a1a1a"}
                onChange={(c) => {
                  if (selectedElement.type === "shape") update({ stroke: c, fill: c + "33" });
                  else update({ color: c });
                }}
              />
            </Section>
          )}

          {/* Draw / Eraser stroke */}
          {(selectedElement.type === "draw" || selectedElement.type === "eraser") && (
            <Section title={selectedElement.type === "eraser" ? "Eraser Size" : "Stroke"}>
              {selectedElement.type === "draw" && (
                <ColorPicker
                  value={(selectedElement as DrawElement).stroke}
                  onChange={(c) => {
                    update({ stroke: c });
                    setDefaultDrawColor(c);
                  }}
                />
              )}
              <div className="flex items-center gap-2 mt-2">
                <span className="text-[11px] text-[#8e8e93]">Width</span>
                <input
                  type="range"
                  min={1}
                  max={selectedElement.type === "eraser" ? 100 : 20}
                  value={(selectedElement as any).strokeWidth}
                  onChange={(e) => {
                    const val = Number(e.target.value);
                    update({ strokeWidth: val });
                    if (selectedElement.type === "eraser") {
                      setDefaultEraserSize(val);
                    } else if (selectedElement.type === "draw") {
                      setDefaultDrawSize(val);
                    }
                  }}
                  className="flex-1 accent-[#0a84ff] h-1.5"
                />
                <span className="text-[11px] text-[#ebebf5] w-4">{(selectedElement as any).strokeWidth}</span>
              </div>
            </Section>
          )}

          {/* Layer order */}
          <Section title="Layer">
            <div className="grid grid-cols-2 gap-2">
              <SmallButton onClick={() => bringToFront(activePageId, selectedElement.id)} label="Front" />
              <SmallButton onClick={() => sendToBack(activePageId, selectedElement.id)} label="Back" />
            </div>
          </Section>

          {/* Actions */}
          <Section title="Actions">
            <div className="flex flex-col gap-2">
              <SmallButton onClick={() => duplicateElement(activePageId, selectedElement.id)} label="Duplicate" />
              <SmallButton
                onClick={() => deleteElement(activePageId, selectedElement.id)}
                label="Delete"
                danger
              />
            </div>
          </Section>
        </div>
      </div>
    </div>
  );
}

function TextProperties({ el, update }: { el: TextElement; update: (u: any) => void }) {
  return (
    <>
      <Section title="Text">
        <textarea
          value={el.text}
          onChange={(e) => update({ text: e.target.value })}
          rows={3}
          className="w-full bg-[#2c2c2e] text-[#ebebf5] text-[12px] rounded-lg px-2 py-1.5 border border-[#3a3a3d] focus:border-[#0a84ff] focus:outline-none resize-none"
        />
      </Section>

      <Section title="Font">
        <select
          value={el.fontFamily}
          onChange={(e) => update({ fontFamily: e.target.value })}
          className="w-full bg-[#2c2c2e] text-[#ebebf5] text-[12px] rounded-lg px-2 py-1.5 border border-[#3a3a3d] focus:border-[#0a84ff] focus:outline-none mb-2"
        >
          {FONT_FAMILIES.map((f) => (
            <option key={f} value={f}>{f}</option>
          ))}
        </select>

        <div className="flex items-center gap-2">
          <LabeledInput
            label="Size"
            type="number"
            value={el.fontSize}
            onChange={(v) => update({ fontSize: Number(v) })}
          />
          <div className="flex gap-1">
            <StyleButton
              active={el.fontStyle === "bold"}
              onClick={() => update({ fontStyle: el.fontStyle === "bold" ? "normal" : "bold" })}
              label="B"
              className="font-bold"
            />
            <StyleButton
              active={el.fontStyle === "italic"}
              onClick={() => update({ fontStyle: el.fontStyle === "italic" ? "normal" : "italic" })}
              label="I"
              className="italic"
            />
          </div>
        </div>
      </Section>

      <Section title="Align">
        <div className="flex gap-1">
          {(["left", "center", "right"] as const).map((a) => (
            <StyleButton
              key={a}
              active={el.align === a}
              onClick={() => update({ align: a })}
              label={a === "left" ? "⫷" : a === "center" ? "≡" : "⫸"}
            />
          ))}
        </div>
      </Section>

      <Section title="Color">
        <ColorPicker value={el.color} onChange={(c) => update({ color: c })} />
      </Section>

      <Section title="Background Mask">
        <div className="flex flex-col gap-2">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={el.hasBackgroundMask || false}
              onChange={(e) => update({ hasBackgroundMask: e.target.checked })}
              className="w-3.5 h-3.5 accent-[#0a84ff] bg-[#2c2c2e] border-[#3a3a3d] rounded"
            />
            <span className="text-[11px] text-[#ebebf5]">Enable Mask (Whiteout)</span>
          </label>

          {el.hasBackgroundMask && (
            <ColorPicker
              value={el.backgroundMaskColor || "#ffffff"}
              onChange={(c) => update({ backgroundMaskColor: c })}
            />
          )}
        </div>
      </Section>
    </>
  );
}

function ColorPicker({ value, onChange }: { value: string; onChange: (c: string) => void }) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {COLORS.map((c) => (
        <button
          key={c}
          onClick={() => onChange(c)}
          style={{ backgroundColor: c }}
          className={`w-6 h-6 rounded-full border-2 transition-all ${value === c ? "border-[#0a84ff] scale-110" : "border-[#3a3a3d]"
            }`}
        />
      ))}
      <input
        type="color"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-6 h-6 rounded-full cursor-pointer border-2 border-[#3a3a3d] bg-transparent"
        title="Custom color"
      />
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="text-[10px] font-semibold text-[#8e8e93] uppercase tracking-wider mb-2">{title}</div>
      {children}
    </div>
  );
}

function LabeledInput({ label, type, value, onChange }: { label: string; type: string; value: any; onChange: (v: string) => void }) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-[10px] text-[#8e8e93]">{label}</span>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-[#2c2c2e] text-[#ebebf5] text-[12px] rounded-lg px-2 py-1 border border-[#3a3a3d] focus:border-[#0a84ff] focus:outline-none"
      />
    </div>
  );
}

function SmallButton({ onClick, label, danger }: { onClick: () => void; label: string; danger?: boolean }) {
  return (
    <button
      onClick={onClick}
      className={`w-full py-1.5 text-[12px] rounded-lg border transition-colors font-medium ${danger
          ? "border-red-500/30 text-red-400 hover:bg-red-500/10"
          : "border-[#3a3a3d] text-[#ebebf5] hover:bg-[#2c2c2e]"
        }`}
    >
      {label}
    </button>
  );
}

function StyleButton({ active, onClick, label, className = "" }: { active: boolean; onClick: () => void; label: string; className?: string }) {
  return (
    <button
      onClick={onClick}
      className={`w-8 h-7 flex items-center justify-center text-[12px] rounded-md transition-colors ${className} ${active ? "bg-[#0a84ff] text-white" : "bg-[#2c2c2e] text-[#ebebf5] hover:bg-[#3a3a3d]"
        }`}
    >
      {label}
    </button>
  );
}
