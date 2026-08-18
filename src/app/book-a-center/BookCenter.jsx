"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { toast } from "react-toastify";
import { CENTER_TYPES, STAR_RATINGS } from "../become-partner/constants";
import { OtpVerificationField } from "../become-partner/FormControls";
import { citylist } from "@/services/citylist";
import { statelist } from "@/services/statelist";

const INDIA = "India";
const MIN_CAPACITY = 100;

const INITIAL_FORM = {
  regionType: "",
  country: "",
  state: "",
  city: "",
  pinCode: "",
  fullAddress: "",
  centerType: "",
  category: "",
  startDate: "",
  endDate: "",
  startTime: "",
  endTime: "",
  capacity: "",
  organizationName: "",
  contactPersonName: "",
  email: "",
  emailOtp: "",
  emailVerified: false,
  contactNumber: "",
  mobileOtp: "",
  mobileVerified: false,
};

function ChevronIcon({ className }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={className} aria-hidden>
      <path
        fillRule="evenodd"
        d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.94a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
        clipRule="evenodd"
      />
    </svg>
  );
}

function ArrowIcon({ className }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={className} aria-hidden>
      <path
        fillRule="evenodd"
        d="M3 10a.75.75 0 01.75-.75h10.638L10.23 5.29a.75.75 0 111.04-1.08l5.5 5.25a.75.75 0 010 1.08l-5.5 5.25a.75.75 0 11-1.04-1.08l4.158-3.96H3.75A.75.75 0 013 10z"
        clipRule="evenodd"
      />
    </svg>
  );
}

function Field({ label, id, required, hint, children }) {
  return (
    <div>
      <label htmlFor={id} className="mb-2 block text-sm font-medium text-[#334155]">
        {label}
        {required ? <span className="text-[#b03a2e]"> *</span> : null}
      </label>
      {children}
      {hint ? <p className="mt-1 text-xs text-[#64748b]">{hint}</p> : null}
    </div>
  );
}

function inputClass() {
  return "h-12 w-full appearance-none rounded-lg border border-[#dbe3ee] bg-white px-4 text-sm text-[#0b1a33] outline-none transition focus:border-[#0056D2] focus:ring-2 focus:ring-[#0056D2]/15 disabled:bg-[#f8fafc] disabled:text-[#94a3b8]";
}

function selectClass() {
  return `${inputClass()} pr-10`;
}

function textareaClass() {
  return "min-h-[96px] w-full rounded-lg border border-[#dbe3ee] bg-white px-4 py-3 text-sm text-[#0b1a33] outline-none transition focus:border-[#0056D2] focus:ring-2 focus:ring-[#0056D2]/15";
}

