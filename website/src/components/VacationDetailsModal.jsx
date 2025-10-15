import React from "react";
import { Modal, Button, Badge, Alert, Carousel } from "react-bootstrap";

const VacationDetailsModal = ({ show, onHide, product }) => {
  if (!product) return null;

  return (
    <Modal show={show} onHide={onHide} size="lg" centered>
      <Modal.Header closeButton closeVariant="white" className="bg-danger text-white">
        <Modal.Title>{product.name}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {/* Image Carousel in Modal */}
        <Carousel className="mb-4" interval={null}>
          {product.images.map((image, imgIndex) => (
            <Carousel.Item key={imgIndex}>
              <img
                src={image}
                alt={`${product.name} - Image ${imgIndex + 1}`}
                className="d-block w-100"
                style={{ objectFit: "cover", maxHeight: "400px" }}
              />
            </Carousel.Item>
          ))}
        </Carousel>

        {/* Package Details */}
        <div className="mb-3">
          <h5 className="text-danger">
            <i className="bi bi-geo-alt-fill"></i> {product.location}
          </h5>
          <p className="text-muted mb-2">
            <i className="bi bi-calendar3"></i> Duration: {product.duration}
          </p>
          <p className="text-muted mb-2">
            <i className="bi bi-calendar-event-fill"></i> Departure Date: <strong>{product.departureDate}</strong>
          </p>
          <p className="text-muted mb-0">
            <i className="bi bi-ticket-perforated"></i> Available Tickets: {product.availableTickets}
          </p>
        </div>

        <div className="mb-4">
          <h5 className="text-danger">About This Package</h5>
          <p>{product.description}</p>
        </div>

        <div className="mb-4">
          <h5 className="text-danger">What's Included</h5>
          <ul className="list-unstyled">
            {product.includes.map((item, idx) => (
              <li key={idx} className="mb-2">
                <i className="bi bi-check-circle-fill text-success me-2"></i>
                {item}
              </li>
            ))}
          </ul>
        </div>

        <div className="mb-3">
          <h5 className="text-danger">Highlights</h5>
          <div className="row">
            {product.highlights.map((highlight, idx) => (
              <div key={idx} className="col-md-6 mb-2">
                <Badge 
                  bg="light" 
                  text="dark" 
                  className="w-100 text-start p-2"
                  style={{ 
                    fontSize: '0.85rem',
                    whiteSpace: 'normal',
                    wordBreak: 'break-word'
                  }}
                >
                  <i className="bi bi-star-fill text-warning me-2"></i>
                  {highlight}
                </Badge>
              </div>
            ))}
          </div>
        </div>

        <Alert variant="info" className="mt-4">
          <strong>Price: ${product.price.toFixed(2)} per person</strong>
        </Alert>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default VacationDetailsModal;
