import React from "react";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-200 text-center py-10 mt-20 shadow-inner">
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="text-lg font-semibold mb-4">Connect with Us</h2>

        <div className="space-x-6 mb-4 text-xl">
          <a
            href="https://facebook.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-400 rounded"
            aria-label="Follow Protopia on Facebook"
          >
            Facebook
          </a>
          <a
            href="https://twitter.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-400 rounded"
            aria-label="Follow Protopia on Twitter"
          >
            Twitter
          </a>
          <a
            href="https://linkedin.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-400 rounded"
            aria-label="Follow Protopia on LinkedIn"
          >
            LinkedIn
          </a>
        </div>

        <p className="text-sm mb-2">
          &copy; {new Date().getFullYear()} Protopia. All rights reserved.
        </p>

        <div className="space-x-6 text-sm">
          <a
            href="/about"
            className="hover:underline focus:outline-none focus:ring-2 focus:ring-indigo-400 rounded"
          >
            About
          </a>
          <a
            href="/privacy"
            className="hover:underline focus:outline-none focus:ring-2 focus:ring-indigo-400 rounded"
          >
            Privacy
          </a>
          <a
            href="/terms"
            className="hover:underline focus:outline-none focus:ring-2 focus:ring-indigo-400 rounded"
          >
            Terms
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
