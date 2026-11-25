import Link from "next/link";
import { FiAlertCircle, FiArrowLeft } from "react-icons/fi";
import { Card } from "@/components/ui/card";

export default function RootNotFound(): React.ReactElement {
  return (
    <div className="mx-auto max-w-2xl px-4 py-12">
      <Card as="section" variant="strong" className="page-hero-card p-6 text-center sm:p-10">
        <span className="mx-auto inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-50 text-brand-700 ring-1 ring-brand-200/80">
          <FiAlertCircle className="h-6 w-6" aria-hidden="true" />
        </span>
        <h1 className="mt-4 text-2xl font-black tracking-tight text-slate-900 sm:text-3xl">Page Not Found</h1>
        <p className="mt-2 text-sm text-slate-700">The page you are looking for does not exist.</p>
        <Link
          href="/"
          className="mt-6 inline-flex items-center gap-2 rounded-full bg-brand-600 px-5 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-brand-700"
        >
          <FiArrowLeft className="h-4 w-4" aria-hidden="true" />
          Back to home
        </Link>
      </Card>
    </div>
  );
}

