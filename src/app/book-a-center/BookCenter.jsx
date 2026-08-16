"use client";

import { useEffect, useMemo, useRef, useState } from "react";

const CENTER_TYPES = [
  "CBT Centers",
  "PBT / Paper Exam Centers",
  "Certification Test Centers",
  "Government Exam Centers",
  "Training Center",
];

const INDIAN_STATES = [
  "Andhra Pradesh",
  "Arunachal Pradesh",
  "Assam",
  "Bihar",
  "Chhattisgarh",
  "Delhi",
  "Goa",
  "Gujarat",
  "Haryana",
  "Himachal Pradesh",
  "Jammu and Kashmir",
  "Jharkhand",
  "Karnataka",
  "Kerala",
  "Madhya Pradesh",
  "Maharashtra",
  "Manipur",
  "Meghalaya",
  "Mizoram",
  "Nagaland",
  "Odisha",
  "Punjab",
  "Rajasthan",
  "Sikkim",
  "Tamil Nadu",
  "Telangana",
  "Tripura",
  "Uttar Pradesh",
  "Uttarakhand",
  "West Bengal",
];

const INITIAL_FORM = {
  centerType: "",
  country: "",
  state: "",
  city: "",
  dateFrom: "",
  dateTo: "",
  timeFrom: "",
  timeTo: "",
  capacity: "",
};

function FormField({ label, id, required, children, hint }) {
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-sm font-semibold text-[#0b1a33]">
        {label}
        {required ? <span className="text-[#b03a2e]"> *</span> : null}
      </label>
      {children}
      {hint ? <p className="mt-1 text-xs text-[#6b7280]">{hint}</p> : null}
    </div>
  );
}

function inputClass() {
  return "w-full rounded-lg border border-[#e5e7eb] bg-white px-4 py-3 text-sm text-[#1f2937] outline-none transition-colors focus:border-[#0a7ea4] focus:ring-2 focus:ring-[#0a7ea4]/15";
}

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

