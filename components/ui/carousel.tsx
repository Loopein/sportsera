"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ComponentPropsWithoutRef,
  type ReactNode
} from "react";
import useEmblaCarousel, { type UseEmblaCarouselType } from "embla-carousel-react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { cn } from "@/lib/utils/text";

export type CarouselApi = UseEmblaCarouselType[1];
type CarouselOptions = Parameters<typeof useEmblaCarousel>[0];
type CarouselPlugins = Parameters<typeof useEmblaCarousel>[1];

type CarouselContextState = {
  viewportRef: UseEmblaCarouselType[0];
  api: CarouselApi;
  canPrev: boolean;
  canNext: boolean;
  goPrev: () => void;
  goNext: () => void;
};

const CarouselCtx = createContext<CarouselContextState | null>(null);

function useCarouselState(): CarouselContextState {
  const ctx = useContext(CarouselCtx);
  if (!ctx) {
    throw new Error("Carousel primitives must be rendered inside <Carousel>");
  }
  return ctx;
}

type CarouselProps = ComponentPropsWithoutRef<"div"> & {
  opts?: CarouselOptions;
  plugins?: CarouselPlugins;
  setApi?: (api: CarouselApi) => void;
  children: ReactNode;
};

export function Carousel({
  opts,
  plugins,
  setApi,
  className,
  children,
  ...rest
}: CarouselProps): React.ReactElement {
  const [viewportRef, api] = useEmblaCarousel(opts, plugins);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(false);

  const syncButtons = useCallback((instance: CarouselApi) => {
    if (!instance) return;
    setCanPrev(instance.canScrollPrev());
    setCanNext(instance.canScrollNext());
  }, []);

  const goPrev = useCallback(() => {
    api?.scrollPrev();
  }, [api]);

  const goNext = useCallback(() => {
    api?.scrollNext();
  }, [api]);

  useEffect(() => {
    if (!api) return;
    setApi?.(api);
    syncButtons(api);
    api.on("reInit", syncButtons);
    api.on("select", syncButtons);
    return () => {
      api.off("reInit", syncButtons);
      api.off("select", syncButtons);
    };
  }, [api, setApi, syncButtons]);

  return (
    <CarouselCtx.Provider value={{ viewportRef, api, canPrev, canNext, goPrev, goNext }}>
      <div
        role="region"
        aria-roledescription="carousel"
        className={cn("relative w-full", className)}
        {...rest}
      >
        {children}
      </div>
    </CarouselCtx.Provider>
  );
}

export function CarouselContent({
  className,
  children,
  ...rest
}: ComponentPropsWithoutRef<"div">): React.ReactElement {
  const { viewportRef } = useCarouselState();

  return (
    <div ref={viewportRef} className="overflow-hidden">
      <div className={cn("flex will-change-transform", className)} {...rest}>
        {children}
      </div>
    </div>
  );
}

export function CarouselItem({
  className,
  children,
  ...rest
}: ComponentPropsWithoutRef<"div">): React.ReactElement {
  return (
    <div
      role="group"
      aria-roledescription="slide"
      className={cn("min-w-0 shrink-0 grow-0 basis-full", className)}
      {...rest}
    >
      {children}
    </div>
  );
}

export function CarouselPrevious({
  className,
  ...rest
}: ComponentPropsWithoutRef<"button">): React.ReactElement {
  const { goPrev, canPrev } = useCarouselState();

  return (
    <button
      type="button"
      onClick={goPrev}
      disabled={!canPrev}
      aria-label="Previous slide"
      className={cn(
        "inline-flex h-9 w-9 items-center justify-center rounded-full bg-slate-900/70 text-white shadow transition hover:bg-brand-600 disabled:opacity-40",
        className
      )}
      {...rest}
    >
      <FiChevronLeft className="h-4 w-4" aria-hidden="true" />
    </button>
  );
}

export function CarouselNext({
  className,
  ...rest
}: ComponentPropsWithoutRef<"button">): React.ReactElement {
  const { goNext, canNext } = useCarouselState();

  return (
    <button
      type="button"
      onClick={goNext}
      disabled={!canNext}
      aria-label="Next slide"
      className={cn(
        "inline-flex h-9 w-9 items-center justify-center rounded-full bg-slate-900/70 text-white shadow transition hover:bg-brand-600 disabled:opacity-40",
        className
      )}
      {...rest}
    >
      <FiChevronRight className="h-4 w-4" aria-hidden="true" />
    </button>
  );
}
