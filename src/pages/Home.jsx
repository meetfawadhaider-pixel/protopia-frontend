import React from "react";
import { Typewriter } from "react-simple-typewriter";
import ScrollTop from "../components/ScrollTop";
import StickyCTA from "../components/StickyCTA";
import DashboardPreview from "../components/DashboardPreview";
import TestimonialsCarousel from "../components/TestimonialsCarousel";
import CaseStudySpotlight from "../components/CaseStudySpotlight";
import FloatingBlobs from "../components/FloatingBlobs";
import ProtopiaAnimatedDemo from "../components/ProtopiaAnimatedDemo";
import {
  FaCertificate,
  FaUserShield,
  FaBalanceScale,
  FaCompass,
  FaLightbulb,
  FaEnvelope,
  FaGlobeAmericas,
  FaUsers,
  FaUniversity,
} from "react-icons/fa";

import heroImage from "../assets/leadership-hero.jpg";
import "../components/BackgroundBlobs.css";

const Home = () => {
  return (
    <div className="bg-gray-100 text-gray-900 font-sans relative overflow-x-hidden">
      <FloatingBlobs /> {/* 💫 Floating visual layer behind everything */}

      {/* Hero Section */}
      <div
        className="relative z-10 bg-cover bg-center min-h-screen flex items-center justify-center px-6 py-20"
        style={{
          backgroundImage: `linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url(${heroImage})`,
        }}
      >
        <div className="relative text-white text-center max-w-5xl z-10">
          <h1 className="text-5xl font-extrabold mb-4 leading-tight drop-shadow-xl animate-glow">
            <span className="text-indigo-400">
              <Typewriter
                words={["Lead with Integrity.", "Train with AI.", "Grow through VR."]}
                loop={true}
                cursor
                cursorStyle="_"
                typeSpeed={60}
                deleteSpeed={30}
                delaySpeed={1500}
              />
            </span>
          </h1>
          <p className="text-lg mb-6 text-gray-200 max-w-3xl mx-auto">
            Unlock leadership potential through immersive AI and scientifically backed frameworks.
          </p>
          <a
            href="/register"
            className="px-8 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-semibold rounded-lg shadow-lg hover:scale-105 transition transform animate-pulseSlow"
          >
            Get Started
          </a>
        </div>
      </div>

      {/* Trust Logos / Certifications */}
      <section className="py-16 bg-white text-center z-10 relative">
        <h2 className="text-3xl font-bold text-indigo-700 mb-10">Trusted & Certified</h2>
        <div className="flex flex-wrap justify-center gap-10 items-center max-w-5xl mx-auto">
          {[
            { icon: <FaCertificate />, label: "ISO 27001 Secure" },
            { icon: <FaUserShield />, label: "GDPR Compliant" },
            { icon: <FaBalanceScale />, label: "Ethical AI Certified" },
          ].map((item, i) => (
            <div key={i} className="flex flex-col items-center">
              <div className="text-3xl text-indigo-600 mb-2">{item.icon}</div>
              <span className="text-sm font-semibold text-gray-700">{item.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Video Demo Preview (Animated, no MP4 needed) */}
      <section className="py-20 bg-gradient-to-br from-indigo-100 via-purple-100 to-white text-center relative z-10">
        <h2 className="text-3xl font-bold text-indigo-700 mb-6">See Protopia In Action</h2>
        <p className="text-gray-600 mb-10 max-w-xl mx-auto">
          Watch how our platform empowers leaders through immersive AI + VR experiences.
        </p>
        <div className="max-w-4xl mx-auto rounded-xl overflow-hidden shadow-lg border-4 border-indigo-400">
          <ProtopiaAnimatedDemo />
        </div>
        <div className="mt-6 flex items-center justify-center gap-3">
          <a
            href="/register"
            className="px-6 py-3 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition"
          >
            Get Started
          </a>
          <a
            href="/services"
            className="px-6 py-3 bg-white border rounded-lg font-semibold hover:shadow transition"
          >
            Explore Services
          </a>
        </div>
      </section>

      {/* Leadership Traits */}
      <section className="py-20 bg-gradient-to-r from-pink-50 to-orange-100 text-center z-10 relative">
        <h2 className="text-3xl font-bold text-pink-700 mb-10">Traits We Help You Master</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {[
            { icon: <FaCompass />, label: "Vision" },
            { icon: <FaBalanceScale />, label: "Integrity" },
            { icon: <FaLightbulb />, label: "Empathy" },
            { icon: <FaUserShield />, label: "Accountability" },
          ].map((trait, i) => (
            <div
              key={i}
              className="p-6 bg-white rounded-lg shadow border-t-4 border-pink-400 hover:shadow-lg transition"
            >
              <div className="text-3xl text-pink-600 mb-2">{trait.icon}</div>
              <h3 className="text-lg font-semibold text-gray-800">{trait.label}</h3>
            </div>
          ))}
        </div>
      </section>

      {/* Dashboard Preview */}
      <DashboardPreview />

      {/* Case Study Spotlight */}
      <CaseStudySpotlight />

      {/* Testimonials Carousel */}
      <TestimonialsCarousel />

      {/* Newsletter Signup */}
      <section className="py-20 bg-gradient-to-br from-blue-50 via-indigo-50 to-white text-center z-10 relative">
        <h2 className="text-3xl font-bold text-indigo-700 mb-4">Get Leadership Insights</h2>
        <p className="text-gray-600 mb-8">
          Sign up to receive free monthly leadership resources, research, and platform updates.
        </p>
        <form className="max-w-xl mx-auto flex flex-col sm:flex-row items-center gap-4 px-4">
          <input
            type="email"
            required
            placeholder="Your email address"
            className="w-full sm:flex-1 px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />
          <button
            type="submit"
            className="bg-indigo-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition"
          >
            Subscribe
          </button>
        </form>
      </section>

      {/* Global Reach Section */}
      <section className="py-20 bg-gradient-to-r from-gray-50 via-gray-100 to-white text-center z-10 relative">
        <h2 className="text-3xl font-bold text-indigo-700 mb-6">Our Global Reach</h2>
        <p className="text-gray-600 mb-12 max-w-2xl mx-auto">
          Protopia is helping shape ethical leadership across the globe. Here's a glimpse at our impact.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 max-w-6xl mx-auto">
          {[
            { icon: <FaGlobeAmericas />, label: "Used in 40+ Countries" },
            { icon: <FaUsers />, label: "10,000+ Leaders Trained" },
            { icon: <FaUniversity />, label: "Adopted by 120+ Institutions" },
          ].map((item, i) => (
            <div
              key={i}
              className="p-6 bg-white rounded-xl border shadow-md hover:shadow-lg transition-all"
            >
              <div className="text-4xl text-indigo-600 mb-3">{item.icon}</div>
              <h3 className="text-lg font-semibold text-gray-800">{item.label}</h3>
            </div>
          ))}
        </div>
      </section>

      <ScrollTop />
      <StickyCTA />
    </div>
  );
};

export default Home;
