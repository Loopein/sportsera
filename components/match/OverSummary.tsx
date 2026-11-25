import { memo } from "react";
import { Card } from "@/components/ui/card";

function OverSummaryComponent({ overs }: { overs: string[] }): React.ReactElement {
  return (
    <Card as="section" className="p-4 sm:p-5">
      <h2 className="text-base font-extrabold text-slate-900">Recent Overs</h2>
      {overs.length ? (
        <ul className="mt-3 flex flex-wrap gap-2 text-sm text-slate-700">
          {overs.map((over, index) => (
            <li
              key={`${over}-${index}`}
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50/90 px-3 py-2 font-bold tabular-nums text-slate-800 shadow-xs transition hover:border-brand-200"
            >
              <span className="inline-flex items-center rounded-md bg-brand-50 px-2 py-0.5 text-[11px] font-extrabold uppercase text-brand-700">
                Ov {index + 1}
              </span>
              <span>{over}</span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-3 rounded-xl border border-dashed border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-500">
          Recent over-by-over breakdown will appear here as play progresses.
        </p>
      )}
    </Card>
  );
}

export const OverSummary = memo(
  OverSummaryComponent,
  (previous, next) => previous.overs === next.overs
);

OverSummary.displayName = "OverSummary";
