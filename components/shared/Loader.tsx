export function Loader({ label = "Loading..." }: { label?: string }): React.ReactElement {
  return (
    <div
      role="status"
      aria-label={label}
      className="space-y-4 rounded-2xl border border-slate-200 bg-white/90 p-5 shadow-sm"
    >
      <div className="flex items-center justify-between gap-4">
        <div className="h-5 w-44 animate-pulse rounded-lg bg-slate-200/80" />
        <div className="h-4 w-20 animate-pulse rounded-full bg-slate-200/70" />
      </div>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <div className="h-28 animate-pulse rounded-xl bg-slate-100" />
        <div className="h-28 animate-pulse rounded-xl bg-slate-100" />
        <div className="h-28 animate-pulse rounded-xl bg-slate-100" />
        <div className="h-28 animate-pulse rounded-xl bg-slate-100" />
      </div>
      <p className="text-center text-xs font-medium text-slate-400">{label}</p>
    </div>
  );
}
