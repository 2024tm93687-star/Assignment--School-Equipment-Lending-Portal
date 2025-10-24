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
    <div className="bg-secondary text-light h-100 p-3 border-end">
      <ListGroup variant="flush">
        {menuItems.map((item) => (
          <ListGroup.Item
            key={item.path}
            action
            onClick={() => navigate(item.path)}
            active={location.pathname === item.path}
            className="d-flex align-items-center text-light bg-secondary border-0"
          >
            {item.icon}
            {item.label}
          </ListGroup.Item>
        ))}
      </ListGroup>
    </div>
  );
};

export default Sidebar;
