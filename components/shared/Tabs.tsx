import Link from "next/link";
import { cn } from "@/lib/utils/text";
import { Card } from "@/components/ui/card";

type TabItem = {
  href: string;
  label: string;
  isActive?: boolean;
};

type TabsProps = {
  tabs: TabItem[];
  align?: "start" | "center";
};

export function Tabs({ tabs, align = "start" }: TabsProps): React.ReactElement {
  return (
    <nav aria-label="Page tabs" className={cn("overflow-x-auto", align === "center" && "flex justify-center")}>
      <Card as="ul" className={cn("flex min-w-max gap-1.5 p-1.5", align === "center" && "mx-auto")}>
        {tabs.map((tab) => (
          <li key={tab.href}>
            <Link
              href={tab.href}
              className={cn(
                "block rounded-xl px-3 py-2 text-sm font-semibold transition",
                tab.isActive
                  ? "bg-brand-600 text-white shadow-sm"
                  : "text-slate-700 hover:bg-brand-50 hover:text-brand-700"
              )}
            >
              {tab.label}
            </Link>
          </li>
        ))}
      </Card>
    </nav>
  );
}

