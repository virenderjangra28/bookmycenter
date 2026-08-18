"use client";

import UserContext from "@/context/userContext";
import Link from "next/link";
import { useContext, useEffect, useState } from "react";

export default function UpdateCenters() {
  const { user } = useContext(UserContext);
  const [centers, setCenters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  //get centers by userId
  async function getCenters() {
    let cancelled = false;
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/centerlist/${user._id}`);
      const data = await response.json();

      if (!response.ok || data.success === false) {
        throw new Error(data.error || "Failed to load centers");
      }

      if (!cancelled) {
        setCenters(Array.isArray(data.data) ? data.data : []);
      }
    } catch (fetchError) {
      if (!cancelled) {
        setError(fetchError.message);
        setCenters([]);
      }
    } finally {
      if (!cancelled) {
        setLoading(false);
      }
    }
  }

  useEffect(() => {
    if (!user?._id) return;
    getCenters();

  }, [user?._id]);

  return (
    <main className="px-5 py-8 sm:px-8 lg:px-10 lg:py-10">
      <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-[#2563eb]">
        Client Portal
      </p>
      <h1 className="mt-2 text-3xl font-bold tracking-tight text-[#0b1a33]">Update Centers</h1>
      <p className="mt-2 text-sm text-[#64748b]">Centers registered under your account.</p>

      {loading ? (
        <p className="mt-8 text-sm text-[#64748b]">Loading centers...</p>
      ) : error ? (
        <p className="mt-8 text-sm text-[#b03a2e]">{error}</p>
      ) : centers.length === 0 ? (
        <section className="mt-8 rounded-2xl bg-white px-6 py-16 text-center shadow-[0_8px_24px_rgba(15,23,42,0.06)]">
          <p className="text-sm font-semibold text-[#0b1a33]">No centers found</p>
          <p className="mt-2 text-sm text-[#64748b]">
            Centers you add as a partner will appear here.
          </p>
          <Link
            href="/client/update-center"
            className="mt-4 inline-flex text-sm font-semibold text-[#0a7ea4] hover:underline"
          >
            Add or update center details
          </Link>
        </section>
      ) : (
        <ul className="mt-8 space-y-4">
          {centers.map((center) => (
            <li
              key={center._id}
              className="flex items-center justify-between gap-4 rounded-2xl bg-white px-6 py-5 shadow-[0_8px_24px_rgba(15,23,42,0.06)]"
            >
              <div>
                <p className="font-semibold text-[#0b1a33]">{center.label || "Unnamed Center"}</p>
                <p className="mt-1 text-sm text-[#64748b]">
                  {center.totalSeatingCapacity
                    ? `${center.totalSeatingCapacity} seats`
                    : "Capacity not set"}
                </p>
              </div>
              <Link
                href="/client/update-center"
                className="text-sm font-semibold text-[#0a7ea4] hover:underline"
              >
                Edit details
              </Link>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
