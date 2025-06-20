FROM node:18-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

# Stage production: serve static files với một web server nhẹ (ví dụ nginx hoặc serve)
FROM nginx:alpine

COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 3000
CMD ["nginx", "-g", "daemon off;"]
