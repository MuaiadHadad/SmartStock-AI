#!/usr/bin/env bash
set -euo pipefail
SCRIPT_DIR=$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)
ROOT_DIR=$(cd "$SCRIPT_DIR/.." && pwd)

cd "$ROOT_DIR"

docker compose pull --quiet || true

docker compose up -d --build

echo "\nServices running:"

docker compose ps

echo "API:       http://localhost:8080"
echo "Frontend:  http://localhost:3000"
echo "PgAdmin:   http://localhost:5050"

