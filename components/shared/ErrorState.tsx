import Link from "next/link";
import { BsDatabase, BsExclamationTriangle } from "react-icons/bs";

export function ErrorState({ message }: { message: string }): React.ReactElement {
  const relationMatch = /relation \"([^\"]+)\" does not exist/i.exec(message);
  const label = relationMatch?.[1];
  const description = label
    ? `There is no data to show for ${label} right now.`
    : "There is no data to show you right now.";

  return (
    <div className="rounded-2xl border border-slate-200 p-5 text-center text-slate-800 sm:p-8" role="alert">
      <div className="mx-auto flex h-28 w-28 items-center justify-center">
        <span className="relative inline-flex h-24 w-24 items-center justify-center text-[#1f9b9b]">
          <BsDatabase className="h-12 w-12" aria-hidden="true" />
          <span className="absolute -bottom-1 -right-1 inline-flex h-9 w-9 items-center justify-center text-[#0f7a7a]">
            <BsExclamationTriangle className="h-5 w-5" aria-hidden="true" />
          </span>
        </span>
      </div>
      <h3 className="mt-2 text-xl font-bold text-slate-900">No Data Available</h3>
      <p className="mt-2 text-sm text-slate-600">{description}</p>
      <Link
        href="/"
        className="mt-5 inline-flex items-center justify-center rounded-lg bg-[#1f9b9b] px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-[#178787]"
      >
        Continue
      </Link>
    </div>
  );
}

