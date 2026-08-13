import Image from "next/image";

type Sponsor = {
  name: string;
  logo: string;
};

const sponsors: Sponsor[] = [
  { name: "VIVO", logo: "/sponsors/vivo.webp" },
  { name: "TRI", logo: "/sponsors/tri.png" },
  { name: "SMEA PREMIUM TAKENGON", logo: "/sponsors/smea-premium.png" },
  { name: "MAMIN SELULER", logo: "/sponsors/mamin-seluler.png" },
  { name: "CLEO", logo: "/sponsors/cleo.png" },
  { name: "ICHTIAR", logo: "/sponsors/ichtiar.png" },
];

export default function SponsorCarousel() {
  return (
    <section className="border-y border-white/10 bg-[#080808] py-10">
      <div className="mx-auto max-w-7xl px-5 sm:px-6">
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

        <div className="flex flex-wrap justify-center gap-3 sm:gap-4">
          {sponsors.map((sponsor) => (
            <div
              key={sponsor.name}
              className="group relative flex h-28 w-[calc((100%_-_0.75rem)_/_2)] touch-manipulation sm:w-[calc((100%_-_2rem)_/_3)] lg:w-[calc((100%_-_4rem)_/_5)] items-center justify-center overflow-hidden border border-white/10 bg-white/[0.02] px-5 transition duration-300 ease-out hover:-translate-y-1 hover:border-red-500/50 hover:bg-red-500/[0.06] hover:shadow-[0_14px_30px_rgba(239,68,68,0.14)] active:scale-[0.97] sm:h-32 sm:px-6"
            >
              <div className="pointer-events-none absolute -inset-x-10 -top-16 h-24 rounded-full bg-red-500/0 blur-2xl transition duration-300 group-hover:bg-red-500/20" />
              <div className="pointer-events-none absolute inset-x-0 bottom-0 h-px origin-left scale-x-0 bg-red-500 transition duration-300 group-hover:scale-x-100" />

              <Image
                src={sponsor.logo}
                alt={`${sponsor.name} sponsor logo`}
                width={260}
                height={120}
                className="relative max-h-16 w-auto max-w-full object-contain opacity-90 transition duration-300 group-hover:scale-105 group-hover:opacity-100 sm:max-h-20"
              />
            </div>
          ))}
        </div>

        <p className="mt-5 text-center text-[9px] font-bold uppercase tracking-[0.28em] text-gray-700 sm:mt-7 sm:tracking-[0.3em]">
          Hover or tap to highlight a partner
        </p>
      </div>
    </section>
  );
}