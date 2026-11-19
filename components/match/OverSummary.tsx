import { memo } from "react";

function OverSummaryComponent({ overs }: { overs: string[] }): React.ReactElement {
  return (
    <section className="rounded-xl border border-slate-200 bg-white p-5">
      <h2 className="text-base font-semibold text-slate-900">Recent Overs</h2>
      <ul className="mt-3 space-y-2 text-sm text-slate-700">
        {overs.map((over, index) => (
          <li key={`${over}-${index}`} className="rounded-md bg-slate-50 px-3 py-2">
            {over}
          </li>
        ))}
      </ul>
    </section>
  );
}

export const OverSummary = memo(
  OverSummaryComponent,
  (previous, next) => previous.overs === next.overs
);

OverSummary.displayName = "OverSummary";

