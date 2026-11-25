export default function SiteLayout({ children }: Readonly<{ children: React.ReactNode }>): React.ReactElement {
  return <div data-site-shell className="w-full min-w-0 px-2.5 py-2.5 sm:px-3.5 md:px-4 md:py-4 lg:px-5">{children}</div>;
}

