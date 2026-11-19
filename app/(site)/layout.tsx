export default function SiteLayout({ children }: Readonly<{ children: React.ReactNode }>): React.ReactElement {
  return <div className="mx-auto w-full max-w-[1600px] px-3 py-4 sm:px-4 md:py-8">{children}</div>;
}

