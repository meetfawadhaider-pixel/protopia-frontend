import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaSearch, FaTrashAlt, FaEye } from "react-icons/fa";

// Pick API base from env (Vite/CRA/Next) or fall back:
// - If running on vercel.app → Railway backend
// - Else → local dev
const API_BASE =
  (typeof import.meta !== "undefined" && import.meta.env && import.meta.env.VITE_API_BASE) ||
  (typeof process !== "undefined" && (process.env.REACT_APP_API_BASE || process.env.NEXT_PUBLIC_API_BASE)) ||
  (typeof window !== "undefined" && window.__API_BASE__) ||
  (typeof window !== "undefined" && window.location.hostname.includes("vercel.app")
    ? "https://protopiabackend-production.up.railway.app"
    : "http://localhost:8000");

const AdminDashboard = () => {
  const [candidates, setCandidates] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState({ gender: "", age: "", subscription: "" });
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [adminPassword, setAdminPassword] = useState("");
  const [deletionLog, setDeletionLog] = useState([]);
  const [sessionExpired, setSessionExpired] = useState(false);
  const [wrongAttempts, setWrongAttempts] = useState(0);

  const navigate = useNavigate();
  const idleTimer = useRef(null);

  // 🔒 Idle Logout (2 mins)
  useEffect(() => {
    const resetTimer = () => {
      if (idleTimer.current) clearTimeout(idleTimer.current);
      idleTimer.current = setTimeout(() => {
        localStorage.removeItem("accessToken");
        setSessionExpired(true);
      }, 2 * 60 * 1000);
    };
    window.addEventListener("mousemove", resetTimer);
    window.addEventListener("keydown", resetTimer);
    resetTimer();
    return () => {
      window.removeEventListener("mousemove", resetTimer);
      window.removeEventListener("keydown", resetTimer);
      clearTimeout(idleTimer.current);
    };
  }, []);

  // 🔐 Ensure token + admin; then fetch candidates
  useEffect(() => {
    const run = async () => {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        toast.error("Access denied. Please log in.");
        navigate("/login");
        return;
      }
      try {
        // 1) Confirm current user is admin (is_staff)
        const prof = await fetch(`${API_BASE}/api/accounts/profile/`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!prof.ok) throw new Error("Profile fetch failed");
        const profile = await prof.json();
        if (!profile?.is_staff) {
          toast.error("Admin access required.");
          navigate("/");
          return;
        }

        // 2) Fetch candidates list
        const res = await fetch(`${API_BASE}/api/accounts/admin/candidates/`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Unauthorized or access denied");
        const data = await res.json();
        setCandidates(data);
        setFiltered(data);
      } catch (e) {
        toast.error("Access denied or failed to fetch candidates.");
        navigate("/login");
      } finally {
        setLoading(false);
      }
    };
    run();
  }, [navigate]);

  // 🔎 Client-side filtering
  useEffect(() => {
    const filteredData = candidates.filter((user) => {
      const match = `${user.first_name} ${user.last_name} ${user.email}`.toLowerCase();
      const matchSearch = match.includes(search.toLowerCase());
      const matchGender = filter.gender ? user.gender === filter.gender : true;
      const matchAge = filter.age ? user.age_range === filter.age : true;
      const matchSubscription = filter.subscription ? user.subscription_type === filter.subscription : true;
      return matchSearch && matchGender && matchAge && matchSubscription;
    });
    setFiltered(filteredData);
  }, [search, filter, candidates]);

  const openDeleteModal = (userId) => {
    setSelectedUserId(userId);
    setAdminPassword("");
    setShowModal(true);
  };

  const confirmDelete = async () => {
    if (!adminPassword.trim()) {
      toast.error("⚠️ Password required.");
      return;
    }
    const token = localStorage.getItem("accessToken");
    try {
      const userToDelete = filtered.find((u) => u.id === selectedUserId);

      const res = await fetch(`${API_BASE}/api/accounts/admin/delete/${selectedUserId}/`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        // DRF accepts body on DELETE; backend checks password server-side
        body: JSON.stringify({ password: adminPassword }),
      });

      // Attempt to parse JSON; if empty body, guard against error
      let data = null;
      try { data = await res.json(); } catch (_) {}

      if (res.ok) {
        toast.success("✅ User deleted successfully");
        setSearch("");
        setFiltered((prev) => prev.filter((u) => u.id !== selectedUserId));
        if (userToDelete) {
          setDeletionLog((prev) => [
            {
              name: `${userToDelete.first_name} ${userToDelete.last_name}`,
              email: userToDelete.email,
              timestamp: new Date().toLocaleString(),
            },
            ...prev,
          ]);
        }
        setWrongAttempts(0);
      } else {
        setWrongAttempts((prev) => {
          const attempts = prev + 1;
          if (attempts >= 3) {
            toast.error("❌ Too many failed attempts. Logged out.");
            localStorage.removeItem("accessToken");
            navigate("/login");
          } else {
            toast.error(data?.detail || "❌ Invalid password.");
          }
          return attempts;
        });
      }
    } catch {
      toast.error("❌ Server error during deletion.");
    } finally {
      setShowModal(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-950 to-black text-white p-6">
      <ToastContainer />
      <h1 className="text-4xl font-extrabold mb-6 text-center text-cyan-300 tracking-wider drop-shadow-xl">
        🧠 Admin Dashboard – Protopia Candidates
      </h1>

      {/* 🔒 Idle Logout Overlay */}
      {sessionExpired && (
        <div className="fixed inset-0 z-50 bg-black/90 flex flex-col justify-center items-center">
          <div className="bg-gray-900 p-8 rounded-xl text-center shadow-2xl border border-white/10">
            <h2 className="text-2xl font-bold mb-3 text-white">⚠️ You’ve been inactive</h2>
            <p className="text-white/80 mb-5">Your session expired due to inactivity.</p>
            <button
              onClick={() => navigate("/login")}
              className="bg-cyan-600 hover:bg-cyan-700 px-6 py-2 rounded-md text-white font-semibold"
            >
              Sign In Again
            </button>
          </div>
        </div>
      )}

      {/* 🔍 Search & Filters */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <div className="flex items-center gap-2 w-full md:w-1/3">
          <FaSearch className="text-cyan-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name or email..."
            className="w-full p-2 rounded-md bg-white/90 text-black focus:outline-none focus:ring-2 focus:ring-cyan-400"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          <select className="p-2 rounded-md text-black" onChange={(e) => setFilter({ ...filter, gender: e.target.value })}>
            <option value="">All Genders</option>
            <option>Male</option><option>Female</option><option>Other</option>
          </select>
          <select className="p-2 rounded-md text-black" onChange={(e) => setFilter({ ...filter, age: e.target.value })}>
            <option value="">All Ages</option>
            <option>16-20 years</option><option>21-25 years</option>
            <option>26-30 years</option><option>31-40 years</option>
          </select>
          <select className="p-2 rounded-md text-black" onChange={(e) => setFilter({ ...filter, subscription: e.target.value })}>
            <option value="">All Subscriptions</option>
            <option>Weekly</option><option>Monthly</option><option>Yearly</option>
          </select>
        </div>
      </div>

      {/* 📋 Table */}
      {loading ? (
        <p className="text-center text-white/80">Loading candidates...</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full table-auto bg-white/10 rounded-lg shadow-md">
            <thead>
              <tr className="bg-cyan-900 text-white text-sm">
                <th className="px-4 py-2">Name</th><th>Email</th><th>Profession</th>
                <th>Gender</th><th>Age</th><th>Subscription</th><th>Trait Scores</th><th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((user) => (
                <tr key={user.id} className="border-b border-white/10 hover:bg-white/5 transition">
                  <td className="px-4 py-3">{user.first_name} {user.last_name}</td>
                  <td>{user.email}</td>
                  <td>{user.profession}</td>
                  <td>{user.gender}</td>
                  <td>{user.age_range}</td>
                  <td>{user.subscription_type}</td>
                  <td className="text-sm">
                    {user?.trait_scores && Object.keys(user.trait_scores).length ? (
                      <ul className="list-disc list-inside space-y-1">
                        {Object.entries(user.trait_scores).map(([k, v]) => (
                          <li key={k}><span className="text-cyan-300">{k}:</span> {v}/5</li>
                        ))}
                      </ul>
                    ) : (
                      <span className="text-white/60 italic">No scores yet</span>
                    )}
                  </td>
                  <td className="flex gap-3 justify-center py-3">
                    <button onClick={() => alert(JSON.stringify(user, null, 2))} className="text-blue-400 hover:text-blue-300">
                      <FaEye />
                    </button>
                    <button onClick={() => openDeleteModal(user.id)} className="text-red-400 hover:text-red-300">
                      <FaTrashAlt />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* 📜 Deletion Logs */}
      {deletionLog.length > 0 && (
        <div className="mt-10 bg-white/10 p-4 rounded-lg">
          <h3 className="text-lg font-semibold text-yellow-300 mb-3">🗒️ Recent Deletions</h3>
          <ul className="text-sm text-white/90 space-y-2">
            {deletionLog.map((log, i) => (
              <li key={i} className="border-b border-white/10 pb-2">
                <strong>{log.name}</strong> ({log.email}) deleted at {log.timestamp}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* 🔐 Delete Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/80 flex justify-center items-center">
          <div className="bg-gray-800 text-white p-6 rounded-xl w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Confirm Deletion</h2>
            <p className="text-sm text-white/70 mb-2">Enter your admin password to confirm deletion:</p>
            <input
              type="password"
              value={adminPassword}
              onChange={(e) => setAdminPassword(e.target.value)}
              className="w-full p-2 mb-4 rounded-md bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-red-500"
              placeholder="Admin password"
              autoComplete="new-password"
            />
            <div className="flex justify-end gap-3">
              <button onClick={() => setShowModal(false)} className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600">
                Cancel
              </button>
              <button onClick={confirmDelete} className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700">
                Delete User
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
