"use client";

import Link from "next/link";
import { useContext, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import UserContext from "@/context/userContext";

function getInitials(name = "") {
  const parts = name.trim().split(/\s+/).filter(Boolean);

  if (parts.length === 0) return "U";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();

  return `${parts[0][0] ?? ""}${parts[parts.length - 1][0] ?? ""}`.toUpperCase();
}

const ADMIN_MENU = [
  { label: "Dashboard", href: "/admin/dashboard" },
  { label: "User List", href: "/admin/user-list" },
];

const CLIENT_MENU = [
  { label: "Dashboard", href: "/client/dashboard" },
  { label: "Search Centers", href: "/client/search-centers" },
  { label: "Booking Requests", href: "/client/booking-requests" },
  { label: "Payments", href: "/client/payments" },
  { label: "My Profile", href: "/client/profile" },
];

export default function ProfileDropdown({
  name = "User",
  email = "",
  role = "2",
}) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef(null);
  const router = useRouter();
  const { logout } = useContext(UserContext);
  const menuItems = role === "1" ? ADMIN_MENU : CLIENT_MENU;

  const handleLogout = async () => {
    setOpen(false);
    await logout();
    router.push("/");
  };

  useEffect(() => {
    if (!open) return;

    const onPointerDown = (event) => {
      if (!containerRef.current?.contains(event.target)) {
        setOpen(false);
      }
    };

    const onKeyDown = (event) => {
      if (event.key === "Escape") {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        aria-expanded={open}
        aria-haspopup="menu"
        aria-label="Open profile menu"
        className="flex h-10 w-10 items-center justify-center rounded-full bg-[#0a7ea4] text-sm font-semibold text-white transition hover:bg-[#086a8a] focus:outline-none focus:ring-2 focus:ring-[#0a7ea4]/30"
      >
        <span aria-hidden>{getInitials(name)}</span>
      </button>

      {open ? (
        <div
          role="menu"
          className="absolute right-0 top-[calc(100%+0.5rem)] z-[60] w-56 overflow-hidden rounded-lg border border-[#e5e7eb] bg-white shadow-lg"
        >
          <div className="border-b border-[#e5e7eb] px-4 py-3">
            <p className="truncate text-sm font-semibold text-[#0b1a33]">{name}</p>
            {email ? (
              <p className="mt-0.5 truncate text-xs text-[#6b7280]">{email}</p>
            ) : null}
            <p className="mt-1 text-[10px] font-medium uppercase tracking-wide text-[#0a7ea4]">
              {role === "1" ? "Admin" : "Client"}
            </p>
          </div>

          {menuItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              role="menuitem"
              className="block px-4 py-2.5 text-sm text-[#374151] transition hover:bg-[#f3f4f6]"
              onClick={() => setOpen(false)}
            >
              {item.label}
            </Link>
          ))}

          <button
            type="button"
            role="menuitem"
            className="block w-full border-t border-[#e5e7eb] px-4 py-2.5 text-left text-sm text-[#b03a2e] transition hover:bg-[#fef2f2]"
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>
      ) : null}
    </div>
  );
}
