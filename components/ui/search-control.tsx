import type { ChangeEventHandler, ReactNode } from "react";
import { FiSearch } from "react-icons/fi";
import { cn } from "@/lib/utils/text";
import { Card } from "@/components/ui/card";

type SearchControlProps = {
  id: string;
  name: string;
  placeholder: string;
  value?: string;
  defaultValue?: string;
  onChange?: ChangeEventHandler<HTMLInputElement>;
  icon?: ReactNode;
  className?: string;
  inputClassName?: string;
  submitClassName?: string;
  submitLabel?: string;
  submitAriaLabel?: string;
};

export function SearchControl({
  id,
  name,
  placeholder,
  value,
  defaultValue,
  onChange,
  icon,
  className,
  inputClassName,
  submitClassName,
  submitLabel = "Go",
  submitAriaLabel = "Search"
}: SearchControlProps): React.ReactElement {
  return (
    <Card
      className={cn(
        "flex items-center gap-2 p-1 transition-all duration-300 focus-within:border-brand-300 focus-within:shadow-md",
        className
      )}
    >
      <span className="pl-3 text-slate-400" aria-hidden="true">
        {icon ?? <FiSearch className="h-5 w-5" />}
      </span>
      <input
        id={id}
        name={name}
        type="search"
        value={value}
        defaultValue={defaultValue}
        onChange={onChange}
        placeholder={placeholder}
        className={cn(
          "w-full rounded-xl border-0 bg-transparent px-1 py-3 text-sm text-slate-900 outline-none ring-brand-300 placeholder:text-slate-400 focus:ring-0",
          inputClassName
        )}
        autoComplete="off"
      />
      <button
        type="submit"
        className={cn(
          "rounded-xl bg-gradient-to-r from-brand-600 to-brand-500 px-4 py-2.5 text-xs font-semibold uppercase tracking-wide text-white transition hover:from-brand-700 hover:to-brand-600",
          submitClassName
        )}
        aria-label={submitAriaLabel}
      >
        {submitLabel}
      </button>
    </Card>
  );
}

