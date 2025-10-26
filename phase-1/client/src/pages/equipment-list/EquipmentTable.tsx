import React from "react";
import { Table, Button, Badge } from "react-bootstrap";
import { FaEdit, FaTrash } from "react-icons/fa";

interface Equipment {
  id: string;
  name: string;
  category: string;
  condition: string;
  quantity: number;
  available: number;
}

interface EquipmentTableProps {
  equipment: Equipment[];
  userRole: string | null;
  onRequest: (id: string) => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

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
        <th>ID</th>
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
        <tr key={item.id}>
          <td>{item.id}</td>
          <td>{item.name}</td>
          <td>{item.category}</td>
          <td>{item.condition}</td>
          <td>{item.quantity}</td>
          <td>
            <Badge bg={item.available > 0 ? "success" : "danger"}>{item.available}</Badge>
          </td>
          <td>
            {userRole === "student" && (
              <Button size="sm" variant="primary" onClick={() => onRequest(item.id)}>
                Request
              </Button>
            )}
            {userRole === "admin" && (
              <>
                <Button size="sm" variant="warning" className="me-2" onClick={() => onEdit(item.id)}>
                  <FaEdit />
                </Button>
                <Button size="sm" variant="danger" onClick={() => onDelete(item.id)}>
                  <FaTrash />
                </Button>
              </>
            )}
            {userRole === "staff" && <span className="text-muted">View Only</span>}
          </td>
        </tr>
      ))}
    </tbody>
  </Table>
);

export default EquipmentTable;
