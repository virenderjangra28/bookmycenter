"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { toast } from "react-toastify";
import { CENTER_TYPES, STAR_RATINGS } from "../become-partner/constants";
import {
  FormField,
  inputClass,
  OtpVerificationField,
} from "../become-partner/FormControls";
import { citylist } from "../services/citylist";
import { statelist } from "../services/statelist";

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

function formatStarLabel(value) {
  const rating = STAR_RATINGS.find((item) => String(item.value) === String(value));
  return rating?.label || (value ? `${value} Star` : "—");
}

export default function BookCenter() {
  const initialized = useRef(false);
  const [form, setForm] = useState(INITIAL_FORM);
  const [countries, setCountries] = useState([]);
  const [results, setResults] = useState([]);
  const [loadingCountries, setLoadingCountries] = useState(true);
  const [searching, setSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [error, setError] = useState(null);
  const [showCountryDropdown, setShowCountryDropdown] = useState(false);
  const countrySearchRef = useRef(null);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);

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

  const getCountryAllList = async () => {
    try {
      const response = await fetch("/api/countrylist");
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch countries");
      }

      setCountries(Array.isArray(data) ? data : []);
    } catch (fetchError) {
      setError(fetchError);
      setCountries([]);
    } finally {
      setLoadingCountries(false);
    }
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
    getCountryAllList();
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

  const updateForm = (updates) => {
    setForm((prev) => ({ ...prev, ...updates }));
  };

  const handleChange = (field) => (event) => {
    updateForm({ [field]: event.target.value });
  };

  const handleRegionTypeChange = async (regionType) => {
    setShowCountryDropdown(false);
    setCities([]);

    if (regionType === "Domestic") {
      updateForm({
        regionType,
        country: INDIA,
        state: "",
        city: "",
        pinCode: "",
      });
      await loadStates(INDIA);
      return;
    }

    updateForm({
      regionType,
      country: "",
      state: "",
      city: "",
      pinCode: "",
    });
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

  const handleCityChange = (event) => {
    updateForm({ city: event.target.value, pinCode: "" });
  };

  const handleSearch = async (event) => {
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
      const response = await fetch(`/api/centers/search`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });
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
    setStates([]);
    setCities([]);
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
            Complete the required booking details below. Email and mobile OTP verification is
            required before searching matching centers.
          </p>
        </div>

        <form
          onSubmit={handleSearch}
          className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-[#e5e7eb] sm:p-8"
        >
          <h2 className="text-xl font-bold text-[#0b1a33]">Search Centers</h2>
          <p className="mt-1 text-sm text-[#6b7280]">
            All fields marked with * are required.
          </p>

          <div className="mt-6 grid grid-cols-1 gap-5 md:grid-cols-2">
            <div className="md:col-span-2">
              <FormField label="Select International or Domestic" id="regionType" required>
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-6">
                  {["Domestic", "International"].map((type) => (
                    <label key={type} className="flex items-center gap-2 text-sm text-[#1f2937]">
                      <input
                        type="radio"
                        name="regionType"
                        value={type}
                        checked={form.regionType === type}
                        onChange={() => handleRegionTypeChange(type)}
                        className="h-4 w-4 border-[#d1d5db] text-[#0a7ea4] focus:ring-[#0a7ea4]"
                        required
                      />
                      <span>{type}</span>
                    </label>
                  ))}
                </div>
              </FormField>
            </div>

            <FormField label="Country" id="country" required>
              <div ref={countrySearchRef} className="relative">
                <SearchIcon className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#6b7280]" />
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
                  role="combobox"
                  aria-expanded={showCountryDropdown}
                  aria-controls="country-search-results"
                  aria-autocomplete="list"
                  disabled={loadingCountries || !form.regionType || isDomestic}
                  className={`${inputClass()} pl-11`}
                  required
                />
                {showCountryDropdown && !loadingCountries && !isDomestic ? (
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

            <FormField label="State" id="state" required>
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
            </FormField>

            <FormField label="City" id="city" required>
              <input
                id="city"
                type="text"
                list="city-options"
                value={form.city}
                onChange={handleCityChange}
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
            </FormField>

            <FormField label="Pin Code" id="pinCode" required>
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
            </FormField>

            <div className="md:col-span-2">
              <FormField label="Full Address" id="fullAddress" required>
                <textarea
                  id="fullAddress"
                  value={form.fullAddress}
                  onChange={handleChange("fullAddress")}
                  placeholder="Enter the full address"
                  rows={3}
                  className={inputClass()}
                  required
                />
              </FormField>
            </div>

            <FormField label="Centre Type" id="centerType" required>
              <select
                id="centerType"
                value={form.centerType}
                onChange={handleChange("centerType")}
                className={inputClass()}
                required
              >
                <option value="">Select centre type</option>
                {CENTER_TYPES.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </FormField>

            <FormField label="Category" id="category" required>
              <select
                id="category"
                value={form.category}
                onChange={handleChange("category")}
                className={inputClass()}
                required
              >
                <option value="">Select category</option>
                {STAR_RATINGS.map((rating) => (
                  <option key={rating.value} value={rating.value}>
                    {rating.label}
                  </option>
                ))}
              </select>
            </FormField>

            <FormField label="Start Date" id="startDate" required>
              <input
                id="startDate"
                type="date"
                value={form.startDate}
                onChange={handleChange("startDate")}
                min={today}
                className={inputClass()}
                required
              />
            </FormField>

            <FormField label="End Date" id="endDate" required>
              <input
                id="endDate"
                type="date"
                value={form.endDate}
                onChange={handleChange("endDate")}
                min={form.startDate || today}
                className={inputClass()}
                required
              />
            </FormField>

            <FormField label="Start Time" id="startTime" required>
              <input
                id="startTime"
                type="time"
                value={form.startTime}
                onChange={handleChange("startTime")}
                className={inputClass()}
                required
              />
            </FormField>

            <FormField label="End Time" id="endTime" required>
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
                className={inputClass()}
                required
              />
            </FormField>

            <FormField
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
            </FormField>

            <FormField label="Name of the Organization" id="organizationName" required>
              <input
                id="organizationName"
                type="text"
                value={form.organizationName}
                onChange={handleChange("organizationName")}
                placeholder="Enter organization name"
                className={inputClass()}
                required
              />
            </FormField>

            <div className="md:col-span-2">
              <FormField label="Contact Person Name" id="contactPersonName" required>
                <input
                  id="contactPersonName"
                  type="text"
                  value={form.contactPersonName}
                  onChange={handleChange("contactPersonName")}
                  placeholder="Enter contact person name"
                  className={inputClass()}
                  required
                />
              </FormField>
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
                          {[center.address, center.city, center.state, center.country, center.pinCode]
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
                          {`${form.startDate || "—"} to ${form.endDate || "—"}`}
                        </dd>
                      </div>
                      <div>
                        <dt className="font-semibold text-[#0b1a33]">Timing</dt>
                        <dd className="mt-1 text-[#6b7280]">
                          {`${form.startTime || "—"} to ${form.endTime || "—"}`}
                        </dd>
                      </div>
                      <div>
                        <dt className="font-semibold text-[#0b1a33]">Category</dt>
                        <dd className="mt-1 text-[#6b7280]">
                          {formatStarLabel(center.category || form.category)}
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
