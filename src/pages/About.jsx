import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  FaGlobe, FaLightbulb, FaCogs, FaUserTie, FaUsers, FaChalkboardTeacher,
  FaBalanceScale, FaUserShield, FaCompass, FaBrain
} from "react-icons/fa";
import { FaInfinity, FaRocket, FaProjectDiagram } from "react-icons/fa";
import "../components/BackgroundBlobs.css";
import heroBg from "../assets/leadership-hero.jpg";

/** Small avatar: shows an image if provided, otherwise renders initials */
function Avatar({ name, src, size = 36 }) {
  const initials = (name || "")
    .split(" ")
    .map((n) => n[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();

  const style = { width: size, height: size };

  return (
    <div className="shrink-0">
      {src ? (
        <img
          src={src}
          alt={`${name} avatar`}
          className="rounded-full object-cover ring-2 ring-indigo-200"
          style={style}
        />
      ) : (
        <div
          className="rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold ring-2 ring-indigo-200"
          style={style}
          aria-hidden="true"
        >
          {initials || "P"}
        </div>
      )}
    </div>
  );
}

const About = () => {
  const [faqOpen, setFaqOpen] = useState(null);
  const toggleFAQ = (index) => setFaqOpen(faqOpen === index ? null : index);

  return (
    <div className="relative min-h-screen overflow-x-hidden text-white font-sans">
      {/* Floating Icons */}
      <div className="floating-icon" style={{ top: "15%", left: "10%" }}><FaBrain /></div>
      <div className="floating-icon" style={{ top: "70%", right: "5%" }}><FaUserShield /></div>

      {/* Hero Section */}
      <div
        className="relative w-full bg-cover bg-center min-h-[80vh] flex items-center justify-center px-6 py-20"
        style={{
          backgroundImage: `linear-gradient(rgba(0,0,0,0.7), rgba(0,0,0,0.7)), url(${heroBg})`,
        }}
      >
        <div className="blob-bg">
          <div className="blob blob-1"></div>
          <div className="blob blob-2"></div>
        </div>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="relative z-10 max-w-4xl text-center"
        >
          <h1 className="text-5xl font-extrabold text-indigo-300 mb-4 drop-shadow-lg">About Protopia</h1>
          <p className="text-lg text-gray-200 leading-relaxed">
            We blend behavioral science, AI, and immersive VR to redefine ethical leadership.
          </p>
        </motion.div>
      </div>

      {/* Mission / Vision / Why */}
      <section className="py-20 bg-gradient-to-r from-indigo-900 to-purple-800 text-center">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-6xl mx-auto px-4"
        >
          <h2 className="text-3xl font-bold mb-10 text-indigo-200">Why We Exist</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "Our Mission",
                desc: "To build a world where leadership is driven by ethics and transparency.",
                icon: <FaBalanceScale />
              },
              {
                title: "Our Vision",
                desc: "Redefining leadership through immersive, data-driven insight.",
                icon: <FaCompass />
              },
              {
                title: "Why Protopia?",
                desc: "We empower ethical behavior through smart AI and simulation.",
                icon: <FaUserShield />
              }
            ].map((item, i) => (
              <div
                key={i}
                className="bg-white bg-opacity-10 backdrop-blur-lg p-6 rounded-lg shadow-lg hover:shadow-xl transition"
              >
                <div className="text-3xl mb-4 text-indigo-300">{item.icon}</div>
                <h3 className="text-xl font-bold text-indigo-200 mb-2">{item.title}</h3>
                <p className="text-gray-300">{item.desc}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Who We Serve */}
      <section className="py-20 bg-gradient-to-r from-rose-600 to-pink-500 text-center">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-6xl mx-auto px-4"
        >
          <h2 className="text-3xl font-bold text-white mb-10">Who We Serve</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            {[
              { icon: <FaUserTie />, label: "Executives" },
              { icon: <FaChalkboardTeacher />, label: "Educators" },
              { icon: <FaUsers />, label: "Team Leaders" },
            ].map((role, i) => (
              <div
                key={i}
                className="bg-white bg-opacity-10 p-6 rounded-lg border border-pink-300 shadow hover:shadow-xl hover:scale-105 transition"
              >
                <div className="text-4xl text-pink-100 mb-3">{role.icon}</div>
                <h4 className="text-lg font-semibold text-white">{role.label}</h4>
              </div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* What Makes Us Unique */}
      <section className="py-20 bg-gradient-to-r from-blue-100 to-indigo-200 text-gray-900 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-6xl mx-auto px-4"
        >
          <h2 className="text-3xl font-bold text-indigo-800 mb-10">What Makes Us Unique</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: <FaCogs />,
                title: "Framework-Based AI",
                desc: "Built on psychology-backed models like Big Five and EQ."
              },
              {
                icon: <FaLightbulb />,
                title: "Immersive Ethics Training",
                desc: "Simulations that build moral reasoning under real-world pressure."
              },
              {
                icon: <FaGlobe />,
                title: "Global Reach",
                desc: "Serving leaders across 25+ countries in public and private sectors."
              }
            ].map((item, i) => (
              <div
                key={i}
                className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition border-l-4 border-indigo-500"
              >
                <div className="text-3xl text-indigo-600 mb-3">{item.icon}</div>
                <h4 className="text-lg font-bold text-indigo-800 mb-1">{item.title}</h4>
                <p className="text-sm text-gray-700">{item.desc}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Leadership Pillars */}
      <section className="py-20 bg-gradient-to-r from-pink-100 to-rose-200 text-center text-gray-800">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-6xl mx-auto px-4"
        >
          <h2 className="text-3xl font-bold mb-8">Our 5 Pillars of Leadership Integrity</h2>
          <div className="grid grid-cols-1 sm:grid-cols-5 gap-4">
            {["Accountability", "Transparency", "Empathy", "Resilience", "Justice"].map((pillar, i) => (
              <div key={i} className="bg-white p-4 rounded-lg shadow hover:shadow-xl border-t-4 border-rose-400">
                <FaBrain className="text-2xl text-rose-500 mb-2 mx-auto" />
                <h4 className="text-sm font-semibold">{pillar}</h4>
              </div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Innovation Timeline */}
      <section className="py-20 bg-gradient-to-r from-blue-50 to-cyan-100 text-center text-gray-900">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-5xl mx-auto px-4"
        >
          <h2 className="text-3xl font-bold mb-8 text-blue-800">Our Innovation Timeline</h2>
          <div className="relative border-l-4 border-blue-300 pl-6">
            {[
              { year: "2023", text: "Founded with vision for ethical AI leadership training." },
              { year: "2024", text: "Released VR-integrated assessments for live simulations." },
              { year: "2025", text: "Used by 1200+ leaders globally across industries." },
            ].map((event, i) => (
              <div key={i} className="mb-6">
                <h4 className="text-lg font-bold text-blue-700">{event.year}</h4>
                <p className="text-sm text-gray-700">{event.text}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Meet the Founders & Partners */}
      <section className="py-20 bg-gradient-to-r from-purple-50 to-indigo-100 text-center text-gray-900">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-6xl mx-auto px-4"
        >
          <h2 className="text-3xl font-bold mb-10 text-indigo-700">Meet Our Founders & Partners</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                name: "Fawad Haider",
                role: "AI Lead & Founder",
                quote: "Data with empathy drives leadership.",
                avatar: null, // e.g., "/assets/fawad.jpg"
              },
              {
                name: "Dudhraj B.",
                role: "VR Engineer & Co-Founder",
                quote: "Real impact comes from immersion.",
                avatar: null,
              },
              {
                name: "Suraj D.",
                role: "Ethics Advisor & Co-Founder",
                quote: "Integrity is measurable and teachable.",
                avatar: null,
              },
              {
                name: "Walter Kiplimo",
                role: "Full-Stack Developer & Co-Founder",
                quote: "Engineering solutions that scale with integrity.",
                avatar: null,
              },
              {
                name: "Jeanette Farren",
                role: "Client Partner & Strategic Advisor",
                quote: "Shaping Protopia to empower ethical leaders.",
                avatar: null,
              },
            ].map((member, i) => (
              <div
                key={i}
                className="bg-white p-6 rounded-xl shadow hover:shadow-xl border-l-4 border-indigo-500 text-left"
              >
                <div className="flex items-start gap-4">
                  <Avatar name={member.name} src={member.avatar} />
                  <div>
                    <h4 className="text-lg font-bold text-indigo-800 mb-1 flex items-center gap-2">
                      {member.name}
                    </h4>
                    <p className="text-sm font-semibold text-gray-600 mb-2">{member.role}</p>
                    <p className="text-sm italic text-gray-500">“{member.quote}”</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Global Reach Map */}
      <section className="py-20 bg-gradient-to-r from-teal-100 to-green-200 text-center text-gray-900">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-6xl mx-auto px-4"
        >
          <h2 className="text-3xl font-bold mb-8 text-green-800">Protopia's Global Reach</h2>
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/thumb/e/ec/BlankMap-World-v2.png/1200px-BlankMap-World-v2.png"
            alt="Global Map"
            className="w-full max-w-4xl mx-auto rounded-xl shadow-lg"
          />
          <p className="text-sm mt-4 text-gray-700">Trusted in 25+ countries across public and private sectors</p>
        </motion.div>
      </section>

      {/* Leadership Philosophy */}
      <section className="py-20 bg-gradient-to-r from-indigo-50 to-purple-100 text-center text-gray-900">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-5xl mx-auto px-6"
        >
          <h2 className="text-3xl font-extrabold mb-6 text-indigo-800">Our Leadership Philosophy</h2>
          <p className="text-lg text-gray-700 mb-10">
            At Protopia, we believe leadership is not about control but about empowering others. 
            Our philosophy is grounded in servant leadership, emotional intelligence, and transformative integrity.
            We enable leaders to grow not just in performance, but in principle.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: <FaBalanceScale className="text-indigo-500 text-4xl mb-3 mx-auto" />,
                title: "Ethical Decision-Making",
                desc: "Teaching leaders to prioritize justice, fairness, and transparency in every choice."
              },
              {
                icon: <FaBrain className="text-purple-500 text-4xl mb-3 mx-auto" />,
                title: "Emotional Intelligence",
                desc: "Developing empathy and awareness to foster trust and engagement in teams."
              },
              {
                icon: <FaCompass className="text-blue-500 text-4xl mb-3 mx-auto" />,
                title: "Purpose-Driven Impact",
                desc: "Guiding leaders to align actions with purpose, creating long-term societal value."
              }
            ].map((item, i) => (
              <motion.div
                key={i}
                whileHover={{ scale: 1.05 }}
                className="bg-white p-6 rounded-xl shadow-lg border-l-4 border-indigo-400"
              >
                {item.icon}
                <h4 className="text-lg font-bold text-indigo-800 mb-2">{item.title}</h4>
                <p className="text-sm text-gray-700">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Future Vision */}
      <section className="py-20 bg-gradient-to-r from-purple-100 to-blue-200 text-center text-gray-900 overflow-hidden">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="max-w-5xl mx-auto px-6"
        >
          <h2 className="text-3xl font-extrabold text-indigo-800 mb-6">Our Future Vision</h2>
          <p className="text-lg text-gray-700 mb-10">
            We are building an AI-powered ethical ecosystem that not only trains but inspires the next generation of
            global leaders. From real-time feedback to adaptive leadership VR quests – the journey has just begun.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            {[
              {
                icon: <FaRocket className="text-indigo-600 text-4xl mx-auto mb-3 animate-bounce" />,
                title: "Next-Gen VR Simulations",
                text: "AI-powered storylines that adapt to leadership style and moral choices."
              },
              {
                icon: <FaInfinity className="text-purple-600 text-4xl mx-auto mb-3 animate-spin-slow" />,
                title: "Ethical Blockchain Identity",
                text: "Decentralized leader scoring that travels with you – verified, secure, transparent."
              },
              {
                icon: <FaProjectDiagram className="text-blue-600 text-4xl mx-auto mb-3 animate-pulse" />,
                title: "Global Ethics Network",
                text: "Leaders across nations, connected in one platform, aligned by integrity."
              }
            ].map((feature, i) => (
              <motion.div
                key={i}
                whileHover={{ scale: 1.05 }}
                className="bg-white p-6 rounded-xl shadow-lg border-l-4 border-indigo-400"
              >
                {feature.icon}
                <h4 className="text-lg font-bold text-indigo-800 mb-2">{feature.title}</h4>
                <p className="text-sm text-gray-700">{feature.text}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>
    </div>
  );
};

export default About;
