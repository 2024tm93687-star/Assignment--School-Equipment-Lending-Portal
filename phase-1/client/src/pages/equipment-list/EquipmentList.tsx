import React, { useEffect, useState } from "react";
import { Container, Row, Col, Spinner, Button, Form } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../../store";
import type { Equipment } from "../../features/equipment/types";
import SearchBar from "../../components/search-bar/SearchBar";
import EquipmentTable from "./EquipmentTable";
import PaginationComponent from "../../components/pagination/Pagination";
import EquipmentForm from "../../components/equipment-form/EquipmentForm";
import DeleteConfirmation from "../../components/delete-confirmation/DeleteConfirmation";
import type { AppDispatch } from "../../store/store";
import {
  fetchEquipments,
  createEquipment,
  updateEquipment,
  deleteEquipment,
} from "../../features/equipment/equipment-thunks";
import { apiFetch } from "../../utils/api";
import { BORROW_SERVICE_URL } from "../../utils/api-constants";
import { useNavigate } from "react-router-dom";

const ITEMS_PER_PAGE_OPTIONS = [5, 10, 20];

const EquipmentList: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [filteredEquipment, setFilteredEquipment] = useState<Equipment[]>([]);
  const [search, setSearch] = useState("");
  const [showAvailableOnly, setShowAvailableOnly] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Modal states
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedEquipment, setSelectedEquipment] = useState<Equipment | null>(
    null
  );

  const userRole = useSelector((state: RootState) => state.auth.role);
  const {
    items: equipment,
    loading,
    error,
  } = useSelector((state: RootState) => state.equipment);

  useEffect(() => {
    // Fetch the full list once; pagination and filtering are handled in the UI
    dispatch(fetchEquipments());
  }, [dispatch]);

  // Filter by name/category and availability. Recompute filtered list when
  // equipment, search or availability filter changes. Only reset current
  // page when the user changes filters (search or availability), not when
  // the equipment list updates from server (which would nudge page back to 1).
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
  }, [search, showAvailableOnly, equipment]);

  // When the user changes filters (search or available-only), reset to page 1.
  useEffect(() => {
    setCurrentPage(1);
  }, [search, showAvailableOnly]);

  // Compute pagination locally from filtered results
  const totalPages = Math.max(
    1,
    Math.ceil(filteredEquipment.length / itemsPerPage)
  );

  // Slice items for current page
  const pagedItems = filteredEquipment.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // If current page is out of range after filters/itemsPerPage change, clamp it
  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [totalPages, currentPage]);

  // Action handlers
  const navigate = useNavigate();

  const handleRequest = async (id: string) => {
    try {
      const item = equipment.find((e) => e._id === id);
      if (!item) return;

      // Call borrow-service to create a pending request
      await apiFetch(`${BORROW_SERVICE_URL}/borrow`, {
        method: 'POST',
        body: JSON.stringify({
          equipmentId: id,
          equipmentName: item.name,
          // userId will be set by borrow-service from the auth validate result if not provided
        }),
      });

      // Navigate to requests page so the new pending request is visible
      navigate('/requests');
    } catch (err) {
      console.error('Failed to create borrow request', err);
      const msg = err instanceof Error ? err.message : 'Failed to send request. Please try again.';
      alert(msg);
    }
  };

  const handleAdd = () => setShowAddModal(true);

  const handleEdit = (id: string) => {
    console.log("Handling edit for ID:", id);
    const equipmentItem = equipment.find((item: Equipment) => item._id === id);
    if (equipmentItem) {
      console.log("Found equipment to edit:", equipmentItem);
      setSelectedEquipment(equipmentItem);
      setShowEditModal(true);
    }
  };

  const handleDelete = (id: string) => {
    const equipmentItem = equipment.find((item: Equipment) => item._id === id);
    if (equipmentItem) {
      setSelectedEquipment(equipmentItem);
      setShowDeleteModal(true);
    }
  };

  const handleAddSubmit = async (formData: any) => {
    const result = await dispatch(createEquipment(formData));
    if (createEquipment.fulfilled.match(result)) {
      await dispatch(fetchEquipments());
      setShowAddModal(false);
    }
  };

  const handleEditSubmit = async (formData: any) => {
    if (selectedEquipment) {
      console.log("Submitting edit for equipment:", {
        id: selectedEquipment._id,
        data: formData,
      });

      const result = await dispatch(
        updateEquipment({
          id: selectedEquipment._id,
          equipment: formData,
        })
      );

      if (updateEquipment.fulfilled.match(result)) {
        await dispatch(fetchEquipments());
        setShowEditModal(false);
        setSelectedEquipment(null);
      }
    }
  };

  const handleDeleteConfirm = async () => {
    if (selectedEquipment) {
      console.log("Deleting equipment:", {
        id: selectedEquipment._id,
        equipment: selectedEquipment,
      });
      const result = await dispatch(deleteEquipment(selectedEquipment._id));
      if (deleteEquipment.fulfilled.match(result)) {
        await dispatch(fetchEquipments());
        setShowDeleteModal(false);
        setSelectedEquipment(null);
      }
    }
  };

  // Function to render empty state message
  const renderEmptyState = () => {
    if (error) {
      return (
        <div className="text-center mt-5">
          <div className="text-danger mb-3">
            <h4>Error Loading Equipment</h4>
            <p>{error}</p>
          </div>
          {userRole === "ADMIN" && (
            <Button variant="primary" onClick={handleAdd}>
              + Add New Equipment
            </Button>
          )}
        </div>
      );
    }

    if (!loading && filteredEquipment.length === 0) {
      if (search || showAvailableOnly) {
        return (
          <div className="text-center mt-5">
            <h4>No Equipment Found</h4>
            <p className="text-muted">Try adjusting your search or filters</p>
          </div>
        );
      }

      return (
        <div className="text-center mt-5">
          <h4>No Equipment Available</h4>
          <p className="text-muted">
            No equipment has been added to the system yet.
          </p>
          {userRole === "ADMIN" && (
            <Button variant="primary" onClick={handleAdd}>
              + Add First Equipment
            </Button>
          )}
        </div>
      );
    }

    return null;
  };

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
        <Col
          xs={12}
          md={6}
          className="d-flex justify-content-end align-items-center gap-3"
        >
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
          {renderEmptyState() || (
            <>
              <EquipmentTable
                equipment={pagedItems}
                userRole={userRole}
                onRequest={handleRequest}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />

              <PaginationComponent
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={(p) => {
                  // clamp page
                  const next = Math.max(1, Math.min(p, totalPages));
                  setCurrentPage(next);
                }}
                itemsPerPage={itemsPerPage}
                onItemsPerPageChange={(num) => {
                  setItemsPerPage(num);
                  setCurrentPage(1);
                }}
                options={ITEMS_PER_PAGE_OPTIONS}
              />
            </>
          )}
        </>
      )}

      {/* Add Equipment Modal */}
      <EquipmentForm
        show={showAddModal}
        onHide={() => setShowAddModal(false)}
        onSubmit={handleAddSubmit}
        title="Add New Equipment"
      />

      {/* Edit Equipment Modal */}
      {selectedEquipment && (
        <EquipmentForm
          show={showEditModal}
          onHide={() => {
            setShowEditModal(false);
            setSelectedEquipment(null);
          }}
          onSubmit={handleEditSubmit}
          initialData={{
            name: selectedEquipment.name,
            category: selectedEquipment.category,
            condition: selectedEquipment.condition,
            quantity: selectedEquipment.quantity,
            available: selectedEquipment.available,
          }}
          title={`Edit Equipment: ${selectedEquipment.name}`}
        />
      )}

      {/* Delete Confirmation Modal */}
      {selectedEquipment && (
        <DeleteConfirmation
          show={showDeleteModal}
          onHide={() => {
            setShowDeleteModal(false);
            setSelectedEquipment(null);
          }}
          onConfirm={handleDeleteConfirm}
          itemName={selectedEquipment.name}
        />
      )}
    </Container>
  );
};

export default EquipmentList;
