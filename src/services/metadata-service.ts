// ============================================================
// src/services/metadata-service.ts
// ============================================================

import { exiftool } from "exiftool-vendored";
import * as fs from "fs/promises";
import * as path from "path";
import os from "os";

export interface ParsedMetadata {
  camera: Record<string, string>;
  image: Record<string, string>;
  dates: Record<string, string>;
  location: Record<string, string>;
  author: Record<string, string>;
  software: Record<string, string>;
  other: Record<string, string>;
  raw: Record<string, any>;
  totalFieldsCount: number;
}

export interface PrivacyReport {
  riskLevel: "Low" | "Medium" | "High";
  findings: string[];
  explanation: string;
}

// Write buffer to temp file, perform exiftool action, return result and clean up
async function runWithTempFile<T>(
  buffer: Buffer,
  fileName: string,
  action: (tempFilePath: string) => Promise<T>
): Promise<T> {
  const tempDir = await fs.realpath(os.tmpdir());
  const uniqueName = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}-${fileName}`;
  const tempFilePath = path.join(tempDir, uniqueName);

  try {
    await fs.writeFile(tempFilePath, buffer);
    return await action(tempFilePath);
  } finally {
    try {
      await fs.unlink(tempFilePath);
      // Exiftool sometimes creates a "_original" backup file, clean that up too if it exists
      await fs.unlink(`${tempFilePath}_original`).catch(() => {});
    } catch (e) {
      // Ignore cleanup errors
    }
  }
}

/**
 * Extract all metadata fields and categorize them.
 */
export async function extractMetadata(
  buffer: Buffer,
  fileName: string
): Promise<ParsedMetadata> {
  return runWithTempFile(buffer, fileName, async (tempFilePath) => {
    const rawTags = await exiftool.read(tempFilePath);
    
    const camera: Record<string, string> = {};
    const image: Record<string, string> = {};
    const dates: Record<string, string> = {};
    const location: Record<string, string> = {};
    const author: Record<string, string> = {};
    const software: Record<string, string> = {};
    const other: Record<string, string> = {};

    let totalFieldsCount = 0;

    // Helper to format values nicely
    const formatValue = (val: any): string => {
      if (val === undefined || val === null) return "";
      if (typeof val === "object") {
        if (val.rawValue) return String(val.rawValue);
        return JSON.stringify(val);
      }
      return String(val);
    };

    // Skip internal, binary, or uninteresting fields
    const skipFields = new Set([
      "SourceFile",
      "Directory",
      "FilePermissions",
      "ThumbnailImage",
      "PreviewImage",
      "errors",
      "warnings",
      "exiftoolVersion"
    ]);

    for (const [key, val] of Object.entries(rawTags)) {
      if (skipFields.has(key)) continue;
      
      const formatted = formatValue(val);
      if (!formatted) continue;

      totalFieldsCount++;

      // Camera Info
      if (["Make", "Model", "Lens", "LensModel", "FocalLength", "FNumber", "ExposureTime", "ISO"].includes(key)) {
        camera[key] = formatted;
      } 
      // Image Info
      else if (["ImageWidth", "ImageHeight", "ExifImageWidth", "ExifImageHeight", "ColorSpace", "XResolution", "YResolution", "ResolutionUnit", "BitsPerSample", "FileType", "MimeType"].includes(key)) {
        image[key] = formatted;
      } 
      // Dates
      else if (["CreateDate", "DateTimeOriginal", "ModifyDate", "FileModifyDate", "MetadataDate"].includes(key)) {
        dates[key] = formatted;
      } 
      // Location (GPS)
      else if (key.startsWith("GPS") || ["GPSLatitude", "GPSLongitude", "GPSAltitude", "GPSPosition"].includes(key)) {
        location[key] = formatted;
      } 
      // Author / Creator
      else if (["Artist", "Author", "Creator", "Copyright", "By-line", "Credit", "Source"].includes(key)) {
        author[key] = formatted;
      } 
      // Software / Tool
      else if (["Software", "CreatorTool", "History", "Producer", "Generator"].includes(key)) {
        software[key] = formatted;
      } 
      // Everything else
      else {
        other[key] = formatted;
      }
    }

    return {
      camera,
      image,
      dates,
      location,
      author,
      software,
      other,
      raw: rawTags,
      totalFieldsCount
    };
  });
}

/**
 * Clean specific metadata tags based on options.
 */
export async function cleanMetadata(
  buffer: Buffer,
  fileName: string,
  settings: {
    removeGps: boolean;
    removeAuthor: boolean;
    removeSoftware: boolean;
    removeAll: boolean;
  }
): Promise<{ buffer: Buffer; fieldsRemovedCount: number }> {
  return runWithTempFile(buffer, fileName, async (tempFilePath) => {
    // 1. Get current metadata to calculate fields removed
    const originalMetadata = await exiftool.read(tempFilePath) as any;
    
    // 2. Perform removal actions
    if (settings.removeAll) {
      await exiftool.deleteAllTags(tempFilePath);
    } else {
      const args: string[] = ["-overwrite_original"];
      if (settings.removeGps) {
        args.push("-GPS:all=");
      }
      if (settings.removeAuthor) {
        args.push("-Artist=", "-Author=", "-Creator=", "-Copyright=", "-By-line=", "-Credit=", "-Source=");
      }
      if (settings.removeSoftware) {
        args.push("-Software=", "-CreatorTool=", "-History=", "-Producer=", "-Generator=");
      }
      
      if (args.length > 1) {
        await exiftool.write(tempFilePath, {}, args);
      }
    }

    // 3. Read back cleaned file buffer
    const cleanedBuffer = await fs.readFile(tempFilePath);

    // 4. Calculate how many fields were removed
    const cleanedMetadata = await exiftool.read(tempFilePath) as any;
    let fieldsRemovedCount = 0;
    for (const key of Object.keys(originalMetadata)) {
      if (cleanedMetadata[key] === undefined && originalMetadata[key] !== undefined) {
        fieldsRemovedCount++;
      }
    }

    return {
      buffer: cleanedBuffer,
      fieldsRemovedCount
    };
  });
}

/**
 * Generate privacy risk report based on findings.
 */
export function generatePrivacyReport(metadata: ParsedMetadata): PrivacyReport {
  const findings: string[] = [];
  let riskScore = 0; // 0: low, 1-2: medium, 3+: high

  // GPS check
  const hasGps = Object.keys(metadata.location).length > 0;
  if (hasGps) {
    findings.push("GPS Location Found: Contains geographical coordinates, altitude, and timestamps of where the photo was taken.");
    riskScore += 3;
  }

  // Camera check
  const hasCamera = Object.keys(metadata.camera).length > 0;
  if (hasCamera) {
    findings.push("Camera & Lens Information Found: Includes manufacturer, model, lens profile, focal length, aperture, and ISO settings.");
    riskScore += 1;
  }

  // Author check
  const hasAuthor = Object.keys(metadata.author).length > 0;
  if (hasAuthor) {
    findings.push("Author & Copyright Info Found: Contains creator names, copyright statements, or attribution fields.");
    riskScore += 1.5;
  }

  // Software check
  const hasSoftware = Object.keys(metadata.software).length > 0;
  if (hasSoftware) {
    findings.push("Software & Edit History Found: Discloses specific image editing programs, version numbers, or export profiles used.");
    riskScore += 0.5;
  }

  let riskLevel: "Low" | "Medium" | "High" = "Low";
  let explanation = "No sensitive tracking, attribution, or device metadata was found. The image is safe to share publicly.";

  if (riskScore >= 3) {
    riskLevel = "High";
    explanation = "Critical privacy risk detected! Geographical coordinates are embedded in this file. Anyone downloading this image can extract the exact physical location of where this photo was captured.";
  } else if (riskScore > 0) {
    riskLevel = "Medium";
    explanation = "Moderate privacy risk. The image contains device models, owner attribution, or creation timestamps. While it does not trace physical locations, it leaks personal attribution and equipment configurations.";
  }

  return {
    riskLevel,
    findings,
    explanation
  };
}
