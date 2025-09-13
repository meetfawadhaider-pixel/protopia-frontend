import React from "react";
import { Routes, Route } from "react-router-dom";

// Core pages
import Home from "./pages/Home";
import About from "./pages/About";
import Services from "./pages/Services";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Register from "./pages/Register";
import AdminDashboard from "./pages/AdminDashboard";
import EssaySection from "./pages/EssaySection";

// NEW: Legal pages
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";

// NEW: Forgot Password page
import ForgotPassword from "./pages/ForgotPassword";

// Auth/guards
import PrivateRoute from "./components/PrivateRoute";
import SubscriptionGuard from "./components/SubscriptionGuard";
import FlowGuard from "./components/FlowGuard";
import PublicOnlyRoute from "./components/PublicOnlyRoute";

// Payments
import Pricing from "./pages/Pricing";
import PaymentSuccess from "./pages/PaymentSuccess";
import PaymentCancel from "./pages/PaymentCancel";

// VR
import VRScene from "./pages/VRScene";
import VRInterview from "./pages/VRInterview";

// Final Result
import FinalResult from "./pages/FinalResult";

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public pages */}
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<About />} />
      <Route path="/services" element={<Services />} />
      <Route path="/privacy" element={<Privacy />} />
      <Route path="/terms" element={<Terms />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />

      {/* Public-only pages (blocked if already logged in) */}
      <Route
        path="/login"
        element={
          <PublicOnlyRoute>
            <Login />
          </PublicOnlyRoute>
        }
      />
      <Route
        path="/register"
        element={
          <PublicOnlyRoute>
            <Register />
          </PublicOnlyRoute>
        }
      />

      {/* Payments */}
      <Route path="/pricing" element={<Pricing />} />
      <Route path="/payment/success" element={<PaymentSuccess />} />
      <Route path="/payment/cancel" element={<PaymentCancel />} />

      {/* Protected pages */}
      <Route
        path="/dashboard"
        element={
          <PrivateRoute>
            <FlowGuard stage="MCQ">
              <Dashboard />
            </FlowGuard>
          </PrivateRoute>
        }
      />

      <Route
        path="/admin-dashboard"
        element={
          <PrivateRoute>
            <AdminDashboard />
          </PrivateRoute>
        }
      />

      <Route
        path="/essay"
        element={
          <PrivateRoute>
            <FlowGuard stage="ESSAY">
              <EssaySection />
            </FlowGuard>
          </PrivateRoute>
        }
      />

      {/* VR pages (login + active subscription required) */}
      <Route
        path="/vr/ethics-scenario"
        element={
          <PrivateRoute>
            <SubscriptionGuard>
              <FlowGuard stage="VR">
                <VRScene />
              </FlowGuard>
            </SubscriptionGuard>
          </PrivateRoute>
        }
      />

      <Route
        path="/vr/interview"
        element={
          <PrivateRoute>
            <SubscriptionGuard>
              <FlowGuard stage="VR">
                <VRInterview />
              </FlowGuard>
            </SubscriptionGuard>
          </PrivateRoute>
        }
      />

      {/* Final result page */}
      <Route
        path="/final"
        element={
          <PrivateRoute>
            <FlowGuard stage="FINAL">
              <FinalResult />
            </FlowGuard>
          </PrivateRoute>
        }
      />
    </Routes>
  );
};

export default AppRoutes;
