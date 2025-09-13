import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { FaUser, FaLock, FaEye, FaEyeSlash } from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";
import Particles from "react-tsparticles";
import "react-toastify/dist/ReactToastify.css";
import "../index.css";

const API_BASE =
  (typeof import.meta !== "undefined" && import.meta.env && import.meta.env.VITE_API_BASE) ||
  process.env.REACT_APP_API_BASE ||
  "http://127.0.0.1:8000";

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch(`${API_BASE}/api/accounts/token/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem("accessToken", data.access);
        localStorage.setItem("refreshToken", data.refresh);

        // Let Navbar (and any listeners) update immediately
        window.dispatchEvent(new Event("authchange"));

        // Load profile to check role
        const profileRes = await fetch(`${API_BASE}/api/accounts/profile/`, {
          headers: { Authorization: `Bearer ${data.access}` },
        });
        const profile = await profileRes.json();

        toast.success("✅ Logged in successfully!", {
          position: "top-center",
          autoClose: 900,
        });

        // Avoid redirecting back to register/pricing/payment pages
        const from = location.state?.from;
        const disallowed = new Set(["/register", "/pricing", "/payment/success", "/payment/cancel"]);

        setTimeout(() => {
          if (profile?.role === "admin") {
            navigate("/admin-dashboard", { replace: true });
          } else if (from && !disallowed.has(from)) {
            navigate(from, { replace: true });
          } else {
            navigate("/dashboard", { replace: true });
          }
        }, 950);
      } else {
        toast.error(data.detail || "❌ Invalid email or password.", {
          position: "top-center",
        });
      }
    } catch (error) {
      toast.error("❌ Could not connect to server.", {
        position: "top-center",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="relative min-h-screen flex items-center justify-center px-4 py-16 bg-gradient-to-br from-purple-900 via-blue-900 to-black text-white"
      style={{ backgroundImage: "url('/background-blur.jpg')", backgroundSize: "cover", backgroundPosition: "center" }}
    >
      <div className="absolute inset-0 bg-white/10 backdrop-blur-sm z-0" />
      <Particles
        id="tsparticles"
        options={{
          fullScreen: false,
          background: { color: { value: "transparent" } },
          fpsLimit: 60,
          interactivity: {
            events: { onHover: { enable: true, mode: "repulse" }, resize: true },
            modes: { repulse: { distance: 100, duration: 0.4 } },
          },
          particles: {
            color: { value: "#ffffff" },
            links: { enable: true, color: "#ffffff", distance: 120, opacity: 0.1, width: 0.8 },
            move: { enable: true, speed: 0.5, direction: "none", outMode: "bounce" },
            number: { value: 40 },
            opacity: { value: 0.15 },
            shape: { type: "circle" },
            size: { value: { min: 1, max: 2 } },
          },
          detectRetina: true,
        }}
        className="absolute inset-0 z-0"
      />

      <ToastContainer />
      <div className="relative z-10 bg-white/20 backdrop-blur-xl border border-white/20 shadow-2xl rounded-2xl w-full max-w-md p-8 animate-fade-in">
        <h2 className="text-3xl font-bold text-white text-center mb-6 drop-shadow-md">🔐 Protopia Login</h2>

        <form onSubmit={handleSubmit} autoComplete="off" autoCapitalize="none" spellCheck="false" className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-white font-semibold mb-1">Email</label>
            <div className="relative">
              <FaUser className="absolute left-3 top-3 text-gray-400" />
              <input
                type="email" id="email" name="email" autoComplete="new-email" value={email}
                onChange={(e) => setEmail(e.target.value)} required
                className="pl-10 pr-4 py-2 w-full rounded-md bg-white/90 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-400"
                placeholder="you@example.com"
              />
            </div>
          </div>

          <div>
            <label htmlFor="password" className="block text-white font-semibold mb-1">Password</label>
            <div className="relative">
              <FaLock className="absolute left-3 top-3 text-gray-400" />
              <input
                type={showPassword ? "text" : "password"} id="password" name="password" autoComplete="new-password"
                value={password} onChange={(e) => setPassword(e.target.value)} required
                className="pl-10 pr-10 py-2 w-full rounded-md bg-white/90 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-400"
                placeholder="••••••••"
              />
              <span className="absolute right-3 top-3 text-gray-500 cursor-pointer" onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>
          </div>

          <div className="text-right text-sm">
            <a href="/forgot-password" className="text-white/80 hover:text-cyan-300 hover:underline">
              Forgot Password?
            </a>
          </div>

          <button
            type="submit" disabled={loading}
            className={`w-full py-2 px-4 rounded-md font-semibold shadow-md text-white transition-all hover:scale-105 ${
              loading ? "bg-gray-500 cursor-not-allowed opacity-80" : "bg-gradient-to-r from-cyan-500 to-blue-600"
            }`}
          >
            {loading ? "Signing In..." : "Sign In"}
          </button>
        </form>

        <p className="text-xs text-center text-white/70 mt-6">🔒 Secured by Protopia AI – JWT Auth Enabled</p>
        <p className="text-sm text-center text-white/90 mt-4">
          Don’t have an account?
          <a href="/register" className="ml-1 text-white font-medium underline hover:text-cyan-300">Register here</a>
        </p>
      </div>
    </div>
  );
};

export default Login;
