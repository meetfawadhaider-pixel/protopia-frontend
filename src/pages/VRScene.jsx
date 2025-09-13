import React, { useEffect } from "react";

// ✅ CRA-safe env handling (even if not used here)
const API_BASE =
  (typeof import.meta !== "undefined" && import.meta.env && import.meta.env.VITE_API_BASE) ||
  process.env.REACT_APP_API_BASE ||
  "http://127.0.0.1:8000";

export default function VRScene() {
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://aframe.io/releases/1.5.0/aframe.min.js";
    document.head.appendChild(script);
    return () => {
      document.head.removeChild(script);
    };
  }, []);

  return (
    <div className="h-screen relative">
      <a-scene vr-mode-ui="enabled: true">
        <a-sky color="#ECECEC"></a-sky>
        <a-box position="-1 1.25 -3" rotation="0 45 0" depth="0.5" height="0.5" width="0.5"></a-box>
        <a-sphere position="0 1.25 -3" radius="0.35"></a-sphere>
        <a-cylinder position="1 1.25 -3" radius="0.25" height="0.6"></a-cylinder>
        <a-plane position="0 0 -4" rotation="-90 0 0" width="8" height="8" color="#ddd"></a-plane>
        <a-entity position="0 1.6 0" camera look-controls wasd-controls></a-entity>
      </a-scene>
    </div>
  );
}
