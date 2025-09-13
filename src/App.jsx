import React from "react";
import MainLayout from "./layouts/MainLayout";
import AppRoutes from "./router"; // ✅ Route configuration

const App = () => {
  return (
    <div
      className="min-h-screen bg-cover bg-center bg-no-repeat text-white"
      style={{ backgroundImage: "url('/background.jpg')" }}
    >
      <MainLayout>
        <AppRoutes /> {/* ✅ All page routes rendered here */}
      </MainLayout>
    </div>
  );
};

export default App;
