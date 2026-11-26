import type { Metadata } from "next";
import Link from "next/link";
import { FiAlertCircle, FiArrowLeft } from "react-icons/fi";
import { Card } from "@/components/ui/card";
import { buildPageMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = buildPageMetadata({
  title: "Content Not Found",
  description: "The requested match, series, team, player, or article could not be found.",
  path: "/",
  noIndex: true
});

export default function SiteNotFound(): React.ReactElement {
  return (
    <Card as="section" variant="strong" className="page-hero-card mx-auto max-w-2xl p-6 text-center sm:p-10">
      <span className="mx-auto inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-50 text-brand-700 ring-1 ring-brand-200/80">
        <FiAlertCircle className="h-6 w-6" aria-hidden="true" />
      </span>
      <h1 className="mt-4 text-2xl font-black tracking-tight text-slate-900 sm:text-3xl">Content Not Found</h1>
      <p className="mt-2 text-sm text-slate-600">This entity does not exist or may have been removed.</p>
      <Link
        href="/"
        className="mt-6 inline-flex items-center gap-2 rounded-full bg-brand-600 px-5 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-brand-700"
      >
        <FiArrowLeft className="h-4 w-4" aria-hidden="true" />
        Go to homepage
      </Link>
    </Card>
  );
}

