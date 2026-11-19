import Image from "next/image";
import Link from "next/link";
import { MainNav } from "@/components/layout/MainNav";
import { MobileNav } from "@/components/layout/MobileNav";
import { AutoCloseMenuDetails } from "@/components/layout/AutoCloseMenuDetails";
import { SITE_ICON_PATH, SITE_NAME } from "@/lib/constants/site";

export function Header(): React.ReactElement {
  return (
    <header className="sticky top-0 z-40 border-b border-slate-200/90 bg-white/95 shadow-[0_8px_20px_rgba(15,23,42,0.05)] backdrop-blur-xl relative">
      <AutoCloseMenuDetails />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-[rgb(6,12,58)]/35 to-transparent"
      />
      <div className="relative mx-auto flex w-full max-w-[1600px] items-center gap-2 px-3 py-2.5 sm:gap-3 sm:px-4 sm:py-3">
        <Link href="/" className="min-w-0 flex items-center gap-2 sm:gap-2.5">
          <Image
            src={SITE_ICON_PATH}
            alt={`${SITE_NAME} icon`}
            width={64}
            height={64}
            priority
            className="brand-icon h-9 w-9 shrink-0 rounded-xl border border-slate-200 bg-white object-cover sm:h-11 sm:w-11"
          />
          <span className="min-w-0 flex flex-col justify-center gap-0.5 leading-none">
            <span className="brand-wordmark text-[1.45rem] font-extrabold leading-none sm:text-[1.62rem]">
              <span className="brand-wordmark-sports">Sports</span>
              <span className="brand-wordmark-era">Era</span>
            </span>
            <span className="hidden truncate text-[11px] font-medium uppercase tracking-[0.11em] text-slate-500 sm:block">
              Live Match Network
            </span>
          </span>
        </Link>
        <div className="absolute left-1/2 top-1/2 hidden -translate-x-1/2 -translate-y-1/2 lg:flex">
          <MainNav mode="links" />
        </div>
        <div className="ml-auto hidden items-center gap-2 lg:flex">
          <MainNav mode="menu" />
        </div>
        <div className="ml-auto flex items-center gap-2 lg:hidden">
          <MobileNav />
        </div>
      </div>
    </header>
  );
}



