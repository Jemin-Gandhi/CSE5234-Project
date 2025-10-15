import React from "react";
import { Carousel, Button, Badge } from "react-bootstrap";

const VacationCard = ({ product, index, currentQty, onShowDetails, onIncrement, onDecrement, onQuantityChange }) => {
  return (
    <div className="col-12 col-md-6 col-lg-4">
      <div className="card shadow-sm border-danger h-100 d-flex flex-column">
        {/* Image Carousel */}
        <Carousel 
          interval={null} 
          indicators={true}
          style={{ maxHeight: "250px" }}
        >
          {product.images.map((image, imgIndex) => (
            <Carousel.Item key={imgIndex}>
              <img
                src={image}
                alt={`${product.name} - Image ${imgIndex + 1}`}
                className="d-block w-100"
                style={{ 
                  objectFit: "cover", 
                  height: "250px",
                  cursor: "pointer"
                }}
                onClick={() => onShowDetails(product)}
              />
            </Carousel.Item>
          ))}
        </Carousel>

        {/* Availability Badge */}
        <div className="position-relative">
          <Badge 
            bg={product.availableTickets > 10 ? "success" : product.availableTickets > 5 ? "warning" : "danger"}
            className="position-absolute top-0 end-0 m-2"
            style={{ transform: "translateY(-100%)" }}
          >
            {product.availableTickets} tickets available
          </Badge>
        </div>

        {/* Card Body */}
        <div className="card-body d-flex flex-column">
          <div className="mb-3">
            <h5 className="card-title text-danger mb-1">{product.name}</h5>
            <p className="text-muted small mb-1">
              <i className="bi bi-geo-alt"></i> {product.location}
            </p>
            <p className="text-muted small mb-1">
              <i className="bi bi-calendar"></i> {product.duration}
            </p>
            <p className="text-muted small mb-0">
              <i className="bi bi-calendar-event"></i> Departs: {product.departureDate}
            </p>
          </div>

          <p className="card-text text-muted small flex-grow-1">
            {product.shortDescription}
          </p>

          {/* Price and Details Button */}
          <div className="d-flex justify-content-between align-items-center mb-3">
            <div>
              <span className="h4 text-danger mb-0">
                ${product.price.toFixed(2)}
              </span>
              <span className="text-muted small"> / person</span>
            </div>
            <Button 
              variant="outline-danger" 
              size="sm"
              onClick={() => onShowDetails(product)}
            >
              View Details
            </Button>
          </div>

          {/* Quantity Selector */}
          <div className="mt-auto">
            <label className="form-label small text-muted text-center d-block">
              Number of Tickets:
            </label>
            <div className="d-flex align-items-center justify-content-center gap-2">
              <Button 
                variant="outline-danger"
                size="sm"
                onClick={() => onDecrement(index)}
                disabled={currentQty === 0}
              >
                −
              </Button>
              <input
                type="number"
                min="0"
                max={product.availableTickets}
                className="form-control text-center"
                style={{ width: "70px" }}
                value={currentQty}
                onChange={(e) => onQuantityChange(index, e.target.value)}
              />
              <Button 
                variant="outline-danger"
                size="sm"
                onClick={() => onIncrement(index)}
                disabled={currentQty >= product.availableTickets}
              >
                +
              </Button>
            </div>
            {currentQty > 0 && (
              <small className="text-success d-block mt-1 text-center">
                Subtotal: ${(product.price * currentQty).toFixed(2)}
              </small>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VacationCard;
