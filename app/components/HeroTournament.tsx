"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

const tournaments = [
  {
    game: "Mobile Legends",
    title: "Local Championship",
    date: "20 AUG 2026",
    location: "Takengon",
    prize: "Rp 5.000.000",
    description:
      "Tournament lokal untuk para pemain kompetitif. Bangun nama dan buktikan kemampuanmu di arena.",
    image: "/images/mobile-legends.jpg",
    href: "/tournaments",
  },
  {
    game: "PUBG Mobile",
    title: "Community Battle",
    date: "24 AUG 2026",
    location: "Takengon",
    prize: "Rp 3.000.000",
    description:
      "Pertarungan squad terbaik untuk membangun pengalaman dan competitive record.",
    image: "/images/pubg-mobile.jpg",
    href: "/tournaments",
  },
  {
    game: "Valorant",
    title: "City Open",
    date: "30 AUG 2026",
    location: "Takengon",
    prize: "Rp 2.500.000",
    description:
      "Bawa roster terbaikmu dan jadilah bagian dari competitive scene lokal.",
    image: "/images/valorant.jpg",
    href: "/tournaments",
  },
];

export default function HeroTournament() {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActive((current) => (current + 1) % tournaments.length);
    }, 7000);

    return () => clearInterval(timer);
  }, []);

  const tournament = tournaments[active];

  return (
    <section className="relative min-h-[calc(100vh-128px)] overflow-hidden border-b border-white/10 bg-black">

      {/* =====================================================
          BACKGROUND
      ===================================================== */}

      {tournaments.map((item, index) => (
        <div
          key={item.title}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            index === active ? "opacity-100" : "opacity-0"
          }`}
        >
          <Image
            src={item.image}
            alt=""
            fill
            priority={index === 0}
            sizes="100vw"
            className="object-cover object-center"
          />
        </div>
      ))}


      {/* =====================================================
          BACKGROUND TREATMENT
      ===================================================== */}

      <div className="absolute inset-0 bg-black/25" />

      <div className="absolute inset-0 bg-gradient-to-r from-black via-black/70 to-black/10" />

      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20" />

      <div className="absolute inset-0 bg-[radial-gradient(circle_at_72%_45%,rgba(255,30,30,0.22),transparent_35%)]" />


      {/* =====================================================
          CONTENT
      ===================================================== */}

      <div className="relative z-10 flex min-h-[calc(100vh-128px)] items-center">

        <div className="mx-auto w-full max-w-7xl px-6 py-20 sm:px-10 lg:px-14 xl:px-20">

          <div className="max-w-[650px]">

            {/* LABEL */}

            <div className="flex items-center gap-3">

              <span className="h-2 w-2 rounded-full bg-red-500 shadow-[0_0_15px_rgba(255,30,30,0.8)]" />

              <span className="text-xs font-black uppercase tracking-[0.35em] text-red-500">
                Featured Tournament
              </span>

            </div>


            {/* GAME */}

            <p className="mt-7 text-sm font-black uppercase tracking-[0.25em] text-white/60">
              {tournament.game}
            </p>


            {/* TITLE */}

            <h1 className="mt-3 text-5xl font-black uppercase leading-[0.9] tracking-[-0.04em] text-white sm:text-6xl lg:text-7xl xl:text-8xl">
              {tournament.title}
            </h1>


            {/* DESCRIPTION */}

            <p className="mt-7 max-w-xl text-base leading-7 text-white/65 sm:text-lg">
              {tournament.description}
            </p>


            {/* =================================================
                PRIZE POOL
            ================================================= */}

            <div className="mt-9">

              <p className="text-[10px] font-black uppercase tracking-[0.35em] text-red-500">
                Prize Pool
              </p>

              <div className="mt-1 text-4xl font-black tracking-tight text-white sm:text-5xl lg:text-6xl">
                {tournament.prize}
              </div>

            </div>


            {/* =================================================
                META
            ================================================= */}

            <div className="mt-7 flex flex-wrap gap-x-8 gap-y-3">

              <div>
                <p className="text-[9px] font-black uppercase tracking-[0.2em] text-white/35">
                  Tournament Date
                </p>

                <p className="mt-1 text-sm font-bold text-white">
                  {tournament.date}
                </p>
              </div>

              <div>
                <p className="text-[9px] font-black uppercase tracking-[0.2em] text-white/35">
                  Location
                </p>

                <p className="mt-1 text-sm font-bold text-white">
                  {tournament.location}
                </p>
              </div>

            </div>


            {/* =================================================
                BUTTONS
            ================================================= */}

            <div className="mt-9 flex flex-wrap gap-3">

              <Link
                href={tournament.href}
                className="rounded-lg bg-red-600 px-7 py-3.5 text-sm font-black uppercase tracking-wide text-white transition hover:bg-red-500 hover:shadow-[0_0_30px_rgba(255,30,30,0.35)]"
              >
                View Tournament
              </Link>

              <Link
                href="/tournaments"
                className="rounded-lg border border-white/20 bg-black/30 px-7 py-3.5 text-sm font-black uppercase tracking-wide text-white backdrop-blur-sm transition hover:border-white/40 hover:bg-white/5"
              >
                All Tournaments
              </Link>

            </div>


            {/* =================================================
                SLIDER INDICATOR
            ================================================= */}

            <div className="mt-12 flex items-center gap-2">

              {tournaments.map((item, index) => (
                <button
                  key={item.title}
                  type="button"
                  aria-label={`Show ${item.title}`}
                  onClick={() => setActive(index)}
                  className={`h-1.5 rounded-full transition-all duration-500 ${
                    active === index
                      ? "w-12 bg-red-500"
                      : "w-5 bg-white/25 hover:bg-white/50"
                  }`}
                />
              ))}

              <span className="ml-3 text-[10px] font-bold uppercase tracking-widest text-white/30">
                {String(active + 1).padStart(2, "0")} /{" "}
                {String(tournaments.length).padStart(2, "0")}
              </span>

            </div>

          </div>

        </div>

      </div>

    </section>
  );
}