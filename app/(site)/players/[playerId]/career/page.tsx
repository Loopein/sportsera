import { notFound } from "next/navigation";
import { PlayerTabs } from "@/app/(site)/players/[playerId]/PlayerTabs";
import { PlayerStats } from "@/components/player/PlayerStats";
import { AdSlot } from "@/components/shared/AdSlot";
import { getPlayer } from "@/lib/api/read";

type PlayerCareerProps = {
  params: Promise<{ playerId: string }>;
};

export default async function PlayerCareerPage({ params }: PlayerCareerProps): Promise<React.ReactElement> {
  const { playerId } = await params;
  const player = await getPlayer(playerId);
  if (!player) notFound();

  return (
    <div className="space-y-4">
      <PlayerTabs playerId={player.id} currentPath={`/players/${player.id}/career`} />
      <PlayerStats career={player.career} />
      <AdSlot variant="leaderboard" label="Sponsored · Career Records" />
    </div>
  );
}

