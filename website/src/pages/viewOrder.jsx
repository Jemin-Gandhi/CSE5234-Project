import React from "react";
import { useNavigate } from "react-router-dom";
import { useStore } from "../store/Store";
import "bootstrap/dist/css/bootstrap.min.css";

export default function ViewOrder() {
  const navigate = useNavigate();
  const { cart, cartTotal } = useStore();

  const items = cart;
  const total = cartTotal;

  const payment = {
    'credit_card_number': sessionStorage.getItem('credit_card_number') ?? '',
    'expir_date': sessionStorage.getItem('expir_date') ?? '',
    'cvvCode': sessionStorage.getItem('cvvCode') ?? '',
    'card_holder_name': sessionStorage.getItem('card_holder_name') ?? ''
  }

  const shipping = {
    'name': sessionStorage.getItem('name') ?? '',
    'addressLine1': sessionStorage.getItem('addressLine1') ?? '',
    'addressLine2': sessionStorage.getItem('addressLine2') ?? '',
    'city': sessionStorage.getItem('city') ?? '',
    'state': sessionStorage.getItem('state') ?? '',
    'zip': sessionStorage.getItem('zip') ?? ''
  }

  return (
    <div className="container mt-5 mb-5">
      <div className="row justify-content-center">
        <div className="col-md-10 col-lg-8">
          <div className="card shadow">
            <div className="card-header bg-danger text-white">
              <h2 className="text-center mb-0">View Order</h2>
            </div>

            <div className="card-body">
              <p className="text-center text-muted mb-4">
                Review your order details before final confirmation.
              </p>

              {/* Shipping Information */}
              <h4 className="text-danger mb-3">Shipping Information</h4>
              <div className="border rounded p-3 mb-4 bg-light">
                <p><strong>Name:</strong> {shipping.name || "N/A"}</p>
                <p><strong>Address Line 1:</strong> {shipping.addressLine1 || "N/A"}</p>
                {shipping.addressLine2 && <p><strong>Address Line 2:</strong> {shipping.addressLine2}</p>}
                <p>
                  <strong>City:</strong> {shipping.city || "N/A"}{" "}
                  <strong>State:</strong> {shipping.state || "N/A"}{" "}
                  <strong>ZIP:</strong> {shipping.zip || "N/A"}
                </p>
              </div>

              {/* Payment Information */}
              <h4 className="text-danger mb-3">Payment Information</h4>
              <div className="border rounded p-3 mb-4 bg-light">
                <p><strong>Cardholder Name:</strong> {payment.card_holder_name || "N/A"}</p>
                <p>
                  <strong>Card Number:</strong>{" "}
                  {payment.credit_card_number
                    ? "**** **** **** " + payment.credit_card_number.slice(-4)
                    : "N/A"}
                </p>
                <p><strong>Expiration Date:</strong> {payment.expir_date || "N/A"}</p>
              </div>

              {/* Order Summary */}
              {items.length > 0 && (
                <>
                  <h4 className="text-danger mb-3">Order Summary</h4>
                  <div className="border rounded p-3 mb-4 bg-light">
                    {items.map((item, index) => (
                      <div key={index} className="d-flex justify-content-between mb-2">
                        <span>
                          {item.name} (x{item.quantity})
                        </span>
                        <span>
                          ${(item.price * item.quantity).toFixed(2)}
                        </span>
                      </div>
                    ))}

                    <hr />
                    <div className="d-flex justify-content-between">
                      <strong>Total:</strong>
                      <strong>${total.toFixed(2)}</strong>
                    </div>
                  </div>
                </>
              )}

              {/* Action Buttons */}
              <div className="d-flex justify-content-between mt-4">
                <button
                  type="button"
                  className="btn btn-outline-secondary"
                  onClick={() => navigate("/purchase")}
                >
                  ← Back to Purchase
                </button>

                <button
                  type="button"
                  className="btn btn-danger"
                  onClick={() => navigate("/purchase/viewConfirmation")}
                >
                  Confirm Order →
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
