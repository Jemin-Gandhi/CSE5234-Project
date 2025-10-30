import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

export default function PaymentEntry() {
  const navigate = useNavigate();

  const [paymentInfo, setPaymentInfo] = useState({
    credit_card_number: sessionStorage.getItem('credit_card_number') ?? '',
    expir_date: sessionStorage.getItem('expir_date') ?? '',
    cvvCode: sessionStorage.getItem('cvvCode') ?? '',
    card_holder_name: sessionStorage.getItem('card_holder_name') ?? '',
    billing_address_line1: sessionStorage.getItem('billing_address_line1') ?? '',
    billing_address_line2: sessionStorage.getItem('billing_address_line2') ?? '',
    billing_city: sessionStorage.getItem('billing_city') ?? '',
    billing_state: sessionStorage.getItem('billing_state') ?? '',
    billing_zip: sessionStorage.getItem('billing_zip') ?? ''
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPaymentInfo((prev) => ({...prev, [name]: value}));
    sessionStorage.setItem(name, value);

    if (errors[name])
      setErrors((prev) => ({...prev, [name]: ""}));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!paymentInfo.credit_card_number.trim()) {
      newErrors.credit_card_number = "Credit card number is required";
    } else if (!/^\d{13,19}$/.test(paymentInfo.credit_card_number.replace(/\s+/g, ""))) {
      newErrors.credit_card_number = "Please enter a valid card number (13–19 digits)";
    }

    if (!paymentInfo.expir_date.trim()) {
      newErrors.expir_date = "Expiration date is required";
    } else if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(paymentInfo.expir_date)) {
      newErrors.expir_date = "Use MM/YY format";
    }

    if (!paymentInfo.cvvCode.trim()) {
      newErrors.cvvCode = "CVV is required";
    } else if (!/^\d{3,4}$/.test(paymentInfo.cvvCode)) {
      newErrors.cvvCode = "CVV must be 3 or 4 digits";
    }

    if (!paymentInfo.card_holder_name.trim()) {
      newErrors.card_holder_name = "Cardholder name is required";
    }

    if (!paymentInfo.billing_address_line1.trim()) {
      newErrors.billing_address_line1 = "Billing address is required";
    }

    if (!paymentInfo.billing_city.trim()) {
      newErrors.billing_city = "City is required";
    }

    if (!paymentInfo.billing_state.trim()) {
      newErrors.billing_state = "State is required";
    }

    if (!paymentInfo.billing_zip.trim()) {
      newErrors.billing_zip = "ZIP code is required";
    } else if (!/^\d{5}(-\d{4})?$/.test(paymentInfo.billing_zip)) {
      newErrors.billing_zip = "Please enter a valid ZIP code (12345 or 12345-6789)";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      console.log("Payment details saved:", paymentInfo);
      navigate("/purchase/shippingEntry");
    }
  };

  return (
    <div className="container mt-4 mb-5">
      <div className="row justify-content-center">
        <div className="col-md-8 col-lg-6">
          <div className="card shadow">
            <div className="card-header bg-danger text-white">
              <h2 className="card-title text-center mb-0">Payment Information</h2>
            </div>

            <div className="card-body">
              <form onSubmit={handleSubmit}>
                {/* Cardholder Name */}
                <div className="mb-3">
                  <label htmlFor="card_holder_name" className="form-label">
                    Cardholder Name <span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    className={`form-control ${errors.card_holder_name ? "is-invalid" : ""}`}
                    id="card_holder_name"
                    name="card_holder_name"
                    value={paymentInfo.card_holder_name}
                    onChange={handleChange}
                    placeholder="John Doe"
                  />
                  {errors.card_holder_name && (<div className="invalid-feedback">{errors.card_holder_name}</div>)}
                </div>

                {/* Credit Card Number */}
                <div className="mb-3">
                  <label htmlFor="credit_card_number" className="form-label">
                    Credit Card Number <span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    className={`form-control ${errors.credit_card_number ? "is-invalid" : ""}`}
                    id="credit_card_number"
                    name="credit_card_number"
                    value={paymentInfo.credit_card_number}
                    onChange={handleChange}
                    placeholder="1234 5678 9012 3456"
                  />
                  {errors.credit_card_number && (<div className="invalid-feedback">{errors.credit_card_number}</div>)}
                </div>

                {/* Expiration Date & CVV */}
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label htmlFor="expir_date" className="form-label">
                      Expiration Date <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      className={`form-control ${errors.expir_date ? "is-invalid" : ""}`}
                      id="expir_date"
                      name="expir_date"
                      value={paymentInfo.expir_date}
                      onChange={handleChange}
                      placeholder="MM/YY"
                    />
                    {errors.expir_date && (<div className="invalid-feedback">{errors.expir_date}</div>)}
                  </div>

                  <div className="col-md-6 mb-3">
                    <label htmlFor="cvvCode" className="form-label">
                      CVV <span className="text-danger">*</span>
                    </label>
                    <input
                      type="password"
                      className={`form-control ${errors.cvvCode ? "is-invalid" : ""}`}
                      id="cvvCode"
                      name="cvvCode"
                      value={paymentInfo.cvvCode}
                      onChange={handleChange}
                      placeholder="123"
                      maxLength="4"
                    />
                    {errors.cvvCode && (<div className="invalid-feedback">{errors.cvvCode}</div>)}
                  </div>
                </div>

                {/* Billing Address Section */}
                <hr className="my-4" />
                <h5 className="mb-3">Billing Address</h5>

                {/* Billing Address Line 1 */}
                <div className="mb-3">
                  <label htmlFor="billing_address_line1" className="form-label">
                    Address Line 1 <span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    className={`form-control ${errors.billing_address_line1 ? "is-invalid" : ""}`}
                    id="billing_address_line1"
                    name="billing_address_line1"
                    value={paymentInfo.billing_address_line1}
                    onChange={handleChange}
                    placeholder="123 Main St"
                  />
                  {errors.billing_address_line1 && (<div className="invalid-feedback">{errors.billing_address_line1}</div>)}
                </div>

                {/* Billing Address Line 2 */}
                <div className="mb-3">
                  <label htmlFor="billing_address_line2" className="form-label">
                    Address Line 2
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="billing_address_line2"
                    name="billing_address_line2"
                    value={paymentInfo.billing_address_line2}
                    onChange={handleChange}
                    placeholder="Apt, Suite, etc."
                  />
                </div>

                {/* Billing City, State, ZIP */}
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label htmlFor="billing_city" className="form-label">
                      City <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      className={`form-control ${errors.billing_city ? "is-invalid" : ""}`}
                      id="billing_city"
                      name="billing_city"
                      value={paymentInfo.billing_city}
                      onChange={handleChange}
                      placeholder="City"
                    />
                    {errors.billing_city && (<div className="invalid-feedback">{errors.billing_city}</div>)}
                  </div>

                  <div className="col-md-3 mb-3">
                    <label htmlFor="billing_state" className="form-label">
                      State <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      className={`form-control ${errors.billing_state ? "is-invalid" : ""}`}
                      id="billing_state"
                      name="billing_state"
                      value={paymentInfo.billing_state}
                      onChange={handleChange}
                      placeholder="NY"
                      maxLength="2"
                    />
                    {errors.billing_state && (<div className="invalid-feedback">{errors.billing_state}</div>)}
                  </div>

                  <div className="col-md-3 mb-3">
                    <label htmlFor="billing_zip" className="form-label">
                      ZIP <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      className={`form-control ${errors.billing_zip ? "is-invalid" : ""}`}
                      id="billing_zip"
                      name="billing_zip"
                      value={paymentInfo.billing_zip}
                      onChange={handleChange}
                      placeholder="12345"
                    />
                    {errors.billing_zip && (<div className="invalid-feedback">{errors.billing_zip}</div>)}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="d-flex justify-content-between mt-4">
                  <button
                    type="button"
                    className="btn btn-outline-secondary"
                    onClick={() => navigate("/purchase")}
                  >
                    ← Back to Purchase
                  </button>

                  <button type="submit" className="btn btn-danger">
                    Continue to Shipping →
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
