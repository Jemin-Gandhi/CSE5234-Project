import React from "react";
import { Container, Row, Col, Card, Accordion } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";

export default function ContactUs() {
  return (
    <Container className="py-5">
      <Row>
        <Col>
          <h1 className="text-center mb-5 text-danger">Contact Us</h1>
          <p className="text-center lead mb-5">
            We're here to help with any questions, concerns, or support needs you may have.
          </p>
        </Col>
      </Row>

      <Row className="mb-5">
        <Col md={6} className="mb-4">
          <Card className="h-100 shadow-sm">
            <Card.Header className="bg-danger text-white">
              <h4 className="mb-0">Customer Support</h4>
            </Card.Header>
            <Card.Body>
              <h5>Phone Support</h5>
              <p><strong>1-800-VACATION-1</strong> (1-800-822-2846-1)</p>
              <p>Monday - Friday: 8:00 AM - 8:00 PM EST<br />
              Saturday - Sunday: 9:00 AM - 6:00 PM EST</p>
              
              <h5>Email Support</h5>
              <p><strong>support@vacationdreams.com</strong></p>
              <p>We typically respond within 24 hours</p>
              
              <h5>Live Chat</h5>
              <p>Available 24/7 on our website</p>
            </Card.Body>
          </Card>
        </Col>

        <Col md={6} className="mb-4">
          <Card className="h-100 shadow-sm">
            <Card.Header className="bg-danger text-white">
              <h4 className="mb-0">Returns & Exchanges</h4>
            </Card.Header>
            <Card.Body>
              <h5>Return Policy</h5>
              <p>We offer a 30-day return policy for all vacation packages. Returns must be requested within 30 days of purchase.</p>
              
              <h5>Exchange Policy</h5>
              <p>Package exchanges are available up to 14 days before your scheduled departure date.</p>
              
              <h5>Refund Processing</h5>
              <p>Refunds are processed within 5-7 business days after we receive your return request.</p>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row className="mb-5">
        <Col>
          <Card className="shadow-sm">
            <Card.Header className="bg-danger text-white">
              <h4 className="mb-0">Frequently Asked Questions</h4>
            </Card.Header>
            <Card.Body>
              <Accordion>
                <Accordion.Item eventKey="0">
                  <Accordion.Header>How do I cancel my vacation booking?</Accordion.Header>
                  <Accordion.Body>
                    You can cancel your booking by calling our customer service line at 1-800-VACATION-1 or by emailing us at support@vacationdreams.com. Cancellation policies vary by package type and timing. Please refer to your booking confirmation for specific cancellation terms.
                  </Accordion.Body>
                </Accordion.Item>
                
                <Accordion.Item eventKey="1">
                  <Accordion.Header>What if I need to change my travel dates?</Accordion.Header>
                  <Accordion.Body>
                    Date changes are subject to availability and may incur additional fees. Please contact us at least 48 hours before your scheduled departure. Changes made within 48 hours may not be possible due to vendor policies.
                  </Accordion.Body>
                </Accordion.Item>
                
                <Accordion.Item eventKey="2">
                  <Accordion.Header>How do I get a refund for my vacation package?</Accordion.Header>
                  <Accordion.Body>
                    Refunds are processed according to our 30-day return policy. To request a refund, contact our customer service team with your booking reference number. Refunds will be issued to the original payment method within 5-7 business days.
                  </Accordion.Body>
                </Accordion.Item>
                
                <Accordion.Item eventKey="3">
                  <Accordion.Header>What if I have special dietary requirements or accessibility needs?</Accordion.Header>
                  <Accordion.Body>
                    Please inform us of any special requirements at least 7 days before your departure. We work with our travel partners to accommodate dietary restrictions, mobility needs, and other accessibility requirements whenever possible.
                  </Accordion.Body>
                </Accordion.Item>
                
                <Accordion.Item eventKey="4">
                  <Accordion.Header>How do I contact customer service for urgent issues?</Accordion.Header>
                  <Accordion.Body>
                    For urgent issues during your trip, call our 24/7 emergency hotline at 1-800-URGENT-HELP. For non-urgent matters, use our regular customer service line or email support@vacationdreams.com.
                  </Accordion.Body>
                </Accordion.Item>
                
                <Accordion.Item eventKey="5">
                  <Accordion.Header>What if my vacation package doesn't match what I ordered?</Accordion.Header>
                  <Accordion.Body>
                    If there's a discrepancy between your booking and what you receive, contact us immediately. We'll work to resolve the issue and may offer compensation or alternative arrangements. Please keep all documentation and photos of any issues.
                  </Accordion.Body>
                </Accordion.Item>
              </Accordion>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row>
        <Col>
          <Card className="shadow-sm">
            <Card.Header className="bg-danger text-white">
              <h4 className="mb-0">Support Policies</h4>
            </Card.Header>
            <Card.Body>
              <Row>
                <Col md={6}>
                  <h5>Customer Satisfaction Guarantee</h5>
                  <p>We're committed to ensuring your vacation experience exceeds expectations. If you're not satisfied, we'll work with you to make it right.</p>
                  
                  <h5>Privacy Policy</h5>
                  <p>Your personal information is protected and will never be shared with third parties without your consent.</p>
                </Col>
                <Col md={6}>
                  <h5>Travel Insurance</h5>
                  <p>We recommend purchasing travel insurance for all bookings. Contact us for information about our recommended insurance partners.</p>
                  
                  <h5>Emergency Support</h5>
                  <p>24/7 emergency support is available for all active bookings. Call 1-800-URGENT-HELP for immediate assistance.</p>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}
