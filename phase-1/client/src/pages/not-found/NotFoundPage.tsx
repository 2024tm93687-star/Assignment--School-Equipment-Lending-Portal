import React from "react";
import { Container, Row, Col, Button, Card } from "react-bootstrap";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import type { RootState } from "../../store";

const NotFoundPage: React.FC = () => {
  const navigate = useNavigate();

  const handleRedirect = () => {
    navigate("/dashboard");
  };

  const { isAuthenticated } = useSelector((state: RootState) => state.auth);

  return (
    <Container
      fluid
      className="min-vh-100 d-flex justify-content-center align-items-center bg-dark text-light"
    >
      <Row className="w-100 justify-content-center">
        <Col xs={10} sm={8} md={6} lg={4}>
          <Card
            bg="secondary"
            text="light"
            className="shadow-lg border-0 text-center"
          >
            <Card.Body>
              <h1 className="display-4 fw-bold mb-3">404</h1>
              <p className="fs-5 mb-4">
                Oops! The page you are looking for does not exist.
              </p>
              {isAuthenticated ? (
                <Button variant="primary" onClick={handleRedirect}>
                  Go to Dashboard
                </Button>
              ) : (
                <Button variant="primary" onClick={() => navigate("/login")}>
                  Go to Login
                </Button>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default NotFoundPage;
