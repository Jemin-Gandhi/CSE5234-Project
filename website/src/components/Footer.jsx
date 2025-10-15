import React from "react";
import { Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

export default function Footer() {
  return (
    <footer className="footer mt-auto py-3 bg-white border-top border-danger shadow-sm">
      <div className="container d-flex flex-column flex-md-row justify-content-between align-items-center">
        <p className="mb-1 mb-md-0 text-danger fw-semibold">
          © {new Date().getFullYear()} CSE 5234 Group 3. All rights reserved.
        </p>
        <div className="d-flex gap-3">
          <Link to="/purchase" className="text-danger text-decoration-none fw-semibold">
            Home
          </Link>
          <a
            href="https://github.com/Jemin-Gandhi/CSE5234-Project"
            target="_blank"
            rel="noopener noreferrer"
            className="text-danger text-decoration-none fw-semibold"
          >
            GitHub
          </a>
        </div>
      </div>
    </footer>
  );
}
