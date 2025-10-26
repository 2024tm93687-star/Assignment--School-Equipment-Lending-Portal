export const EQUIPMENT_LIST_MOCK = [
  { id: "eq-001", name: "Microscope", category: "Lab", condition: "Good", quantity: 5, available: 3 },
  { id: "eq-002", name: "Football", category: "Sports", condition: "New", quantity: 10, available: 10 },
  { id: "eq-003", name: "Camera", category: "Media", condition: "Fair", quantity: 2, available: 0 },
  { id: "eq-004", name: "Projector", category: "Classroom", condition: "Good", quantity: 3, available: 1 },
  { id: "eq-005", name: "Guitar", category: "Music", condition: "Excellent", quantity: 4, available: 2 },
  { id: "eq-006", name: "Volleyball", category: "Sports", condition: "Good", quantity: 6, available: 4 },
  { id: "eq-007", name: "Test Tube Set", category: "Lab", condition: "Good", quantity: 12, available: 8 },
  { id: "eq-008", name: "Keyboard", category: "Music", condition: "Fair", quantity: 3, available: 1 },
];

// Mock requests with due dates
export const REQUESTS_MOCK = [
  { id: "req-001", equipment: "Microscope", requester: "student1", role: "student", status: "Pending", dueDate: "2025-11-05" },
  { id: "req-002", equipment: "Football", requester: "student2", role: "student", status: "Approved", dueDate: "2025-11-10" },
  { id: "req-003", equipment: "Camera", requester: "staff1", role: "staff", status: "Returned", dueDate: "2025-10-28" },
  { id: "req-004", equipment: "Projector", requester: "staff2", role: "staff", status: "Pending", dueDate: "2025-11-01" },
];