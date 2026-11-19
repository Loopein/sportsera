"use client";

import { useEffect, useState } from "react";
import { SearchControl } from "@/components/ui/search-control";

type SearchBarProps = {
  defaultValue?: string;
  placeholder?: string;
  onSearchChange?: (value: string) => void;
  name?: string;
  action?: string;
};

export function SearchBar({
  defaultValue = "",
  placeholder = "Search matches, teams, players, series...",
  onSearchChange,
  name = "q",
  action
}: SearchBarProps): React.ReactElement {
  const [value, setValue] = useState(defaultValue);

  useEffect(() => {
    const timer = setTimeout(() => onSearchChange?.(value), 300);
    return () => clearTimeout(timer);
  }, [onSearchChange, value]);

  return (
    <form action={action} className="w-full">
      <label htmlFor="search-input" className="sr-only">
        Search
      </label>
      <SearchControl
        id="search-input"
        name={name}
        value={value}
        onChange={(event) => setValue(event.target.value)}
        placeholder={placeholder}
      />
    </form>
  );
}

