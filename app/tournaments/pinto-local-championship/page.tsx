export default function TournamentDetailPage() {
  return (
    <main className="min-h-screen bg-[#050505] px-6 py-16 text-white">
      <div className="mx-auto max-w-7xl">

        {/* Back */}
        <a
          href="/tournaments"
          className="text-sm font-semibold text-gray-500 transition hover:text-red-500"
        >
          ← Back to Tournaments
        </a>

        {/* Tournament Hero */}
        <section className="mt-8 overflow-hidden rounded-2xl border border-red-500/30 bg-[#0b0b0b]">
          <div className="h-1 bg-red-600" />

          <div className="grid gap-8 p-8 md:grid-cols-[1.4fr_1fr] md:p-10">

            {/* Identity */}
            <div>
              <div className="flex flex-wrap items-center gap-3">
                <span className="rounded-md bg-red-500/10 px-3 py-1 text-xs font-black uppercase tracking-widest text-red-500">
                  Registration Open
                </span>

                <span className="text-xs font-bold uppercase tracking-widest text-gray-600">
                  Mobile Legends
                </span>
              </div>

{/* Prize Pool */}
<div className="mt-8 inline-flex flex-col rounded-2xl border border-red-500/30 bg-red-500/5 px-6 py-5 shadow-[0_0_40px_rgba(255,30,30,0.12)]">
  <p className="text-xs font-black uppercase tracking-[0.3em] text-red-500">
    🏆 Total Prize Pool
  </p>

  <p className="mt-2 text-4xl font-black tracking-tight text-white md:text-5xl">
    Rp 5.000.000
  </p>

  <p className="mt-2 text-xs font-medium text-gray-500">
    Grand prize + tournament rewards
  </p>
</div>

              <h1 className="mt-6 text-4xl font-black uppercase leading-tight md:text-6xl">
                PINTO Local
                <br />
                Championship
              </h1>

              <p className="mt-5 max-w-2xl text-sm leading-7 text-gray-500">
                Turnamen esports lokal untuk mempertemukan player dan team
                terbaik dalam kompetisi yang terstruktur dan tercatat di
                PINTO ESPORT.
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <button className="rounded-lg bg-red-600 px-6 py-3 text-sm font-black uppercase tracking-wide transition hover:bg-red-500">
                  Register Team
                </button>

                <button className="rounded-lg border border-white/10 px-6 py-3 text-sm font-black uppercase tracking-wide text-gray-300 transition hover:border-red-500 hover:text-red-500">
                  Share Tournament
                </button>
              </div>
            </div>

            {/* Quick Info */}
            <div className="rounded-xl border border-white/10 bg-white/[0.02] p-6">
              <p className="text-xs font-bold uppercase tracking-[0.25em] text-red-500">
                Tournament Info
              </p>

              <div className="mt-6 space-y-5">

                <div>
                  <p className="text-xs uppercase tracking-widest text-gray-600">
                    Date
                  </p>

                  <p className="mt-1 font-bold">
                    20 August 2026
                  </p>
                </div>

                <div>
                  <p className="text-xs uppercase tracking-widest text-gray-600">
                    Location
                  </p>

                  <p className="mt-1 font-bold">
                    Kabupaten Lokal
                  </p>
                </div>

                <div>
                  <p className="text-xs uppercase tracking-widest text-gray-600">
                    Team Slots
                  </p>

                  <p className="mt-1 font-bold">
                    32 Teams
                  </p>
                </div>

                <div>
                  <p className="text-xs uppercase tracking-widest text-gray-600">
                    Format
                  </p>

                  <p className="mt-1 font-bold">
                    BO3 • Elimination
                  </p>
                </div>

                <div>
                  <p className="text-xs uppercase tracking-widest text-gray-600">
                    Organizer
                  </p>

                  <p className="mt-1 font-bold">
                    PINTO ESPORT
                  </p>
                </div>

              </div>
            </div>

          </div>
        </section>

        {/* Overview */}
        <section className="mt-10 grid gap-6 lg:grid-cols-[1.5fr_1fr]">

          <div className="rounded-2xl border border-white/10 bg-[#0b0b0b] p-8">
            <p className="text-sm font-bold uppercase tracking-[0.25em] text-red-500">
              Competition
            </p>

            <h2 className="mt-2 text-3xl font-black uppercase">
              Tournament Overview
            </h2>

            <p className="mt-5 text-sm leading-7 text-gray-500">
              Kompetisi menggunakan format eliminasi dengan pertandingan
              Best of 3. Setiap hasil pertandingan akan dicatat oleh
              organizer dan dapat menjadi bagian dari competitive record
              player.
            </p>

            <div className="mt-8 grid gap-4 sm:grid-cols-2">

              <div className="rounded-xl border border-white/10 bg-white/[0.02] p-5">
                <p className="text-xs uppercase tracking-widest text-gray-600">
                  Game
                </p>

                <p className="mt-2 font-bold">
                  Mobile Legends
                </p>
              </div>

              <div className="rounded-xl border border-white/10 bg-white/[0.02] p-5">
                <p className="text-xs uppercase tracking-widest text-gray-600">
                  Match Format
                </p>

                <p className="mt-2 font-bold">
                  BO3
                </p>
              </div>

              <div className="rounded-xl border border-white/10 bg-white/[0.02] p-5">
                <p className="text-xs uppercase tracking-widest text-gray-600">
                  Tournament Format
                </p>

                <p className="mt-2 font-bold">
                  Elimination
                </p>
              </div>

              <div className="rounded-xl border border-white/10 bg-white/[0.02] p-5">
                <p className="text-xs uppercase tracking-widest text-gray-600">
                  Participants
                </p>

                <p className="mt-2 font-bold">
                  32 Teams
                </p>
              </div>

            </div>
          </div>

          {/* Player Reward */}
          <div className="rounded-2xl border border-red-500/20 bg-[#0b0b0b] p-8">
            <p className="text-sm font-bold uppercase tracking-[0.25em] text-red-500">
              Player Legacy
            </p>

            <h2 className="mt-2 text-3xl font-black uppercase">
              Achievement
            </h2>

            <div className="mt-6 rounded-xl border border-white/10 bg-white/[0.02] p-6">
              <div className="text-3xl">
                🏆
              </div>

              <h3 className="mt-4 font-black uppercase">
                Tournament Achievement
              </h3>

              <p className="mt-3 text-sm leading-6 text-gray-500">
                Player yang mengikuti turnamen akan memiliki catatan
                partisipasi pada competitive history mereka.
              </p>
            </div>

            <div className="mt-4 rounded-xl border border-white/10 bg-white/[0.02] p-6">
              <div className="text-3xl">
                📜
              </div>

              <h3 className="mt-4 font-black uppercase">
                E-Certificate
              </h3>

              <p className="mt-3 text-sm leading-6 text-gray-500">
                Certificate akan tersimpan pada profile player setelah
                turnamen selesai dan hasil divalidasi organizer.
              </p>
            </div>
          </div>

        </section>

        {/* Registered Teams */}
        <section className="mt-10 rounded-2xl border border-white/10 bg-[#0b0b0b] p-8">

          <p className="text-sm font-bold uppercase tracking-[0.25em] text-red-500">
            Participants
          </p>

          <h2 className="mt-2 text-3xl font-black uppercase">
            Registered Teams
          </h2>

          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

            {[
              "STG Squad",
              "Pinto Warriors",
              "Local Legends",
              "Red Zone",
            ].map((team) => (
              <div
                key={team}
                className="rounded-xl border border-white/10 bg-white/[0.02] p-5 transition hover:border-red-500/40"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-red-500/10 text-xl">
                  ⚔
                </div>

                <p className="mt-4 font-bold">
                  {team}
                </p>

                <p className="mt-1 text-xs uppercase tracking-widest text-gray-600">
                  Registered
                </p>
              </div>
            ))}

          </div>
        </section>

        {/* Bracket Preview */}
        <section className="mt-10 rounded-2xl border border-white/10 bg-[#0b0b0b] p-8">

          <p className="text-sm font-bold uppercase tracking-[0.25em] text-red-500">
            Competition
          </p>

          <h2 className="mt-2 text-3xl font-black uppercase">
            Match Bracket
          </h2>

          <div className="mt-8 overflow-x-auto">
            <div className="flex min-w-[700px] items-center gap-8">

              <div className="w-48 space-y-3">
                <div className="rounded-lg border border-white/10 bg-white/[0.02] p-4">
                  <p className="text-sm font-bold">
                    STG Squad
                  </p>
                </div>

                <div className="rounded-lg border border-white/10 bg-white/[0.02] p-4">
                  <p className="text-sm font-bold">
                    Red Zone
                  </p>
                </div>
              </div>

              <div className="text-2xl text-red-500">
                →
              </div>

              <div className="w-48">
                <div className="rounded-lg border border-red-500/30 bg-red-500/5 p-4">
                  <p className="text-sm font-bold">
                    Quarter Final
                  </p>

                  <p className="mt-1 text-xs text-gray-600">
                    BO3
                  </p>
                </div>
              </div>

              <div className="text-2xl text-red-500">
                →
              </div>

              <div className="w-48">
                <div className="rounded-lg border border-white/10 bg-white/[0.02] p-4">
                  <p className="text-sm font-bold">
                    Grand Final
                  </p>

                  <p className="mt-1 text-xs text-gray-600">
                    BO3
                  </p>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* Organizer */}
        <section className="mt-10 pb-20">

          <div className="rounded-2xl border border-white/10 bg-[#0b0b0b] p-8">

            <p className="text-sm font-bold uppercase tracking-[0.25em] text-red-500">
              Tournament Organizer
            </p>

            <div className="mt-5 flex items-center gap-5">

              <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-red-500/10 text-xl font-black text-red-500">
                P
              </div>

              <div>
                <h2 className="text-xl font-black uppercase">
                  PINTO ESPORT
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  Tournament Organizer
                </p>
              </div>

            </div>

          </div>

        </section>

      </div>
    </main>
  );
}