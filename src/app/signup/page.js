"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { toast } from "react-toastify";

function MailIcon({ className }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={className} aria-hidden>
      <path d="M1.5 8.67v8.58a3 3 0 003 3h15a3 3 0 003-3V8.67l-8.928 5.493a3 3 0 01-3.144 0L1.5 8.67z" />
      <path d="M18.5 5.488l-7.97 4.913a1.5 1.5 0 01-1.56 0L1.5 5.488A3 3 0 011.5 3h17a3 3 0 01-.5 2.488z" />
    </svg>
  );
}

function UserIcon({ className }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={className} aria-hidden>
      <path d="M10 8a3 3 0 100-6 3 3 0 000 6zM3.465 14.493a1.23 1.23 0 00.39 1.462A9.902 9.902 0 0010 18c2.31 0 4.438-.784 6.131-2.098a1.23 1.23 0 00.39-1.462 7.224 7.224 0 00-13.056 0z" />
    </svg>
  );
}

function PhoneIcon({ className }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={className} aria-hidden>
      <path fillRule="evenodd" d="M2 3.5A1.5 1.5 0 013.5 2h1.148a1.5 1.5 0 011.465 1.175l.716 3.223a1.5 1.5 0 01-1.052 1.767l-.933.267a13.75 13.75 0 006.586 6.586l.267-.933a1.5 1.5 0 011.767-1.052l3.223.716A1.5 1.5 0 0118 15.352V16.5a1.5 1.5 0 01-1.5 1.5H15c-7.18 0-13-5.82-13-13V4.5A1.5 1.5 0 012 3.5z" clipRule="evenodd" />
    </svg>
  );
}

function BuildingIcon({ className }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={className} aria-hidden>
      <path fillRule="evenodd" d="M4 16.5v-13h-.25a.75.75 0 010-1.5h12.5a.75.75 0 010 1.5H16v13h.25a.75.75 0 010 1.5h-3.5a.75.75 0 01-.75-.75v-2.5a.75.75 0 00-.75-.75h-2.5a.75.75 0 00-.75.75v2.5a.75.75 0 01-.75.75h-3.5a.75.75 0 010-1.5H4zm3-11a.5.5 0 01.5-.5h1a.5.5 0 01.5.5v1a.5.5 0 01-.5.5h-1a.5.5 0 01-.5-.5v-1zm4.5-.5a.5.5 0 00-.5.5v1a.5.5 0 00.5.5h1a.5.5 0 00.5-.5v-1a.5.5 0 00-.5-.5h-1zM8 9a.5.5 0 01.5-.5h1a.5.5 0 01.5.5v1a.5.5 0 01-.5.5h-1a.5.5 0 01-.5-.5V9zm4.5-.5a.5.5 0 00-.5.5v1a.5.5 0 00.5.5h1a.5.5 0 00.5-.5V9a.5.5 0 00-.5-.5h-1zM8 12a.5.5 0 01.5-.5h1a.5.5 0 01.5.5v1a.5.5 0 01-.5.5h-1a.5.5 0 01-.5-.5v-1z" clipRule="evenodd" />
    </svg>
  );
}

