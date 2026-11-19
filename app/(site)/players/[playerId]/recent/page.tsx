import { notFound } from "next/navigation";
import { FiActivity } from "react-icons/fi";
import { PlayerTabs } from "@/app/(site)/players/[playerId]/PlayerTabs";
import { AdSlot } from "@/components/shared/AdSlot";
import { Card } from "@/components/ui/card";
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
      <Card as="section" className="p-5 sm:p-6">
        <div className="flex items-center justify-between gap-2">
          <h2 className="inline-flex items-center gap-2 text-lg font-extrabold text-slate-900">
            <FiActivity className="h-4 w-4 text-brand-600" aria-hidden="true" />
            Recent Form
          </h2>
          <span className="text-xs font-semibold text-slate-500">Last {player.recentForm.length} appearances</span>
        </div>

        {player.recentForm.length ? (
          <ul className="mt-4 flex flex-wrap gap-2.5">
            {player.recentForm.map((entry, index) => (
              <li
                key={`${entry}-${index}`}
                className="inline-flex items-center gap-1.5 rounded-xl border border-brand-200 bg-brand-50 px-3.5 py-2 text-sm font-black tabular-nums text-brand-800 shadow-sm"
              >
                <span className="text-[10px] font-bold uppercase text-brand-500">#{index + 1}</span>
                <span>{entry}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-4 rounded-xl border border-dashed border-slate-200 bg-slate-50 p-6 text-center text-sm text-slate-500">
            No recent form entries recorded yet.
          </p>
        )}
      </Card>
      <AdSlot variant="leaderboard" label="Sponsored · Form Tracker" />
    </div>
  );
}
