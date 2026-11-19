export function Loader({ label = "Loading..." }: { label?: string }): React.ReactElement {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6 text-center text-sm text-slate-500">
      {label}
    </div>
  );
}

