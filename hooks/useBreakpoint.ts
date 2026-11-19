"use client";

import { useEffect, useState } from "react";

export function useBreakpoint(minWidth = 768): boolean {
  const [isAbove, setIsAbove] = useState(false);

  useEffect(() => {
    const media = window.matchMedia(`(min-width: ${minWidth}px)`);
    const apply = () => setIsAbove(media.matches);
    apply();
    media.addEventListener("change", apply);
    return () => media.removeEventListener("change", apply);
  }, [minWidth]);

  return isAbove;
}
