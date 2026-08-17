"use client";

const UPCOMING_BOOKINGS = [
  { id: "1", item: "Recruitment Exam", date: "12 Sep", seats: "250", status: "Confirmed" },
  { id: "2", item: "Certification Exam", date: "18 Sep", seats: "120", status: "Pending" },
];

function StatusBadge({ status }) {
  const isConfirmed = status === "Confirmed";
  return (
    <span
      className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
        isConfirmed ? "bg-[#dcfce7] text-[#15803d]" : "bg-[#ecfdf5] text-[#166534]"
      }`}
    >
      {status}
    </span>
  );
}

export default function UpcomingBookingsPage() {
  return (
    <main className="px-5 py-8 sm:px-8 lg:px-10 lg:py-10">
      <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-[#2563eb]">
        Client Portal
      </p>
      <h1 className="mt-2 text-3xl font-bold tracking-tight text-[#0b1a33]">Upcoming Bookings</h1>
      <p className="mt-2 text-sm text-[#64748b]">Confirmed and pending bookings scheduled ahead.</p>

      <section className="mt-8 overflow-hidden rounded-2xl bg-white shadow-[0_8px_24px_rgba(15,23,42,0.06)]">
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead>
              <tr className="bg-[#f8fafc] text-[#64748b]">
                <th className="px-6 py-3 font-medium">Item</th>
                <th className="px-6 py-3 font-medium">Date</th>
                <th className="px-6 py-3 font-medium">Seats</th>
                <th className="px-6 py-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {UPCOMING_BOOKINGS.map((booking) => (
                <tr key={booking.id} className="border-t border-[#eef2f6]">
                  <td className="px-6 py-4 font-medium text-[#0b1a33]">{booking.item}</td>
                  <td className="px-6 py-4 text-[#64748b]">{booking.date}</td>
                  <td className="px-6 py-4 text-[#64748b]">{booking.seats}</td>
                  <td className="px-6 py-4">
                    <StatusBadge status={booking.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}
