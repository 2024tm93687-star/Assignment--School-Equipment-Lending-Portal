import React, { useState, useEffect } from "react";
import { Container, Row, Col, Form, Button, Alert, Card } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

interface SignupData {
  username: string;
  password: string;
  fullName: string;
  email: string;
  role: "STUDENT" | "STAFF" | "ADMIN";
  department: string;
}

const Signup: React.FC = () => {
  const [formData, setFormData] = useState<SignupData>({
    username: "",
    password: "",
    fullName: "",
    email: "",
    role: "STUDENT",
    department: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) navigate("/dashboard");
  }, [navigate]);

  const handleChange = (e: React.ChangeEvent<any>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (
      !formData.username ||
      !formData.password ||
      !formData.fullName ||
      !formData.email ||
      !formData.department
    ) {
      setError("Please fill in all required fields.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError("Please enter a valid email address.");
      return;
    }

    console.log("Signup data:", formData);
    setSuccess("Account created successfully!");
    setFormData({
      username: "",
      password: "",
      fullName: "",
      email: "",
      role: "STUDENT",
      department: "",
    });
  };

  return (
    <Container fluid className="min-vh-100 d-flex justify-content-center align-items-center bg-dark text-light">
      <Row className="w-100 justify-content-center py-4">
        <Col xs={10} sm={8} md={6} lg={5}>
          <Card bg="secondary" text="light" className="shadow-lg border-0 p-4">
            <Card.Body>
              <Card.Title className="text-center mb-4 fs-4 fw-bold text-uppercase">
                Sign Up
              </Card.Title>

              {error && <Alert variant="danger">{error}</Alert>}
              {success && <Alert variant="success">{success}</Alert>}

              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3" controlId="fullName">
                  <Form.Label>Full Name</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter full name"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3" controlId="username">
                  <Form.Label>Username</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter username"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3" controlId="email">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="email"
                    placeholder="Enter email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3" controlId="password">
                  <Form.Label>Password</Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="Enter password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>

                <Row className="mb-3">
                  <Col>
                    <Form.Group controlId="role">
                      <Form.Label>Role</Form.Label>
                      <Form.Select
                        name="role"
                        value={formData.role}
                        onChange={handleChange}
                      >
                        <option value="STUDENT">STUDENT</option>
                        <option value="STAFF">STAFF</option>
                        <option value="ADMIN">ADMIN</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>

                  <Col>
                    <Form.Group controlId="department">
                      <Form.Label>Department</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Enter department"
                        name="department"
                        value={formData.department}
                        onChange={handleChange}
                        required
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <Button variant="primary" type="submit" className="w-100 fw-semibold">
                  Sign Up
                </Button>
              </Form>

              <div className="text-center mt-3">
                <span>Already have an account? </span>
                <Button
                  variant="link"
                  className="p-0 text-info"
                  onClick={() => navigate("/login")}
                >
                  Login
                </Button>
              </div>
            </Card.Body>
          </Card>

          <div className="text-center text-secondary mt-4 small">
            &copy; {new Date().getFullYear()} School Equipment Lending Portal
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default Signup;
