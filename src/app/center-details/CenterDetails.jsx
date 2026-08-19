"use client";

import { useState } from "react";
import Image from "next/image";
import { toast } from "react-toastify";
import { SAMPLE_CENTER } from "@/lib/centerDetailsData";

const SHIFTS = ["Morning", "Afternoon", "Evening"];

function todayIsoDate() {
  const now = new Date();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${now.getFullYear()}-${month}-${day}`;
}

function formatPrice(price) {
  return `₹${Number(price || 0).toLocaleString("en-IN")}`;
}

function CheckIcon({ className }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={className} aria-hidden>
      <path
        fillRule="evenodd"
        d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
        clipRule="evenodd"
      />
    </svg>
  );
}

function Gallery({ src, alt }) {
  const isRemote = typeof src === "string" && /^https?:\/\//.test(src);
  const isInline = typeof src === "string" && (src.startsWith("data:") || src.startsWith("blob:"));

  if (isRemote) {
    return (
      <div className="relative h-[280px] w-full overflow-hidden rounded-2xl sm:h-[340px] lg:h-[380px]">
        <Image src={src} alt={alt} fill className="object-cover" sizes="(max-width: 1024px) 100vw, 66vw" priority />
      </div>
    );
  }

  if (isInline) {
    return (
      <img
        src={src}
        alt={alt}
        className="h-[280px] w-full rounded-2xl object-cover sm:h-[340px] lg:h-[380px]"
      />
    );
  }

  return (
    <div
      className="h-[280px] w-full rounded-2xl sm:h-[340px] lg:h-[380px]"
      style={{
        backgroundImage: "repeating-linear-gradient(90deg, #d7e8fb 0 36px, #f7fbff 36px 72px)",
      }}
      role="img"
      aria-label={alt}
    />
  );
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

export default function CenterDetails({ center = SAMPLE_CENTER }) {
  const [date, setDate] = useState("");
  const [shift, setShift] = useState("Morning");
  const [seats, setSeats] = useState(String(center.seats || 250));

  function handleBook(event) {
    event.preventDefault();
    const seatCount = Number(seats);

    if (!date) {
      toast.error("Please select a date");
      return;
    }
    if (!Number.isFinite(seatCount) || seatCount < 1) {
      toast.error("Enter the number of seats");
      return;
    }
    if (seatCount > center.seats) {
      toast.error(`Only ${center.seats} seats are available at this center`);
      return;
    }

    toast.success(`Availability confirmed for ${seatCount} seats on ${date} (${shift}).`);
  }

  return (
    <main className="flex-1 bg-white">
      <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
        <div className="max-w-3xl">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-[#e7f8ee] px-3 py-1 text-xs font-semibold text-[#1b8a4a]">
            <CheckIcon className="h-3.5 w-3.5" />
            BMC Premium - {center.premiumScore}/100
          </span>

          <h1 className="mt-3 text-3xl font-bold tracking-tight text-[#0b1a33] sm:text-4xl">
            {center.name}
          </h1>

          <p className="mt-2 text-[15px] text-[#64748b]">
            {center.location}
            <span className="mx-1.5">•</span>
            <span className="text-amber-400">★</span> {center.rating}
            <span className="mx-1.5">•</span>
            {center.seats} seats
            <span className="mx-1.5">•</span>
            {center.labs} labs
          </p>
        </div>

        <div className="mt-8 grid items-start gap-8 lg:grid-cols-[minmax(0,1.7fr)_minmax(280px,0.9fr)] lg:gap-10">
          <div>
            <Gallery src={center.image} alt={center.name} />

            <section className="mt-8">
              <h2 className="text-xl font-bold text-[#0b1a33]">Infrastructure</h2>
              <div className="mt-4 grid gap-4 sm:grid-cols-3">
                {[
                  { title: "Technology", body: center.infrastructure.technology },
                  { title: "Connectivity", body: center.infrastructure.connectivity },
                  { title: "Power", body: center.infrastructure.power },
                ].map((item) => (
                  <article
                    key={item.title}
                    className="rounded-xl border border-[#e8edf3] bg-white p-5 shadow-[0_1px_2px_rgba(15,23,42,0.04)]"
                  >
                    <h3 className="text-[15px] font-bold text-[#0b1a33]">{item.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-[#64748b]">{item.body}</p>
                  </article>
                ))}
              </div>
            </section>
          </div>

          <aside className="lg:sticky lg:top-24">
            <form
              onSubmit={handleBook}
              className="rounded-2xl border border-[#eef2f6] bg-white p-6 shadow-[0_12px_40px_rgba(15,23,42,0.08)]"
            >
              <h2 className="text-xl font-bold text-[#0b1a33]">Check Availability</h2>

              <div className="mt-5 space-y-4">
                <Field id="booking-date" label="Date">
                  <input
                    id="booking-date"
                    type="date"
                    min={todayIsoDate()}
                    value={date}
                    onChange={(event) => setDate(event.target.value)}
                    className={inputClass()}
                  />
                </Field>

                <Field id="booking-shift" label="Shift">
                  <div className="relative">
                    <select
                      id="booking-shift"
                      value={shift}
                      onChange={(event) => setShift(event.target.value)}
                      className={`${inputClass()} appearance-none pr-10`}
                    >
                      {SHIFTS.map((option) => (
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
                </Field>

                <Field id="booking-seats" label="Seats">
                  <input
                    id="booking-seats"
                    type="number"
                    min={1}
                    max={center.seats}
                    value={seats}
                    onChange={(event) => setSeats(event.target.value)}
                    className={inputClass()}
                  />
                </Field>
              </div>

              <p className="mt-6 text-2xl font-bold text-[#0056D2]">
                {formatPrice(center.price)}{" "}
                <span className="text-lg font-bold text-[#0b1a33]">/seat/shift</span>
              </p>

              <button
                type="submit"
                className="mt-5 flex h-12 w-full items-center justify-center rounded-lg bg-[#0056D2] text-sm font-semibold text-white transition hover:bg-[#0046b0]"
              >
                Check &amp; Book →
              </button>
            </form>
          </aside>
        </div>
      </div>
    </main>
  );
}
