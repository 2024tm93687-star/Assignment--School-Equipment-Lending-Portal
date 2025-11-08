# Borrow Service

Borrow Service for the School Equipment Lending Portal. This microservice manages borrow/return requests and coordinates equipment availability with the Equipment Service. It relies on the Auth Service for JWT validation and role-based authorization.

## Key Features
- Create and manage borrow requests
- Approve / reject requests (staff/admin)
- Mark returns and automatically notify Equipment Service to update availability
- Student scope: students see only their requests; staff/admin can see all
- Seeds sample data if the collection is empty on startup

## Quick Summary
- Base URL (when running locally): http://localhost:3010
- Main endpoints: `/api/v1/borrow`, `/api/v1/borrow/:id/approve`, `/api/v1/borrow/:id/return`, `/api/v1/borrows`

## Environment
Create a `.env` or set these variables in your environment:

- `PORT` - port to run the server (default: `3010`)
- `MONGODB_URL` - MongoDB connection string (default: `mongodb://mongodb:27017/borrowdb`)
- `EQUIPMENT_SERVICE_URL` - URL to equipment service API (default: `http://equipment-service:3000/api/equipment`)
- `AUTH_SERVICE_URL` - URL to auth service (used by middleware) (default: `http://auth-service:8080`)

## How to Run

### Option A — Docker (recommended, no local Node/Mongo required)

From the repository root (this will build and start the service defined in `phase-1/docker-compose.yml`):

```bash
docker compose up --build borrow-service
```

Use `-d` to run in background and `docker compose down` to stop.

### Option B — Run locally (Node + Mongo)

```bash
cd phase-1/server/borrow-service
npm ci
# development with auto-reload
npm run dev
# or run production entry
npm start
```

Ensure MongoDB is running and reachable via `MONGODB_URL`. Also ensure the Auth Service is available so token validation works.

## API Reference

All endpoints below live under the service host (e.g. `http://localhost:3010`). Most endpoints require an Authorization header with a Bearer token issued by the Auth Service.

Common header:

```
Authorization: Bearer <JWT_TOKEN>
Content-Type: application/json
```

### 1) Create borrow request

- Method: POST
- Path: `/api/v1/borrow`
- Auth: required (any authenticated user)

Request body (examples):

```json
{
  "equipmentId": "642...",    // optional: equipment _id or any identifier
  "equipmentName": "Microscope",
  "issueDate": "2025-11-01T00:00:00.000Z", // optional (defaults to now)
  "dueDate": "2025-11-08T00:00:00.000Z",   // optional
  "remarks": "Needed for lab session"
}
```

If the authenticated user is available, the service will use `req.user.userId` and `req.user.username` (or `fullName`) as the borrower details; otherwise you can pass `userId` and `borrowerName` in the body.

Success response (201):

```json
{
  "message": "Borrow request created",
  "data": { /* saved borrow object */ }
}
```

Errors:
- 400 - overlapping booking or user already has a pending/approved copy
- 500 - server error

### 2) Approve / Reject a request

- Method: PUT
- Path: `/api/v1/borrow/:id/approve`
- Auth: required (staff/admin expected)

Request body:

```json
{ "status": "approved" } // or { "status": "rejected" }
```

Behavior:
- When approved, the service sets `issueDate` (if missing) and `dueDate` (default: 7 days after issue).
- On approval it attempts to decrement equipment `available` count by calling the Equipment Service (via `EQUIPMENT_SERVICE_URL`).

Success response (200):

```json
{ "message": "Request approved", "data": { /* updated borrow */ } }
```

### 3) Mark returned

- Method: PUT
- Path: `/api/v1/borrow/:id/return`
- Auth: required

Behavior:
- Sets `status` to `returned` and `returnDate` to now.
- Notifies Equipment Service to increment `available` for that equipment.

Success response (200):

```json
{ "message": "Marked returned", "data": { /* updated borrow */ } }
```

### 4) List borrows

- Method: GET
- Path: `/api/v1/borrows`
- Auth: required

Behavior:
- If the authenticated role is `STUDENT`, the endpoint returns only records for that user.
- Staff and Admin receive all borrow records.
- The service will mark overdue borrows (`approved` and past `dueDate`) as `overdue` before returning results.

Success response (200): Array of borrow objects

### Other useful endpoints

- `GET /api/test1` — simple health/test endpoint used in development
- `GET /` — root welcome message

## Data Model (request)

Fields stored (from `Models/requestModel.js`):

```js
{
  userId: Number,
  borrowerName: String,
  equipmentId: Mixed,   // may be ObjectId or other identifier
  equipmentName: String,
  status: String,       // pending | approved | rejected | returned | overdue
  issueDate: Date,
  dueDate: Date,
  returnDate: Date,
  remarks: String,
  approvedBy: Number,
  createdAt: Date
}
```

## Auth and Roles

This service relies on the Auth Service for token validation. Include the JWT in the `Authorization` header. The middleware will call the Auth Service's validate endpoint to verify tokens and attach `req.user` with fields like `userId`, `username`, and `role`.

## Seed Data
On first successful DB connection the service will attempt to seed a few sample borrow records if the collection is empty. This is helpful for development and UI testing.

## Troubleshooting
- If equipment availability updates fail on approve/return, borrow records are still updated locally; equipment adjustments are best-effort and logged.
- Ensure `EQUIPMENT_SERVICE_URL` and `AUTH_SERVICE_URL` are reachable from the service (Docker network or localhost depending on setup).

## Contact / Support
Open an issue in the repository or contact the project maintainer for help.
