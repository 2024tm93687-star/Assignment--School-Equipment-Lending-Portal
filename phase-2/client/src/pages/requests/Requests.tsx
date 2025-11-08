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
    (async () => {
      try {
        await apiFetch(`${BORROW_SERVICE_URL}/borrow/${id}/approve`, { method: 'PUT', body: JSON.stringify({ status: 'approved' }) });
        setRequests((prev) => prev.map((req) => (req._id === id ? { ...req, status: 'approved' } : req)));
      } catch (err) {
        console.error('Failed to approve request', err);
      }
    })();
  };

  const handleReject = (id: string) => {
    (async () => {
      try {
        await apiFetch(`${BORROW_SERVICE_URL}/borrow/${id}/approve`, { method: 'PUT', body: JSON.stringify({ status: 'rejected' }) });
        setRequests((prev) => prev.map((req) => (req._id === id ? { ...req, status: 'rejected' } : req)));
      } catch (err) {
        console.error('Failed to reject request', err);
      }
    })();
  };

  const handleMarkReturned = (id: string) => {
    // Call borrow-service to mark returned and then update UI on success
    (async () => {
      try {
        await apiFetch(`${BORROW_SERVICE_URL}/borrow/${id}/return`, { method: 'PUT' });
        setRequests((prev) => prev.map((req) => (req._id === id ? { ...req, status: 'returned' } : req)));
      } catch (err) {
        console.error('Failed to mark returned', err);
        // Optionally show a UI error/notification here
      }
    })();
  };

  // Server already scopes borrows by authenticated user (students receive only their records)
  // so we display the returned list as-is. This avoids relying on sessionStorage username.
  const filteredRequests = requests;

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
                          (req.status || '').toLowerCase() === 'pending'
                            ? 'warning'
                            : (req.status || '').toLowerCase() === 'approved'
                            ? 'success'
                            : (req.status || '').toLowerCase() === 'rejected'
                            ? 'danger'
                            : (req.status || '').toLowerCase() === 'returned'
                            ? 'info'
                            : 'secondary'
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
                        {(req.status === "approved" || req.status === "overdue") && (
                          <Button
                            variant={req.status === "overdue" ? "warning" : "secondary"}
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
