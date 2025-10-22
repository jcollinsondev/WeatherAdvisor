# Build stage
FROM denoland/deno:2.5.0 AS builder
WORKDIR /app
COPY . .
RUN deno cache ./src/main.ts

# Production stage
FROM denoland/deno:2.5.0
WORKDIR /app
COPY --from=builder /app .
EXPOSE 8000
CMD ["deno", "run", "--allow-net", "./src/main.ts"]