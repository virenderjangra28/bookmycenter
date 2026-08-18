"use client";

import CenterMapPicker from "@/sharedComponent/CenterMapPicker";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { toast } from "react-toastify";
import {
  AUTH_FACILITIES,
  CENTER_TYPES,
  CCTV_COVERAGE_OPTIONS,
  CONNECTION_TYPES,
  createCenter,
  createInitialForm,
  MANDATORY_PHOTO_FIELDS,
  OPERATING_DAYS,
  ORGANIZATION_TYPES,
  STAR_RATINGS,
} from "@/app/become-partner/constants";
import {
  CheckboxGroup,
  FileUploadField,
  FormField,
  inputClass,
  MultiPhotoUpload,
  readFileAsDataUrl,
  sectionClass,
  SectionHeader,
  YesNoSelect,
} from "@/app/become-partner/FormControls";

const REQUIRED_PHOTO_KEYS = [
  "buildingFront",
  "reception",
  "computerLab",
  "candidateSeating",
  "cctvCoverage",
  "upsPowerBackup",
  "fireSafety",
  "emergencyExit",
];

export default function UpdateCenter() {
  const [form, setForm] = useState(createInitialForm);
  const [countries, setCountries] = useState([]);
  const [loadingCountries, setLoadingCountries] = useState(true);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showCountryDropdown, setShowCountryDropdown] = useState(false);
  const countrySearchRef = useRef(null);

  const isCbt = form.centerType === "CBT";
  const isPbt = form.centerType === "PBT/Paper Exam";

  const filteredCountries = useMemo(() => {
    const query = form.country.trim().toLowerCase();
    if (!query) return countries;
    return countries.filter((country) => country.name.toLowerCase().includes(query));
  }, [countries, form.country]);

  useEffect(() => {
    async function loadCountries() {
      try {
        const response = await fetch("/api/countrylist");
        const data = await response.json();
        if (!response.ok) throw new Error(data.error);
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
    async function loadCenter() {
      try {
        const response = await fetch("/api/client/center", { credentials: "include" });
        const data = await response.json();

        if (response.ok && data.success) {
          const next = data.data || {};
          const defaults = createInitialForm();
          setForm({
            ...defaults,
            ...next,
            locationPhotos: { ...defaults.locationPhotos, ...(next.locationPhotos || {}) },
            banking: { ...defaults.banking, ...(next.banking || {}) },
            availability: { ...defaults.availability, ...(next.availability || {}) },
            declaration: { ...defaults.declaration, ...(next.declaration || {}) },
            centers: Array.isArray(next.centers) && next.centers.length ? next.centers : defaults.centers,
          });
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

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!countrySearchRef.current?.contains(event.target)) {
        setShowCountryDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const updateForm = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const updateNested = (section, field, value) => {
    setForm((prev) => ({
      ...prev,
      [section]: { ...prev[section], [field]: value },
    }));
  };

  const updateCenter = (index, updater) => {
    setForm((prev) => ({
      ...prev,
      centers: prev.centers.map((center, i) => (i === index ? updater(center) : center)),
    }));
  };

  const updateCenterField = (index, field, value) => {
    updateCenter(index, (center) => ({ ...center, [field]: value }));
  };

  const updateCenterSection = (index, section, field, value) => {
    updateCenter(index, (center) => ({
      ...center,
      [section]: { ...center[section], [field]: value },
    }));
  };

  const handleLocationChange = useCallback((lat, lng) => {
    setForm((prev) => ({
      ...prev,
      latitude: lat == null ? "" : lat.toFixed(6),
      longitude: lng == null ? "" : lng.toFixed(6),
    }));
  }, []);

  const handleSingleFile = (field) => async (event) => {
    const file = event.target.files?.[0];
    if (!file) {
      updateForm(field, "");
      return;
    }
    try {
      updateForm(field, await readFileAsDataUrl(file));
    } catch {
      toast.error("Failed to read file");
    }
  };

  const handleBankFile = async (event) => {
    const file = event.target.files?.[0];
    if (!file) {
      updateNested("banking", "cancelledCheque", "");
      return;
    }
    try {
      updateNested("banking", "cancelledCheque", await readFileAsDataUrl(file));
    } catch {
      toast.error("Failed to read file");
    }
  };

  const handleLocationPhotos = (key) => async (event) => {
    const files = Array.from(event.target.files || []);
    if (!files.length) return;
    try {
      const urls = await Promise.all(files.map((file) => readFileAsDataUrl(file)));
      setForm((prev) => ({
        ...prev,
        locationPhotos: {
          ...prev.locationPhotos,
          [key]: [...(prev.locationPhotos[key] || []), ...urls],
        },
      }));
    } catch {
      toast.error("Failed to read photos");
    }
  };

  const handleCenterPhotos = (centerIndex, photoKey) => async (event) => {
    const files = Array.from(event.target.files || []);
    if (!files.length) return;
    try {
      const urls = await Promise.all(files.map((file) => readFileAsDataUrl(file)));
      updateCenter(centerIndex, (center) => ({
        ...center,
        photos: {
          ...center.photos,
          [photoKey]: [...(center.photos[photoKey] || []), ...urls],
        },
      }));
    } catch {
      toast.error("Failed to read photos");
    }
  };

  const addCenter = () => {
    setForm((prev) => ({
      ...prev,
      centers: [...prev.centers, createCenter(prev.centers.length + 1)],
    }));
  };

  const removeCenter = (index) => {
    if (form.centers.length === 1) return;
    setForm((prev) => ({
      ...prev,
      centers: prev.centers.filter((_, i) => i !== index),
    }));
  };

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
        toast.success(data.result || "Center details updated successfully");
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
    <main className="px-5 py-8 sm:px-8 lg:px-10 lg:py-10">
      <div className="max-w-5xl">
        <div className="mb-8">
          <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-[#2563eb]">
            Client Portal
          </p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-[#0b1a33]">Update Center</h1>
          <p className="mt-2 max-w-2xl text-sm text-[#64748b]">
            Keep your organisation, location, infrastructure, and availability details up to date.
            Fields marked with * are required.
          </p>
        </div>

        {loading ? (
          <div className="rounded-2xl bg-white p-10 text-center text-sm text-[#6b7280] shadow-sm ring-1 ring-[#e5e7eb]">
            Loading center details...
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <section className={sectionClass()}>
              <SectionHeader title="Organization Details" description="Tell us about your organization." />
              <div className="mt-6 grid grid-cols-1 gap-5 md:grid-cols-2">
                <div className="md:col-span-2">
                  <FormField label="Name of the Organization" id="organizationName" required>
                    <input
                      id="organizationName"
                      value={form.organizationName}
                      onChange={(e) => updateForm("organizationName", e.target.value)}
                      className={inputClass()}
                      required
                    />
                  </FormField>
                </div>
                <FormField label="Type of Organisation" id="organizationType" required>
                  <select
                    id="organizationType"
                    value={form.organizationType}
                    onChange={(e) => updateForm("organizationType", e.target.value)}
                    className={inputClass()}
                    required
                  >
                    <option value="">Select type</option>
                    {ORGANIZATION_TYPES.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                </FormField>
                <FormField label="Contact Person Name" id="contactPersonName" required>
                  <input
                    id="contactPersonName"
                    value={form.contactPersonName}
                    onChange={(e) => updateForm("contactPersonName", e.target.value)}
                    className={inputClass()}
                    required
                  />
                </FormField>
                <FormField label="Email ID" id="email" required>
                  <input
                    id="email"
                    type="email"
                    value={form.email}
                    onChange={(e) => updateForm("email", e.target.value)}
                    className={inputClass()}
                    required
                    placeholder="center@example.com"
                  />
                </FormField>
                <FormField label="Contact Number" id="contactNumber" required>
                  <input
                    id="contactNumber"
                    type="tel"
                    value={form.contactNumber}
                    onChange={(e) => updateForm("contactNumber", e.target.value)}
                    className={inputClass()}
                    required
                    placeholder="10-digit mobile number"
                  />
                </FormField>
                <FormField label="Type of Centre" id="centerType" required>
                  <select
                    id="centerType"
                    value={form.centerType}
                    onChange={(e) => updateForm("centerType", e.target.value)}
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
                <FormField label="Rate Your Centre" id="centerRating" required>
                  <select
                    id="centerRating"
                    value={form.centerRating}
                    onChange={(e) => updateForm("centerRating", e.target.value)}
                    className={inputClass()}
                    required
                  >
                    <option value="">Select rating</option>
                    {STAR_RATINGS.map((rating) => (
                      <option key={rating.value} value={rating.value}>
                        {rating.label}
                      </option>
                    ))}
                  </select>
                </FormField>
                <FormField label="Centre Capacity" id="centreCapacity" required>
                  <input
                    id="centreCapacity"
                    type="number"
                    min="1"
                    value={form.centreCapacity}
                    onChange={(e) => updateForm("centreCapacity", e.target.value)}
                    className={inputClass()}
                    required
                  />
                </FormField>
              </div>
            </section>

            <section className={sectionClass()}>
              <SectionHeader title="Location" description="Country → State → City → Pin Code → Full Address" />
              <div className="mt-6 grid grid-cols-1 gap-5 md:grid-cols-2">
                <FormField label="Country" id="country" required>
                  <div ref={countrySearchRef} className="relative">
                    <input
                      id="country"
                      type="search"
                      value={form.country}
                      onChange={(e) => {
                        updateForm("country", e.target.value);
                        setShowCountryDropdown(true);
                      }}
                      onFocus={() => setShowCountryDropdown(true)}
                      placeholder={loadingCountries ? "Loading..." : "Search country"}
                      className={inputClass()}
                      required
                      disabled={loadingCountries}
                    />
                    {showCountryDropdown && !loadingCountries ? (
                      <ul className="absolute inset-x-0 top-full z-20 mt-2 max-h-56 overflow-y-auto rounded-lg border border-[#e5e7eb] bg-white py-2 shadow-lg">
                        {filteredCountries.map((country) => (
                          <li key={country.code || country.name}>
                            <button
                              type="button"
                              onClick={() => {
                                updateForm("country", country.name);
                                setShowCountryDropdown(false);
                              }}
                              className="flex w-full items-center gap-2 px-4 py-2.5 text-left text-sm hover:bg-[#f3f4f6]"
                            >
                              {country.flag ? <span>{country.flag}</span> : null}
                              <span>{country.name}</span>
                            </button>
                          </li>
                        ))}
                      </ul>
                    ) : null}
                  </div>
                </FormField>
                <FormField label="State" id="state" required>
                  <input
                    id="state"
                    value={form.state}
                    onChange={(e) => updateForm("state", e.target.value)}
                    className={inputClass()}
                    required
                  />
                </FormField>
                <FormField label="City" id="city" required>
                  <input
                    id="city"
                    value={form.city}
                    onChange={(e) => updateForm("city", e.target.value)}
                    className={inputClass()}
                    required
                  />
                </FormField>
                <FormField label="Pin Code" id="pinCode" required>
                  <input
                    id="pinCode"
                    value={form.pinCode}
                    onChange={(e) => updateForm("pinCode", e.target.value)}
                    className={inputClass()}
                    required
                  />
                </FormField>
                <div className="md:col-span-2">
                  <FormField label="Full Address" id="fullAddress" required>
                    <textarea
                      id="fullAddress"
                      value={form.fullAddress}
                      onChange={(e) => updateForm("fullAddress", e.target.value)}
                      rows={3}
                      className={inputClass()}
                      required
                    />
                  </FormField>
                </div>
                <div className="md:col-span-2">
                  <CenterMapPicker
                    latitude={form.latitude}
                    longitude={form.longitude}
                    onLocationChange={handleLocationChange}
                  />
                </div>
                <FormField label="Latitude" id="latitude" required>
                  <input
                    id="latitude"
                    value={form.latitude}
                    onChange={(e) => updateForm("latitude", e.target.value)}
                    className={inputClass()}
                    required
                  />
                </FormField>
                <FormField label="Longitude" id="longitude" required>
                  <input
                    id="longitude"
                    value={form.longitude}
                    onChange={(e) => updateForm("longitude", e.target.value)}
                    className={inputClass()}
                    required
                  />
                </FormField>
                <MultiPhotoUpload
                  id="locationHall"
                  label="Centre Hall Photos"
                  required={!form.locationPhotos.hall?.length}
                  values={form.locationPhotos.hall || []}
                  onChange={handleLocationPhotos("hall")}
                />
                <MultiPhotoUpload
                  id="locationEntrance"
                  label="Entrance Photos"
                  required={!form.locationPhotos.entrance?.length}
                  values={form.locationPhotos.entrance || []}
                  onChange={handleLocationPhotos("entrance")}
                />
                <MultiPhotoUpload
                  id="locationWashroom"
                  label="Washroom Photos"
                  required={!form.locationPhotos.washroom?.length}
                  values={form.locationPhotos.washroom || []}
                  onChange={handleLocationPhotos("washroom")}
                />
              </div>
            </section>

            <section className={sectionClass()}>
              <SectionHeader title="Legal & Registration Documents" />
              <div className="mt-6 grid grid-cols-1 gap-5 md:grid-cols-2">
                <FormField label="GST Number" id="gstNumber" required>
                  <input
                    id="gstNumber"
                    value={form.gstNumber}
                    onChange={(e) => updateForm("gstNumber", e.target.value)}
                    className={inputClass()}
                    required
                  />
                </FormField>
                <FileUploadField
                  id="gstDocument"
                  label="GST Document"
                  required={!form.gstDocument}
                  value={form.gstDocument}
                  onChange={handleSingleFile("gstDocument")}
                  accept=".pdf,image/*"
                />
                <FormField label="PAN / Tax Registration Number" id="panNumber" required>
                  <input
                    id="panNumber"
                    value={form.panNumber}
                    onChange={(e) => updateForm("panNumber", e.target.value)}
                    className={inputClass()}
                    required
                  />
                </FormField>
                <FileUploadField
                  id="panDocument"
                  label="PAN / Tax Document"
                  required={!form.panDocument}
                  value={form.panDocument}
                  onChange={handleSingleFile("panDocument")}
                  accept=".pdf,image/*"
                />
                <FormField label="Registration / Incorporation Number" id="registrationNumber" required>
                  <input
                    id="registrationNumber"
                    value={form.registrationNumber}
                    onChange={(e) => updateForm("registrationNumber", e.target.value)}
                    className={inputClass()}
                    required
                  />
                </FormField>
                <FileUploadField
                  id="registrationDocument"
                  label="Registration Document"
                  required={!form.registrationDocument}
                  value={form.registrationDocument}
                  onChange={handleSingleFile("registrationDocument")}
                  accept=".pdf,image/*"
                />
              </div>
            </section>

            {form.centers.map((center, centerIndex) => (
              <section key={center._id || center.id} className={sectionClass()}>
                <div className="flex items-start justify-between gap-4">
                  <SectionHeader
                    title={center.label}
                    description="Centre configuration and infrastructure details."
                  />
                  {form.centers.length > 1 ? (
                    <button
                      type="button"
                      onClick={() => removeCenter(centerIndex)}
                      className="text-sm font-semibold text-[#b03a2e]"
                    >
                      Remove
                    </button>
                  ) : null}
                </div>
                <div className="mt-6 grid grid-cols-1 gap-5 md:grid-cols-2">
                  <FormField label="Separate Registration Area" id={`reg-${centerIndex}`} required>
                    <YesNoSelect
                      id={`reg-${centerIndex}`}
                      value={center.separateRegistrationArea}
                      onChange={(e) =>
                        updateCenterField(centerIndex, "separateRegistrationArea", e.target.value)
                      }
                      required
                    />
                  </FormField>
                  <FormField label="Candidate Bag / Belongings Storage" id={`bag-${centerIndex}`} required>
                    <YesNoSelect
                      id={`bag-${centerIndex}`}
                      value={center.bagStorage}
                      onChange={(e) => updateCenterField(centerIndex, "bagStorage", e.target.value)}
                      required
                    />
                  </FormField>
                  <FormField label="Total Centre Area (Sq. Ft.)" id={`area-${centerIndex}`} required>
                    <input
                      id={`area-${centerIndex}`}
                      type="number"
                      min="1"
                      value={center.totalAreaSqFt}
                      onChange={(e) => updateCenterField(centerIndex, "totalAreaSqFt", e.target.value)}
                      className={inputClass()}
                      required
                    />
                  </FormField>
                  <FormField
                    label="Number of Examination Rooms / Labs"
                    id={`rooms-${centerIndex}`}
                    required
                  >
                    <input
                      id={`rooms-${centerIndex}`}
                      type="number"
                      min="1"
                      value={center.examRooms}
                      onChange={(e) => updateCenterField(centerIndex, "examRooms", e.target.value)}
                      className={inputClass()}
                      required
                    />
                  </FormField>
                  <FormField label="Total Seating Capacity" id={`seats-${centerIndex}`} required>
                    <input
                      id={`seats-${centerIndex}`}
                      type="number"
                      min="1"
                      value={center.totalSeatingCapacity}
                      onChange={(e) =>
                        updateCenterField(centerIndex, "totalSeatingCapacity", e.target.value)
                      }
                      className={inputClass()}
                      required
                    />
                  </FormField>
                  <FormField
                    label="Total Computer Capacity"
                    id={`computers-${centerIndex}`}
                    required={isCbt}
                  >
                    <input
                      id={`computers-${centerIndex}`}
                      type="number"
                      min="0"
                      value={center.totalComputerCapacity}
                      onChange={(e) =>
                        updateCenterField(centerIndex, "totalComputerCapacity", e.target.value)
                      }
                      className={inputClass()}
                      required={isCbt}
                    />
                  </FormField>
                  <FormField
                    label="Maximum Candidates Per Shift"
                    id={`maxshift-${centerIndex}`}
                    required
                  >
                    <input
                      id={`maxshift-${centerIndex}`}
                      type="number"
                      min="1"
                      value={center.maxCandidatesPerShift}
                      onChange={(e) =>
                        updateCenterField(centerIndex, "maxCandidatesPerShift", e.target.value)
                      }
                      className={inputClass()}
                      required
                    />
                  </FormField>
                  <FormField
                    label="Number of Shifts Possible Per Day"
                    id={`shifts-${centerIndex}`}
                    required
                  >
                    <input
                      id={`shifts-${centerIndex}`}
                      type="number"
                      min="1"
                      value={center.shiftsPerDay}
                      onChange={(e) => updateCenterField(centerIndex, "shiftsPerDay", e.target.value)}
                      className={inputClass()}
                      required
                    />
                  </FormField>
                  <FormField label="Waiting Area Available" id={`wait-${centerIndex}`} required>
                    <YesNoSelect
                      id={`wait-${centerIndex}`}
                      value={center.waitingArea}
                      onChange={(e) => updateCenterField(centerIndex, "waitingArea", e.target.value)}
                      required
                    />
                  </FormField>
                </div>

                {isCbt ? (
                  <>
                    <h3 className="mt-8 text-lg font-bold text-[#0b1a33]">Computer Infrastructure</h3>
                    <div className="mt-4 grid grid-cols-1 gap-5 md:grid-cols-2">
                      {[
                        ["totalComputers", "Total Computers", true],
                        ["backupComputers", "Number of Backup Computers", true],
                        ["processorConfiguration", "Processor Configuration", false],
                        ["minimumRam", "Minimum RAM", false],
                        ["operatingSystem", "Operating System", false],
                        ["monitorSize", "Monitor Size", false],
                        ["systemsConnectedThroughLan", "Systems Connected Through LAN", false],
                      ].map(([field, label, req]) => (
                        <FormField key={field} label={label} id={`${field}-${centerIndex}`} required={req}>
                          <input
                            id={`${field}-${centerIndex}`}
                            value={center.cbtInfrastructure?.[field] || ""}
                            onChange={(e) =>
                              updateCenterSection(centerIndex, "cbtInfrastructure", field, e.target.value)
                            }
                            className={inputClass()}
                            required={req}
                          />
                        </FormField>
                      ))}
                      {[
                        ["webcamAvailable", "Webcam Available"],
                        ["headphonesAvailable", "Headphones Available"],
                        ["microphoneAvailable", "Microphone Available"],
                        ["lanConnectivity", "LAN Connectivity"],
                        ["usbPortsDisabled", "USB Ports Can Be Disabled"],
                        ["localAdminRestricted", "Local Admin Access Can Be Restricted"],
                        ["secureBrowserCompatible", "Secure / Lockdown Browser Compatible"],
                      ].map(([field, label]) => (
                        <FormField key={field} label={label} id={`${field}-${centerIndex}`}>
                          <YesNoSelect
                            id={`${field}-${centerIndex}`}
                            value={center.cbtInfrastructure?.[field] || ""}
                            onChange={(e) =>
                              updateCenterSection(centerIndex, "cbtInfrastructure", field, e.target.value)
                            }
                          />
                        </FormField>
                      ))}
                    </div>

                    <h3 className="mt-8 text-lg font-bold text-[#0b1a33]">Internet Infrastructure</h3>
                    <div className="mt-4 grid grid-cols-1 gap-5 md:grid-cols-2">
                      <FormField
                        label="Primary Internet Service Provider"
                        id={`isp-${centerIndex}`}
                        required
                      >
                        <input
                          id={`isp-${centerIndex}`}
                          value={center.internetInfrastructure?.primaryIsp || ""}
                          onChange={(e) =>
                            updateCenterSection(
                              centerIndex,
                              "internetInfrastructure",
                              "primaryIsp",
                              e.target.value
                            )
                          }
                          className={inputClass()}
                          required
                        />
                      </FormField>
                      <FormField label="Primary Internet Speed" id={`speed-${centerIndex}`} required>
                        <input
                          id={`speed-${centerIndex}`}
                          value={center.internetInfrastructure?.primarySpeed || ""}
                          onChange={(e) =>
                            updateCenterSection(
                              centerIndex,
                              "internetInfrastructure",
                              "primarySpeed",
                              e.target.value
                            )
                          }
                          className={inputClass()}
                          required
                        />
                      </FormField>
                      <FormField label="Connection Type" id={`conn-${centerIndex}`} required>
                        <select
                          id={`conn-${centerIndex}`}
                          value={center.internetInfrastructure?.connectionType || ""}
                          onChange={(e) =>
                            updateCenterSection(
                              centerIndex,
                              "internetInfrastructure",
                              "connectionType",
                              e.target.value
                            )
                          }
                          className={inputClass()}
                          required
                        >
                          <option value="">Select</option>
                          {CONNECTION_TYPES.map((type) => (
                            <option key={type} value={type}>
                              {type}
                            </option>
                          ))}
                        </select>
                      </FormField>
                      {[
                        ["dedicatedConnection", "Dedicated Internet Connection"],
                        ["staticIpAvailable", "Static IP Available"],
                        ["backupInternetAvailable", "Secondary / Backup Internet Available"],
                        ["loadBalancingAvailable", "Load Balancing / Auto Failover Available"],
                      ].map(([field, label]) => (
                        <FormField key={field} label={label} id={`${field}-${centerIndex}`}>
                          <YesNoSelect
                            id={`${field}-${centerIndex}`}
                            value={center.internetInfrastructure?.[field] || ""}
                            onChange={(e) =>
                              updateCenterSection(
                                centerIndex,
                                "internetInfrastructure",
                                field,
                                e.target.value
                              )
                            }
                          />
                        </FormField>
                      ))}
                      <FormField label="Backup ISP Name" id={`backupIsp-${centerIndex}`}>
                        <input
                          id={`backupIsp-${centerIndex}`}
                          value={center.internetInfrastructure?.backupIspName || ""}
                          onChange={(e) =>
                            updateCenterSection(
                              centerIndex,
                              "internetInfrastructure",
                              "backupIspName",
                              e.target.value
                            )
                          }
                          className={inputClass()}
                        />
                      </FormField>
                      <FormField label="Backup Internet Speed" id={`backupSpeed-${centerIndex}`}>
                        <input
                          id={`backupSpeed-${centerIndex}`}
                          value={center.internetInfrastructure?.backupSpeed || ""}
                          onChange={(e) =>
                            updateCenterSection(
                              centerIndex,
                              "internetInfrastructure",
                              "backupSpeed",
                              e.target.value
                            )
                          }
                          className={inputClass()}
                        />
                      </FormField>
                    </div>
                  </>
                ) : null}

                {isPbt ? (
                  <>
                    <h3 className="mt-8 text-lg font-bold text-[#0b1a33]">PBT / OMR Infrastructure</h3>
                    <div className="mt-4 grid grid-cols-1 gap-5 md:grid-cols-2">
                      {[
                        ["seatingCapacity", "Seating Capacity", "number"],
                        ["numberOfRooms", "Number of Rooms", "number"],
                        ["individualDeskAvailable", "Individual Desk / Seating Available", "yesno"],
                        ["secureQuestionPaperStorage", "Secure Question Paper Storage Area", "yesno"],
                        ["cctvCoverage", "CCTV Coverage", "yesno"],
                        ["printerFacility", "Printer / Photocopier Facility", "yesno"],
                        ["omrHandlingFacility", "OMR Handling Facility", "yesno"],
                        ["secureMaterialStorage", "Secure Material Storage", "yesno"],
                        ["materialDispatchFacility", "Examination Material Dispatch Facility", "yesno"],
                      ].map(([field, label, kind]) => (
                        <FormField key={field} label={label} id={`pbt-${field}-${centerIndex}`}>
                          {kind === "yesno" ? (
                            <YesNoSelect
                              id={`pbt-${field}-${centerIndex}`}
                              value={center.pbtInfrastructure?.[field] || ""}
                              onChange={(e) =>
                                updateCenterSection(
                                  centerIndex,
                                  "pbtInfrastructure",
                                  field,
                                  e.target.value
                                )
                              }
                            />
                          ) : (
                            <input
                              id={`pbt-${field}-${centerIndex}`}
                              type="number"
                              min="0"
                              value={center.pbtInfrastructure?.[field] || ""}
                              onChange={(e) =>
                                updateCenterSection(
                                  centerIndex,
                                  "pbtInfrastructure",
                                  field,
                                  e.target.value
                                )
                              }
                              className={inputClass()}
                            />
                          )}
                        </FormField>
                      ))}
                    </div>
                  </>
                ) : null}

                <h3 className="mt-8 text-lg font-bold text-[#0b1a33]">Power Infrastructure</h3>
                <div className="mt-4 grid grid-cols-1 gap-5 md:grid-cols-2">
                  {[
                    ["electricityAvailable", "Electricity Connection Available", true],
                    ["upsAvailable", "UPS Available", true],
                    ["generatorAvailable", "Generator / DG Set Available", false],
                    [
                      "labOperatesDuringPowerFailure",
                      "Can Entire Computer Lab Operate During Power Failure?",
                      true,
                    ],
                  ].map(([field, label, req]) => (
                    <FormField
                      key={field}
                      label={label}
                      id={`power-${field}-${centerIndex}`}
                      required={req}
                    >
                      <YesNoSelect
                        id={`power-${field}-${centerIndex}`}
                        value={center.powerInfrastructure?.[field] || ""}
                        onChange={(e) =>
                          updateCenterSection(centerIndex, "powerInfrastructure", field, e.target.value)
                        }
                        required={req}
                      />
                    </FormField>
                  ))}
                  <FormField label="UPS Backup Duration" id={`upsDur-${centerIndex}`}>
                    <input
                      id={`upsDur-${centerIndex}`}
                      value={center.powerInfrastructure?.upsBackupDuration || ""}
                      onChange={(e) =>
                        updateCenterSection(
                          centerIndex,
                          "powerInfrastructure",
                          "upsBackupDuration",
                          e.target.value
                        )
                      }
                      className={inputClass()}
                      placeholder="e.g. 2 hours"
                    />
                  </FormField>
                  <FormField label="Generator Capacity" id={`genCap-${centerIndex}`}>
                    <input
                      id={`genCap-${centerIndex}`}
                      value={center.powerInfrastructure?.generatorCapacity || ""}
                      onChange={(e) =>
                        updateCenterSection(
                          centerIndex,
                          "powerInfrastructure",
                          "generatorCapacity",
                          e.target.value
                        )
                      }
                      className={inputClass()}
                    />
                  </FormField>
                  <FormField label="Inverter / Alternate Backup" id={`inv-${centerIndex}`}>
                    <input
                      id={`inv-${centerIndex}`}
                      value={center.powerInfrastructure?.inverterBackup || ""}
                      onChange={(e) =>
                        updateCenterSection(
                          centerIndex,
                          "powerInfrastructure",
                          "inverterBackup",
                          e.target.value
                        )
                      }
                      className={inputClass()}
                    />
                  </FormField>
                </div>

                <h3 className="mt-8 text-lg font-bold text-[#0b1a33]">CCTV & Security</h3>
                <div className="mt-4 grid grid-cols-1 gap-5 md:grid-cols-2">
                  <FormField label="CCTV Cameras Installed" id={`cctv-${centerIndex}`} required>
                    <YesNoSelect
                      id={`cctv-${centerIndex}`}
                      value={center.cctvSecurity?.cctvInstalled || ""}
                      onChange={(e) =>
                        updateCenterSection(centerIndex, "cctvSecurity", "cctvInstalled", e.target.value)
                      }
                      required
                    />
                  </FormField>
                  <FormField label="Number of CCTV Cameras" id={`cctvNum-${centerIndex}`}>
                    <input
                      id={`cctvNum-${centerIndex}`}
                      type="number"
                      min="0"
                      value={center.cctvSecurity?.numberOfCameras || ""}
                      onChange={(e) =>
                        updateCenterSection(
                          centerIndex,
                          "cctvSecurity",
                          "numberOfCameras",
                          e.target.value
                        )
                      }
                      className={inputClass()}
                    />
                  </FormField>
                  <div className="md:col-span-2">
                    <FormField label="CCTV Coverage Includes" id={`cctvCov-${centerIndex}`}>
                      <CheckboxGroup
                        options={CCTV_COVERAGE_OPTIONS}
                        values={center.cctvSecurity?.cctvCoverage || []}
                        onChange={(option, checked) =>
                          updateCenter(centerIndex, (current) => ({
                            ...current,
                            cctvSecurity: {
                              ...current.cctvSecurity,
                              cctvCoverage: checked
                                ? [...(current.cctvSecurity?.cctvCoverage || []), option]
                                : (current.cctvSecurity?.cctvCoverage || []).filter(
                                    (value) => value !== option
                                  ),
                            },
                          }))
                        }
                      />
                    </FormField>
                  </div>
                  {[
                    ["recordingAvailable", "CCTV Recording Available"],
                    ["liveMonitoringAvailable", "Live CCTV Monitoring Available"],
                    ["remoteAccessPossible", "CCTV Remote Access Possible"],
                    ["securityGuardAvailable", "Security Guard Available"],
                    ["fireExtinguishersAvailable", "Fire Extinguishers Available"],
                    ["emergencyExitAvailable", "Emergency Exit Available"],
                    ["fireSafetyCertificateAvailable", "Fire Safety Compliance / Certificate Available"],
                  ].map(([field, label]) => (
                    <FormField
                      key={field}
                      label={label}
                      id={`sec-${field}-${centerIndex}`}
                      required={
                        field === "fireExtinguishersAvailable" || field === "emergencyExitAvailable"
                      }
                    >
                      <YesNoSelect
                        id={`sec-${field}-${centerIndex}`}
                        value={center.cctvSecurity?.[field] || ""}
                        onChange={(e) =>
                          updateCenterSection(centerIndex, "cctvSecurity", field, e.target.value)
                        }
                        required={
                          field === "fireExtinguishersAvailable" || field === "emergencyExitAvailable"
                        }
                      />
                    </FormField>
                  ))}
                  <FormField label="CCTV Recording Retention Period" id={`retention-${centerIndex}`}>
                    <input
                      id={`retention-${centerIndex}`}
                      value={center.cctvSecurity?.retentionPeriod || ""}
                      onChange={(e) =>
                        updateCenterSection(
                          centerIndex,
                          "cctvSecurity",
                          "retentionPeriod",
                          e.target.value
                        )
                      }
                      className={inputClass()}
                      placeholder="e.g. 30 days"
                    />
                  </FormField>
                </div>

                <h3 className="mt-8 text-lg font-bold text-[#0b1a33]">
                  Candidate Authentication Facilities
                </h3>
                <div className="mt-4">
                  <CheckboxGroup
                    options={AUTH_FACILITIES}
                    values={center.authenticationFacilities || []}
                    onChange={(option, checked) =>
                      updateCenter(centerIndex, (current) => ({
                        ...current,
                        authenticationFacilities: checked
                          ? [...(current.authenticationFacilities || []), option]
                          : (current.authenticationFacilities || []).filter((value) => value !== option),
                      }))
                    }
                  />
                </div>

                <h3 className="mt-8 text-lg font-bold text-[#0b1a33]">
                  Accessibility & Candidate Facilities
                </h3>
                <div className="mt-4 grid grid-cols-1 gap-5 md:grid-cols-2">
                  {Object.entries(center.accessibility || {}).map(([field, value]) => (
                    <FormField
                      key={field}
                      label={field.replace(/([A-Z])/g, " $1").replace(/^./, (s) => s.toUpperCase())}
                      id={`acc-${field}-${centerIndex}`}
                    >
                      <YesNoSelect
                        id={`acc-${field}-${centerIndex}`}
                        value={value}
                        onChange={(e) =>
                          updateCenterSection(centerIndex, "accessibility", field, e.target.value)
                        }
                      />
                    </FormField>
                  ))}
                </div>

                <h3 className="mt-8 text-lg font-bold text-[#0b1a33]">Centre Staff</h3>
                <div className="mt-4 grid grid-cols-1 gap-5 md:grid-cols-2">
                  {[
                    ["centreManager", "Centre Manager", "yesno"],
                    ["technicalSupportStaff", "Number of Technical Support Staff", "number"],
                    ["invigilators", "Number of Invigilators", "number"],
                    ["registrationStaff", "Number of Registration Staff", "number"],
                    ["securityPersonnel", "Security Personnel", "yesno"],
                    ["femaleInvigilators", "Female Invigilators", "yesno"],
                    ["itAdministrator", "IT Administrator", "yesno"],
                  ].map(([field, label, kind]) => (
                    <FormField key={field} label={label} id={`staff-${field}-${centerIndex}`}>
                      {kind === "yesno" ? (
                        <YesNoSelect
                          id={`staff-${field}-${centerIndex}`}
                          value={center.staff?.[field] || ""}
                          onChange={(e) =>
                            updateCenterSection(centerIndex, "staff", field, e.target.value)
                          }
                        />
                      ) : (
                        <input
                          id={`staff-${field}-${centerIndex}`}
                          type="number"
                          min="0"
                          value={center.staff?.[field] || ""}
                          onChange={(e) =>
                            updateCenterSection(centerIndex, "staff", field, e.target.value)
                          }
                          className={inputClass()}
                        />
                      )}
                    </FormField>
                  ))}
                </div>

                <h3 className="mt-8 text-lg font-bold text-[#0b1a33]">Centre Photographs</h3>
                <p className="mt-1 text-sm text-[#6b7280]">
                  Upload current photographs (geo-tagged preferred). Multiple photos allowed.
                </p>
                <div className="mt-4 grid grid-cols-1 gap-5 md:grid-cols-2">
                  {MANDATORY_PHOTO_FIELDS.map(({ key, label }) => (
                    <MultiPhotoUpload
                      key={key}
                      id={`photo-${key}-${centerIndex}`}
                      label={label}
                      required={
                        REQUIRED_PHOTO_KEYS.includes(key) && !(center.photos?.[key] || []).length
                      }
                      values={center.photos?.[key] || []}
                      onChange={handleCenterPhotos(centerIndex, key)}
                      hint="Allow multiple photos"
                    />
                  ))}
                </div>
              </section>
            ))}

            <div className="flex justify-end">
              <button
                type="button"
                onClick={addCenter}
                className="rounded-lg border border-[#0a7ea4] px-5 py-2.5 text-sm font-semibold text-[#0a7ea4] hover:bg-[#0a7ea4]/5"
              >
                + Add Another Centre
              </button>
            </div>

            <section className={sectionClass()}>
              <SectionHeader
                title="Commercial & Banking Details"
                description="Optional during initial registration. Can be submitted after centre approval."
              />
              <div className="mt-6 grid grid-cols-1 gap-5 md:grid-cols-2">
                <FormField label="Account Holder Name" id="accountHolderName">
                  <input
                    id="accountHolderName"
                    value={form.banking.accountHolderName}
                    onChange={(e) => updateNested("banking", "accountHolderName", e.target.value)}
                    className={inputClass()}
                  />
                </FormField>
                <FormField label="Bank Name" id="bankName">
                  <input
                    id="bankName"
                    value={form.banking.bankName}
                    onChange={(e) => updateNested("banking", "bankName", e.target.value)}
                    className={inputClass()}
                  />
                </FormField>
                <FormField label="Account Number" id="accountNumber">
                  <input
                    id="accountNumber"
                    value={form.banking.accountNumber}
                    onChange={(e) => updateNested("banking", "accountNumber", e.target.value)}
                    className={inputClass()}
                  />
                </FormField>
                <FormField label="IFSC / Bank Code" id="ifscCode">
                  <input
                    id="ifscCode"
                    value={form.banking.ifscCode}
                    onChange={(e) => updateNested("banking", "ifscCode", e.target.value)}
                    className={inputClass()}
                  />
                </FormField>
                <FormField label="Branch" id="branch">
                  <input
                    id="branch"
                    value={form.banking.branch}
                    onChange={(e) => updateNested("banking", "branch", e.target.value)}
                    className={inputClass()}
                  />
                </FormField>
                <FileUploadField
                  id="cancelledCheque"
                  label="Cancelled Cheque Upload"
                  value={form.banking.cancelledCheque}
                  onChange={handleBankFile}
                  accept="image/*,.pdf"
                />
              </div>
            </section>

            <section className={sectionClass()}>
              <SectionHeader title="Centre Availability" />
              <div className="mt-6 space-y-5">
                <FormField label="Operating Days" id="operatingDays" required>
                  <CheckboxGroup
                    options={OPERATING_DAYS}
                    values={form.availability.operatingDays}
                    onChange={(day, checked) =>
                      updateNested(
                        "availability",
                        "operatingDays",
                        checked
                          ? [...form.availability.operatingDays, day]
                          : form.availability.operatingDays.filter((value) => value !== day)
                      )
                    }
                  />
                </FormField>
                <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                  <FormField label="Operating Hours From" id="hoursFrom" required>
                    <input
                      id="hoursFrom"
                      type="time"
                      value={form.availability.hoursFrom}
                      onChange={(e) => updateNested("availability", "hoursFrom", e.target.value)}
                      className={inputClass()}
                      required
                    />
                  </FormField>
                  <FormField label="Operating Hours To" id="hoursTo" required>
                    <input
                      id="hoursTo"
                      type="time"
                      value={form.availability.hoursTo}
                      onChange={(e) => updateNested("availability", "hoursTo", e.target.value)}
                      className={inputClass()}
                      required
                    />
                  </FormField>
                </div>
                <CheckboxGroup
                  options={[
                    "Available for Weekday Exams",
                    "Available for Weekend Exams",
                    "Available for Multi-Day Exams",
                    "Available for Short-Notice Exams",
                  ]}
                  values={[
                    form.availability.weekdayExams && "Available for Weekday Exams",
                    form.availability.weekendExams && "Available for Weekend Exams",
                    form.availability.multiDayExams && "Available for Multi-Day Exams",
                    form.availability.shortNoticeExams && "Available for Short-Notice Exams",
                  ].filter(Boolean)}
                  onChange={(option, checked) => {
                    const map = {
                      "Available for Weekday Exams": "weekdayExams",
                      "Available for Weekend Exams": "weekendExams",
                      "Available for Multi-Day Exams": "multiDayExams",
                      "Available for Short-Notice Exams": "shortNoticeExams",
                    };
                    updateNested("availability", map[option], checked);
                  }}
                />
              </div>
            </section>

            <section className={sectionClass()}>
              <SectionHeader title="Compliance Declaration" description="Centre Declaration" />
              <div className="mt-6 space-y-4 text-sm text-[#4b5563]">
                <p>
                  I/We hereby confirm that the information provided in this application is true and
                  accurate to the best of our knowledge. We authorise BookMyCenter or its authorised
                  representatives to verify the information, documents and infrastructure provided as
                  part of the centre empanelment process.
                </p>
                <p>
                  I/We understand that registration does not automatically guarantee empanelment or
                  allocation of examinations. Centre approval will be subject to verification, audit,
                  technical assessment, commercial agreement and applicable client/examination
                  requirements.
                </p>
                {[
                  ["termsAccepted", "I agree to the BookMyCenter Terms & Conditions."],
                  ["confidentialityAccepted", "I agree to maintain examination confidentiality and security."],
                  ["verificationConsent", "I consent to physical/virtual centre verification."],
                  [
                    "accurateInfrastructure",
                    "I agree to provide accurate infrastructure and capacity information.",
                  ],
                  ["informationAccurate", "I confirm all information provided is true and accurate."],
                ].map(([field, label]) => (
                  <label key={field} className="flex items-start gap-2">
                    <input
                      type="checkbox"
                      checked={Boolean(form.declaration[field])}
                      onChange={(e) => updateNested("declaration", field, e.target.checked)}
                      className="mt-1 h-4 w-4 rounded border-[#d1d5db] text-[#0a7ea4]"
                    />
                    <span>{label}</span>
                  </label>
                ))}
                <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
                  <FormField label="Authorised Person Name" id="authorisedPersonName" required>
                    <input
                      id="authorisedPersonName"
                      value={form.declaration.authorisedPersonName}
                      onChange={(e) =>
                        updateNested("declaration", "authorisedPersonName", e.target.value)
                      }
                      className={inputClass()}
                      required
                    />
                  </FormField>
                  <FormField label="Designation" id="designation" required>
                    <input
                      id="designation"
                      value={form.declaration.designation}
                      onChange={(e) => updateNested("declaration", "designation", e.target.value)}
                      className={inputClass()}
                      required
                    />
                  </FormField>
                  <FormField label="Date" id="declarationDate" required>
                    <input
                      id="declarationDate"
                      type="date"
                      value={form.declaration.declarationDate}
                      onChange={(e) => updateNested("declaration", "declarationDate", e.target.value)}
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
                className="inline-flex items-center justify-center rounded-lg border border-[#e5e7eb] bg-white px-6 py-3 text-sm font-semibold text-[#0b1a33] hover:bg-[#f9fafb]"
              >
                Cancel
              </Link>
              <button
                type="submit"
                disabled={saving}
                className="inline-flex items-center justify-center rounded-lg bg-[#0a7ea4] px-6 py-3 text-sm font-semibold text-white hover:bg-[#086688] disabled:opacity-60"
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
