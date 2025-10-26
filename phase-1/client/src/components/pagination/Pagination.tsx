import React from "react";
import { Pagination as RBPagination, Form, Row, Col } from "react-bootstrap";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  itemsPerPage: number;
  onItemsPerPageChange: (num: number) => void;
  options?: number[];
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  itemsPerPage,
  onItemsPerPageChange,
  options = [5, 10, 20],
}) => (
  <Row className="mt-3">
    <Col className="d-flex justify-content-end align-items-center">
      <Form.Select
        value={itemsPerPage}
        onChange={(e) => onItemsPerPageChange(Number(e.target.value))}
        className="me-3"
        style={{ width: "auto" }}
      >
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt} per page
          </option>
        ))}
      </Form.Select>

      <RBPagination className="mb-0">
        <RBPagination.Prev
          disabled={currentPage === 1}
          onClick={() => onPageChange(currentPage - 1)}
        />
        {[...Array(totalPages)].map((_, idx) => (
          <RBPagination.Item
            key={idx + 1}
            active={idx + 1 === currentPage}
            onClick={() => onPageChange(idx + 1)}
          >
            {idx + 1}
          </RBPagination.Item>
        ))}
        <RBPagination.Next
          disabled={currentPage === totalPages}
          onClick={() => onPageChange(currentPage + 1)}
        />
      </RBPagination>
    </Col>
  </Row>
);

export default Pagination;
