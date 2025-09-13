import React, { useEffect, useState } from "react";

const API_BASE =
  (typeof import.meta !== "undefined" && import.meta.env && import.meta.env.VITE_API_BASE) ||
  process.env.REACT_APP_API_BASE ||
  "http://127.0.0.1:8000";

/**
 * Enforces MCQ → Essay → VR → Final order by checking backend progress.
 *
 * stage: "MCQ" | "ESSAY" | "VR" | "FINAL"
 * - MCQ   : allow any authenticated user (logged in)
 * - ESSAY : requires backend status >= MCQ_DONE
 * - VR    : requires backend status >= ESSAY_DONE
 * - FINAL : requires backend status >= VR_DONE
 */
export default function FlowGuard({ stage, children }) {
  const [ok, setOk] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      // PrivateRoute should already catch this, but be defensive
      setOk(false);
      setLoading(false);
      return;
    }

    (async () => {
      try {
        const res = await fetch(`${API_BASE}/api/assessments/progress/`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        // If token expired or unauthorized, fail fast (PrivateRoute will redirect)
        if (res.status === 401) {
          setOk(false);
          setLoading(false);
          return;
        }

        const data = await res.json().catch(() => ({}));
        const status = data?.status || "NOT_STARTED";

        const order = ["NOT_STARTED", "MCQ_DONE", "ESSAY_DONE", "VR_DONE", "FINALIZED"];
        const needIndex = { MCQ: 0, ESSAY: 1, VR: 2, FINAL: 3 }[stage] ?? 0;

        const currentIndex = order.indexOf(status);
        setOk(currentIndex >= needIndex);
      } catch {
        setOk(false);
      } finally {
        setLoading(false);
      }
    })();
  }, [stage]);

  if (loading) return <div className="p-8 text-white">Checking step…</div>;

  if (!ok) {
    return (
      <div className="max-w-lg mx-auto p-8 text-white text-center">
        <h2 className="text-2xl font-semibold mb-2">Hold up ⛔</h2>
        <p className="opacity-90">
          You can’t access this step yet. Please follow the sequence:
          <br />
          <strong>MCQ → Essay → VR → Final</strong>
        </p>
        <a
          href="/dashboard"
          className="inline-block mt-6 py-2 px-5 rounded-xl bg-white text-black hover:bg-gray-200"
        >
          Go to Dashboard
        </a>
      </div>
    );
  }

  return <>{children}</>;
}
