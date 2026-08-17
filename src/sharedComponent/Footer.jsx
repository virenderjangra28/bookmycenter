import Link from "next/link";
import Image from "next/image";
import logo from "../../public/logo.jpeg";

const FOOTER_COLUMNS = [
  {
    title: "Exams",
    icon: "award",
    links: [ 
      { label: "Find Your Exam", href: "#find-your-exam" },
      { label: "Before Your Exam", href: "#before-your-exam" },
      { label: "Accommodations", href: "#accommodations" },
      { label: "On Exam Day", href: "#on-exam-day" },
      { label: "After Your Exam", href: "#after-your-exam" },
      { label: "Frequently Asked Questions", href: "#faq" },
      { label: "Test Center Closures", href: "#test-center-closures" },
    ],
  },
  {
    title: "Why BookMyCenter",
    icon: "briefcase",
    links: [
      { label: "Assessment Development", href: "#assessment-development" },
      { label: "Global Delivery", href: "#global-delivery" },
      { label: "Candidate Experience", href: "#candidate-experience" },
      { label: "Program Growth", href: "#program-growth" },
      { label: "Security", href: "#security" },
      { label: "Finetune AI", href: "#finetune-ai" },
      { label: "Client Resources", href: "#client-resources" },
      { label: "Become a Test Center", href: "#become-a-test-center" },
    ],
  },
  {
    title: "Resources",
    icon: "chat",
    links: [
      { label: "Success Stories", href: "#success-stories" },
      { label: "Guides and Whitepapers", href: "#guides-whitepapers" },
      { label: "Webinars", href: "#webinars" },
      { label: "Events", href: "#events" },
      { label: "Blog", href: "#blog" },
    ],
    extraLinks: [
      { label: "Solutions", href: "#solutions" },
      { label: "Education", href: "#education" },
      { label: "Markets We Serve", href: "#markets" },
    ],
  },
  {
    title: "About Us",
    icon: "clipboard",
    links: [
      { label: "Leadership", href: "#leadership" },
      { label: "Global Offices", href: "#global-offices" },
      { label: "BookMyCenter Exams", href: "#bookmycenter-exams" },
      { label: "Press Room", href: "#press-room" },
      { label: "Careers", href: "#careers" },
    ],
    extraLinks: [{ label: "CONTACT US", href: "#contact", uppercase: true }],
  },
];

const LEGAL_LINKS = [
  { label: "Privacy", href: "#privacy" },
  { label: "Accessibility", href: "#accessibility" },
  { label: "Terms", href: "#terms" },
  { label: "Ethics", href: "#ethics" },
  { label: "Responsible AI", href: "#responsible-ai" },
];

const SOCIAL_LINKS = [
  { label: "LinkedIn", href: "#linkedin", icon: "linkedin" },
  { label: "X", href: "#x", icon: "x" },
  { label: "YouTube", href: "#youtube", icon: "youtube" },
  { label: "Instagram", href: "#instagram", icon: "instagram" },
];

function ColumnIcon({ type }) {
  const icons = {
    award: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M16.5 18.75h-9m9 0a3 3 0 013 3h-15a3 3 0 013-3m9 0v-3.375c0-.621-.503-1.125-1.125-1.125h-.871M7.5 18.75v-3.375c0-.621.504-1.125 1.125-1.125h.872m5.007 0H9.497m5.007 0a7.454 7.454 0 01-.982-3.172M9.497 14.25a7.454 7.454 0 00.981-3.172M5.25 4.236c-.982.143-1.954.317-2.916.52A6.003 6.003 0 007.73 9.728M5.25 4.236V4.5c0 2.108.966 3.99 2.48 5.228M5.25 4.236V2.721C7.456 2.41 9.71 2.25 12 2.25c2.291 0 4.545.16 6.75.47v1.516M7.73 9.728a6.726 6.726 0 002.748 1.35m8.272-6.842V4.5c0 2.108-.966 3.99-2.48 5.228m2.48-5.492a46.32 46.32 0 012.916.52 6.003 6.003 0 01-5.395 4.972m0 0a6.726 6.726 0 01-2.749 1.35m0 0a6.772 6.772 0 01-3.044 0"
      />
    ),
    briefcase: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 00.75-1.661V8.706c0-1.081-.39-2.164-1.128-2.976a14.162 14.162 0 00-2.073-1.852 14.162 14.162 0 00-2.073 1.852c-.738.812-1.128 1.895-1.128 2.976v3.783a2.18 2.18 0 00.75 1.661m0 0a2.18 2.18 0 01-2.18 2.18H5.43a2.18 2.18 0 01-2.18-2.18m16.5 0V9.75a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 9.75v4.4"
      />
    ),
    chat: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z"
      />
    ),
    clipboard: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z"
      />
    ),
  };

  return (
    <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-[#1a6eb5] text-white">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        className="h-[18px] w-[18px]"
        aria-hidden
      >
        {icons[type]}
      </svg>
    </span>
  );
}

