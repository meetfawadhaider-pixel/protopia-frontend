import React, { useEffect, useRef, useState } from "react";

// ✅ CRA-compatible env handling
const API_BASE =
  (typeof import.meta !== "undefined" && import.meta.env && import.meta.env.VITE_API_BASE) ||
  process.env.REACT_APP_API_BASE ||
  "http://127.0.0.1:8000";

export default function VRInterview() {
  // load/session
  const [loading, setLoading] = useState(true);
  const [sessionId, setSessionId] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [idx, setIdx] = useState(0);

  // liveness (single code before interview)
  const [code, setCode] = useState("");
  const codeRef = useRef("");
  const [verifying, setVerifying] = useState(false);
  const [codeVerified, setCodeVerified] = useState(false);

  // interview state
  const [interviewStarted, setInterviewStarted] = useState(false);
  const [isRecording, setIsRecording] = useState(false);

  // global timer (5 minutes)
  const [timeLeft, setTimeLeft] = useState(300);
  const timerRef = useRef(null);

  // ui/errors
  const [error, setError] = useState("");
  const [mediaError, setMediaError] = useState("");
  const [vrScore, setVrScore] = useState(null);

  // media
  const videoRef = useRef(null);
  const mediaStreamRef = useRef(null);

  // device selection
  const [cams, setCams] = useState([]);
  const [mics, setMics] = useState([]);
  const [camId, setCamId] = useState(null);
  const [micId, setMicId] = useState(null);

  // audio analysis
  const audioCtxRef = useRef(null);
  const analyserRef = useRef(null);
  const audioTimerRef = useRef(null);
  const rmsSamplesRef = useRef([]);
  const speakingWindowsRef = useRef([]);

  // speech recognition
  const recogRef = useRef(null);
  const recogActiveRef = useRef(false);
  const startTimeRef = useRef(null);
  const endTimeRef = useRef(null);
  const transcriptRef = useRef("");
  const fallbackTextRef = useRef("");

  const token = typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;

  // ---------------- helpers ----------------
  function randCode() {
    return Math.floor(100 + Math.random() * 900).toString();
  }

  function hasSpeechRecognition() {
    return "webkitSpeechRecognition" in window || "SpeechRecognition" in window;
  }

  function startSR(onResult) {
    if (!hasSpeechRecognition()) return;
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recog = new SR();
    recog.continuous = true;
    recog.interimResults = true;
    recog.lang = "en-US";
    recog.onresult = onResult;
    recog.onerror = () => {};
    recog.onend = () => { recogActiveRef.current = false; };
    recog.start();
    recogActiveRef.current = true;
    recogRef.current = recog;
  }

  function stopSR() {
    try { if (recogActiveRef.current && recogRef.current) recogRef.current.stop(); } catch {}
    recogActiveRef.current = false;
  }

  function startAudioAnalysis(stream) {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    audioCtxRef.current = new AudioContext();
    const source = audioCtxRef.current.createMediaStreamSource(stream);
    const analyser = audioCtxRef.current.createAnalyser();
    analyser.fftSize = 1024;
    source.connect(analyser);
    analyserRef.current = analyser;

    rmsSamplesRef.current = [];
    speakingWindowsRef.current = [];
    let lastState = "silence";

    audioTimerRef.current = setInterval(() => {
      const n = analyser.frequencyBinCount;
      const data = new Uint8Array(n);
      analyser.getByteTimeDomainData(data);
      let sum = 0;
      for (let i = 0; i < n; i++) {
        const x = (data[i] - 128) / 128.0;
        sum += x * x;
      }
      const rms = Math.sqrt(sum / n);
      rmsSamplesRef.current.push({ t: Date.now(), rms });

      const speaking = rms > 0.03;
      const state = speaking ? "speaking" : "silence";
      if (state !== lastState) {
        speakingWindowsRef.current.push({ at: Date.now(), state });
        lastState = state;
      }
    }, 100);
  }

  function stopAudioAnalysis() {
    try { clearInterval(audioTimerRef.current); } catch {}
    audioTimerRef.current = null;
    try { audioCtxRef.current && audioCtxRef.current.close(); } catch {}
    audioCtxRef.current = null;
  }

  function computeFeatures() {
    const transcript = hasSpeechRecognition() ? transcriptRef.current : fallbackTextRef.current;
    const words = transcript.trim().split(/\s+/).filter(Boolean);
    const durSec =
      startTimeRef.current && endTimeRef.current
        ? Math.max(1, (endTimeRef.current - startTimeRef.current) / 1000)
        : Math.max(1, (Date.now() - (startTimeRef.current || Date.now())) / 1000);

    const sw = speakingWindowsRef.current;
    const pauses = [];
    for (let i = 1; i < sw.length; i++) {
      const prev = sw[i - 1], cur = sw[i];
      if (prev.state === "speaking" && cur.state === "silence") {
        const start = cur.at;
        let j = i + 1;
        while (j < sw.length && sw[j].state !== "speaking") j++;
        if (j < sw.length) pauses.push((sw[j].at - start) / 1000);
      }
    }
    const avg_pause_sec = pauses.length ? pauses.reduce((a, b) => a + b, 0) / pauses.length : 0.5;

    return {
      speech_rate_wps: Number((words.length / durSec).toFixed(2)),
      avg_pause_sec: Number(avg_pause_sec.toFixed(2)),
      sentiment: 0,
      challenge_passed: true, // single pre-start verification already done
      _duration_sec: Number(durSec.toFixed(2)),
      _words_count: words.length,
      _challenge: codeRef.current,
    };
  }

  // --- MEDIA -----------------------------------------------------------
  async function getDevices() {
    try {
      const list = await navigator.mediaDevices.enumerateDevices();
      const camList = list.filter((d) => d.kind === "videoinput");
      const micList = list.filter((d) => d.kind === "audioinput");
      setCams(camList);
      setMics(micList);
      if (!camId && camList[0]) setCamId(camList[0].deviceId);
      if (!micId && micList[0]) setMicId(micList[0].deviceId);
    } catch {}
  }

  async function startMediaPreview(selectedCam, selectedMic) {
    setMediaError("");
    try {
      // Stop previous
      try { mediaStreamRef.current?.getTracks()?.forEach((t) => t.stop()); } catch {}

      const constraints = {
        video: selectedCam
          ? { deviceId: { exact: selectedCam }, width: { ideal: 1280 }, height: { ideal: 720 }, facingMode: "user" }
          : { facingMode: "user", width: { ideal: 1280 }, height: { ideal: 720 } },
        audio: selectedMic ? { deviceId: { exact: selectedMic } } : true,
      };
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      mediaStreamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        const tryPlay = async () => { try { await videoRef.current.play(); } catch {} };
        videoRef.current.onloadedmetadata = tryPlay;
        setTimeout(tryPlay, 50);
      }
      startAudioAnalysis(stream);
    } catch (err) {
      console.error("getUserMedia error", err);
      if (err?.name === "NotAllowedError") {
        setMediaError("Camera/Microphone permission denied. Allow access in the browser.");
      } else if (err?.name === "NotFoundError") {
        setMediaError("No camera/microphone found. Connect a device and retry.");
      } else {
        setMediaError("Could not start camera/microphone. Check OS/browser permissions.");
      }
    }
  }

  function stopMedia() {
    try { mediaStreamRef.current?.getTracks()?.forEach((t) => t.stop()); } catch {}
    stopAudioAnalysis();
  }

  // ---------------- init ----------------
  useEffect(() => {
    (async () => {
      setError("");
      try {
        if (!token) {
          setError("Not logged in. Please login again.");
          setLoading(false);
          return;
        }

        // 1) Start session first (fail fast on ordering/auth)
        const sres = await fetch(`${API_BASE}/api/assessments/vr/start/`, {
          method: "POST",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
          body: JSON.stringify({ count: 5 }),
        });

        if (!sres.ok) {
          let msg = "Could not start interview.";
          try {
            const j = await sres.json();
            if (j?.message) msg = j.message; // e.g., "Out of order: complete Essay first."
          } catch {}
          setError(msg);
          setLoading(false);
          return;
        }

        const sdata = await sres.json();
        setSessionId(sdata.session_id);
        setQuestions(sdata.questions || []);

        // 2) Then request camera/mic
        try {
          await startMediaPreview(null, null);
          await getDevices();
        } catch {}

        const c = randCode();
        setCode(c);
        codeRef.current = c;

        setLoading(false);
      } catch (e) {
        console.error(e);
        setError("Unexpected error starting the interview. Check login and try again.");
        setLoading(false);
      }
    })();

    return () => { stopSR(); stopMedia(); };
  }, []); // run once

  // Restart preview when user changes device
  useEffect(() => {
    if (!loading) startMediaPreview(camId, micId);
  }, [camId, micId, loading]);

  // ---------------- global timer ----------------
  function startGlobalTimer() {
    try { clearInterval(timerRef.current); } catch {}
    setTimeLeft(300);
    timerRef.current = setInterval(async () => {
      setTimeLeft((t) => {
        if (t <= 1) {
          clearInterval(timerRef.current);
          (async () => {
            if (isRecording) await submitAnswer(true);
            await completeInterview();
          })();
          return 0;
        }
        return t - 1;
      });
    }, 1000);
  }

  // ---------------- pre-start verification ----------------
  function verifyCodeByVoice() {
    if (!hasSpeechRecognition()) {
      alert("Speech recognition not available; type your answers when recording.");
      return;
    }
    setVerifying(true);
    startSR((e) => {
      let finalChunk = "";
      for (let i = e.resultIndex; i < e.results.length; i++) {
        const res = e.results[i];
        if (res.isFinal) finalChunk += res[0].transcript + " ";
      }
      if (finalChunk) {
        const heard = finalChunk.toLowerCase().includes(codeRef.current.toLowerCase());
        if (heard) {
          setCodeVerified(true);
          setVerifying(false);
          stopSR();
        }
      }
    });
  }

  async function beginInterview() {
    if (!codeVerified) return;
    setInterviewStarted(true);
    startGlobalTimer();
  }

  // ---------------- per-question flow ----------------
  async function beginQuestion() {
    if (!interviewStarted) return;
    transcriptRef.current = "";
    fallbackTextRef.current = "";
    speakingWindowsRef.current = [];
    rmsSamplesRef.current = [];
    startTimeRef.current = Date.now();
    setIsRecording(true);

    if (hasSpeechRecognition()) {
      startSR((e) => {
        for (let i = e.resultIndex; i < e.results.length; i++) {
          const res = e.results[i];
          if (res.isFinal) transcriptRef.current += res[0].transcript + " ";
        }
      });
    }
  }

  async function submitAnswer(auto = false) {
    if (!auto) {
      const ok = window.confirm("Submit this answer and go to the next question?");
      if (!ok) return;
    }

    endTimeRef.current = Date.now();
    stopSR();
    setIsRecording(false);

    const q = questions[idx];
    if (!q) return;

    const transcript = hasSpeechRecognition()
      ? transcriptRef.current.trim()
      : fallbackTextRef.current.trim();
    const features = computeFeatures();

    try {
      const res = await fetch(`${API_BASE}/api/assessments/vr/answer/`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          session_id: sessionId,
          question_id: q.id,
          pillar_key: q.pillar_key,
          transcript,
          features,
        }),
      });
      if (!res.ok) throw new Error("Answer submit failed");

      if (idx + 1 < questions.length) {
        setIdx(idx + 1);
      } else {
        await completeInterview();
      }
    } catch (e) {
      console.error(e);
      setError("Could not submit answer. Please try again.");
      setIsRecording(false);
    }
  }

  async function completeInterview() {
    stopSR();
    try { clearInterval(timerRef.current); } catch {}
    try {
      const fin = await fetch(`${API_BASE}/api/assessments/vr/complete/`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ session_id: sessionId }),
      });
      const finData = await fin.json();
      if (fin.ok) {
        setVrScore(finData.vr_score ?? null);
      } else {
        setError(finData?.error || "Could not finalize the interview.");
      }
    } catch (e) {
      console.error(e);
      setError("Network error finalizing the interview.");
    }
  }

  // ---------------- helpers ----------------
  function fmt(t) {
    const m = Math.floor(t / 60).toString().padStart(2, "0");
    const s = Math.floor(t % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  }

  // ---------------- UI ----------------
  if (loading) return <div className="p-8">Starting interview…</div>;

  if (error) {
    return (
      <div className="p-8">
        <p className="text-red-400 mb-4">{error}</p>
        <a href="/dashboard" className="underline">Back to dashboard</a>
      </div>
    );
  }

  // ✅ After VR is finalized, go straight to /final
  if (vrScore !== null) {
    window.location.href = "/final";
    return <div className="p-8 text-white">Finalizing…</div>;
  }

  const q = questions[idx];

  return (
    <div className="mx-auto max-w-5xl p-6 grid gap-6 md:grid-cols-2">
      {/* Camera + global timer */}
      <div className="bg-black/40 border border-white/10 rounded-2xl p-4">
        <div className="flex items-center justify-between mb-2 text-sm text-white/80">
          <div className="flex items-center gap-2">
            <span className={`inline-block w-2 h-2 rounded-full ${isRecording ? "bg-red-500 animate-pulse" : "bg-gray-400"}`} />
            {isRecording ? "Recording…" : "Camera ready"}
          </div>
          <div>Time left: {fmt(timeLeft)}</div>
        </div>

        {/* Device pickers */}
        <div className="flex gap-3 mb-3 text-xs">
          <select className="bg-black/60 border border-white/20 rounded px-2 py-1 flex-1"
                  value={camId || ""} onChange={(e) => setCamId(e.target.value)}>
            {cams.map((c, i) => (
              <option key={c.deviceId || i} value={c.deviceId || ""}>
                {c.label || `Camera ${i + 1}`}
              </option>
            ))}
          </select>
          <select className="bg-black/60 border border-white/20 rounded px-2 py-1 flex-1"
                  value={micId || ""} onChange={(e) => setMicId(e.target.value)}>
            {mics.map((m, i) => (
              <option key={m.deviceId || i} value={m.deviceId || ""}>
                {m.label || `Microphone ${i + 1}`}
              </option>
            ))}
          </select>
        </div>

        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="w-full rounded-xl bg-black/60 h-72 md:h-80 object-cover"
          style={{ transform: "scaleX(-1)" }}
          onCanPlay={async () => { try { await videoRef.current.play(); } catch {} }}
        />

        {mediaError && (
          <div className="mt-2 text-red-300 text-xs">{mediaError}</div>
        )}

        <div className="mt-3 text-sm opacity-80">
          <p>🎙 Speak clearly. No uploads are allowed. This is live only.</p>
        </div>
      </div>

      {/* Right side */}
      <div className="bg-black/40 border border-white/10 rounded-2xl p-6 text-white">
        {!interviewStarted ? (
          <>
            <h2 className="text-2xl font-semibold">Verify & Start Interview</h2>
            <p className="mt-2 text-sm opacity-80">
              Read this code aloud to verify liveness. Once verified, you can start.
            </p>

            {!codeVerified ? (
              <div className="mt-4">
                <div className="text-sm opacity-90">Say this code clearly:</div>
                <div className="text-3xl font-bold tracking-widest mt-1 select-none">{code}</div>
                <div className="mt-4 flex gap-3">
                  <button
                    onClick={verifyCodeByVoice}
                    disabled={verifying}
                    className={`py-2 px-4 rounded-xl ${verifying ? "bg-gray-600 cursor-wait" : "bg-white text-black hover:bg-gray-200"}`}
                  >
                    {verifying ? "Listening…" : "Verify by voice"}
                  </button>
                </div>
              </div>
            ) : (
              <div className="mt-4 text-green-300">Code verified ✅</div>
            )}

            <div className="mt-6">
              <button
                onClick={beginInterview}
                disabled={!codeVerified}
                className={`py-2 px-4 rounded-xl ${!codeVerified ? "bg-gray-600 cursor-not-allowed" : "bg-white text-black hover:bg-gray-200"}`}
              >
                Start Interview
              </button>
            </div>
          </>
        ) : (
          <>
            <div className="text-xs opacity-80">Question {idx + 1} of {questions.length}</div>
            <h2 className="mt-2 text-2xl font-semibold">{q?.text}</h2>
            <div className="mt-2 text-sm opacity-80">Pillar: {q?.pillar_name}</div>

            {!hasSpeechRecognition() && (
              <div className="mt-4">
                <label className="text-sm opacity-80">Your answer (type if speech recognition is unavailable):</label>
                <textarea
                  className="mt-1 w-full h-28 rounded-xl p-3 text-black"
                  placeholder="Type your answer here…"
                  onChange={(e) => (fallbackTextRef.current = e.target.value)}
                />
              </div>
            )}

            <div className="mt-6 flex gap-3">
              <button
                onClick={beginQuestion}
                disabled={isRecording}
                className={`py-2 px-4 rounded-xl ${isRecording ? "bg-gray-600 cursor-not-allowed" : "bg-white text-black hover:bg-gray-200"}`}
              >
                Start Answer
              </button>
              <button
                onClick={() => submitAnswer(false)}
                disabled={!isRecording}
                className={`py-2 px-4 rounded-xl ${!isRecording ? "bg-gray-700 border border-white/20 cursor-not-allowed" : "bg-black border border-white/20 hover:bg-black/80"}`}
              >
                Submit & Next
              </button>
            </div>

            <div className="mt-6 text-xs opacity-70">
              Tip: After you click “Start Answer”, speak your answer. You can also pause briefly to gather your thoughts.
            </div>
          </>
        )}
      </div>
    </div>
  );
}
