import React from "react";

const DashboardPreview = () => {
  return (
    <section className="py-20 bg-gradient-to-bl from-blue-100 to-purple-50 text-center">
      <h2 className="text-3xl font-bold text-indigo-700 mb-6">Preview the Dashboard</h2>
      <p className="text-gray-600 mb-10 max-w-xl mx-auto">
        Get a sneak peek of how Protopia tracks your leadership development.
      </p>
      <div className="max-w-4xl mx-auto bg-white p-6 rounded-xl shadow-lg text-left">
        <h3 className="text-xl font-semibold text-indigo-700 mb-4">Leadership Profile: Jane Doe</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <p className="font-medium text-gray-700 mb-1">Integrity Score</p>
            <div className="w-full h-4 bg-gray-200 rounded-full overflow-hidden">
              <div className="h-full bg-green-500 rounded-full" style={{ width: '87%' }}></div>
            </div>
          </div>
          <div>
            <p className="font-medium text-gray-700 mb-1">Emotional Intelligence</p>
            <div className="w-full h-4 bg-gray-200 rounded-full overflow-hidden">
              <div className="h-full bg-purple-500 rounded-full" style={{ width: '92%' }}></div>
            </div>
          </div>
          <div>
            <p className="font-medium text-gray-700 mb-1">Accountability</p>
            <div className="w-full h-4 bg-gray-200 rounded-full overflow-hidden">
              <div className="h-full bg-orange-500 rounded-full" style={{ width: '78%' }}></div>
            </div>
          </div>
          <div>
            <p className="font-medium text-gray-700 mb-1">Team Communication</p>
            <div className="w-full h-4 bg-gray-200 rounded-full overflow-hidden">
              <div className="h-full bg-pink-500 rounded-full" style={{ width: '90%' }}></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DashboardPreview;
