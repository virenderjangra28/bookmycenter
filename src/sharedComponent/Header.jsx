"use client";

import Image from "next/image";
import Link from "next/link";
import { useContext, useState } from "react";
import logo from "../../public/logo.jpeg";
import UserContext from "@/context/userContext";
import ProfileDropdown from "./ProfileDropdown";

const NAV_LINKS = [
  { label: "Book a Center", href: "/book-a-center" },
  { label: "Enterprise", href: "#enterprise" },
  { label: "Explore Centers", href: "/book-a-center" },
];

const DROPDOWN_LINKS = {
  Services: [
    { label: "CBT Centers", href: "/book-a-center?type=CBT" },
    { label: "PBT Centers", href: "/book-a-center?type=PBT" },
    { label: "Training Centers", href: "/book-a-center?type=Training" },
    { label: "Certification", href: "/book-a-center?type=Certification" },
  ],
  Resources: [
    { label: "How It Works", href: "#how-it-works" },
    { label: "Find Your Exam", href: "/find-your-exam" },
    { label: "FAQ", href: "#faq" },
    { label: "Contact Us", href: "#contact" },
  ],
};

function LogoMark() {
  return (
    <Link href="/" className="inline-flex shrink-0 items-center gap-2">
      {/* <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40" className="h-9 w-9" aria-hidden>
        <path fill="#0056D2" d="M20 2.5c-7.18 0-13 5.82-13 13 0 9.75 13 21.5 13 21.5s13-11.75 13-21.5c0-7.18-5.82-13-13-13z" />
        <rect x="14" y="10" width="12" height="10" rx="1.2" fill="#fff" />
        <path d="M16 12.2h8M16 14.7h8M16 17.2h5" stroke="#0056D2" strokeWidth="1.3" strokeLinecap="round" />
      </svg>
      <span className="text-[17px] font-bold tracking-tight text-[#0b1a33]">
        BookMyCenter
      </span> */}
      <Image src={logo} alt="BookMyCenter" width={149} height={60} />
    </Link>
  );
}

function ChevronDownIcon({ className }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={className} aria-hidden>
      <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.94a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clipRule="evenodd" />
    </svg>
  );
}

function GlobeIcon({ className }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className} aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A8.966 8.966 0 013 12c0-1.577.406-3.06 1.12-4.332" />
    </svg>
  );
}

function NavDropdown({ label, items }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative" onMouseEnter={() => setOpen(true)} onMouseLeave={() => setOpen(false)}>
      <button
        type="button"
        className="flex items-center gap-1 text-sm font-medium text-[#334155] transition-colors hover:text-[#0056D2]"
        aria-expanded={open}
      >
        {label}
        <ChevronDownIcon className={`h-4 w-4 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      {open ? (
        <div className="absolute left-0 top-full z-50 mt-2 min-w-[200px] rounded-xl border border-slate-200 bg-white py-2 shadow-lg">
          {items.map((item) => (
            <Link key={item.label} href={item.href} className="block px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 hover:text-[#0056D2]">
              {item.label}
            </Link>
          ))}
        </div>
      ) : null}
    </div>
  );
}

const HomeHeader = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const context = useContext(UserContext);
  const user = context?.user;
  return (
    <>
      <header className="fixed inset-x-0 top-0 z-50 border-b border-slate-200/80 bg-white">
        <div className="mx-auto grid h-[72px] max-w-7xl grid-cols-[auto_1fr_auto] items-center gap-4 px-4 sm:px-6 lg:px-10">
          <LogoMark />

          <nav className="hidden items-center justify-center gap-7 lg:flex xl:gap-8" aria-label="Main navigation">
            {NAV_LINKS.map((link) => (
              <Link key={link.label} href={link.href} className="text-sm font-medium text-[#334155] transition-colors hover:text-[#0056D2]">
                {link.label}
              </Link>
            ))}
            {Object.entries(DROPDOWN_LINKS).map(([label, items]) => (
              <NavDropdown key={label} label={label} items={items} />
            ))}
          </nav>

          <div className="flex items-center justify-end gap-3 sm:gap-4">
            
            {user ? (
              <ProfileDropdown name={user.name} email={user.email} role={user.role} />
            ) : (
              <>
              <button type="button" className="hidden items-center gap-1.5 text-sm font-medium text-[#475569] md:flex" aria-label="Select region">
                <GlobeIcon className="h-4 w-4 text-[#0056D2]" />
                India / International
                <ChevronDownIcon className="h-3.5 w-3.5 text-slate-400" />
              </button>
              <Link href="/login" className="hidden text-sm font-medium text-[#0b1a33] hover:text-[#0056D2] sm:inline">
                Login
              </Link>
              <Link href="/become-partner" className="rounded-lg bg-[#0056D2] px-4 py-2 text-xs font-bold text-white hover:bg-[#0046b0] sm:px-5 sm:py-2.5 sm:text-sm">
                List Your Center
              </Link>
              </>
            )}
            
            <button
              type="button"
              className="flex h-10 w-10 items-center justify-center rounded-lg text-[#0b1a33] hover:bg-slate-100 lg:hidden"
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
              onClick={() => setMobileOpen((open) => !open)}
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-6 w-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
              </svg>
            </button>
          </div>
        </div>

        {mobileOpen ? (
          <nav className="border-t border-slate-200 bg-white px-4 py-4 lg:hidden" aria-label="Mobile navigation">
            {NAV_LINKS.map((link) => (
              <Link key={link.label} href={link.href} className="block py-2.5 text-sm font-semibold text-[#0b1a33]" onClick={() => setMobileOpen(false)}>
                {link.label}
              </Link>
            ))}
            {Object.entries(DROPDOWN_LINKS).map(([label, items]) => (
              <div key={label} className="border-t border-slate-100 py-2">
                <p className="py-1 text-xs font-bold uppercase tracking-wide text-slate-500">{label}</p>
                {items.map((item) => (
                  <Link key={item.label} href={item.href} className="block py-2 text-sm text-slate-700" onClick={() => setMobileOpen(false)}>
                    {item.label}
                  </Link>
                ))}
              </div>
            ))}
            <Link href="/login" className="block border-t border-slate-100 py-3 text-sm font-semibold" onClick={() => setMobileOpen(false)}>
              Login
            </Link>
          </nav>
        ) : null}
      </header>
      <div aria-hidden className="h-[72px] shrink-0" />
    </>
  );
};

export default HomeHeader;
