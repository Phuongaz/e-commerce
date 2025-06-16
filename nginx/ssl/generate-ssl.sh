#!/bin/bash

# Generate SSL certificate and key
openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
  -keyout server.key -out server.crt \
  -subj "/C=VN/ST=Hanoi/L=Hanoi/O=Development/CN=localhost"

# Set proper permissions
chmod 600 server.key
chmod 644 server.crt 