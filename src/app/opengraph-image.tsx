import { ImageResponse } from "next/og";

export const runtime = "nodejs";

export const alt = "CraftKit Pro — Free Online PDF Editor, Image Studio & Media Toolkit";
export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          justifyContent: "space-between",
          backgroundColor: "#0a0a0a",
          padding: "80px",
          fontFamily: "sans-serif",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Glow Effects */}
        <div
          style={{
            position: "absolute",
            top: "-100px",
            right: "-100px",
            width: "500px",
            height: "500px",
            borderRadius: "50%",
            background: "rgba(10, 132, 255, 0.25)",
            filter: "blur(120px)",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: "-100px",
            left: "-100px",
            width: "500px",
            height: "500px",
            borderRadius: "50%",
            background: "rgba(0, 198, 255, 0.25)",
            filter: "blur(120px)",
          }}
        />

        {/* Top Badge */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            padding: "8px 20px",
            borderRadius: "999px",
            backgroundColor: "rgba(10, 132, 255, 0.15)",
            border: "1px solid rgba(10, 132, 255, 0.3)",
            color: "#0a84ff",
            fontSize: "20px",
            fontWeight: 600,
          }}
        >
          <span>⚡ 100% Privacy-First Client-Side Suite</span>
        </div>

        {/* Main Title & Subtitle */}
        <div style={{ display: "flex", flexDirection: "column", gap: "20px", zIndex: 10 }}>
          <h1
            style={{
              fontSize: "64px",
              fontWeight: 900,
              color: "#ffffff",
              margin: 0,
              lineHeight: 1.1,
              letterSpacing: "-0.03em",
            }}
          >
            CraftKit Pro
          </h1>
          <p
            style={{
              fontSize: "30px",
              color: "#8e8e93",
              margin: 0,
              maxWidth: "900px",
              lineHeight: 1.4,
            }}
          >
            Free Browser PDF Editor, Image Studio & Media Toolkit. Zero Server Uploads.
          </p>
        </div>

        {/* Bottom Feature Tags */}
        <div style={{ display: "flex", gap: "20px", zIndex: 10 }}>
          <div
            style={{
              padding: "12px 24px",
              borderRadius: "14px",
              backgroundColor: "#1c1c1e",
              border: "1px solid #2a2a2d",
              color: "#ebebf5",
              fontSize: "20px",
              fontWeight: 600,
            }}
          >
            📄 PDF Editor & Annotator
          </div>
          <div
            style={{
              padding: "12px 24px",
              borderRadius: "14px",
              backgroundColor: "#1c1c1e",
              border: "1px solid #2a2a2d",
              color: "#ebebf5",
              fontSize: "20px",
              fontWeight: 600,
            }}
          >
            🖼️ AI Image Tools & BG Remover
          </div>
          <div
            style={{
              padding: "12px 24px",
              borderRadius: "14px",
              backgroundColor: "#1c1c1e",
              border: "1px solid #2a2a2d",
              color: "#ebebf5",
              fontSize: "20px",
              fontWeight: 600,
            }}
          >
            🔒 100% Offline & Free
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
