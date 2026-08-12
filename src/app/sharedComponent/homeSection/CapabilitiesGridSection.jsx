import Link from "next/link";

const CAPABILITIES = [
  {
    icon: "innovation",
    title: "Harness leading innovation",
    description:
      "Leverage AI-driven proctoring, auto-evaluation, and analytics to deliver smarter assessments at scale.",
    link: { label: "Explore Assessment Technology", href: "#assessment-technology" },
  },
  {
    icon: "flexibility",
    title: "Provide unlimited flexibility",
    description:
      "Choose from in-center, remote, or hybrid delivery models tailored to your program requirements.",
    link: { label: "Explore Delivery Models", href: "#delivery-models" },
  },
  {
    icon: "global",
    title: "Test virtually anywhere",
    description:
      "Access a worldwide network of verified centers across India, APAC, Europe, and North America.",
    link: { label: "Explore Global Reach", href: "#global-reach" },
  },
  {
    icon: "reliability",
    title: "Gain unmatched reliability",
    description:
      "Depend on enterprise-grade infrastructure built for high-volume, mission-critical exam delivery.",
  },
  {
    icon: "growth",
    title: "Achieve growth goals",
    description:
      "Scale your credentialing programs with tools designed to expand reach and improve outcomes.",
  },
  {
    icon: "security",
    title: "Ensure maximum security",
    description:
      "Protect exam integrity with advanced monitoring, identity verification, and secure data handling.",
  },
];

function CapabilityIcon({ type }) {
  const className = "h-5 w-5";

  const icons = {
    innovation: (
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
    ),
    flexibility: (
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 17.25v1.007a3 3 0 01-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0115 18.257V17.25m6-12V15a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 15V5.25m18 0A2.25 2.25 0 0018.75 3H5.25A2.25 2.25 0 003 5.25m18 0V12a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 12V5.25" />
    ),
    global: (
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418" />
    ),
    reliability: (
      <path strokeLinecap="round" strokeLinejoin="round" d="M11.42 15.17L17.25 21A2.652 2.652 0 0021 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 11-3.586-3.586l6.837-5.88m5.108-.233c.55-.164 1.163-.188 1.743-.14a4.5 4.5 0 004.486-6.336l-3.276 3.277a3.004 3.004 0 01-2.25-2.25l3.276-3.276a4.5 4.5 0 00-6.336 4.486c.091 1.076-.071 2.264-.904 2.95l-.102.085m-1.745 1.437L5.909 7.5H4.5L2.25 3.75l1.5-1.5L7.5 4.5v1.409l4.26 4.26m-1.745 1.437l1.745-1.437m6.615 8.206L15.75 15.75M4.867 19.125h.008v.008h-.008v-.008z" />
    ),
    growth: (
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.28m5.94 2.28l-2.28 5.941" />
    ),
    security: (
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
    ),
  };

  return (
    <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-white text-[#0b1a33] shadow-sm">
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className} aria-hidden>
        {icons[type]}
      </svg>
    </span>
  );
}

function CapabilityCard({ item }) {
  return (
    <div className="flex flex-col rounded-2xl bg-[#e8eaf6] p-6 lg:p-8">
      <CapabilityIcon type={item.icon} />
      <h3 className="mt-4 text-lg font-bold text-[#0b1a33] sm:text-xl">
        {item.title}
      </h3>
      <p className="mt-3 flex-1 text-sm leading-relaxed text-[#4a5568] sm:text-base">
        {item.description}
      </p>
      {item.link ? (
        <Link
          href={item.link.href}
          className="mt-5 inline-block text-sm font-bold text-[#0b1a33] underline underline-offset-4 transition-colors hover:text-[#1a6eb5]"
        >
          {item.link.label}
        </Link>
      ) : null}
    </div>
  );
}

const CapabilitiesGridSection = () => {
  return (
    <section className="bg-[#eef2ff] pb-14 lg:pb-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-10">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
          {CAPABILITIES.map((item) => (
            <CapabilityCard key={item.title} item={item} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default CapabilitiesGridSection;
