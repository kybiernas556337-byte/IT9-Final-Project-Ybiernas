#!/bin/bash
set -e

# Clear cached config so Render env vars are used fresh
php artisan config:clear
php artisan route:clear
php artisan view:clear

echo "==> Running migrations..."
php artisan migrate --force || echo "[WARN] Migration failed — check DB credentials"

echo "==> Caching config, routes, views for production..."
php artisan config:cache
php artisan route:cache
php artisan view:cache

echo "==> Starting Apache on port 10000..."
exec apache2-foreground
