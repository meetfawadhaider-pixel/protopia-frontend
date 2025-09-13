import React, { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";

// ✅ Works with CRA (npm start) and Vite
const API_BASE =
  (typeof import.meta !== "undefined" && import.meta.env && import.meta.env.VITE_API_BASE) ||
  process.env.REACT_APP_API_BASE ||
  "http://127.0.0.1:8000";

export default function PrivateRoute({ children }) {
  const token = localStorage.getItem("accessToken");
  const [ok, setOk] = useState(false);
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    async function check() {
      try {
        if (!token) {
          setOk(false);
          setLoading(false);
          return;
        }
        const res = await fetch(`${API_BASE}/api/accounts/profile/`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          setOk(true);
        } else {
          localStorage.removeItem("accessToken");
          localStorage.removeItem("refreshToken");
          setOk(false);
        }
      } catch {
        setOk(false);
      } finally {
        setLoading(false);
      }
    }
    check();
  }, [token]);

  // While checking auth
  if (loading) {
    return (
      <div style={{ minHeight: "50vh", display: "grid", placeItems: "center", color: "white" }}>
        Checking access…
      </div>
    );
  }

  // Not authenticated → go to login (preserve where the user was going)
  if (!ok) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  // Authenticated → render the protected page
  return <>{children}</>;
}
