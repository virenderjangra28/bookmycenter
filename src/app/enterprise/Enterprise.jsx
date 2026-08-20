"use client";

import { useState } from "react";
import { toast } from "react-toastify";

const EXAM_TYPES = ["CBT", "PBT", "Training", "Certification"];
const SHIFT_OPTIONS = ["1", "2", "3", "4"];

const FEATURES = [
  "Bulk city upload via Excel/CSV",
  "Shift-wise candidate mapping",
  "Availability and capacity matching",
  "Verification and audit status",
  "Consolidated quotation",
  "PO, contract and invoice workflow",
];

function todayIsoDate() {
  const now = new Date();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${now.getFullYear()}-${month}-${day}`;
}

function Field({ id, label, children }) {
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-sm font-medium text-[#334155]">
        {label}
      </label>
      {children}
    </div>
  );
}

function inputClass() {
  return "h-11 w-full rounded-lg border border-[#dbe3ee] bg-white px-3 text-sm text-[#0b1a33] outline-none transition focus:border-[#0056D2] focus:ring-2 focus:ring-[#0056D2]/15";
}

function SelectField({ id, value, onChange, options }) {
  return (
    <div className="relative">
      <select
        id={id}
        value={value}
        onChange={onChange}
        className={`${inputClass()} appearance-none pr-10`}
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 20 20"
        fill="currentColor"
        className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
        aria-hidden
      >
        <path
          fillRule="evenodd"
          d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.94a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
          clipRule="evenodd"
        />
      </svg>
    </div>
  );
}

export default function Enterprise() {
  const [examType, setExamType] = useState("CBT");
  const [cities, setCities] = useState("25");
  const [candidates, setCandidates] = useState("15000");
  const [examDate, setExamDate] = useState("");
  const [shifts, setShifts] = useState("1");
  const [fileName, setFileName] = useState("");

  function handleSubmit(event) {
    event.preventDefault();

    const cityCount = Number(cities);
    const candidateCount = Number(candidates);

    if (!Number.isFinite(cityCount) || cityCount < 1) {
      toast.error("Enter the number of cities");
      return;
    }
    if (!Number.isFinite(candidateCount) || candidateCount < 1) {
      toast.error("Enter the total number of candidates");
      return;
    }
    if (!examDate) {
      toast.error("Please select an exam date");
      return;
    }

    toast.success("Requirement received. We will match centers across your cities.");
  }

  return (
    <main className="flex-1 bg-white">
      <section className="bg-[#eef6ff]">
        <div className="mx-auto max-w-7xl px-4 py-14 text-left sm:px-6 sm:py-16 lg:px-10 lg:py-20">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#0056D2]">
            Multi-City Operations
          </p>
          <h1 className="mt-3 max-w-3xl text-3xl font-bold tracking-tight text-[#0b1a33] sm:text-4xl lg:text-[2.6rem] lg:leading-tight">
            One requirement. Multiple cities. One command center.
          </h1>
          <p className="mt-4 text-[15px] text-[#64748b] sm:text-base">
            For exam bodies, corporates, universities and certification organizations.
          </p>
        </div>
      </section>

      <section className="bg-white">
        <div className="mx-auto grid max-w-7xl items-start gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)] lg:gap-16 lg:px-10 lg:py-16">
          <div className="max-w-xl">
            <h2 className="text-2xl font-bold tracking-tight text-[#0b1a33] sm:text-[1.85rem]">
              Upload your requirement once.
            </h2>
            <p className="mt-4 text-[15px] leading-relaxed text-[#64748b]">
              The platform matches city-level capacity, dates, shifts and infrastructure and
              creates one consolidated availability and quotation dashboard.
            </p>
            <ul className="mt-6 space-y-2.5 text-[15px] text-[#64748b]">
              {FEATURES.map((item) => (
                <li key={item} className="flex gap-2.5">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#94a3b8]" aria-hidden />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <form
            onSubmit={handleSubmit}
            className="rounded-2xl border border-[#eef2f6] bg-white p-6 shadow-[0_12px_40px_rgba(15,23,42,0.08)] sm:p-8"
          >
            <h2 className="text-xl font-bold text-[#0b1a33]">Enterprise Requirement</h2>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <Field id="exam-type" label="Exam Type">
                <SelectField
                  id="exam-type"
                  value={examType}
                  onChange={(event) => setExamType(event.target.value)}
                  options={EXAM_TYPES}
                />
              </Field>

              <Field id="number-of-cities" label="Number of Cities">
                <input
                  id="number-of-cities"
                  type="number"
                  min={1}
                  value={cities}
                  onChange={(event) => setCities(event.target.value)}
                  className={inputClass()}
                />
              </Field>

              <Field id="total-candidates" label="Total Candidates">
                <input
                  id="total-candidates"
                  type="number"
                  min={1}
                  value={candidates}
                  onChange={(event) => setCandidates(event.target.value)}
                  className={inputClass()}
                />
              </Field>

              <Field id="exam-date" label="Exam Date">
                <input
                  id="exam-date"
                  type="date"
                  min={todayIsoDate()}
                  value={examDate}
                  onChange={(event) => setExamDate(event.target.value)}
                  className={inputClass()}
                />
              </Field>

              <Field id="shifts" label="Shifts">
                <SelectField
                  id="shifts"
                  value={shifts}
                  onChange={(event) => setShifts(event.target.value)}
                  options={SHIFT_OPTIONS}
                />
              </Field>

              <Field id="upload-file" label="Upload File">
                <label
                  htmlFor="upload-file"
                  className={`${inputClass()} flex cursor-pointer items-center gap-3 overflow-hidden`}
                >
                  <span className="shrink-0 rounded border border-[#c5d0de] bg-[#f8fafc] px-2.5 py-1 text-xs font-medium text-[#334155]">
                    Choose File
                  </span>
                  <span className="truncate text-[#64748b]">{fileName || "No file chosen"}</span>
                </label>
                <input
                  id="upload-file"
                  type="file"
                  accept=".csv,.xls,.xlsx"
                  className="sr-only"
                  onChange={(event) => setFileName(event.target.files?.[0]?.name || "")}
                />
              </Field>
            </div>

            <button
              type="submit"
              className="mt-6 inline-flex h-12 items-center justify-center rounded-lg bg-[#0056D2] px-6 text-sm font-semibold text-white transition hover:bg-[#0046b0]"
            >
              Get Matched Centers →
            </button>
          </form>
        </div>
      </section>
    </main>
  );
}
