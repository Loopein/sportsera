import type { Metadata } from "next";
import { BiBroadcast } from "react-icons/bi";
import { LivePageClient } from "@/app/(site)/live/LivePageClient";
import { AdSlot } from "@/components/shared/AdSlot";
import { Card } from "@/components/ui/card";
import { getLiveMatches } from "@/lib/api/read";

export const revalidate = 10;

export const metadata: Metadata = {
  title: "Live Matches",
  description: "All currently live sports matches with fast real-time score refresh."
};

export default async function LivePage(): Promise<React.ReactElement> {
  const matches = await getLiveMatches();

  return (
    <div className="space-y-6">
      <Card as="section" variant="strong" className="page-hero-card p-4 sm:p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-red-50/90 text-red-600 ring-1 ring-red-200/80">
              <BiBroadcast className="h-5 w-5 animate-pulse-soft" aria-hidden="true" />
            </span>
            <div className="min-w-0">
              <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">Live Matches</h1>
              <p className="mt-1.5 text-sm text-slate-600">
                Real-time live match cards across football, cricket, basketball, tennis, and global sports with zero page jitter.
              </p>
            </div>
          </div>
          <span className="score-pill">{matches.length} live</span>
        </div>
      </Card>
      <AdSlot variant="in-feed" label="Sponsored · Live Feed" />
      <LivePageClient initialMatches={matches} />
      <AdSlot variant="leaderboard" label="Sponsored · Live Center Banner" />
    </div>
  );
}

