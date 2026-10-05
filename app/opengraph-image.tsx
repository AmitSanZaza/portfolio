import { ImageResponse } from "next/og";
import { getProfileContent } from "@/lib/profile-content";

// Preview image shown when the site is shared (LinkedIn, Slack, X, …).
export const alt = "Portfolio preview";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpengraphImage() {
  const { name, tagline } = await getProfileContent();

  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        padding: "80px",
        background: "#0a0a0a",
        color: "#ededed",
      }}
    >
      <div style={{ fontSize: 28, color: "#a1a1aa", marginBottom: 24 }}>
        Portfolio
      </div>
      <div style={{ fontSize: 88, fontWeight: 700, letterSpacing: -2 }}>
        {name}
      </div>
      <div
        style={{
          fontSize: 36,
          color: "#d4d4d8",
          marginTop: 24,
          maxWidth: 900,
          lineHeight: 1.3,
        }}
      >
        {tagline}
      </div>
    </div>,
    size,
  );
}
