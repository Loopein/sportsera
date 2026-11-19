import Link from "next/link";

export default function RootNotFound(): React.ReactElement {
  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <h1 className="text-2xl font-bold text-slate-900">Page Not Found</h1>
      <p className="mt-2 text-sm text-slate-700">The page you are looking for does not exist.</p>
      <Link href="/" className="mt-4 inline-flex rounded-md bg-brand-600 px-4 py-2 text-sm text-white">
        Back to home
      </Link>
    </div>
  );
}

