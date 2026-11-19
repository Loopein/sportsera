import { Tabs } from "@/components/shared/Tabs";

export function PlayerTabs({
  playerId,
  currentPath
}: {
  playerId: string;
  currentPath: string;
}): React.ReactElement {
  const base = `/players/${playerId}`;
  return (
    <Tabs
      tabs={[
        { href: base, label: "Overview", isActive: currentPath === base },
        { href: `${base}/career`, label: "Career", isActive: currentPath === `${base}/career` },
        { href: `${base}/recent`, label: "Recent", isActive: currentPath === `${base}/recent` }
      ]}
    />
  );
}

