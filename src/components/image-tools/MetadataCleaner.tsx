// ============================================================
// src/components/image-tools/MetadataCleaner.tsx
// ============================================================

"use client";

import React from "react";
import { useImageToolsStore } from "@/store/image-tools-store";
import { Trash2, Loader2, ShieldAlert } from "lucide-react";

interface MetadataCleanerProps {
  onClean: () => void;
  processing: boolean;
}

export function MetadataCleaner({ onClean, processing }: MetadataCleanerProps) {
  const { metadataSettings, updateMetadataSettings, files } = useImageToolsStore();

  const handleToggle = (field: "removeGps" | "removeAuthor" | "removeSoftware" | "removeAll") => {
    if (field === "removeAll") {
      const newVal = !metadataSettings.removeAll;
      updateMetadataSettings({
        removeAll: newVal,
        // Auto check others if all is checked
        removeGps: newVal ? false : metadataSettings.removeGps,
        removeAuthor: newVal ? false : metadataSettings.removeAuthor,
        removeSoftware: newVal ? false : metadataSettings.removeSoftware,
      });
    } else {
      updateMetadataSettings({
        [field]: !metadataSettings[field],
      });
    }
  };

  const hasSelection =
    metadataSettings.removeAll ||
    metadataSettings.removeGps ||
    metadataSettings.removeAuthor ||
    metadataSettings.removeSoftware;

  return (
    <div className="space-y-4">
      <div className="border-b border-[#2a2a2d] pb-3">
        <h4 className="text-[12px] font-bold text-[#ebebf5] uppercase tracking-wider">
          Metadata Cleaner Options
        </h4>
      </div>

      <div className="space-y-3">
        {/* Remove All */}
        <label
          className={`flex items-start gap-3 p-3 rounded-xl border transition-all cursor-pointer ${
            metadataSettings.removeAll
              ? "bg-[#0a84ff]/5 border-[#0a84ff]/30 text-white"
              : "bg-[#1c1c1e] border-[#2a2a2d] text-[#8e8e93] hover:text-white"
          }`}
        >
          <input
            type="checkbox"
            checked={metadataSettings.removeAll}
            onChange={() => handleToggle("removeAll")}
            className="mt-0.5 rounded border-[#2a2a2d] text-[#0a84ff] focus:ring-[#0a84ff]"
          />
          <div className="space-y-0.5">
            <p className="text-[13px] font-bold">Remove All Metadata</p>
            <p className="text-[11px] opacity-80 leading-normal">
              Strip all EXIF, XMP, IPTC, GPS, software logs, and creator tags. Safe, clean, and highly secure.
            </p>
          </div>
        </label>

        {/* Divider */}
        <div className="flex items-center gap-3 py-1">
          <div className="h-px bg-[#2a2a2d] flex-1" />
          <span className="text-[10px] text-[#8e8e93] font-bold uppercase tracking-wider">Or Select Specifics</span>
          <div className="h-px bg-[#2a2a2d] flex-1" />
        </div>

        {/* GPS Only */}
        <label
          className={`flex items-start gap-3 p-3 rounded-xl border transition-all cursor-pointer ${
            metadataSettings.removeAll
              ? "opacity-50 cursor-not-allowed bg-[#1c1c1e] border-[#2a2a2d] text-[#8e8e93]"
              : metadataSettings.removeGps
              ? "bg-[#ff9f0a]/5 border-[#ff9f0a]/30 text-white"
              : "bg-[#1c1c1e] border-[#2a2a2d] text-[#8e8e93] hover:text-white"
          }`}
        >
          <input
            type="checkbox"
            checked={metadataSettings.removeAll || metadataSettings.removeGps}
            disabled={metadataSettings.removeAll}
            onChange={() => handleToggle("removeGps")}
            className="mt-0.5 rounded border-[#2a2a2d] text-[#0a84ff] focus:ring-[#0a84ff]"
          />
          <div className="space-y-0.5">
            <p className="text-[13px] font-bold">Remove GPS Data Only</p>
            <p className="text-[11px] opacity-80 leading-normal">
              Wipe geolocation coordinates, speed records, and altitude logs. Retains camera profile properties.
            </p>
          </div>
        </label>

        {/* Author Only */}
        <label
          className={`flex items-start gap-3 p-3 rounded-xl border transition-all cursor-pointer ${
            metadataSettings.removeAll
              ? "opacity-50 cursor-not-allowed bg-[#1c1c1e] border-[#2a2a2d] text-[#8e8e93]"
              : metadataSettings.removeAuthor
              ? "bg-[#bf5af2]/5 border-[#bf5af2]/30 text-white"
              : "bg-[#1c1c1e] border-[#2a2a2d] text-[#8e8e93] hover:text-white"
          }`}
        >
          <input
            type="checkbox"
            checked={metadataSettings.removeAll || metadataSettings.removeAuthor}
            disabled={metadataSettings.removeAll}
            onChange={() => handleToggle("removeAuthor")}
            className="mt-0.5 rounded border-[#2a2a2d] text-[#0a84ff] focus:ring-[#0a84ff]"
          />
          <div className="space-y-0.5">
            <p className="text-[13px] font-bold">Remove Author Information</p>
            <p className="text-[11px] opacity-80 leading-normal">
              Clear creator names, artist profile details, copyright tags, and attribution notes.
            </p>
          </div>
        </label>

        {/* Software Only */}
        <label
          className={`flex items-start gap-3 p-3 rounded-xl border transition-all cursor-pointer ${
            metadataSettings.removeAll
              ? "opacity-50 cursor-not-allowed bg-[#1c1c1e] border-[#2a2a2d] text-[#8e8e93]"
              : metadataSettings.removeSoftware
              ? "bg-[#30d158]/5 border-[#30d158]/30 text-white"
              : "bg-[#1c1c1e] border-[#2a2a2d] text-[#8e8e93] hover:text-white"
          }`}
        >
          <input
            type="checkbox"
            checked={metadataSettings.removeAll || metadataSettings.removeSoftware}
            disabled={metadataSettings.removeAll}
            onChange={() => handleToggle("removeSoftware")}
            className="mt-0.5 rounded border-[#2a2a2d] text-[#0a84ff] focus:ring-[#0a84ff]"
          />
          <div className="space-y-0.5">
            <p className="text-[13px] font-bold">Remove Software Information</p>
            <p className="text-[11px] opacity-80 leading-normal">
              Strip image editor tags, exporter versions, date modifications, and software generator traces.
            </p>
          </div>
        </label>
      </div>

      <button
        onClick={onClean}
        disabled={files.length === 0 || processing || !hasSelection}
        className="w-full mt-4 py-3 px-4 flex items-center justify-center gap-2 text-[14px] font-bold text-white bg-[#0a84ff] hover:bg-[#0070e3] disabled:opacity-50 disabled:cursor-not-allowed active:scale-98 rounded-xl transition-all shadow-md shadow-[#0a84ff]/20"
      >
        {processing ? (
          <>
            <Loader2 size={16} className="animate-spin" />
            <span>Processing Cleanup...</span>
          </>
        ) : (
          <>
            <Trash2 size={16} />
            <span>Remove Metadata</span>
          </>
        )}
      </button>
    </div>
  );
}
