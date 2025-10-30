import React, { useEffect, useRef } from "react";
import { Link } from "react-router-dom";

export default function Navbar({ rightSlot = null }) {
  const navbarRef = useRef(null);

  // Close the navbar collapse
  const closeNavbar = () => {
    const navbarCollapse = navbarRef.current?.querySelector(".navbar-collapse.show");
    const toggler = navbarRef.current?.querySelector(".navbar-toggler");
    if (navbarCollapse && toggler) {
      toggler.click();
    }
  };

  // ✅ Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      const navbarCollapse = navbarRef.current?.querySelector(".navbar-collapse.show");
      const toggler = navbarRef.current?.querySelector(".navbar-toggler");
      if (navbarCollapse && !navbarRef.current.contains(event.target)) {
        // Manually trigger Bootstrap collapse
        toggler.click();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <nav
      ref={navbarRef}
      className="navbar navbar-expand-lg navbar-dark bg-danger fixed-top shadow-sm"
    >
      <div className="container-fluid">
        {/* Brand */}
        <Link className="navbar-brand fw-semibold" to="/">
          Vacation Sales
        </Link>

        {/* Right controls (Cart + Hamburger) */}
        <div className="d-flex align-items-center">
          {/* Hamburger */}
          <button
            className="navbar-toggler border-0"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
            aria-controls="navbarNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon" />
          </button>

          {/* Cart visible on mobile */}
          <div className="ms-2 d-lg-none">{rightSlot}</div>
        </div>

        {/* Collapsing links */}
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto mb-2 mb-lg-0 align-items-lg-center">
            <li className="nav-item">
              <Link className="nav-link px-2" to="/" onClick={closeNavbar}>
                Home
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link px-2" to="/purchase" onClick={closeNavbar}>
                Vacations
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link px-2" to="/contact" onClick={closeNavbar}>
                Contact Us
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link px-2" to="/about" onClick={closeNavbar}>
                About Us
              </Link>
            </li>

            {/* Cart on desktop */}
            <li className="nav-item ms-lg-3 d-none d-lg-flex">{rightSlot}</li>
          </ul>
        </div>
      </div>
    </nav>
  );
}
