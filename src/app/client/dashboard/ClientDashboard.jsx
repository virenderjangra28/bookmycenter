"use client";

import Link from "next/link";
import { useContext, useEffect, useState } from "react";
import UserContext from "@/context/userContext";

const QUICK_LINKS = [
  {
    label: "My Profile",
    description: "View and update your account details",
    href: "/client/profile",
    color: "border-[#dbeafe] bg-[#eff6ff] text-[#0a7ea4] hover:border-[#0a7ea4]",
  },
  {
    label: "Update Center",
    description: "Manage test center information",
    href: "/client/update-center",
    color: "border-[#d1fae5] bg-[#ecfdf5] text-[#059669] hover:border-[#059669]",
  },
  {
    label: "Payment History",
    description: "Review invoices and transactions",
    href: "/client/payment-history",
    color: "border-[#fef3c7] bg-[#fffbeb] text-[#d97706] hover:border-[#f59e0b]",
  },
];

function getInitials(name = "") {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "U";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0] ?? ""}${parts[parts.length - 1][0] ?? ""}`.toUpperCase();
}

function formatDate(value) {
  if (!value) return "—";
  return new Date(value).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function getAccountStatus(isActive) {
  if (isActive === 1 || isActive === "1") {
    return { label: "Active", className: "bg-[#ecfdf5] text-[#059669]" };
  }
  if (isActive === 0 || isActive === "0") {
    return { label: "Under Review", className: "bg-[#fffbeb] text-[#d97706]" };
  }
  return { label: "Inactive", className: "bg-[#fef2f2] text-[#b03a2e]" };
}

function getCenterStatus(isActive) {
  if (isActive === 1 || isActive === "1") {
    return { label: "Approved", className: "bg-[#ecfdf5] text-[#059669]" };
  }
  return { label: "Pending Approval", className: "bg-[#fffbeb] text-[#d97706]" };
}

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

function SummaryCard({ label, value, hint, accent }) {
  return (
    <div className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-[#e5e7eb]">
      <div className={`bg-gradient-to-r ${accent} px-5 py-4`}>
        <p className="text-sm font-medium text-white/90">{label}</p>
        <p className="mt-1 text-2xl font-bold text-white">{value}</p>
      </div>
      {hint ? (
        <div className="px-5 py-3">
          <p className="text-xs text-[#6b7280]">{hint}</p>
        </div>
      ) : null}
    </div>
  );
}

export default function ClientDashboard() {
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
  const accountStatus = getAccountStatus(displayUser?.isActive);
  const centerStatus = getCenterStatus(displayUser?.isActive);
  const verificationStatus = displayUser?.isVerified
    ? { label: "Verified", className: "bg-[#ecfdf5] text-[#059669]" }
    : { label: "Not Verified", className: "bg-[#fef2f2] text-[#b03a2e]" };

  return (
    <main className="min-h-screen bg-[#f4f7fb] px-4 py-8 sm:px-6 lg:px-10">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-[#0a7ea4]">
              Client Portal
            </p>
            <h1 className="mt-1 text-3xl font-bold text-[#0b1a33]">
              Welcome{displayUser?.name ? `, ${displayUser.name.split(" ")[0]}` : ""}
            </h1>
            <p className="mt-2 max-w-2xl text-sm text-[#6b7280]">
              Manage your profile, review your test center details, and keep your
              BookMyCenter account information up to date.
            </p>
          </div>

          <div className="flex items-center gap-4 rounded-2xl bg-white px-5 py-4 shadow-sm ring-1 ring-[#e5e7eb]">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#0a7ea4] text-lg font-bold text-white">
              {getInitials(displayUser?.name)}
            </div>
            <div>
              <p className="text-sm font-semibold text-[#0b1a33]">
                {displayUser?.name || "Client User"}
              </p>
              <p className="text-xs text-[#6b7280]">{displayUser?.email || "—"}</p>
              <span
                className={`mt-2 inline-flex rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${accountStatus.className}`}
              >
                {accountStatus.label}
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
          <SummaryCard
            label="Account Status"
            value={loading ? "—" : accountStatus.label}
            hint="Your platform access status"
            accent="from-[#0a7ea4] to-[#0a5f7a]"
          />
          <SummaryCard
            label="Email Status"
            value={loading ? "—" : verificationStatus.label}
            hint="Email verification progress"
            accent="from-[#3cb878] to-[#2a9d5c]"
          />
          <SummaryCard
            label="Center Status"
            value={loading ? "—" : centerStatus.label}
            hint="Test center approval status"
            accent="from-[#6366f1] to-[#4f46e5]"
          />
          <SummaryCard
            label="Member Since"
            value={loading ? "—" : formatDate(displayUser?.created_at)}
            hint="Registration date on BookMyCenter"
            accent="from-[#f59e0b] to-[#d97706]"
          />
        </div>

        <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
          <section className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-[#e5e7eb]">
            <div className="mb-5 flex items-start justify-between gap-3">
              <div>
                <h2 className="text-xl font-bold text-[#0b1a33]">Personal Information</h2>
                <p className="mt-1 text-sm text-[#6b7280]">
                  Your registered contact and account details.
                </p>
              </div>
              <Link
                href="/client/profile"
                className="text-sm font-semibold text-[#0a7ea4] hover:underline"
              >
                Edit
              </Link>
            </div>

            <InfoRow label="Full Name" value={displayUser?.name} />
            <InfoRow label="Email Address" value={displayUser?.email} />
            <InfoRow label="Mobile Number" value={displayUser?.mobile} />
            <InfoRow label="Company / Organization" value={displayUser?.company} />
            <InfoRow
              label="Email Verification"
              value={displayUser?.isVerified ? "Verified" : "Pending verification"}
            />
          </section>

          <section className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-[#e5e7eb]">
            <div className="mb-5 flex items-start justify-between gap-3">
              <div>
                <h2 className="text-xl font-bold text-[#0b1a33]">Center Details</h2>
                <p className="mt-1 text-sm text-[#6b7280]">
                  Overview of your registered test center information.
                </p>
              </div>
              <Link
                href="/client/update-center"
                className="text-sm font-semibold text-[#0a7ea4] hover:underline"
              >
                Update
              </Link>
            </div>

            <InfoRow
              label="Center Name"
              value={displayUser?.center?.name || displayUser?.company || "Not added yet"}
            />
            <InfoRow label="Center Code" value="Pending assignment" />
            <InfoRow label="Center Status" value={centerStatus.label} />
            <InfoRow
              label="City"
              value={displayUser?.center?.city || "Not updated yet"}
            />
            <InfoRow
              label="State"
              value={displayUser?.center?.state || "Not updated yet"}
            />
            <InfoRow
              label="Seating Capacity"
              value={
                displayUser?.center?.seatingCapacity
                  ? `${displayUser.center.seatingCapacity} seats`
                  : "Not updated yet"
              }
            />
            <InfoRow
              label="Contact Email"
              value={displayUser?.center?.contactEmail || displayUser?.email}
            />
            <InfoRow
              label="Contact Phone"
              value={displayUser?.center?.contactPhone || displayUser?.mobile}
            />

            <div className="mt-4 rounded-xl border border-dashed border-[#dbeafe] bg-[#eff6ff] px-4 py-3">
              <p className="text-sm font-medium text-[#0b1a33]">
                Complete your center profile
              </p>
              <p className="mt-1 text-xs leading-relaxed text-[#6b7280]">
                Add location, capacity, and facility details so candidates can discover
                and book your test center on BookMyCenter.
              </p>
              <Link
                href="/client/update-center"
                className="mt-3 inline-flex text-sm font-semibold text-[#0a7ea4] hover:underline"
              >
                Go to Update Center
              </Link>
            </div>
          </section>
        </div>

        <section className="mt-8 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-[#e5e7eb]">
          <div className="mb-5">
            <h2 className="text-xl font-bold text-[#0b1a33]">Quick Actions</h2>
            <p className="mt-1 text-sm text-[#6b7280]">
              Shortcuts to manage your profile, center, and payments.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {QUICK_LINKS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`rounded-xl border px-5 py-4 transition hover:shadow-sm ${item.color}`}
              >
                <p className="text-sm font-bold">{item.label}</p>
                <p className="mt-1 text-xs text-[#6b7280]">{item.description}</p>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
