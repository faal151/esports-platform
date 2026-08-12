import { ImageResponse } from "next/og";
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
          background: "#050505",
          color: "#ffffff",
          fontFamily: "Arial",
        }}
      >
        {/* ========================= */}
        {/* NAVBAR */}
        {/* ========================= */}

        <div
          style={{
            height: 82,
            width: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "0 58px",
            borderBottom: "1px solid #181818",
          }}
        >
          {/* Logo */}

          <div
            style={{
              display: "flex",
              alignItems: "center",
              fontSize: 24,
              fontWeight: 900,
              letterSpacing: -0.5,
            }}
          >
            PINTO{" "}
            <span
              style={{
                color: "#ef3333",
                marginLeft: 6,
              }}
            >
              ESPORTS.
            </span>
          </div>

          {/* Navigation */}

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 28,
              fontSize: 14,
              color: "#b5b5b5",
              fontWeight: 600,
            }}
          >
            <span>Tournaments</span>
            <span>Players</span>
            <span>Teams</span>
            <span>Sponsors</span>
          </div>

          {/* Auth */}

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                height: 38,
                padding: "0 19px",
                borderRadius: 7,
                border: "1px solid #292929",
                fontSize: 13,
                fontWeight: 700,
              }}
            >
              Login
            </div>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                height: 38,
                padding: "0 19px",
                borderRadius: 7,
                background: "#e52b2b",
                fontSize: 13,
                fontWeight: 900,
              }}
            >
              SIGN UP
            </div>
          </div>
        </div>

        {/* ========================= */}
        {/* HERO */}
        {/* ========================= */}

        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            padding: "30px 58px 28px",
            position: "relative",
          }}
        >
          {/* Red ambient glow */}

          <div
            style={{
              position: "absolute",
              top: 50,
              left: 440,
              width: 300,
              height: 220,
              background:
                "radial-gradient(circle, rgba(190,20,20,0.12), transparent 70%)",
            }}
          />

          {/* Eyebrow */}

          <div
            style={{
              display: "flex",
              color: "#ef3333",
              fontSize: 13,
              fontWeight: 900,
              letterSpacing: 5,
              marginBottom: 18,
            }}
          >
            LOCAL ESPORTS PLATFORM
          </div>

          {/* Main Heading */}

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              fontSize: 62,
              lineHeight: 0.98,
              fontWeight: 900,
              letterSpacing: -2,
            }}
          >
            <span>YOUR ESPORTS.</span>

            <span
              style={{
                color: "#ef3333",
                marginTop: 3,
              }}
            >
              YOUR LEGACY.
            </span>
          </div>

          {/* Description */}

          <div
            style={{
              display: "flex",
              width: 620,
              marginTop: 22,
              color: "#8994a5",
              fontSize: 17,
              lineHeight: 1.5,
            }}
          >
            Temukan turnamen, bangun tim, dan jadikan perjalanan esports kamu
            sebagai sebuah legacy.
          </div>

          {/* CTA */}

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              marginTop: 25,
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                height: 44,
                padding: "0 25px",
                borderRadius: 7,
                background: "#e52b2b",
                fontSize: 14,
                fontWeight: 900,
              }}
            >
              EXPLORE TOURNAMENTS
            </div>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                height: 44,
                padding: "0 25px",
                borderRadius: 7,
                border: "1px solid #292929",
                fontSize: 14,
                fontWeight: 700,
              }}
            >
              JOIN COMMUNITY
            </div>
          </div>
        </div>

        {/* ========================= */}
        {/* SPONSOR STRIP */}
        {/* ========================= */}

        <div
          style={{
            height: 115,
            width: "100%",
            display: "flex",
            flexDirection: "column",
            padding: "16px 58px 10px",
            borderTop: "1px solid #181818",
          }}
        >
          {/* Sponsor heading */}

          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
              }}
            >
              <span
                style={{
                  color: "#ef3333",
                  fontSize: 9,
                  fontWeight: 900,
                  letterSpacing: 4,
                }}
              >
                SUPPORTED BY
              </span>

              <span
                style={{
                  marginTop: 3,
                  fontSize: 18,
                  fontWeight: 900,
                }}
              >
                OUR SPONSORS
              </span>
            </div>

            <span
              style={{
                color: "#353d48",
                fontSize: 9,
                fontWeight: 900,
                letterSpacing: 3,
              }}
            >
              OFFICIAL PARTNERS
            </span>
          </div>

          {/* Sponsor logos */}

          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-around",
              marginTop: 12,
            }}
          >
            <span
              style={{
                color: "#4760e8",
                fontSize: 31,
                fontWeight: 900,
                letterSpacing: -2,
              }}
            >
              vivo
            </span>

            <span
              style={{
                color: "#eeeeee",
                fontSize: 27,
                fontWeight: 900,
              }}
            >
              3
            </span>

            <span
              style={{
                color: "#c9a73b",
                fontSize: 15,
                fontWeight: 900,
                letterSpacing: 2,
              }}
            >
              SMEA PREMIUM
            </span>

            <span
              style={{
                color: "#4760e8",
                fontSize: 31,
                fontWeight: 900,
                letterSpacing: -2,
              }}
            >
              vivo
            </span>
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}