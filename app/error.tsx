"use client";

import { ErrorState } from "@/components/shared/ErrorState";

export default function RootError({ error }: { error: Error }): React.ReactElement {
  return (
    <div className="mx-auto w-full max-w-[1600px] px-4 py-8">
      <ErrorState message={error.message || "Something went wrong while loading this page."} />
    </div>
  );
}

