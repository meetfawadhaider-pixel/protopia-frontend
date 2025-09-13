// src/components/ProtopiaAnimatedDemo.jsx
import React, { useEffect, useState, useMemo, useRef } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import {
  FaListUl,
  FaKeyboard,
  FaVrCardboard,
  FaHeart,
  FaBalanceScale,
  FaUnlockAlt,
  FaBrain,
  FaPlay,
  FaPause,
  FaRedo,
} from "react-icons/fa";

/**
 * A self-contained, "video-like" animated sequence (~35s) that showcases:
 * - Hook: "Are your leaders truly ethical?"
 * - Problem: "Gut-feel isn't evidence"
 * - Flow: MCQs → Essay → VR
 * - Traits: Empathy, Integrity, Authenticity, Critical Thinking, Ethical Reasoning
 * - Outro: Protopia — Lead with Integrity (URL placeholder)
 *
 * Notes:
 * - No audio (autoplay audio is restricted in browsers). Looks like a promo video.
 * - Respects prefers-reduced-motion (renders a static summary if enabled).
 * - Includes Play/Pause/Replay controls.
 */

const SCENES = {
  INTRO: "INTRO",
  PROBLEM: "PROBLEM",
  FLOW_1: "FLOW_1",
  FLOW_2: "FLOW_2",
  FLOW_3: "FLOW_3",
  TRAITS: "TRAITS",
  OUTRO: "OUTRO",
  END: "END",
};

// timings (ms)
const DURATION_MAP = {
  INTRO: 3000,
  PROBLEM: 4000,
  FLOW_1: 4000,
  FLOW_2: 4000,
  FLOW_3: 4000,
  TRAITS: 6500,
  OUTRO: 4500,
};

const gradientBg =
  "bg-gradient-to-br from-indigo-700 via-purple-700 to-indigo-900";

const baseCard =
  "rounded-2xl shadow-xl ring-1 ring-white/10 backdrop-blur bg-white/5";

const textShadow = { textShadow: "0 8px 24px rgba(0,0,0,0.45)" };

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.7 } },
  exit: { opacity: 0, y: -20, transition: { duration: 0.5 } },
};

