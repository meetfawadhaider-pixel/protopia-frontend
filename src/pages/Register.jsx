import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../index.css";
import { useNavigate } from "react-router-dom";

const API_BASE =
  (typeof import.meta !== "undefined" && import.meta.env && import.meta.env.VITE_API_BASE) ||
  process.env.REACT_APP_API_BASE ||
  "http://127.0.0.1:8000";

// Optional endpoints for email verification (graceful fallback if not present)
const SEND_CODE_ENDPOINT = "/api/accounts/email/send-code/";
const VERIFY_CODE_ENDPOINT = "/api/accounts/email/verify/";

const professions = [
  "Executive","Manager","Team Lead","Developer","Research Analyst",
  "Psychologist","HR Officer","Consultant","Trainer","Compliance Officer"
];

const ageRanges = [
  "10-15 years","16-20 years","21-25 years","26-30 years",
  "31-40 years","41-50 years","51-60 years","61+ years"
];

const genders = ["Male","Female","Non-binary","Prefer not to say"];

export default function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    profession: "",
    gender: "",
    ageRange: "",
  });

  const [passwordStrength, setPasswordStrength] = useState("");
  const [loading, setLoading] = useState(false);

  // Email verification UI state
  const [emailStatus, setEmailStatus] = useState("idle"); // idle | sending | sent | verifying | verified | error
  const [code, setCode] = useState("");
  const [resendCooldown, setResendCooldown] = useState(0);
  const [verificationAvailable, setVerificationAvailable] = useState(true); // flips to false if endpoints missing

  // 🚫 If already logged in, don't allow Register page
  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (!token) return;

    (async () => {
      try {
        const res = await fetch(`${API_BASE}/api/accounts/profile/`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          if (localStorage.getItem("justRegistered") === "true") {
            navigate("/pricing", { replace: true });
          } else {
            navigate("/dashboard", { replace: true });
          }
        }
      } catch {
        // ignore – allow register if token invalid
      }
    })();
  }, [navigate]);

  useEffect(() => {
    const inputs = document.querySelectorAll("input");
    inputs.forEach((i) => (i.autocomplete = "new-password"));
  }, []);

  useEffect(() => {
    if (resendCooldown <= 0) return;
    const t = setInterval(() => setResendCooldown((s) => Math.max(0, s - 1)), 1000);
    return () => clearInterval(t);
  }, [resendCooldown]);

  function getPasswordStrength(pw) {
    if (pw.length < 6) return "Weak";
    if (/[A-Z]/.test(pw) && /\d/.test(pw) && pw.length >= 8) return "Strong";
    return "Medium";
  }

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (name === "password") setPasswordStrength(getPasswordStrength(value));
    if (name === "email") {
      // Reset verification state if the email changes
      setEmailStatus("idle");
      setCode("");
    }
  }

  function validateForm() {
    const { firstName, lastName, email, password, profession, gender, ageRange } = formData;
    if (!firstName || !lastName || !email || !password || !profession || !gender || !ageRange) {
      toast.error("Please fill all fields.");
      return false;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      toast.error("Invalid email format.");
      return false;
    }
    if (password.length < 6) {
      toast.error("Password must be at least 6 characters.");
      return false;
    }
    return true;
  }

  async function sendVerificationCode() {
    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      toast.error("Enter a valid email before sending code.");
      return;
    }
    try {
      setEmailStatus("sending");
      await axios.post(`${API_BASE}${SEND_CODE_ENDPOINT}`, { email: formData.email });
      setEmailStatus("sent");
      setResendCooldown(60);
      toast.success("Verification code sent to your email.");
    } catch (err) {
      // If endpoint missing or returns 404/405, disable verification requirement (fallback)
      const status = err?.response?.status;
      if (status === 404 || status === 405) {
        setVerificationAvailable(false);
        setEmailStatus("idle");
        toast.info("Email verification not enabled on server. Proceeding without it.");
      } else {
        setEmailStatus("error");
        const msg = err?.response?.data?.detail || "Failed to send code. Try again.";
        toast.error(msg);
      }
    }
  }

  async function verifyEmailCode() {
    if (!code || code.length !== 6) {
      toast.error("Enter the 6-digit code.");
      return;
    }
    try {
      setEmailStatus("verifying");
      const res = await axios.post(`${API_BASE}${VERIFY_CODE_ENDPOINT}`, {
        email: formData.email,
        code,
      });
      if (res?.data?.verified) {
        setEmailStatus("verified");
        toast.success("Email verified ✅");
      } else {
        setEmailStatus("error");
        toast.error("Invalid code. Please try again.");
      }
    } catch (err) {
      setEmailStatus("error");
      const msg = err?.response?.data?.detail || "Verification failed. Please try again.";
      toast.error(msg);
    }
  }

  async function handleRegister(e) {
    e.preventDefault();
    if (!validateForm()) return;

    // If verification is available, require verified status first
    if (verificationAvailable && emailStatus !== "verified") {
      toast.error("Please verify your email before registering.");
      return;
    }

    setLoading(true);

    const payload = {
      first_name: formData.firstName,
      last_name: formData.lastName,
      email: formData.email,
      password: formData.password,
      profession: formData.profession,
      gender: formData.gender,
      age_range: formData.ageRange,
      role: "candidate",
      // If your backend expects the code with registration, include it conditionally:
      ...(emailStatus === "verified" ? { email_verification_code: code } : {}),
    };

    try {
      // 1) Register
      await axios.post(`${API_BASE}/api/accounts/register/`, payload);

      // 2) Auto-login to get JWT
      const tokenRes = await axios.post(`${API_BASE}/api/accounts/token/`, {
        email: formData.email,
        password: formData.password,
      });
      const access = tokenRes.data?.access;
      const refresh = tokenRes.data?.refresh;
      if (!access) throw new Error("Login failed after registration.");

      localStorage.setItem("accessToken", access);
      localStorage.setItem("refreshToken", refresh);

      // mark the flow so we show plans next
      localStorage.setItem("justRegistered", "true");

      toast.success("✅ Registered successfully! Redirecting to plans…", { autoClose: 1200 });
      setTimeout(() => navigate("/pricing"), 1200);
    } catch (err) {
      const msg =
        err?.response?.data?.email?.[0] ||
        err?.response?.data?.detail ||
        "Registration failed.";
      toast.error(`❌ ${msg}`);
    } finally {
      setLoading(false);
    }
  }

  const strengthBar = {
    Weak: "bg-red-500",
    Medium: "bg-yellow-400",
    Strong: "bg-green-500",
  }[passwordStrength] || "bg-gray-300";

  const canSend = emailStatus === "idle" || (emailStatus === "error" && resendCooldown === 0);
  const canResend = emailStatus === "sent" && resendCooldown === 0;

  return (
    <div
      className="min-h-screen bg-cover bg-center bg-no-repeat flex items-center justify-center"
      style={{ backgroundImage: `url('/background-light.jpg')` }}
    >
      <div className="bg-white/30 backdrop-blur-md shadow-xl border border-white/30 rounded-2xl p-10 w-full max-w-xl animate-fade-in">
        <div className="mb-4">
          <p className="text-sm text-white font-semibold tracking-wide">Step 1 of 2: Registration</p>
          <div className="w-full h-2 bg-white/40 rounded-full mt-2">
            <div className="h-full bg-blue-500 rounded-full transition-all duration-300 w-1/2"></div>
          </div>
        </div>

        <h2 className="text-3xl font-bold text-center text-white drop-shadow-lg mb-6">
          Register with Protopia
        </h2>

        <form className="space-y-5" onSubmit={handleRegister}>
          <label className="block text-white font-semibold">First Name <span className="text-red-400">*</span></label>
          <input
            type="text" name="firstName" value={formData.firstName} onChange={handleChange}
            placeholder="First Name"
            className="w-full px-4 py-2 rounded-md bg-white/80 text-gray-800 focus:ring-2 focus:ring-cyan-400" required
          />

          <label className="block text-white font-semibold">Last Name <span className="text-red-400">*</span></label>
          <input
            type="text" name="lastName" value={formData.lastName} onChange={handleChange}
            placeholder="Last Name"
            className="w-full px-4 py-2 rounded-md bg-white/80 text-gray-800 focus:ring-2 focus:ring-cyan-400" required
          />

          {/* Email + verification controls */}
          <label className="block text-white font-semibold">Email <span className="text-red-400">*</span></label>
          <div className="flex gap-2">
            <input
              type="email" name="email" value={formData.email} onChange={handleChange}
              placeholder="Email"
              className="w-full px-4 py-2 rounded-md bg-white/80 text-gray-800 focus:ring-2 focus:ring-cyan-400" required
            />
            {verificationAvailable && (
              <button
                type="button"
                onClick={sendVerificationCode}
                disabled={!canSend && !canResend}
                className={`px-3 py-2 rounded-md font-semibold shadow-md whitespace-nowrap ${
                  (!canSend && !canResend)
                    ? "bg-gray-500 cursor-not-allowed opacity-70"
                    : "bg-indigo-600 text-white hover:bg-indigo-700"
                }`}
                title="Send verification code"
              >
                {emailStatus === "sending"
                  ? "Sending…"
                  : canResend
                  ? "Resend"
                  : "Send Code"}
              </button>
            )}
          </div>
          {verificationAvailable && emailStatus === "sent" && (
            <p className="text-xs text-white/90">
              We’ve sent a 6-digit code to <span className="font-semibold">{formData.email}</span>. {resendCooldown > 0 ? `You can resend in ${resendCooldown}s.` : ""}
            </p>
          )}

          {verificationAvailable && (emailStatus === "sent" || emailStatus === "verifying" || emailStatus === "error") && (
            <>
              <label className="block text-white font-semibold">Enter 6-digit Code</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  inputMode="numeric"
                  maxLength={6}
                  value={code}
                  onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
                  placeholder="123456"
                  className="w-full px-4 py-2 rounded-md bg-white/80 text-gray-800 focus:ring-2 focus:ring-cyan-400 tracking-widest"
                />
                <button
                  type="button"
                  onClick={verifyEmailCode}
                  disabled={emailStatus === "verifying" || code.length !== 6}
                  className={`px-3 py-2 rounded-md font-semibold shadow-md ${
                    emailStatus === "verifying" || code.length !== 6
                      ? "bg-gray-500 cursor-not-allowed opacity-70"
                      : "bg-emerald-600 text-white hover:bg-emerald-700"
                  }`}
                >
                  {emailStatus === "verifying" ? "Verifying…" : "Verify"}
                </button>
              </div>
              {emailStatus === "error" && (
                <p className="text-xs text-red-200">Verification failed. Check the code and try again.</p>
              )}
              {emailStatus === "verified" && (
                <p className="text-xs text-emerald-200">Email verified.</p>
              )}
            </>
          )}

          <label className="block text-white font-semibold">Password <span className="text-red-400">*</span></label>
          <input
            type="password" name="password" value={formData.password} onChange={handleChange}
            placeholder="Password"
            className="w-full px-4 py-2 rounded-md bg-white/80 text-gray-800 focus:ring-2 focus:ring-cyan-400" required
          />
          {formData.password && (
            <div className="flex items-center gap-2">
              <div className={`w-24 h-2 rounded-full ${strengthBar}`}></div>
              <span className="text-white text-sm">{passwordStrength}</span>
            </div>
          )}

          <label className="block text-white font-semibold">Profession <span className="text-red-400">*</span></label>
          <select
            name="profession" value={formData.profession} onChange={handleChange}
            className="w-full px-4 py-2 rounded-md bg-white/80 text-gray-800 focus:ring-2 focus:ring-cyan-400" required
          >
            <option value="">Select Profession</option>
            {professions.map((p) => <option key={p} value={p}>{p}</option>)}
          </select>

          <label className="block text-white font-semibold">Gender <span className="text-red-400">*</span></label>
          <select
            name="gender" value={formData.gender} onChange={handleChange}
            className="w-full px-4 py-2 rounded-md bg-white/80 text-gray-800 focus:ring-2 focus:ring-cyan-400" required
          >
            <option value="">Select Gender</option>
            {genders.map((g) => <option key={g} value={g}>{g}</option>)}
          </select>

          <label className="block text-white font-semibold">Age Range <span className="text-red-400">*</span></label>
          <select
            name="ageRange" value={formData.ageRange} onChange={handleChange}
            className="w-full px-4 py-2 rounded-md bg-white/80 text-gray-800 focus:ring-2 focus:ring-cyan-400" required
          >
            <option value="">Select Age Range</option>
            {ageRanges.map((a) => <option key={a} value={a}>{a}</option>)}
          </select>

          <button
            type="submit"
            disabled={loading || (verificationAvailable && emailStatus !== "verified")}
            className={`w-full flex items-center justify-center gap-2 py-2 rounded-md font-semibold shadow-md transition-transform
              ${
                loading || (verificationAvailable && emailStatus !== "verified")
                  ? "bg-gray-500 cursor-not-allowed opacity-80"
                  : "bg-blue-600 text-white hover:bg-blue-700 hover:scale-105"
              }`}
          >
            {loading
              ? "Registering…"
              : verificationAvailable && emailStatus !== "verified"
              ? "Verify Email to Register"
              : "Register"}
          </button>
        </form>
      </div>
      <ToastContainer />
    </div>
  );
}
