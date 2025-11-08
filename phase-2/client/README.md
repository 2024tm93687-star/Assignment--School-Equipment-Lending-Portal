# Client (React + TypeScript + Vite)

Frontend for the School Equipment Lending Portal.

## Run locally (dev)

```bash
cd phase-2/client
npm install
npm run dev
```

Open: `http://localhost:5173`

The client expects the Auth API at `http://localhost:8080/api/auth`.

## Build (production)

```bash
cd phase-2/client
npm install
npm run build
npm run preview
```

## Run with Docker

Build and run just the client:

```bash
cd phase-2/client
docker build -t selp-client .
docker run --rm -p 5173:80 selp-client
```

Via root docker compose (recommended, runs API + client):

```bash
cd ../../
docker compose up --build
```

URLs:

- Client: `http://localhost:5173`
- Auth API: `http://localhost:8080/api/auth`

## Notes

- CORS: The API must allow `http://localhost:5173` in CORS config when running separately.
- Env/base URLs: The client uses hardcoded `http://localhost:8080/api/auth` in thunks; adjust if you change API port.
