import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useStore } from "../store/Store";
import orderService from "../services/orderService";
import "bootstrap/dist/css/bootstrap.min.css";

export default function ViewOrder() {
  const navigate = useNavigate();
  const { cart, cartTotal } = useStore();
  const [submitting, setSubmitting] = useState(false);

  const items = cart;
  const total = cartTotal;

  const payment = {
    'credit_card_number': sessionStorage.getItem('credit_card_number') ?? '',
    'expir_date': sessionStorage.getItem('expir_date') ?? '',
    'cvvCode': sessionStorage.getItem('cvvCode') ?? '',
    'card_holder_name': sessionStorage.getItem('card_holder_name') ?? '',
    'billing_address_line1': sessionStorage.getItem('billing_address_line1') ?? '',
    'billing_address_line2': sessionStorage.getItem('billing_address_line2') ?? '',
    'billing_city': sessionStorage.getItem('billing_city') ?? '',
    'billing_state': sessionStorage.getItem('billing_state') ?? '',
    'billing_zip': sessionStorage.getItem('billing_zip') ?? ''
  }

  const shipping = {
    'name': sessionStorage.getItem('name') ?? '',
    'addressLine1': sessionStorage.getItem('addressLine1') ?? '',
    'addressLine2': sessionStorage.getItem('addressLine2') ?? '',
    'city': sessionStorage.getItem('city') ?? '',
    'state': sessionStorage.getItem('state') ?? '',
    'zip': sessionStorage.getItem('zip') ?? ''
  }

  const handleConfirmOrder = async () => {
    setSubmitting(true);
    
    try {
      // Prepare order data for Lambda
      const orderData = {
        items: cart
          .filter(item => item.quantity > 0)
          .map(item => ({
            id: item.id,
            name: item.name,
            quantity: item.quantity,
            price: item.price
          })),
        payment: payment,
        shipping: shipping
      };

      // Call order processing Lambda
      const result = await orderService.submitOrder(orderData);
      
      // Store confirmation number
      sessionStorage.setItem('confirmation_number', result.confirmation_number);
      sessionStorage.setItem('order_items', JSON.stringify(result.items));
      
      // Navigate to confirmation
      navigate("/purchase/viewConfirmation");
      
    } catch (error) {
      console.error('Order submission error:', error);
      
      try {
        const errorObj = JSON.parse(error.message);
        
        if (errorObj.type === 'INSUFFICIENT_INVENTORY') {
          // Show detailed error about which items are insufficient
          const itemsList = errorObj.items
            .map(item => `${item.name}: requested ${item.requested}, available ${item.available}`)
            .join('\n');
          alert(`Unable to complete order. Insufficient inventory:\n\n${itemsList}`);
        } else if (errorObj.type === 'VALIDATION_ERROR') {
          alert(`Order validation failed: ${errorObj.message}`);
        } else {
          alert(`Order failed: ${errorObj.message}`);
        }
      } catch (parseError) {
        // Fallback for non-JSON errors
        alert(`Order failed: ${error.message}`);
      }
      
    } finally {
      setSubmitting(false);
    }
  };

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
                <p className="mb-0"><strong>Expiration Date:</strong> {payment.expir_date || "N/A"}</p>
              </div>

              {/* Billing Address */}
              <h4 className="text-danger mb-3">Billing Address</h4>
              <div className="border rounded p-3 mb-4 bg-light">
                <p><strong>Name:</strong> {payment.card_holder_name || "N/A"}</p>
                <p><strong>Address Line 1:</strong> {payment.billing_address_line1 || "N/A"}</p>
                {payment.billing_address_line2 && <p><strong>Address Line 2:</strong> {payment.billing_address_line2}</p>}
                <p className="mb-0">
                  <strong>City:</strong> {payment.billing_city || "N/A"}{" "}
                  <strong>State:</strong> {payment.billing_state || "N/A"}{" "}
                  <strong>ZIP:</strong> {payment.billing_zip || "N/A"}
                </p>
              </div>

              {/* Order Summary */}
              {items.length > 0 && (
                <>
                  <h4 className="text-danger mb-3">Order Summary</h4>
                  <div className="border rounded p-3 mb-4 bg-light">
                    {items.filter((item) => item.quantity > 0).map((item, index) => (
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
                  disabled={submitting}
                >
                  ← Back to Purchase
                </button>

                <button
                  type="button"
                  className="btn btn-danger"
                  onClick={handleConfirmOrder}
                  disabled={submitting}
                >
                  {submitting ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                      Processing...
                    </>
                  ) : (
                    'Confirm Order →'
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
