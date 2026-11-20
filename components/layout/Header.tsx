import Link from "next/link";
import { MainNav } from "@/components/layout/MainNav";
import { MobileNav } from "@/components/layout/MobileNav";
import { AutoCloseMenuDetails } from "@/components/layout/AutoCloseMenuDetails";
import { SportsEraLogo } from "@/components/layout/SportsEraLogo";
import { ThemeToggle } from "@/components/layout/ThemeToggle";

export function Header(): React.ReactElement {
  return (
    <header className="glass-navbar sticky top-0 z-40 border-b border-slate-200/80 shadow-[0_8px_24px_rgba(15,23,42,0.06)]">
      <AutoCloseMenuDetails />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-[#1d70f2]/25 to-transparent"
      />
      <div className="relative mx-auto flex w-full max-w-[1600px] items-center justify-between gap-2 px-3 py-2.5 sm:gap-4 sm:px-4 sm:py-3">
        <Link href="/" aria-label="SportsEra Home" className="inline-flex shrink-0 items-center">
          <SportsEraLogo />
        </Link>

        <div className="hidden min-w-0 flex-1 items-center justify-center lg:flex">
          <MainNav mode="links" />
        </div>

        <div className="ml-auto flex shrink-0 items-center gap-1.5 sm:gap-2">
          <ThemeToggle />
          <div className="hidden items-center lg:flex">
            <MainNav mode="menu" />
          </div>
          <div className="flex items-center lg:hidden">
            <MobileNav />
          </div>
        </div>
      </div>
    </header>
  );
}
