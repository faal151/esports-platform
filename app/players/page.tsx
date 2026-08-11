import PlayerCard from "../components/PlayerCard";

export default function PlayersPage() {
  return (
    <main className="min-h-screen bg-[#050505] px-6 py-16 text-white">
      <div className="mx-auto max-w-7xl">

        {/* Header */}
        <div className="mb-12">
          <p className="text-sm font-bold uppercase tracking-[0.25em] text-red-500">
            PINTO ESPORT
          </p>

          <h1 className="mt-3 text-5xl font-black uppercase tracking-tight">
            Players
          </h1>

          <p className="mt-4 max-w-2xl text-gray-500">
            Player profiles, identities, and competitive records.
          </p>
        </div>

        {/* Players */}
        <section>
          <a
  href="/players/faal"
  className="block w-fit"
>
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
</a>
        </section>

      </div>
    </main>
  );
}