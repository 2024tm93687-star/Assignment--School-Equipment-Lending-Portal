import React, { useEffect, useState } from "react";
import {
  Navbar,
  Container,
  Dropdown,
  Button,
  Badge,
  ListGroup,
} from "react-bootstrap";
import { FaUserCircle, FaBell } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../features/auth/auth-slice";
import type { RootState, AppDispatch } from "../../store";
import { useNavigate } from "react-router-dom";
import { apiFetch } from "../../utils/api";
import { BORROW_SERVICE_URL } from "../../utils/api-constants";
import { getCurrentTheme, toggleTheme } from "../../utils/theme";

interface HeaderProps {
  brand: React.ReactNode;
}

interface NotificationItem {
  _id: string;
  equipmentName?: string;
  borrowerName?: string;
  dueDate?: string;
  status?: string;
}

const Header: React.FC<HeaderProps> = ({ brand }) => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { username } = useSelector((state: RootState) => state.auth);

  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [theme, setTheme] = useState(getCurrentTheme());

  const role = (sessionStorage.getItem("role") || "").toUpperCase();

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  useEffect(() => {
    const loadNotifications = async () => {
      try {
        const data = (await apiFetch(`${BORROW_SERVICE_URL}/borrows`)) as any[];

        // Notifications: include ONLY overdue items
        const items = (data || [])
          .filter((it) => it.dueDate && it.status === "overdue")
          .map((it) => ({
            _id: it._id,
            equipmentName: it.equipmentName || it.equipmentId,
            borrowerName: it.borrowerName || "",
            dueDate: it.dueDate,
            status: it.status,
          })) as NotificationItem[];

        setNotifications(items);
      } catch (err) {
        console.warn("Failed to load notifications", err);
      }
    };

    // initial load
    loadNotifications();

    // listen for global changes to borrows so notifications refresh immediately
    const listener = () => {
      loadNotifications();
    };
    window.addEventListener("borrows-changed", listener);

    return () => {
      window.removeEventListener("borrows-changed", listener);
    };
  }, []);

  const handleThemeToggle = () => {
    const next = toggleTheme(theme as any);
    setTheme(next);
  };

  return (
    <Navbar bg="dark" variant="dark" expand="lg" className="shadow-sm py-3">
      <Container fluid>
        <Navbar.Brand className="fw-bold text-uppercase text-wrap">
          {brand}
        </Navbar.Brand>

          <div className="d-flex align-items-center gap-3">
          <div className="d-flex align-items-center">
            <div className="me-3">
              <div className="form-check form-switch m-0">
                <input
                  className="form-check-input"
                  type="checkbox"
                  id="theme-toggle"
                  onChange={handleThemeToggle}
                  checked={theme === "dark"}
                />
                {/* Keep label light so it remains readable on dark header */}
                <label className="form-check-label small text-light ms-2" htmlFor="theme-toggle">
                  {theme === "dark" ? "Dark" : "Light"}
                </label>
              </div>
            </div>
          </div>
          <Dropdown align="end">
            <Dropdown.Toggle
              as={Button}
              variant="secondary"
              className="d-flex align-items-center"
            >
              <FaBell className="me-2" />
              <Badge bg="danger">{notifications.length}</Badge>
            </Dropdown.Toggle>
            <Dropdown.Menu style={{ minWidth: 300 }}>
              <ListGroup variant="flush">
                {notifications.length === 0 && (
                  <ListGroup.Item>No upcoming due items</ListGroup.Item>
                )}
                {notifications.map((n) => (
                  <ListGroup.Item
                    key={n._id}
                    className="d-flex justify-content-between align-items-start"
                  >
                    <div>
                      <div className="fw-bold">
                        {n.equipmentName}{" "}
                        {n.status === "overdue" && (
                          <Badge bg="danger" className="ms-2">
                            Overdue
                          </Badge>
                        )}
                      </div>
                      <div className="small text-muted">
                        Due: {new Date(n.dueDate || "").toLocaleDateString()}
                      </div>
                      {role !== "STUDENT" && n.borrowerName && (
                        <div className="small text-muted">
                          Borrower: {n.borrowerName}
                        </div>
                      )}
                    </div>
                  </ListGroup.Item>
                ))}
              </ListGroup>
            </Dropdown.Menu>
          </Dropdown>

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
        </div>
      </Container>
    </Navbar>
  );
};

export default Header;
