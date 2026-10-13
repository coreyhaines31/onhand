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
          <svg width="72" height="72" viewBox="0 0 64 64" fill="none" stroke="#38455c" strokeWidth="4.4"
            strokeLinecap="round" strokeLinejoin="round">
            <path transform="rotate(40 32 32)" d="M23 47V20a9 9 0 0 1 18 0v25a6.5 6.5 0 0 1-13 0V24a4 4 0 0 1 8 0v15" />
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
