import { notFound } from "next/navigation";
import { PlayerTabs } from "@/app/(site)/players/[playerId]/PlayerTabs";
import { getPlayer } from "@/lib/api/read";

type PlayerRecentProps = {
  params: Promise<{ playerId: string }>;
};

export default async function PlayerRecentPage({ params }: PlayerRecentProps): Promise<React.ReactElement> {
  const { playerId } = await params;
  const player = await getPlayer(playerId);
  if (!player) notFound();

  return (
    <div className="space-y-4">
      <PlayerTabs playerId={player.id} currentPath={`/players/${player.id}/recent`} />
      <section className="rounded-xl border border-slate-200 bg-white p-5">
        <h2 className="text-base font-semibold text-slate-900">Recent Form</h2>
        <ul className="mt-3 flex flex-wrap gap-2">
          {player.recentForm.map((entry, index) => (
            <li key={`${entry}-${index}`} className="rounded-full bg-brand-100 px-3 py-1 text-sm font-semibold text-brand-800">
              {entry}
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}

