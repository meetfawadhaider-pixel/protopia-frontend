// src/pages/Privacy.jsx
import React from "react";

export default function Privacy() {
  const year = new Date().getFullYear();
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-6 py-12">
        <h1 className="text-3xl font-extrabold text-indigo-700 mb-6">Privacy Policy</h1>
        <p className="text-sm text-gray-500 mb-10">
          Last updated: {year}
        </p>

        <section className="space-y-6 text-gray-800 leading-relaxed">
          <p>
            Protopia (“we”, “us”, “our”) respects your privacy. This policy explains what
            we collect, how we use it, and your choices. It applies to our website and the
            Protopia platform.
          </p>

          <div>
            <h2 className="text-xl font-semibold text-indigo-700">1. What we collect</h2>
            <ul className="list-disc ml-6 mt-2 space-y-1">
              <li>Account data: name, email, role, subscription status.</li>
              <li>Assessment data: MCQ responses, essay text, VR interaction metrics.</li>
              <li>Technical data: device, browser, IP (approximate), usage analytics.</li>
              <li>Payment data: processed by our payment provider; we do not store card details.</li>
            </ul>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-indigo-700">2. How we use data</h2>
            <ul className="list-disc ml-6 mt-2 space-y-1">
              <li>To deliver assessments and compute integrity scores.</li>
              <li>To improve AI/VR models (aggregated and de-identified where feasible).</li>
              <li>To provide support, security, fraud prevention, and compliance.</li>
              <li>To send essential service messages; marketing only with your consent.</li>
            </ul>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-indigo-700">3. Legal basis</h2>
            <p className="mt-2">
              We process data under legitimate interests, performance of a contract, and/or consent,
              consistent with Australian Privacy Principles (APPs) and, where applicable, GDPR.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-indigo-700">4. Storage & security</h2>
            <p className="mt-2">
              Data is stored in secure cloud infrastructure with role-based access, encryption in
              transit and at rest. We retain data only as long as necessary for the stated purposes
              or as required by law.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-indigo-700">5. Sharing</h2>
            <p className="mt-2">
              We may share limited data with processors (e.g., hosting, payments, analytics) bound by
              confidentiality and data processing terms. We do not sell personal data.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-indigo-700">6. Your rights</h2>
            <ul className="list-disc ml-6 mt-2 space-y-1">
              <li>Access, correction, deletion (subject to legal limits).</li>
              <li>Opt-out of non-essential communications.</li>
              <li>Request a copy of your data in a portable format.</li>
            </ul>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-indigo-700">7. Children</h2>
            <p className="mt-2">
              The service is intended for authorised educational/enterprise use. Where required,
              we obtain appropriate guardian or institutional consent.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-indigo-700">8. International transfers</h2>
            <p className="mt-2">
              If data is transferred outside your region, we apply appropriate safeguards
              (e.g., standard contractual clauses, equivalent protections).
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-indigo-700">9. Contact</h2>
            <p className="mt-2">
              For privacy questions or requests, contact:{" "}
              <a href="mailto:privacy@protopia.ai" className="text-indigo-700 underline">
                privacy@protopia.ai
              </a>
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
