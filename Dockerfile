FROM php:8.4-apache

# Install system packages and PHP extensions (added libgd-dev for GD/image support)
RUN apt-get update && apt-get install -y \
    git \
    unzip \
    curl \
    libpq-dev \
    libzip-dev \
    libonig-dev \
    libxml2-dev \
    libpng-dev \
    libjpeg-dev \
    libwebp-dev \
    zip \
    && docker-php-ext-configure gd --with-jpeg --with-webp \
    && docker-php-ext-install pdo pdo_mysql pdo_pgsql zip mbstring xml gd \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Enable Apache rewrite
RUN a2enmod rewrite

# Make Apache use port 10000 (Render default)
# FIXED: original had a broken line-break inside the sed command for sites-available
RUN sed -i 's/Listen 80/Listen 10000/g' /etc/apache2/ports.conf \
    && sed -i 's/<VirtualHost \*:80>/<VirtualHost *:10000>/g' /etc/apache2/sites-available/000-default.conf

# Set Laravel public as document root
RUN sed -i 's|/var/www/html|/var/www/html/public|g' /etc/apache2/sites-available/000-default.conf \
    && sed -i 's|/var/www/html|/var/www/html/public|g' /etc/apache2/apache2.conf

# Allow .htaccess for Laravel
RUN printf '<Directory /var/www/html/public>\n\
AllowOverride All\n\
Require all granted\n\
</Directory>\n' > /etc/apache2/conf-available/laravel.conf \
    && a2enconf laravel

# Install Node.js 20
RUN curl -fsSL https://deb.nodesource.com/setup_20.x | bash - && apt-get install -y nodejs

# Install Composer
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

# Set working directory
WORKDIR /var/www/html

# Copy Laravel app
COPY . .

# Rename env → .env so Laravel can read it at build time
# (your file is named "env" not ".env")
RUN cp .env.example .env
# Install PHP dependencies
RUN composer install --no-dev --optimize-autoloader --no-interaction
RUN php artisan key:generate
# Install frontend dependencies and build assets
RUN npm install && npm run build

# Clear cached configs (important: do AFTER build so config is fresh)
RUN php artisan config:clear \
    && php artisan route:clear \
    && php artisan view:clear

# Create storage symlink
RUN php artisan storage:link || true

# Fix permissions — includes storage/logs and the full storage tree
RUN mkdir -p storage/framework/cache \
              storage/framework/sessions \
              storage/framework/views \
              storage/logs \
              bootstrap/cache \
              public/uploads \
    && chown -R www-data:www-data storage bootstrap/cache public/uploads \
    && chmod -R 775 storage bootstrap/cache public/uploads

# Migrations run at container startup (not build time) via CMD entrypoint
# so the real DB credentials from Render env vars are available

EXPOSE 10000

# Use an entrypoint script to run migrations then start Apache
COPY docker-entrypoint.sh /usr/local/bin/docker-entrypoint.sh
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

CMD ["/usr/local/bin/docker-entrypoint.sh"]
