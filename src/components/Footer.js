import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white py-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">Grad-Connect</h3>
            <p className="text-sm">Connecting graduates with opportunities</p>
          </div>
          <div>
            <h4 className="text-md font-semibold mb-4">For Graduates</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/job-search" className="text-sm hover:text-blue-300">
                  Find Jobs
                </Link>
              </li>
              <li>
                <Link
                  to="/resume-builder"
                  className="text-sm hover:text-blue-300"
                >
                  Resume Builder
                </Link>
              </li>
              <li>
                <Link
                  to="/career-resources"
                  className="text-sm hover:text-blue-300"
                >
                  Career Resources
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-md font-semibold mb-4">For Employers</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/post-job" className="text-sm hover:text-blue-300">
                  Post a Job
                </Link>
              </li>
              <li>
                <Link
                  to="/employer-resources"
                  className="text-sm hover:text-blue-300"
                >
                  Employer Resources
                </Link>
              </li>
              <li>
                <Link to="/pricing" className="text-sm hover:text-blue-300">
                  Pricing
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-md font-semibold mb-4">Connect With Us</h4>
            <ul className="space-y-2">
              <li>
                <a
                  href="https://twitter.com/gradconnect"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm hover:text-blue-300"
                >
                  Twitter
                </a>
              </li>
              <li>
                <a
                  href="https://linkedin.com/company/gradconnect"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm hover:text-blue-300"
                >
                  LinkedIn
                </a>
              </li>
              <li>
                <a
                  href="mailto:support@gradconnect.com"
                  className="text-sm hover:text-blue-300"
                >
                  Email Us
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-gray-700 text-center text-sm">
          <p>
            &copy; {new Date().getFullYear()} Grad-Connect. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
