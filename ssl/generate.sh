#!/bin/bash

# Генерируем секретный ключ
openssl genrsa -out key.pem 2048

# Создаем запрос на подпись сертификата
openssl req -new -sha256 -key key.pem -out csr.pem

# Создаем "самоподписанный" публичный ключ
openssl x509 -req -in csr.pem -signkey key.pem -out cert.pem