import Link from "next/link";
import { FiArrowRight, FiCalendar, FiLayers } from "react-icons/fi";
import { AdSlot } from "@/components/shared/AdSlot";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/shared/EmptyState";
import { getSeries } from "@/lib/api/read";

export const revalidate = 30;

function statusPillClass(status: string): string {
  if (status === "ongoing") return "bg-emerald-100 text-emerald-800 ring-1 ring-emerald-200";
  if (status === "upcoming") return "bg-brand-100 text-brand-800 ring-1 ring-brand-200";
  return "bg-slate-100 text-slate-700 ring-1 ring-slate-200";
}

export default async function SeriesPage(): Promise<React.ReactElement> {
  const series = await getSeries();

  return (
    <div className="space-y-6">
      <Card as="section" variant="strong" className="page-hero-card p-4 sm:p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-700 ring-1 ring-brand-200/80">
              <FiLayers className="h-5 w-5" aria-hidden="true" />
            </span>
            <div className="min-w-0">
              <p className="text-xs font-extrabold uppercase tracking-wider text-brand-700">
                Leagues, Championships &amp; Tours
              </p>
              <h1 className="mt-0.5 text-2xl font-black tracking-tight text-slate-900 sm:text-3xl">Series</h1>
              <p className="mt-1 text-sm text-slate-600">
                Browse global leagues, international championships, points tables, and tournament schedules across every sport.
              </p>
            </div>
          </div>
          <span className="score-pill">{series.length} series</span>
        </div>
      </Card>

      <AdSlot variant="in-feed" label="Sponsored · Series Hub" />

      {series.length ? (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {series.map((item) => (
            <Link
              key={item.id}
              href={`/series/${item.id}`}
              className="group block min-w-0 rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
            >
              <Card
                as="article"
                interactive
                className="relative flex h-full flex-col justify-between overflow-hidden p-4 transition-all duration-300 group-hover:-translate-y-0.5 group-hover:border-brand-300 group-hover:shadow-lg sm:p-5"
              >
                <div
                  aria-hidden="true"
                  className={`pointer-events-none absolute inset-x-0 top-0 h-1 ${
                    item.status === "ongoing"
                      ? "bg-gradient-to-r from-emerald-500 to-teal-400"
                      : item.status === "upcoming"
                        ? "bg-gradient-to-r from-brand-500 via-sky-400 to-indigo-500"
                        : "bg-gradient-to-r from-slate-400 to-slate-300"
                  }`}
                />
                <div>
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="inline-flex items-center rounded-md border border-slate-200 bg-slate-50 px-2.5 py-0.5 text-xs font-extrabold uppercase tracking-wider text-slate-700">
                      {item.format}
                    </span>
                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wider ${statusPillClass(item.status)}`}>
                      {item.status}
                    </span>
                  </div>
                  <h2 className="mt-3 text-xl font-black tracking-tight text-slate-900 group-hover:text-brand-700">
                    {item.name} {item.season}
                  </h2>
                  <p className="mt-2 inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600">
                    <FiCalendar className="h-3.5 w-3.5 text-brand-600" aria-hidden="true" />
                    <span>
                      {item.startDate || "TBD"} &mdash; {item.endDate || "TBD"}
                    </span>
                  </p>
                </div>

                <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3 text-xs font-bold uppercase tracking-wider text-brand-700">
                  <span>Standings &amp; Fixtures</span>
                  <FiArrowRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-1" aria-hidden="true" />
                </div>
              </Card>
            </Link>
          ))}
        </div>
      ) : (
        <EmptyState title="No series found" description="Tournaments and series will appear here once scheduled." />
      )}
      <AdSlot variant="leaderboard" label="Sponsored · Global Leagues & Tours" />
    </div>
  );
}
