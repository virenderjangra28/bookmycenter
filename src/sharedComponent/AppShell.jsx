"use client";

import { usePathname } from "next/navigation";
import Header from "./Header";
import Footer from "./Footer";

export default function AppShell({ children }) {
  const pathname = usePathname();
  const isClientPortal = pathname?.startsWith("/client");

  if (isClientPortal) {
    return children;
  }

  return (
    <>
      <Header />
      {children}
      <Footer />
    </>
  );
}
