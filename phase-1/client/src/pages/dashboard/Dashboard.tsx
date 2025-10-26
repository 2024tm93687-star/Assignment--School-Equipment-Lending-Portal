import React from "react";
import { Container, Row, Col, Card, Table, Badge } from "react-bootstrap";
import { useSelector } from "react-redux";
import type { RootState } from "../../store";
import { REQUESTS_MOCK } from "../../mock";

const Dashboard: React.FC = () => {
  const { username, role } = useSelector((state: RootState) => state.auth) as {
    username: string;
    role: string;
  };

  const cards = [
    { title: "Available Equipment", value: 24, color: "primary" },
    { title: "Total Requests", value: 18, color: "info" },
    { title: "Pending Requests", value: 5, color: "warning" },
    { title: "Returned Equipment", value: 10, color: "success" },
  ];

  return (
    <Container fluid className="p-4">
      <Row className="mb-4">
        <Col>
          <h3>Welcome, {username}!</h3>
          <p>
            Role: <strong className="text-capitalize">{role}</strong>
          </p>
        </Col>
      </Row>

      <Row className="g-4 mb-4">
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

      <Row className="g-4">
        <Col xs={12}>
          <Card className="shadow-sm border-0">
            <Card.Header>Recent Requests</Card.Header>
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
                  {REQUESTS_MOCK.map((req) => (
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
                              : "secondary"
                          }
                        >
                          {req.status}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Dashboard;
