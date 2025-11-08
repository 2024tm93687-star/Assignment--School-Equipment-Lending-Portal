import React from "react";
import { Table, Button, Badge } from "react-bootstrap";
import { FaEdit, FaTrash } from "react-icons/fa";
import type { Equipment } from "../../features/equipment/types";

interface EquipmentTableProps {
  equipment: Equipment[];
  userRole: string | null;
  onRequest: (id: string) => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

const getConditionBadgeColor = (condition: string) => {
  switch (condition.toLowerCase()) {
    case "new":
      return "primary";
    case "good":
      return "success";
    case "fair":
      return "info";
    case "poor":
      return "warning";
    case "damaged":
    case "retired":
      return "danger";
    default:
      return "secondary";
  }
};

const EquipmentTable: React.FC<EquipmentTableProps> = ({
  equipment,
  userRole,
  onRequest,
  onEdit,
  onDelete,
}) => (
  <Table striped bordered hover responsive>
    <thead>
      <tr>
        <th>Name</th>
        <th>Category</th>
        <th>Condition</th>
        <th>Quantity</th>
        <th>Available</th>
        <th>Actions</th>
      </tr>
    </thead>
    <tbody>
      {equipment.map((item) => (
        <tr key={item._id}>
          <td>{item.name}</td>
          <td>{item.category}</td>
          <td>
            <Badge bg={getConditionBadgeColor(item.condition)}>
              {item.condition.charAt(0).toUpperCase() + item.condition.slice(1)}
            </Badge>
          </td>
          <td>{item.quantity}</td>
          <td>
            <Badge bg={item.available > 0 ? "success" : "danger"}>
              {item.available}
            </Badge>
          </td>
          <td>
            { (userRole === "STUDENT" || userRole === "STAFF") && (
              <Button
                size="sm"
                variant="primary"
                onClick={() => {
                  console.log("EquipmentTable: Request clicked", item._id);
                  onRequest(item._id);
                }}
                disabled={item.available === 0}
              >
                Request
              </Button>
            )}
            {userRole === "ADMIN" && (
              <>
                <Button
                  size="sm"
                  variant="warning"
                  className="me-2"
                  onClick={() => {
                    console.log("EquipmentTable: Edit clicked", item._id);
                    onEdit(item._id);
                  }}
                >
                  <FaEdit />
                </Button>
                <Button
                  size="sm"
                  variant="danger"
                  onClick={() => {
                    console.log("EquipmentTable: Delete clicked", item._id);
                    onDelete(item._id);
                  }}
                >
                  <FaTrash />
                </Button>
              </>
            )}
            {userRole === "STAFF" && (
              <span className="text-muted">View Only</span>
            )}
          </td>
        </tr>
      ))}
    </tbody>
  </Table>
);

export default EquipmentTable;
