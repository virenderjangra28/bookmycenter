"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useContext, useState } from "react";
import UserContext from "@/context/userContext";

export const CLIENT_NAV = [
  { label: "Dashboard", href: "/client/dashboard" },
  { label: "Search Centers", href: "/client/search-centers" },
  { label: "Saved Centers", href: "/client/saved-centers" },
  { label: "Booking Requests", href: "/client/booking-requests" },
  { label: "Upcoming Bookings", href: "/client/upcoming-bookings" },
  { label: "Past Bookings", href: "/client/past-bookings" },
  { label: "Update Center", href: "/client/update-center" },
  { label: "Contracts / PO", href: "/client/contracts" },
  { label: "Payments", href: "/client/payments" },
  { label: "Reports", href: "/client/reports" },
  { label: "Support", href: "/client/support" },
];

function MenuIcon({ className }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className} aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
    </svg>
  );
}

function CloseIcon({ className }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className} aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
  );
}

function isActivePath(pathname, href) {
  if (href === "/client/dashboard") {
    return pathname === href;
  }
  return pathname === href || pathname.startsWith(`${href}/`);
}

function NavList({ pathname, onNavigate }) {
  return (
    <nav className="flex flex-1 flex-col gap-1" aria-label="Client portal">
      {CLIENT_NAV.map((item) => {
        const active = isActivePath(pathname, item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            className={`rounded-md px-1 py-3 text-[15px] leading-6 transition-colors ${
              active
                ? "font-semibold text-white"
                : "font-normal text-white/90 hover:text-white"
            }`}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}

export default function Leftmenu() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useContext(UserContext);
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = async () => {
    setMobileOpen(false);
    await logout();
    router.push("/");
  };

  const closeMobile = () => setMobileOpen(false);

  return (
    <>
      <div className="flex items-center justify-between bg-[#0b1a33] px-4 py-3 lg:hidden">
        <Link href="/client/dashboard" className="text-base font-bold text-white">
          BookMyCenter
        </Link>
        <button
          type="button"
          onClick={() => setMobileOpen(true)}
          className="rounded-md p-2 text-white hover:bg-white/10"
          aria-label="Open menu"
        >
          <MenuIcon className="h-6 w-6" />
        </button>
      </div>

      {mobileOpen ? (
        <button
          type="button"
          className="fixed inset-0 z-40 bg-black/40 lg:hidden"
          aria-label="Close menu overlay"
          onClick={closeMobile}
        />
      ) : null}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-[220px] flex-col overflow-y-auto bg-[#0b1a33] px-6 py-8 text-white transition-transform lg:static lg:z-auto lg:h-full lg:shrink-0 lg:translate-x-0 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="mb-10 flex items-start justify-between">
          <Link href="/client/dashboard" className="text-[20px] font-bold tracking-tight text-white" onClick={closeMobile}>
            BookMyCenter
          </Link>
          <button
            type="button"
            onClick={closeMobile}
            className="rounded-md p-1 text-white/80 hover:bg-white/10 lg:hidden"
            aria-label="Close menu"
          >
            <CloseIcon className="h-5 w-5" />
          </button>
        </div>

        <NavList pathname={pathname} onNavigate={closeMobile} />

        <div className="mt-8 border-t border-white/10 pt-5">
          <p className="truncate text-sm font-medium text-white">{user?.name || "Client"}</p>
          <p className="mt-0.5 truncate text-xs text-white/60">{user?.email || ""}</p>
          <div className="mt-3 flex flex-col gap-1">
            <Link
              href="/client/profile"
              onClick={closeMobile}
              className="text-sm text-white/80 hover:text-white"
            >
              My Profile
            </Link>
            <button
              type="button"
              onClick={handleLogout}
              className="text-left text-sm text-white/70 hover:text-white"
            >
              Logout
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
