import Link from "next/link";
import { notFound } from "next/navigation";
import { getExamById } from "../../data/exams";

function BuildingIcon({ className }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden
    >
      <path d="M11.7 2.805a.75.75 0 01.6 0A60.65 60.65 0 0122.5 8.5h.008v11a.75.75 0 01-.424.674l-9.6 4.5a.75.75 0 01-1.152-.082A22.28 22.28 0 011.5 19.5V8.5a60.65 60.65 0 019.2-5.695z" />
    </svg>
  );
}

function BookIcon({ className }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden
    >
      <path d="M11.25 4.533A9.707 9.707 0 006 3a9.735 9.735 0 00-3.25.555.75.75 0 00-.5.707v14.25a.75.75 0 001 .707A8.237 8.237 0 016 18.75c1.995 0 3.823.707 5.25 1.886V4.533zM12.75 20.636A8.214 8.214 0 0118 18.75c.966 0 1.89.166 2.75.47a.75.75 0 001-.708V4.262a.75.75 0 00-.5-.707A9.735 9.735 0 0018 3a9.707 9.707 0 00-5.25 1.533v16.103z" />
    </svg>
  );
}

function InfoIcon({ className }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden
    >
      <path
        fillRule="evenodd"
        d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm8.706-1.442c1.146-.573 2.437.463 2.126 1.706l-.709 2.836.042-.02a.75.75 0 01.67 1.34l-.04.022c-1.147.573-2.438-.463-2.127-1.706l.71-2.836-.042.02a.75.75 0 11-.671-1.34l.041-.022zM12 9a.75.75 0 100-1.5.75.75 0 000 1.5z"
        clipRule="evenodd"
      />
    </svg>
  );
}

function ArrowLeftIcon({ className }) {
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
        d="M11.78 5.22a.75.75 0 010 1.06L8.06 10l3.72 3.72a.75.75 0 11-1.06 1.06l-4.25-4.25a.75.75 0 010-1.06l4.25-4.25a.75.75 0 011.06 0z"
        clipRule="evenodd"
      />
    </svg>
  );
}

function InfoCard({ icon: Icon, title, links }) {
  return (
    <div className="flex flex-col rounded-xl bg-white px-6 py-8 shadow-sm">
      <div className="mb-4 flex justify-center">
        <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-[#eef1f5] text-[#0b1a33]">
          <Icon className="h-5 w-5" />
        </span>
      </div>
      <h2 className="text-center text-lg font-bold text-[#0b1a33]">{title}</h2>
      <ul className="mt-5 space-y-2.5 text-center">
        {links.map((link) => (
          <li key={link.label}>
            <Link
              href={link.href}
              className="text-sm font-medium text-[#2563eb] underline underline-offset-2 transition-colors hover:text-[#1d4ed8]"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default async function ExamDetailPage({ params }) {
  const { id } = await params;
  const exam = getExamById(id);

  if (!exam) {
    notFound();
  }

  const infoCards = [
    {
      icon: BuildingIcon,
      title: "Test Center Exam",
      links: [
        { label: "Location", href: "#location" },
        { label: "Reschedule/Cancel", href: "#reschedule-cancel" },
      ],
    },
    {
      icon: BookIcon,
      title: "Preparation",
      links: [
        { label: "Prepare for test day", href: "#prepare-for-test-day" },
        { label: "What to Expect", href: "#what-to-expect" },
        { label: "Prometric Test Centers FAQ", href: "#prometric-faq" },
        { label: "EZT Test Centers FAQ", href: "#ezt-faq" },
      ],
    },
    {
      icon: InfoIcon,
      title: "Information",
      links: [{ label: exam.websiteLabel, href: exam.websiteHref }],
    },
  ];

  return (
    <main className="flex-1">
      <section className="bg-gradient-to-r from-[#eef1f5] via-[#f3f4f8] to-[#eef1f5]">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-10 lg:py-10">
          <Link
            href="/find-your-exam"
            className="inline-flex items-center gap-1 text-sm font-semibold text-[#2563eb] transition-colors hover:text-[#1d4ed8]"
          >
            <ArrowLeftIcon className="h-4 w-4" />
            Back
          </Link>

          <div className="mt-6 grid grid-cols-1 items-center gap-8 lg:grid-cols-[1fr_auto] lg:gap-12">
            <h1 className="text-2xl font-bold leading-tight text-[#0b1a33] sm:text-3xl lg:text-4xl">
              {exam.title}
            </h1>
            <div className="flex justify-start lg:justify-end">
              <div className="flex h-28 w-44 items-center justify-center rounded-lg border border-[#e5e7eb] bg-white px-4 shadow-sm sm:h-32 sm:w-52">
                <span className="text-center text-lg font-bold tracking-wide text-[#0b1a33]">
                  {exam.name}
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#e8eaf6]/60 py-12 lg:py-16">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-6 px-4 sm:px-6 md:grid-cols-3 lg:px-10 lg:gap-8">
          {infoCards.map((card) => (
            <InfoCard key={card.title} {...card} />
          ))}
        </div>
      </section>

      <section className="bg-white py-12 lg:py-16">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-10">
          <article className="space-y-10">
            <div>
              <h2 className="text-xl font-bold text-[#0b1a33] sm:text-2xl">
                What Time to Arrive for Your Exam
              </h2>
              <div className="mt-4 space-y-4 text-base leading-relaxed text-[#4a5568]">
                <p>
                  Plan to arrive at the test center at least 30 minutes before
                  your scheduled appointment time. This allows enough time for
                  check-in, identity verification, and security procedures
                  before your exam begins.
                </p>
                <p>
                  If you arrive more than 30 minutes after your scheduled start
                  time, you may be denied entry and could lose your exam fee.
                  Contact the test center or exam sponsor if you expect to be
                  delayed.
                </p>
              </div>
            </div>

            <div>
              <h2 className="text-xl font-bold text-[#0b1a33] sm:text-2xl">
                What to Bring to Your Exam
              </h2>
              <p className="mt-4 text-base leading-relaxed text-[#4a5568]">
                You must bring valid, government-issued photo identification that
                includes your signature. Acceptable IDs include a passport,
                driver&apos;s license, or national identity card. International
                candidates should bring a passport. Temporary IDs, photocopies,
                and expired documents are not accepted. Review your exam
                confirmation email for any additional materials required for{" "}
                {exam.name}.
              </p>
            </div>
          </article>
        </div>
      </section>
    </main>
  );
}
