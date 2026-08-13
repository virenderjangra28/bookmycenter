"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";

const STAT_CARDS = [
  {
    key: "clients",
    label: "Total Clients",
    color: "from-[#0a7ea4] to-[#0a5f7a]",
    icon: ClientsIcon,
  },
  {
    key: "users",
    label: "Total Users",
    color: "from-[#3cb878] to-[#2a9d5c]",
    icon: UsersIcon,
  },
  {
    key: "states",
    label: "Total States",
    color: "from-[#6366f1] to-[#4f46e5]",
    icon: StatesIcon,
  },
  {
    key: "cities",
    label: "Total Cities",
    color: "from-[#f59e0b] to-[#d97706]",
    icon: CitiesIcon,
  },
];

function ClientsIcon({ className }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d="M4.5 6.375a4.125 4.125 0 118.25 0 4.125 4.125 0 01-8.25 0zM14.25 8.625a3.375 3.375 0 116.75 0 3.375 3.375 0 01-6.75 0zM1.5 19.125a7.125 7.125 0 0114.25 0v.003l-.001.119a.75.75 0 01-.363.63 13.067 13.067 0 01-6.761 1.873c-2.472 0-4.786-.684-6.76-1.873a.75.75 0 01-.364-.63l-.001-.122zM17.25 19.128l-.001.144a2.25 2.25 0 01-.233.96 10.088 10.088 0 005.06-1.01.75.75 0 00.42-.643 4.875 4.875 0 00-6.957-4.611 8.586 8.586 0 011.71 5.157v.003z" />
    </svg>
  );
}

function UsersIcon({ className }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path fillRule="evenodd" d="M8.25 6.75a3.75 3.75 0 117.5 0 3.75 3.75 0 01-7.5 0zM15.75 9.75a3 3 0 116 0 3 3 0 01-6 0zM2.25 9.75a3 3 0 116 0 3 3 0 01-6 0zM6.31 15.117A6.745 6.745 0 0112 12a6.745 6.745 0 016.709 7.498.75.75 0 01-.372.568A12.696 12.696 0 0112 21.75c-2.305 0-4.47-.612-6.337-1.684a.75.75 0 01-.372-.568 6.787 6.787 0 011.019-4.38z" clipRule="evenodd" />
      <path d="M5.082 14.254a8.287 8.287 0 00-1.308 5.135 9.687 9.687 0 01-1.764-.44l-.115-.04a.563.563 0 01-.373-.487l-.01-.121a3.75 3.75 0 013.57-4.047zM20.226 19.389a8.287 8.287 0 00-1.308-5.135 3.75 3.75 0 013.57 4.047l-.01.121a.563.563 0 01-.373.486l-.115.04c-.567.2-1.156.349-1.764.441z" />
    </svg>
  );
}

function StatesIcon({ className }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path fillRule="evenodd" d="M11.54 22.351l.07.04.028.016a.76.76 0 00.723 0l.028-.015.071-.041a16.975 16.975 0 001.144-.742 19.58 19.58 0 002.683-2.282c1.944-1.99 3.963-4.98 3.963-8.827a8.25 8.25 0 00-16.5 0c0 3.846 2.02 6.837 3.963 8.827a19.58 19.58 0 002.682 2.282 16.975 16.975 0 001.145.742zM12 13.5a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
    </svg>
  );
}

function CitiesIcon({ className }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path fillRule="evenodd" d="M3 2.25a.75.75 0 000 1.5v16.5h-.75a.75.75 0 000 1.5H15v-18a.75.75 0 000-1.5H3zM6.75 8.25a.75.75 0 01.75-.75h.75a.75.75 0 010 1.5h-.75a.75.75 0 01-.75-.75zM6.75 11.25a.75.75 0 01.75-.75h.75a.75.75 0 010 1.5h-.75a.75.75 0 01-.75-.75zM6.75 14.25a.75.75 0 01.75-.75h.75a.75.75 0 010 1.5h-.75a.75.75 0 01-.75-.75zM9.75 8.25a.75.75 0 01.75-.75h.75a.75.75 0 010 1.5h-.75a.75.75 0 01-.75-.75zM9.75 11.25a.75.75 0 01.75-.75h.75a.75.75 0 010 1.5h-.75a.75.75 0 01-.75-.75zM9.75 14.25a.75.75 0 01.75-.75h.75a.75.75 0 010 1.5h-.75a.75.75 0 01-.75-.75zM13.5 6.75a.75.75 0 000 1.5h.75a.75.75 0 000-1.5h-.75zM13.5 9.75a.75.75 0 000 1.5h.75a.75.75 0 000-1.5h-.75zM13.5 12.75a.75.75 0 000 1.5h.75a.75.75 0 000-1.5h-.75zM18 2.25a.75.75 0 000 1.5h3.75a.75.75 0 000-1.5H18zM18 5.25a.75.75 0 000 1.5h3.75a.75.75 0 000-1.5H18zM18 8.25a.75.75 0 000 1.5h3.75a.75.75 0 000-1.5H18zM18 11.25a.75.75 0 000 1.5h3.75a.75.75 0 000-1.5H18zM18 14.25a.75.75 0 000 1.5h3.75a.75.75 0 000-1.5H18zM18 17.25a.75.75 0 000 1.5h3.75a.75.75 0 000-1.5H18z" clipRule="evenodd" />
    </svg>
  );
}

