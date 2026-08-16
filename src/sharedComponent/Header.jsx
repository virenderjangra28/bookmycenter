"use client";

import Link from "next/link";
import { useCallback, useContext, useEffect, useRef, useState } from "react";
import logo from "../../public/logo.jpeg";
import Image from "next/image";
import ProfileDropdown from "./ProfileDropdown";
import UserContext from "@/context/userContext";

const UTILITY_LINKS = [
  { label: "Book A Center", href: "/book-a-center" },
  { label: "Become a Test Center", href: "/become-partner" },
];

const NAV_ITEMS = [
  {
    label: "Exams",
    subtitle: "Explore our resources for test takers",
    children: [
      {
        label: "Find Your Exam",
        description: "Search our site to find your exam, schedule and more",
        href: "/find-your-exam",
      },
      {
        label: "Before Your Exam",
        description: "Learn how to prepare before exam day",
        href: "#before-your-exam",
      },
      {
        label: "Accommodations",
        description: "Access information about accommodations",
        href: "#accommodations",
      },
      {
        label: "On Exam Day",
        description: "Get important details for test day",
        href: "#on-exam-day",
      },
      {
        label: "After Your Exam",
        description: "Find out how to access scores and more",
        href: "#after-your-exam",
      },
      {
        label: "Frequently Asked Questions",
        description: "Get answers to the most common questions",
        href: "#faq",
      },
      {
        label: "Book A Center",
        description: "Learn about any current test center closures",
        href: "/book-a-center",
      },
    ],
  },
  {
    label: "Why BookMyCenter",
    subtitle: "Discover why candidates and centers trust us",
    children: [
      {
        label: "Our Approach",
        description: "See how we simplify exam center discovery and booking",
        href: "#our-approach",
      },
      {
        label: "Trusted Centers",
        description: "Browse verified test centers across India and worldwide",
        href: "#trusted-centers",
      },
      {
        label: "AI Proctoring",
        description: "Learn about secure, AI-powered remote proctoring",
        href: "#ai-proctoring",
      },
      {
        label: "Success Stories",
        description: "Read how organizations scale assessments with us",
        href: "#success-stories",
      },
    ],
  },
  {
    label: "Solutions",
    subtitle: "Assessment solutions for every hiring and training need",
    children: [
      {
        label: "Campus Hiring",
        description: "Run large-scale campus drives with confidence",
        href: "#campus-hiring",
      },
      {
        label: "Lateral Hiring",
        description: "Evaluate experienced talent with role-specific tests",
        href: "#lateral-hiring",
      },
      {
        label: "Employee Training",
        description: "Track upskilling progress with structured assessments",
        href: "#employee-training",
      },
      {
        label: "Skill Assessment",
        description: "Measure competencies with customizable test modules",
        href: "#skill-assessment",
      },
    ],
  },
  {
    label: "Education",
    subtitle: "Tools for schools, colleges, and universities",
    children: [
      {
        label: "Schools & Colleges",
        description: "Schedule and manage exams for academic institutions",
        href: "#schools-colleges",
      },
      {
        label: "Universities",
        description: "Support entrance exams and semester assessments",
        href: "#universities",
      },
      {
        label: "Online Courses",
        description: "Deliver proctored exams for digital learning programs",
        href: "#online-courses",
      },
      {
        label: "Question Bank",
        description: "Access a rich library of ready-to-use questions",
        href: "#question-bank",
      },
    ],
  },
  {
    label: "Markets",
    subtitle: "Find exam centers and services in your region",
    children: [
      {
        label: "India",
        description: "Discover centers and exams available across India",
        href: "#india",
      },
      {
        label: "Asia Pacific",
        description: "Explore assessment options throughout APAC",
        href: "#asia-pacific",
      },
      {
        label: "Europe",
        description: "Browse centers and partners across Europe",
        href: "#europe",
      },
      {
        label: "North America",
        description: "Find test locations and services in North America",
        href: "#north-america",
      },
    ],
  },
  {
    label: "Resources",
    subtitle: "Guides, tools, and documentation for test takers",
    children: [
      {
        label: "Analytics Dashboard",
        description: "Monitor performance with real-time reporting",
        href: "#analytics",
      },
      {
        label: "Auto Evaluation",
        description: "Speed up grading with automated scoring",
        href: "#auto-evaluation",
      },
      {
        label: "Custom Branding",
        description: "White-label the experience for your organization",
        href: "#custom-branding",
      },
      {
        label: "Documentation",
        description: "Browse guides and API docs for administrators",
        href: "#documentation",
      },
    ],
  },
  {
    label: "About Us",
    subtitle: "Learn more about BookMyCenter and our mission",
    children: [
      {
        label: "Our Story",
        description: "How we built a platform to book centers with ease",
        href: "#our-story",
      },
      {
        label: "Team",
        description: "Meet the people behind BookMyCenter",
        href: "#team",
      },
      {
        label: "Careers",
        description: "Join us and help shape the future of assessments",
        href: "#careers",
      },
      {
        label: "Contact",
        description: "Reach out for support, partnerships, or inquiries",
        href: "#contact",
      },
    ],
  }
];

