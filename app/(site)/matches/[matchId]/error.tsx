"use client";

import { ErrorState } from "@/components/shared/ErrorState";

export default function MatchError({ error }: { error: Error }): React.ReactElement {
  return <ErrorState message={error.message || "Unable to load match page."} />;
}

