import Link from "next/link";

const FOOTER_COLUMNS = [
  {
    title: "Book",
    links: [
      { label: "Book a Center", href: "/book-a-center" },
      { label: "Explore Centers", href: "/explore-center" },
      { label: "Enterprise", href: "/enterprise" },
    ],
  },
  {
    title: "Partners",
    links: [
      { label: "List Your Center", href: "/become-partner" },
      { label: "Partner Portal", href: "/login" },
    ],
  },
  {
    title: "Services",
    links: [
      { label: "Center Sourcing", href: "/#services" },
      { label: "Audits & Manpower", href: "/#services" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About", href: "/#about" },
      { label: "Resources", href: "/#resources" },
      { label: "Contact / Login", href: "/login" },
    ],
  },
];

const Footer = () => {
  return (
    <footer className="mt-auto bg-[#050a18] text-white">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-10 lg:py-16">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-5 lg:gap-8">
          <div className="sm:col-span-2 lg:col-span-1">
            <Link href="/" className="inline-block text-[22px] font-bold leading-none tracking-tight">
              <span className="text-white">BookMy</span>
              <span className="text-[#3b82f6]">Center</span>
            </Link>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-[#94a3b8]">
              Find, compare and book verified Test, Assessment, Training and Business
              Centers—one city or hundreds.
            </p>
          </div>

          {FOOTER_COLUMNS.map((column) => (
            <div key={column.title}>
              <h3 className="text-base font-bold text-white">{column.title}</h3>
              <ul className="mt-4 space-y-3">
                {column.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-[#94a3b8] transition-colors hover:text-white"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </footer>
  );
};

export default Footer;
