import React, { useState, useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import "../index.css";

const API_BASE =
  (typeof import.meta !== "undefined" && import.meta.env && import.meta.env.VITE_API_BASE) ||
  process.env.REACT_APP_API_BASE ||
  "http://127.0.0.1:8000";

const essayQuestions = [
  "Describe a time when you had to make a tough ethical decision as a leader.",
  "How do you handle emotional conflict in a diverse team?",
  "What does integrity mean to you in leadership, and how do you apply it?"
];

const EssaySection = () => {
  const [answers, setAnswers] = useState(["", "", ""]);
  const [wordCounts, setWordCounts] = useState([0, 0, 0]);
  const [timers, setTimers] = useState([0, 0, 0]);
  const [isPasted, setIsPasted] = useState([false, false, false]);
  const navigate = useNavigate();

  // Prevent refresh abuse (your original behavior)
  useEffect(() => {
    const isReload = sessionStorage.getItem("essayReloaded");
    if (isReload) {
      toast.warning("⚠️ You refreshed this page. Redirecting to login...");
      setTimeout(() => {
        sessionStorage.removeItem("essayReloaded");
        navigate("/login");
      }, 2500);
    }
    sessionStorage.setItem("essayReloaded", "true");
  }, [navigate]);

  // Simple timers per question (ticks only if there is text)
  useEffect(() => {
    const interval = setInterval(() => {
      setTimers((prev) =>
        prev.map((time, idx) => (answers[idx] ? time + 1 : time))
      );
    }, 1000);
    return () => clearInterval(interval);
  }, [answers]);

  const handleChange = (index, value) => {
    const updated = [...answers];
    updated[index] = value;
    setAnswers(updated);

    const wc = value.trim().split(/\s+/).filter(Boolean).length;
    const updatedWC = [...wordCounts];
    updatedWC[index] = wc;
    setWordCounts(updatedWC);
  };

  const handlePaste = (index) => {
    const updated = [...isPasted];
    updated[index] = true;
    setIsPasted(updated);
  };

  const handleSubmit = async () => {
    const invalidIndex = wordCounts.findIndex((c) => c < 50);
    if (invalidIndex !== -1) {
      toast.error(`❌ Question ${invalidIndex + 1} must have at least 50 words.`);
      return;
    }

    try {
      const response = await fetch(`${API_BASE}/api/assessments/essay-submit/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
        body: JSON.stringify({ answers, timers, is_pasted: isPasted }),
      });

      const data = await response.json();
      if (response.ok) {
        toast.success("✅ Essay saved. Proceeding to VR…");
        setTimeout(() => {
          navigate("/vr/interview");
        }, 800);
      } else {
        toast.error(data.message || "Submission failed.");
      }
    } catch (err) {
      toast.error("Server error.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-200 via-pink-100 to-purple-200 p-6">
      <div className="max-w-5xl mx-auto bg-white shadow-2xl rounded-2xl p-8 space-y-10 animate-fade-in">
        <h1 className="text-3xl font-bold text-center text-indigo-800">✍️ Essay-Based Leadership Reflection</h1>
        <p className="text-center text-gray-700 font-medium mb-6">
          Please reflect deeply and answer each of the following questions.
        </p>

        {essayQuestions.map((q, index) => (
          <div key={index} className="space-y-2">
            <label className="text-lg font-semibold text-indigo-900 block">
              {index + 1}. {q}
              <span className="text-red-500 text-sm ml-2">(Minimum 50 words)</span>
            </label>
            <textarea
              className="w-full p-4 border-2 rounded-xl text-gray-800 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm"
              rows="6"
              placeholder="Type your response here..."
              value={answers[index]}
              onChange={(e) => handleChange(index, e.target.value)}
              onPaste={() => handlePaste(index)}
            />
            <p className="text-sm text-gray-600">📝 Word Count: {wordCounts[index]}</p>
          </div>
        ))}

        <button
          className="w-full py-3 mt-6 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white font-bold rounded-xl hover:scale-105 transition duration-300"
          onClick={handleSubmit}
          disabled={wordCounts.some((count) => count < 50)}
        >
          🚀 Submit Essay
        </button>
      </div>
      <ToastContainer />
    </div>
  );
};

export default EssaySection;
