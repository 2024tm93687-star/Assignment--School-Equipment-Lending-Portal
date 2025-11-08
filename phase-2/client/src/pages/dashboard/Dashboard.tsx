import React, { useEffect, useMemo, useState } from "react";
import { Container, Row, Col, Card, Table, Badge, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "../../store";
import { apiFetch } from "../../utils/api";
import { BORROW_SERVICE_URL } from "../../utils/api-constants";
import type { AppDispatch } from "../../store/store";
import { fetchEquipments } from "../../features/equipment/equipment-thunks";
import type { Equipment } from "../../features/equipment/types";

const Dashboard: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { fullName, role } = useSelector((state: RootState) => state.auth) as {
    fullName: string;
    role: string;
  };

  useEffect(() => {
    dispatch(fetchEquipments());
  }, [dispatch]);

  const equipmentItems = useSelector(
    (state: RootState) => state.equipment.items
  ) as Equipment[];

  const availableList = useMemo(
    () => equipmentItems.filter((e) => e.available > 0).slice(0, 5),
    [equipmentItems]
  );

  const [borrows, setBorrows] = useState<any[]>([]);

  useEffect(() => {
    const loadBorrows = async () => {
      try {
        const data = await apiFetch(`${BORROW_SERVICE_URL}/borrows`);
        setBorrows(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Failed to load borrows", err);
        setBorrows([]);
      }
    };

    loadBorrows();
  }, []);

  const totalRequests = borrows.length;
  const pendingRequests = borrows.filter(
    (b) => (b.status || "").toLowerCase() === "pending"
  ).length;

  // compute recent pending requests (most recent first) and limit to 5
  const recentPending = borrows
    .filter((b) => (b.status || "").toLowerCase() === "pending")
    .slice()
    .sort((a, b) => {
      const ta = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const tb = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      return tb - ta;
    })
    .slice(0, 5);

  const cards = [
    {
      title: "Total Equipment",
      value: equipmentItems.length,
      color: "primary",
    },
    {
      title: "Available Equipment",
      value: equipmentItems.filter((e) => e.available > 0).length,
      color: "info",
    },
    { title: "Total Requests", value: totalRequests, color: "warning" },
    { title: "Pending Requests", value: pendingRequests, color: "success" },
  ];

  return (
    <Container fluid className="p-4">
      <Row className="mb-4">
        <Col>
          <h3>Welcome, {fullName}!</h3>
          <p>
            Role: <strong className="text-capitalize">{role}</strong>
          </p>
        </Col>
      </Row>

      {/* Cards row */}
      <Row className="mb-4">
        {cards.map((card) => (
          <Col xs={12} sm={6} md={4} lg={3} key={card.title}>
            <Card className="shadow-sm border-0 h-100 text-center">
              <Card.Body className="d-flex flex-column justify-content-between align-items-center">
                <Card.Title className="fw-semibold">{card.title}</Card.Title>
                <Card.Text className={`fs-3 fw-bold text-${card.color} mb-0`}>
                  {card.value}
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      {/* Recent Requests (staff/admin only) */}
      {role && role.toLowerCase() !== "student" && (
        <Row className="g-4">
          <Col xs={12}>
              <Card className="shadow-sm border-0">
                <Card.Header className="d-flex justify-content-between align-items-center">
                  <div>Recent Requests</div>
                  <div>
                    <Button size="sm" variant="primary" onClick={() => navigate('/requests')}>
                      Show All Requests
                    </Button>
                  </div>
                </Card.Header>
                <Card.Body className="p-0">
                <Table striped bordered hover responsive className="mb-0">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Equipment</th>
                      <th>Requester</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentPending.length === 0 ? (
                      <tr>
                        <td colSpan={4} className="text-center text-muted">
                          No pending requests
                        </td>
                      </tr>
                    ) : (
                      recentPending.map((req) => (
                        <tr key={req._id || req.id}>
                          <td>{req._id || req.id}</td>
                          <td>{req.equipmentName || req.equipment}</td>
                          <td>{req.borrowerName || req.requester || "—"}</td>
                          <td>
                            <Badge
                              bg={
                                (req.status || "").toLowerCase() === "pending"
                                  ? "warning"
                                  : (req.status || "").toLowerCase() === "approved"
                                  ? "success"
                                  : "secondary"
                              }
                            >
                              {req.status}
                            </Badge>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </Table>
              </Card.Body>
              <Card.Footer className="bg-transparent border-0 small">
                <span className="text-primary me-2">*</span>
                <span className="text-muted">Showing the five most recent pending requests.</span>
              </Card.Footer>
            </Card>
          </Col>
        </Row>
      )}

      {/* Popular Available Equipment: show only for students and place near bottom */}
      {role && role.toLowerCase() === "student" && (
        <Row className="mt-4">
          <Col xs={12}>
            <Card className="shadow-sm border-0">
              <Card.Header>Popular Available Equipment</Card.Header>
              <Card.Body>
                {availableList.length === 0 ? (
                  <div className="text-muted">No equipment available</div>
                ) : (
                  <ul className="mb-0">
                    {availableList.map((e) => (
                      <li key={e._id || e.name}>
                        {e.name} ({e.available})
                      </li>
                    ))}
                  </ul>
                )}
              </Card.Body>
            </Card>
          </Col>
        </Row>
      )}
    </Container>
  );
};

export default Dashboard;
