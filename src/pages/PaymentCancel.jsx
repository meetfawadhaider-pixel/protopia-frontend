import React from "react";
import { Link } from "react-router-dom";

export default function PaymentCancel() {
  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-12 bg-gradient-to-br from-gray-900 via-slate-900 to-black text-white">
      <div className="max-w-lg w-full bg-white/10 border border-white/10 backdrop-blur-md p-8 rounded-2xl shadow-xl text-center">
        <h1 className="text-3xl font-bold mb-2">Payment Cancelled</h1>
        <p className="opacity-90">
          Your checkout session was cancelled. You can choose a plan again or log in if you’ve already paid.
        </p>

        <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            to="/pricing"
            className="px-5 py-2 rounded-xl bg-white text-black hover:bg-gray-200"
          >
            Back to Plans
          </Link>
          <Link
            to="/login"
            className="px-5 py-2 rounded-xl bg-transparent border border-white/30 hover:bg-white/10"
          >
            Go to Login
          </Link>
        </div>
      </div>
    </div>
  );
}
