import React, { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Form,
  Button,
  Alert,
  Card,
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { signupThunk } from "../../features/auth/auth-thunks";
import type { AppDispatch, RootState } from "../../store";

interface SignupData {
  username: string;
  password: string;
  confirmPassword: string;
  fullName: string;
  email: string;
  role: "STUDENT" | "STAFF" | "ADMIN";
  department: string;
}

const Signup: React.FC = () => {
  const [formData, setFormData] = useState<SignupData>({
    username: "",
    password: "",
    confirmPassword: "",
    fullName: "",
    email: "",
    role: "STUDENT",
    department: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { loading } = useSelector((state: RootState) => state.auth);

  // Redirect if already authenticated
  useEffect(() => {
    const token = sessionStorage.getItem("token");
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

    const { username, password, confirmPassword, fullName, email, department } =
      formData;

    if (
      !username ||
      !password ||
      !confirmPassword ||
      !fullName ||
      !email ||
      !department
    ) {
      setError("Please fill in all required fields.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    dispatch(
      signupThunk({
        username: formData.username,
        password: formData.password,
        fullName: formData.fullName,
        email: formData.email,
        role: formData.role,
        department: formData.department,
      })
    )
      .unwrap()
      .then(() => {
        setSuccess("Account created successfully!");
        navigate("/dashboard");
      })
      .catch((err: string) => setError(err || "Signup failed"));
  };

  return (
    <Container
      fluid
      className="min-vh-100 d-flex justify-content-center align-items-center bg-dark text-light"
    >
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

                <Row>
                  <Col xs={12} md={6}>
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
                  </Col>

                  <Col xs={12} md={6}>
                    <Form.Group className="mb-3" controlId="confirmPassword">
                      <Form.Label>Confirm Password</Form.Label>
                      <Form.Control
                        type="password"
                        placeholder="Confirm password"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        required
                      />
                    </Form.Group>
                  </Col>
                </Row>

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

                <Button
                  variant="primary"
                  type="submit"
                  className="w-100 fw-semibold"
                  disabled={loading}
                >
                  {loading ? "Creating account..." : "Sign Up"}
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
