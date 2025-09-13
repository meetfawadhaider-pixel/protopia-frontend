// src/pages/Terms.jsx
import React from "react";

export default function Terms() {
  const year = new Date().getFullYear();
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-6 py-12">
        <h1 className="text-3xl font-extrabold text-indigo-700 mb-6">Terms of Use</h1>
        <p className="text-sm text-gray-500 mb-10">Last updated: {year}</p>

        <section className="space-y-6 text-gray-800 leading-relaxed">
          <p>
            These Terms govern your access to and use of Protopia (the “Service”). By using the
            Service, you agree to these Terms.
          </p>

          <div>
            <h2 className="text-xl font-semibold text-indigo-700">1. Accounts & eligibility</h2>
            <p className="mt-2">
              You must provide accurate information and keep your login credentials secure.
              Institutional accounts are restricted to approved users.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-indigo-700">2. Use of the Service</h2>
            <ul className="list-disc ml-6 mt-2 space-y-1">
              <li>Do not misuse, reverse-engineer, or attempt unauthorised access.</li>
              <li>Do not upload unlawful, harmful, or infringing content.</li>
              <li>You are responsible for activity under your account.</li>
            </ul>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-indigo-700">3. Intellectual property</h2>
            <p className="mt-2">
              The Service, including AI/VR content, is owned by Protopia or its licensors. You
              receive a limited, non-transferable licence to use the Service during a valid
              subscription.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-indigo-700">4. Assessment content</h2>
            <p className="mt-2">
              You retain rights to your submissions. By submitting content (e.g., essay responses),
              you grant us a licence to process it to deliver the Service and improve our models in
              aggregated/de-identified form.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-indigo-700">5. Subscriptions & payments</h2>
            <p className="mt-2">
              Fees, billing cycles, refunds, and cancellations are described at checkout and in your
              subscription plan. Third-party payment terms apply.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-indigo-700">6. Disclaimer</h2>
            <p className="mt-2">
              The Service is provided “as is”. To the maximum extent permitted by law, we disclaim
              warranties of merchantability, fitness for a particular purpose, and non-infringement.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-indigo-700">7. Limitation of liability</h2>
            <p className="mt-2">
              To the extent permitted by law, our total liability is limited to fees paid in the
              12 months before the event giving rise to the claim. Nothing excludes liability that
              cannot be excluded under applicable law.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-indigo-700">8. Termination</h2>
            <p className="mt-2">
              We may suspend or terminate access for breach of these Terms. You may cancel at any
              time via your account or by contacting support.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-indigo-700">9. Governing law</h2>
            <p className="mt-2">
              These Terms are governed by the laws of New South Wales, Australia, and subject to the
              jurisdiction of its courts.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-indigo-700">10. Contact</h2>
            <p className="mt-2">
              Questions? Email{" "}
              <a href="mailto:support@protopia.ai" className="text-indigo-700 underline">
                support@protopia.ai
              </a>
              .
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
