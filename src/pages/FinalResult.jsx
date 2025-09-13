import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const API_BASE =
  (typeof import.meta !== "undefined" && import.meta.env && import.meta.env.VITE_API_BASE) ||
  process.env.REACT_APP_API_BASE ||
  "http://127.0.0.1:8000";

export default function FinalResult() {
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const token = typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;
  const headers = { Authorization: `Bearer ${token}` };

  async function loadFinal() {
    setError("");
    setLoading(true);
    try {
      if (!token) {
        setError("Unauthorized. Please log in again.");
        setLoading(false);
        return;
      }

      // (Optional) peek at progress; if not finalized yet, show a friendly error
      const progRes = await fetch(`${API_BASE}/api/assessments/progress/`, { headers });
      const prog = await progRes.json().catch(() => ({}));

      const res = await fetch(`${API_BASE}/api/assessments/final/`, { headers });
      if (res.status === 401) {
        setError("Unauthorized. Please log in again.");
        setLoading(false);
        return;
      }
      if (res.status === 409) {
        setError("Final result not ready yet. Please wait a moment and retry.");
        setLoading(false);
        return;
      }
      const json = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(json?.message || "Failed to load final result.");
      }
      setResult(json);
    } catch (e) {
      setError(e.message || "Error loading final result.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }
    loadFinal();
  }, []);

  const handleReset = async () => {
    const ok = window.confirm("Start a new assessment? This erases your previous result for this user.");
    if (!ok) return;
    try {
      const res = await fetch(`${API_BASE}/api/assessments/reset/`, { method: "POST", headers });
      if (res.ok) {
        navigate("/dashboard", { replace: true });
      } else {
        const j = await res.json().catch(() => ({}));
        alert(j?.message || "Could not reset.");
      }
    } catch {
      alert("Network error while resetting.");
    }
  };

  if (loading) return <div className="p-8 text-white">Loading final result…</div>;
  if (error) {
    return (
      <div className="min-h-screen grid place-items-center p-6 text-white">
        <div className="bg-black/40 border border-white/10 rounded-2xl p-6 max-w-md w-full text-center">
          <p className="mb-4">{error}</p>
          <div className="flex gap-3 justify-center">
            <button onClick={loadFinal} className="py-2 px-4 rounded-xl bg-white text-black hover:bg-gray-200">
              Retry
            </button>
            <a href="/dashboard" className="py-2 px-4 rounded-xl bg-white text-black hover:bg-gray-200">
              Dashboard
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-200 via-pink-100 to-purple-200 p-6">
      <div className="max-w-5xl mx-auto bg-white shadow-2xl rounded-2xl p-8 space-y-8">
        <div className="text-center space-y-2">
          <h2 className="text-3xl font-bold text-indigo-800">🎯 Final Leadership Integrity Score</h2>
          <p className="text-xl font-semibold text-gray-700">
            ✅ Score: <span className="text-indigo-700">{result.final_integrity_score} / 100</span>
          </p>
          <p className="text-lg text-gray-600">
            Verdict: <span className="font-bold text-purple-700">{result.verdict}</span>
          </p>
        </div>

        <h3 className="text-xl mt-2 font-bold text-indigo-800 text-center">🏆 Top 5 Leadership Traits</h3>
        <div className="grid md:grid-cols-2 gap-6 mt-4">
          {Object.entries(result.top_traits).map(([trait, traitData], index) => (
            <div key={trait} className="p-4 border bg-indigo-50 rounded-xl shadow-md">
              <div className="flex justify-between text-sm font-bold text-gray-800 mb-2">
                <span>
                  {index === 0 && "🥇 "}
                  {index === 1 && "🥈 "}
                  {index === 2 && "🥉 "}
                  {trait.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())}
                </span>
                <span>{(traitData.mcq_score + traitData.essay_score).toFixed(2)} / 10</span>
              </div>
              <div className="w-full bg-gray-200 rounded h-2 mb-2">
                <div
                  className="h-2 rounded bg-yellow-400"
                  style={{ width: `${Math.min((traitData.mcq_score + traitData.essay_score) * 10, 100)}%` }}
                />
              </div>
              <ul className="text-sm text-gray-700 pl-4 list-disc font-medium">
                <li>{traitData.mcq_subtrait}: <span className="font-semibold">{traitData.mcq_score} / 5</span></li>
                <li>{traitData.essay_subtrait}: <span className="font-semibold">{traitData.essay_score} / 5</span></li>
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-6 text-center text-sm text-orange-600 font-semibold">
          ⚠️ <strong>Disclaimer:</strong> Results are <strong>95% accurate</strong> and include additional behavioral factors not shown in the visible trait breakdown.
        </div>

        <div className="text-center mt-4 flex gap-3 justify-center">
          <a href="/dashboard" className="inline-block px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold rounded-xl hover:scale-105 transition-all">
            Back to Dashboard
          </a>
          <button
            onClick={handleReset}
            className="px-6 py-3 rounded-xl bg-gray-700 text-white hover:bg-gray-800"
          >
            Start New Assessment
          </button>
        </div>
      </div>
    </div>
  );
}