export default function BookCenter() {
  const initialized = useRef(false);
  const countrySearchRef = useRef(null);
  const [form, setForm] = useState(INITIAL_FORM);
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [loadingCountries, setLoadingCountries] = useState(true);
  const [showCountryDropdown, setShowCountryDropdown] = useState(false);
  const [searching, setSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [results, setResults] = useState([]);
  const [error, setError] = useState(null);

  const isDomestic = form.regionType === "Domestic";
  const today = new Date().toISOString().split("T")[0];

  const filteredCountries = useMemo(() => {
    const query = form.country.trim().toLowerCase();
    const list = isDomestic
      ? countries.filter((country) => country.name.toLowerCase() === INDIA.toLowerCase())
      : countries.filter((country) => country.name.toLowerCase() !== INDIA.toLowerCase());

    if (!query) return list;
    return list.filter((country) => country.name.toLowerCase().includes(query));
  }, [countries, form.country, isDomestic]);

  const updateForm = (updates) => {
    setForm((prev) => ({ ...prev, ...updates }));
  };

  const handleChange = (field) => (event) => {
    updateForm({ [field]: event.target.value });
  };

  const loadStates = async (countryName) => {
    if (!countryName) {
      setStates([]);
      setCities([]);
      return;
    }

    try {
      const statesData = await statelist(countryName);
      setStates(Array.isArray(statesData) ? statesData : []);
    } catch {
      setStates([]);
    }
    setCities([]);
  };

  const loadCities = async (countryName, stateName) => {
    if (!countryName || !stateName) {
      setCities([]);
      return;
    }

    try {
      const citiesData = await citylist(countryName, stateName);
      setCities(Array.isArray(citiesData) ? citiesData : []);
    } catch {
      setCities([]);
    }
  };

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    async function loadCountries() {
      try {
        const response = await fetch("/api/countrylist");
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || "Failed to fetch countries");
        setCountries(Array.isArray(data) ? data : []);
      } catch {
        setCountries([]);
      } finally {
        setLoadingCountries(false);
      }
    }

    loadCountries();
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

  const handleRegionTypeChange = async (event) => {
    const regionType = event.target.value;
    setShowCountryDropdown(false);
    setCities([]);

    if (regionType === "Domestic") {
      updateForm({ regionType, country: INDIA, state: "", city: "", pinCode: "" });
      await loadStates(INDIA);
      return;
    }

    updateForm({ regionType, country: "", state: "", city: "", pinCode: "" });
    setStates([]);
  };

  const handleCountryChange = (event) => {
    updateForm({ country: event.target.value, state: "", city: "", pinCode: "" });
    setStates([]);
    setCities([]);
    setShowCountryDropdown(true);
  };

  const handleCountrySelect = async (countryName) => {
    updateForm({ country: countryName, state: "", city: "", pinCode: "" });
    setShowCountryDropdown(false);
    await loadStates(countryName);
  };

  const handleStateChange = async (event) => {
    const stateName = event.target.value;
    updateForm({ state: stateName, city: "", pinCode: "" });

    const matchedState = states.find(
      (state) => state.name.toLowerCase() === stateName.trim().toLowerCase()
    );
    if (matchedState && form.country) {
      await loadCities(form.country, matchedState.name);
      return;
    }

    setCities([]);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(null);

    if (!form.emailVerified || !form.mobileVerified) {
      toast.error("Please verify email and mobile number with OTP");
      return;
    }

    const capacity = Number(form.capacity);
    if (!Number.isFinite(capacity) || capacity < MIN_CAPACITY) {
      toast.error(`Required capacity must be at least ${MIN_CAPACITY} seats`);
      return;
    }

    setSearching(true);
    setHasSearched(true);

    try {
      const response = await fetch("/api/centers/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Failed to search centers");
      setResults(Array.isArray(data.data) ? data.data : []);
    } catch (searchError) {
      setError(searchError);
      setResults([]);
    } finally {
      setSearching(false);
    }
  };

  return (
    <main className="flex-1 bg-[#f8fafc]">
      <section className="bg-[#f4f8fc] px-4 pt-12 pb-8 sm:px-6 sm:pt-16 lg:px-10">
        <div className="mx-auto max-w-5xl">
          <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#2563eb]">
            Instant Booking
          </p>
          <h1 className="mt-3 max-w-3xl text-3xl font-bold leading-tight text-[#0b1a33] sm:text-[2.35rem]">
            Find the right center for your requirement.
          </h1>
          <p className="mt-3 text-sm text-[#64748b] sm:text-base">
            Search by location, centre type, date, timing and capacity. Email and mobile OTP
            verification is required.
          </p>
        </div>
      </section>

      <section className="px-4 pb-16 sm:px-6 lg:px-10">
        <form
          onSubmit={handleSubmit}
          className="mx-auto -mt-2 max-w-5xl rounded-2xl bg-white p-6 shadow-[0_12px_40px_rgba(15,23,42,0.08)] sm:p-8 lg:p-10"
        >
          <h2 className="text-xl font-bold text-[#0b1a33]">Search Requirement</h2>

          <div className="mt-6 grid grid-cols-1 gap-x-8 gap-y-6 md:grid-cols-2">
            <Field label="Select International or Domestic" id="regionType" required>
              <div className="relative">
                <select
                  id="regionType"
                  value={form.regionType}
                  onChange={handleRegionTypeChange}
                  className={selectClass()}
                  required
                >
                  <option value="">Select</option>
                  <option value="Domestic">Domestic</option>
                  <option value="International">International</option>
                </select>
                <ChevronIcon className="pointer-events-none absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-[#64748b]" />
              </div>
            </Field>

            <Field label="Country" id="country" required>
              <div ref={countrySearchRef} className="relative">
                <input
                  id="country"
                  type="search"
                  value={form.country}
                  onChange={handleCountryChange}
                  onFocus={() => {
                    if (!isDomestic) setShowCountryDropdown(true);
                  }}
                  placeholder={
                    !form.regionType
                      ? "Select Domestic or International first"
                      : loadingCountries
                        ? "Loading countries..."
                        : isDomestic
                          ? INDIA
                          : "Search or select country"
                  }
                  autoComplete="off"
                  disabled={loadingCountries || !form.regionType || isDomestic}
                  className={inputClass()}
                  required
                />
                {showCountryDropdown && !loadingCountries && !isDomestic ? (
                  <ul className="absolute inset-x-0 top-full z-20 mt-2 max-h-56 overflow-y-auto rounded-lg border border-[#e5e7eb] bg-white py-2 shadow-lg">
                    {filteredCountries.length > 0 ? (
                      filteredCountries.map((country) => (
                        <li key={country.code || country.name}>
                          <button
                            type="button"
                            onClick={() => handleCountrySelect(country.name)}
                            className="flex w-full items-center gap-2 px-4 py-2.5 text-left text-sm text-[#0b1a33] hover:bg-[#f8fafc]"
                          >
                            {country.flag ? <span>{country.flag}</span> : null}
                            <span>{country.name}</span>
                          </button>
                        </li>
                      ))
                    ) : (
                      <li className="px-4 py-2.5 text-sm text-[#64748b]">No countries found</li>
                    )}
                  </ul>
                ) : null}
              </div>
            </Field>

            <Field label="State" id="state" required>
              <input
                id="state"
                type="text"
                list="state-options"
                value={form.state}
                onChange={handleStateChange}
                placeholder={form.country ? "Enter or select state" : "Select country first"}
                className={inputClass()}
                disabled={!form.country}
                required
              />
              <datalist id="state-options">
                {states.map((state) => (
                  <option key={state.name} value={state.name} />
                ))}
              </datalist>
            </Field>

            <Field label="City" id="city" required>
              <input
                id="city"
                type="text"
                list="city-options"
                value={form.city}
                onChange={(event) => updateForm({ city: event.target.value, pinCode: "" })}
                placeholder={form.state ? "Enter or select city" : "Select state first"}
                className={inputClass()}
                disabled={!form.state}
                required
              />
              <datalist id="city-options">
                {cities.map((city) => (
                  <option key={city} value={city} />
                ))}
              </datalist>
            </Field>

            <Field label="Pin Code" id="pinCode" required>
              <input
                id="pinCode"
                type="text"
                inputMode="numeric"
                value={form.pinCode}
                onChange={handleChange("pinCode")}
                placeholder={isDomestic ? "6-digit pin code" : "Enter pin / postal code"}
                className={inputClass()}
                pattern={isDomestic ? "[0-9]{6}" : "[A-Za-z0-9\\- ]{3,12}"}
                minLength={isDomestic ? 6 : 3}
                maxLength={isDomestic ? 6 : 12}
                required
              />
            </Field>

            <div className="md:col-span-2">
              <Field label="Full Address" id="fullAddress" required>
                <textarea
                  id="fullAddress"
                  value={form.fullAddress}
                  onChange={handleChange("fullAddress")}
                  placeholder="Enter the full address"
                  rows={3}
                  className={textareaClass()}
                  required
                />
              </Field>
            </div>

            <Field label="Centre Type" id="centerType" required>
              <div className="relative">
                <select
                  id="centerType"
                  value={form.centerType}
                  onChange={handleChange("centerType")}
                  className={selectClass()}
                  required
                >
                  <option value="">Select centre type</option>
                  {CENTER_TYPES.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
                <ChevronIcon className="pointer-events-none absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-[#64748b]" />
              </div>
            </Field>

            <Field label="Category" id="category" required>
              <div className="relative">
                <select
                  id="category"
                  value={form.category}
                  onChange={handleChange("category")}
                  className={selectClass()}
                  required
                >
                  <option value="">Select category</option>
                  {STAR_RATINGS.map((rating) => (
                    <option key={rating.value} value={rating.value}>
                      {rating.label}
                    </option>
                  ))}
                </select>
                <ChevronIcon className="pointer-events-none absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-[#64748b]" />
              </div>
            </Field>

            <Field label="Start Date" id="startDate" required>
              <input
                id="startDate"
                type="date"
                value={form.startDate}
                onChange={handleChange("startDate")}
                min={today}
                className={`${inputClass()} [color-scheme:light]`}
                required
              />
            </Field>

            <Field label="End Date" id="endDate" required>
              <input
                id="endDate"
                type="date"
                value={form.endDate}
                onChange={handleChange("endDate")}
                min={form.startDate || today}
                className={`${inputClass()} [color-scheme:light]`}
                required
              />
            </Field>

            <Field label="Start Time" id="startTime" required>
              <input
                id="startTime"
                type="time"
                value={form.startTime}
                onChange={handleChange("startTime")}
                className={`${inputClass()} [color-scheme:light]`}
                required
              />
            </Field>

            <Field label="End Time" id="endTime" required>
              <input
                id="endTime"
                type="time"
                value={form.endTime}
                onChange={handleChange("endTime")}
                min={
                  form.startDate && form.endDate && form.startDate === form.endDate
                    ? form.startTime || undefined
                    : undefined
                }
                className={`${inputClass()} [color-scheme:light]`}
                required
              />
            </Field>

            <Field
              label="Required Capacity"
              id="capacity"
              required
              hint={`Minimum ${MIN_CAPACITY} seats`}
            >
              <input
                id="capacity"
                type="number"
                min={MIN_CAPACITY}
                value={form.capacity}
                onChange={handleChange("capacity")}
                placeholder={`Minimum ${MIN_CAPACITY} seats`}
                className={inputClass()}
                required
              />
            </Field>

            <Field label="Name of the Organization" id="organizationName" required>
              <input
                id="organizationName"
                type="text"
                value={form.organizationName}
                onChange={handleChange("organizationName")}
                placeholder="Enter organization name"
                className={inputClass()}
                required
              />
            </Field>

            <div className="md:col-span-2">
              <Field label="Contact Person Name" id="contactPersonName" required>
                <input
                  id="contactPersonName"
                  type="text"
                  value={form.contactPersonName}
                  onChange={handleChange("contactPersonName")}
                  placeholder="Enter contact person name"
                  className={inputClass()}
                  required
                />
              </Field>
            </div>

            <div className="md:col-span-2">
              <OtpVerificationField
                label="Email Id"
                valueId="email"
                otpId="emailOtp"
                type="email"
                inputType="email"
                value={form.email}
                otp={form.emailOtp}
                verified={form.emailVerified}
                onValueChange={(event) =>
                  updateForm({ email: event.target.value, emailVerified: false, emailOtp: "" })
                }
                onOtpChange={(event) => updateForm({ emailOtp: event.target.value })}
                onVerifiedChange={(verified) => updateForm({ emailVerified: verified })}
                required
                enableOtp
                placeholder="name@organization.com"
              />
            </div>

            <div className="md:col-span-2">
              <OtpVerificationField
                label="Contact Number"
                valueId="contactNumber"
                otpId="mobileOtp"
                type="mobile"
                inputType="tel"
                value={form.contactNumber}
                otp={form.mobileOtp}
                verified={form.mobileVerified}
                onValueChange={(event) =>
                  updateForm({
                    contactNumber: event.target.value,
                    mobileVerified: false,
                    mobileOtp: "",
                  })
                }
                onOtpChange={(event) => updateForm({ mobileOtp: event.target.value })}
                onVerifiedChange={(verified) => updateForm({ mobileVerified: verified })}
                required
                enableOtp
                placeholder="10-digit mobile number"
              />
            </div>
          </div>

          <div className="mt-8 flex justify-end">
            <button
              type="submit"
              disabled={searching}
              className="inline-flex items-center gap-2 rounded-lg bg-[#2563eb] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#1d4ed8] disabled:opacity-60"
            >
              {searching ? "Searching..." : "Search Available Centers"}
              <ArrowIcon className="h-4 w-4" />
            </button>
          </div>
        </form>

        {error ? (
          <div className="mx-auto mt-6 max-w-5xl rounded-xl border border-[#fecaca] bg-[#fef2f2] px-4 py-3 text-sm text-[#b03a2e]">
            {error.message}
          </div>
        ) : null}

        {hasSearched ? (
          <section className="mx-auto mt-8 max-w-5xl">
            <h2 className="text-xl font-bold text-[#0b1a33]">Search Results</h2>
            <p className="mt-1 text-sm text-[#64748b]">
              {results.length} center{results.length === 1 ? "" : "s"} found
            </p>

            {results.length > 0 ? (
              <div className="mt-4 grid grid-cols-1 gap-4">
                {results.map((center) => (
                  <article
                    key={center.id}
                    className="rounded-2xl bg-white p-6 shadow-[0_8px_24px_rgba(15,23,42,0.06)]"
                  >
                    <p className="text-xs font-semibold uppercase tracking-wide text-[#2563eb]">
                      {center.centerType || form.centerType}
                    </p>
                    <h3 className="mt-1 text-lg font-bold text-[#0b1a33]">{center.name}</h3>
                    <p className="mt-2 text-sm text-[#64748b]">
                      {[center.address, center.city, center.state, center.country, center.pinCode]
                        .filter(Boolean)
                        .join(", ")}
                    </p>
                  </article>
                ))}
              </div>
            ) : (
              <div className="mt-4 rounded-2xl bg-white p-10 text-center shadow-[0_8px_24px_rgba(15,23,42,0.06)]">
                <p className="text-sm font-medium text-[#0b1a33]">No centers found</p>
                <p className="mt-2 text-sm text-[#64748b]">
                  Try adjusting your search filters above and search again.
                </p>
              </div>
            )}
          </section>
        ) : null}
      </section>
    </main>
  );
}
