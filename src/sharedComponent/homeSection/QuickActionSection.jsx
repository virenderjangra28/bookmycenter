import Link from "next/link";
import { VALUE_PROPS } from "./homeData";

function ArrowRightIcon({ className }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={className} aria-hidden>
      <path fillRule="evenodd" d="M3 10a.75.75 0 01.75-.75h10.638L10.23 5.29a.75.75 0 111.04-1.08l5.5 5.25a.75.75 0 010 1.08l-5.5 5.25a.75.75 0 11-1.04-1.08l4.158-3.96H3.75A.75.75 0 013 10z" clipRule="evenodd" />
    </svg>
  );
}

function PeopleIcon({ className }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className={className} aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
    </svg>
  );
}

function DocumentIcon({ className }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className={className} aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
    </svg>
  );
}

function ValuePropIcon({ type }) {
  const className = "h-6 w-6 text-[#0056D2]";
  const icons = {
    shield: (
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
    ),
    calendar: (
      <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
    ),
    compare: (
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
    ),
    support: (
      <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.34.027-.68.052-1.02.072v3.091l-3-3c-1.354 0-2.694-.055-4.02-.163a2.115 2.115 0 01-.825-.242m9.345-8.334a2.126 2.126 0 00-.476-.095 48.64 48.64 0 00-8.048 0c-1.131.094-1.976 1.057-1.976 2.192v4.286c0 .837.46 1.58 1.155 1.951m9.345-8.334V6.637c0-1.621-1.152-3.026-2.76-3.235A48.455 48.455 0 0011.25 3c-2.115 0-4.198.137-6.24.402-1.608.209-2.76 1.614-2.76 3.235v6.226c0 1.621 1.152 3.026 2.76 3.235.577.075 1.157.14 1.74.194V21l4.155-4.155" />
    ),
  };

  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className} aria-hidden>
      {icons[type]}
    </svg>
  );
}

const QuickActionSection = () => {
  return (
    <section className="bg-white pt-14 pb-8 sm:pt-16 lg:pt-[72px] lg:pb-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-10">
        <div className="flex justify-center">
          <div className="flex flex-col items-center gap-8 sm:flex-row sm:items-start sm:gap-8">
            <div className="flex flex-col items-start">
              <Link
                href="/book-a-center"
                className="inline-flex h-10 w-[200px] items-center justify-center gap-1.5 rounded-md bg-[#0056D2] text-[15px] font-semibold text-white transition hover:bg-[#0046b0]"
              >
                Book a Center
                <ArrowRightIcon className="h-4 w-4" />
              </Link>
              <Link
                href="/book-a-center"
                className="mt-5 inline-flex items-center gap-1.5 whitespace-nowrap text-[13px] font-medium text-slate-500 hover:text-[#0056D2]"
              >
                <PeopleIcon className="h-4 w-4 shrink-0" />
                Organizations → Find &amp; Book Centers
              </Link>
            </div>

            <div className="flex flex-col items-start">
              <Link
                href="/become-partner"
                className="inline-flex h-10 w-[200px] items-center justify-center gap-1.5 rounded-md border border-[#0056D2] bg-white text-[15px] font-semibold text-[#0056D2] transition hover:bg-[#f4f8ff]"
              >
                List Your Center
                <ArrowRightIcon className="h-4 w-4" />
              </Link>
              <Link
                href="/become-partner"
                className="mt-5 inline-flex items-center gap-1.5 whitespace-nowrap text-[13px] font-medium text-slate-500 hover:text-[#0056D2]"
              >
                <DocumentIcon className="h-4 w-4 shrink-0" />
                Center Owners → List &amp; Monetize Centers
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-6 border-y border-slate-200 py-8 sm:grid-cols-2 lg:grid-cols-4 lg:gap-0">
          {VALUE_PROPS.map((item, index) => (
            <div
              key={item.label}
              className={`flex gap-3.5 lg:px-6 ${index > 0 ? "lg:border-l lg:border-slate-200" : ""}`}
            >
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#eef5ff]">
                <ValuePropIcon type={item.icon} />
              </span>
              <div>
                <p className="text-sm font-bold text-[#0b1a33]">{item.label}</p>
                <p className="mt-1 text-[13px] leading-relaxed text-slate-500">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default QuickActionSection;
