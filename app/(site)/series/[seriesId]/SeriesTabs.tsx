import { Tabs } from "@/components/shared/Tabs";

export function SeriesTabs({
  seriesId,
  currentPath
}: {
  seriesId: string;
  currentPath: string;
}): React.ReactElement {
  const base = `/series/${seriesId}`;
  return (
    <Tabs
      tabs={[
        { href: base, label: "Overview", isActive: currentPath === base },
        { href: `${base}/fixtures`, label: "Fixtures", isActive: currentPath === `${base}/fixtures` },
        {
          href: `${base}/points-table`,
          label: "Points Table",
          isActive: currentPath === `${base}/points-table`
        },
        { href: `${base}/stats`, label: "Stats", isActive: currentPath === `${base}/stats` }
      ]}
    />
  );
}

