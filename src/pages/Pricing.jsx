import React, { useState } from "react";

// ✅ CRA/Vite-safe env
const API_BASE =
  (typeof import.meta !== "undefined" && import.meta.env && import.meta.env.VITE_API_BASE) ||
  process.env.REACT_APP_API_BASE ||
  "http://127.0.0.1:8000";

export default function Pricing() {
  const [loadingPlan, setLoadingPlan] = useState(null);

  async function subscribe(plan) {
    try {
      setLoadingPlan(plan);

      const token = localStorage.getItem("accessToken");
      if (!token) {
        // If user landed here without registering/logging in
        window.location.href = "/login";
        return;
      }

      const res = await fetch(`${API_BASE}/api/assessments/pay/create-checkout-session/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ plan }), // "weekly" | "monthly" | "yearly"
      });

      let data = {};
      try {
        data = await res.json();
      } catch {
        // ignore JSON parse problems and show generic error
      }

      if (!res.ok || !data.sessionUrl) {
        alert(data.error || "Could not start checkout. Please try again.");
        setLoadingPlan(null);
        return;
      }

      // Stripe Checkout
      window.location.href = data.sessionUrl;
    } catch (err) {
      console.error(err);
      alert("Something went wrong. Please try again.");
      setLoadingPlan(null);
    }
  }

  // 🔹 Display prices (AUD) — UI only; actual charge is set by your Stripe Price IDs.
  const plans = [
    {
      key: "weekly",
      title: "Weekly",
      blurb: "Short-term access to try the platform.",
      price: "A$7.90 / week",
      features: ["All assessments", "Essay scoring", "1 VR session", "Basic support"],
      cta: "Choose Weekly",
    },
    {
      key: "monthly",
      title: "Monthly",
      blurb: "Best for most users.",
      price: "A$24.90 / month",
      features: ["All assessments", "Essay scoring", "3 VR sessions", "Priority support"],
      cta: "Choose Monthly",
      highlight: true,
      badge: "Recommended",
    },
    {
      key: "yearly",
      title: "Yearly",
      blurb: "Best value for long-term use.",
      price: "A$189.00 / year",
      features: ["All assessments", "Essay scoring", "Unlimited VR sessions", "Priority support"],
      cta: "Choose Yearly",
      badge: "Save more",
    },
  ];

  return (
    <div className="max-w-6xl mx-auto px-6 py-10 text-white">
      <h1 className="text-3xl md:text-4xl font-bold mb-2">Choose your plan</h1>
      <p className="opacity-80 mb-8">
        Subscribe to unlock assessments, essay scoring, VR scenarios, and your full results dashboard.
      </p>

      <div className="grid gap-6 md:grid-cols-3">
        {plans.map((p) => (
          <div
            key={p.key}
            className={`relative bg-black/40 border border-white/10 rounded-2xl p-6 shadow ${
              p.highlight ? "ring-2 ring-white/40" : ""
            }`}
          >
            {p.badge && (
              <div className="absolute -top-3 right-4 text-xs bg-white text-black rounded-full px-3 py-1 shadow">
                {p.badge}
              </div>
            )}

            <h2 className="text-2xl font-semibold">{p.title}</h2>
            <p className="mt-1 opacity-80">{p.blurb}</p>
            <div className="mt-4 text-3xl font-bold">{p.price}</div>

            <ul className="mt-4 space-y-1 text-sm opacity-90">
              {p.features.map((f, i) => (
                <li key={i}>• {f}</li>
              ))}
            </ul>

            <button
              onClick={() => subscribe(p.key)}
              disabled={loadingPlan === p.key}
              className={`mt-6 w-full py-2 rounded-xl ${
                loadingPlan === p.key
                  ? "bg-gray-600 cursor-wait"
                  : "bg-white text-black hover:bg-gray-200"
              }`}
            >
              {loadingPlan === p.key ? "Redirecting…" : p.cta}
            </button>
          </div>
        ))}
      </div>

      {/* Professional footer (no dev hints) */}
      <div className="mt-10 text-sm opacity-80">
        <p>All payments are processed securely by Stripe. Prices shown in AUD.</p>
      </div>
    </div>
  );
}
