"use client";

export default function PaymentHistory() {
  return (
    <main className="px-5 py-8 sm:px-8 lg:px-10 lg:py-10">
      <div className="max-w-5xl">
        <div className="mb-8">
          <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-[#2563eb]">
            Client Portal
          </p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-[#0b1a33]">Payment History</h1>
          <p className="mt-2 text-sm text-[#64748b]">
            Review your invoices and past transactions on BookMyCenter.
          </p>
        </div>

        <section className="rounded-2xl bg-white p-10 text-center shadow-[0_8px_24px_rgba(15,23,42,0.06)]">
          <p className="text-sm font-semibold text-[#0b1a33]">No payment records yet</p>
          <p className="mt-2 text-sm text-[#6b7280]">
            Your payment history will appear here once transactions are available.
          </p>
        </section>
      </div>
    </main>
  );
}
