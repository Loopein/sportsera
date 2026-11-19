import { Tabs } from "@/components/shared/Tabs";

export function TeamTabs({ teamId, currentPath }: { teamId: string; currentPath: string }): React.ReactElement {
  const base = `/teams/${teamId}`;
  return (
    <Tabs
      tabs={[
        { href: base, label: "Overview", isActive: currentPath === base },
        { href: `${base}/fixtures`, label: "Fixtures", isActive: currentPath === `${base}/fixtures` },
        { href: `${base}/squad`, label: "Squad", isActive: currentPath === `${base}/squad` }
      ]}
    />
  );
}

