import { ImageResponse } from "next/og";

export const alt = "Outfit Roaster - Upload je outfit. Krijg je verdict.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px",
          color: "white",
          background:
            "radial-gradient(circle at 82% 18%, rgba(255,106,0,.55), transparent 30%), linear-gradient(135deg, #17100b, #050505 60%)",
          fontFamily: "Arial, sans-serif",
        }}
      >
        <div style={{ display: "flex", fontSize: 34, fontWeight: 900 }}>
          Outfit <span style={{ color: "#ff6a00", marginLeft: 10 }}>Roaster</span>
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ color: "#fdba74", fontSize: 24, fontWeight: 800 }}>
            Nederlandse AI-outfitcheck met humor
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              marginTop: 24,
              fontSize: 78,
              lineHeight: 1.02,
              fontWeight: 900,
              letterSpacing: "-3px",
            }}
          >
            <span>Upload je outfit.</span>
            <span>Krijg je verdict.</span>
          </div>
          <div style={{ marginTop: 30, fontSize: 28, color: "#d4d4d8" }}>
            Eerlijk, scherp en zonder bodyshaming.
          </div>
        </div>
      </div>
    ),
    size,
  );
}
