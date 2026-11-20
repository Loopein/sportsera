import Link from "next/link";
import type { IconType } from "react-icons";
import { FaApple, FaFacebookF, FaGooglePlay, FaInstagram, FaPinterestP, FaTwitter } from "react-icons/fa";
import { FiMail, FiMapPin, FiPhoneCall } from "react-icons/fi";
import { PoweredByLoopein } from "@/components/shared/LoopeinBranding";
import { SportsEraLogo } from "@/components/layout/SportsEraLogo";
import { SITE_NAME, SITE_POWERED_BY } from "@/lib/constants/site";

type IconLink = {
  href: string;
  label: string;
  icon: IconType;
};

const socialLinks: IconLink[] = [
  { href: "https://facebook.com", label: "Facebook", icon: FaFacebookF },
  { href: "https://instagram.com", label: "Instagram", icon: FaInstagram },
  { href: "https://twitter.com", label: "Twitter", icon: FaTwitter },
  { href: "https://pinterest.com", label: "Pinterest", icon: FaPinterestP }
];

const usefulLinks = [
  { href: "/matches", label: "Matches" },
  { href: "/series", label: "Series" },
  { href: "/rankings", label: "Standings" },
  { href: "/news", label: "News" },
  { href: "/stats", label: "Stats" }
];

const helpLinks = [
  { href: "/search", label: "Search" },
  { href: "/live", label: "Live Center" },
  { href: "/teams", label: "Teams" },
  { href: "/players", label: "Players" }
];

const featurePills = ["All Sports Live", "Match Centers", "League Standings", "Athlete Stats"];