export default function BookCenter() {
  const [form, setForm] = useState(INITIAL_FORM);
  const [countries, setCountries] = useState([]);
  const [results, setResults] = useState([]);
  const [loadingCountries, setLoadingCountries] = useState(true);
  const [searching, setSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [error, setError] = useState(null);
  const [showCountryDropdown, setShowCountryDropdown] = useState(false);
  const countrySearchRef = useRef(null);

  const filteredCountries = useMemo(() => {
    const query = form.country.trim().toLowerCase();
    if (!query) return countries.slice(0, 12);

    return countries.filter((country) =>
      country.name.toLowerCase().includes(query)
    );
  }, [countries, form.country]);

  useEffect(() => {
    fetch("/api/countrylist?source=db")
      .then((response) => response.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setCountries(data);
          return;
        }
        return fetch("/api/countrylist")
          .then((response) => response.json())
          .then((externalData) => {
            if (Array.isArray(externalData)) {
              setCountries(externalData);
            }
          });
      })
      .catch(() => setError(new Error("Failed to load countries")))
      .finally(() => setLoadingCountries(false));
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!countrySearchRef.current?.contains(event.target)) {
        setShowCountryDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleChange = (field) => (event) => {
    setForm((prev) => ({ ...prev, [field]: event.target.value }));
  };

  const handleSearch = async (event) => {
    event.preventDefault();
    setSearching(true);
    setError(null);
    setHasSearched(true);

    try {
      const params = new URLSearchParams();
      Object.entries(form).forEach(([key, value]) => {
        if (value) {
          params.set(key, value);
        }
      });

      const response = await fetch(`/api/centers/search?${params.toString()}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to search centers");
      }

      setResults(Array.isArray(data.data) ? data.data : []);
    } catch (searchError) {
      setError(searchError);
      setResults([]);
    } finally {
      setSearching(false);
    }
  };

  const handleReset = () => {
    setForm(INITIAL_FORM);
    setResults([]);
    setHasSearched(false);
    setError(null);
    setShowCountryDropdown(false);
  };

  const handleCountryChange = (event) => {
    setForm((prev) => ({ ...prev, country: event.target.value }));
    setShowCountryDropdown(true);
  };

  const handleCountrySelect = (countryName) => {
    setForm((prev) => ({ ...prev, country: countryName }));
    setShowCountryDropdown(false);
  };

  return (
    <main className="flex-1 bg-gradient-to-r from-[#f8f9fc] via-[#f6f7fb] to-[#f3f4f8] px-4 py-10 sm:px-6 lg:px-10 lg:py-14">
      <div className="mx-auto max-w-5xl">
        <div className="mb-8">
          <p className="text-sm font-semibold uppercase tracking-wide text-[#0a7ea4]">
            Book A Center
          </p>
          <h1 className="mt-1 text-3xl font-bold text-[#0b1a33] sm:text-4xl">
            Find and book a test center
          </h1>
          <p className="mt-3 max-w-3xl text-sm leading-relaxed text-[#6b7280] sm:text-base">
            Search verified centers by type, location, date, timing, and seating capacity.
            All fields remain editable so you can refine your search anytime.
          </p>
        </div>

        <form
          onSubmit={handleSearch}
          className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-[#e5e7eb] sm:p-8"
        >
          <h2 className="text-xl font-bold text-[#0b1a33]">Search Centers</h2>
          <p className="mt-1 text-sm text-[#6b7280]">
            Fill in the details below and click Search Center.
          </p>

          <div className="mt-6 grid grid-cols-1 gap-5 md:grid-cols-2">
            <div className="md:col-span-2">
              <FormField label="Center Type" id="centerType" required>
                <select
                  id="centerType"
                  value={form.centerType}
                  onChange={handleChange("centerType")}
                  className={inputClass()}
                  required
                >
                  <option value="">Select center type</option>
                  {CENTER_TYPES.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </FormField>
            </div>

            <FormField label="Search by Country" id="country">
              <div ref={countrySearchRef} className="relative">
                <SearchIcon className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#6b7280]" />
                <input
                  id="country"
                  type="search"
                  value={form.country}
                  onChange={handleCountryChange}
                  onFocus={() => setShowCountryDropdown(true)}
                  placeholder={
                    loadingCountries ? "Loading countries..." : "Search or enter country"
                  }
                  autoComplete="off"
                  role="combobox"
                  aria-expanded={showCountryDropdown}
                  aria-controls="country-search-results"
                  aria-autocomplete="list"
                  disabled={loadingCountries}
                  className={`${inputClass()} pl-11`}
                />
                {showCountryDropdown && !loadingCountries ? (
                  <ul
                    id="country-search-results"
                    role="listbox"
                    className="absolute inset-x-0 top-full z-20 mt-2 max-h-56 overflow-y-auto rounded-lg border border-[#e5e7eb] bg-white py-2 shadow-lg"
                  >
                    {filteredCountries.length > 0 ? (
                      filteredCountries.map((country) => (
                        <li key={country.code || country.name} role="option">
                          <button
                            type="button"
                            onClick={() => handleCountrySelect(country.name)}
                            className="flex w-full items-center gap-2 px-4 py-2.5 text-left text-sm text-[#0b1a33] transition-colors hover:bg-[#f3f4f6]"
                          >
                            {country.flag ? (
                              <span aria-hidden className="text-base">
                                {country.flag}
                              </span>
                            ) : null}
                            <span>{country.name}</span>
                          </button>
                        </li>
                      ))
                    ) : (
                      <li className="px-4 py-2.5 text-sm text-[#6b7280]">
                        No countries found
                      </li>
                    )}
                  </ul>
                ) : null}
              </div>
            </FormField>

            <FormField label="Search by State" id="state">
              <input
                id="state"
                type="text"
                list="state-options"
                value={form.state}
                onChange={handleChange("state")}
                placeholder="Enter or select state"
                className={inputClass()}
              />
              <datalist id="state-options">
                {INDIAN_STATES.map((state) => (
                  <option key={state} value={state} />
                ))}
              </datalist>
            </FormField>

            <FormField label="Search by City" id="city">
              <input
                id="city"
                type="text"
                value={form.city}
                onChange={handleChange("city")}
                placeholder="Enter city name"
                className={inputClass()}
              />
            </FormField>

            <FormField label="Required Capacity" id="capacity">
              <input
                id="capacity"
                type="number"
                min="1"
                value={form.capacity}
                onChange={handleChange("capacity")}
                placeholder="Minimum seats required"
                className={inputClass()}
              />
            </FormField>

            <FormField label="Select Date From" id="dateFrom">
              <input
                id="dateFrom"
                type="date"
                value={form.dateFrom}
                onChange={handleChange("dateFrom")}
                min={new Date().toISOString().split("T")[0]}
                className={inputClass()}
              />
            </FormField>

            <FormField label="Select Date To" id="dateTo">
              <input
                id="dateTo"
                type="date"
                value={form.dateTo}
                onChange={handleChange("dateTo")}
                min={form.dateFrom || new Date().toISOString().split("T")[0]}
                className={inputClass()}
              />
            </FormField>

            <FormField label="Timing From" id="timeFrom">
              <input
                id="timeFrom"
                type="time"
                value={form.timeFrom}
                onChange={handleChange("timeFrom")}
                className={inputClass()}
              />
            </FormField>

            <FormField label="Timing To" id="timeTo">
              <input
                id="timeTo"
                type="time"
                value={form.timeTo}
                onChange={handleChange("timeTo")}
                min={form.timeFrom || undefined}
                className={inputClass()}
              />
            </FormField>
          </div>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={handleReset}
              className="inline-flex items-center justify-center rounded-lg border border-[#e5e7eb] bg-white px-6 py-3 text-sm font-semibold text-[#0b1a33] transition hover:bg-[#f9fafb]"
            >
              Clear
            </button>
            <button
              type="submit"
              disabled={searching}
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#0a7ea4] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#086688] disabled:cursor-not-allowed disabled:opacity-60"
            >
              <SearchIcon className="h-4 w-4" />
              {searching ? "Searching..." : "Search Center"}
            </button>
          </div>
        </form>

        {error ? (
          <div className="mt-6 rounded-xl border border-[#fecaca] bg-[#fef2f2] px-4 py-3 text-sm text-[#b03a2e]">
            {error.message}
          </div>
        ) : null}

        {hasSearched ? (
          <section className="mt-8">
            <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-xl font-bold text-[#0b1a33]">Search Results</h2>
                <p className="mt-1 text-sm text-[#6b7280]">
                  {results.length} center{results.length === 1 ? "" : "s"} found
                </p>
              </div>
            </div>

            {results.length > 0 ? (
              <div className="grid grid-cols-1 gap-4">
                {results.map((center) => (
                  <article
                    key={center.id}
                    className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-[#e5e7eb]"
                  >
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-wide text-[#0a7ea4]">
                          {center.centerType || form.centerType}
                        </p>
                        <h3 className="mt-1 text-lg font-bold text-[#0b1a33]">
                          {center.name}
                        </h3>
                        <p className="mt-2 text-sm text-[#6b7280]">
                          {[center.address, center.city, center.state, center.country]
                            .filter(Boolean)
                            .join(", ")}
                        </p>
                      </div>
                      <span className="inline-flex w-fit rounded-full bg-[#ecf8fc] px-3 py-1 text-xs font-semibold text-[#0a7ea4]">
                        {center.seatingCapacity
                          ? `${center.seatingCapacity} seats`
                          : "Capacity N/A"}
                      </span>
                    </div>

                    <dl className="mt-5 grid grid-cols-1 gap-4 border-t border-[#f1f5f9] pt-5 text-sm sm:grid-cols-2 lg:grid-cols-4">
                      <div>
                        <dt className="font-semibold text-[#0b1a33]">Date</dt>
                        <dd className="mt-1 text-[#6b7280]">
                          {form.dateFrom || form.dateTo
                            ? `${form.dateFrom || "—"} to ${form.dateTo || "—"}`
                            : "Flexible"}
                        </dd>
                      </div>
                      <div>
                        <dt className="font-semibold text-[#0b1a33]">Timing</dt>
                        <dd className="mt-1 text-[#6b7280]">
                          {form.timeFrom || form.timeTo
                            ? `${form.timeFrom || "—"} to ${form.timeTo || "—"}`
                            : "Flexible"}
                        </dd>
                      </div>
                      <div>
                        <dt className="font-semibold text-[#0b1a33]">Contact</dt>
                        <dd className="mt-1 text-[#6b7280]">
                          {center.contactPhone || center.contactEmail || "—"}
                        </dd>
                      </div>
                      <div>
                        <dt className="font-semibold text-[#0b1a33]">Required Capacity</dt>
                        <dd className="mt-1 text-[#6b7280]">
                          {form.capacity ? `${form.capacity}+ seats` : "Any"}
                        </dd>
                      </div>
                    </dl>
                  </article>
                ))}
              </div>
            ) : (
              <div className="rounded-2xl bg-white p-10 text-center shadow-sm ring-1 ring-[#e5e7eb]">
                <p className="text-sm font-medium text-[#0b1a33]">No centers found</p>
                <p className="mt-2 text-sm text-[#6b7280]">
                  Try adjusting your search filters above and search again.
                </p>
              </div>
            )}
          </section>
        ) : null}
      </div>
    </main>
  );
}
