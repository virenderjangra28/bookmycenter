"use client";

import { useCallback, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { FEATURED_CENTERS } from "./homeData";

function AmenityIcon({ type }) {
  const className = "h-4 w-4 shrink-0 text-[#0056D2]";
  const icons = {
    seats:
      "M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z",
    labs: "M9 17.25v1.007a3 3 0 01-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0115 18.257V17.25m6-12V15a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 15V5.25m18 0A2.25 2.25 0 0018.75 3H5.25A2.25 2.25 0 003 5.25m18 0V12a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 12V5.25",
    internet:
      "M8.288 15.038a5.25 5.25 0 017.424 0M5.106 11.856c3.807-3.808 9.98-3.808 13.788 0M1.924 8.674c5.565-5.565 14.587-5.565 20.152 0M12.53 18.22l-.53.53-.53-.53a.75.75 0 011.06 0z",
    cctv: "M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0z",
    power: "m3.75 13.5 10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z",
    ac: "M12 3v18m0-18c2.5 3 2.5 6 0 9m0-9C9.5 6 9.5 9 12 12m0 9c2.5-3 2.5-6 0-9m0 9c-2.5-3-2.5-6 0-9M4.5 12H3m18 0h-1.5M6.34 6.34l-1.06-1.06m13.44 13.44-1.06-1.06M17.66 6.34l1.06-1.06M6.34 17.66l-1.06 1.06",
  };

  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className} aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" d={icons[type]} />
    </svg>
  );
}

function CheckIcon({ className }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={className} aria-hidden>
      <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
    </svg>
  );
}

function ChevronLeftIcon({ className }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={className} aria-hidden>
      <path fillRule="evenodd" d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z" clipRule="evenodd" />
    </svg>
  );
}

function ChevronRightIcon({ className }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={className} aria-hidden>
      <path fillRule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clipRule="evenodd" />
    </svg>
  );
}

