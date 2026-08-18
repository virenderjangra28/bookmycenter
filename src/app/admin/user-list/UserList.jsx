"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { toast } from "react-toastify";

const PAGE_SIZE = 10;

function formatDate(value) {
  if (!value) return "—";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";

  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function isUserActive(value) {
  return value === 1 || value === "1";
}

export default function UserList() {
  const initialize = useRef(false);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: PAGE_SIZE,
    total: 0,
    totalPages: 1,
  });

  const loadUsers = useCallback(async (page = 1) => {
    setLoading(true);

    try {
      const response = await fetch(
        `/api/admin/users?page=${page}&limit=${PAGE_SIZE}`
      );
      const data = await response.json();

      if (data.success) {
        setUsers(data.result || []);
        setPagination(
          data.pagination || {
            page,
            limit: PAGE_SIZE,
            total: data.result?.length || 0,
            totalPages: 1,
          }
        );
        setCurrentPage(page);
      } else {
        toast.error("Failed to load users");
      }
    } catch {
      toast.error("Failed to load users");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if(initialize.current) return;
    initialize.current = true;
    loadUsers(currentPage);
  }, [currentPage, loadUsers]);

  const pageNumbers = useMemo(() => {
    const totalPages = pagination.totalPages || 1;
    const pages = [];

    for (let page = 1; page <= totalPages; page += 1) {
      pages.push(page);
    }

    return pages;
  }, [pagination.totalPages]);

  const showingFrom =
    pagination.total === 0 ? 0 : (currentPage - 1) * pagination.limit + 1;
  const showingTo = Math.min(currentPage * pagination.limit, pagination.total);

  const handleStatusChange = async (userId, isActive) => {
    setUpdatingId(userId);

    try {
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: Number(isActive) }),
      });

      const data = await response.json();

      if (data.success) {
        setUsers((prev) =>
          prev.map((user) =>
            user._id === userId
              ? { ...user, isActive: Number(isActive) }
              : user
          )
        );
        toast.success("User status updated");
      } else {
        toast.error(data.error || "Failed to update status");
      }
    } catch {
      toast.error("Failed to update status");
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <main className="min-h-screen bg-[#f4f7fb] px-4 py-8 sm:px-6 lg:px-10">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-[#0a7ea4]">
              Admin Panel
            </p>
            <h1 className="mt-1 text-3xl font-bold text-[#0b1a33]">User List</h1>
            <p className="mt-2 text-sm text-[#6b7280]">
              Manage registered users and update their active status.
            </p>
          </div>

          <Link
            href="/admin/dashboard"
            className="inline-flex items-center justify-center rounded-lg border border-[#0a7ea4] px-4 py-2 text-sm font-semibold text-[#0a7ea4] transition hover:bg-[#0a7ea4]/5"
          >
            Back to Dashboard
          </Link>
        </div>

        <section className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-[#e5e7eb]">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-[#e5e7eb]">
              <thead className="bg-[#f8fafc]">
                <tr>
                  {[
                    "Name",
                    "Email",
                    "Company",
                    "Mobile",
                    "Created At",
                    "Status",
                  ].map((heading) => (
                    <th
                      key={heading}
                      className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-[#6b7280] sm:px-6"
                    >
                      {heading}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-[#e5e7eb] bg-white">
                {loading ? (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-6 py-10 text-center text-sm text-[#6b7280]"
                    >
                      Loading users...
                    </td>
                  </tr>
                ) : users.length === 0 ? (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-6 py-10 text-center text-sm text-[#6b7280]"
                    >
                      No users found.
                    </td>
                  </tr>
                ) : (
                  users.map((user) => (
                    <tr key={user._id} className="hover:bg-[#f9fafb]">
                      <td className="whitespace-nowrap px-4 py-4 text-sm font-medium text-[#0b1a33] sm:px-6">
                        {user.name || "—"}
                      </td>
                      <td className="whitespace-nowrap px-4 py-4 text-sm text-[#374151] sm:px-6">
                        {user.email || "—"}
                      </td>
                      <td className="whitespace-nowrap px-4 py-4 text-sm text-[#374151] sm:px-6">
                        {user.company || "—"}
                      </td>
                      <td className="whitespace-nowrap px-4 py-4 text-sm text-[#374151] sm:px-6">
                        {user.mobile || "—"}
                      </td>
                      <td className="whitespace-nowrap px-4 py-4 text-sm text-[#374151] sm:px-6">
                        {formatDate(user.created_at)}
                      </td>
                      <td className="whitespace-nowrap px-4 py-4 text-sm sm:px-6">
                        <select
                          value={isUserActive(user.isActive) ? "1" : "0"}
                          disabled={updatingId === user._id || user.role === 1 || user.role === "1"}
                          onChange={(event) =>
                            handleStatusChange(user._id, event.target.value)
                          }
                          className={`rounded-lg border px-3 py-1.5 text-sm font-medium outline-none transition focus:ring-2 disabled:cursor-not-allowed disabled:opacity-60 ${
                            isUserActive(user.isActive)
                              ? "border-[#bbf7d0] bg-[#f0fdf4] text-[#15803d] focus:border-[#16a34a] focus:ring-[#16a34a]/20"
                              : "border-[#fecaca] bg-[#fef2f2] text-[#b91c1c] focus:border-[#ef4444] focus:ring-[#ef4444]/20"
                          }`}
                        >
                          <option value="1">Active</option>
                          <option value="0">Inactive</option>
                        </select>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {!loading && pagination.total > 0 ? (
            <div className="flex flex-col gap-4 border-t border-[#e5e7eb] px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
              <p className="text-sm text-[#6b7280]">
                Showing {showingFrom} to {showingTo} of {pagination.total} users
              </p>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => setCurrentPage((page) => Math.max(page - 1, 1))}
                  disabled={currentPage === 1}
                  className="rounded-lg border border-[#d1d5db] px-3 py-1.5 text-sm font-medium text-[#374151] transition hover:bg-[#f3f4f6] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Previous
                </button>

                {pageNumbers.map((page) => (
                  <button
                    key={page}
                    type="button"
                    onClick={() => setCurrentPage(page)}
                    className={`min-w-9 rounded-lg px-3 py-1.5 text-sm font-medium transition ${
                      currentPage === page
                        ? "bg-[#0a7ea4] text-white"
                        : "border border-[#d1d5db] text-[#374151] hover:bg-[#f3f4f6]"
                    }`}
                  >
                    {page}
                  </button>
                ))}

                <button
                  type="button"
                  onClick={() =>
                    setCurrentPage((page) =>
                      Math.min(page + 1, pagination.totalPages)
                    )
                  }
                  disabled={currentPage === pagination.totalPages}
                  className="rounded-lg border border-[#d1d5db] px-3 py-1.5 text-sm font-medium text-[#374151] transition hover:bg-[#f3f4f6] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            </div>
          ) : null}
        </section>
      </div>
    </main>
  );
}
