import React from "react";
import { FaRocket } from "react-icons/fa";

const StickyCTA = () => {
  return (
    <a
      href="/register"
      className="fixed bottom-5 right-5 bg-indigo-600 text-white px-5 py-3 rounded-full shadow-lg hover:bg-indigo-700 transition z-50 flex items-center gap-2 text-sm font-medium"
    >
      <FaRocket className="text-white" /> Start Assessment
    </a>
  );
};

export default StickyCTA;
