const roster = [
  {
    ign: "FAAL",
    name: "Faal",
    role: "Jungler",
    playerId: "PNT-00001",
    photo: "/players/faal.jpeg",
  },
  {
    ign: "PLAYER 02",
    name: "Player Two",
    role: "Gold Lane",
    playerId: "PNT-00002",
  },
  {
    ign: "PLAYER 03",
    name: "Player Three",
    role: "Mid Lane",
    playerId: "PNT-00003",
  },
  {
    ign: "PLAYER 04",
    name: "Player Four",
    role: "EXP Lane",
    playerId: "PNT-00004",
  },
  {
    ign: "PLAYER 05",
    name: "Player Five",
    role: "Roamer",
    playerId: "PNT-00005",
  },
];

export default function SquadDetailPage() {
  return (
    <main className="min-h-screen bg-[#050505] px-6 py-16 text-white">
      <div className="mx-auto max-w-7xl">

        {/* Back */}
        <a
          href="/squads"
          className="text-sm font-semibold text-gray-500 transition hover:text-red-500"
        >
          ← Back to Squads
        </a>

        {/* Squad Hero */}
        <section className="mt-8 overflow-hidden rounded-2xl border border-red-500/30 bg-[#0b0b0b]">
          <div className="h-1 bg-red-600" />

          <div className="grid gap-8 p-8 md:grid-cols-[180px_1fr] md:p-10">

            {/* Logo */}
            <div className="flex h-44 w-44 items-center justify-center overflow-hidden rounded-2xl border border-white/10 bg-white">
              <img
                src="/teams/stg-squad.jpeg"
                alt="STG Squad"
                className="h-full w-full object-contain"
              />
            </div>

            {/* Identity */}
            <div className="flex flex-col justify-center">

              <div className="flex flex-wrap items-center gap-3">
                <span className="rounded-md bg-red-500/10 px-3 py-1 text-xs font-black uppercase tracking-widest text-red-500">
                  Active
                </span>

                <span className="text-xs font-bold uppercase tracking-widest text-gray-600">
                  Mobile Legends
                </span>
              </div>

              <h1 className="mt-4 text-5xl font-black uppercase tracking-tight">
                STG Squad
              </h1>

              <p className="mt-3 text-sm text-gray-500">
                Kabupaten Lokal
              </p>

              <div className="mt-6 flex flex-wrap gap-3">
                <span className="rounded-md border border-white/10 px-3 py-2 text-xs font-bold uppercase tracking-widest text-gray-400">
                  5 Players
                </span>

                <span className="rounded-md border border-white/10 px-3 py-2 text-xs font-bold uppercase tracking-widest text-gray-400">
                  Mobile Legends
                </span>

                <span className="rounded-md border border-white/10 px-3 py-2 text-xs font-bold uppercase tracking-widest text-gray-400">
                  PINTO Squad
                </span>
              </div>
            </div>

          </div>
        </section>

        {/* Management */}
        <section className="mt-10">
          <p className="text-sm font-bold uppercase tracking-[0.25em] text-red-500">
            Squad Management
          </p>

          <h2 className="mt-2 text-3xl font-black uppercase">
            Management
          </h2>

          <div className="mt-6 grid gap-4 md:grid-cols-3">

            {/* Owner */}
            <div className="rounded-xl border border-white/10 bg-[#0b0b0b] p-6">
              <p className="text-xs font-bold uppercase tracking-widest text-gray-600">
                Owner
              </p>

              <p className="mt-3 text-xl font-black">
                Not Assigned
              </p>

              <p className="mt-2 text-xs text-gray-600">
                Squad owner has not been registered.
              </p>
            </div>

            {/* Manager */}
            <div className="rounded-xl border border-white/10 bg-[#0b0b0b] p-6">
              <p className="text-xs font-bold uppercase tracking-widest text-gray-600">
                Manager
              </p>

              <p className="mt-3 text-xl font-black">
                Not Assigned
              </p>

              <p className="mt-2 text-xs text-gray-600">
                Manager requires PINTO Admin approval.
              </p>
            </div>

            {/* Leader */}
            <div className="rounded-xl border border-white/10 bg-[#0b0b0b] p-6">
              <p className="text-xs font-bold uppercase tracking-widest text-gray-600">
                Squad Leader
              </p>

              <p className="mt-3 text-xl font-black">
                FAAL
              </p>

              <p className="mt-2 text-xs text-gray-600">
                Competitive team leader.
              </p>
            </div>

          </div>
        </section>

        {/* Recruitment */}
        <section className="mt-10">
          <div className="rounded-2xl border border-green-500/20 bg-green-500/5 p-8">

            <div className="flex flex-col justify-between gap-6 md:flex-row md:items-center">

              <div>
                <p className="text-xs font-black uppercase tracking-[0.25em] text-green-400">
                  🟢 Open to Recruitment
                </p>

                <h2 className="mt-2 text-3xl font-black uppercase">
                  Looking for Team Manager
                </h2>

                <p className="mt-3 max-w-2xl text-sm leading-6 text-gray-500">
                  Squad ini sedang mencari manager. Setiap pengajuan manager
                  akan melalui proses review dan approval dari Admin PINTO.
                </p>
              </div>

              <div className="shrink-0 rounded-xl border border-green-500/20 bg-black/20 px-6 py-4 text-center">
                <p className="text-[10px] font-bold uppercase tracking-widest text-gray-600">
                  Manager Status
                </p>

                <p className="mt-2 font-black uppercase text-green-400">
                  Open
                </p>
              </div>

            </div>
          </div>
        </section>

        {/* Roster */}
        <section className="mt-12">
          <p className="text-sm font-bold uppercase tracking-[0.25em] text-red-500">
            Competitive Roster
          </p>

          <h2 className="mt-2 text-3xl font-black uppercase">
            Roster
          </h2>

          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">

            {roster.map((player) => (
              <div
                key={player.playerId}
                className="group rounded-xl border border-white/10 bg-[#0b0b0b] p-5 transition hover:border-red-500/40"
              >
                <div className="flex items-center gap-4">

                  {/* Photo */}
                  <div className="h-16 w-16 shrink-0 overflow-hidden rounded-lg border border-white/10 bg-[#151515]">
                    {player.photo ? (
                      <img
                        src={player.photo}
                        alt={player.ign}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-xs font-bold text-gray-700">
                        PLAYER
                      </div>
                    )}
                  </div>

                  <div className="min-w-0">
                    <p className="text-xl font-black uppercase">
                      {player.ign}
                    </p>

                    <p className="mt-1 text-xs font-bold uppercase tracking-widest text-red-500">
                      {player.role}
                    </p>

                    <p className="mt-2 font-mono text-[10px] text-gray-600">
                      {player.playerId}
                    </p>
                  </div>

                </div>
              </div>
            ))}

          </div>
        </section>

        {/* Tournament Record */}
        <section className="mt-12">
          <p className="text-sm font-bold uppercase tracking-[0.25em] text-red-500">
            Competitive Record
          </p>

          <h2 className="mt-2 text-3xl font-black uppercase">
            Tournament History
          </h2>

          <div className="mt-6 rounded-2xl border border-white/10 bg-[#0b0b0b] p-8">

            <div className="flex flex-col justify-between gap-4 border-b border-white/10 pb-6 md:flex-row md:items-center">
              <div>
                <p className="font-black uppercase">
                  PINTO Local Championship
                </p>

                <p className="mt-2 text-sm text-gray-600">
                  Mobile Legends · BO3 · Elimination
                </p>
              </div>

              <span className="rounded-md bg-red-500/10 px-3 py-2 text-xs font-black uppercase tracking-widest text-red-500">
                Registered
              </span>
            </div>

            <p className="pt-6 text-sm text-gray-600">
              Tournament results akan tercatat otomatis setelah pertandingan
              selesai dan divalidasi.
            </p>

          </div>
        </section>

        {/* Achievements */}
        <section className="mt-12">
          <p className="text-sm font-bold uppercase tracking-[0.25em] text-red-500">
            Squad Legacy
          </p>

          <h2 className="mt-2 text-3xl font-black uppercase">
            Achievements
          </h2>

          <div className="mt-6 rounded-2xl border border-white/10 bg-[#0b0b0b] p-8">
            <p className="text-sm text-gray-600">
              Squad achievements akan muncul otomatis berdasarkan hasil
              turnamen yang telah divalidasi PINTO.
            </p>
          </div>
        </section>

        {/* Squad ID */}
        <section className="mt-12 pb-20">
          <div className="rounded-xl border border-white/10 bg-[#0b0b0b] p-6">
            <p className="text-[10px] font-bold uppercase tracking-widest text-gray-600">
              PINTO Squad ID
            </p>

            <p className="mt-2 font-mono text-sm font-bold text-gray-400">
              SQUAD-STG-0001
            </p>
          </div>
        </section>

      </div>
    </main>
  );
}