function CenterCard({ center }) {
  const amenities = [
    { key: "seats", label: `${center.seats} Seats` },
    { key: "labs", label: `${center.labs} Labs` },
    { key: "internet", label: `${center.internet} Internet` },
    { key: "cctv", label: "CCTV" },
    { key: "power", label: "Power Backup" },
    { key: "ac", label: "AC" },
  ];

  return (
    <article className="flex h-full flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-[0_4px_18px_rgba(15,23,42,0.06)]">
      <div className="relative aspect-[16/10] w-full">
        <Image src={center.image} alt={center.name} fill className="object-cover" sizes="(max-width: 768px) 100vw, 25vw" />
        <span className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-full bg-[#0056D2] px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-white">
          <CheckIcon className="h-3 w-3" />
          BMC Verified
        </span>
        <button
          type="button"
          aria-label="Add to wishlist"
          className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-white text-slate-400 shadow-sm hover:text-red-500"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-4 w-4">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
          </svg>
        </button>
      </div>

      <div className="flex flex-1 flex-col p-4">
        <h3 className="text-[15px] font-bold leading-snug text-[#0b1a33]">{center.name}</h3>

        <div className="mt-1.5 flex items-center justify-between gap-2 text-[13px]">
          <span className="inline-flex min-w-0 items-center gap-1 truncate text-slate-500">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-3.5 w-3.5 shrink-0 text-[#0056D2]" aria-hidden>
              <path fillRule="evenodd" d="M9.69 18.933l.003.001C9.89 19.02 10 19 10 19s.11.02.308-.066l.002-.001.006-.003.018-.008a5.741 5.741 0 00.281-.14c.186-.096.377-.2.569-.313.408-.239.813-.529 1.2-.86C14.818 14.93 16 12.8 16 10a6 6 0 10-12 0c0 2.8 1.182 4.93 3.925 7.614.387.331.792.621 1.2.86.192.113.383.217.57.313a5.741 5.741 0 00.28.14l.018.008.006.003zM10 11.25a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
            </svg>
            {center.location}
          </span>
          <span className="inline-flex shrink-0 items-center gap-1 font-semibold text-[#0b1a33]">
            <span className="text-amber-400">★</span>
            {center.rating}
            <span className="font-normal text-slate-400">({center.reviews})</span>
          </span>
        </div>

        <div className="mt-4 grid grid-cols-3 gap-x-2 gap-y-2.5">
          {amenities.map((item) => (
            <div key={item.key} className="flex min-w-0 items-center gap-1.5">
              <AmenityIcon type={item.key} />
              <span className="truncate text-[11px] font-medium text-slate-500">{item.label}</span>
            </div>
          ))}
        </div>

        <div className="mt-4 flex items-center justify-between gap-2">
          <p className="text-[15px] font-bold text-[#0b1a33]">
            {center.price}
            <span className="text-[12px] font-normal text-slate-500"> / seat / shift</span>
          </p>
          {center.available ? (
            <p className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-600">
              <span className="flex h-4 w-4 items-center justify-center rounded-full bg-emerald-500 text-white">
                <CheckIcon className="h-2.5 w-2.5" />
              </span>
              Available
            </p>
          ) : (
            <p className="text-xs font-semibold text-amber-600">Limited</p>
          )}
        </div>

        <Link
          href="/book-a-center"
          className="mt-3 flex w-full items-center justify-center rounded-md border border-[#0056D2] py-2.5 text-sm font-semibold text-[#0056D2] transition hover:bg-[#0056D2] hover:text-white"
        >
          View Center
        </Link>
      </div>
    </article>
  );
}

const VISIBLE_COUNT = 4;

const FeaturedCentersSection = ({ centers = [] }) => {
  const list = centers.length > 0 ? centers : FEATURED_CENTERS;
  const [startIndex, setStartIndex] = useState(0);
  const maxStart = Math.max(0, list.length - VISIBLE_COUNT);

  const goPrev = useCallback(() => {
    setStartIndex((current) => (current <= 0 ? maxStart : current - 1));
  }, [maxStart]);

  const goNext = useCallback(() => {
    setStartIndex((current) => (current >= maxStart ? 0 : current + 1));
  }, [maxStart]);

  const visibleCenters = list.slice(startIndex, startIndex + VISIBLE_COUNT);

  return (
    <section className="bg-white py-12 lg:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-10">
        <div className="flex items-center justify-between gap-4">
          <h2 className="text-2xl font-bold text-[#0b1a33] sm:text-[1.75rem]">Featured Verified Centers</h2>
          <Link href="/book-a-center" className="inline-flex items-center gap-1 text-sm font-bold text-[#0056D2] hover:underline">
            View All Centers <span aria-hidden>→</span>
          </Link>
        </div>

        <div className="relative mt-8">
          {list.length > 4 && (
            <button
              type="button"
              onClick={goPrev}
              aria-label="Previous centers"
              className="absolute -left-4 top-1/2 z-10 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-slate-200 bg-white text-[#0b1a33] shadow-md hover:bg-slate-50 lg:flex"
            >
              <ChevronLeftIcon className="h-5 w-5" />
            </button>
          )}

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {visibleCenters.map((center) => (
              <CenterCard key={center.id} center={center} />
            ))}
          </div>
          {list.length > 4 && (
            <button
              type="button"
              onClick={goNext}
              aria-label="Next centers"
              className="absolute -right-4 top-1/2 z-10 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-slate-200 bg-white text-[#0b1a33] shadow-md hover:bg-slate-50 lg:flex"
            >
              <ChevronRightIcon className="h-5 w-5" />
            </button>
          )}
        </div>
        {list.length > 4 && (
          <div className="mt-6 flex justify-center gap-2">
            {Array.from({ length: maxStart + 1 }).map((_, index) => (
              <button
                key={index}
                type="button"
                aria-label={`Slide ${index + 1}`}
                onClick={() => setStartIndex(index)}
                className={`rounded-full transition-all ${index === startIndex ? "h-2 w-6 bg-[#0056D2]" : "h-2 w-2 bg-slate-300"}`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default FeaturedCentersSection;
