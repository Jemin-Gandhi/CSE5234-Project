import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

export default function PaymentEntry() {
  const navigate = useNavigate();

  const [paymentInfo, setPaymentInfo] = useState({
    credit_card_number: sessionStorage.getItem('credit_card_number') ?? '',
    expir_date: sessionStorage.getItem('expir_date') ?? '',
    cvvCode: sessionStorage.getItem('cvvCode') ?? '',
    card_holder_name: sessionStorage.getItem('card_holder_name') ?? ''
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
