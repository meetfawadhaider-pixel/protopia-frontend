import React, { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import FloatingBlobs from "../components/FloatingBlobs";
import {
  FaBrain,
  FaChalkboardTeacher,
  FaChartLine,
  FaGavel,
  FaGem,
} from "react-icons/fa";
import { FaHandshake } from "react-icons/fa6";
import { FaUserCheck } from "react-icons/fa";

const services = [
  {
    title: "AI-Powered Integrity Assessments",
    audience: "For Leaders & HR Teams",
    description:
      "Get scientifically backed ethical evaluations using Emotional Intelligence, Big Five traits, and leadership models. Personalized insights included.",
    icon: <FaBrain />,
    bg: "from-indigo-200 to-indigo-100",
  },
  {
    title: "Immersive VR Training Scenarios",
    audience: "For Training Institutions & Enterprises",
    description:
      "Let leaders experience ethical dilemmas through gamified VR — improve reflexive decision-making and accountability.",
    icon: <FaChalkboardTeacher />,
    bg: "from-pink-200 to-pink-100",
  },
  {
    title: "Behavioral Analytics Dashboard",
    audience: "For Compliance Officers & Managers",
    description:
      "Visualize integrity trends, assess ethical growth, and track department-wise metrics using real-time dashboards.",
    icon: <FaChartLine />,
    bg: "from-blue-200 to-blue-100",
  },
  {
    title: "Role-Based Compliance Modules",
    audience: "For Organizations & Ethics Coaches",
    description:
      "Gamified modules on ethical codes, legal compliance, and psychological integrity based on user roles.",
    icon: <FaGavel />,
    bg: "from-yellow-200 to-yellow-100",
  },
  {
    title: "Enterprise Implementation & Advisory",
    audience: "For Institutions & Enterprise Programs",
    description:
      "Hands-on onboarding, integrations, and ethical program design. Co-creation with client partners to align training with policy and culture.",
    icon: <FaUserCheck />,
    bg: "from-violet-200 to-violet-100",
  },
  {
    title: "Flexible Subscription Plans",
    audience: "For Individuals, Teams, Enterprises",
    description:
      "Weekly, monthly, or yearly plans tailored to your needs. White-labeled options and analytics support available.",
    icon: <FaGem />,
    bg: "from-green-200 to-green-100",
    full: true,
    link: "/pricing", // 🔗 make the whole card clickable
  },
];

const Services = () => {
  useEffect(() => {
    AOS.init({ duration: 1000, once: true });
  }, []);

  return (
    <div
      className="relative min-h-screen bg-cover bg-center bg-no-repeat py-20 px-6"
      style={{ backgroundImage: "url('/background.jpg')" }}
    >
      <FloatingBlobs />

      <div className="relative z-10 max-w-6xl mx-auto backdrop-blur-md bg-white/80 rounded-3xl shadow-2xl p-10">
        {/* Section Title */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-extrabold text-indigo-700 drop-shadow">
            What Protopia Offers
          </h2>
          <div className="mt-3 w-20 h-1 mx-auto bg-gradient-to-r from-indigo-400 to-purple-400 rounded-full animate-pulse"></div>
          <p className="text-gray-600 mt-4 max-w-2xl mx-auto">
            Our services combine cutting-edge AI and VR to shape ethical, emotionally intelligent, and resilient leaders globally.
          </p>
        </div>

        {/* Featured Client Strip */}
        <div
          className="mb-10 rounded-2xl border border-indigo-200 bg-gradient-to-br from-indigo-50 to-purple-50 p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center gap-3"
          data-aos="fade-up"
        >
          <div className="text-indigo-600 text-2xl sm:text-3xl">
            <FaHandshake aria-hidden="true" />
          </div>
          <div className="text-left">
            <div className="text-sm uppercase tracking-wider text-indigo-700 font-semibold">
              Featured Client Collaboration
            </div>
            <div className="text-gray-800">
              Built in partnership with <span className="font-semibold">Jeanette Farren</span> to align product outcomes with real-world leadership development needs.
            </div>
          </div>
        </div>

        {/* Services Grid */}
        <div className="grid gap-8 md:grid-cols-2">
          {services.map((service, index) => {
            const card = (
              <div
                data-aos="fade-up"
                className={`p-6 rounded-2xl bg-gradient-to-br ${service.bg} shadow-md hover:shadow-xl transition-all transform hover:scale-105 ${
                  service.full ? "md:col-span-2" : ""
                }`}
              >
                <div className="text-4xl text-indigo-600 mb-4">{service.icon}</div>
                <h3 className="text-2xl font-semibold text-indigo-800 mb-2">
                  {service.title}
                </h3>
                <p className="text-sm italic text-indigo-500 mb-3">
                  {service.audience}
                </p>
                <p className="text-gray-800 text-base">{service.description}</p>
              </div>
            );

            // Wrap whole card in a link if link exists
            return service.link ? (
              <a
                key={index}
                href={service.link}
                className="block cursor-pointer"
              >
                {card}
              </a>
            ) : (
              <div key={index}>{card}</div>
            );
          })}
        </div>

        {/* CTA */}
        <div className="text-center mt-16">
          <h3 className="text-2xl font-bold text-indigo-700 mb-3">
            Ready to Elevate Your Leadership?
          </h3>
          <p className="text-gray-600 mb-6">
            Join the growing network of ethically-driven professionals using Protopia.
          </p>
          <a
            href="/register"
            className="inline-block bg-indigo-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition transform hover:scale-105"
          >
            Get Started Now
          </a>
        </div>
      </div>
    </div>
  );
};

export default Services;
