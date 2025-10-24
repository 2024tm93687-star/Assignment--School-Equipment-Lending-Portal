import React from "react";
import { ListGroup } from "react-bootstrap";
import { useNavigate, useLocation } from "react-router-dom";

interface MenuItem {
  label: string;
  icon: React.ReactNode;
  path: string;
}

interface SidebarProps {
  menuItems: MenuItem[];
}

const Sidebar: React.FC<SidebarProps> = ({ menuItems }) => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div className="bg-secondary text-light h-100 border-end">
      <ListGroup variant="flush">
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;

          return (
            <ListGroup.Item
              key={item.path}
              action
              onClick={() => navigate(item.path)}
              className={`d-flex align-items-center border-0 ${
                isActive
                  ? "bg-light text-dark fw-semibold"
                  : "bg-secondary text-light"
              }`}
            >
              <span className="me-2">{item.icon}</span>
              {item.label}
            </ListGroup.Item>
          );
        })}
      </ListGroup>
    </div>
  );
};

export default Sidebar;
