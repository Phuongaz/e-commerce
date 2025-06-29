FROM node:18-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

# Set build-time environment variable
ARG VITE_BACKEND_URL=""
ENV VITE_BACKEND_URL=$VITE_BACKEND_URL

RUN npm run build

FROM nginx:alpine

COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Create admin directory structure and copy index.html
RUN mkdir -p /usr/share/nginx/html/admin && \
    cp /usr/share/nginx/html/index.html /usr/share/nginx/html/admin/ && \
    ln -sf /usr/share/nginx/html/assets /usr/share/nginx/html/admin/assets

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
