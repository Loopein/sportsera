export default function SiteLayout({ children }: Readonly<{ children: React.ReactNode }>): React.ReactElement {
  return <div className="w-full px-2 py-2.5 sm:px-3 md:px-4 md:py-4">{children}</div>;
}

