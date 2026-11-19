import Image from "next/image";
import Link from "next/link";
import { MainNav } from "@/components/layout/MainNav";
import { MobileNav } from "@/components/layout/MobileNav";
import { AutoCloseMenuDetails } from "@/components/layout/AutoCloseMenuDetails";
import { SITE_ICON_PATH, SITE_NAME, SITE_POWERED_BY } from "@/lib/constants/site";

export function Header(): React.ReactElement {
  return (
    <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/90 shadow-[0_8px_24px_rgba(15,23,42,0.05)] backdrop-blur-xl">
      <AutoCloseMenuDetails />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-[rgb(6,12,58)]/30 to-transparent"
      />
      <div className="relative mx-auto flex w-full max-w-[1600px] items-center justify-between gap-2 px-3 py-2.5 sm:gap-4 sm:px-4 sm:py-3">
        <Link href="/" className="min-w-0 shrink-0 flex items-center gap-2 sm:gap-2.5">
          <Image
            src={SITE_ICON_PATH}
            alt={`${SITE_NAME} icon`}
            width={64}
            height={64}
            priority
            className="brand-icon h-9 w-9 shrink-0 rounded-xl border border-slate-200 bg-white object-cover sm:h-11 sm:w-11"
          />
          <span className="min-w-0 flex flex-col justify-center gap-0.5 leading-none">
            <span className="brand-wordmark text-[1.35rem] font-extrabold leading-none sm:text-[1.6rem]">
              <span className="brand-wordmark-sports">Sports</span>
              <span className="brand-wordmark-era">Era</span>
            </span>
            <span className=" truncate text-[9px] font-semibold uppercase tracking-[0.08em] text-slate-500 sm:text-[10px]">
              Powered by <span className="font-extrabold text-[rgb(6,12,58)]">{SITE_POWERED_BY}</span>
            </span>
          </span>
        </Link>

        <div className="hidden min-w-0 flex-1 items-center justify-center lg:flex">
          <MainNav mode="links" />
        </div>

        <div className="ml-auto flex shrink-0 items-center gap-1.5 sm:gap-2">
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
