import Link from "next/link";
import Image from "next/image";
import { ENTERPRISE_STATS, ENTERPRISE_STEPS } from "./homeData";

function ArrowRightIcon({ className }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={className} aria-hidden>
      <path fillRule="evenodd" d="M3 10a.75.75 0 01.75-.75h10.638L10.23 5.29a.75.75 0 111.04-1.08l5.5 5.25a.75.75 0 010 1.08l-5.5 5.25a.75.75 0 11-1.04-1.08l4.158-3.96H3.75A.75.75 0 013 10z" clipRule="evenodd" />
    </svg>
  );
}

function StatIcon({ type }) {
  const className = "h-5 w-5 text-[#0056D2]";
  const icons = {
    cities: "M15 10.5a3 3 0 11-6 0 3 3 0 016 0z M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z",
    candidates: "M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z",
    date: "M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5",
    shifts: "M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z",
  };

  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className} aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" d={icons[type]} />
    </svg>
  );
}

function StepIcon({ type }) {
  const className = "h-5 w-5 text-[#0056D2]";
  const icons = {
    discovery: "M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z",
    matching: "M7.5 21L3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5",
    verification: "M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z",
    proposal: "M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z",
    support: "M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l-.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z",
  };

  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className} aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" d={icons[type]} />
    </svg>
  );
}

const EnterpriseSection = () => {
  return (
    <section className="bg-white py-10 lg:py-14">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-10">
        <div className="overflow-hidden rounded-2xl bg-[#e8f1ff] px-6 py-8 sm:px-8 lg:px-10 lg:py-10">
          <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-12 lg:gap-6">
            <div className="lg:col-span-4">
              <h2 className="text-2xl font-bold leading-tight text-[#0b1a33] sm:text-[1.7rem]">
                Conducting an Exam Across Multiple Cities?
              </h2>
              <p className="mt-4 text-sm leading-relaxed text-slate-600">
                One Requirement. Multiple Cities. One Dashboard. For organizations
                that need to conduct exams, assessments or training programs across
                multiple locations.
              </p>
              <Link
                href="/enterprise"
                className="mt-6 inline-flex items-center gap-2 rounded-lg bg-[#0056D2] px-5 py-3 text-sm font-bold text-white hover:bg-[#0046b0]"
              >
                Request Enterprise Proposal
                <ArrowRightIcon className="h-4 w-4" />
              </Link>
            </div>

            <div className="lg:col-span-5">
              <div className="grid grid-cols-2 gap-3">
                {ENTERPRISE_STATS.map((stat) => (
                  <div key={stat.label} className="flex items-center gap-3 rounded-xl bg-white px-4 py-3.5 shadow-sm">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#eef5ff]">
                      <StatIcon type={stat.icon} />
                    </span>
                    <div>
                      <p className="text-lg font-bold leading-tight text-[#0b1a33]">{stat.value}</p>
                      <p className="text-xs text-slate-500">{stat.label}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-5">
                {ENTERPRISE_STEPS.map((step) => (
                  <div key={step.label} className="flex flex-col items-center rounded-xl bg-white px-2 py-3 text-center shadow-sm">
                    <StepIcon type={step.icon} />
                    <p className="mt-1.5 text-[10px] font-semibold leading-tight text-slate-600">{step.label}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative mx-auto h-64 w-full max-w-xs overflow-hidden rounded-xl shadow-lg sm:h-72 lg:col-span-3 lg:mx-0 lg:h-[300px] lg:max-w-none">
              <Image
                src="https://images.unsplash.com/photo-1560250097-0b93528c311a?w=500&q=80"
                alt="Enterprise professional reviewing center bookings"
                fill
                className="object-cover object-top"
                sizes="(max-width: 1024px) 80vw, 25vw"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default EnterpriseSection;
