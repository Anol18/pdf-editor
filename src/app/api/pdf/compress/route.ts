// ============================================================
// app/api/pdf/compress/route.ts
// Optional server-side compression endpoint
// Use this if you want to offload heavy compression to the server
// ============================================================

import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";
export const maxDuration = 60; // 60 second timeout

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const quality = Number(formData.get("quality") ?? 0.75);

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    if (file.type !== "application/pdf") {
      return NextResponse.json({ error: "File must be a PDF" }, { status: 400 });
    }

    if (file.size > 50 * 1024 * 1024) {
      return NextResponse.json({ error: "File too large (max 50MB)" }, { status: 400 });
    }

    // Server-side: use pdf-lib for metadata stripping & stream optimization
    const { PDFDocument } = await import("pdf-lib");
    const arrayBuffer = await file.arrayBuffer();
    const pdfDoc = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true });

    // Strip metadata to reduce size
    pdfDoc.setTitle("");
    pdfDoc.setAuthor("");
    pdfDoc.setSubject("");
    pdfDoc.setKeywords([]);
    pdfDoc.setProducer("PDF Tools");
    pdfDoc.setCreator("PDF Tools");

    const pdfBytes = await pdfDoc.save({
      useObjectStreams: true,     // Compress object streams
      addDefaultPage: false,
      objectsPerTick: 50,
    });

    return new NextResponse(Buffer.from(pdfBytes), {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="compressed.pdf"`,
        "Content-Length": String(pdfBytes.byteLength),
      },
    });
  } catch (err) {
    console.error("PDF compress error:", err);
    return NextResponse.json({ error: "Compression failed" }, { status: 500 });
  }
}

// ============================================================
// Usage from client:
//
// const formData = new FormData();
// formData.append("file", pdfFile);
// formData.append("quality", "0.75");
//
// const res = await fetch("/api/pdf/compress", {
//   method: "POST",
//   body: formData,
// });
// const blob = await res.blob();
// const url = URL.createObjectURL(blob);
// ============================================================
