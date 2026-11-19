import { FiInbox } from "react-icons/fi";
import { Card } from "@/components/ui/card";

export function EmptyState({ title, description }: { title: string; description?: string }): React.ReactElement {
  return (
    <Card className="border-dashed border-slate-300 bg-white/85 p-8 text-center">
      <span className="mx-auto inline-flex h-11 w-11 items-center justify-center rounded-full bg-brand-50 text-brand-700">
        <FiInbox className="h-5 w-5" aria-hidden="true" />
      </span>
      <h3 className="mt-3 text-base font-bold text-slate-900">{title}</h3>
      {description ? <p className="mt-1.5 text-sm text-slate-600">{description}</p> : null}
    </Card>
  );
}
