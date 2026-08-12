"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

const TRUSTED_BY = ["SAP", "Optimizely", "Grant Thornton"];

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();
  };

  return (
    <main className="fixed inset-0 z-[60] flex min-h-screen flex-col lg:flex-row">
      {/* Left branding panel */}
      <section className="relative hidden min-h-[280px] flex-1 overflow-hidden lg:block lg:min-h-screen lg:max-w-[38%]">
        <Image
          src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=1200&q=80"
          alt=""
          fill
          className="object-cover"
          priority
          sizes="38vw"
        />
        <div className="absolute inset-0 bg-[#0a5f7a]/85" />

        <div className="relative flex h-full flex-col justify-between px-8 py-10 xl:px-12 xl:py-12">
          <div className="text-white">
            <p className="text-lg font-semibold tracking-wide">BookMyCenter</p>
          </div>

          <div className="max-w-md text-white">
            <h1 className="text-3xl font-bold leading-tight xl:text-4xl">
              Better Exam Center Booking
            </h1>
            <p className="mt-4 text-base leading-relaxed text-white/90 xl:text-lg">
              From discovery to booking: find verified test centers and manage
              your exams with confidence.
            </p>
          </div>

          <div>
            <p className="mb-4 text-sm font-medium text-white/80">Trusted By:</p>
            <div className="flex flex-wrap items-center gap-6">
              {TRUSTED_BY.map((brand) => (
                <span
                  key={brand}
                  className="text-sm font-semibold tracking-wide text-white/90"
                >
                  {brand}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Right login panel */}
      <section className="flex flex-1 flex-col bg-white">
        <div className="flex items-center justify-end gap-3 px-6 py-5 sm:px-10">
          <span className="text-sm text-[#6b7280]">
            Don&apos;t have an account yet?
          </span>
          <Link
            href="/signup"
            className="rounded border border-[#0a7ea4] px-4 py-2 text-[10px] font-semibold text-[#0a7ea4] transition-colors hover:bg-[#0a7ea4]/5 sm:text-sm"
          >
            Get Started
          </Link>
        </div>

        <div className="flex flex-1 flex-col items-center justify-center px-6 pb-10 sm:px-10">
          <div className="w-full max-w-md">
            <h2 className="text-2xl font-bold text-[#1f2937] sm:text-3xl">
              Login to your BookMyCenter account
            </h2>

            <form onSubmit={handleSubmit} className="mt-8 space-y-6">
              <div>
                <label
                  htmlFor="email"
                  className="mb-2 block text-sm text-[#9ca3af]"
                >
                  Email Address
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="Email Address"
                  autoComplete="email"
                  className="w-full rounded border border-[#d1d5db] px-4 py-3 text-[#1f2937] placeholder:text-[#9ca3af] outline-none transition-colors focus:border-[#0a7ea4] focus:ring-2 focus:ring-[#0a7ea4]/15"
                />
              </div>

              <div>
                <div className="mb-2 flex items-center justify-between">
                  <label htmlFor="password" className="text-sm text-[#9ca3af]">
                    Password
                  </label>
                  <Link
                    href="#forgot-password"
                    className="text-sm font-medium text-[#0a7ea4] hover:underline"
                  >
                    Forgot Password?
                  </Link>
                </div>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="Password"
                  autoComplete="current-password"
                  className="w-full rounded border border-[#d1d5db] px-4 py-3 text-[#1f2937] placeholder:text-[#9ca3af] outline-none transition-colors focus:border-[#0a7ea4] focus:ring-2 focus:ring-[#0a7ea4]/15"
                />
              </div>

              <button
                type="submit"
                className="w-full rounded bg-[#0a5f7a] py-3.5 text-base font-semibold text-white transition-colors hover:bg-[#084d63]"
              >
                Login to BookMyCenter
              </button>
            </form>

            
          </div>
        </div>

        <footer className="px-6 pb-6 text-center text-xs text-[#9ca3af] sm:px-10">
          © {new Date().getFullYear()} BookMyCenter.com |{" "}
          <Link href="#terms" className="hover:text-[#6b7280]">
            Terms of services
          </Link>{" "}
          |{" "}
          <Link href="#license" className="hover:text-[#6b7280]">
            License Agreement
          </Link>{" "}
          |{" "}
          <Link href="#privacy" className="hover:text-[#6b7280]">
            Privacy Notice
          </Link>{" "}
          |{" "}
          <Link href="#cookies" className="hover:text-[#6b7280]">
            Cookies
          </Link>
        </footer>
      </section>
    </main>
  );
}
