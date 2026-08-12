"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { LIST_OF_EXAMS } from "../data/exams";

function SearchIcon({ className }) {
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
        d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z"
        clipRule="evenodd"
      />
    </svg>
  );
}

function ChevronRightIcon({ className }) {
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
        d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.25 4.5a.75.75 0 010 1.08l-4.25 4.25a.75.75 0 01-1.06-.02z"
        clipRule="evenodd"
      />
    </svg>
  );
}

const FindYourExam = () => {
  const [query, setQuery] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const searchContainerRef = useRef(null);

  const trimmedQuery = query.trim();

  const filteredExams = useMemo(() => {
    if (!trimmedQuery) return [];

    const normalizedQuery = trimmedQuery.toLowerCase();
    return LIST_OF_EXAMS.filter((exam) =>
      exam.name.toLowerCase().includes(normalizedQuery),
    );
  }, [trimmedQuery]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!searchContainerRef.current?.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSubmit = (event) => {
    event.preventDefault();
    if (filteredExams.length > 0) {
      setShowDropdown(true);
    } else if (trimmedQuery) {
      setShowDropdown(true);
    }
  };

  const handleInputChange = (event) => {
    setQuery(event.target.value);
    setShowDropdown(true);
  };

  return (
    <main className="flex-1 bg-gradient-to-r from-[#f8f9fc] via-[#f6f7fb] to-[#f3f4f8]">
      <section className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-12 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:gap-20 lg:px-10 lg:py-24">
        <div className="max-w-lg">
          <h1 className="text-4xl font-bold leading-tight text-[#0b1a33] sm:text-5xl lg:text-[3.25rem] lg:leading-[1.1]">
            Find your exam
          </h1>
          <p className="mt-5 text-base leading-relaxed text-[#0b1a33]/85 sm:text-lg">
            Find your exam and get links to locate, register, reschedule, or
            cancel.
          </p>
        </div>

        <div className="w-full max-w-xl lg:max-w-none lg:justify-self-end">
          <h2 className="text-xl font-bold text-[#0b1a33] sm:text-2xl">
            Exam Search
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-[#4a5568] sm:text-base">
            Enter the exam name, abbreviation, organization, or keyword to
            search for your exam.
          </p>

          <div ref={searchContainerRef} className="relative mt-6">
            <form onSubmit={handleSubmit}>
              <label htmlFor="exam-search" className="sr-only">
                Search for your exam
              </label>
              <SearchIcon className="pointer-events-none absolute left-4 top-5 z-10 h-5 w-5 text-[#6b7280]" />
              <input
                id="exam-search"
                type="search"
                value={query}
                onChange={handleInputChange}
                onFocus={() => trimmedQuery && setShowDropdown(true)}
                placeholder="Enter a name or keyword"
                autoComplete="off"
                role="combobox"
                aria-expanded={showDropdown && !!trimmedQuery}
                aria-controls="exam-search-results"
                aria-autocomplete="list"
                className="relative z-10 w-full rounded-lg border border-[#d1d5db] bg-white py-4 pl-12 pr-16 text-base text-[#0b1a33] placeholder:text-[#9ca3af] shadow-sm outline-none transition-colors focus:border-[#0b1a33] focus:ring-2 focus:ring-[#0b1a33]/10"
              />
              <button
                type="submit"
                aria-label="Search exams"
                className="absolute right-2 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-[#0b1a33] text-white transition-colors hover:bg-[#1e3a5f]"
              >
                <ChevronRightIcon className="h-5 w-5" />
              </button>
            </form>

            {showDropdown && trimmedQuery ? (
              <ul
                id="exam-search-results"
                role="listbox"
                className="absolute inset-x-0 top-full z-20 mt-2 max-h-64 overflow-y-auto rounded-lg border border-[#e5e7eb] bg-white py-2 shadow-lg"
              >
                {filteredExams.length > 0 ? (
                  filteredExams.map((exam) => (
                    <li key={exam.id} role="option">
                      <Link
                        href={`/exams/${exam.id}`}
                        className="block px-4 py-3 text-sm font-medium text-[#0b1a33] transition-colors hover:bg-[#f3f4f6]"
                        onClick={() => setShowDropdown(false)}
                      >
                        {exam.name}
                      </Link>
                    </li>
                  ))
                ) : (
                  <li className="px-4 py-3 text-sm text-[#6b7280]">
                    0 results found
                  </li>
                )}
              </ul>
            ) : null}
          </div>
        </div>
      </section>
    </main>
  );
};

export default FindYourExam;
