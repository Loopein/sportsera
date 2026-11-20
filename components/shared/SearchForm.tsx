import { SearchControl } from "@/components/ui/search-control";

type SearchFormProps = {
  defaultValue?: string;
  placeholder?: string;
  name?: string;
  action?: string;
};

export function SearchForm({
  defaultValue = "",
  placeholder = "Search sports, live matches, teams, athletes, leagues...",
  name = "q",
  action = "/search"
}: SearchFormProps): React.ReactElement {
  return (
    <form action={action} className="w-full">
      <label htmlFor="hero-search-input" className="sr-only">
        Search
      </label>
      <SearchControl
        id="hero-search-input"
        name={name}
        defaultValue={defaultValue}
        placeholder={placeholder}
        icon={
          <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.3-4.3" />
          </svg>
        }
      />
    </form>
  );
}
