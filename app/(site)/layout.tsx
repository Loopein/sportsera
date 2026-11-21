export default function SiteLayout({ children }: Readonly<{ children: React.ReactNode }>): React.ReactElement {
  return <div className="w-full px-2 py-4 sm:px-3 md:px-4 md:py-8">{children}</div>;
}

