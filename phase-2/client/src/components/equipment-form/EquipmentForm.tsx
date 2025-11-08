import React, { useState, useEffect } from "react";
import { Form, Button, Modal } from "react-bootstrap";

import type {
  EquipmentPayload,
  EquipmentCondition,
} from "../../features/equipment/types";

interface EquipmentFormProps {
  show: boolean;
  onHide: () => void;
  onSubmit: (data: EquipmentPayload) => void;
  initialData?: EquipmentPayload;
  title: string;
}

const CONDITIONS: EquipmentCondition[] = [
  "new",
  "good",
  "fair",
  "poor",
  "damaged",
  "retired",
];

const EquipmentForm: React.FC<EquipmentFormProps> = ({
  show,
  onHide,
  onSubmit,
  initialData,
  title,
}) => {
  const [formData, setFormData] = useState<EquipmentPayload>({
    name: "",
    category: "",
    condition: "new",
    quantity: 0,
    available: 0,
  });

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleChange = (e: React.ChangeEvent<any>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "quantity" || name === "available"
          ? parseInt(value) || 0
          : value,
    }));
  };

  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>{title}</Modal.Title>
      </Modal.Header>
      <Form onSubmit={handleSubmit}>
        <Modal.Body>
          <Form.Group className="mb-3">
            <Form.Label>Name</Form.Label>
            <Form.Control
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Category</Form.Label>
            <Form.Control
              type="text"
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Condition</Form.Label>
            <Form.Select
              name="condition"
              value={formData.condition}
              onChange={handleChange}
              required
            >
              {CONDITIONS.map((condition) => (
                <option key={condition} value={condition}>
                  {condition.charAt(0).toUpperCase() + condition.slice(1)}
                </option>
              ))}
            </Form.Select>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Total Quantity</Form.Label>
            <Form.Control
              type="number"
              name="quantity"
              value={formData.quantity}
              onChange={handleChange}
              min={0}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Available Quantity</Form.Label>
            <Form.Control
              type="number"
              name="available"
              value={formData.available}
              onChange={handleChange}
              min={0}
              max={formData.quantity}
              required
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={onHide}>
            Cancel
          </Button>
          <Button variant="primary" type="submit">
            Save
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default EquipmentForm;
