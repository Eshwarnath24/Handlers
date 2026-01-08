FROM oven/bun:1.1.6

WORKDIR /app

# Copy dependency definitions
COPY package.json bun.lock ./

# Install dependencies
RUN bun install

# Copy source code
COPY . .

# Expose the port defined in server.ts
EXPOSE 3000

# Start the application
CMD ["bun", "run", "start"]