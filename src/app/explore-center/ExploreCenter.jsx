import Link from "next/link";
import { FEATURED_CENTERS } from "@/sharedComponent/homeSection/homeData";
import Image from "next/image";

const BADGES = ["BMC Premium", "BMC Verified", "BMC Select"];

function cityName(location) {
  return String(location || "").split(",")[0]?.trim() || "Location pending";
}

function isYes(value) {
  return value === true || value === "Yes";
}

function toExploreCenter(center, index) {
  const tags = [`${center.seats || 0} seats`];
  if (isYes(center.cctvSecurity)) tags.push("CCTV");
  if (isYes(center.generatorAvailable)) tags.push("DG Backup");

  return {
    id: center.id,
    name: center.name,
    location: cityName(center.location),
    badge: BADGES[index % BADGES.length],
    tags,
  };
}

function CenterPlaceholder({image}) {
  return (
    <div
      className="h-[168px] w-full overflow-hidden rounded-t-2xl"
      style={{
        backgroundImage: "repeating-linear-gradient(90deg, #d7e8fb 0 52px, #f4f8fc 52px 72px)",
      }}
      aria-hidden
    />
    // <Image src={image} alt="image" />
  );
}

function CenterCard({ center }) {
  return (
    <article className="flex flex-col overflow-hidden rounded-2xl border border-[#eef2f6] bg-white shadow-[0_12px_32px_rgba(15,23,42,0.06)]">
      <CenterPlaceholder image={center.image}/>
      <div className="flex flex-1 flex-col p-5">
        <span className="inline-flex w-fit rounded-full bg-[#d8f5e3] px-2.5 py-1 text-[11px] font-semibold text-[#1b8a4a]">
          {center.badge}
        </span>
        <h2 className="mt-3 text-[17px] font-bold leading-snug text-[#0b1a33]">{center.name}</h2>
        <p className="mt-1 text-sm text-[#94a3b8]">{center.location}</p>
        <div className="mt-3 flex flex-wrap gap-2">
          {center.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full bg-[#f1f5f9] px-2.5 py-1 text-xs font-medium text-[#475569]"
            >
              {tag}
            </span>
          ))}
        </div>
        <Link
          href={`/center-details/${center.id}`}
          className="mt-5 inline-flex h-10 w-fit items-center justify-center rounded-lg bg-[#0056D2] px-4 text-sm font-semibold text-white transition hover:bg-[#0046b0]"
        >
          View Details
        </Link>
      </div>
    </article>
  );
}

export default function ExploreCenter({ centers = [] }) {
  const list = (centers.length > 0 ? centers : FEATURED_CENTERS).map(toExploreCenter);

  return (
    <main className="flex-1 bg-white">
      <section className="bg-[#eef6ff]">
        <div className="mx-auto max-w-7xl px-4 py-14 text-left sm:px-6 sm:py-16 lg:px-10 lg:py-20">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#0056D2]">
            Marketplace Discovery
          </p>
          <h1 className="mt-3 max-w-3xl text-3xl font-bold tracking-tight text-[#0b1a33] sm:text-4xl lg:text-[2.6rem] lg:leading-tight">
            Explore verified centers across cities and categories.
          </h1>
          <p className="mt-4 max-w-2xl text-[15px] text-[#64748b] sm:text-base">
            Use map, capacity, facilities and verification filters to shortlist the right infrastructure.
          </p>
        </div>
      </section>

      <section className="bg-white">
        <div className="mx-auto grid max-w-7xl gap-6 px-4 py-12 sm:grid-cols-2 sm:px-6 lg:grid-cols-3 lg:gap-8 lg:px-10 lg:py-16">
          {list.map((center) => (
            <CenterCard key={center.id} center={center} />
          ))}
        </div>
      </section>
    </main>
  );
}
