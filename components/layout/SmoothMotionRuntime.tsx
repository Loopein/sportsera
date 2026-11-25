"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { FiArrowUp } from "react-icons/fi";
import { ensureGsapRegistered, gsap, prefersReducedMotion } from "@/lib/gsap/client";

export function SmoothMotionRuntime(): React.ReactElement {
  const pathname = usePathname() ?? "/";
  const progressRef = useRef<HTMLDivElement | null>(null);
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const headerElevatedRef = useRef(false);
  const [showTopButton, setShowTopButton] = useState(false);

  useEffect(() => {
    ensureGsapRegistered();

    const setProgress =
      progressRef.current && !prefersReducedMotion()
        ? gsap.quickTo(progressRef.current, "scaleX", { duration: 0.25, ease: "power2.out" })
        : null;

    let rafId = 0;

    const syncScroll = (): void => {
      rafId = 0;
      const doc = document.documentElement;
      const maxScroll = Math.max(0, doc.scrollHeight - window.innerHeight);
      const ratio = maxScroll > 0 ? Math.min(1, Math.max(0, window.scrollY / maxScroll)) : 0;

      if (setProgress) {
        setProgress(ratio);
      } else if (progressRef.current) {
        progressRef.current.style.transform = `scaleX(${ratio})`;
      }

      const elevated = window.scrollY > 16;
      if (elevated !== headerElevatedRef.current) {
        headerElevatedRef.current = elevated;
        const headerEl = document.querySelector<HTMLElement>(".glass-navbar");
        if (headerEl) {
          const shadow = elevated
            ? "0 14px 32px rgba(2, 6, 23, 0.16)"
            : "0 8px 24px rgba(15, 23, 42, 0.06)";
          if (prefersReducedMotion()) {
            headerEl.style.boxShadow = shadow;
          } else {
            gsap.to(headerEl, { boxShadow: shadow, duration: 0.32, ease: "power2.out" });
          }
        }
      }

      const shouldShow = window.scrollY > 360;
      setShowTopButton((prev) => (prev === shouldShow ? prev : shouldShow));
    };

    const scheduleSync = (): void => {
      if (rafId !== 0) return;
      rafId = window.requestAnimationFrame(syncScroll);
    };

    scheduleSync();
    window.addEventListener("scroll", scheduleSync, { passive: true });
    window.addEventListener("resize", scheduleSync, { passive: true });

    const onAnchorClick = (event: MouseEvent): void => {
      const targetEl = (event.target as Element | null)?.closest<HTMLAnchorElement>('a[href^="#"]');
      if (!targetEl) return;
      const href = targetEl.getAttribute("href");
      if (!href || href === "#") return;

      let targetId = href.slice(1);
      try {
        targetId = decodeURIComponent(targetId);
      } catch {
        // Use raw hash string if URI decoding fails.
      }
      const destination = document.getElementById(targetId);
      if (!destination) return;

      event.preventDefault();
      if (prefersReducedMotion()) {
        destination.scrollIntoView({ behavior: "auto" });
        return;
      }

      gsap.to(window, {
        scrollTo: { y: destination, offsetY: 84, autoKill: true },
        duration: 0.72,
        ease: "power3.inOut"
      });
    };

    document.addEventListener("click", onAnchorClick);

    return () => {
      if (rafId !== 0) window.cancelAnimationFrame(rafId);
      window.removeEventListener("scroll", scheduleSync);
      window.removeEventListener("resize", scheduleSync);
      document.removeEventListener("click", onAnchorClick);
    };
  }, [pathname]);

  useEffect(() => {
    const buttonEl = buttonRef.current;
    if (!buttonEl) return;

    ensureGsapRegistered();
    if (prefersReducedMotion()) {
      gsap.set(buttonEl, {
        autoAlpha: showTopButton ? 1 : 0,
        y: 0,
        scale: 1
      });
      return;
    }

    gsap.to(
      buttonEl,
      showTopButton
        ? { autoAlpha: 1, y: 0, scale: 1, duration: 0.36, ease: "back.out(1.7)" }
        : { autoAlpha: 0, y: 12, scale: 0.88, duration: 0.24, ease: "power2.in" }
    );
  }, [showTopButton]);

  const handleScrollTop = useCallback((): void => {
    ensureGsapRegistered();
    if (prefersReducedMotion()) {
      window.scrollTo(0, 0);
      return;
    }
    gsap.to(window, {
      scrollTo: { y: 0, autoKill: true },
      duration: 0.82,
      ease: "power3.inOut"
    });
  }, []);

  return (
    <>
      <div aria-hidden="true" className="pointer-events-none fixed inset-x-0 top-0 z-50 h-[2.5px] overflow-hidden">
        <div
          ref={progressRef}
          className="h-full w-full origin-left scale-x-0 bg-gradient-to-r from-brand-500 via-sky-400 to-emerald-400 will-change-transform"
        />
      </div>

      <button
        ref={buttonRef}
        type="button"
        onClick={handleScrollTop}
        aria-label="Scroll to top"
        title="Scroll to top"
        className="invisible opacity-0 fixed bottom-5 right-4 z-30 inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-200/80 bg-white/90 text-slate-800 shadow-lg transition-colors duration-200 hover:border-brand-300 hover:bg-brand-50 hover:text-brand-700 sm:bottom-6 sm:right-6 sm:h-11 sm:w-11"
      >
        <FiArrowUp className="h-4 w-4 sm:h-5 sm:w-5" aria-hidden="true" />
      </button>
    </>
  );
}
