import { ImageResponse } from "next/og";

export const runtime = "edge";

export const alt = "PINTO ESPORTS.";
export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "70px",
          background: "#050505",
          color: "white",
        }}
      >
        <div
          style={{
            fontSize: 28,
            fontWeight: 800,
            letterSpacing: 8,
            color: "#ef4444",
          }}
        >
          PINTO ESPORTS.
        </div>

        <div
          style={{
            marginTop: 30,
            fontSize: 64,
            fontWeight: 900,
            lineHeight: 1,
          }}
        >
          COMPETITIVE
        </div>

        <div
          style={{
            fontSize: 64,
            fontWeight: 900,
            lineHeight: 1,
          }}
        >
          ESPORTS PLATFORM
        </div>

        <div
          style={{
            marginTop: 35,
            fontSize: 24,
            color: "#888888",
          }}
        >
          PLAYERS • SQUADS • TOURNAMENTS
        </div>

        <div
          style={{
            position: "absolute",
            right: 70,
            bottom: 55,
            width: 120,
            height: 6,
            background: "#ef4444",
          }}
        />
      </div>
    ),
    {
      ...size,
    }
  );
}