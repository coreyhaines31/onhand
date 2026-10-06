import { ImageResponse } from "next/og";

export const alt = "On Hand — free, open-source clipboard manager for Mac";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 80,
          color: "#1d1d1f",
          background:
            "radial-gradient(ellipse 70% 90% at 95% 10%, #dbe9fa, rgba(219, 233, 250, 0) 75%), #f9fafc",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 20, fontSize: 40, fontWeight: 600 }}>
          <svg width="72" height="72" viewBox="0 0 64 64" fill="#38455c">
            <path d="M23 20L40 12C42 11 44 12 45 15L48 25C49 28 47 30 44 29L24 27C20 27 19 22 23 20Z" />
            <path d="M18 23C15 23 13 25 13 29V38C13 49 20 54 31 54H33C44 54 51 49 51 38V29C51 28 51 27 50 26C52 31 48 33 44 32L23 30C19 30 16 27 18 23Z" />
          </svg>
          On Hand
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 92, fontWeight: 700, letterSpacing: -4, lineHeight: 1.05 }}>
            Copy it once.
          </div>
          <div style={{ fontSize: 92, fontWeight: 700, letterSpacing: -4, lineHeight: 1.05, color: "#4a6283" }}>
            Find it again.
          </div>
          <div style={{ fontSize: 34, color: "#626773", marginTop: 32 }}>
            Free, open-source clipboard manager for Mac
          </div>
        </div>
      </div>
    ),
    size,
  );
}
