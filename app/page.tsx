import PlayerCard from "./components/PlayerCard";
export default function Home() {
  return (
    <main className="min-h-screen bg-[#050505] text-white">
      {/* Navigation */}

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute left-1/2 top-20 h-80 w-80 -translate-x-1/2 rounded-full bg-red-600/10 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-6 py-28 md:py-40">
          <div className="max-w-4xl">
            <p className="mb-6 text-sm font-bold uppercase tracking-[0.3em] text-red-500">
              Local Esports Platform
            </p>

            <h1 className="text-5xl font-black uppercase leading-none tracking-tight md:text-7xl">
              Your Esports.
              <br />
              <span className="text-red-500">Your Legacy.</span>
            </h1>

            <p className="mt-8 max-w-2xl text-lg leading-8 text-gray-400">
              Temukan turnamen, bangun tim, dan jadikan perjalanan
              esports kamu sebagai sebuah legacy.
            </p>

            <div className="mt-10 flex flex-col gap-4 sm:flex-row">
              <button className="rounded-lg bg-red-600 px-7 py-4 font-bold uppercase tracking-wide transition hover:bg-red-500 hover:shadow-[0_0_30px_rgba(255,30,30,0.35)]">
                Explore Tournaments
              </button>

              <button className="rounded-lg border border-white/15 px-7 py-4 font-bold uppercase tracking-wide transition hover:border-red-500 hover:text-red-500">
                Join Community
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Tournament Preview */}
      <section className="border-t border-white/10 bg-[#080808]">
        <div className="mx-auto max-w-7xl px-6 py-20">
          <div className="mb-10 flex items-end justify-between">
            <div>
              <p className="text-sm font-bold uppercase tracking-widest text-red-500">
                Competition
              </p>

              <h2 className="mt-2 text-3xl font-black uppercase">
                Featured Tournaments
              </h2>
            </div>

            <button className="hidden text-sm font-semibold text-gray-400 transition hover:text-red-500 sm:block">
              View all →
            </button>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {[
              {
                game: "Mobile Legends",
                title: "Local Championship",
                date: "20 AUG 2026",
              },
              {
                game: "PUBG Mobile",
                title: "Community Battle",
                date: "24 AUG 2026",
              },
              {
                game: "Valorant",
                title: "City Open",
                date: "30 AUG 2026",
              },
            ].map((tournament) => (
              <div
                key={tournament.title}
                className="group rounded-xl border border-white/10 bg-[#0d0d0d] p-6 transition hover:-translate-y-1 hover:border-red-500/50"
              >
                <div className="mb-8 flex items-center justify-between">
                  <span className="rounded-md bg-red-500/10 px-3 py-1 text-xs font-bold uppercase text-red-500">
                    {tournament.game}
                  </span>

                  <span className="text-xs text-gray-500">
                    {tournament.date}
                  </span>
                </div>

                <h3 className="text-xl font-bold">
                  {tournament.title}
                </h3>

                <p className="mt-3 text-sm text-gray-500">
                  Tournament lokal untuk para pemain kompetitif.
                </p>

                <div className="mt-6 border-t border-white/10 pt-5 text-sm font-semibold text-gray-400 group-hover:text-red-500">
                  View tournament →
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

    {/* Player Card Preview */}        

      <section className="mx-auto max-w-7xl px-6 py-20">
        <div className="mb-10">
          <p className="text-sm font-bold uppercase tracking-widest text-red-500">
            Player Identity
          </p>

        <h2 className="mt-2 text-3xl font-black uppercase">
         Player Card
        </h2>

        <p className="mt-3 max-w-2xl text-sm leading-6 text-gray-500">
          Profil esports yang menyimpan identitas, statistik, dan achievement
          seorang player.
        </p>
    </div>

      <PlayerCard
        name="Faal"
        ign="FAAL"
        game="Mobile Legends"
        gameSlug="mobile-legends"
        role="Jungler"
          teamName="STG Squad"
      teamLogo="/teams/stg-squad.jpeg"
        achievements={8}
        wins={12}
        matches={42}
        playerId="PNT-00001"
      />
    </section>
      
      {/* Player / Team / Organizer */}
      <section className="mx-auto max-w-7xl px-6 py-20">
        <div className="grid gap-6 md:grid-cols-3">
          <div className="rounded-xl border border-white/10 bg-[#0d0d0d] p-8">
            <div className="mb-5 text-3xl">🎮</div>
            <h3 className="text-xl font-black uppercase">Player</h3>
            <p className="mt-3 text-sm leading-6 text-gray-500">
              Bangun profil, kumpulkan achievement, dan tunjukkan perjalanan
              esports kamu.
            </p>
          </div>

          <div className="rounded-xl border border-white/10 bg-[#0d0d0d] p-8">
            <div className="mb-5 text-3xl">⚔️</div>
            <h3 className="text-xl font-black uppercase">Team</h3>
            <p className="mt-3 text-sm leading-6 text-gray-500">
              Temukan player, bangun roster, dan bawa tim kamu ke turnamen
              berikutnya.
            </p>
          </div>

          <div className="rounded-xl border border-white/10 bg-[#0d0d0d] p-8">
            <div className="mb-5 text-3xl">🏆</div>
            <h3 className="text-xl font-black uppercase">Organizer</h3>
            <p className="mt-3 text-sm leading-6 text-gray-500">
              Publikasikan turnamen dan bangun reputasi sebagai tournament
              organizer.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 bg-[#050505]">
        <div className="mx-auto max-w-7xl px-6 py-8 text-center text-sm text-gray-600">
          © 2026 Pinto Esports Platform. Built for the local esports community.
        </div>
      </footer>
    </main>
  );
}