"use client";

import Image from "next/image";

type Sponsor = {
  name: string;
  logo: string;
};

const sponsors: Sponsor[] = [
  {
    name: "VIVO",
    logo: "/sponsors/vivo.webp",
  },
  {
    name: "TRI",
    logo: "/sponsors/tri.png",
  },
  {
    name: "SMEA PREMIUM TAKENGON",
    logo: "/sponsors/smea-premium.jpeg",
  },
  {
    name: "MAMIN SELULER",
    logo: "/sponsors/mamin-seluler.png",
  },
];

export default function SponsorCarousel() {
  /*
   * Duplikasi sponsor supaya animasi bisa
   * berjalan terus tanpa jeda.
   */
  const marqueeSponsors = [
    ...sponsors,
    ...sponsors,
    ...sponsors,
  ];

  return (
    <section className="overflow-hidden border-y border-white/10 bg-[#080808] py-10">

      <div className="mx-auto max-w-7xl px-6">

        {/* ========================= */}
        {/* HEADER */}
        {/* ========================= */}

        <div className="mb-8 flex items-end justify-between">

          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-red-500">
              Supported By
            </p>

            <h2 className="mt-2 text-xl font-black uppercase tracking-wide text-white">
              Our Sponsors
            </h2>
          </div>

          <p className="hidden text-[10px] font-bold uppercase tracking-[0.25em] text-gray-700 md:block">
            Official Partners
          </p>

        </div>

      </div>

      {/* ========================= */}
      {/* MARQUEE */}
      {/* ========================= */}

      <div className="relative overflow-hidden">

        {/* Left fade */}
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-[#080808] to-transparent" />

        {/* Right fade */}
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-[#080808] to-transparent" />

        <div
          className="sponsor-marquee flex w-max items-center"
        >
          {marqueeSponsors.map((sponsor, index) => (
            <div
              key={`${sponsor.name}-${index}`}
              className="group flex h-28 w-[280px] shrink-0 items-center justify-center px-8"
            >
              <div className="relative flex h-full w-full items-center justify-center">

                {/* Glow */}
                <div className="pointer-events-none absolute h-20 w-40 rounded-full bg-red-500/0 blur-3xl transition-all duration-500 group-hover:bg-red-500/10" />

                {/* Logo */}
                <Image
                  src={sponsor.logo}
                  alt={`${sponsor.name} sponsor logo`}
                  width={260}
                  height={120}
                  className="relative max-h-20 w-auto max-w-[220px] object-contain opacity-90 transition-all duration-500 group-hover:scale-105 group-hover:opacity-100 group-hover:drop-shadow-[0_0_18px_rgba(239,68,68,0.25)]"
                />

              </div>
            </div>
          ))}
        </div>

      </div>

      {/* ========================= */}
      {/* FOOTER LABEL */}
      {/* ========================= */}

      <div className="mt-7 text-center">
        <p className="text-[9px] font-bold uppercase tracking-[0.3em] text-gray-800">
          Official PINTO Partners
        </p>
      </div>

    </section>
  );
}