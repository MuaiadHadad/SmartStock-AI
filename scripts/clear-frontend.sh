#!/usr/bin/env bash
set -euo pipefail
SCRIPT_DIR=$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)
ROOT_DIR=$(cd "$SCRIPT_DIR/.." && pwd)

cd "$ROOT_DIR/public/smartstock-frontend"

rm -rf .next .turbo || true

echo "Frontend caches removed (.next, .turbo)."

