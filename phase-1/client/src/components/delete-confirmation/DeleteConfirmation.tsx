import React from "react";
import { Modal, Button } from "react-bootstrap";

interface DeleteConfirmationProps {
  show: boolean;
  onHide: () => void;
  onConfirm: () => void;
  itemName: string;
}

const DeleteConfirmation: React.FC<DeleteConfirmationProps> = ({
  show,
  onHide,
  onConfirm,
  itemName,
}) => {
  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>Delete Equipment</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        Are you sure you want to delete "{itemName}"? This action cannot be
        undone.
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Cancel
        </Button>
        <Button variant="danger" onClick={onConfirm}>
          Delete
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default DeleteConfirmation;
