import React from "react";
import { useNavigate } from "react-router-dom";
import PRODUCTS from "../data/products";
import "bootstrap/dist/css/bootstrap.min.css";
import { useStore } from "../store/Store";

const Purchase = () => {
  const navigate = useNavigate();

  const { cart, updateQty } = useStore();
  console.log(cart);
  const changeValue = (index, value) => {
    const id = index + 1;
    const newValue = Math.max(Number(value), 0);
    updateQty(id, newValue);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate("/purchase/paymentEntry");
  };

  return (
    <div className="container mt-2 mb-5">
      <h1 className="text-center text-danger mb-4">Purchase</h1>

      <form onSubmit={handleSubmit} className="row g-4">
        {PRODUCTS.map((product, index) => (
          <div key={product.id} className="col-12 col-md-6 col-lg-4">
            <div className="card shadow-sm border-danger h-100 d-flex flex-column">
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
                    <input
                      type="number"
                      min="0"
                      className="form-control text-center"
                      style={{ width: "60px" }}
                      value={cart[index].quantity}
                      onChange={(e) => changeValue(index, e.target.value)}
                    />
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
