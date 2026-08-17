export default function ClientPlaceholder({ title, description }) {
  return (
    <main className="px-5 py-8 sm:px-8 lg:px-10 lg:py-10">
      <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-[#2563eb]">
        Client Portal
      </p>
      <h1 className="mt-2 text-3xl font-bold tracking-tight text-[#0b1a33]">{title}</h1>
      {description ? (
        <p className="mt-2 max-w-2xl text-sm text-[#64748b]">{description}</p>
      ) : null}

      <section className="mt-8 rounded-2xl bg-white px-6 py-16 text-center shadow-[0_8px_24px_rgba(15,23,42,0.06)]">
        <p className="text-sm font-semibold text-[#0b1a33]">No records yet</p>
        <p className="mt-2 text-sm text-[#64748b]">
          This section will populate as your bookings and center activity grow.
        </p>
      </section>
    </main>
  );
}
