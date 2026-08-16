"use client";

import CenterMapPicker from "@/sharedComponent/CenterMapPicker";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { toast } from "react-toastify";

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
  centerName: "",
  address: "",
  city: "",
  state: "",
  seatingCapacity: "",
  contactPerson: "",
  contactPhone: "",
  contactEmail: "",
  latitude: "",
  longitude: "",
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

function inputClass(hasError = false) {
  return `w-full rounded-lg border bg-white px-4 py-3 text-sm text-[#1f2937] outline-none transition-colors ${
    hasError
      ? "border-[#b03a2e] focus:border-[#b03a2e] focus:ring-2 focus:ring-[#b03a2e]/15"
      : "border-[#e5e7eb] focus:border-[#0a7ea4] focus:ring-2 focus:ring-[#0a7ea4]/15"
  }`;
}

export default function UpdateCenter() {
  const [form, setForm] = useState(INITIAL_FORM);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function loadCenter() {
      try {
        const response = await fetch("/api/client/center", {
          credentials: "include",
        });
        const data = await response.json();

        if (response.ok && data.success) {
          setForm({ ...INITIAL_FORM, ...data.data });
        } else {
          toast.error(data.result || "Failed to load center details");
        }
      } catch {
        toast.error("Failed to load center details");
      } finally {
        setLoading(false);
      }
    }

    loadCenter();
  }, []);

  const handleChange = (field) => (event) => {
    setForm((prev) => ({ ...prev, [field]: event.target.value }));
  };

  const handleLocationChange = useCallback((lat, lng) => {
    setForm((prev) => ({
      ...prev,
      latitude: lat == null ? "" : lat.toFixed(6),
      longitude: lng == null ? "" : lng.toFixed(6),
    }));
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);

    try {
      const response = await fetch("/api/client/center", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(form),
      });
      const data = await response.json();

      if (response.ok && data.success) {
        toast.success(data.result);
      } else {
        toast.error(data.result || "Failed to update center details");
      }
    } catch {
      toast.error("Failed to update center details");
    } finally {
      setSaving(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#f4f7fb] px-4 py-8 sm:px-6 lg:px-10">
      <div className="mx-auto max-w-5xl">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-[#0a7ea4]">
              Client Portal
            </p>
            <h1 className="mt-1 text-3xl font-bold text-[#0b1a33]">Update Center</h1>
            <p className="mt-2 max-w-2xl text-sm text-[#6b7280]">
              Add your test center details, location coordinates, seating capacity, and contact
              information for BookMyCenter review.
            </p>
          </div>
          <Link
            href="/client/dashboard"
            className="inline-flex items-center justify-center rounded-lg border border-[#0a7ea4] px-4 py-2 text-sm font-semibold text-[#0a7ea4] transition hover:bg-[#0a7ea4]/5"
          >
            Back to Dashboard
          </Link>
        </div>

        {loading ? (
          <div className="rounded-2xl bg-white p-10 text-center text-sm text-[#6b7280] shadow-sm ring-1 ring-[#e5e7eb]">
            Loading center details...
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <section className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-[#e5e7eb]">
              <h2 className="text-xl font-bold text-[#0b1a33]">Center Information</h2>
              <p className="mt-1 text-sm text-[#6b7280]">
                Basic details about your test center.
              </p>

              <div className="mt-6 grid grid-cols-1 gap-5 md:grid-cols-2">
                <div className="md:col-span-2">
                  <FormField label="Center Name" id="centerName" required>
                    <input
                      id="centerName"
                      type="text"
                      value={form.centerName}
                      onChange={handleChange("centerName")}
                      placeholder="e.g. Rohtak Certification Center"
                      className={inputClass()}
                      required
                    />
                  </FormField>
                </div>

                <div className="md:col-span-2">
                  <FormField label="Full Address" id="address">
                    <textarea
                      id="address"
                      value={form.address}
                      onChange={handleChange("address")}
                      placeholder="Building, street, landmark, pin code"
                      rows={3}
                      className={inputClass()}
                    />
                  </FormField>
                </div>

                

                <FormField label="State" id="state" required>
                  <select
                    id="state"
                    value={form.state}
                    onChange={handleChange("state")}
                    className={inputClass()}
                    required
                  >
                    <option value="">Select state</option>
                    {INDIAN_STATES.map((state) => (
                      <option key={state} value={state}>
                        {state}
                      </option>
                    ))}
                  </select>
                </FormField>

                <FormField label="City" id="city" required>
                  <input
                    id="city"
                    type="text"
                    value={form.city}
                    onChange={handleChange("city")}
                    placeholder="City"
                    className={inputClass()}
                    required
                  />
                </FormField>

                <FormField
                  label="Number of Seating"
                  id="seatingCapacity"
                  required
                  hint="Total seats available for candidates at your center"
                >
                  <input
                    id="seatingCapacity"
                    type="number"
                    min="1"
                    value={form.seatingCapacity}
                    onChange={handleChange("seatingCapacity")}
                    placeholder="e.g. 40"
                    className={inputClass()}
                    required
                  />
                </FormField>
              </div>
            </section>

            <section className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-[#e5e7eb]">
              <h2 className="text-xl font-bold text-[#0b1a33]">Center Location</h2>
              <p className="mt-1 text-sm text-[#6b7280]">
                Pin your center on the interactive map to save latitude and longitude coordinates.
              </p>

              <div className="mt-6">
                <CenterMapPicker
                  latitude={form.latitude}
                  longitude={form.longitude}
                  onLocationChange={handleLocationChange}
                />
              </div>

              <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2">
                <FormField label="Latitude" id="latitude">
                  <input
                    id="latitude"
                    type="text"
                    value={form.latitude}
                    onChange={handleChange("latitude")}
                    placeholder="e.g. 28.613939"
                    className={inputClass()}
                  />
                </FormField>

                <FormField label="Longitude" id="longitude">
                  <input
                    id="longitude"
                    type="text"
                    value={form.longitude}
                    onChange={handleChange("longitude")}
                    placeholder="e.g. 77.209023"
                    className={inputClass()}
                  />
                </FormField>
              </div>
            </section>

            <section className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-[#e5e7eb]">
              <h2 className="text-xl font-bold text-[#0b1a33]">Contact Information</h2>
              <p className="mt-1 text-sm text-[#6b7280]">
                Contact details shown to candidates and the BookMyCenter team.
              </p>

              <div className="mt-6 grid grid-cols-1 gap-5 md:grid-cols-2">
                <FormField label="Contact Person" id="contactPerson">
                  <input
                    id="contactPerson"
                    type="text"
                    value={form.contactPerson}
                    onChange={handleChange("contactPerson")}
                    placeholder="Primary contact name"
                    className={inputClass()}
                  />
                </FormField>

                <FormField label="Contact Phone" id="contactPhone" required>
                  <input
                    id="contactPhone"
                    type="tel"
                    value={form.contactPhone}
                    onChange={handleChange("contactPhone")}
                    placeholder="10-digit mobile number"
                    className={inputClass()}
                    required
                  />
                </FormField>

                <div className="md:col-span-2">
                  <FormField label="Contact Email" id="contactEmail" required>
                    <input
                      id="contactEmail"
                      type="email"
                      value={form.contactEmail}
                      onChange={handleChange("contactEmail")}
                      placeholder="center@example.com"
                      className={inputClass()}
                      required
                    />
                  </FormField>
                </div>
              </div>
            </section>

            <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
              <Link
                href="/client/dashboard"
                className="inline-flex items-center justify-center rounded-lg border border-[#e5e7eb] bg-white px-6 py-3 text-sm font-semibold text-[#0b1a33] transition hover:bg-[#f9fafb]"
              >
                Cancel
              </Link>
              <button
                type="submit"
                disabled={saving}
                className="inline-flex items-center justify-center rounded-lg bg-[#0a7ea4] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#086688] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {saving ? "Saving..." : "Save Center Details"}
              </button>
            </div>
          </form>
        )}
      </div>
    </main>
  );
}
