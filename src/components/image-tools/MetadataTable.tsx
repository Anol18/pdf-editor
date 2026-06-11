// ============================================================
// src/components/image-tools/MetadataTable.tsx
// ============================================================

"use client";

import React, { useState } from "react";
import { Copy, Check, Search } from "lucide-react";

interface MetadataTableProps {
  data: Record<string, string>;
  searchQuery: string;
}

export function MetadataTable({ data, searchQuery }: MetadataTableProps) {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const handleCopy = async (key: string, value: string) => {
    try {
      await navigator.clipboard.writeText(value);
      setCopiedKey(key);
      setTimeout(() => setCopiedKey(null), 2000);
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  const filteredData = Object.entries(data).filter(([key, val]) => {
    const query = searchQuery.toLowerCase();
    return (
      key.toLowerCase().includes(query) ||
      val.toLowerCase().includes(query)
    );
  });

  if (filteredData.length === 0) {
    return (
      <div className="py-2 text-[12px] text-[#8e8e93] italic">
        No matching fields found.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse text-[13px]">
        <thead>
          <tr className="text-[#8e8e93] text-[11px] uppercase tracking-wider font-semibold border-b border-[#1c1c1e]">
            <th className="py-2 px-3 w-1/3">Field</th>
            <th className="py-2 px-3">Value</th>
            <th className="py-2 px-3 w-10 text-right"></th>
          </tr>
        </thead>
        <tbody className="divide-y divide-[#1c1c1e]">
          {filteredData.map(([key, val]) => (
            <tr key={key} className="hover:bg-[#141416]/40 transition-colors group">
              <td className="py-2 px-3 font-semibold text-[#ebebf5] select-all">
                {key}
              </td>
              <td className="py-2 px-3 text-[#8e8e93] break-all select-all max-w-xs sm:max-w-md md:max-w-xl">
                {val}
              </td>
              <td className="py-2 px-3 text-right">
                <button
                  onClick={() => handleCopy(key, val)}
                  className="p-1 rounded bg-[#1c1c1e] hover:bg-[#2c2c2e] text-[#8e8e93] hover:text-white transition-all opacity-0 group-hover:opacity-100 focus:opacity-100"
                  title="Copy Value"
                >
                  {copiedKey === key ? (
                    <Check size={12} className="text-green-500" />
                  ) : (
                    <Copy size={12} />
                  )}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