function FormField({
  id,
  icon: Icon,
  type = "text",
  value,
  onChange,
  placeholder,
  autoComplete,
  error,
  hasError,
}) {
  return (
    <div>
      <div className="relative">
        <Icon className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#9ca3af]" />
        <input
          id={id}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          autoComplete={autoComplete}
          className={`w-full rounded border bg-white py-3.5 pl-12 pr-4 text-sm tracking-wide text-[#1f2937] placeholder:text-[#9ca3af] outline-none transition-colors ${
            hasError
              ? "border-[#b03a2e] focus:border-[#b03a2e] focus:ring-2 focus:ring-[#b03a2e]/15"
              : "border-[#d1d5db] focus:border-[#0a7ea4] focus:ring-2 focus:ring-[#0a7ea4]/15"
          }`}
        />
      </div>
      {error ? <p className="mt-1.5 text-sm text-[#b03a2e]">{error}</p> : null}
    </div>
  );
}

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [company, setCompany] = useState("");
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const router = useRouter();

  const errors = useMemo(() => {
    const nextErrors = {};

    if (!email.trim()) {
      nextErrors.email = "This is the mandatory field";
    }

    if (!name.trim()) {
      nextErrors.name = "Please provide your name";
    }

    if (!mobile.trim()) {
      nextErrors.mobile = "This is the mandatory field";
    }

    if (!company.trim()) {
      nextErrors.company = "This is the mandatory field";
    }

    return nextErrors;
  }, [email, name, mobile, company]);

  const canSubmit =
    acceptedTerms &&
    email.trim() &&
    name.trim() &&
    mobile.trim() &&
    company.trim();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitted(true);
      if (!canSubmit) return;
      const response = await fetch("/api/admin/users/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          mobile,
          company,
        }),
      });
      const data = await response.json();
      if (response.ok && data.success) {
        toast.success(data.result);
        setTimeout(() => {
          router.push("/");
        }, 4000);
      } else {
        toast.error(data.result);
      }
      console.log(data);
  };

  return (
    <main className="fixed inset-0 z-[60] overflow-y-auto bg-gradient-to-br from-[#0a7ea4] via-[#0a5f7a] to-[#3cb878] px-4 py-10">
      <div className="mx-auto w-full max-w-2xl rounded-lg bg-white p-6 shadow-xl sm:p-8 lg:p-10">
        <h1 className="text-2xl font-bold text-[#0b1a33] sm:text-3xl">
          Sign up and get started today
        </h1>
        <p className="mt-3 text-sm text-[#6b7280] sm:text-base">
          Already got an account?{" "}
          <Link href="/login" className="font-medium text-[#2563eb] hover:underline">
            Log In
          </Link>{" "}
          to the BookMyCenter platform now
        </p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-5" noValidate>
          <FormField
            id="email"
            icon={MailIcon}
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="YOUR OFFICIAL EMAIL *"
            autoComplete="email"
            error={submitted ? errors.email : ""}
            hasError={submitted && !!errors.email}
          />

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <FormField
              id="name"
              icon={UserIcon}
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="YOUR NAME *"
              autoComplete="name"
              error={submitted ? errors.name : ""}
              hasError={submitted && !!errors.name}
            />
            <FormField
              id="mobile"
              icon={PhoneIcon}
              type="tel"
              value={mobile}
              onChange={(event) => setMobile(event.target.value)}
              placeholder="YOUR MOBILE NO. *"
              autoComplete="tel"
              error={submitted ? errors.mobile : ""}
              hasError={submitted && !!errors.mobile}
            />
          </div>

          <FormField
            id="company"
            icon={BuildingIcon}
            value={company}
            onChange={(event) => setCompany(event.target.value)}
            placeholder="YOUR COMPANY *"
            autoComplete="organization"
            error={submitted ? errors.company : ""}
            hasError={submitted && !!errors.company}
          />

          <label className="flex items-start gap-3 pt-2">
            <input
              type="checkbox"
              checked={acceptedTerms}
              onChange={(event) => setAcceptedTerms(event.target.checked)}
              className="mt-1 h-4 w-4 rounded border-[#d1d5db] text-[#0a7ea4] focus:ring-[#0a7ea4]"
            />
            <span className="text-sm leading-relaxed text-[#6b7280]">
              By clicking on &ldquo;I Accept&rdquo;, you hereby accept and
              acknowledge the{" "}
              <Link href="#terms" className="text-[#2563eb] hover:underline">
                Terms of Services
              </Link>
              ,{" "}
              <Link href="#license" className="text-[#2563eb] hover:underline">
                License Agreement
              </Link>{" "}
              and{" "}
              <Link href="#privacy" className="text-[#2563eb] hover:underline">
                Privacy Notice
              </Link>{" "}
              and agree to be bound by the same. You declare that you are
              competent/authorized to accept the aforesaid as per applicable law
              and policies of your organization and territory.
            </span>
          </label>

          <button
            type="submit"
            disabled={!canSubmit}
            className={`w-full rounded py-3.5 text-sm font-semibold tracking-wide transition-colors ${
              canSubmit
                ? "bg-[#0a5f7a] text-white hover:bg-[#084d63]"
                : "cursor-not-allowed bg-[#e5e7eb] text-[#9ca3af]"
            }`}
          >
            I ACCEPT AND PROCEED
          </button>
        </form>
      </div>
    </main>
  );
}
