import Link from "next/link";

function ArrowRightIcon({ className }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={className} aria-hidden>
      <path fillRule="evenodd" d="M3 10a.75.75 0 01.75-.75h10.638L10.23 5.29a.75.75 0 111.04-1.08l5.5 5.25a.75.75 0 010 1.08l-5.5 5.25a.75.75 0 11-1.04-1.08l4.158-3.96H3.75A.75.75 0 013 10z" clipRule="evenodd" />
    </svg>
  );
}

function TestTakerIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 64" fill="none" className="mx-auto h-16 w-20" aria-hidden>
      <rect x="8" y="6" width="64" height="44" rx="4" fill="#c5cae9" />
      <rect x="14" y="12" width="52" height="32" rx="2" fill="#fff" />
      <circle cx="58" cy="44" r="12" fill="#1fe8a3" />
      <path d="M54 44l3 3 6-6" stroke="#051224" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <rect x="28" y="54" width="24" height="4" rx="2" fill="#9fa8da" />
    </svg>
  );
}

function OrganizationIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 64" fill="none" className="mx-auto h-16 w-20" aria-hidden>
      <rect x="18" y="8" width="44" height="52" rx="3" fill="#fff" stroke="#c5cae9" strokeWidth="2" />
      <rect x="26" y="18" width="28" height="3" rx="1.5" fill="#c5cae9" />
      <rect x="26" y="26" width="20" height="3" rx="1.5" fill="#c5cae9" />
      <circle cx="52" cy="46" r="14" fill="#1fe8a3" />
      <path d="M52 40l1.5 3 3.5.5-2.5 2.5.5 3.5-3-1.5-3 1.5.5-3.5-2.5-2.5 3.5-.5z" fill="#051224" />
    </svg>
  );
}

const SERVICE_CARDS = [
  {
    title: "Test Takers",
    subtitle: "Your path to a successful exam experience",
    icon: TestTakerIcon,
    links: [
      { label: "Find Your Exam", href: "#find-your-exam" },
      { label: "Before Your Exam", href: "#before-your-exam" },
      { label: "On Exam Day", href: "#on-exam-day" },
      { label: "After Your Exam", href: "#after-your-exam" },
      { label: "Get Testing Support", href: "#testing-support" },
    ],
  },
  {
    title: "Organizations & Districts",
    subtitle: "Tailored solutions that evolve with your needs",
    icon: OrganizationIcon,
    links: [
      { label: "Assessment Development", href: "#assessment-development" },
      { label: "Global Delivery", href: "#global-delivery" },
      { label: "Education Solutions", href: "#education-solutions" },
      { label: "Success Stories", href: "#success-stories" },
      { label: "Partner with Us", href: "#partner-with-us" },
    ],
  },
];

function ServiceCard({ card }) {
  const Icon = card.icon;

  return (
    <div className="flex flex-col rounded-2xl bg-[#e8eaf6] p-8 lg:p-10">
      <Icon />
      <h2 className="mt-6 text-center text-xl font-bold text-[#0b1a33] sm:text-2xl">
        {card.title}
      </h2>
      <p className="mt-2 text-center text-sm text-[#4a5568] sm:text-base">
        {card.subtitle}
      </p>

      <ul className="mt-8 space-y-3">
        {card.links.map((link) => (
          <li key={link.label}>
            <Link
              href={link.href}
              className="group flex items-center justify-between rounded-xl bg-[#c5cae9]/70 px-5 py-3.5 text-sm font-semibold text-[#0b1a33] transition-colors hover:bg-[#b39ddb]/50 sm:text-base"
            >
              {link.label}
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#0b1a33] text-white transition-transform group-hover:translate-x-0.5">
                <ArrowRightIcon className="h-3.5 w-3.5" />
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

const ServiceCardsSection = () => {
  return (
    <section className="bg-white py-14 lg:py-20">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-8 px-4 sm:px-6 lg:grid-cols-2 lg:gap-10 lg:px-10">
        {SERVICE_CARDS.map((card) => (
          <ServiceCard key={card.title} card={card} />
        ))}
      </div>
    </section>
  );
};

export default ServiceCardsSection;
