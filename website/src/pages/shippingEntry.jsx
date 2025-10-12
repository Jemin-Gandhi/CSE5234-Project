import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

export default function ShippingEntry() {
  const navigate = useNavigate();

  const [shippingDetails, setShippingDetails] = useState({
    name: sessionStorage.getItem('name') ?? '',
    addressLine1: sessionStorage.getItem('addressLine1') ?? '',
    addressLine2: sessionStorage.getItem('addressLine2') ?? '',
    city: sessionStorage.getItem('city') ?? '',
    state: sessionStorage.getItem('state') ?? '',
    zip: sessionStorage.getItem('zip') ?? '',
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setShippingDetails((prev) => ({...prev, [name]: value}));
    sessionStorage.setItem(name, value);

    if (errors[name])
      setErrors((prev) => ({...prev, [name]: "",}));
  };


  const validateForm = () => {
    const newErrors = {};

    if (!shippingDetails.name.trim())
      newErrors.name = "Name is required";
    if (!shippingDetails.addressLine1.trim())
      newErrors.addressLine1 = "Address Line 1 is required";
    if (!shippingDetails.city.trim())
      newErrors.city = "City is required";
    if (!shippingDetails.state.trim())
      newErrors.state = "State is required";

    if (!shippingDetails.zip.trim())
      newErrors.zip = "ZIP code is required";
    else if (!/^\d{5}(-\d{4})?$/.test(shippingDetails.zip))
      newErrors.zip = "Please enter a valid ZIP code (12345 or 12345-6789)";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };


  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      console.log("Shipping details saved:", shippingDetails);
      navigate("/purchase/viewOrder");
    }
  };


  return (
    <div className="container mt-4 mb-5">
      <div className="row justify-content-center">
        <div className="col-md-8 col-lg-6">
          <div className="card shadow">
            <div className="card-header bg-danger text-white">
              <h2 className="card-title text-center mb-0">Shipping Information</h2>
            </div>

            <div className="card-body">
              <form onSubmit={handleSubmit}>
                {/* Name */}
                <div className="mb-3">
                  <label htmlFor="name" className="form-label">
                    Full Name <span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    className={`form-control ${errors.name ? "is-invalid" : ""}`}
                    value={shippingDetails.name}
                    onChange={handleChange}
                    placeholder="John Doe"
                  />
                  {errors.name && <div className="invalid-feedback">{errors.name}</div>}
                </div>

                {/* Address Line 1 */}
                <div className="mb-3">
                  <label htmlFor="addressLine1" className="form-label">
                    Address Line 1 <span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    id="addressLine1"
                    name="addressLine1"
                    className={`form-control ${errors.addressLine1 ? "is-invalid" : ""}`}
                    value={shippingDetails.addressLine1}
                    onChange={handleChange}
                    placeholder="123 Main St"
                  />
                  {errors.addressLine1 && (
                    <div className="invalid-feedback">{errors.addressLine1}</div>
                  )}
                </div>

                {/* Address Line 2 */}
                <div className="mb-3">
                  <label htmlFor="addressLine2" className="form-label">
                    Address Line 2
                  </label>
                  <input
                    type="text"
                    id="addressLine2"
                    name="addressLine2"
                    className="form-control"
                    value={shippingDetails.addressLine2}
                    onChange={handleChange}
                    placeholder="Apt, Suite, etc."
                  />
                </div>

                {/* City, State, ZIP */}
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label htmlFor="city" className="form-label">
                      City <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      id="city"
                      name="city"
                      className={`form-control ${errors.city ? "is-invalid" : ""}`}
                      value={shippingDetails.city}
                      onChange={handleChange}
                      placeholder="City"
                    />
                    {errors.city && <div className="invalid-feedback">{errors.city}</div>}
                  </div>

                  <div className="col-md-3 mb-3">
                    <label htmlFor="state" className="form-label">
                      State <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      id="state"
                      name="state"
                      className={`form-control ${errors.state ? "is-invalid" : ""}`}
                      value={shippingDetails.state}
                      onChange={handleChange}
                      placeholder="NY"
                      maxLength="2"
                    />
                    {errors.state && <div className="invalid-feedback">{errors.state}</div>}
                  </div>

                  <div className="col-md-3 mb-3">
                    <label htmlFor="zip" className="form-label">
                      ZIP <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      id="zip"
                      name="zip"
                      className={`form-control ${errors.zip ? "is-invalid" : ""}`}
                      value={shippingDetails.zip}
                      onChange={handleChange}
                      placeholder="12345"
                    />
                    {errors.zip && <div className="invalid-feedback">{errors.zip}</div>}
                  </div>
                </div>

                {/* Buttons */}
                <div className="d-flex justify-content-between mt-4">
                  <button
                    type="button"
                    className="btn btn-outline-secondary"
                    onClick={() => navigate("/purchase/paymentEntry")}
                  >
                    ← Back to Payment
                  </button>

                  <button type="submit" className="btn btn-danger">
                    Review Order →
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
