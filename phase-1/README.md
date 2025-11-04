# Assignment--School-Equipment-Lending-Portal

A **web-based portal** for managing and tracking school equipment lending. The portal allows students, staff, and administrators to request, approve, and monitor equipment efficiently.

## Environment Setup

Before running the application, you need to set up environment variables for each service:

### 1. Client (.env in /client)

Create a `.env` file in the `client` directory:

```bash
# Client environment variables
VITE_AUTH_SERVICE_URL=http://localhost:8080/api/auth
VITE_EQUIPMENT_SERVICE_URL=http://localhost:3000/api/equipment
```

### 2. Equipment Service (.env in /server/equipment-service)

Create a `.env` file in the `server/equipment-service` directory:

```bash
# Equipment service environment variables
PORT=3000
MONGODB_URI=mongodb://localhost:27017/equipment_management
AUTH_SERVICE_URL=http://localhost:8080
```

### 3. Auth Service (application.properties in /server/auth-service/src/main/resources)

The auth service configuration is already set in `application.properties`. Default values:

- Server port: 8080
- H2 Database: In-memory
- JWT Secret: Auto-generated

## Run with Docker Compose

From the phase repository:

```bash
# Build and start all services
docker compose up --build

# Or start in detached mode
docker compose up --build -d
```

Services and ports:

- Auth Service (Spring Boot): http://localhost:8080/api/auth
- Equipment Service (Node.js): http://localhost:3000/api/equipment
- Client (Vite build served by Nginx): http://localhost:5173

Useful commands:

- View logs: `docker compose logs -f`
- View specific service logs: `docker compose logs -f [service-name]`
- Rebuild a single service: `docker compose build [service-name]`
- Stop and remove containers: `docker compose down`
- Stop and remove containers with volumes: `docker compose down -v`

Notes:

- The client is configured to communicate with both auth and equipment services
- Default user credentials:
  - Admin: username: `admin`, password: `admin123`
  - Staff: username: `staff`, password: `staff123`
  - Student: username: `student`, password: `student123`
- Ensure ports 8080, 3000, and 5173 are free on your machine
- MongoDB data is persisted in a Docker volume
