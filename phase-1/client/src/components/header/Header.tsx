import React from "react";
import { Navbar, Container, Dropdown, Button } from "react-bootstrap";
import { FaUserCircle } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../features/auth/auth-slice";
import type { RootState, AppDispatch } from "../../store";
import { useNavigate } from "react-router-dom";

interface HeaderProps {
  title: string;
}

const Header: React.FC<HeaderProps> = ({ title }) => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { username } = useSelector((state: RootState) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  return (
    <Navbar bg="dark" variant="dark" expand="lg" className="shadow-sm py-3">
      <Container fluid>
        <Navbar.Brand className="fw-bold text-uppercase text-wrap">
          {title}
        </Navbar.Brand>

        <Dropdown align="end">
          <Dropdown.Toggle
            as={Button}
            variant="secondary"
            className="d-flex align-items-center"
          >
            <FaUserCircle className="me-2" size={20} />
            {username}
          </Dropdown.Toggle>

          <Dropdown.Menu>
            <Dropdown.Item onClick={handleLogout}>Logout</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </Container>
    </Navbar>
  );
};

export default Header;
