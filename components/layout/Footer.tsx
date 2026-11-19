import Image from "next/image";
import Link from "next/link";
import type { IconType } from "react-icons";
import { FaApple, FaFacebookF, FaGooglePlay, FaInstagram, FaPinterestP, FaTwitter } from "react-icons/fa";
import { FiMail, FiMapPin, FiPhoneCall } from "react-icons/fi";
import { SITE_ICON_PATH, SITE_NAME } from "@/lib/constants/site";

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

const footerBottomLinks = [
  { href: "/more", label: "About us" },
  { href: "/series", label: "Events" },
  { href: "/results", label: "Our History" }
];

export function Footer(): React.ReactElement {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-14 border-t border-slate-200/90">
      <div className="relative overflow-hidden bg-[radial-gradient(circle_at_14%_0%,_#fbfdff_0%,_#ffffff_48%,_#f4f7ff_100%)] text-slate-900">
        <div className="absolute inset-0 bg-[linear-gradient(115deg,rgba(255,255,255,0.9),transparent_38%,rgba(6,12,58,0.08)_74%,transparent)]" />
        <div className="relative mx-auto w-full max-w-[1600px] px-3 py-8 sm:px-4 md:py-12">
          <div className="flex flex-col gap-5 border-b border-slate-200/80 pb-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex flex-wrap items-center gap-2.5 text-sm font-semibold">
              <span className="mr-1 text-base font-bold text-slate-900">Follow Us :</span>
              {socialLinks.map((item) => {
                const Icon = item.icon;
                return (
                  <a
                    key={item.label}
                    href={item.href}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={item.label}
                    className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-300 bg-white text-slate-700 shadow-sm transition hover:-translate-y-0.5 hover:border-[#b8c5ed] hover:text-[rgb(6,12,58)]"
                  >
                    <Icon className="h-4 w-4" aria-hidden="true" />
                  </a>
                );
              })}
            </div>

            <Link href="/" className="inline-flex items-center gap-2.5 self-start lg:self-auto">
              <Image
                src={SITE_ICON_PATH}
                alt={`${SITE_NAME} icon`}
                width={64}
                height={64}
                className="h-9 w-9 shrink-0 rounded-xl border border-slate-300 bg-white object-cover sm:h-10 sm:w-10"
              />
              <span className="brand-wordmark text-[1.75rem] font-black tracking-tight sm:text-[2.2rem]">
                <span className="brand-wordmark-sports">Sports</span>
                <span className="brand-wordmark-era">Era</span>
              </span>
            </Link>

            <div className="flex flex-col gap-2">
              <p className="text-sm font-semibold uppercase tracking-[0.1em] text-slate-600">Download App</p>
              <div className="flex flex-wrap gap-2">
                <a
                  href="https://play.google.com/store"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                >
                  <FaGooglePlay className="h-4 w-4 text-emerald-500" aria-hidden="true" />
                  <span className="text-xs font-semibold">Google Play</span>
                </a>
                <a
                  href="https://www.apple.com/app-store/"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                >
                  <FaApple className="h-4 w-4" aria-hidden="true" />
                  <span className="text-xs font-semibold">App Store</span>
                </a>
              </div>
            </div>
          </div>

          <div className="grid items-start gap-8 py-8 sm:grid-cols-2 lg:grid-cols-4">
            <section className="min-w-0 w-full">
              <h3 className="text-xl font-bold text-[rgb(6,12,58)] sm:text-2xl">Contact Information</h3>
              <ul className="mt-4 space-y-4 text-sm text-slate-700">
                <li className="flex items-start gap-2.5">
                  <FiMapPin className="mt-0.5 h-4 w-4 shrink-0 text-[rgb(6,12,58)]" aria-hidden="true" />
                  <span>17504 Carlton Cuevas Rd, Gulfport, MS, 39503</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <FiMail className="mt-0.5 h-4 w-4 shrink-0 text-[rgb(6,12,58)]" aria-hidden="true" />
                  <span>letstalk@sportsera.com</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <FiPhoneCall className="mt-0.5 h-4 w-4 shrink-0 text-[rgb(6,12,58)]" aria-hidden="true" />
                  <span>(007) 123 456 7890</span>
                </li>
              </ul>
            </section>

            <section className="min-w-0 w-full">
              <h3 className="text-xl font-bold text-[rgb(6,12,58)] sm:text-2xl">About Our Team</h3>
              <p className="mt-4 text-sm leading-7 text-slate-700">
                For those of you who are serious about having more, doing more, and being more, success is achievable with some
                understanding of what to do serious about having more, doing more.
              </p>
            </section>

            <section className="min-w-0 w-full">
              <h3 className="text-xl font-bold text-[rgb(6,12,58)] sm:text-2xl">Useful Links</h3>
              <nav className="mt-4 flex flex-col items-start gap-2.5 text-left" aria-label="Useful links">
                {usefulLinks.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="inline-flex items-center text-left text-base font-medium text-slate-800 transition hover:text-[rgb(6,12,58)]"
                  >
                    <span>{item.label}</span>
                  </Link>
                ))}
              </nav>
            </section>

            <section className="min-w-0 w-full">
              <h3 className="text-xl font-bold text-[rgb(6,12,58)] sm:text-2xl">Need help?</h3>
              <nav className="mt-4 flex flex-col items-start gap-2.5 text-left" aria-label="Help links">
                {helpLinks.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="inline-flex items-center text-left text-base font-medium text-slate-800 transition hover:text-[rgb(6,12,58)]"
                  >
                    <span>{item.label}</span>
                  </Link>
                ))}
              </nav>
            </section>
          </div>

          <div className="flex flex-col gap-4 border-t border-slate-200/80 pt-5 text-sm md:flex-row md:items-center md:justify-between">
            <nav className="flex flex-wrap items-center gap-x-6 gap-y-2" aria-label="Footer bottom links">
              {footerBottomLinks.map((item) => (
                <Link key={item.href} href={item.href} className="font-semibold text-slate-800 transition hover:text-[rgb(6,12,58)]">
                  {item.label}
                </Link>
              ))}
            </nav>
            <p className="font-semibold text-slate-700">
              &copy; Copyright {year} {SITE_NAME} All Rights Reserved. Powered by Loopein.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}



