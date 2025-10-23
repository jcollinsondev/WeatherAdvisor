# Build stage
FROM denoland/deno:2.5.0 AS builder
WORKDIR /app
COPY . .
RUN deno test

# Production stage
FROM denoland/deno:2.5.0
WORKDIR /app
COPY --from=builder /app .
EXPOSE 8080
CMD ["deno", "run", "--allow-net", "--allow-env", "./src/main.ts"]