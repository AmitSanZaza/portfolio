import { ImageResponse } from "next/og";
import { getProfileContent } from "@/lib/profile-content";

// Preview image shown when the site is shared (LinkedIn, Slack, X, …).
// Colors follow the light theme in DESIGN.md (kraft canvas, ink, lake accent).
export const alt = "Amit Barua, portfolio";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpengraphImage() {
  const { name, headline } = await getProfileContent();

  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        padding: "80px",
        background: "#ebe5dc",
        color: "#1a1917",
      }}
    >
      <div
        style={{
          fontSize: 26,
          letterSpacing: 4,
          textTransform: "uppercase",
          color: "#66625d",
          marginBottom: 28,
        }}
      >
        {`${name} · Portfolio`}
      </div>
      <div style={{ fontSize: 96, lineHeight: 1.05, maxWidth: 1000 }}>
        {headline}
      </div>
      <div
        style={{
          width: 120,
          height: 6,
          background: "#2b59d1",
          marginTop: 48,
        }}
      />
    </div>,
    size,
  );
}
