// ============================================================
// src/components/image-tools/DownloadSection.tsx
// ============================================================

"use client";

import React, { useState } from "react";
import { useImageToolsStore } from "@/store/image-tools-store";
import { ImageFile } from "@/types/image-tools";
import { Download, FolderArchive, Loader2 } from "lucide-react";
import JSZip from "jszip";

export function DownloadSection() {
  const { files } = useImageToolsStore();
  const [zipping, setZipping] = useState(false);

  const successfulFiles = files.filter((f) => f.status === "success" && f.resultUrl);

  if (successfulFiles.length === 0) return null;

  const downloadFile = (file: ImageFile) => {
    if (!file.resultUrl) return;

    const link = document.createElement("a");
    link.href = file.resultUrl;
    
    // Extract base name and result format extension
    const dotIdx = file.name.lastIndexOf(".");
    const baseName = dotIdx !== -1 ? file.name.substring(0, dotIdx) : file.name;
    const format = file.resultType?.split("/")[1] || "png";
    
    link.download = `${baseName}_processed.${format}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const downloadAllAsZip = async () => {
    if (successfulFiles.length === 0) return;
    setZipping(true);

    try {
      const zip = new JSZip();

      for (const file of successfulFiles) {
        if (!file.resultUrl) continue;

        const response = await fetch(file.resultUrl);
        const blob = await response.blob();

        const dotIdx = file.name.lastIndexOf(".");
        const baseName = dotIdx !== -1 ? file.name.substring(0, dotIdx) : file.name;
        const format = file.resultType?.split("/")[1] || "png";

        zip.file(`${baseName}_processed.${format}`, blob);
      }

      const zipContent = await zip.generateAsync({ type: "blob" });
      const zipUrl = URL.createObjectURL(zipContent);

      const link = document.createElement("a");
      link.href = zipUrl;
      link.download = "pdfcraft_processed_images.zip";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(zipUrl);
    } catch (err) {
      console.error("Error creating ZIP file: ", err);
    } finally {
      setZipping(false);
    }
  };

  return (
    <div className="flex flex-col sm:flex-row gap-3 mt-4">
      {successfulFiles.length === 1 ? (
        <button
          onClick={() => downloadFile(successfulFiles[0])}
          className="flex-1 flex items-center justify-center gap-2 px-6 py-3 font-semibold text-white bg-[#0a84ff] hover:bg-[#0070e3] active:scale-98 rounded-xl transition-all shadow-md shadow-[#0a84ff]/25"
        >
          <Download size={18} />
          Download Processed Image
        </button>
      ) : (
        <>
          <button
            onClick={downloadAllAsZip}
            disabled={zipping}
            className="flex-1 flex items-center justify-center gap-2 px-6 py-3 font-semibold text-white bg-[#0a84ff] hover:bg-[#0070e3] disabled:opacity-50 disabled:cursor-not-allowed active:scale-98 rounded-xl transition-all shadow-md shadow-[#0a84ff]/25"
          >
            {zipping ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                Creating ZIP...
              </>
            ) : (
              <>
                <FolderArchive size={18} />
                Download All as ZIP
              </>
            )}
          </button>

          <div className="flex flex-col gap-1.5 w-full sm:w-auto">
            {successfulFiles.map((file) => (
              <button
                key={file.id}
                onClick={() => downloadFile(file)}
                className="px-4 py-2 text-[12px] font-semibold text-[#8e8e93] hover:text-white bg-[#1c1c1e] hover:bg-[#2c2c2e] border border-[#2a2a2d] rounded-lg transition-colors truncate max-w-[200px]"
                title={`Download ${file.name}`}
              >
                Download {file.name.substring(0, 15)}...
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
