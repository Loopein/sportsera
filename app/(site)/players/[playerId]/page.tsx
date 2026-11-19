import { notFound } from "next/navigation";
import { PlayerTabs } from "@/app/(site)/players/[playerId]/PlayerTabs";
import { PlayerHeader } from "@/components/player/PlayerHeader";
import { PlayerStats } from "@/components/player/PlayerStats";
import { AdSlot } from "@/components/shared/AdSlot";
import { getPlayer } from "@/lib/api/read";

type PlayerOverviewProps = {
  params: Promise<{ playerId: string }>;
};

export default async function PlayerOverviewPage({ params }: PlayerOverviewProps): Promise<React.ReactElement> {
  const { playerId } = await params;
  const player = await getPlayer(playerId);
  if (!player) notFound();

  return (
    <div className="space-y-4">
      <PlayerTabs playerId={player.id} currentPath={`/players/${player.id}`} />
      <PlayerHeader player={player} />
      <AdSlot variant="in-feed" label="Sponsored · Player Profile" />
      <PlayerStats career={player.career} />
      <AdSlot variant="leaderboard" label="Sponsored · Player Analytics" />
    </div>
  );
}

