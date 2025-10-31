# Assignment--School-Equipment-Lending-Portal

A **web-based portal** for managing and tracking school equipment lending. The portal allows students, staff, and administrators to request, approve, and monitor equipment efficiently.

## Run with Docker Compose

From the repository root:

```bash
docker compose up --build
```

Services and ports:

- Auth Service (Spring Boot): http://localhost:8080/api/auth
- Client (Vite build served by Nginx): http://localhost:5173

Useful commands:

- Start detached: `docker compose up --build -d`
- View logs: `docker compose logs -f`
- Rebuild a single service: `docker compose build auth-service` or `docker compose build client`
- Stop and remove containers: `docker compose down`

Notes:

- The client is configured to call the auth API at `http://localhost:8080/api/auth`.
- Ensure port 8080 and 5173 are free on your machine.