function SocialIcon({ type }) {
  const className = "h-5 w-5";

  const icons = {
    linkedin: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
      </svg>
    ),
    x: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
    youtube: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
        <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
      </svg>
    ),
    instagram: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
      </svg>
    ),
  };

  return icons[type];
}

function FooterColumn({ column }) {
  return (
    <div className="min-w-0">
      <div className="mb-4 flex items-center gap-2.5">
        <ColumnIcon type={column.icon} />
        <h3 className="text-base font-bold text-white">{column.title}</h3>
      </div>

      <ul className="space-y-2.5 border-l border-[#1a6eb5]/60 pl-4">
        {column.links.map((link) => (
          <li key={link.label}>
            <Link
              href={link.href}
              className="text-sm text-white/90 transition-colors hover:text-white"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>

      {column.extraLinks?.length ? (
        <ul className="mt-5 space-y-2.5 border-l border-[#1a6eb5]/60 pl-4">
          {column.extraLinks.map((link) => (
            <li key={link.label}>
              <Link
                href={link.href}
                className={`text-sm font-bold text-white transition-colors hover:text-white/80 ${
                  link.uppercase ? "tracking-wide" : ""
                }`}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}

const Footer = () => {
  return (
    <footer className="mt-auto bg-[#051224] border-t border-white/10 text-white">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-10 lg:py-16">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
          {FOOTER_COLUMNS.map((column) => (
            <FooterColumn key={column.title} column={column} />
          ))}
        </div>

        <div className="mt-12 flex flex-col items-start justify-between gap-6 border-t border-white/10 pt-8 sm:flex-row sm:items-center">
          <Link href="/" className="inline-flex shrink-0">
            {/* <Image
              src={logo}
              alt="BookMyCenter"
              width={180}
              height={44}
              className="h-9 w-auto brightness-0 invert"
              style={{ width: "auto", height: "auto" }}
            /> */}
            <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 40 40"
                className="h-9 w-9"
                aria-hidden
              >
                <rect width="40" height="40" fill="#000000" />

                <path
                  fill="#3B82F6"
                  d="M20 2.5c-7.18 0-13 5.82-13 13 0 9.75 13 21.5 13 21.5s13-11.75 13-21.5c0-7.18-5.82-13-13-13z"
                />

                <rect
                  x="14"
                  y="10"
                  width="12"
                  height="10"
                  rx="1.2"
                  fill="#FFFFFF"
                />

                <path
                  d="M16 12.2h8M16 14.7h8M16 17.2h5"
                  stroke="#3B82F6"
                  strokeWidth="1.3"
                  strokeLinecap="round"
                />
              </svg>
              <span className="text-[17px] font-bold tracking-tight text-[#FFF]">BookMyCenter</span>
          </Link>

          <div className="flex items-center gap-5">
            {SOCIAL_LINKS.map((social) => (
              <Link
                key={social.label}
                href={social.href}
                aria-label={social.label}
                className="text-white transition-opacity hover:opacity-75"
              >
                <SocialIcon type={social.icon} />
              </Link>
            ))}
          </div>
        </div>

        <div className="mt-8 flex flex-col items-start justify-between gap-4 border-t border-white/10 pt-6 sm:flex-row sm:items-center">
          <nav aria-label="Legal links" className="flex flex-wrap gap-x-5 gap-y-2">
            {LEGAL_LINKS.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="text-xs text-white/80 transition-colors hover:text-white"
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <p className="text-xs text-white/70">© Copyright {new Date().getFullYear()}</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
