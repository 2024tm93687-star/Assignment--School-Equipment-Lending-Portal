import React from "react";
import { Container, Navbar, Form } from "react-bootstrap";
import { getCurrentTheme, toggleTheme } from "../../utils/theme";
import { useState } from "react";

interface SimpleHeaderProps {
  title?: string;
}

const SimpleHeader: React.FC<SimpleHeaderProps> = ({ title }) => {
  const [theme, setTheme] = useState(getCurrentTheme());

  const onToggle = () => {
    const next = toggleTheme(theme as any);
    setTheme(next);
  };

  return (
    // Always render header as dark to keep header consistent regardless of theme
    <Navbar bg="dark" variant="dark" className="shadow-sm">
      <Container fluid className="py-2">
        <div className="d-flex align-items-center justify-content-between w-100">
          <div className="fw-bold text-uppercase text-light">{title}</div>
          <div className="d-flex align-items-center">
            <Form.Check
              type="switch"
              id="theme-toggle-simple"
              label={theme === "dark" ? "Dark" : "Light"}
              onChange={onToggle}
              checked={theme === "dark"}
              aria-label="Toggle theme"
              className="form-switch text-light"
            />
            {/* ensure label appears with light text */}
            <label htmlFor="theme-toggle-simple" className="visually-hidden">
              Toggle theme
            </label>
          </div>
        </div>
      </Container>
    </Navbar>
  );
};

export default SimpleHeader;