function ChevronDownIcon({ className }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 20 20"
      fill="currentColor"
      className={className}
      aria-hidden
    >
      <path
        fillRule="evenodd"
        d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.94a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
        clipRule="evenodd"
      />
    </svg>
  );
}

function ArrowRightIcon({ className }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 20 20"
      fill="currentColor"
      className={className}
      aria-hidden
    >
      <path
        fillRule="evenodd"
        d="M3 10a.75.75 0 01.75-.75h10.638L10.23 5.29a.75.75 0 111.04-1.08l5.5 5.25a.75.75 0 010 1.08l-5.5 5.25a.75.75 0 11-1.04-1.08l4.158-3.96H3.75A.75.75 0 013 10z"
        clipRule="evenodd"
      />
    </svg>
  );
}

function SearchIcon({ className }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 20 20"
      fill="currentColor"
      className={className}
      aria-hidden
    >
      <path
        fillRule="evenodd"
        d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z"
        clipRule="evenodd"
      />
    </svg>
  );
}

function IconMenu({ className }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      className={className}
      aria-hidden
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
      />
    </svg>
  );
}

function ArrowCircleButton({ size = "md" }) {
  const sizeClasses =
    size === "lg" ? "h-8 w-8" : "h-7 w-7 shrink-0";
  const iconClasses = size === "lg" ? "h-4 w-4" : "h-3.5 w-3.5";

  return (
    <span
      className={`inline-flex items-center justify-center rounded-full bg-[#0b1a33] text-white ${sizeClasses}`}
      aria-hidden
    >
      <ArrowRightIcon className={iconClasses} />
    </span>
  );
}

function Logo() {
  return (
    <Link href="/" className="inline-flex shrink-0 items-center">
      <Image
        src={logo}
        alt="BookMyCenter"
        width={180}
        height={44}
        className="h-9 w-auto object-contain sm:h-10"
        style={{ width: "auto", height: "73px" }}
        priority
      />
    </Link>
  );
}

const MAIN_NAV_HEIGHT = 72;
const UTILITY_BAR_HEIGHT = 40;
const SCROLL_THRESHOLD = 16;
const SHOW_UTILITY_BAR_AT = 64;
const DESKTOP_MEDIA_QUERY = "(min-width: 1024px)";

