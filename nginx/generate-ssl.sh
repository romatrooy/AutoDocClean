#!/bin/bash

# Создаем директорию для сертификатов, если она не существует
mkdir -p /etc/nginx/ssl

# Генерируем самоподписанный сертификат
openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
  -keyout /etc/nginx/ssl/nginx.key \
  -out /etc/nginx/ssl/nginx.crt \
  -subj "/CN=romatrooy-autodocclean-48e5.twc1.net" \
  -addext "subjectAltName=DNS:romatrooy-autodocclean-48e5.twc1.net"

# Устанавливаем правильные права
chmod 644 /etc/nginx/ssl/nginx.crt
chmod 600 /etc/nginx/ssl/nginx.key

# Сообщаем о завершении генерации
echo "SSL certificate generated successfully" 