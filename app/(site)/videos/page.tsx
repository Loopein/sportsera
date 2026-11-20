import Link from "next/link";
import { BiBroadcast } from "react-icons/bi";
import { FiArrowRight, FiFilm, FiPlayCircle } from "react-icons/fi";
import { AdSlot } from "@/components/shared/AdSlot";
import { Card } from "@/components/ui/card";

const highlightPreviews = [
  {
    title: "Match Highlights Reel",
    duration: "04:15",
    category: "Highlights",
    description: "Key goals, boundaries, clutch plays, and match-defining moments curated right after every game."
  },
  {
    title: "Post-Match Tactical Desk",
    duration: "06:40",
    category: "Analysis",
    description: "Momentum breakdowns, tactical formations, key matchups, and winning plays across every sport."
  },
  {
    title: "Press Box & Captain Reactions",
    duration: "03:10",
    category: "Press Box",
    description: "Post-match briefings, MVP interviews, and upcoming arena previews."
  }
];

export default function VideosPage(): React.ReactElement {
  return (
    <div className="space-y-6">
      <Card as="section" variant="strong" className="p-5 sm:p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-700 ring-1 ring-brand-200/80">
              <FiFilm className="h-5 w-5" aria-hidden="true" />
            </span>
            <div>
              <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">Videos</h1>
              <p className="mt-1 text-sm text-slate-600">
                Match highlights, post-match tactical analysis, and short clips in one clean broadcast hub.
              </p>
            </div>
          </div>
          <span className="score-pill">Coming Soon</span>
        </div>
      </Card>

      <div className="grid gap-4 md:grid-cols-3">
        {highlightPreviews.map((item) => (
          <Card key={item.title} className="flex flex-col justify-between gap-4 p-4 sm:p-5">
            <div className="space-y-3">
              <div className="relative flex aspect-video items-center justify-center rounded-xl border border-slate-200/80 bg-slate-50/80 text-slate-800">
                <FiPlayCircle className="h-10 w-10 text-brand-600" aria-hidden="true" />
                <span className="absolute bottom-2.5 right-2.5 rounded-md border border-slate-200 bg-white px-2 py-0.5 text-[11px] font-bold tabular-nums text-slate-800">
                  {item.duration}
                </span>
                <span className="absolute left-2.5 top-2.5 rounded-full border border-slate-200 bg-white px-2.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wider text-brand-700">
                  {item.category}
                </span>
              </div>
              <div>
                <h2 className="text-base font-extrabold text-slate-900">{item.title}</h2>
                <p className="mt-1 text-xs leading-relaxed text-slate-600">{item.description}</p>
              </div>
            </div>
            <span className="inline-flex w-fit rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-[11px] font-bold text-slate-500">
              Publishing Pipeline Preparing
            </span>
          </Card>
        ))}
      </div>

      <AdSlot variant="native-card" label="Sponsored · Match Highlights Partner" />

      <Card as="section" className="flex flex-wrap items-center justify-between gap-4 p-5">
        <div>
          <h2 className="text-base font-extrabold text-slate-900">Follow Live Action While Video Publishes</h2>
          <p className="mt-1 text-sm text-slate-600">
            Track live play-by-play commentary, real-time scores, and complete match stats across every sport.
          </p>
        </div>
        <div className="flex flex-wrap gap-2.5">
          <Link
            href="/live"
            className="inline-flex items-center gap-2 rounded-xl bg-brand-600 px-4 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-brand-700"
          >
            <BiBroadcast className="h-4 w-4" aria-hidden="true" />
            <span>Go to Live</span>
          </Link>
          <Link
            href="/matches"
            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm font-bold text-slate-700 transition hover:border-brand-200 hover:bg-brand-50 hover:text-brand-700"
          >
            <span>Browse Matches</span>
            <FiArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>
      </Card>

      <AdSlot variant="leaderboard" label="Sponsored · Video Hub" />
    </div>
  );
}

