"use client";

import Link from "next/link";

export default function PaymentHistory() {
  return (
    <main className="min-h-screen bg-[#f4f7fb] px-4 py-8 sm:px-6 lg:px-10">
      <div className="mx-auto max-w-5xl">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-[#0a7ea4]">
              Client Portal
            </p>
            <h1 className="mt-1 text-3xl font-bold text-[#0b1a33]">Payment History</h1>
            <p className="mt-2 text-sm text-[#6b7280]">
              Review your invoices and past transactions on BookMyCenter.
            </p>
          </div>
          <Link
            href="/client/dashboard"
            className="inline-flex items-center justify-center rounded-lg border border-[#0a7ea4] px-4 py-2 text-sm font-semibold text-[#0a7ea4] transition hover:bg-[#0a7ea4]/5"
          >
            Back to Dashboard
          </Link>
        </div>

        <section className="rounded-2xl bg-white p-10 text-center shadow-sm ring-1 ring-[#e5e7eb]">
          <p className="text-sm font-semibold text-[#0b1a33]">No payment records yet</p>
          <p className="mt-2 text-sm text-[#6b7280]">
            Your payment history will appear here once transactions are available.
          </p>
        </section>
      </div>
    </main>
  );
}
