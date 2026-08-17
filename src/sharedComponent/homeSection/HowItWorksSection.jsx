import { HOW_IT_WORKS } from "./homeData";

function StepIcon({ type, className }) {
  const icons = {
    search: (
      <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
    ),
    compare: (
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v17.25m0 0c-1.472 0-2.882.265-4.185.75M12 20.25c1.472 0 2.882.265 4.185.75M18.75 4.97A48.416 48.416 0 0012 4.5c-2.291 0-4.545.16-6.75.47m13.5 0c1.01.143 2.01.317 3 .52m-3-.52l2.62 10.726c.122.499-.106 1.028-.589 1.202a15.65 15.65 0 01-5.441 0c-.483-.174-.711-.703-.59-1.202L18.75 4.971zm-16.5.52c.99-.203 1.99-.377 3-.52m0 0l2.62 10.726c.122.499-.106 1.028-.589 1.202a15.65 15.65 0 005.441 0c-.483-.174-.711-.703-.59-1.202L5.25 4.971z" />
    ),
    book: (
      <>
        <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 15.75l1.5 1.5 4.5-4.5" />
      </>
    ),
    conduct: (
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
    ),
  };

  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className} aria-hidden>
      {icons[type]}
    </svg>
  );
}

function DashedArrow({ className }) {
  return (
    <svg viewBox="0 0 48 16" fill="none" className={className} aria-hidden>
      <path d="M2 8h36" stroke="currentColor" strokeWidth="1.6" strokeDasharray="4 4" strokeLinecap="round" />
      <path d="M34 3.5L42 8l-8 4.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

const HowItWorksSection = () => {
  return (
    <section className="bg-white py-12 lg:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-10">
        <h2 className="text-center text-2xl font-bold text-[#0b1a33] sm:text-[1.75rem]">
          How BookMyCenter Works
        </h2>

        <div className="mt-12 flex flex-col gap-8 lg:flex-row lg:items-start lg:gap-0">
          {HOW_IT_WORKS.map((item, index) => (
            <div key={item.step} className="flex flex-1 items-start lg:min-w-0">
              <div className="flex min-w-0 flex-1 items-start gap-3">
                <span className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-xl ${item.color}`}>
                  <StepIcon type={item.icon} className="h-7 w-7" />
                </span>
                <div className="min-w-0 pt-0.5">
                  <p className="text-sm font-bold text-[#0056D2]">{item.step}</p>
                  <h3 className="text-[17px] font-bold leading-tight text-[#0b1a33]">{item.title}</h3>
                  <p className="mt-1.5 text-[13px] leading-relaxed text-slate-500">{item.description}</p>
                </div>
              </div>

              {index < HOW_IT_WORKS.length - 1 ? (
                <DashedArrow className="mt-5 hidden w-10 shrink-0 text-slate-300 lg:block xl:w-12" />
              ) : null}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
