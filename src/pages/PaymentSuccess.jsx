import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const API_BASE =
  (typeof import.meta !== "undefined" && import.meta.env && import.meta.env.VITE_API_BASE) ||
  process.env.REACT_APP_API_BASE ||
  "http://127.0.0.1:8000";

export default function PaymentSuccess() {
  const navigate = useNavigate();
  const [msg, setMsg] = useState("Finalizing your subscription…");

  useEffect(() => {
    async function activate() {
      try {
        // 1) Read session_id from URL (Stripe sends it back)
        const params = new URLSearchParams(window.location.search);
        const session_id = params.get("session_id") || "";

        // 2) Keep tokens for this call (DON'T clear them yet)
        const token = localStorage.getItem("accessToken");
        if (!token) {
          setMsg("Please log in again to finalize your subscription.");
          setTimeout(() => navigate("/login", { replace: true }), 1500);
          return;
        }

        // 3) Tell backend to activate this subscription
        const res = await fetch(`${API_BASE}/api/assessments/pay/activate/`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ session_id }),
        });

        if (!res.ok) {
          // If activation fails, still send user to login—backend may already be active via webhook
          setMsg("Payment received. Finalizing…");
        } else {
          setMsg("✅ Subscription activated! Redirecting to login…");
        }
      } catch {
        setMsg("Payment received. Finalizing…");
      } finally {
        // 4) Clean up and go to login (fresh session)
        setTimeout(() => {
          try {
            localStorage.removeItem("accessToken");
            localStorage.removeItem("refreshToken");
            localStorage.removeItem("justRegistered");
          } catch {}
          navigate("/login", { replace: true });
        }, 1500);
      }
    }

    activate();
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center p-8 text-white">
      <div className="bg-black/40 border border-white/10 rounded-2xl p-8 max-w-md text-center">
        <h2 className="text-2xl font-bold">🎉 Payment Successful</h2>
        <p className="mt-2 opacity-90">{msg}</p>
      </div>
    </div>
  );
}