function UtilityBar({ visible, barRef }) {
  return (
    <div
      ref={barRef}
      className={`hidden border-[#d9dde3] bg-[#f3f4f6] transition-[grid-template-rows,opacity] duration-300 ease-in-out lg:grid ${
        visible
          ? "grid-rows-[1fr] border-b opacity-100"
          : "pointer-events-none grid-rows-[0fr] border-b-0 opacity-0"
      }`}
    > 
    
      <div className="overflow-hidden">
        <div
          className={`mx-auto flex h-10 max-w-7xl items-center justify-between px-4 transition-transform duration-300 ease-in-out sm:px-6 lg:px-10 ${
            visible ? "translate-y-0" : "-translate-y-full"
          }`}
        >
          <div className="flex items-center gap-4 sm:gap-6">
            {UTILITY_LINKS.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="text-xs font-semibold text-[#2f3640] transition-colors hover:text-[#0b1a33] sm:text-sm"
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="flex shrink-0 items-center gap-4 whitespace-nowrap sm:gap-6">
            <Link
              href="#search"
              className="flex items-center gap-1.5 text-xs font-semibold text-[#2f3640] transition-colors hover:text-[#0b1a33] sm:text-sm"
            >
              <SearchIcon className="h-3.5 w-3.5" />
              Search
            </Link>
            <Link
              href="#contact"
              className="text-xs font-semibold text-[#2f3640] transition-colors hover:text-[#0b1a33] sm:text-sm"
            >
              Contact Us
            </Link>
            <button
              type="button"
              className="flex items-center gap-1 text-xs font-semibold text-[#2f3640] transition-colors hover:text-[#0b1a33] sm:text-sm"
              aria-haspopup="listbox"
              aria-label="Select language"
            >
              English
              <ChevronDownIcon className="h-3.5 w-3.5" />
            </button>
            <Link
              href="/login"
              className="text-xs font-semibold text-[#2f3640] transition-colors hover:text-[#0b1a33] sm:text-sm"
            >
              Login/SignUp
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

function MegaMenuCard({ item, onClose }) {
  return (
    <Link
      href={item.href}
      onClick={onClose}
      className="group flex min-h-[140px] flex-col rounded-xl bg-white p-5 shadow-sm transition-shadow hover:shadow-md sm:p-6"
    >
      <div className="mb-3 flex items-start justify-between gap-3">
        <h3 className="text-base font-bold leading-snug text-[#0b1a33] sm:text-lg">
          {item.label}
        </h3>
        <ArrowCircleButton />
      </div>
      <p className="text-sm leading-relaxed text-[#4a5568]">{item.description}</p>
    </Link>
  );
}

function MegaMenuPanel({ item, onClose }) {
  const panelRef = useRef(null);
  const bridgeRef = useRef(null);

  useEffect(() => {
    const onKeyDown = (event) => {
      if (event.key === "Escape") onClose();
    };

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [onClose]);

  const handlePanelLeave = (event) => {
    const relatedTarget = event.relatedTarget;

    if (
      relatedTarget instanceof Node &&
      (panelRef.current?.contains(relatedTarget) ||
        bridgeRef.current?.contains(relatedTarget))
    ) {
      return;
    }

    onClose();
  };

  return (
    <div className="absolute inset-x-0 top-full z-50 flex justify-center pointer-events-none px-4 pb-4 sm:px-6 lg:px-10 lg:pb-6">
      <div className="relative w-[70%] pointer-events-auto">
        <div
          ref={bridgeRef}
          className="absolute -top-2 inset-x-0 h-2"
          onMouseLeave={handlePanelLeave}
        />
        <div
          ref={panelRef}
          role="region"
          aria-label={`${item.label} menu`}
          className="rounded-2xl bg-[#eef1f5] px-5 py-8 shadow-lg sm:px-8 sm:py-10 lg:px-12 lg:py-12"
          onMouseLeave={handlePanelLeave}
        >
          <div className="mb-8 text-center lg:mb-10">
            <div className="mb-2 flex items-center justify-center gap-2.5">
              <h2 className="text-2xl font-bold text-[#0b1a33] sm:text-3xl lg:text-4xl">
                {item.label}
              </h2>
              <ArrowCircleButton size="lg" />
            </div>
            <p className="text-sm text-[#5a6a7a] sm:text-base">{item.subtitle}</p>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-5">
            {item.children.map((child) => (
              <MegaMenuCard key={child.label} item={child} onClose={onClose} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function DesktopNavTrigger({ item, isOpen, onOpen, onClose }) {
  return (
    <button
      type="button"
      className={`flex items-center gap-1 whitespace-nowrap text-sm font-bold transition-colors ${
        isOpen ? "text-[#1e3a5f]" : "text-[#0b1a33] hover:text-[#1e3a5f]"
      }`}
      aria-expanded={isOpen}
      aria-haspopup="true"
      onMouseEnter={onOpen}
      onFocus={onOpen}
      onClick={() => (isOpen ? onClose() : onOpen())}
    >
      {item.label}
      <ChevronDownIcon
        className={`h-3.5 w-3.5 transition-transform ${isOpen ? "rotate-180" : ""}`}
      />
    </button>
  );
}

function MobileNavDropdown({ item, isOpen, onToggle, onNavigate }) {
  return (
    <div className="border-b border-[#e5e7eb] py-1">
      <button
        type="button"
        className="flex w-full items-center justify-between py-2.5 text-sm font-bold text-[#0b1a33]"
        aria-expanded={isOpen}
        onClick={onToggle}
      >
        {item.label}
        <ChevronDownIcon
          className={`h-4 w-4 transition-transform ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      {isOpen ? (
        <div className="pb-3">
          <p className="mb-3 px-1 text-xs text-[#5a6a7a]">{item.subtitle}</p>
          <div className="space-y-2">
            {item.children.map((child) => (
              <Link
                key={child.label}
                href={child.href}
                className="block rounded-lg bg-[#f3f4f6] p-3 transition-colors hover:bg-[#eef1f5]"
                onClick={onNavigate}
              >
                <span className="block text-sm font-semibold text-[#0b1a33]">
                  {child.label}
                </span>
                <span className="mt-1 block text-xs leading-relaxed text-[#4a5568]">
                  {child.description}
                </span>
              </Link>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}

const Header = () => {
  const headerRef = useRef(null);
  const mobileMenuRef = useRef(null);
  const utilityBarRef = useRef(null);
  const lastScrollY = useRef(0);
  const utilityBarVisibleRef = useRef(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [openMobileDropdown, setOpenMobileDropdown] = useState(null);
  const [utilityBarVisible, setUtilityBarVisible] = useState(true);
  const [isDesktop, setIsDesktop] = useState(false);
  const [utilityBarHeight, setUtilityBarHeight] = useState(0);
  const { user } = useContext(UserContext);
  const role = user?.role != null ? String(user.role) : "";
  const isLoggedIn = role === "1" || role === "2";

  utilityBarVisibleRef.current = utilityBarVisible;

  const headerSpacerHeight =
    MAIN_NAV_HEIGHT +
    (isDesktop && utilityBarVisible ? utilityBarHeight : 0);

  const activeItem = NAV_ITEMS.find((item) => item.label === openDropdown);

  const closeMobileMenu = useCallback(() => {
    setMobileMenuOpen(false);
    setOpenMobileDropdown(null);
  }, []);

  const handleDesktopOpen = useCallback((label) => {
    setOpenDropdown(label);
  }, []);

  const handleDesktopClose = useCallback(() => {
    setOpenDropdown(null);
  }, []);

  useEffect(() => {
    if (!openDropdown) return;

    const onPointerDown = (event) => {
      if (headerRef.current?.contains(event.target)) return;
      handleDesktopClose();
    };

    document.addEventListener("mousedown", onPointerDown);
    return () => document.removeEventListener("mousedown", onPointerDown);
  }, [openDropdown, handleDesktopClose]);

  useEffect(() => {
    const mediaQuery = window.matchMedia(DESKTOP_MEDIA_QUERY);

    const handleViewportChange = () => {
      setIsDesktop(mediaQuery.matches);
    };

    handleViewportChange();
    mediaQuery.addEventListener("change", handleViewportChange);
    return () => mediaQuery.removeEventListener("change", handleViewportChange);
  }, []);

  useEffect(() => {
    const onScroll = () => {
      if (!window.matchMedia(DESKTOP_MEDIA_QUERY).matches) return;

      const currentScrollY = window.scrollY;

      if (currentScrollY <= SHOW_UTILITY_BAR_AT) {
        if (!utilityBarVisibleRef.current) {
          setUtilityBarVisible(true);
        }
        lastScrollY.current = currentScrollY;
        return;
      }

      const delta = currentScrollY - lastScrollY.current;
      if (Math.abs(delta) < SCROLL_THRESHOLD) return;

      if (delta > 0 && utilityBarVisibleRef.current && currentScrollY > SHOW_UTILITY_BAR_AT) {
        setUtilityBarVisible(false);
      }

      lastScrollY.current = currentScrollY;
    };

    lastScrollY.current = window.scrollY;
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const utilityBarElement = utilityBarRef.current;
    if (!isDesktop || !utilityBarElement || !utilityBarVisible) {
      setUtilityBarHeight(0);
      return;
    }

    const updateUtilityBarHeight = () => {
      setUtilityBarHeight(utilityBarElement.offsetHeight);
    };

    updateUtilityBarHeight();

    const resizeObserver = new ResizeObserver(updateUtilityBarHeight);
    resizeObserver.observe(utilityBarElement);

    return () => resizeObserver.disconnect();
  }, [isDesktop, utilityBarVisible]);

  return (
    <>
      <header
        ref={headerRef}
        className="fixed inset-x-0 top-0 z-50 bg-white shadow-sm"
      >
          {!isLoggedIn && (
            <UtilityBar visible={utilityBarVisible} barRef={utilityBarRef} />
          )}
        

      <div
        className="relative border-b border-[#e5e7eb] bg-white"
        onMouseLeave={(event) => {
          const relatedTarget = event.relatedTarget;
          if (
            relatedTarget instanceof Node &&
            event.currentTarget.contains(relatedTarget)
          ) {
            return;
          }
          handleDesktopClose();
        }}
      >
        <div className="mx-auto flex h-[72px] max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-10">
          <Logo />
          {!isLoggedIn && (
             <nav
             className="hidden items-center gap-5 lg:flex xl:gap-7"
             aria-label="Main navigation"
           >
             {NAV_ITEMS.map((item) => (
               <DesktopNavTrigger
                 key={item.label}
                 item={item}
                 isOpen={openDropdown === item.label}
                 onOpen={() => handleDesktopOpen(item.label)}
                 onClose={handleDesktopClose}
               />
             ))}
           </nav>
          )}

          <div className="flex items-center gap-3">
            {isLoggedIn ? (
              <ProfileDropdown
                name={user?.name ?? "User"}
                email={user?.email ?? ""}
                role={role}
              />
            ) : null}

            {!isLoggedIn ? (
          <button
            type="button"
            className="flex h-10 w-10 items-center justify-center rounded-md text-[#0b1a33] transition hover:bg-[#f3f4f6] lg:hidden"
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-nav-menu"
            onClick={() => setMobileMenuOpen((open) => !open)}
          >
            <IconMenu className="h-6 w-6" />
          </button>
            ) : null}
          </div>
        </div>

        {activeItem ? (
          <div className="hidden lg:block">
            <MegaMenuPanel item={activeItem} onClose={handleDesktopClose} />
          </div>
        ) : null}
      </div>

      {mobileMenuOpen && !isLoggedIn ? (
          <nav
          ref={mobileMenuRef}
          id="mobile-nav-menu"
          className="fixed inset-x-0 top-[72px] z-40 max-h-[calc(100dvh-72px)] overflow-y-auto overscroll-y-contain border-b border-[#e5e7eb] bg-white px-4 py-2 lg:hidden"
          aria-label="Mobile navigation"
        >
            <div className="mb-2 flex flex-wrap gap-4 border-b border-[#e5e7eb] pb-3">
            {UTILITY_LINKS.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="text-xs font-semibold text-[#2f3640]"
                onClick={closeMobileMenu}
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="#search"
              className="flex items-center gap-1 text-xs font-semibold text-[#2f3640]"
              onClick={closeMobileMenu}
            >
              <SearchIcon className="h-3.5 w-3.5" />
              Search
            </Link>
            <Link
              href="#contact"
              className="text-xs font-semibold text-[#2f3640]"
              onClick={closeMobileMenu}
            >
              Contact Us
            </Link>
            <Link
              href="/login"
              className="text-xs font-semibold text-[#2f3640]"
              onClick={closeMobileMenu}
            >
              Login/SignUp
            </Link>
          </div>

          {NAV_ITEMS.map((item) => (
            <MobileNavDropdown
              key={item.label}
              item={item}
              isOpen={openMobileDropdown === item.label}
              onToggle={() =>
                setOpenMobileDropdown((current) =>
                  current === item.label ? null : item.label,
                )
              }
              onNavigate={closeMobileMenu}
            />
          ))}
        </nav>
      ) : null}
      </header>
      <div
        aria-hidden
        className="shrink-0 transition-[height] duration-300 ease-in-out"
        style={{ height: headerSpacerHeight }}
      />
    </>
  );
};

export default Header;
