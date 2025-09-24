# Multi-stage build for Astro static site
FROM node:22-alpine AS builder

# Enable corepack and install latest pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

# Set working directory
WORKDIR /app

# Copy package files first for better caching
COPY package.json pnpm-lock.yaml ./

# Install all dependencies (including devDependencies for build)
RUN pnpm install --frozen-lockfile

# Copy source code
COPY . .

# Build the static site
RUN pnpm run build

# Production stage - serve with nginx
FROM nginx:alpine

# Copy built static files from builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Use default nginx configuration

# Expose port (Coolify will handle port mapping)
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]