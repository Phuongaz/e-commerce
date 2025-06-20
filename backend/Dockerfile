# syntax=docker/dockerfile:1
FROM golang:1.23-alpine AS builder

WORKDIR /app

COPY go.mod go.sum ./
RUN go mod download

COPY . .
COPY .env .

RUN go build -o main .

FROM alpine:latest
WORKDIR /app

COPY --from=builder /app/main .
COPY --from=builder /app/.env .

EXPOSE 8081

CMD ["./main"]
