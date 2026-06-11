// ============================================================
// src/store/image-tools-store.ts
// ============================================================

import { create } from "zustand";
import {
  ImageToolType,
  ImageFile,
  ConvertSettings,
  CompressSettings,
  ResizeSettings,
  CropSettings,
  RotateSettings,
  WatermarkSettings,
  BackgroundRemovalSettings,
  UpscaleSettings,
  MetadataSettings,
} from "@/types/image-tools";

interface ImageToolsState {
  activeTool: ImageToolType;
  files: ImageFile[];
  
  convertSettings: ConvertSettings;
  compressSettings: CompressSettings;
  resizeSettings: ResizeSettings;
  cropSettings: CropSettings;
  rotateSettings: RotateSettings;
  watermarkSettings: WatermarkSettings;
  bgRemovalSettings: BackgroundRemovalSettings;
  upscaleSettings: UpscaleSettings;
  metadataSettings: MetadataSettings;

  setActiveTool: (tool: ImageToolType) => void;
  addFiles: (newFiles: File[]) => void;
  removeFile: (id: string) => void;
  clearAll: () => void;
  updateFile: (id: string, updates: Partial<ImageFile>) => void;
  
  updateConvertSettings: (settings: Partial<ConvertSettings>) => void;
  updateCompressSettings: (settings: Partial<CompressSettings>) => void;
  updateResizeSettings: (settings: Partial<ResizeSettings>) => void;
  updateCropSettings: (settings: Partial<CropSettings>) => void;
  updateRotateSettings: (settings: Partial<RotateSettings>) => void;
  updateWatermarkSettings: (settings: Partial<WatermarkSettings>) => void;
  updateBgRemovalSettings: (settings: Partial<BackgroundRemovalSettings>) => void;
  updateUpscaleSettings: (settings: Partial<UpscaleSettings>) => void;
  updateMetadataSettings: (settings: Partial<MetadataSettings>) => void;
}

const initialConvertSettings: ConvertSettings = {
  targetFormat: "png",
  quality: 80,
};

const initialCompressSettings: CompressSettings = {
  quality: 75,
};

const initialResizeSettings: ResizeSettings = {
  width: 800,
  height: 600,
  lockAspectRatio: true,
  presetId: "custom",
};

const initialCropSettings: CropSettings = {
  aspect: "free",
};

const initialRotateSettings: RotateSettings = {
  angle: 0,
  flipH: false,
  flipV: false,
};

const initialWatermarkSettings: WatermarkSettings = {
  type: "text",
  text: "PDFCraft Pro",
  fontSize: 24,
  color: "#ffffff",
  opacity: 0.5,
  position: "bottom-right",
  imageWatermarkWidth: 20,
};

const initialBgRemovalSettings: BackgroundRemovalSettings = {
  transparent: true,
};

const initialUpscaleSettings: UpscaleSettings = {
  scale: 2,
  provider: "mock",
};

const initialMetadataSettings: MetadataSettings = {
  removeGps: false,
  removeAuthor: false,
  removeSoftware: false,
  removeAll: true,
};

export const useImageToolsStore = create<ImageToolsState>((set, get) => ({
  activeTool: "convert",
  files: [],

  convertSettings: initialConvertSettings,
  compressSettings: initialCompressSettings,
  resizeSettings: initialResizeSettings,
  cropSettings: initialCropSettings,
  rotateSettings: initialRotateSettings,
  watermarkSettings: initialWatermarkSettings,
  bgRemovalSettings: initialBgRemovalSettings,
  upscaleSettings: initialUpscaleSettings,
  metadataSettings: initialMetadataSettings,

  setActiveTool: (tool) => set({ activeTool: tool }),

  addFiles: (newFiles) => {
    const formattedFiles: ImageFile[] = newFiles.map((file) => {
      const id = Math.random().toString(36).substring(2, 9);
      const url = URL.createObjectURL(file);
      
      return {
        id,
        name: file.name,
        size: file.size,
        type: file.type,
        url,
        file,
        status: "idle",
        progress: 0,
      };
    });

    // For files, we fetch their dimensions asynchronously
    formattedFiles.forEach((fileItem, idx) => {
      if (typeof window !== "undefined") {
        const img = new Image();
        img.onload = () => {
          set((state) => ({
            files: state.files.map((f) =>
              f.id === fileItem.id
                ? { ...f, width: img.naturalWidth, height: img.naturalHeight }
                : f
            ),
          }));
        };
        img.src = fileItem.url;
      }
    });

    set((state) => ({
      files: [...state.files, ...formattedFiles],
    }));
  },

  removeFile: (id) => {
    const file = get().files.find((f) => f.id === id);
    if (file) {
      URL.revokeObjectURL(file.url);
      if (file.resultUrl && file.resultUrl.startsWith("blob:")) {
        URL.revokeObjectURL(file.resultUrl);
      }
    }
    set((state) => ({
      files: state.files.filter((f) => f.id !== id),
    }));
  },

  clearAll: () => {
    get().files.forEach((file) => {
      URL.revokeObjectURL(file.url);
      if (file.resultUrl && file.resultUrl.startsWith("blob:")) {
        URL.revokeObjectURL(file.resultUrl);
      }
    });
    set({ files: [] });
  },

  updateFile: (id, updates) =>
    set((state) => ({
      files: state.files.map((f) => (f.id === id ? { ...f, ...updates } : f)),
    })),

  updateConvertSettings: (settings) =>
    set((state) => ({
      convertSettings: { ...state.convertSettings, ...settings },
    })),

  updateCompressSettings: (settings) =>
    set((state) => ({
      compressSettings: { ...state.compressSettings, ...settings },
    })),

  updateResizeSettings: (settings) =>
    set((state) => ({
      resizeSettings: { ...state.resizeSettings, ...settings },
    })),

  updateCropSettings: (settings) =>
    set((state) => ({
      cropSettings: { ...state.cropSettings, ...settings },
    })),

  updateRotateSettings: (settings) =>
    set((state) => ({
      rotateSettings: { ...state.rotateSettings, ...settings },
    })),

  updateWatermarkSettings: (settings) =>
    set((state) => ({
      watermarkSettings: { ...state.watermarkSettings, ...settings },
    })),

  updateBgRemovalSettings: (settings) =>
    set((state) => ({
      bgRemovalSettings: { ...state.bgRemovalSettings, ...settings },
    })),

  updateUpscaleSettings: (settings) =>
    set((state) => ({
      upscaleSettings: { ...state.upscaleSettings, ...settings },
    })),

  updateMetadataSettings: (settings) =>
    set((state) => ({
      metadataSettings: { ...state.metadataSettings, ...settings },
    })),
}));
