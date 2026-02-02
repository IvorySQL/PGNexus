#!/bin/bash
set -e

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}  PGNexus Docker Container Starting${NC}"
echo -e "${GREEN}========================================${NC}"

# Function to log messages
log_info() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

log_warn() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# ===========================================
# Environment Variable Configuration
# ===========================================

# Set default values for optional variables
export PORT="${PORT:-3000}"
export HOSTNAME="${HOSTNAME:-0.0.0.0}"
export NODE_ENV="${NODE_ENV:-production}"

log_info "Configuration:"
log_info "  PORT: $PORT"
log_info "  HOSTNAME: $HOSTNAME"
log_info "  NODE_ENV: $NODE_ENV"

# ===========================================
# Database Configuration
# ===========================================

# Build DATABASE_URL if individual components are provided
if [ -n "$PG_HOST" ] && [ -n "$PG_USER" ] && [ -n "$PG_DB" ]; then
    PG_PORT="${PG_PORT:-5432}"
    PG_PASSWORD="${PG_PASSWORD:-}"
    PG_SCHEMA="${PG_SCHEMA:-public}"

    # Build connection string
    if [ -n "$PG_PASSWORD" ]; then
        export DATABASE_URL="postgresql://${PG_USER}:${PG_PASSWORD}@${PG_HOST}:${PG_PORT}/${PG_DB}?schema=${PG_SCHEMA}"
    else
        export DATABASE_URL="postgresql://${PG_USER}@${PG_HOST}:${PG_PORT}/${PG_DB}?schema=${PG_SCHEMA}"
    fi

    log_info "Database connection built from components"
    log_info "  Host: $PG_HOST"
    log_info "  Port: $PG_PORT"
    log_info "  Database: $PG_DB"
    log_info "  User: $PG_USER"
    log_info "  Schema: $PG_SCHEMA"
fi

# Validate DATABASE_URL
if [ -z "$DATABASE_URL" ]; then
    log_error "DATABASE_URL is not set!"
    log_error "Please provide either:"
    log_error "  1. DATABASE_URL environment variable, OR"
    log_error "  2. PG_HOST, PG_USER, PG_DB (and optionally PG_PORT, PG_PASSWORD, PG_SCHEMA)"
    exit 1
fi

# ===========================================
# NextAuth Configuration
# ===========================================

# Validate NEXTAUTH_SECRET
if [ -z "$NEXTAUTH_SECRET" ]; then
    log_error "NEXTAUTH_SECRET is not set!"
    log_error "Generate one with: openssl rand -base64 32"
    exit 1
fi

# Set NEXTAUTH_URL with fallback
if [ -z "$NEXTAUTH_URL" ]; then
    export NEXTAUTH_URL="http://localhost:${PORT}"
    log_warn "NEXTAUTH_URL not set, using default: $NEXTAUTH_URL"
    log_warn "For production, set NEXTAUTH_URL to your public domain (e.g., https://yourdomain.com)"
else
    log_info "NEXTAUTH_URL: $NEXTAUTH_URL"
fi

# ===========================================
# Wait for Database
# ===========================================

log_info "Waiting for database to be ready..."

# Extract database connection details for pg_isready
DB_HOST=$(echo $DATABASE_URL | sed -n 's/.*@\([^:]*\).*/\1/p')
DB_PORT=$(echo $DATABASE_URL | sed -n 's/.*:\([0-9]*\)\/.*/\1/p')

if [ -z "$DB_PORT" ]; then
    DB_PORT=5432
fi

MAX_RETRIES=30
RETRY_COUNT=0

while [ $RETRY_COUNT -lt $MAX_RETRIES ]; do
    if pg_isready -h "$DB_HOST" -p "$DB_PORT" > /dev/null 2>&1; then
        log_info "Database is ready!"
        break
    fi

    RETRY_COUNT=$((RETRY_COUNT + 1))
    log_warn "Database not ready yet (attempt $RETRY_COUNT/$MAX_RETRIES), waiting..."
    sleep 2
done

if [ $RETRY_COUNT -eq $MAX_RETRIES ]; then
    log_error "Database did not become ready in time!"
    exit 1
fi

# ===========================================
# Run Database Migrations
# ===========================================

if [ "${SKIP_MIGRATIONS}" != "true" ]; then
    log_info "Running database migrations..."

    if npm run migrate; then
        log_info "Migrations completed successfully!"
    else
        log_error "Migrations failed!"
        exit 1
    fi
else
    log_warn "Skipping migrations (SKIP_MIGRATIONS=true)"
fi

# ===========================================
# Start Application
# ===========================================

log_info "Starting PGNexus application..."
log_info "Application will be available at: http://${HOSTNAME}:${PORT}"
echo -e "${GREEN}========================================${NC}"

# Execute the main command with proper hostname and port binding
exec npm start -- -H "$HOSTNAME" -p "$PORT"
