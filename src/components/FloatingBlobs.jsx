import React from "react";

const FloatingBlobs = () => {
  return (
    <>
      <div className="w-32 h-32 bg-pink-300 rounded-full opacity-60 absolute top-10 left-10 animate-float z-0"></div>
      <div className="w-20 h-20 bg-indigo-300 rounded-full opacity-60 absolute bottom-12 right-12 animate-float z-0"></div>
      <div className="w-24 h-24 bg-purple-300 rounded-full opacity-50 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-float z-0"></div>
    </>
  );
};

export default FloatingBlobs;
