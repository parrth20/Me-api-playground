# ME API Playground — Assignment

---

## Overview

This repository contains a small backend application (Flask) used to demonstrate building and running an API with Docker. The screenshots above show the Docker Desktop containers running (backend started) and a successful `POST` request in Postman (201 Created). Use this README to build, run, test, and troubleshoot the assignment.

## Contents

* `backend/` — Flask backend (API) code
* `docker-compose.yml` — Docker Compose configuration to run the app and any dependent services (e.g. Postgres)
* `Dockerfile` — Dockerfile for the backend service
* `screenshots/` — (Not included) Folder to store the example screenshots (see below)

> **Note:** I provided two screenshots in the development container at:
>
> * `/mnt/data/Screenshot 2025-08-29 at 11.27.54 AM.png`
> * `/mnt/data/Screenshot 2025-08-29 at 11.37.18 AM.png`
>
> To display them in this README, copy/rename them into this repo under `./screenshots/` as:
>
> ```text
<img width="1440" height="900" alt="Screenshot 2025-08-29 at 11 37 18 AM" src="https://github.com/user-attachments/assets/b8388393-6d77-4c7b-a069-99657bc62276" />
<img width="1440" height="900" alt="Screenshot 2025-08-29 at 11 37 26 AM" src="https://github.com/user-attachments/assets/01e7dbf1-e418-47d8-8dca-ff6c1bdf6059" />> ```

---

## Prerequisites

* Docker (Desktop or Engine) installed and running
* Docker Compose (usually bundled with Docker Desktop)
* Optional: Postman or curl for testing the API

---

## Quick start (Docker Compose)

1. Build and start the services:

```bash
# from repository root
docker compose up --build
```

2. Open Docker Desktop to check containers, or run `docker ps`.

3. The backend should be exposed on the port configured in `docker-compose.yml` (common example: `5000`).

4. Test the API using Postman or curl (example below).

---

## Example API request (create profile)

Use Postman or curl to POST JSON to the `/profiles` endpoint. Example with `curl`:

```bash
curl -X POST http://localhost:5001/profiles \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Parth",
    "email": "parth+2@example.com",
    "headline": "Backend dev",
    "skills":["python","flask","postgres"],
    "projects":[{"title":"New Project","description":"Testing via Docker","links":["https://github.com/parth"]}],
    "links":{"github":"https://github.com/parth"}
  }'
```

You should receive a `201 Created` response if the item is created successfully (the Postman screenshot shows exactly that).

---

## Troubleshooting

### `Error response from daemon: Ports are not available: exposing port TCP 0.0.0.0:5000 -> 127.0.0.1:0: listen tcp 0.0.0.0:5000: bind: address already in use`

This error means port `5000` (or whichever port you mapped) is already used on your host. Options to fix:

1. **Stop the process using that port** (Linux/macOS):

```bash
# find the PID listening on port 5000
lsof -i :5001
# or
sudo lsof -nP -iTCP -sTCP:LISTEN | grep 5000

# kill the pid (replace <PID>)
kill -9 <PID>
```

2. **Change host port mapping** in `docker-compose.yml` (e.g. map host `5001` to container `5000`):

```yaml
services:
  backend:
    ports:
      - "5001:5000" # host:container
```

3. **Stop other Docker containers** that may already map the same host port:

```bash
docker ps
docker stop <container-id>
```

### Common logs to check

* Container logs: `docker compose logs backend --follow` or `docker logs <container-id>`
* Docker Desktop -> Containers view (shows health, CPU, memory and last logs)

---

## Development notes

* If you make code changes in the backend, rebuild the image with `docker compose build backend` and restart.
* You can also use `docker compose up --build --force-recreate` to ensure a fresh container.

## Useful commands

```bash
# stop and remove containers
docker compose down

# list containers
docker ps

docker compose logs -f

# run a one-off shell in the backend container (if image built)
docker compose run --rm backend /bin/sh
```

---

## Files you might want to check

* `app.py` (or entrypoint) — Flask app routes and handlers
* `requirements.txt` (or `pyproject.toml`) — dependencies
* `Dockerfile` — how the image is built
* `docker-compose.yml` — service definitions and port mappings

---

## Screenshots / Visual proof

The two screenshots embedded at the top are provided to visually prove the assignment works:

1. `screenshot-docker.png` — shows Docker Desktop with the backend container up (and a terminal showing an error if the port is in use). This demonstrates how Docker is being used.
2. `screenshot-postman.png` — shows Postman with a `POST` request returning `201 CREATED`. This demonstrates the API is working.

---

## License

This project is provided under the MIT License. See `LICENSE` for details.

---

## Contact / Author

Parth — feel free to reach out if you want the README adjusted, additional examples, or a CI workflow to automatically build and push images.
