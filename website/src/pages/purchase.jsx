import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { useStore } from "../store/Store";
import VacationCard from "../components/VacationCard";
import VacationDetailsModal from "../components/VacationDetailsModal";

const Purchase = () => {
  const navigate = useNavigate();
  const { catalog, cart, updateQty, loading } = useStore();
  
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const handleShowDetails = (product) => {
    setSelectedProduct(product);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedProduct(null);
  };

  const changeValue = (index, value) => {
    const id = index + 1;
    const product = catalog[index];
    const newValue = Math.max(Number(value) || 0, 0);
    
    // Check if quantity exceeds available tickets
    if (newValue > product.availableTickets) {
      alert(`Only ${product.availableTickets} tickets available for this vacation package.`);
      return;
    }
    
    updateQty(id, newValue);
  };

  const incrementQty = (index) => {
    const currentQty = cart[index]?.quantity || 0;
    changeValue(index, currentQty + 1);
  };

  const decrementQty = (index) => {
    const currentQty = cart[index]?.quantity || 0;
    if (currentQty > 0) {
      changeValue(index, currentQty - 1);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Check if at least one item has been selected
    const hasItems = cart.some(item => item.quantity > 0);
    if (!hasItems) {
      alert("Please select at least one vacation package to continue.");
      return;
    }
    
    navigate("/purchase/paymentEntry");
  };

  if (loading) {
    return (
      <div className="container mt-4 mb-5">
        <div className="text-center py-5">
          <div className="spinner-border text-danger" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-3 text-muted">Loading vacation packages...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-4 mb-5">
      <div className="text-center mb-4">
        <h1 className="text-danger">Book Your Dream Vacation</h1>
        <p className="text-muted">Select tickets for your perfect getaway</p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="row g-4">
          {catalog.length === 0 ? (
            <div className="col-12 text-center py-5">
              <p className="text-muted">No vacation packages available at the moment.</p>
            </div>
          ) : (
            catalog.map((product, index) => {
              const currentQty = cart[index]?.quantity || 0;
              
              return (
                <VacationCard
                  key={product.id}
                  product={product}
                  index={index}
                  currentQty={currentQty}
                  onShowDetails={handleShowDetails}
                  onIncrement={incrementQty}
                  onDecrement={decrementQty}
                  onQuantityChange={changeValue}
                />
              );
            })
          )}
        </div>

        {/* Total and Submit */}
        <div className="text-center mt-5">
          {cart.some(item => item.quantity > 0) && (
            <div className="mb-3">
              <h4 className="text-dark">
                Total: $
                {cart.reduce((total, item, index) => {
                  return total + (catalog[index].price * item.quantity);
                }, 0).toFixed(2)}
              </h4>
              <p className="text-muted small">
                {cart.reduce((total, item) => total + item.quantity, 0)} ticket(s) selected
              </p>
            </div>
          )}
          <button 
            type="submit" 
            className="btn btn-danger btn-lg px-5"
            disabled={!cart.some(item => item.quantity > 0)}
          >
            Proceed to Payment
          </button>
        </div>
      </form>

      {/* Details Modal */}
      <VacationDetailsModal
        show={showModal}
        onHide={handleCloseModal}
        product={selectedProduct}
      />
    </div>
  );
};

export default Purchase;
