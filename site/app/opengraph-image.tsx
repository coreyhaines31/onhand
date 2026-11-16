import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";

export const alt = "On Hand — free, open-source clipboard manager for Mac";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const brush =
  "repeating-linear-gradient(0deg, rgba(255,255,255,.22) 0px, rgba(255,255,255,.22) 1px, rgba(0,0,0,.035) 1px, rgba(0,0,0,.035) 2px, transparent 2px, transparent 3px), linear-gradient(100deg, rgba(255,255,255,0) 18%, rgba(255,255,255,.5) 40%, rgba(255,255,255,0) 64%), linear-gradient(180deg, #e7e8e9, #c3c5c7)";

function Screw({ left, top }: { left: number; top: number }) {
  return (
    <div
      style={{
        position: "absolute",
        left,
        top,
        width: 14,
        height: 14,
        borderRadius: 7,
        background: "radial-gradient(circle at 40% 35%, #fff, #b9bbbd 45%, #77797b 80%)",
      }}
    />
  );
}

export default async function OpengraphImage() {
  const [display, light, body, icon] = await Promise.all([
    readFile(join(process.cwd(), "assets/fonts/BarlowSemiCondensed-SemiBold.ttf")),
    readFile(join(process.cwd(), "assets/fonts/BarlowSemiCondensed-Light.ttf")),
    readFile(join(process.cwd(), "assets/fonts/Barlow-Medium.ttf")),
    readFile(join(process.cwd(), "assets/on-hand-icon-512.png")),
  ]);
  const iconSrc = `data:image/png;base64,${icon.toString("base64")}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 80px",
          color: "#161616",
          background: brush,
          fontFamily: "Barlow",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", width: 650 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              alignSelf: "flex-start",
              gap: 14,
              background: "#1b1b1b",
              color: "#d8d9da",
              padding: "10px 18px 10px 14px",
              borderRadius: 3,
              fontFamily: "Barlow Semi Condensed",
              fontWeight: 600,
              fontSize: 20,
              letterSpacing: 5,
              textTransform: "uppercase",
            }}
          >
            <div
              style={{
                width: 11,
                height: 11,
                borderRadius: 6,
                background: "#b43a9e",
                boxShadow: "0 0 8px #b43a9e",
              }}
            />
            On Hand · Free for Mac
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              marginTop: 34,
              fontFamily: "Barlow Semi Condensed",
              fontSize: 108,
              lineHeight: 0.95,
            }}
          >
            <div style={{ fontWeight: 600 }}>Copy it once.</div>
            <div style={{ fontWeight: 300 }}>Find it again.</div>
          </div>
          <div style={{ fontSize: 30, color: "#3d3f41", marginTop: 34 }}>
            Free, open-source clipboard manager for Mac
          </div>
        </div>
        <div
          style={{
            position: "relative",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: 380,
            height: 380,
            borderRadius: 18,
            background: "#1b1b1b",
            boxShadow: "0 0 0 1px rgba(0,0,0,.5)",
          }}
        >
          <Screw left={16} top={16} />
          <Screw left={350} top={16} />
          <Screw left={16} top={350} />
          <Screw left={350} top={350} />
          <img src={iconSrc} width={290} height={290} alt="" />
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: "Barlow Semi Condensed", data: display, weight: 600, style: "normal" },
        { name: "Barlow Semi Condensed", data: light, weight: 300, style: "normal" },
        { name: "Barlow", data: body, weight: 500, style: "normal" },
      ],
    },
  );
}
