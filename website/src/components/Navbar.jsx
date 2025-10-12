import React from "react";
import { Link } from "react-router-dom";

export default function Navbar({ rightSlot = null }) {
  return (
      <nav className="navbar navbar-expand-lg navbar-dark bg-danger">
        <div className="container-fluid">
          <Link className="navbar-brand fw-semibold" to="/">Sales App</Link>

          <button
              className="navbar-toggler"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#navbarNav"
              aria-controls="navbarNav"
              aria-expanded="false"
              aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon" />
          </button>

          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              <li className="nav-item"><Link className="nav-link" to="/purchase">Products</Link></li>
              <li className="nav-item"><Link className="nav-link" to="/purchase/paymentEntry">Payment</Link></li>
              <li className="nav-item"><Link className="nav-link" to="/purchase/shippingEntry">Shipping</Link></li>
              <li className="nav-item"><Link className="nav-link" to="/purchase/viewOrder">View Order</Link></li>
            </ul>

            <div className="d-flex align-items-center gap-2">
              {rightSlot}
            </div>
          </div>
        </div>
      </nav>
  );
}
