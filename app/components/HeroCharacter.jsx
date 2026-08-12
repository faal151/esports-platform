"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

export default function HeroCharacter() {
  const [mouse, setMouse] = useState({
    x: 0,
    y: 0,
  });

  useEffect(() => {
    const handleMouseMove = (event) => {
      const x =
        (event.clientX / window.innerWidth - 0.5) * 2;

      const y =
        (event.clientY / window.innerHeight - 0.5) * 2;

      setMouse({
        x,
        y,
      });
    };

    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return (
    <div className="relative flex h-[520px] w-full items-center justify-center overflow-visible">

      {/* ========================================= */}
      {/* RED AMBIENT GLOW */}
      {/* ========================================= */}

      <div
        className="
          absolute
          right-[8%]
          top-1/2
          h-[380px]
          w-[380px]
          -translate-y-1/2
          rounded-full
          bg-red-600/10
          blur-[100px]
        "
      />

      <div
        className="
          absolute
          right-[15%]
          top-[48%]
          h-[220px]
          w-[220px]
          -translate-y-1/2
          rounded-full
          bg-red-500/10
          blur-[70px]
        "
      />

      {/* ========================================= */}
      {/* PARTICLE 1 */}
      {/* ========================================= */}

      <span
        className="
          absolute
          right-[18%]
          top-[18%]
          h-1
          w-1
          rounded-full
          bg-red-500
          shadow-[0_0_15px_rgba(239,68,68,0.9)]
          animate-pulse
        "
      />

      {/* ========================================= */}
      {/* PARTICLE 2 */}
      {/* ========================================= */}

      <span
        className="
          absolute
          right-[7%]
          top-[42%]
          h-2
          w-2
          rounded-full
          bg-red-500/70
          shadow-[0_0_18px_rgba(239,68,68,0.8)]
          animate-pulse
        "
      />

      {/* ========================================= */}
      {/* PARTICLE 3 */}
      {/* ========================================= */}

      <span
        className="
          absolute
          right-[32%]
          top-[26%]
          h-1.5
          w-1.5
          rounded-full
          bg-red-400/80
          shadow-[0_0_14px_rgba(248,113,113,0.8)]
          animate-pulse
        "
      />

      {/* ========================================= */}
      {/* PARTICLE 4 */}
      {/* ========================================= */}

      <span
        className="
          absolute
          bottom-[18%]
          right-[24%]
          h-1
          w-1
          rounded-full
          bg-red-500
          shadow-[0_0_15px_rgba(239,68,68,0.9)]
          animate-pulse
        "
      />

      {/* ========================================= */}
      {/* CHARACTER */}
      {/* ========================================= */}

      <div
        className="
          relative
          z-10
          animate-hero-float
          transition-transform
          duration-300
          ease-out
        "
        style={{
          transform: `translate3d(
            ${mouse.x * 10}px,
            ${mouse.y * 7}px,
            0
          )`,
        }}
      >
        <Image
          src="/images/pinto-character.png"
          alt="PINTO Esports character"
          width={700}
          height={700}
          priority
          className="
            relative
            h-[560px]
            w-[560px]
            object-contain
            drop-shadow-[0_0_35px_rgba(239,68,68,0.22)]
            transition-all
            duration-500
            hover:scale-[1.025]
            hover:drop-shadow-[0_0_55px_rgba(239,68,68,0.35)]
          "
        />
      </div>

      {/* ========================================= */}
      {/* DECORATIVE RED LINE */}
      {/* ========================================= */}

      <div
        className="
          absolute
          bottom-[12%]
          right-[8%]
          h-px
          w-44
          bg-gradient-to-r
          from-transparent
          via-red-500/70
          to-transparent
        "
      />

      {/* ========================================= */}
      {/* PINTO LABEL */}
      {/* ========================================= */}

      <div
        className="
          absolute
          bottom-[9%]
          right-[8%]
          z-20
          text-[9px]
          font-black
          uppercase
          tracking-[0.3em]
          text-red-500/70
        "
      >
        PINTO COMPETITIVE
      </div>

    </div>
  );
}