"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { SEARCH_CENTER_TYPES, SEARCH_LOCATIONS } from "./homeData";

const CAPACITY_OPTIONS = [
  { value: "50", label: "50 Seats" },
  { value: "100", label: "100 Seats" },
  { value: "150", label: "150 Seats" },
  { value: "200", label: "200 Seats" },
  { value: "250", label: "250 Seats" },
  { value: "300", label: "300+ Seats" },
];

function MapPinIcon({ className }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path fillRule="evenodd" d="M11.54 22.351l.07.04.028.016a.76.76 0 00.723 0l.028-.015.071-.041a16.975 16.975 0 001.144-.742 19.58 19.58 0 002.683-2.282c1.944-1.99 3.963-4.98 3.963-8.827a8.25 8.25 0 00-16.5 0c0 3.846 2.02 6.837 3.963 8.827a19.58 19.58 0 002.682 2.282 16.975 16.975 0 001.145.742zM12 13.5a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
    </svg>
  );
}

function CalendarIcon({ className }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className={className} aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
    </svg>
  );
}

function UsersIcon({ className }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className={className} aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
    </svg>
  );
}

function SearchIcon({ className }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path fillRule="evenodd" d="M10.5 3.75a6.75 6.75 0 100 13.5 6.75 6.75 0 000-13.5zM2.25 10.5a8.25 8.25 0 1114.59 5.28l4.69 4.69a.75.75 0 11-1.06 1.06l-4.69-4.69A8.25 8.25 0 012.25 10.5z" clipRule="evenodd" />
    </svg>
  );
}

function ChevronDownIcon({ className }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={className} aria-hidden>
      <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.94a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clipRule="evenodd" />
    </svg>
  );
}

