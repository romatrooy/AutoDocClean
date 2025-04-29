FROM nginx:latest

# Установка необходимых пакетов
RUN apt-get update && \
    apt-get install -y openssl && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

# Создание директории для SSL
RUN mkdir -p /etc/nginx/ssl

# Копирование файлов конфигурации
COPY default.conf /etc/nginx/conf.d/default.conf

# Скрипт для генерации SSL-сертификата и запуска Nginx
RUN echo '#!/bin/bash \n\
if [ ! -f /etc/nginx/ssl/nginx.key ]; then \n\
    echo "Generating self-signed SSL certificate..." \n\
    openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
    -keyout /etc/nginx/ssl/nginx.key \
    -out /etc/nginx/ssl/nginx.crt \
    -subj "/C=RU/ST=Moscow/L=Moscow/O=Timeweb/OU=Cloud/CN=romatrooy-autodocclean-48e5.twc1.net" \n\
fi \n\
echo "Starting Nginx..." \n\
exec nginx -g "daemon off;" \
' > /docker-entrypoint.sh && chmod +x /docker-entrypoint.sh

# Установка точки входа
ENTRYPOINT ["/docker-entrypoint.sh"] 