import React, { useEffect, useState } from "react";
import {
  Container,
  Table,
  Button,
  Badge,
  Spinner,
  Row,
  Col,
} from "react-bootstrap";
import { apiFetch } from "../../utils/api";
import { BORROW_SERVICE_URL } from "../../utils/api-constants";

interface RequestItem {
  _id: string;
  equipmentName?: string;
  borrowerName?: string;
  status?: string;
  dueDate?: string;
}

const RequestsPage: React.FC = () => {
  const [requests, setRequests] = useState<RequestItem[]>([]);
  const [loading, setLoading] = useState(true);

  const role = sessionStorage.getItem("role") || "";
  const username = sessionStorage.getItem("username") || "";

  useEffect(() => {
    const load = async () => {
      try {
        const res = (await apiFetch(`${BORROW_SERVICE_URL}/borrows`)) as RequestItem[];
        setRequests(res || []);
      } catch (err) {
        console.warn('Failed to load borrows', err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const handleApprove = (id: string) => {
    setRequests((prev) =>
      prev.map((req) => (req._id === id ? { ...req, status: "approved" } : req))
    );
  };

  const handleReject = (id: string) => {
    setRequests((prev) =>
      prev.map((req) => (req._id === id ? { ...req, status: "rejected" } : req))
    );
  };

  const handleMarkReturned = (id: string) => {
    setRequests((prev) =>
      prev.map((req) => (req._id === id ? { ...req, status: "returned" } : req))
    );
  };

  const filteredRequests = requests.filter((req) =>
    role === "STUDENT" ? req.borrowerName === username : true
  );

  return (
    <Container fluid className="p-4">
      <Row className="mb-3">
        <Col>
          <h3>Borrowing Requests</h3>
        </Col>
      </Row>

      {loading ? (
        <div className="text-center mt-5">
          <Spinner animation="border" variant="primary" />
        </div>
      ) : (
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>ID</th>
              <th>Equipment</th>
              <th>Requester</th>
              <th>Status</th>
              <th>Due Date</th> {/* New column */}
              {role !== "STUDENT" && <th>Actions</th>}
            </tr>
          </thead>
          <tbody>
                {filteredRequests.map((req) => (
                  <tr key={req._id}>
                    <td>{req._id}</td>
                    <td>{req.equipmentName || req._id}</td>
                    <td>{req.borrowerName}</td>
                    <td>
                      <Badge
                        bg={
                          req.status === "pending"
                            ? "warning"
                            : req.status === "approved"
                            ? "success"
                            : req.status === "rejected"
                            ? "danger"
                            : "secondary"
                        }
                      >
                        {req.status}
                      </Badge>
                    </td>
                    <td>{req.dueDate ? new Date(req.dueDate).toLocaleDateString() : ''}</td>
                    {role !== "STUDENT" && (
                      <td>
                        {req.status === "pending" && (
                          <>
                            <Button
                              variant="success"
                              size="sm"
                              className="me-2"
                              onClick={() => handleApprove(req._id)}
                            >
                              Approve
                            </Button>
                            <Button
                              variant="danger"
                              size="sm"
                              onClick={() => handleReject(req._id)}
                            >
                              Reject
                            </Button>
                          </>
                        )}
                        {req.status === "approved" && (
                          <Button
                            variant="secondary"
                            size="sm"
                            onClick={() => handleMarkReturned(req._id)}
                          >
                            Mark Returned
                          </Button>
                        )}
                      </td>
                    )}
                  </tr>
                ))}
          </tbody>
        </Table>
      )}
    </Container>
  );
};

export default RequestsPage;
