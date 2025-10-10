import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import PRODUCTS from "../data/products";
import "bootstrap/dist/css/bootstrap.min.css";

const Purchase = () => {
  const [order, setOrder] = useState({
    buyQuantity: Array(PRODUCTS.length).fill(""),
    credit_card_number: '',
    expir_date: '',
    cvvCode: '',
    card_holder_name: '',
    address_1: '',
    address_2: '',
    city: '',
    state: '',
    zip: '',
  });

  const navigate = useNavigate();

  const handleChange = (index, value) => {
    const updatedQuantities = [...order.buyQuantity];
    updatedQuantities[index] = value === "" ? "" : Number(value);

    setOrder((prev) => ({ ...prev, buyQuantity: updatedQuantities }));
  };

  const increment = (index) => {
    const updated = [...order.buyQuantity];
    updated[index] = (Number(updated[index]) || 0) + 1;
    setOrder((prev) => ({ ...prev, buyQuantity: updated }));
  };

  const decrement = (index) => {
    const updated = [...order.buyQuantity];
    const current = Number(updated[index]) || 0;
    updated[index] = current > 0 ? current - 1 : 0;
    setOrder((prev) => ({ ...prev, buyQuantity: updated }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
  
    // Build an items array combining PRODUCTS and selected quantities
    const selectedItems = PRODUCTS
      .map((product, index) => ({
        name: product.name,
        price: product.price,
        quantity: Number(order.buyQuantity[index]) || 0,
      }))
      .filter(item => item.quantity > 0); // Only include purchased items
  
    const fullOrder = { ...order, items: selectedItems };
  
    console.log("Full order:", fullOrder);
  
    navigate("/purchase/paymentEntry", { state: { order: fullOrder } });
  };

  return (
    <div className="container mt-2 mb-5">
      <h1 className="text-center text-danger mb-4">Purchase</h1>

      <form onSubmit={handleSubmit} className="row g-4">
        {PRODUCTS.map((product, index) => (
          <div key={product.id} className="col-12 col-md-6 col-lg-4">
            <div className="card shadow-sm border-danger h-100 d-flex flex-column">
              {/* Image */}
              <img
                src={product.img}
                alt={product.name}
                className="card-img-top"
                style={{ objectFit: "cover", height: "180px" }}
              />

              {/* Card Content */}
              <div className="card-body d-flex flex-column justify-content-between">
                {/* Top Row: Name + Price */}
                <div className="d-flex justify-content-between align-items-start mb-2">
                  <h5 className="card-title text-danger mb-0">{product.name}</h5>
                  <p className="fw-bold text-dark mb-0">
                    ${product.price.toFixed(2)}
                  </p>
                </div>

                {/* Bottom Row: Description + Quantity */}
                <div className="d-flex justify-content-between align-items-end mt-auto">
                  <p className="card-text text-muted mb-0" style={{ maxWidth: "60%" }}>
                    {product.description}
                  </p>

                  <div className="d-flex align-items-center gap-2">
                    <button
                      type="button"
                      className="btn btn-outline-danger btn-sm"
                      onClick={() => decrement(index)}
                    >
                      −
                    </button>
                    <input
                      type="number"
                      min="0"
                      className="form-control text-center"
                      style={{ width: "60px" }}
                      value={order.buyQuantity[index]}
                      onChange={(e) => handleChange(index, e.target.value)}
                    />
                    <button
                      type="button"
                      className="btn btn-outline-danger btn-sm"
                      onClick={() => increment(index)}
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* Submit Button */}
        <div className="text-center mt-4">
          <button type="submit" className="btn btn-danger btn-lg px-5">
            Proceed to Payment
          </button>
        </div>
      </form>
    </div>
  );
};

export default Purchase;
