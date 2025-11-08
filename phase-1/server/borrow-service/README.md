# Borrow Service

Borrow service for School Equipment Lending Portal.

## Features
- JWT validation via Auth Service (/api/auth/validate)
- Endpoints
  - POST /api/v1/borrow - create borrow request (authenticated)
  - PUT /api/v1/borrow/:id/approve - approve/reject (staff/admin)
  - GET /api/v1/borrows - list borrows (students see own, staff/admin see all)

## Environment
- MONGODB_URL - mongodb connection string (defaults to mongodb://mongodb:27017/borrowdb)
- AUTH_SERVICE_URL - URL to auth service (defaults to http://auth-service:8080)
- PORT - port to run server (defaults to 3010)

## Seed Data
On startup the service will seed a couple of sample borrow records if the collection is empty.

## Docker
A Dockerfile is included. The compose file in the project `phase-1/docker-compose.yml` includes the service as `borrow-service`.

## Running Locally
Install dependencies and start:

```powershell
cd phase-1\server\borrow-service
npm ci
npm start
```

## Notes
- The service expects the client to send `borrowerName` and `equipmentName` when creating a borrow request so that the UI can display readable names without requiring additional cross-service calls.
- Authentication middleware delegates token validation to the Auth Service's `/api/auth/validate` endpoint and enforces method-based role access.
