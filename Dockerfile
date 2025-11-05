# ================================
# Multi-stage Dockerfile for Next.js 15
# ================================
# This creates an optimized production image (~100MB vs ~1GB)
# Environment variables are injected at runtime, not build time

# ================================
# Stage 1: Dependencies
# ================================
# Install only the dependencies needed for building
FROM node:20-alpine AS deps

# Install libc6-compat for compatibility with some npm packages on Alpine
RUN apk add --no-cache libc6-compat

WORKDIR /app

# Copy package files
COPY package.json package-lock.json ./

# Install dependencies (including devDependencies needed for build)
RUN npm ci

# ================================
# Stage 2: Builder
# ================================
# Build the Next.js application
FROM node:20-alpine AS builder

WORKDIR /app

# Copy dependencies from deps stage
COPY --from=deps /app/node_modules ./node_modules

# Copy all source files
COPY . .

# Build the Next.js app
# Note: Environment variables needed at build time (NEXT_PUBLIC_*) 
# should be passed as build args if needed, but API calls happen at runtime
RUN npm run build

# ================================
# Stage 3: Runner
# ================================
# Create the final production image with only what's needed to run
FROM node:20-alpine AS runner

WORKDIR /app

# Set to production environment
ENV NODE_ENV=production

# Don't run as root user (security best practice)
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy only necessary files from builder
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./package.json

# Copy the built Next.js application
COPY --from=builder --chown=nextjs:nodejs /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules

# Switch to non-root user
USER nextjs

# Expose port 3000
EXPOSE 3000

# Set the port Next.js will listen on
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Start the Next.js production server
CMD ["npm", "start"]

# ================================
# HOW TO USE THIS DOCKERFILE
# ================================
#
# Build the image:
#   docker build -t stocks-app .
#
# Run the container (using your .env file):
#   docker run -p 3000:3000 --env-file .env stocks-app
#
# Run with individual environment variables:
#   docker run -p 3000:3000 \
#     -e MONGODB_URI="your_mongodb_uri" \
#     -e FINNHUB_API_KEY="your_key" \
#     -e NEXT_PUBLIC_FINNHUB_API_KEY="your_key" \
#     stocks-app
#
# Access the app at: http://localhost:3000

