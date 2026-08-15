"use client";

import Link from "next/link";
import { useContext, useEffect, useState } from "react";
import UserContext from "@/context/userContext";

function InfoRow({ label, value }) {
  return (
    <div className="flex flex-col gap-1 border-b border-[#f3f4f6] py-3 last:border-b-0 sm:flex-row sm:items-center sm:justify-between">
      <span className="text-xs font-semibold uppercase tracking-wide text-[#6b7280]">
        {label}
      </span>
      <span className="text-sm font-medium text-[#0b1a33]">{value || "—"}</span>
    </div>
  );
}

export default function ClientProfile() {
  const { user } = useContext(UserContext);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function loadProfile() {
      try {
        const response = await fetch("/api/admin/users/me", {
          credentials: "include",
        });
        const data = await response.json();

        if (!cancelled && response.ok && data.success) {
          setProfile(data.data || data.result);
        }
      } catch {
        if (!cancelled) {
          setProfile(user ?? null);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadProfile();

    return () => {
      cancelled = true;
    };
  }, [user]);

  const displayUser = profile || user;

  return (
    <main className="min-h-screen bg-[#f4f7fb] px-4 py-8 sm:px-6 lg:px-10">
      <div className="mx-auto max-w-5xl">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-[#0a7ea4]">
              Client Portal
            </p>
            <h1 className="mt-1 text-3xl font-bold text-[#0b1a33]">My Profile</h1>
            <p className="mt-2 text-sm text-[#6b7280]">
              View your account details registered with BookMyCenter.
            </p>
          </div>
          <Link
            href="/client/dashboard"
            className="inline-flex items-center justify-center rounded-lg border border-[#0a7ea4] px-4 py-2 text-sm font-semibold text-[#0a7ea4] transition hover:bg-[#0a7ea4]/5"
          >
            Back to Dashboard
          </Link>
        </div>

        <section className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-[#e5e7eb]">
          {loading ? (
            <p className="text-sm text-[#6b7280]">Loading profile...</p>
          ) : (
            <>
              <InfoRow label="Full Name" value={displayUser?.name} />
              <InfoRow label="Email Address" value={displayUser?.email} />
              <InfoRow label="Mobile Number" value={displayUser?.mobile} />
              <InfoRow label="Company / Organization" value={displayUser?.company} />
              <InfoRow
                label="Email Verification"
                value={displayUser?.isVerified ? "Verified" : "Pending verification"}
              />
            </>
          )}
        </section>
      </div>
    </main>
  );
}
