# syntax=docker/dockerfile:1
FROM php:8.3-fpm-alpine

# Install system dependencies
RUN apk add --no-cache \
    git curl bash icu-dev libpq-dev oniguruma-dev \
    libzip-dev zip unzip \
    shadow

# Install PHP extensions
RUN docker-php-ext-install pdo pdo_pgsql intl mbstring zip

# Install Composer
ENV COMPOSER_HOME=/tmp/composer
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

WORKDIR /var/www/html

# Copy application source (dev uses bind mount; this is a fallback)
COPY . .

# Ensure storage and bootstrap cache are writable
RUN mkdir -p storage bootstrap/cache \
    && chown -R www-data:www-data /var/www/html \
    && chmod -R 775 storage bootstrap/cache

# Copy entrypoint
COPY docker/php/entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

USER www-data

EXPOSE 9000

ENTRYPOINT ["/entrypoint.sh"]
CMD ["php-fpm"]
