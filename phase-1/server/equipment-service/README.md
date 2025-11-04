# Equipment Management Service
# AI Generated

## Overview
The Equipment Management Service is a crucial component of the School Equipment Lending Portal, responsible for managing the school's equipment inventory. This service provides secure, role-based access to equipment management operations, enabling administrators to maintain the equipment catalog while allowing staff and students to view available equipment.

## Features
- 🔐 Role-based access control (Admin, Staff, Student)
- 📦 Complete equipment lifecycle management
- 🔍 Advanced filtering and search capabilities
- 📊 Real-time equipment availability tracking
- 🔄 Automatic equipment ID generation
- ✅ Data validation and integrity checks

## Technical Stack
- Node.js (Runtime Environment)
- Express.js (Web Framework)
- MongoDB (Database)
- Winston (Logging)
- JWT (Authentication)
- Jest (Testing)

## API Endpoints

### Equipment Operations
All endpoints are prefixed with `/api/equipment`

#### Public Endpoints
- `GET /` - List all equipment
  - Query Parameters:
    - `name`: Filter by equipment name
    - `category`: Filter by category
    - `condition`: Filter by condition state
    - `available`: Filter by available quantity
  - Access: Admin, Staff, Student
  - Returns: Array of equipment items

#### Protected Endpoints (Admin Only)
- `POST /` - Add new equipment
  - Body: Equipment details
  - Access: Admin only
  - Returns: Created equipment object

- `PUT /:id` - Update equipment
  - Body: Updated equipment details
  - Access: Admin only
  - Returns: Updated equipment object

- `DELETE /:id` - Remove equipment
  - Access: Admin only
  - Returns: 204 No Content

### Data Models

#### Equipment Schema
```javascript
{
  equipmentId: Number,     // Auto-generated unique identifier
  name: String,           // Equipment name (required)
  category: String,       // Equipment category (required)
  condition: String,      // One of: ['new', 'good', 'fair', 'poor', 'damaged', 'retired']
  quantity: Number,       // Total quantity owned (min: 0)
  available: Number,     // Available quantity for lending (min: 0)
  _id : String          // database generated id
}
```

## Setup and Installation

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (v4.4 or higher)
- Auth Service running on port 8080

### Configuration
Create a `.env` file with the following variables:
```env
PORT=3000
MONGODB_URI=mongodb://localhost:27017/equipment_management
AUTH_SERVICE_URL=http://localhost:8080
```

### Installation Steps
```bash
# Clone the repository (if not already done)
git clone https://github.com/2024tm93687-star/Assignment--School-Equipment-Lending-Portal.git

# Navigate to equipment service
cd Assignment--School-Equipment-Lending-Portal/phase-1/server/equipment-service

# Install dependencies
npm install

# Start development server
npm run dev

# For production
npm start
```

## Authentication
- Uses JWT-based authentication
- Tokens must be obtained from the Auth Service
- Include token in Authorization header:
  ```
  Authorization: Bearer <your-jwt-token>
  ```

## Response Formats

### Success Responses
```json
// GET /api/equipment
{
  "data": [
    {
      "equipmentId": 1,
      "name": "Microscope",
      "category": "Lab Equipment",
      "condition": "good",
      "quantity": 10,
      "available": 8,
      "id": "68faa7297fdsd8dasd7",
      "createdAt" : "",
      "updatedAt" : ""
    }
  ]
}

// POST /api/equipment
{
  "equipmentId": 2,
  "name": "New Equipment",
  "category": "Category",
  "condition": "new",
  "quantity": 5,
  "available": 5
}
```

### Error Responses
```json
{
  "error": "Error message here",
  "details": "Optional additional details"
}
```

## Testing
```bash
# Run all tests
npm test

# Run specific test suite
npm test -- --grep "equipment"

# Run with coverage
npm run test:coverage
```

## Development

### Running in Development Mode
```bash
npm run dev
```

### Code Structure
```
src/
├── controllers/     # Request handlers
├── models/         # Database models
├── middleware/     # Custom middleware
├── routes/         # Route definitions
├── utils/          # Utilities and helpers
└── server.js       # Application entry point
```

## Support
For issues and support:
- Create an issue in the repository
- Contact the development team

## License
This project is part of the School Equipment Lending Portal assignment.