function formatDisplayDate(isoDate) {
  const date = new Date(`${isoDate}T00:00:00`);
  return date.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function SearchField({ label, icon: Icon, children }) {
  return (
    <div className="relative min-w-0 flex-1">
      <p className="mb-1.5 text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-400">
        {label}
      </p>
      {children}
    </div>
  );
}

function PopupSelect({
  icon: Icon,
  value,
  displayValue,
  options,
  open,
  onToggle,
  onSelect,
  ariaLabel,
}) {
  return (
    <div className="relative">
      <button
        type="button"
        aria-label={ariaLabel}
        aria-expanded={open}
        onClick={onToggle}
        className="flex h-12 w-full items-center gap-2 rounded-md border border-slate-300 bg-white px-3 text-left"
      >
        {Icon ? <Icon className="h-4 w-4 shrink-0 text-[#0056D2]" /> : null}
        <span className="min-w-0 flex-1 truncate text-sm font-medium text-[#0b1a33]">
          {displayValue || value}
        </span>
        <ChevronDownIcon className={`h-4 w-4 shrink-0 text-slate-400 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      {open ? (
        <ul className="absolute left-0 right-0 top-[calc(100%+6px)] z-50 max-h-60 overflow-auto rounded-lg border border-slate-200 bg-white py-1 shadow-[0_12px_32px_rgba(15,23,42,0.16)]">
          {options.map((option) => {
            const optionValue = typeof option === "string" ? option : option.value;
            const optionLabel = typeof option === "string" ? option : option.label;
            const selected = optionValue === value;

            return (
              <li key={optionValue}>
                <button
                  type="button"
                  onClick={() => onSelect(optionValue)}
                  className={`flex w-full px-3 py-2.5 text-left text-sm ${
                    selected
                      ? "bg-[#eef5ff] font-semibold text-[#0056D2]"
                      : "text-[#0b1a33] hover:bg-slate-50"
                  }`}
                >
                  {optionLabel}
                </button>
              </li>
            );
          })}
        </ul>
      ) : null}
    </div>
  );
}

const HeroSection = () => {
  const router = useRouter();
  const formRef = useRef(null);
  const [location, setLocation] = useState("Gurugram, Haryana");
  const [centerType, setCenterType] = useState("CBT Center");
  const [date, setDate] = useState("2025-05-24");
  const [capacity, setCapacity] = useState("250");
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [openField, setOpenField] = useState(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!formRef.current?.contains(event.target)) {
        setOpenField(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearch = (event) => {
    event.preventDefault();
    const params = new URLSearchParams({
      location,
      type: centerType,
      date,
      capacity,
      verified: verifiedOnly ? "1" : "0",
    });
    router.push(`/book-a-center?${params.toString()}`);
  };

  const toggleField = (field) => {
    setOpenField((current) => (current === field ? null : field));
  };

  return (
    <section className="relative bg-white">
      <div className="relative overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1563986768609-322da13575f3?w=1800&q=80"
            alt="Modern computer-based testing center"
            fill
            className="scale-105 object-cover object-center blur-[2px]"
            priority
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-white/75" />
        </div>

        <div className="relative mx-auto max-w-7xl px-4 pb-16 pt-12 sm:px-6 sm:pb-20 sm:pt-16 lg:px-10 lg:pb-24 lg:pt-20">
          <div className="max-w-4xl">
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#0056D2] sm:text-sm">
              Find. Compare. Book. Conduct.
            </p>
            <h1 className="mt-4 text-[1.85rem] font-bold leading-[1.18] text-[#0b1a33] sm:text-[2.5rem] lg:text-[2.75rem]">
              Book verified Test, Training, Assessment and Business Centers across{" "}
              <span className="text-[#0056D2]">India</span> and{" "}
              <span className="text-[#0056D2]">worldwide.</span>
            </h1>
            <p className="mt-5 max-w-2xl text-[15px] leading-relaxed text-slate-600 sm:text-base">
              One platform to discover, verify and book centers for your exams,
              assessments, training and events.
            </p>
          </div>
        </div>
      </div>

      <div className="relative z-20 mx-auto -mt-8 max-w-7xl px-4 sm:-mt-10 sm:px-6 lg:-mt-12 lg:px-10">
        <form
          ref={formRef}
          onSubmit={handleSearch}
          className="rounded-2xl bg-white px-4 py-5 shadow-[0_12px_40px_rgba(15,23,42,0.12)] sm:px-6 sm:py-6"
        >
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:gap-3">
            <SearchField label="Location">
              <PopupSelect
                icon={MapPinIcon}
                value={location}
                options={SEARCH_LOCATIONS}
                open={openField === "location"}
                onToggle={() => toggleField("location")}
                onSelect={(value) => {
                  setLocation(value);
                  setOpenField(null);
                }}
                ariaLabel="Location"
              />
            </SearchField>

            <SearchField label="Center Type">
              <PopupSelect
                value={centerType}
                options={SEARCH_CENTER_TYPES}
                open={openField === "centerType"}
                onToggle={() => toggleField("centerType")}
                onSelect={(value) => {
                  setCenterType(value);
                  setOpenField(null);
                }}
                ariaLabel="Center type"
              />
            </SearchField>

            <SearchField label="Date">
              <div className="relative">
                <div className="flex h-12 items-center gap-2 rounded-md border border-slate-300 bg-white px-3">
                  <CalendarIcon className="h-4 w-4 shrink-0 text-[#0056D2]" />
                  <span className="min-w-0 flex-1 truncate text-sm font-medium text-[#0b1a33]">
                    {formatDisplayDate(date)}
                  </span>
                  <ChevronDownIcon className="h-4 w-4 shrink-0 text-slate-400" />
                </div>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  onFocus={() => setOpenField(null)}
                  className="absolute inset-0 cursor-pointer opacity-0 [color-scheme:light]"
                  aria-label="Select date"
                />
              </div>
            </SearchField>

            <SearchField label="Capacity (Seats)">
              <PopupSelect
                icon={UsersIcon}
                value={capacity}
                displayValue={CAPACITY_OPTIONS.find((option) => option.value === capacity)?.label}
                options={CAPACITY_OPTIONS}
                open={openField === "capacity"}
                onToggle={() => toggleField("capacity")}
                onSelect={(value) => {
                  setCapacity(value);
                  setOpenField(null);
                }}
                ariaLabel="Capacity"
              />
            </SearchField>

            <button
              type="submit"
              className="flex h-12 shrink-0 items-center justify-center gap-2 rounded-md bg-[#0056D2] px-6 text-[13px] font-bold uppercase tracking-wide text-white transition-colors hover:bg-[#0046b0] lg:min-w-[180px]"
            >
              <SearchIcon className="h-4 w-4" />
              Search Centers
            </button>
          </div>

          <label className="mt-4 flex cursor-pointer items-center gap-2.5 text-[13px] text-slate-600">
            <input
              type="checkbox"
              checked={verifiedOnly}
              onChange={(e) => setVerifiedOnly(e.target.checked)}
              className="h-4 w-4 rounded-[3px] border-slate-300 text-[#0056D2] accent-[#0056D2] focus:ring-[#0056D2]"
            />
            Show only BookMyCenter Verified centers
          </label>
        </form>
      </div>
    </section>
  );
};

export default HeroSection;
