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
import { REQUESTS_MOCK } from "../../mock";

interface Request {
  id: string;
  equipment: string;
  requester: string;
  role: string;
  status: "Pending" | "Approved" | "Rejected" | "Returned";
  dueDate: string;
}

const RequestsPage: React.FC = () => {
  const [requests, setRequests] = useState<Request[]>([]);
  const [loading, setLoading] = useState(true);

  const role = sessionStorage.getItem("role") || "";
  const username = sessionStorage.getItem("username") || "";

  useEffect(() => {
    setTimeout(() => {
      setRequests(REQUESTS_MOCK as Request[]);
      setLoading(false);
    }, 1000);
  }, []);

  const handleApprove = (id: string) => {
    setRequests((prev) =>
      prev.map((req) => (req.id === id ? { ...req, status: "Approved" } : req))
    );
  };

  const handleReject = (id: string) => {
    setRequests((prev) =>
      prev.map((req) => (req.id === id ? { ...req, status: "Rejected" } : req))
    );
  };

  const handleMarkReturned = (id: string) => {
    setRequests((prev) =>
      prev.map((req) => (req.id === id ? { ...req, status: "Returned" } : req))
    );
  };

  const filteredRequests = requests.filter((req) =>
    role === "STUDENT" ? req.requester === username : true
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
              <tr key={req.id}>
                <td>{req.id}</td>
                <td>{req.equipment}</td>
                <td>{req.requester}</td>
                <td>
                  <Badge
                    bg={
                      req.status === "Pending"
                        ? "warning"
                        : req.status === "Approved"
                        ? "success"
                        : req.status === "Rejected"
                        ? "danger"
                        : "secondary"
                    }
                  >
                    {req.status}
                  </Badge>
                </td>
                <td>{req.dueDate}</td> {/* Display due date */}
                {role !== "STUDENT" && (
                  <td>
                    {req.status === "Pending" && (
                      <>
                        <Button
                          variant="success"
                          size="sm"
                          className="me-2"
                          onClick={() => handleApprove(req.id)}
                        >
                          Approve
                        </Button>
                        <Button
                          variant="danger"
                          size="sm"
                          onClick={() => handleReject(req.id)}
                        >
                          Reject
                        </Button>
                      </>
                    )}
                    {req.status === "Approved" && (
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => handleMarkReturned(req.id)}
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
