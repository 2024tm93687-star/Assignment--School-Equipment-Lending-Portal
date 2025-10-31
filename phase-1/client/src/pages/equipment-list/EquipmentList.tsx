import React, { useEffect, useState } from "react";
import { Container, Row, Col, Spinner, Button, Form } from "react-bootstrap";
import { useSelector } from "react-redux";
import type { RootState } from "../../store";
import SearchBar from "../../components/search-bar/SearchBar";
import EquipmentTable from "./EquipmentTable";
import PaginationComponent from "../../components/pagination/Pagination";
import { EQUIPMENT_LIST_MOCK } from "../../mock";

interface Equipment {
  id: string;
  name: string;
  category: string;
  condition: string;
  quantity: number;
  available: number;
}

const ITEMS_PER_PAGE_OPTIONS = [5, 10, 20];

const EquipmentList: React.FC = () => {
  const [equipment, setEquipment] = useState<Equipment[]>([]);
  const [filteredEquipment, setFilteredEquipment] = useState<Equipment[]>([]);
  const [search, setSearch] = useState("");
  const [showAvailableOnly, setShowAvailableOnly] = useState(false);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  const userRole = useSelector((state: RootState) => state.auth.role);

  useEffect(() => {
    const mockData = EQUIPMENT_LIST_MOCK as Equipment[];
    setTimeout(() => {
      setEquipment(mockData);
      setFilteredEquipment(mockData);
      setLoading(false);
    }, 1000);
  }, []);

  // Filter by name/category and availability
  useEffect(() => {
    const searchLower = search.toLowerCase();
    const filtered = equipment.filter((item) => {
      const matchesSearch =
        item.name.toLowerCase().includes(searchLower) ||
        item.category.toLowerCase().includes(searchLower);
      const matchesAvailability = !showAvailableOnly || item.available > 0;
      return matchesSearch && matchesAvailability;
    });
    setFilteredEquipment(filtered);
    setCurrentPage(1);
  }, [search, showAvailableOnly, equipment]);

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredEquipment.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredEquipment.length / itemsPerPage);

  // Action handlers
  const handleRequest = (id: string) => alert(`Request sent for equipment ID: ${id}`);
  const handleEdit = (id: string) => alert(`Edit equipment ID: ${id}`);
  const handleDelete = (id: string) => alert(`Delete equipment ID: ${id}`);
  const handleAdd = () => alert("Add new equipment"); // Replace with modal/form

  return (
    <Container fluid className="p-4">
      <Row className="mb-3 align-items-center">
        <Col xs={12} md={6} className="d-flex align-items-center">
          <h3 className="me-3 mb-0">Equipment List</h3>
          {userRole === "ADMIN" && (
            <Button variant="primary" size="sm" onClick={handleAdd}>
              + Add
            </Button>
          )}
        </Col>
        <Col xs={12} md={6} className="d-flex justify-content-end align-items-center gap-3">
          <Form.Check
            type="checkbox"
            id="availableOnly"
            label="Show available only"
            checked={showAvailableOnly}
            onChange={(e) => setShowAvailableOnly(e.target.checked)}
          />
          <SearchBar
            search={search}
            onSearchChange={setSearch}
            placeholder="Search by name or category"
          />
        </Col>
      </Row>

      {loading ? (
        <div className="text-center mt-5">
          <Spinner animation="border" variant="primary" />
        </div>
      ) : (
        <>
          <EquipmentTable
            equipment={currentItems}
            userRole={userRole}
            onRequest={handleRequest}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />

          <PaginationComponent
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            itemsPerPage={itemsPerPage}
            onItemsPerPageChange={(num) => {
              setItemsPerPage(num);
              setCurrentPage(1);
            }}
            options={ITEMS_PER_PAGE_OPTIONS}
          />
        </>
      )}
    </Container>
  );
};

export default EquipmentList;
