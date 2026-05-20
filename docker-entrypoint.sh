#!/bin/bash
set -e

# At runtime on Render, env vars are injected directly into the process environment.
# Laravel reads them automatically via $_ENV / getenv() — no .env file needed.

echo "==> Running migrations..."
php artisan migrate --force || echo "[WARN] Migration failed — check DB credentials"

echo "==> Caching config, routes, views for production..."
php artisan config:cache
php artisan route:cache
php artisan view:cache

echo "==> Starting Apache on port 10000..."
exec apache2-foreground
