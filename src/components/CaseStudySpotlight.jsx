import React from "react";

const CaseStudySpotlight = () => {
  return (
    <section className="py-20 bg-gradient-to-r from-green-50 to-teal-100 text-center">
      <h2 className="text-3xl font-bold text-green-700 mb-6">Featured Case Study</h2>
      <p className="text-gray-700 max-w-xl mx-auto mb-10">How Elevate Corp improved ethical leadership scores by 32% using Protopia.</p>
      <div className="max-w-4xl mx-auto bg-white p-6 rounded-xl shadow-md text-left border-l-4 border-green-500">
        <h3 className="text-xl font-bold text-green-700 mb-2">Elevate Corp – Remote Leadership Growth</h3>
        <p className="text-gray-600 mb-4">
          Elevate Corp faced a challenge with misaligned values among remote teams. By using Protopia’s real-time integrity insights, they improved transparency and accountability.
        </p>
        <ul className="list-disc list-inside text-green-700 font-medium">
          <li>+32% Leadership Integrity Score</li>
          <li>40% Increase in Peer Trust Ratings</li>
          <li>New Culture Benchmarks Introduced</li>
        </ul>
      </div>
    </section>
  );
};

export default CaseStudySpotlight;
