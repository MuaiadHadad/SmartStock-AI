#!/usr/bin/env bash
set -euo pipefail

cd /var/www/html

# Ensure .env exists
if [ ! -f .env ]; then
  cp .env.example .env || true
fi

# Ensure writable directories
mkdir -p storage bootstrap/cache
chown -R www-data:www-data storage bootstrap/cache || true
chmod -R 775 storage bootstrap/cache || true

# Install dependencies if vendor missing
if [ ! -f vendor/autoload.php ]; then
  echo "[entrypoint] Installing Composer dependencies..."
  composer install --no-interaction --prefer-dist
fi

# Generate app key if not set
if ! grep -q "^APP_KEY=" .env || [ -z "$(grep "^APP_KEY=" .env | cut -d'=' -f2-)" ]; then
  php artisan key:generate --force || true
fi

# Optimize and run migrations (safe on dev)
php artisan config:clear || true
php artisan cache:clear || true
php artisan route:clear || true
php artisan view:clear || true

php artisan migrate --force --no-interaction || true

exec "$@"

