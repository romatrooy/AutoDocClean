FROM nginx:1.25-alpine

# Устанавливаем OpenSSL для генерации сертификатов
RUN apk add --no-cache openssl bash

# Создаем директорию для сертификатов
RUN mkdir -p /etc/nginx/ssl

# Копируем конфиг и скрипт для генерации SSL
COPY default.conf /etc/nginx/conf.d/
COPY generate-ssl.sh /

# Делаем скрипт исполняемым
RUN chmod +x /generate-ssl.sh

# Генерируем самоподписанные сертификаты при запуске
CMD ["/bin/bash", "-c", "/generate-ssl.sh && nginx -g 'daemon off;'"] 