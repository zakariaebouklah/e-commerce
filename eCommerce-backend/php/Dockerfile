FROM php:8.2-fpm-alpine

WORKDIR /var/www/html

RUN apk update && apk add libpq-dev

RUN docker-php-ext-configure pgsql -with-pgsql=/usr/local/pgsql

RUN docker-php-ext-install pdo pdo_pgsql

COPY .. .

RUN chown www-data:www-data var -R
RUN chown www-data:www-data public/uploads -R

COPY --from=composer:latest /usr/bin/composer /usr/local/bin/composer

RUN composer install --no-scripts

RUN php bin/console lexik:jwt:generate-keypair --overwrite
