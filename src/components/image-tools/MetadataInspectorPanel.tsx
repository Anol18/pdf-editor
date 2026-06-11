// ============================================================
// src/components/image-tools/MetadataInspectorPanel.tsx
// ============================================================

"use client";

import React, { useState, useEffect } from "react";
import { useImageToolsStore } from "@/store/image-tools-store";
import { 
  extractMetadataAction, 
  cleanMetadataAction, 
  generatePrivacyReportAction 
} from "@/actions/image-tools";
import { MetadataCategory } from "./MetadataCategory";
import { MetadataTable } from "./MetadataTable";
import { PrivacyReport } from "./PrivacyReport";
import { MetadataCleaner } from "./MetadataCleaner";
import { MetadataSummary } from "./MetadataSummary";
import { Loader2, Search, Info, ShieldAlert, Sparkles, ChevronDown, ChevronUp } from "lucide-react";

export function MetadataInspectorPanel() {
  const { files, metadataSettings, updateFile } = useImageToolsStore();
  const [loadingMetadata, setLoadingMetadata] = useState(false);
  const [cleaningMetadata, setCleaningMetadata] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [expandAll, setExpandAll] = useState(true);
  const [toggleKey, setToggleKey] = useState(0); // Helper to force re-renders of collapse/expand

  const activeFile = files[0]; // Process active file

  // Trigger metadata extraction automatically on file load
  useEffect(() => {
    if (!activeFile) return;

    // Trigger only if metadata hasn't been extracted yet
    if (!activeFile.metadata && activeFile.status !== "processing" && !loadingMetadata) {
      const loadMetadata = async () => {
        setLoadingMetadata(true);
        updateFile(activeFile.id, { status: "processing", progress: 20 });
        
        try {
          const formData = new FormData();
          formData.append("file", activeFile.file);

          const res = await extractMetadataAction(formData);

          if (res.success && res.data) {
            updateFile(activeFile.id, { progress: 60 });
            
            // Generate privacy report using server action
            const reportRes = await generatePrivacyReportAction(JSON.stringify(res.data));
            
            updateFile(activeFile.id, {
              status: "success",
              progress: 100,
              metadata: res.data,
              privacyReport: reportRes.success ? reportRes.report : undefined,
            });
          } else {
            updateFile(activeFile.id, {
              status: "error",
              progress: 0,
              error: res.error || "Failed to extract metadata.",
            });
          }
        } catch (err) {
          updateFile(activeFile.id, {
            status: "error",
            progress: 0,
            error: (err as Error).message,
          });
        } finally {
          setLoadingMetadata(false);
        }
      };

      loadMetadata();
    }
  }, [activeFile?.id, activeFile?.metadata, activeFile?.status, updateFile, loadingMetadata]);

  const handleCleanMetadata = async () => {
    if (!activeFile || cleaningMetadata) return;
    setCleaningMetadata(true);
    updateFile(activeFile.id, { status: "processing", progress: 20 });

    try {
      const formData = new FormData();
      formData.append("file", activeFile.file);
      formData.append("removeGps", String(metadataSettings.removeGps));
      formData.append("removeAuthor", String(metadataSettings.removeAuthor));
      formData.append("removeSoftware", String(metadataSettings.removeSoftware));
      formData.append("removeAll", String(metadataSettings.removeAll));

      const res = await cleanMetadataAction(formData);

      if (res.success && res.dataUrl) {
        updateFile(activeFile.id, { progress: 80 });

        // Convert base64 dataUrl back to a blob url for display/download
        const response = await fetch(res.dataUrl);
        const blob = await response.blob();
        const cleanedUrl = URL.createObjectURL(blob);

        updateFile(activeFile.id, {
          status: "success",
          progress: 100,
          resultUrl: cleanedUrl,
          resultSize: res.size,
          resultType: blob.type,
          metadataRemovedCount: res.fieldsRemovedCount || 0,
        });
      } else {
        updateFile(activeFile.id, {
          status: "error",
          progress: 0,
          error: res.error || "Failed to clean metadata.",
        });
      }
    } catch (err) {
      updateFile(activeFile.id, {
        status: "error",
        progress: 0,
        error: (err as Error).message,
      });
    } finally {
      setCleaningMetadata(false);
    }
  };

  const handleToggleExpandAll = () => {
    setExpandAll(!expandAll);
    setToggleKey(prev => prev + 1); // incrementing key forces elements to mount/remount with new defaultOpen value
  };

  const getCount = (dict: Record<string, string> | undefined) => {
    return dict ? Object.keys(dict).length : 0;
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-bold text-white mb-1">Metadata Inspector & Cleaner</h3>
        <p className="text-xs text-[#8e8e93]">
          Inspect embedded EXIF, IPTC, and XMP metadata fields. Securely scrub camera, GPS, creator profiles, and edit logs from your images.
        </p>
      </div>

      {!activeFile ? (
        <div className="h-[300px] border border-dashed border-[#2a2a2d] bg-[#111112] rounded-2xl flex flex-col items-center justify-center text-[#8e8e93] text-[13px]">
          Upload an image to inspect metadata.
        </div>
      ) : activeFile.status === "processing" && loadingMetadata ? (
        <div className="h-[300px] border border-[#2a2a2d] bg-[#111112]/50 rounded-2xl flex flex-col items-center justify-center gap-3">
          <Loader2 size={32} className="text-[#0a84ff] animate-spin" />
          <p className="text-xs text-[#8e8e93]">Extracting metadata using ExifTool...</p>
        </div>
      ) : activeFile.error ? (
        <div className="p-5 border border-red-500/20 bg-red-500/10 rounded-2xl space-y-3">
          <div className="flex items-center gap-2 text-red-400">
            <ShieldAlert size={18} />
            <h4 className="text-[14px] font-bold">Failed to process metadata</h4>
          </div>
          <p className="text-xs text-[#ebebf5]/80">{activeFile.error}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left/Middle Column: Metadata Categories list & Search */}
          <div className="lg:col-span-2 space-y-4">
            {/* Search Bar & Global controls */}
            <div className="flex flex-col sm:flex-row gap-3 items-center justify-between bg-[#111112] border border-[#2a2a2d] p-3 rounded-xl">
              <div className="relative w-full sm:max-w-xs">
                <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8e8e93]" />
                <input
                  type="text"
                  placeholder="Search metadata fields..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-[#1c1c1e] border border-[#2a2a2d] text-white pl-9 pr-4 py-2 text-[12px] rounded-lg focus:outline-none focus:border-[#0a84ff] transition-colors"
                />
              </div>
              <button
                onClick={handleToggleExpandAll}
                className="flex items-center gap-1.5 px-3 py-2 text-[11px] font-semibold text-[#8e8e93] hover:text-white bg-[#1c1c1e] hover:bg-[#2c2c2e] border border-[#2a2a2d] rounded-lg transition-colors w-full sm:w-auto justify-center"
              >
                {expandAll ? (
                  <>
                    <ChevronUp size={14} />
                    Collapse Categories
                  </>
                ) : (
                  <>
                    <ChevronDown size={14} />
                    Expand Categories
                  </>
                )}
              </button>
            </div>

            {/* Categories List */}
            {activeFile.metadata ? (
              <div key={toggleKey} className="space-y-3">
                {/* Camera Information */}
                <MetadataCategory
                  title="Camera Information"
                  count={getCount(activeFile.metadata.camera)}
                  defaultOpen={expandAll}
                >
                  <MetadataTable data={activeFile.metadata.camera} searchQuery={searchQuery} />
                </MetadataCategory>

                {/* Image Information */}
                <MetadataCategory
                  title="Image Information"
                  count={getCount(activeFile.metadata.image)}
                  defaultOpen={expandAll}
                >
                  <MetadataTable data={activeFile.metadata.image} searchQuery={searchQuery} />
                </MetadataCategory>

                {/* Date Information */}
                <MetadataCategory
                  title="Date Information"
                  count={getCount(activeFile.metadata.dates)}
                  defaultOpen={expandAll}
                >
                  <MetadataTable data={activeFile.metadata.dates} searchQuery={searchQuery} />
                </MetadataCategory>

                {/* Location Information */}
                <MetadataCategory
                  title="Location Information"
                  count={getCount(activeFile.metadata.location)}
                  defaultOpen={expandAll}
                >
                  <MetadataTable data={activeFile.metadata.location} searchQuery={searchQuery} />
                </MetadataCategory>

                {/* Author Information */}
                <MetadataCategory
                  title="Author Information"
                  count={getCount(activeFile.metadata.author)}
                  defaultOpen={expandAll}
                >
                  <MetadataTable data={activeFile.metadata.author} searchQuery={searchQuery} />
                </MetadataCategory>

                {/* Software Information */}
                <MetadataCategory
                  title="Software Information"
                  count={getCount(activeFile.metadata.software)}
                  defaultOpen={expandAll}
                >
                  <MetadataTable data={activeFile.metadata.software} searchQuery={searchQuery} />
                </MetadataCategory>

                {/* Other Metadata */}
                <MetadataCategory
                  title="Other Metadata"
                  count={getCount(activeFile.metadata.other)}
                  defaultOpen={false} // Default closed as other is very large
                >
                  <MetadataTable data={activeFile.metadata.other} searchQuery={searchQuery} />
                </MetadataCategory>
              </div>
            ) : (
              <div className="py-10 text-center text-xs text-[#8e8e93] italic">
                Extracting details...
              </div>
            )}
          </div>

          {/* Right Column: Cleaner options, summary and privacy report */}
          <div className="space-y-5">
            {/* Show success summary if the image has been cleaned */}
            {activeFile.resultUrl && activeFile.metadataRemovedCount !== undefined && (
              <MetadataSummary
                originalSize={activeFile.size}
                cleanedSize={activeFile.resultSize || 0}
                fieldsRemoved={activeFile.metadataRemovedCount}
              />
            )}

            {/* Privacy Report Card */}
            {activeFile.privacyReport && (
              <div className="bg-[#111112] border border-[#2a2a2d] p-5 rounded-2xl">
                <PrivacyReport report={activeFile.privacyReport} />
              </div>
            )}

            {/* Cleaner Control Panel */}
            <div className="bg-[#111112] border border-[#2a2a2d] p-5 rounded-2xl">
              <MetadataCleaner onClean={handleCleanMetadata} processing={cleaningMetadata} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