export default function ProtopiaAnimatedDemo() {
  const [scene, setScene] = useState(SCENES.INTRO);
  const [isPlaying, setIsPlaying] = useState(true);
  const timerRef = useRef(null);
  const prefersReduced = useReducedMotion();

  const order = useMemo(
    () => [
      SCENES.INTRO,
      SCENES.PROBLEM,
      SCENES.FLOW_1,
      SCENES.FLOW_2,
      SCENES.FLOW_3,
      SCENES.TRAITS,
      SCENES.OUTRO,
      SCENES.END,
    ],
    []
  );

  const nextScene = (current) => {
    const idx = order.indexOf(current);
    return order[Math.min(idx + 1, order.length - 1)];
  };

  useEffect(() => {
    if (prefersReduced) return; // show static if user prefers reduced motion
    if (!isPlaying || scene === SCENES.END) return;

    const dur = DURATION_MAP[scene] ?? 0;
    timerRef.current = setTimeout(() => setScene(nextScene(scene)), dur);

    return () => clearTimeout(timerRef.current);
  }, [scene, isPlaying, prefersReduced]);

  const handlePlayPause = () => setIsPlaying((p) => !p);
  const handleReplay = () => {
    setScene(SCENES.INTRO);
    setIsPlaying(true);
  };

  // Static fallback for reduced motion
  if (prefersReduced) {
    return (
      <div className={`w-full ${gradientBg} rounded-xl p-6 md:p-10 text-white`}>
        <div className="max-w-4xl mx-auto">
          <h3 className="text-2xl md:text-3xl font-extrabold mb-3" style={textShadow}>
            Protopia — Lead with Integrity
          </h3>
          <p className="opacity-90">
            Protopia blends AI scoring with VR scenarios to assess leadership integrity.
            Complete MCQs, write an essay, and experience realistic VR dilemmas. We analyze
            scientifically validated traits (Empathy, Integrity, Authenticity, Critical
            Thinking, Ethical Reasoning) and provide a clear, defensible verdict with anti-cheat
            safeguards.
          </p>
          <div className="grid sm:grid-cols-3 gap-4 mt-6">
            <div className={`${baseCard} p-4`}>
              <div className="text-3xl mb-2"><FaListUl /></div>
              <div className="font-semibold">MCQs</div>
              <div className="text-sm opacity-80">Evidence-based questionnaire</div>
            </div>
            <div className={`${baseCard} p-4`}>
              <div className="text-3xl mb-2"><FaKeyboard /></div>
              <div className="font-semibold">Essay</div>
              <div className="text-sm opacity-80">Authenticity and reasoning</div>
            </div>
            <div className={`${baseCard} p-4`}>
              <div className="text-3xl mb-2"><FaVrCardboard /></div>
              <div className="font-semibold">VR</div>
              <div className="text-sm opacity-80">Realistic dilemmas</div>
            </div>
          </div>
          <div className="mt-6 text-sm opacity-90">
            www.protopia.ai
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative overflow-hidden rounded-xl ${gradientBg} text-white`}>
      {/* 16:9 container */}
      <div className="relative w-full" style={{ paddingBottom: "56.25%" }}>
        <div className="absolute inset-0 p-4 sm:p-6 md:p-10 flex items-center justify-center">
          <AnimatePresence mode="wait">
            {scene === SCENES.INTRO && (
              <SceneIntro key="intro" />
            )}
            {scene === SCENES.PROBLEM && (
              <SceneProblem key="problem" />
            )}
            {scene === SCENES.FLOW_1 && (
              <SceneFlow key="flow1" icon={<FaListUl />} title="MCQs" desc="Evidence-based questionnaire" />
            )}
            {scene === SCENES.FLOW_2 && (
              <SceneFlow key="flow2" icon={<FaKeyboard />} title="Essay" desc="Authenticity & reasoning" />
            )}
            {scene === SCENES.FLOW_3 && (
              <SceneFlow key="flow3" icon={<FaVrCardboard />} title="VR" desc="Realistic dilemmas" timer />
            )}
            {scene === SCENES.TRAITS && (
              <SceneTraits key="traits" />
            )}
            {scene === SCENES.OUTRO && (
              <SceneOutro key="outro" />
            )}
            {scene === SCENES.END && (
              <SceneEnd key="end" />
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Controls */}
      <div className="absolute bottom-3 right-3 flex items-center gap-2">
        <button
          onClick={handlePlayPause}
          className="px-3 py-2 rounded-lg bg-white/10 hover:bg-white/20 transition shadow"
          aria-label={isPlaying ? "Pause animation" : "Play animation"}
          title={isPlaying ? "Pause" : "Play"}
        >
          {isPlaying ? <FaPause /> : <FaPlay />}
        </button>
        <button
          onClick={handleReplay}
          className="px-3 py-2 rounded-lg bg-white/10 hover:bg-white/20 transition shadow"
          aria-label="Replay animation"
          title="Replay"
        >
          <FaRedo />
        </button>
      </div>
    </div>
  );
}

function SceneIntro() {
  return (
    <motion.div
      className="w-full h-full flex flex-col items-center justify-center text-center"
      {...fadeUp}
    >
      <motion.h2
        className="text-2xl sm:text-3xl md:text-4xl font-extrabold"
        style={ { ...textShadow } }
        initial={{ opacity: 0, y: 10, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1, transition: { duration: 0.8 } }}
      >
        Are your leaders truly ethical?
      </motion.h2>
      <motion.p
        className="mt-3 opacity-90"
        style={textShadow}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, transition: { delay: 0.6, duration: 0.8 } }}
      >
        Beyond gut-feel. Measure integrity with AI + VR.
      </motion.p>
    </motion.div>
  );
}

function SceneProblem() {
  return (
    <motion.div
      className="w-full h-full flex flex-col items-center justify-center text-center"
      {...fadeUp}
    >
      <motion.div
        className={`px-6 py-4 ${baseCard}`}
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1, transition: { duration: 0.7 } }}
      >
        <div className="text-xl md:text-2xl font-bold" style={textShadow}>
          GUT-FEEL ISN’T EVIDENCE
        </div>
        <div className="opacity-90 mt-1 text-sm" style={textShadow}>
          Protopia gives you defensible insights about leadership integrity.
        </div>
      </motion.div>
    </motion.div>
  );
}

function SceneFlow({ icon, title, desc, timer = false }) {
  return (
    <motion.div
      className="w-full h-full flex items-center justify-center"
      {...fadeUp}
    >
      <motion.div
        className={`w-full max-w-3xl grid grid-cols-1 sm:grid-cols-[120px,1fr] gap-5 items-center ${baseCard} p-5`}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0, transition: { duration: 0.7 } }}
      >
        <div className="flex items-center justify-center text-5xl">{icon}</div>
        <div>
          <div className="text-2xl font-extrabold" style={textShadow}>{title}</div>
          <div className="opacity-90">{desc}</div>
          {timer && (
            <motion.div
              className="mt-3 h-2 w-full rounded bg-white/20 overflow-hidden"
              initial={{ width: 0 }}
              animate={{ width: "100%", transition: { duration: 3.2 } }}
            >
              <div className="h-2 bg-white/70" />
            </motion.div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}

function SceneTraits() {
  const traits = [
    { icon: <FaHeart />, name: "Empathy" },
    { icon: <FaBalanceScale />, name: "Integrity" },
    { icon: <FaUnlockAlt />, name: "Authenticity" },
    { icon: <FaBrain />, name: "Critical Thinking" },
    { icon: <FaKeyboard />, name: "Ethical Reasoning" },
  ];
  return (
    <motion.div className="w-full h-full flex items-center justify-center" {...fadeUp}>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full max-w-4xl">
        {traits.map((t, i) => (
          <motion.div
            key={t.name}
            className={`${baseCard} p-5 flex items-center gap-4`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0, transition: { delay: i * 0.12, duration: 0.6 } }}
          >
            <div className="text-3xl">{t.icon}</div>
            <div className="font-semibold">{t.name}</div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

function SceneOutro() {
  return (
    <motion.div
      className="w-full h-full flex flex-col items-center justify-center text-center"
      {...fadeUp}
    >
      <motion.div
        className="text-3xl md:text-4xl font-extrabold"
        style={textShadow}
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1, transition: { duration: 0.8 } }}
      >
        Protopia — Lead with Integrity
      </motion.div>
      <motion.div
        className="opacity-90 mt-2"
        style={textShadow}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, transition: { delay: 0.5, duration: 0.7 } }}
      >
        www.protopia.ai
      </motion.div>
      <motion.div
        className="mt-5 h-1 w-40 bg-white/20 rounded overflow-hidden"
        initial={{ width: 0 }}
        animate={{ width: "10rem", transition: { delay: 0.6, duration: 0.6 } }}
      >
        <div className="h-1 bg-white/70" />
      </motion.div>
    </motion.div>
  );
}

function SceneEnd() {
  return (
    <motion.div
      className="w-full h-full flex items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1, transition: { duration: 0.5 } }}
    >
      <div className={`${baseCard} px-5 py-3 text-sm`}>
        Replay or continue exploring Protopia.
      </div>
    </motion.div>
  );
}
