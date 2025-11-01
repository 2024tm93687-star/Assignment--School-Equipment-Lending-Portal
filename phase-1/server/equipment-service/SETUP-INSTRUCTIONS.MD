# Equipment Service Setup Instructions
# AI Generated

## Prerequisites

1. Install Node.js
   - Download Node.js v14 or higher from https://nodejs.org/
   - Install with default settings
   - Verify installation:
     ```bash
     node --version
     npm --version
     ```

2. Install MongoDB
   - Download MongoDB Community Server from https://www.mongodb.com/try/download/community
   - Install with default settings
   - Add MongoDB bin folder to PATH if not done automatically
   - Verify installation:
     ```bash
     mongod --version
     ```

3. Start MongoDB Service
   - Windows:
     ```powershell
     # Check if MongoDB service is running
     Get-Service MongoDB
     
     # Start MongoDB if not running
     Start-Service MongoDB
     ```
   - Linux/Mac:
     ```bash
     mongod
     ```

## Installation Steps

1. Clone the Repository
   ```bash
   git clone https://github.com/2024tm93687-star/Assignment--School-Equipment-Lending-Portal.git
   cd Assignment--School-Equipment-Lending-Portal/phase-1/server/equipment-service
   ```

2. Install Dependencies
   ```bash
   npm install
   ```

3. Configure Environment
   Create a new file named `.env` in the equipment-service directory:
   ```env
   PORT=3000
   MONGODB_URI=mongodb://localhost:27017/equipment_management
   AUTH_SERVICE_URL=http://localhost:8080
   ```

4. Verify Auth Service
   - Ensure auth-service is running on port 8080
   - Test auth-service connection:
     ```bash
     curl http://localhost:8080/api/auth/health
     ```

5. Start the Service
   Development mode (with auto-reload):
   ```bash
   npm run dev
   ```
   
   Production mode:
   ```bash
   npm start
   ```

## Verification Steps

1. Check Service Status
   ```bash
   curl http://localhost:3000/health
   ```

2. Test Authentication
   ```bash
   # Get a token from auth-service first
   curl -X POST http://localhost:8080/api/auth/login \
     -H "Content-Type: application/json" \
     -d '{"username": "admin", "password": "admin123"}'

   # Use the token to test equipment-service
   curl http://localhost:3000/api/equipment \
     -H "Authorization: Bearer <your-token>"
   ```

## Common Issues and Solutions

1. Port Already in Use
   ```bash
   # Find process using port 3000
   netstat -ano | findstr :3000
   
   # Kill the process
   taskkill /PID <process_id> /F
   ```

2. MongoDB Connection Issues
   - Check MongoDB is running:
     ```bash
     # Windows
     Get-Service MongoDB
     
     # Linux/Mac
     ps aux | grep mongod
     ```
   - Verify connection string in .env file
   - Check MongoDB logs:
     ```bash
     # Windows
     type "C:\Program Files\MongoDB\Server\[version]\log\mongod.log"
     ```

3. Auth Service Connection Issues
   - Verify AUTH_SERVICE_URL in .env
   - Check auth-service logs
   - Ensure network allows connection between services

## Testing

Run the test suite:
```bash
npm test
```

Run specific tests:
```bash
npm test -- --grep "equipment"
```

## Directory Structure
```
equipment-service/
├── src/
│   ├── controllers/
│   │   └── equipment.controller.js
│   ├── models/
│   │   ├── equipment.model.js
│   │   └── counter.model.js
│   ├── middleware/
│   │   └── authentication.js
│   ├── routes/
│   │   └── equipment.routes.js
│   ├── utils/
│   │   └── logger.js
│   └── server.js
├── .env
├── package.json
└── README.md
```