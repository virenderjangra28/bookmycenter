"use client";

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
    <main className="px-5 py-8 sm:px-8 lg:px-10 lg:py-10">
      <div className="max-w-5xl">
        <div className="mb-8">
          <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-[#2563eb]">
            Client Portal
          </p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-[#0b1a33]">My Profile</h1>
          <p className="mt-2 text-sm text-[#64748b]">
            View your account details registered with BookMyCenter.
          </p>
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
