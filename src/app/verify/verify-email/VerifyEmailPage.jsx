"use client";

import Link from "next/link";
import { useParams, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

function normalizeToken(rawToken) {
  if (!rawToken || typeof rawToken !== "string") {
    return null;
  }

  let token = rawToken.trim();

  while (token.includes("%")) {
    try {
      const decoded = decodeURIComponent(token);
      if (decoded === token) break;
      token = decoded;
    } catch {
      break;
    }
  }

  return token;
}

function SpinnerIcon({ className }) {
  return (
    <svg
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      aria-hidden
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  );
}

function SuccessIcon({ className }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden
    >
      <path
        fillRule="evenodd"
        d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z"
        clipRule="evenodd"
      />
    </svg>
  );
}

function ErrorIcon({ className }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden
    >
      <path
        fillRule="evenodd"
        d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zm-1.72 6.97a.75.75 0 10-1.06 1.06L10.94 12l-1.72 1.72a.75.75 0 101.06 1.06L12 13.06l1.72 1.72a.75.75 0 101.06-1.06L13.06 12l1.72-1.72a.75.75 0 10-1.06-1.06L12 10.94l-1.72-1.72z"
        clipRule="evenodd"
      />
    </svg>
  );
}

export default function VerifyEmailPage() {
  const params = useParams();
  const searchParams = useSearchParams();

  const token = useMemo(() => {
    const rawToken = searchParams.get("token") || params?.token;
    return normalizeToken(rawToken);
  }, [params?.token, searchParams]);

  const [status, setStatus] = useState("loading");
  const [message, setMessage] = useState("Verifying your email address...");

  useEffect(() => {
    if (!token) {
      setStatus("error");
      setMessage("Verification link is invalid or missing.");
      return;
    }

    let cancelled = false;

    async function verifyEmail() {
      try {
        const response = await fetch("/api/verify/verify-email", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token }),
        });
        const data = await response.json();

        if (cancelled) return;

        if (response.ok && data.success) {
          setStatus("success");
          setMessage(
            data.alreadyVerified
              ? "Your email is already verified. You can log in to your account."
              : "Your email has been verified successfully. You can now log in to BookMyCenter."
          );
          return;
        }

        setStatus("error");
        setMessage(data.result || "Unable to verify your email. Please try again.");
      } catch {
        if (!cancelled) {
          setStatus("error");
          setMessage("Something went wrong while verifying your email. Please try again.");
        }
      }
    }

    verifyEmail();

    return () => {
      cancelled = true;
    };
  }, [token]);

  return (
    <main className="fixed inset-0 z-[60] overflow-y-auto bg-gradient-to-br from-[#0a7ea4] via-[#0a5f7a] to-[#3cb878] px-4 py-10">
      <div className="mx-auto flex min-h-[calc(100vh-5rem)] w-full max-w-lg items-center">
        <div className="w-full rounded-lg bg-white p-8 shadow-xl sm:p-10">
          <div className="flex flex-col items-center text-center">
            {status === "loading" ? (
              <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-[#0a7ea4]/10 text-[#0a7ea4]">
                <SpinnerIcon className="h-10 w-10 animate-spin" />
              </div>
            ) : null}

            {status === "success" ? (
              <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-[#3cb878]/15 text-[#3cb878]">
                <SuccessIcon className="h-12 w-12" />
              </div>
            ) : null}

            {status === "error" ? (
              <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-[#b03a2e]/10 text-[#b03a2e]">
                <ErrorIcon className="h-12 w-12" />
              </div>
            ) : null}

            <h1 className="text-2xl font-bold text-[#0b1a33] sm:text-3xl">
              {status === "loading"
                ? "Email Verification"
                : status === "success"
                  ? "Email Verified"
                  : "Verification Failed"}
            </h1>

            <p className="mt-4 text-sm leading-relaxed text-[#6b7280] sm:text-base">
              {message}
            </p>

            {status !== "loading" ? (
              <div className="mt-8 flex w-full flex-col gap-3 sm:flex-row">
                {status === "success" ? (
                  <Link
                    href="/login"
                    className="w-full rounded bg-[#0a5f7a] py-3.5 text-sm font-semibold tracking-wide text-white transition-colors hover:bg-[#084d63]"
                  >
                    Go to Login
                  </Link>
                ) : (
                  <Link
                    href="/signup"
                    className="w-full rounded bg-[#0a5f7a] py-3.5 text-sm font-semibold tracking-wide text-white transition-colors hover:bg-[#084d63]"
                  >
                    Sign Up Again
                  </Link>
                )}
                <Link
                  href="/"
                  className="w-full rounded border border-[#d1d5db] py-3.5 text-sm font-semibold tracking-wide text-[#374151] transition-colors hover:bg-[#f9fafb]"
                >
                  Back to Home
                </Link>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </main>
  );
}
