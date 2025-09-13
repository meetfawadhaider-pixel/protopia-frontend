import React, { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";

// CRA/Vite-safe API base (same pattern you use elsewhere)
const API_BASE =
  (typeof import.meta !== "undefined" && import.meta.env && import.meta.env.VITE_API_BASE) ||
  process.env.REACT_APP_API_BASE ||
  "http://127.0.0.1:8000";

/**
 * Blocks access to public pages (Login, Register) if the user is already authenticated.
 * If token is valid -> redirect to /dashboard
 * If no/invalid token -> allow child page to render.
 */
export default function PublicOnlyRoute({ children }) {
  const token = localStorage.getItem("accessToken");
  const [isAuth, setIsAuth] = useState(false);
  const [checking, setChecking] = useState(true);
  const location = useLocation();

  useEffect(() => {
    const check = async () => {
      if (!token) {
        setIsAuth(false);
        setChecking(false);
        return;
      }
      try {
        const res = await fetch(`${API_BASE}/api/accounts/profile/`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setIsAuth(res.ok);
      } catch {
        setIsAuth(false);
      } finally {
        setChecking(false);
      }
    };
    check();
  }, [token]);

  if (checking) {
    return (
      <div style={{ minHeight: "40vh", display: "grid", placeItems: "center", color: "white" }}>
        Loading…
      </div>
    );
  }

  // If already authenticated, never show /login or /register — go to dashboard instead.
  if (isAuth) {
    return <Navigate to="/dashboard" state={{ from: location.pathname }} replace />;
  }

  return <>{children}</>;
}
