# Equipment Service

## Overview
The Equipment Service is a microservice component of the School Equipment Lending Portal. It manages the equipment inventory, handling CRUD operations for equipment items and their availability status.


## Technical Stack
- Node.js
- Express.js
- MongoDB
- RESTful API

## API Endpoints

### Equipment Operations
- `GET /api/equipment` - List all equipment
### - `GET /api/equipment/{id}` - Get equipment details //not implemented
- `POST /api/equipment` - Add new equipment
- `PUT /api/equipment/{id}` - Update equipment details
- `DELETE /api/equipment/{id}` - Remove equipment



## Configuration
Create a `.env` file with the following variables:
```
PORT=3000
MONGODB_URL=
AUTH_SERVICE_URL=http://localhost:8080
```

## Installation
```bash
cd to equipment-service
npm install
npm run dev
```

## Testing
```bash
npm test
```