function Modal({ title, onClose, children }) {
  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/40 px-4">
      <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-lg font-bold text-[#0b1a33]">{title}</h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-md p-1 text-[#6b7280] transition hover:bg-[#f3f4f6] hover:text-[#0b1a33]"
            aria-label="Close"
          >
            ✕
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

function Field({ label, children }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-[#6b7280]">
        {label}
      </span>
      {children}
    </label>
  );
}

const inputClass =
  "w-full rounded-lg border border-[#d1d5db] px-3 py-2.5 text-sm uppercase text-[#1f2937] outline-none transition focus:border-[#0a7ea4] focus:ring-2 focus:ring-[#0a7ea4]/15";

export default function AdminDashboard() {
  const initilize = useRef(false);
  const router = useRouter();
  const [stats, setStats] = useState({
    clients: 0,
    users: 0,
    states: 0,
    cities: 0,
  });
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeModal, setActiveModal] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const [stateForm, setStateForm] = useState({ name: "", code: "" });
  const [cityForm, setCityForm] = useState({ name: "", stateId: "" });
  const [clientForm, setClientForm] = useState({
    name: "",
    email: "",
    company: "",
    mobile: "",
    stateId: "",
    cityId: "",
  });
  const [clientCities, setClientCities] = useState([]);

  const loadStats = useCallback(async () => {
    const response = await fetch("/api/admin/stats");
    const data = await response.json();
    if (data.success) {
      setStats(data.stats);
    }
  }, []);

  const loadStates = useCallback(async () => {
    const response = await fetch("/api/states");
    const data = await response.json();
    if (data.success) {
      setStates(data.result);
    }
  }, []);

  const loadCities = useCallback(async (stateId) => {
    if (!stateId) {
      setCities([]);
      return;
    }

    const response = await fetch(`/api/cities?stateId=${stateId}`);
    const data = await response.json();
    if (data.success) {
      setCities(data.result);
    }
  }, []);

  const loadClientCities = useCallback(async (stateId) => {
    if (!stateId) {
      setClientCities([]);
      return;
    }

    const response = await fetch(`/api/cities?stateId=${stateId}`);
    const data = await response.json();
    if (data.success) {
      setClientCities(data.result);
    }
  }, []);

  const loadUsers = useCallback(async () => {
    const response = await fetch("/api/admin/users");
    const data = await response.json();

    if (data.success) {
      const allUsers = data.result || [];
      const activeClients = allUsers.filter(
        (user) => user.isActive === 1 || user.isActive === "1"
      );

      setStats((prev) => ({
        ...prev,
        users: allUsers.length,
        clients: activeClients.length,
      }));
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const init = async () => {
      setLoading(true);
      if(initilize.current) return;
      initilize.current = true;
      await Promise.all([loadStats(), loadUsers(),loadStates()]);
      // setLoading(false);
    };

    init();
  }, [loadStats, loadUsers, loadStates]);

  useEffect(() => {
    if (activeModal === "city") {
      loadCities(cityForm.stateId);
    }
  }, [activeModal, cityForm.stateId, loadCities]);

  useEffect(() => {
    if (activeModal === "client") {
      loadClientCities(clientForm.stateId);
    }
  }, [activeModal, clientForm.stateId, loadClientCities]);

  const closeModal = () => {
    setActiveModal(null);
    setStateForm({ name: "", code: "" });
    setCityForm({ name: "", stateId: "" });
    setClientForm({
      name: "",
      email: "",
      company: "",
      mobile: "",
      stateId: "",
      cityId: "",
    });
    setClientCities([]);
  };

  const handleAddState = async (event) => {
    event.preventDefault();
    if (!stateForm.name.trim()) {
      toast.error("State name is required");
      return;
    }

    setSubmitting(true);
    const response = await fetch("/api/states", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(stateForm),
    });
    const data = await response.json();
    setSubmitting(false);

    if (data.success) {
      toast.success(data.result);
      closeModal();
      await Promise.all([loadStats(), loadStates()]);
    } else {
      toast.error(data.error || "Failed to add state");
    }
  };

  const handleAddCity = async (event) => {
    event.preventDefault();
    if (!cityForm.name.trim() || !cityForm.stateId) {
      toast.error("City name and state are required");
      return;
    }

    setSubmitting(true);
    const response = await fetch("/api/cities", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(cityForm),
    });
    const data = await response.json();
    setSubmitting(false);

    if (data.success) {
      toast.success(data.result);
      closeModal();
      await loadStats();
    } else {
      toast.error(data.error || "Failed to add city");
    }
  };

  const handleAddClient = async (event) => {
    event.preventDefault();
    if (!clientForm.name.trim() || !clientForm.email.trim()) {
      toast.error("Client name and email are required");
      return;
    }

    setSubmitting(true);
    const response = await fetch("/api/clients", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(clientForm),
    });
    const data = await response.json();
    setSubmitting(false);

    if (data.success) {
      toast.success(data.result);
      closeModal();
      await loadStats();
    } else {
      toast.error(data.error || "Failed to add client");
    }
  };

  const handleStatClick = (key) => {
    if (key === "users" || key === "clients") {
      router.push("/admin/user-list");
      return;
    }

    if (key === "states") {
      setActiveModal("state");
      return;
    }

    if (key === "cities") {
      setActiveModal("city");
    }
  };

  return (
    <main className="min-h-screen bg-[#f4f7fb] px-4 py-8 sm:px-6 lg:px-10">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8">
          <p className="text-sm font-semibold uppercase tracking-wide text-[#0a7ea4]">
            Admin Panel
          </p>
          <h1 className="mt-1 text-3xl font-bold text-[#0b1a33]">Dashboard Analytics</h1>
          <p className="mt-2 text-sm text-[#6b7280]">
            Overview of clients, users, states, and cities across BookMyCenter.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {STAT_CARDS.map(({ key, label, color, icon: Icon }) => (
            <div
              key={key}
              className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-[#e5e7eb]"
            >
              <div className={`bg-gradient-to-r ${color} px-5 py-4`}>
                <div className="flex items-center justify-between">
                  <Icon className="h-8 w-8 text-white/90" />
                  <span className="text-3xl font-bold text-white">
                    {loading ? "—" : stats[key]}
                  </span>
                </div>
              </div>
              <div className="px-5 py-4">
                <p className="text-sm font-semibold text-[#0b1a33]">{label}</p>
              </div>
            </div>
          ))}
        </div>

        <section className="mt-8 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-[#e5e7eb]">
          <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-xl font-bold text-[#0b1a33]">Quick Actions</h2>
              <p className="text-sm text-[#6b7280]">
                Add new states, cities, and clients to the platform.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <button
              type="button"
              onClick={() => setActiveModal("state")}
              className="rounded-xl border border-[#dbeafe] bg-[#eff6ff] px-5 py-4 text-left transition hover:border-[#0a7ea4] hover:shadow-sm"
            >
              <p className="text-sm font-bold text-[#0a7ea4]">+ Add State</p>
              <p className="mt-1 text-xs text-[#6b7280]">Create a new state entry</p>
            </button>

            <button
              type="button"
              onClick={() => setActiveModal("city")}
              className="rounded-xl border border-[#fef3c7] bg-[#fffbeb] px-5 py-4 text-left transition hover:border-[#f59e0b] hover:shadow-sm"
            >
              <p className="text-sm font-bold text-[#d97706]">+ Add City</p>
              <p className="mt-1 text-xs text-[#6b7280]">Add city under a selected state</p>
            </button>

            <button
              type="button"
              onClick={() => setActiveModal("client")}
              className="rounded-xl border border-[#dcfce7] bg-[#f0fdf4] px-5 py-4 text-left transition hover:border-[#3cb878] hover:shadow-sm"
            >
              <p className="text-sm font-bold text-[#16a34a]">+ Add Client</p>
              <p className="mt-1 text-xs text-[#6b7280]">Register a new client account</p>
            </button>
          </div>
        </section>
      </div>

      {activeModal === "state" ? (
        <Modal title="Add State" onClose={closeModal}>
          <form onSubmit={handleAddState} className="space-y-4">
            <Field label="State Name *">
              <input
                className={inputClass}
                value={stateForm.name}
                onChange={(e) =>
                  setStateForm({ ...stateForm, name: e.target.value.toUpperCase() })
                }
                placeholder="E.G. HARYANA"
              />
            </Field>
            <Field label="State Code">
              <input
                className={inputClass}
                value={stateForm.code}
                onChange={(e) =>
                  setStateForm({ ...stateForm, code: e.target.value.toUpperCase() })
                }
                placeholder="E.G. HR"
              />
            </Field>
            <button
              type="submit"
              disabled={submitting}
              className="w-full rounded-lg bg-[#0a7ea4] py-2.5 text-sm font-semibold text-white transition hover:bg-[#086a8a] disabled:opacity-60"
            >
              {submitting ? "Saving..." : "Save State"}
            </button>
          </form>
        </Modal>
      ) : null}

      {activeModal === "city" ? (
        <Modal title="Add City" onClose={closeModal}>
          <form onSubmit={handleAddCity} className="space-y-4">
            <Field label="Select State *">
              <select
                className={inputClass}
                value={cityForm.stateId}
                onChange={(e) =>
                  setCityForm({ ...cityForm, stateId: e.target.value, name: cityForm.name })
                }
              >
                <option value="">SELECT STATE</option>
                {states.map((state) => (
                  <option key={state._id} value={state._id}>
                    {state.name}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="City Name *">
              <input
                className={inputClass}
                value={cityForm.name}
                onChange={(e) =>
                  setCityForm({ ...cityForm, name: e.target.value.toUpperCase() })
                }
                placeholder="E.G. ROHTAK"
              />
            </Field>
            <button
              type="submit"
              disabled={submitting || states.length === 0}
              className="w-full rounded-lg bg-[#d97706] py-2.5 text-sm font-semibold text-white transition hover:bg-[#b45309] disabled:opacity-60"
            >
              {submitting ? "Saving..." : "Save City"}
            </button>
          </form>
        </Modal>
      ) : null}

      {activeModal === "client" ? (
        <Modal title="Add Client" onClose={closeModal}>
          <form onSubmit={handleAddClient} className="space-y-4">
            <Field label="Client Name *">
              <input
                className={inputClass}
                value={clientForm.name}
                onChange={(e) =>
                  setClientForm({ ...clientForm, name: e.target.value.toUpperCase() })
                }
                placeholder="CLIENT NAME"
              />
            </Field>
            <Field label="Email *">
              <input
                type="email"
                className={inputClass}
                value={clientForm.email}
                onChange={(e) =>
                  setClientForm({ ...clientForm, email: e.target.value.toUpperCase() })
                }
                placeholder="CLIENT@EMAIL.COM"
              />
            </Field>
            <Field label="Company">
              <input
                className={inputClass}
                value={clientForm.company}
                onChange={(e) =>
                  setClientForm({ ...clientForm, company: e.target.value.toUpperCase() })
                }
                placeholder="COMPANY NAME"
              />
            </Field>
            <Field label="Mobile">
              <input
                className={inputClass}
                value={clientForm.mobile}
                onChange={(e) => setClientForm({ ...clientForm, mobile: e.target.value })}
                placeholder="MOBILE NUMBER"
              />
            </Field>
            <Field label="State">
              <select
                className={inputClass}
                value={clientForm.stateId}
                onChange={(e) =>
                  setClientForm({
                    ...clientForm,
                    stateId: e.target.value,
                    cityId: "",
                  })
                }
              >
                <option value="">SELECT STATE</option>
                {states.map((state) => (
                  <option key={state._id} value={state._id}>
                    {state.name}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="City">
              <select
                className={inputClass}
                value={clientForm.cityId}
                onChange={(e) =>
                  setClientForm({ ...clientForm, cityId: e.target.value })
                }
                disabled={!clientForm.stateId}
              >
                <option value="">SELECT CITY</option>
                {clientCities.map((city) => (
                  <option key={city._id} value={city._id}>
                    {city.name}
                  </option>
                ))}
              </select>
            </Field>
            <button
              type="submit"
              disabled={submitting}
              className="w-full rounded-lg bg-[#16a34a] py-2.5 text-sm font-semibold text-white transition hover:bg-[#15803d] disabled:opacity-60"
            >
              {submitting ? "Saving..." : "Save Client"}
            </button>
          </form>
        </Modal>
      ) : null}
    </main>
  );
}
