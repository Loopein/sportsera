import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PlayerTabs } from "@/app/(site)/players/[playerId]/PlayerTabs";
import { PlayerHeader } from "@/components/player/PlayerHeader";
import { PlayerStats } from "@/components/player/PlayerStats";
import { JsonLd } from "@/components/seo/JsonLd";
import { AdSlot } from "@/components/shared/AdSlot";
import { getPlayer } from "@/lib/api/read";
import { buildBreadcrumbJsonLd, buildPersonJsonLd } from "@/lib/seo/jsonld";
import { buildPageMetadata } from "@/lib/seo/metadata";

type PlayerOverviewProps = {
  params: Promise<{ playerId: string }>;
};

export async function generateMetadata({ params }: PlayerOverviewProps): Promise<Metadata> {
  const { playerId } = await params;
  const player = await getPlayer(playerId);
  if (!player) {
    return buildPageMetadata({
      title: "Player Not Found",
      description: "The requested player profile could not be found.",
      path: `/players/${playerId}`,
      noIndex: true
    });
  }

  return buildPageMetadata({
    title: `${player.name} Profile & Career Stats`,
    description: `${player.name} (${player.role}) profile, playing style, career stats, and recent performance form on SportsEra.`,
    path: `/players/${player.id}`,
    keywords: [player.name, player.role, "player stats", "career profile"]
  });
}

export default async function PlayerOverviewPage({ params }: PlayerOverviewProps): Promise<React.ReactElement> {
  const { playerId } = await params;
  const player = await getPlayer(playerId);
  if (!player) notFound();

  return (
    <div className="space-y-4">
      <JsonLd
        data={[
          buildPersonJsonLd(player, `/players/${player.id}`),
          buildBreadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: "Players", path: "/players" },
            { name: player.name, path: `/players/${player.id}` }
          ])
        ]}
      />
      <PlayerTabs playerId={player.id} currentPath={`/players/${player.id}`} />
      <PlayerHeader player={player} />
      <AdSlot variant="in-feed" label="Sponsored · Player Profile" />
      <PlayerStats career={player.career} />
      <AdSlot variant="leaderboard" label="Sponsored · Player Analytics" />
    </div>
  );
}

