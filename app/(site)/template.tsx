"use client";

import { useEffect, useRef } from "react";
import { ensureGsapRegistered, gsap, prefersReducedMotion, ScrollTrigger } from "@/lib/gsap/client";

let hydrationSettled = false;

function getInteractiveCard(target: EventTarget | null): HTMLElement | null {
  const el = target as Element | null;
  if (!el) return null;
  const card = el.closest<HTMLElement>("a.group > .surface-card, a.group > .surface-card-strong");
  if (!card) return null;
  if (card.classList.contains("carousel-card-size") || card.classList.contains("!border-0")) {
    return null;
  }
  return card;
}

export default function SiteTemplate({ children }: Readonly<{ children: React.ReactNode }>): React.ReactElement {
  const stageRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const root = stageRef.current;
    if (!root || prefersReducedMotion()) return;

    ensureGsapRegistered();

    let delayTimer = 0;
    let idleCleanup: (() => void) | undefined;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        root,
        { opacity: 0, y: 12 },
        {
          opacity: 1,
          y: 0,
          duration: 0.44,
          ease: "power3.out",
          clearProps: "transform,opacity"
        }
      );
    }, stageRef);

    const setupScrollReveals = (): void => {
      hydrationSettled = true;
      const targets = Array.from(
        root.querySelectorAll<HTMLElement>(
          ":scope > div > section:not(:first-child), :scope > div > article:not(:first-child), :scope > div > .grid > *"
        )
      );
      const foldY = window.innerHeight * 0.94;
      const belowFold = targets.filter((el) => el.getBoundingClientRect().top > foldY);
      if (!belowFold.length) return;

      ctx.add(() => {
        gsap.set(belowFold, { autoAlpha: 0, y: 24 });
        ScrollTrigger.batch(belowFold, {
          start: "top 91%",
          once: true,
          onEnter: (batch) => {
            gsap.to(batch, {
              autoAlpha: 1,
              y: 0,
              duration: 0.6,
              stagger: 0.06,
              ease: "power3.out",
              overwrite: true,
              clearProps: "transform,opacity,visibility"
            });
          }
        });
      });
      ScrollTrigger.refresh();
    };

    const scheduleReveals = (): void => {
      const delayMs = hydrationSettled ? 40 : 140;
      delayTimer = window.setTimeout(setupScrollReveals, delayMs);
    };

    if (hydrationSettled || document.readyState === "complete") {
      scheduleReveals();
    } else {
      const onLoad = (): void => scheduleReveals();
      window.addEventListener("load", onLoad, { once: true });
      idleCleanup = () => window.removeEventListener("load", onLoad);
    }

    const onPointerOver = (event: PointerEvent): void => {
      const card = getInteractiveCard(event.target);
      if (!card) return;
      const related = event.relatedTarget as Node | null;
      if (related && card.contains(related)) return;
      gsap.to(card, { y: -4, duration: 0.3, ease: "power3.out", overwrite: "auto" });
    };

    const onPointerOut = (event: PointerEvent): void => {
      const card = getInteractiveCard(event.target);
      if (!card) return;
      const related = event.relatedTarget as Node | null;
      if (related && card.contains(related)) return;
      gsap.to(card, {
        y: 0,
        scale: 1,
        duration: 0.34,
        ease: "power3.out",
        overwrite: "auto",
        clearProps: "transform"
      });
    };

    const onPointerDown = (event: PointerEvent): void => {
      const card = getInteractiveCard(event.target);
      if (!card) return;
      gsap.to(card, { scale: 0.992, duration: 0.14, ease: "power2.out", overwrite: "auto" });
    };

    const onPointerUp = (event: PointerEvent): void => {
      const card = getInteractiveCard(event.target);
      if (!card) return;
      gsap.to(card, { scale: 1, duration: 0.24, ease: "back.out(1.6)", overwrite: "auto" });
    };

    root.addEventListener("pointerover", onPointerOver);
    root.addEventListener("pointerout", onPointerOut);
    root.addEventListener("pointerdown", onPointerDown);
    root.addEventListener("pointerup", onPointerUp);

    return () => {
      if (delayTimer !== 0) window.clearTimeout(delayTimer);
      idleCleanup?.();
      root.removeEventListener("pointerover", onPointerOver);
      root.removeEventListener("pointerout", onPointerOut);
      root.removeEventListener("pointerdown", onPointerDown);
      root.removeEventListener("pointerup", onPointerUp);
      ctx.revert();
    };
  }, []);

  return (
    <div ref={stageRef} className="min-w-0">
      {children}
    </div>
  );
}
