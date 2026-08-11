type Squad = {
  name: string;
  game: string;
  region: string;
  status: string;
  rosterCount: number;
  owner: string;
  manager: string;
  leader: string;
  recruitmentStatus: "Open" | "Closed";
  recruitmentTarget: string;
};

const squads: Squad[] = [
  {
    name: "STG Squad",
    game: "Mobile Legends",
    region: "Kabupaten Lokal",
    status: "Active",
    rosterCount: 5,
    owner: "FAAL",
    manager: "Not Assigned",
    leader: "FAAL",
    recruitmentStatus: "Open",
    recruitmentTarget: "Team Manager",
  },
];

export default function SquadsPage() {
  return (
    <main className="min-h-screen bg-[#050505] px-6 py-16 text-white">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-12">
          <p className="text-sm font-bold uppercase tracking-[0.25em] text-red-500">
            PINTO ESPORT
          </p>

          <h1 className="mt-3 text-5xl font-black uppercase tracking-tight">
            Squads
          </h1>

          <p className="mt-4 max-w-2xl text-gray-500">
            Temukan squad esports, lihat roster, identitas tim, dan competitive
            record mereka.
          </p>
        </div>

        {/* Squad List */}
        <section className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {squads.map((squad) => (
            <article
              key={squad.name}
              className="group relative overflow-hidden rounded-2xl border border-white/10 bg-[#0b0b0b] transition duration-300 hover:-translate-y-1 hover:border-red-500/60"
            >
              {/* Accent */}
              <div className="absolute inset-x-0 top-0 h-1 bg-red-600" />

              {/* Squad Header */}
              <div className="flex items-center gap-5 p-6">
                <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-white/10 bg-white">
                  <img
                    src="/teams/stg-squad.jpeg"
                    alt="STG Squad"
                    className="h-full w-full object-contain"
                  />
                </div>

                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.2em] text-red-500">
                    {squad.game}
                  </p>

                  <h2 className="mt-2 text-2xl font-black uppercase">
                    {squad.name}
                  </h2>
                </div>
              </div>

              {/* Status */}
              <div className="px-6">
                <span className="rounded-md bg-red-500/10 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-red-500">
                  {squad.status}
                </span>
              </div>

              {/* Info */}
              <div className="mt-6 space-y-3 border-y border-white/10 px-6 py-5">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Owner</span>

                  <span className="font-semibold text-gray-300">
                    {squad.owner}
                  </span>
                </div>

                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Manager</span>

                  <span className="font-semibold text-gray-300">
                    {squad.manager}
                  </span>
                </div>

                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Squad Leader</span>

                  <span className="font-semibold text-gray-300">
                    {squad.leader}
                  </span>
                </div>

                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Roster</span>

                  <span className="font-semibold text-gray-300">
                    {squad.rosterCount} Players
                  </span>
                </div>
              </div>

              <div className="mx-6 rounded-xl border border-green-500/20 bg-green-500/5 p-4">
                <p className="text-[10px] font-black uppercase tracking-widest text-green-400">
                  {squad.recruitmentStatus === "Open"
                    ? "🟢 Open to Recruitment"
                    : "Recruitment Closed"}
                </p>

                <p className="mt-2 text-sm font-bold text-white">
                  Looking for {squad.recruitmentTarget}
                </p>

                <p className="mt-1 text-xs text-gray-600">
                  Squad ini terbuka untuk kandidat yang ingin bergabung sebagai{" "}
                  {squad.recruitmentTarget.toLowerCase()}.
                </p>
              </div>

              {/* Action */}
              <div className="p-6">
                <a
                  href="/squads/stg-squad"
                  className="block w-full rounded-lg bg-red-600 px-5 py-3 text-center text-sm font-black uppercase tracking-wide transition hover:bg-red-500 hover:shadow-[0_0_25px_rgba(255,30,30,0.25)]"
                >
                  View Squad
                </a>
              </div>
            </article>
          ))}
        </section>
      </div>
    </main>
  );
}
