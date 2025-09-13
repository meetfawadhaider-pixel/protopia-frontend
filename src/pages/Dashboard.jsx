import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const API_BASE =
  (typeof import.meta !== "undefined" && import.meta.env && import.meta.env.VITE_API_BASE) ||
  process.env.REACT_APP_API_BASE ||
  "http://127.0.0.1:8000";

const options = ["Strongly Disagree", "Disagree", "Neutral", "Agree", "Strongly Agree"];

export default function Dashboard() {
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [profile, setProfile] = useState(null);
  const [progress, setProgress] = useState(""); // NOT_STARTED | MCQ_DONE | ESSAY_DONE | VR_DONE | FINALIZED
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const token = typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;
  const headers = { Authorization: `Bearer ${token}` };

  async function fetchProfile() {
    try {
      const res = await fetch(`${API_BASE}/api/accounts/profile/`, { headers });
      if (!res.ok) throw new Error("profile");
      const data = await res.json();
      setProfile(data);
      if (data.role === "admin") navigate("/admin-dashboard");
    } catch (err) {
      console.error("❌ Failed to fetch profile:", err);
    }
  }

  async function fetchProgress() {
    try {
      const res = await fetch(`${API_BASE}/api/assessments/progress/`, { headers });
      const data = await res.json();
      const status = data?.status || "NOT_STARTED";
      setProgress(status);
      return status;
    } catch {
      setProgress("NOT_STARTED");
      return "NOT_STARTED";
    }
  }

  async function fetchQuestions() {
    try {
      const res = await fetch(`${API_BASE}/api/assessments/questions/`, { headers });
      const data = await res.json();
      setQuestions(Array.isArray(data) ? data : data.results || []);
    } catch (err) {
      console.error("❌ Failed to fetch questions:", err);
    }
  }

  useEffect(() => {
    (async () => {
      if (!token) {
        navigate("/login");
        return;
      }
      setLoading(true);
      await fetchProfile();
      await fetchProgress();     // stay on dashboard (no auto-redirect)
      await fetchQuestions();    // always load questions to view / resume
      setLoading(false);
    })();
  }, [navigate]);

  const inputsLocked = progress !== "NOT_STARTED"; // lock radio inputs once MCQs are done

  const handleChange = (questionId, value) => {
    if (!inputsLocked) {
      setAnswers((prev) => ({ ...prev, [questionId]: value }));
    }
  };

  const handleSubmit = async () => {
    if (progress !== "NOT_STARTED") return; // already done

    const unanswered = questions.filter((q) => !answers[q.id]);
    if (unanswered.length > 0) {
      alert("❌ Please answer all 20 questions before submitting.");
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/api/assessments/submit/`, {
        method: "POST",
        headers: { "Content-Type": "application/json", ...headers },
        body: JSON.stringify({ responses: answers }),
      });

      const data = await res.json();
      if (res.ok) {
        // backend advanced to MCQ_DONE — keep user here and show the "Continue" button
        setProgress("MCQ_DONE");
      } else {
        alert(data.message || "Submission failed.");
      }
    } catch (error) {
      console.error("❌ Error submitting answers:", error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen p-8 bg-gradient-to-br from-indigo-50 via-white to-indigo-100 text-center">
        <div className="text-indigo-700 font-medium">Loading…</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-8 bg-gradient-to-br from-indigo-50 via-white to-indigo-100">
      <div className="bg-white p-8 max-w-5xl mx-auto rounded-xl shadow-md border border-indigo-200">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-3xl font-bold text-indigo-700">
            ✨ Leadership Integrity Questionnaire
          </h1>
          {progress && (
            <span className="text-xs px-2 py-1 rounded bg-indigo-100 text-indigo-700">
              Progress: {progress}
            </span>
          )}
        </div>

        {profile && (
          <div className="bg-indigo-100 text-indigo-800 p-4 rounded mb-8">
            <p><strong>Email:</strong> {profile.email}</p>
            <p><strong>Role:</strong> {profile.role}</p>
            <p><strong>Profession:</strong> {profile.profession}</p>
            <p><strong>Gender:</strong> {profile.gender}</p>
            <p><strong>Age Range:</strong> {profile.age_range}</p>
            <p><strong>Subscription:</strong> {profile.subscription_type}</p>
          </div>
        )}

        {Array.isArray(questions) && questions.length > 0 ? (
          questions.map((q, index) => (
            <div key={q.id} className="mb-6 bg-indigo-50 p-4 rounded-md border border-indigo-100 shadow-sm">
              <p className="font-medium text-indigo-900 mb-2">
                <span className="text-sm text-indigo-400 mr-2">Q{index + 1}</span>
                {q.text}
              </p>

              <div className="flex flex-wrap gap-4">
                {options.map((option, i) => (
                  <label key={i} className={`flex items-center space-x-2 ${inputsLocked ? "opacity-60" : ""}`}>
                    <input
                      type="radio"
                      name={`question-${q.id}`}
                      value={option}
                      checked={answers[q.id] === option}
                      onChange={() => handleChange(q.id, option)}
                      className="accent-indigo-600"
                      disabled={inputsLocked}
                    />
                    <span className="text-sm text-gray-700">{option}</span>
                  </label>
                ))}
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500">Loading questions...</p>
        )}

        {/* Actions */}
        <div className="mt-8 flex flex-col sm:flex-row gap-3">
          {progress === "NOT_STARTED" && (
            <button
              onClick={handleSubmit}
              className="w-full sm:w-auto px-6 py-3 bg-indigo-600 text-white font-semibold rounded hover:bg-indigo-700 transition"
            >
              ✅ Submit Answers
            </button>
          )}

          {progress === "MCQ_DONE" && (
            <button
              onClick={() => navigate("/essay")}
              className="w-full sm:w-auto px-6 py-3 bg-purple-600 text-white font-semibold rounded hover:bg-purple-700 transition"
            >
              Continue to Essay
            </button>
          )}

          {progress === "ESSAY_DONE" && (
            <button
              onClick={() => navigate("/vr/interview")}
              className="w-full sm:w-auto px-6 py-3 bg-pink-600 text-white font-semibold rounded hover:bg-pink-700 transition"
            >
              Continue to VR Interview
            </button>
          )}

          {(progress === "VR_DONE" || progress === "FINALIZED") && (
            <button
              onClick={() => navigate("/final")}
              className="w-full sm:w-auto px-6 py-3 bg-green-600 text-white font-semibold rounded hover:bg-green-700 transition"
            >
              View Final Result
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
