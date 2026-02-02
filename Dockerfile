# Multi-stage build for optimal image size
# Stage 1: Dependencies
FROM ubuntu:24.04 AS deps

# Install Node.js 20.x and build dependencies
RUN apt-get update && apt-get install -y \
    curl \
    ca-certificates \
    gnupg \
    && mkdir -p /etc/apt/keyrings \
    && curl -fsSL https://deb.nodesource.com/gpgkey/nodesource-repo.gpg.key | gpg --dearmor -o /etc/apt/keyrings/nodesource.gpg \
    && echo "deb [signed-by=/etc/apt/keyrings/nodesource.gpg] https://deb.nodesource.com/node_20.x nodistro main" | tee /etc/apt/sources.list.d/nodesource.list \
    && apt-get update \
    && apt-get install -y nodejs \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production && \
    npm cache clean --force

# Stage 2: Builder
FROM ubuntu:24.04 AS builder

# Install Node.js 20.x
RUN apt-get update && apt-get install -y \
    curl \
    ca-certificates \
    gnupg \
    && mkdir -p /etc/apt/keyrings \
    && curl -fsSL https://deb.nodesource.com/gpgkey/nodesource-repo.gpg.key | gpg --dearmor -o /etc/apt/keyrings/nodesource.gpg \
    && echo "deb [signed-by=/etc/apt/keyrings/nodesource.gpg] https://deb.nodesource.com/node_20.x nodistro main" | tee /etc/apt/sources.list.d/nodesource.list \
    && apt-get update \
    && apt-get install -y nodejs \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy package files and install all dependencies (including dev)
COPY package*.json ./
RUN npm ci

# Copy application source
COPY . .

# Ensure public directory exists
RUN mkdir -p ./public

# Build the Next.js application
# Set NODE_ENV to production for optimal build
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

RUN npm run build

# Stage 3: Runner
FROM ubuntu:24.04 AS runner

# Install Node.js 20.x and PostgreSQL client (for migrations)
RUN apt-get update && apt-get install -y \
    curl \
    ca-certificates \
    gnupg \
    postgresql-client \
    && mkdir -p /etc/apt/keyrings \
    && curl -fsSL https://deb.nodesource.com/gpgkey/nodesource-repo.gpg.key | gpg --dearmor -o /etc/apt/keyrings/nodesource.gpg \
    && echo "deb [signed-by=/etc/apt/keyrings/nodesource.gpg] https://deb.nodesource.com/node_20.x nodistro main" | tee /etc/apt/sources.list.d/nodesource.list \
    && apt-get update \
    && apt-get install -y nodejs \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Create non-root user for security
RUN groupadd -r pgnexus && useradd -r -g pgnexus pgnexus

# Copy dependencies from deps stage
COPY --from=deps --chown=pgnexus:pgnexus /app/node_modules ./node_modules

# Copy built application from builder stage
COPY --from=builder --chown=pgnexus:pgnexus /app/.next ./.next
COPY --from=builder --chown=pgnexus:pgnexus /app/public ./public
COPY --from=builder --chown=pgnexus:pgnexus /app/package*.json ./
COPY --from=builder --chown=pgnexus:pgnexus /app/next.config.* ./

# Copy migration scripts and SQL files
COPY --chown=pgnexus:pgnexus migrations ./migrations
COPY --chown=pgnexus:pgnexus scripts ./scripts
COPY --chown=pgnexus:pgnexus tsconfig.json ./

# Copy content directory for daily updates
COPY --chown=pgnexus:pgnexus content ./content

# Copy entrypoint script
COPY --chown=pgnexus:pgnexus docker-entrypoint.sh /usr/local/bin/
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

# Set environment variables
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Expose port (default 3000, can be overridden)
EXPOSE 3000

# Switch to non-root user
USER pgnexus

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=60s --retries=3 \
    CMD node -e "require('http').get('http://localhost:3000/api/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

# Set entrypoint
ENTRYPOINT ["/usr/local/bin/docker-entrypoint.sh"]

# Default command
CMD ["npm", "start"]
