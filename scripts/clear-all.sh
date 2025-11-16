#!/usr/bin/env bash
set -euo pipefail
SCRIPT_DIR=$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)
ROOT_DIR=$(cd "$SCRIPT_DIR/.." && pwd)

# Clear backend caches
"$ROOT_DIR/scripts/clear.sh" || true

# Clear frontend caches
"$ROOT_DIR/scripts/clear-frontend.sh" || true

# Optionally prune dangling images/volumes (commented by default)
# docker system prune -f || true

echo "All caches cleared."