export function Footer(): React.ReactElement {
  const year = new Date().getFullYear();

  return (
    <footer className="glass-footer relative z-10 mt-14 border-t border-slate-200/80">
      <div className="relative text-slate-900">
        <div className="relative mx-auto w-full max-w-[1600px] px-4 py-8 sm:px-6 md:py-10">
          {/* Tier 1: Multi-Line Brand, Social & App Bar */}
          <div className="grid gap-6 border-b border-slate-200/80 pb-6 md:grid-cols-2 lg:grid-cols-[1.2fr_auto_auto] lg:items-center">
            <div className="min-w-0 space-y-2 md:col-span-2 lg:col-span-1">
              <div className="flex flex-wrap items-center gap-3">
                <Link href="/" aria-label="SportsEra Home" className="inline-flex shrink-0 items-center">
                  <SportsEraLogo showPoweredBy />
                </Link>
              </div>
              <p className="max-w-xl text-xs leading-relaxed text-slate-600 sm:text-sm">
                Real-time live scores, play-by-play commentary &amp; tournament analytics across every sport.
              </p>
            </div>

            <div className="flex flex-col gap-2">
              <p className="text-xs font-extrabold uppercase tracking-[0.12em] text-slate-500">Follow Us</p>
              <div className="flex flex-wrap items-center gap-2">
                {socialLinks.map((item) => {
                  const Icon = item.icon;
                  return (
                    <a
                      key={item.label}
                      href={item.href}
                      target="_blank"
                      rel="noreferrer"
                      aria-label={item.label}
                      className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-slate-50 text-slate-700 shadow-sm transition hover:-translate-y-0.5 hover:border-brand-300 hover:text-brand-600"
                    >
                      <Icon className="h-4 w-4" aria-hidden="true" />
                    </a>
                  );
                })}
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <p className="text-xs font-extrabold uppercase tracking-[0.12em] text-slate-500">Download App</p>
              <div className="flex flex-wrap gap-2">
                <a
                  href="https://play.google.com/store"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2.5 rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-slate-900 shadow-sm transition hover:-translate-y-0.5 hover:border-brand-300 hover:shadow-md"
                >
                  <FaGooglePlay className="h-4 w-4 shrink-0 text-emerald-600" aria-hidden="true" />
                  <span className="flex flex-col leading-tight">
                    <span className="text-[9px] font-bold uppercase tracking-wider text-slate-500">GET IT ON</span>
                    <span className="text-xs font-extrabold text-slate-900">Google Play</span>
                  </span>
                </a>
                <a
                  href="https://www.apple.com/app-store/"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2.5 rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-slate-900 shadow-sm transition hover:-translate-y-0.5 hover:border-brand-300 hover:shadow-md"
                >
                  <FaApple className="h-4 w-4 shrink-0 text-slate-900" aria-hidden="true" />
                  <span className="flex flex-col leading-tight">
                    <span className="text-[9px] font-bold uppercase tracking-wider text-slate-500">Download on the</span>
                    <span className="text-xs font-extrabold text-slate-900">App Store</span>
                  </span>
                </a>
              </div>
            </div>
          </div>

          {/* Tier 2: Responsive Multi-Line Content & Link Grid */}
          <div className="grid items-start gap-8 py-8 sm:grid-cols-2 lg:grid-cols-12">
            <section className="min-w-0 space-y-4 sm:col-span-2 lg:col-span-4">
              <h3 className="text-lg font-extrabold text-slate-900 sm:text-xl">About {SITE_NAME}</h3>
              <p className="text-sm leading-7 text-slate-600">
                A {SITE_POWERED_BY} product built for fast, real-time coverage across every sport—live scores, match centers,
                play-by-play commentary, fixtures, standings, and team insights.
              </p>
              <div className="flex flex-wrap gap-2">
                {featurePills.map((pill) => (
                  <span
                    key={pill}
                    className="inline-flex items-center rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-bold text-slate-700 shadow-xs"
                  >
                    {pill}
                  </span>
                ))}
              </div>
            </section>

            <div className="grid grid-cols-2 gap-6 sm:col-span-2 lg:col-span-4">
              <section className="min-w-0">
                <h3 className="text-lg font-extrabold text-slate-900 sm:text-xl">Useful Links</h3>
                <nav className="mt-4 flex flex-col items-start gap-2.5 text-left" aria-label="Useful links">
                  {usefulLinks.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="inline-flex items-center text-left text-sm font-semibold text-slate-700 transition hover:text-brand-600 sm:text-base"
                    >
                      <span>{item.label}</span>
                    </Link>
                  ))}
                </nav>
              </section>

              <section className="min-w-0">
                <h3 className="text-lg font-extrabold text-slate-900 sm:text-xl">Need help?</h3>
                <nav className="mt-4 flex flex-col items-start gap-2.5 text-left" aria-label="Help links">
                  {helpLinks.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="inline-flex items-center text-left text-sm font-semibold text-slate-700 transition hover:text-brand-600 sm:text-base"
                    >
                      <span>{item.label}</span>
                    </Link>
                  ))}
                </nav>
              </section>
            </div>

            <section className="min-w-0 sm:col-span-2 lg:col-span-4">
              <h3 className="text-lg font-extrabold text-slate-900 sm:text-xl">Contact Information</h3>
              <ul className="mt-4 space-y-3.5 text-sm text-slate-700">
                <li className="flex items-start gap-3">
                  <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-slate-200 bg-slate-50 text-brand-600 shadow-xs">
                    <FiMapPin className="h-4 w-4" aria-hidden="true" />
                  </span>
                  <div className="min-w-0">
                    <p className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500">Location</p>
                    <p className="break-words font-medium text-slate-800">17504 Carlton Cuevas Rd, Gulfport, MS, 39503</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-slate-200 bg-slate-50 text-brand-600 shadow-xs">
                    <FiMail className="h-4 w-4" aria-hidden="true" />
                  </span>
                  <div className="min-w-0">
                    <p className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500">Email Desk</p>
                    <p className="break-words font-medium text-slate-800">letstalk@sportsera.com</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-slate-200 bg-slate-50 text-brand-600 shadow-xs">
                    <FiPhoneCall className="h-4 w-4" aria-hidden="true" />
                  </span>
                  <div className="min-w-0">
                    <p className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500">Support Line</p>
                    <p className="break-words font-medium text-slate-800">(007) 123 456 7890</p>
                  </div>
                </li>
              </ul>
            </section>
          </div>

          {/* Tier 3: Bottom Copyright Bar */}
          <div className="flex flex-col items-center justify-between gap-2 border-t border-slate-200/80 pt-5 text-center text-xs sm:flex-row sm:text-left sm:text-sm">
            <p className="font-semibold text-slate-600">
              &copy; Copyright {year} {SITE_NAME}. All Rights Reserved.
            </p>
            <PoweredByLoopein logoHeight={15} />
          </div>
        </div>
      </div>
    </footer>
  );
}



