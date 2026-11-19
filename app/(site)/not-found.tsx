import Link from "next/link";

export default function SiteNotFound(): React.ReactElement {
  return (
    <div className="mx-auto max-w-4xl rounded-xl border border-slate-200 bg-white p-8 text-center">
      <h1 className="text-2xl font-bold text-slate-900">Content Not Found</h1>
      <p className="mt-2 text-sm text-slate-600">This entity does not exist or may have been removed.</p>
      <Link href="/" className="mt-4 inline-flex rounded-md bg-brand-600 px-4 py-2 text-sm text-white">
        Go to homepage
      </Link>
    </div>
  );
}

