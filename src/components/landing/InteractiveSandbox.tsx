"use client";

import React, { useState, useRef } from "react";
import { UploadCloud, FileImage, FileText, CheckCircle2, Sparkles, Sliders, Download, Zap } from "lucide-react";

export function InteractiveSandbox() {
  const [file, setFile] = useState<{ name: string; size: number; type: string; previewUrl?: string } | null>(null);
  const [processing, setProcessing] = useState(false);
  const [processed, setProcessed] = useState(false);
  const [compressionRatio, setCompressionRatio] = useState(0);
  const [newSize, setNewSize] = useState(0);
  const [dragActive, setDragActive] = useState(false);
  const [sliderPosition, setSliderPosition] = useState(50);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const processFileDetails = (selectedFile: File) => {
    const isImage = selectedFile.type.startsWith("image/");
    if (isImage) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setFile({
          name: selectedFile.name,
          size: selectedFile.size,
          type: selectedFile.type,
          previewUrl: e.target?.result as string,
        });
        setProcessed(false);
        setProcessing(false);
      };
      reader.readAsDataURL(selectedFile);
    } else {
      setFile({
        name: selectedFile.name,
        size: selectedFile.size,
        type: selectedFile.type,
      });
      setProcessed(false);
      setProcessing(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFileDetails(e.dataTransfer.files[0]);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFileDetails(e.target.files[0]);
    }
  };

  const loadDemo = () => {
    setFile({
      name: "landscape_photo_raw.jpg",
      size: 4850200, // ~4.6 MB
      type: "image/jpeg",
      previewUrl: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80",
    });
    setProcessed(false);
    setProcessing(false);
  };

  const startProcessing = () => {
    if (!file) return;
    setProcessing(true);
    // Simulate high-performance local processing
    setTimeout(() => {
      setProcessing(false);
      setProcessed(true);
      // Random compression between 60% and 80% for demonstration
      const ratio = 0.25 + Math.random() * 0.15; // outputs 25-40% of original size
      const finalSize = Math.round(file.size * ratio);
      setNewSize(finalSize);
      setCompressionRatio(Math.round((1 - ratio) * 100));
    }, 1200);
  };

  const resetSandbox = () => {
    setFile(null);
    setProcessed(false);
    setProcessing(false);
  };

  const formatSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  return (
    <div className="w-full max-w-4xl mx-auto rounded-3xl border border-[#2a2a2d] bg-[#111112]/80 backdrop-blur-md overflow-hidden shadow-2xl relative">
      {/* Visual background gradient element */}
      <div className="absolute -top-12 -left-12 w-40 h-40 bg-[#0a84ff]/10 rounded-full blur-2xl pointer-events-none" />
      <div className="absolute -bottom-12 -right-12 w-40 h-40 bg-[#00c6ff]/10 rounded-full blur-2xl pointer-events-none" />

      {/* Header */}
      <div className="p-6 border-b border-[#2a2a2d] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 text-[11px] font-bold text-[#0a84ff] bg-[#0a84ff]/10 border border-[#0a84ff]/20 rounded-full mb-1">
            <Zap size={10} /> Local Sandbox
          </span>
          <h3 className="text-xl font-bold text-white">Experience Local Processing Speed</h3>
        </div>
        <p className="text-xs text-[#8e8e93] max-w-xs sm:text-right leading-relaxed">
          Drag in an image or try our demo to see our instant browser-only client-side compression.
        </p>
      </div>

      <div className="p-8">
        {!file ? (
          // Dropzone State
          <div
            onDragEnter={handleDrag}
            onDragOver={handleDrag}
            onDragLeave={handleDrag}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer transition-all duration-300 ${
              dragActive
                ? "border-[#0a84ff] bg-[#0a84ff]/5 scale-[0.99]"
                : "border-[#2a2a2d] hover:border-[#8e8e93]/50 hover:bg-[#1c1c1e]/30"
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*,application/pdf"
              className="hidden"
              onChange={handleFileInput}
            />
            <div className="mx-auto w-16 h-16 bg-[#1c1c1e] border border-[#2a2a2d] rounded-2xl flex items-center justify-center text-[#8e8e93] mb-4 group-hover:text-[#0a84ff] transition-colors">
              <UploadCloud size={28} className="text-[#8e8e93]" />
            </div>
            <h4 className="text-base font-bold text-white mb-1">
              Drag & drop your file here, or <span className="text-[#0a84ff] hover:underline">browse</span>
            </h4>
            <p className="text-xs text-[#8e8e93] mb-6">Supports JPEG, PNG, WEBP, and PDF up to 100MB</p>
            <div className="flex justify-center">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  loadDemo();
                }}
                className="px-4 py-2 text-xs font-semibold text-[#ebebf5] bg-[#1c1c1e] hover:bg-[#2c2c2e] border border-[#2a2a2d] rounded-lg transition-colors flex items-center gap-1.5"
              >
                <Sparkles size={12} className="text-[#00c6ff]" /> Try Demo Image
              </button>
            </div>
          </div>
        ) : (
          // Preview & Processing state
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Left Column: File Details */}
            <div className="flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="flex items-center gap-3 p-4 bg-[#1c1c1e] border border-[#2a2a2d] rounded-xl">
                  {file.previewUrl ? (
                    <div className="w-12 h-12 rounded-lg overflow-hidden border border-[#2a2a2d] flex-shrink-0 bg-black/40">
                      <img src={file.previewUrl} alt="Preview" className="w-full h-full object-cover" />
                    </div>
                  ) : (
                    <div className="w-12 h-12 rounded-lg bg-[#1c1c1e] border border-[#2a2a2d] flex items-center justify-center text-[#0a84ff] flex-shrink-0">
                      <FileText size={24} />
                    </div>
                  )}
                  <div className="min-w-0 flex-1">
                    <h4 className="text-sm font-bold text-white truncate">{file.name}</h4>
                    <p className="text-xs text-[#8e8e93]">{file.type || "Unknown type"}</p>
                  </div>
                </div>

                <div className="space-y-3 bg-[#111112] border border-[#2a2a2d] rounded-xl p-4">
                  <div className="flex justify-between text-xs">
                    <span className="text-[#8e8e93]">Original Size:</span>
                    <span className="font-semibold text-white">{formatSize(file.size)}</span>
                  </div>
                  {processed && (
                    <>
                      <div className="flex justify-between text-xs border-t border-[#2a2a2d] pt-3">
                        <span className="text-[#8e8e93]">Optimized Size:</span>
                        <span className="font-bold text-[#30d158]">{formatSize(newSize)}</span>
                      </div>
                      <div className="flex justify-between text-xs border-t border-[#2a2a2d] pt-3">
                        <span className="text-[#8e8e93]">Space Saved:</span>
                        <span className="font-bold text-[#00c6ff]">{compressionRatio}% smaller</span>
                      </div>
                      <div className="flex justify-between text-xs border-t border-[#2a2a2d] pt-3">
                        <span className="text-[#8e8e93]">Processing Time:</span>
                        <span className="font-semibold text-white">0.03 seconds (Local WebAssembly)</span>
                      </div>
                    </>
                  )}
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-4">
                {!processed ? (
                  <button
                    onClick={startProcessing}
                    disabled={processing}
                    className="flex-1 py-3 px-4 bg-[#0a84ff] hover:bg-[#0070e3] disabled:opacity-50 text-white rounded-xl text-sm font-bold transition-colors flex items-center justify-center gap-2"
                  >
                    {processing ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Running Client-Side GPU...
                      </>
                    ) : (
                      <>
                        <Sliders size={16} />
                        Optimize Locally
                      </>
                    )}
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      // Mock download
                      alert("Demo Mode: In a real tool, this exports the compressed asset locally without server uploads!");
                    }}
                    className="flex-1 py-3 px-4 bg-[#30d158] hover:bg-[#28b84e] text-white rounded-xl text-sm font-bold transition-colors flex items-center justify-center gap-2"
                  >
                    <Download size={16} />
                    Download File
                  </button>
                )}
                <button
                  onClick={resetSandbox}
                  disabled={processing}
                  className="py-3 px-4 bg-[#1c1c1e] hover:bg-[#2c2c2e] border border-[#2a2a2d] text-[#ebebf5] rounded-xl text-sm font-bold transition-colors"
                >
                  Reset
                </button>
              </div>
            </div>

            {/* Right Column: Visual Sandbox Demo */}
            <div className="flex flex-col justify-center items-center">
              {file.previewUrl ? (
                <div className="w-full aspect-[4/3] rounded-2xl overflow-hidden border border-[#2a2a2d] bg-black/40 relative select-none">
                  {/* Slider Preview */}
                  <img
                    src={file.previewUrl}
                    alt="Original Image"
                    className="absolute inset-0 w-full h-full object-cover opacity-30 blur-[2px]"
                  />
                  <img
                    src={file.previewUrl}
                    alt="Optimized Image"
                    className="absolute inset-0 w-full h-full object-cover"
                    style={{
                      clipPath: `polygon(0 0, ${sliderPosition}% 0, ${sliderPosition}% 100%, 0 100%)`,
                    }}
                  />

                  {/* Divider Line */}
                  <div
                    className="absolute top-0 bottom-0 w-1 bg-white cursor-ew-resize flex items-center justify-center"
                    style={{ left: `${sliderPosition}%` }}
                  >
                    <div className="w-6 h-6 rounded-full bg-white shadow-lg border border-[#2a2a2d] flex items-center justify-center text-black text-[10px] font-bold">
                      ↔
                    </div>
                  </div>

                  {/* Labels */}
                  <span className="absolute bottom-3 left-3 px-2 py-0.5 bg-black/70 backdrop-blur-xs text-[10px] text-white rounded font-mono">
                    Before (100% Quality)
                  </span>
                  <span className="absolute bottom-3 right-3 px-2 py-0.5 bg-black/70 backdrop-blur-xs text-[10px] text-[#00c6ff] rounded font-mono">
                    After ({processed ? 100 - compressionRatio : 80}% size)
                  </span>

                  {/* Input Range Overlay */}
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={sliderPosition}
                    onChange={(e) => setSliderPosition(Number(e.target.value))}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-ew-resize"
                  />
                </div>
              ) : (
                <div className="w-full aspect-[4/3] rounded-2xl border border-[#2a2a2d]/50 bg-[#111112]/50 flex flex-col items-center justify-center text-center p-6">
                  <FileText size={48} className="text-[#8e8e93]/50 mb-3" />
                  <h5 className="text-sm font-bold text-[#ebebf5] mb-1">Local PDF Structure</h5>
                  <p className="text-xs text-[#8e8e93] max-w-[200px]">
                    PDF objects will be parsed locally in WebAssembly. No network data transfer.
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Security note footer */}
      <div className="px-6 py-4 bg-[#111112]/40 border-t border-[#2a2a2d] flex items-center gap-2 text-[11px] text-[#8e8e93]">
        <CheckCircle2 size={12} className="text-[#30d158]" />
        Your file is processed 100% in your browser. Absolutely zero byte is sent to our servers.
      </div>
    </div>
  );
}
