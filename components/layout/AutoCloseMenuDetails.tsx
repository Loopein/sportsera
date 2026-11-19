"use client";

import { useEffect } from "react";

const MENU_DETAILS_SELECTOR = "details[data-menu-dropdown]";

function closeOpenMenus(): void {
  document.querySelectorAll<HTMLDetailsElement>(`${MENU_DETAILS_SELECTOR}[open]`).forEach((menu) => {
    menu.open = false;
  });
}

export function AutoCloseMenuDetails(): null {
  useEffect(() => {
    const onDocumentClick = (event: MouseEvent): void => {
      const target = event.target as Node | null;
      if (!target) return;

      document.querySelectorAll<HTMLDetailsElement>(`${MENU_DETAILS_SELECTOR}[open]`).forEach((menu) => {
        const summary = menu.querySelector(":scope > summary");
        if (summary?.contains(target)) return;

        if (menu.contains(target)) {
          // Defer closing to avoid interrupting button/link default actions.
          window.setTimeout(() => {
            menu.open = false;
          }, 0);
          return;
        }

        menu.open = false;
      });
    };

    const onKeyDown = (event: KeyboardEvent): void => {
      if (event.key === "Escape") {
        closeOpenMenus();
      }
    };

    document.addEventListener("click", onDocumentClick);
    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.removeEventListener("click", onDocumentClick);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, []);

  return null;
}
