import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const API_BASE =
  (typeof import.meta !== "undefined" && import.meta.env && import.meta.env.VITE_API_BASE) ||
  process.env.REACT_APP_API_BASE ||
  "http://127.0.0.1:8000";

export default function SubscriptionGuard({ children }) {
  const [ok, setOk] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      try {
        const token = localStorage.getItem("accessToken");
        if (!token) {
          setOk(false);
          setLoading(false);
          return;
        }
        const res = await fetch(`${API_BASE}/api/accounts/profile/`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();

        // Accept either the new Stripe-backed subscription object or the legacy dropdown value
        const hasActiveStripe =
          data?.subscription && String(data.subscription.status).toLowerCase() === "active";

        const hasLegacyFlag =
          ["Weekly", "Monthly", "Yearly"].includes(data?.subscription_type || "");

        setOk(!!(hasActiveStripe || hasLegacyFlag));
      } catch {
        setOk(false);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) {
    return (
      <div className="min-h-[40vh] grid place-items-center text-white">
        Checking subscription…
      </div>
    );
  }

  if (!ok) {
    return (
      <div className="min-h-[60vh] grid place-items-center text-white">
        <div className="text-center">
          <h2 className="text-2xl font-semibold mb-2">Subscription Required</h2>
          <p className="opacity-90 mb-4">
            You need an active subscription to access this feature.
          </p>
          <button
            onClick={() => navigate("/pricing")}
            className="px-6 py-2 rounded-xl bg-white text-black hover:bg-gray-200"
          >
            View Plans
          </button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
