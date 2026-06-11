// ============================================================
// src/components/image-tools/MetadataCategory.tsx
// ============================================================

"use client";

import React, { useState } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";

interface MetadataCategoryProps {
  title: string;
  count: number;
  defaultOpen?: boolean;
  children: React.ReactNode;
}

export function MetadataCategory({
  title,
  count,
  defaultOpen = false,
  children,
}: MetadataCategoryProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  if (count === 0) return null;

  return (
    <div className="border border-[#2a2a2d] bg-[#111112]/50 rounded-xl overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-4 bg-[#141416] hover:bg-[#1c1c1e] text-left transition-colors"
      >
        <div className="flex items-center gap-2">
          <span className="text-[#8e8e93]">
            {isOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
          </span>
          <span className="text-[14px] font-bold text-white">{title}</span>
        </div>
        <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-[#1c1c1e] text-[#8e8e93] border border-[#2a2a2d]">
          {count} fields
        </span>
      </button>

      {isOpen && (
        <div className="border-t border-[#2a2a2d] p-4 bg-[#0d0d0e]/50 divide-y divide-[#1c1c1e]">
          {children}
        </div>
      )}
    </div>
  );
}
