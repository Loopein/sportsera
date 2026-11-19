import type { PlayerProfile } from "@/types/player";
import { Card } from "@/components/ui/card";

export function PlayerHeader({ player }: { player: PlayerProfile }): React.ReactElement {
  return (
    <Card as="header" className="p-5">
      <h1 className="text-2xl font-bold text-slate-900">{player.name}</h1>
      <p className="mt-1 text-sm text-slate-700">{player.role}</p>
      <p className="text-sm text-slate-700">
        {player.battingStyle ?? "-"} | {player.bowlingStyle ?? "-"}
      </p>
    </Card>
  );
}

