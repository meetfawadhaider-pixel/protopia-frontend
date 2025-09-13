// src/pages/ForgotPassword.jsx
import React, { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import "react-toastify/dist/ReactToastify.css";

const API_BASE =
  (typeof import.meta !== "undefined" && import.meta.env && import.meta.env.VITE_API_BASE) ||
  process.env.REACT_APP_API_BASE ||
  "http://127.0.0.1:8000";

const SEND_CODE_ENDPOINT = "/api/accounts/password/send-code/";
const RESET_PASSWORD_ENDPOINT = "/api/accounts/password/reset/";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [newPw, setNewPw] = useState("");
  const [newPw2, setNewPw2] = useState("");
  const [phase, setPhase] = useState("enter-email"); // enter-email -> enter-code -> done
  const [sending, setSending] = useState(false);
  const [resetting, setResetting] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);

  // UI: show/hide + strength
  const [showPw1, setShowPw1] = useState(false);
  const [showPw2, setShowPw2] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState("");

  // Ensure a clean slate every time page mounts
  useEffect(() => {
    setEmail("");
    setCode("");
    setNewPw("");
    setNewPw2("");
    setPhase("enter-email");
  }, []);

  useEffect(() => {
    if (!resendCooldown) return;
    const t = setInterval(() => setResendCooldown((s) => Math.max(0, s - 1)), 1000);
    return () => clearInterval(t);
  }, [resendCooldown]);

  const validEmail = (v) => /\S+@\S+\.\S+/.test(v);

  // same logic as Register page
  function getPasswordStrength(pw) {
    if (pw.length < 6) return "Weak";
    if (/[A-Z]/.test(pw) && /\d/.test(pw) && pw.length >= 8) return "Strong";
    return "Medium";
  }

  function onChangePw(v) {
    setNewPw(v);
    setPasswordStrength(getPasswordStrength(v));
  }

  async function sendCode() {
    if (!validEmail(email)) {
      toast.error("Enter a valid email.");
      return;
    }
    try {
      setSending(true);
      const res = await fetch(`${API_BASE}${SEND_CODE_ENDPOINT}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.detail || "Failed to send code.");
      toast.success("A 6-digit code was sent to your email.");
      setPhase("enter-code");
      setResendCooldown(60);
    } catch (e) {
      toast.error(e.message || "Could not send code.");
    } finally {
      setSending(false);
    }
  }

  async function confirmReset() {
    if (!code || code.length !== 6) return toast.error("Enter the 6-digit code.");
    if (!newPw || newPw.length < 6) return toast.error("Password must be at least 6 characters.");
    if (newPw !== newPw2) return toast.error("Passwords do not match.");

    try {
      setResetting(true);
      const res = await fetch(`${API_BASE}${RESET_PASSWORD_ENDPOINT}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code, new_password: newPw }),
      });
      const data = await res.json();
      if (!res.ok || !data?.reset) throw new Error(data?.detail || "Password reset failed.");
      toast.success("Password updated. Redirecting to login…");
      setPhase("done");
      setTimeout(() => (window.location.href = "/login"), 1000);
    } catch (e) {
      // backend will also reject if new password == old password
      toast.error(e.message || "Reset failed. Check the code and try again.");
    } finally {
      setResetting(false);
    }
  }

  const strengthBar =
    {
      Weak: "bg-red-500",
      Medium: "bg-yellow-400",
      Strong: "bg-green-500",
    }[passwordStrength] || "bg-gray-300";

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 py-16 text-white"
      style={{ backgroundImage: "url('/background-blur.jpg')", backgroundSize: "cover", backgroundPosition: "center" }}
    >
      <ToastContainer />
      <div className="bg-white/20 backdrop-blur-xl border border-white/20 shadow-2xl rounded-2xl w-full max-w-md p-8">
        <h2 className="text-3xl font-bold text-center mb-6 drop-shadow-md">Forgot Password</h2>

        {/* Hidden anti-autofill fields */}
        <form autoComplete="off" className="hidden">
          <input type="text" name="fake-username" autoComplete="username" />
          <input type="password" name="fake-password" autoComplete="new-password" />
        </form>

        {phase === "enter-email" && (
          <div className="space-y-4">
            <p className="text-white/90 text-sm">
              Enter your email and we’ll send a <strong>6-digit code</strong> to reset your password.
            </p>
            <input
              type="email"
              name="email"
              autoComplete="username"
              value={email}
              onChange={(e) => setEmail(e.target.value.trim())}
              placeholder="you@example.com"
              className="w-full px-4 py-2 rounded-md bg-white/90 text-gray-800 focus:ring-2 focus:ring-cyan-400"
            />
            <button
              onClick={sendCode}
              disabled={sending}
              className={`w-full py-2 rounded-md font-semibold shadow-md transition-transform ${
                sending ? "bg-gray-500 cursor-not-allowed opacity-80" : "bg-indigo-600 hover:bg-indigo-700"
              }`}
            >
              {sending ? "Sending…" : "Send Code"}
            </button>

            <div className="text-center mt-2">
              <a href="/login" className="text-white/80 hover:text-cyan-300 hover:underline">
                Cancel & Back to Login
              </a>
            </div>
          </div>
        )}

        {phase === "enter-code" && (
          <div className="space-y-4">
            <p className="text-white/90 text-sm">
              We sent a code to <strong>{email}</strong>. Enter it below and set your new password.
              {resendCooldown > 0 ? ` You can resend in ${resendCooldown}s.` : ""}
            </p>

            <input
              type="text"
              name="otp"
              autoComplete="one-time-code"
              inputMode="numeric"
              maxLength={6}
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
              placeholder="6-digit code"
              className="w-full px-4 py-2 rounded-md bg-white/90 text-gray-800 focus:ring-2 focus:ring-cyan-400 tracking-widest"
            />

            {/* New password with show/hide + strength meter */}
            <div className="relative">
              <input
                type={showPw1 ? "text" : "password"}
                name="new-password"
                autoComplete="new-password"
                value={newPw}
                onChange={(e) => onChangePw(e.target.value)}
                placeholder="New password"
                className="w-full px-4 py-2 pr-10 rounded-md bg-white/90 text-gray-800 focus:ring-2 focus:ring-cyan-400"
              />
              <span
                className="absolute right-3 top-2.5 text-gray-600 cursor-pointer"
                onClick={() => setShowPw1((s) => !s)}
                title={showPw1 ? "Hide password" : "Show password"}
              >
                {showPw1 ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>

            {/* Strength display (same as Register) */}
            {newPw && (
              <div className="flex items-center gap-2 -mt-1">
                <div className={`w-24 h-2 rounded-full ${strengthBar}`}></div>
                <span className="text-white text-sm">{passwordStrength || " "}</span>
              </div>
            )}

            <div className="relative">
              <input
                type={showPw2 ? "text" : "password"}
                name="confirm-new-password"
                autoComplete="new-password"
                value={newPw2}
                onChange={(e) => setNewPw2(e.target.value)}
                placeholder="Confirm new password"
                className="w-full px-4 py-2 pr-10 rounded-md bg-white/90 text-gray-800 focus:ring-2 focus:ring-cyan-400"
              />
              <span
                className="absolute right-3 top-2.5 text-gray-600 cursor-pointer"
                onClick={() => setShowPw2((s) => !s)}
                title={showPw2 ? "Hide password" : "Show password"}
              >
                {showPw2 ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={confirmReset}
                disabled={resetting || code.length !== 6 || !newPw || !newPw2}
                className={`flex-1 py-2 rounded-md font-semibold shadow-md ${
                  resetting ? "bg-gray-500 cursor-not-allowed opacity-80" : "bg-emerald-600 hover:bg-emerald-700"
                }`}
              >
                {resetting ? "Updating…" : "Confirm & Reset"}
              </button>

              <button
                onClick={sendCode}
                disabled={resendCooldown > 0}
                className={`px-4 py-2 rounded-md font-semibold shadow-md ${
                  resendCooldown > 0 ? "bg-gray-500 cursor-not-allowed opacity-70" : "bg-indigo-600 hover:bg-indigo-700"
                }`}
                title="Resend code"
              >
                Resend
              </button>
            </div>

            <div className="text-center mt-2">
              <a href="/login" className="text-white/80 hover:text-cyan-300 hover:underline">
                Cancel & Back to Login
              </a>
            </div>
          </div>
        )}

        {phase === "done" && (
          <div className="space-y-4 text-center">
            <p className="text-emerald-200">Password updated successfully.</p>
            <a href="/login" className="inline-block py-2 px-4 rounded-md bg-indigo-600 hover:bg-indigo-700 font-semibold shadow-md">
              Go to Login
            </a>
          </div>
        )}

        <p className="text-xs text-center text-white/70 mt-6">
          Having trouble? <a href="mailto:protopia007@gmail.com" className="underline">Contact support</a>
        </p>
      </div>
    </div>
  );
}
