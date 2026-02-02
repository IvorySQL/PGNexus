# PGNexus Docker Deployment Guide

This guide covers deploying PGNexus using Docker and Docker Compose.

## Prerequisites

- Docker 20.10+
- Docker Compose 2.0+
- PostgreSQL database (can use the included docker compose setup)

## Quick Start with Docker Compose

### 1. Prepare Environment

```bash
# Copy environment template
cp .env.docker.example .env

# Edit .env with your configuration
nano .env
```

**Important:** Generate a secure NEXTAUTH_SECRET:
```bash
openssl rand -base64 32
```

### 2. Initialize Database Schema

**Before first run**, you need to create the database schema:

```bash
# Start only the PostgreSQL container
docker compose up -d postgres

# Wait for PostgreSQL to be ready
docker compose exec postgres pg_isready -U pgnexus

# Apply schema
docker compose exec -T postgres psql -U pgnexus -d pgnexus < schema.sql

# Or copy schema.sql and run manually:
# docker cp schema.sql pgnexus-db:/tmp/schema.sql
# docker compose exec postgres psql -U pgnexus -d pgnexus -f /tmp/schema.sql
```

### 3. Start Application

```bash
# Build and start all services
docker compose up -d

# View logs
docker compose logs -f app

# Check health
curl http://localhost:3000/api/health
```

### 4. Access Application

Open your browser to: `http://localhost:3000`

## Configuration

### Environment Variables

#### Application Configuration
- `PORT` - Port to run the application (default: 3000)
- `HOSTNAME` - Host to bind to (default: 0.0.0.0)
- `NODE_ENV` - Node environment (default: production)

#### Database Configuration (Option 1: Components)
- `PG_HOST` - PostgreSQL host
- `PG_PORT` - PostgreSQL port (default: 5432)
- `PG_USER` - PostgreSQL username
- `PG_PASSWORD` - PostgreSQL password
- `PG_DB` - Database name
- `PG_SCHEMA` - Schema name (default: public)

#### Database Configuration (Option 2: Connection String)
- `DATABASE_URL` - Full PostgreSQL connection string
  - Format: `postgresql://user:password@host:port/database?schema=public`

#### NextAuth Configuration
- `NEXTAUTH_SECRET` - Secret key for NextAuth (required)
  - Generate with: `openssl rand -base64 32`
- `NEXTAUTH_URL` - Public URL of your application
  - Development: `http://localhost:3000`
  - Production: `https://yourdomain.com`

#### Optional Configuration
- `SKIP_MIGRATIONS` - Skip running migrations on startup (default: false)
- `NEXT_TELEMETRY_DISABLED` - Disable Next.js telemetry (default: 1)

## Building and Running with Plain Docker

### Build Image

```bash
docker build -t pgnexus:latest .
```

### Run Container

```bash
docker run -d \
  --name pgnexus-app \
  -p 3000:3000 \
  -e PG_HOST=your-postgres-host \
  -e PG_PORT=5432 \
  -e PG_USER=pgnexus \
  -e PG_PASSWORD=your_password \
  -e PG_DB=pgnexus \
  -e PG_SCHEMA=public \
  -e NEXTAUTH_SECRET=your_secret_here \
  -e NEXTAUTH_URL=http://localhost:3000 \
  -v $(pwd)/content:/app/content:ro \
  pgnexus:latest
```

## Database Setup

### Required Tables

The application requires the following tables:

1. **User Authentication** (created by migrations)
   - `users` - User accounts
   - `user_subscriptions` - User feed subscriptions
   - `migrations` - Migration tracking

2. **Data Tables** (must be created manually)
   - `rss_feeds` - RSS feed entries (Tech Blogs)
   - `email_feeds` - Email discussions (Hacker Discussions)
   - `news_feeds` - News articles (Industry News)

### Schema Creation

The complete schema is provided in `schema.sql`. This includes:
- All user and authentication tables
- All data feed tables
- Indexes for optimal performance
- Full-text search indexes
- Table comments and documentation

**Run the schema before starting the app:**

```bash
psql -h localhost -U pgnexus -d pgnexus -f schema.sql
```

### Migration System

The application includes an automatic migration system that runs on startup. It will:

1. Create a `migrations` table to track applied migrations
2. Run any pending SQL files from the `migrations/` directory
3. Only apply each migration once

**To skip migrations** (if already applied manually):
```bash
export SKIP_MIGRATIONS=true
```

## Production Deployment

### 1. Update NEXTAUTH_URL

Set to your public domain:
```bash
NEXTAUTH_URL=https://your-domain.com
```

### 2. Use Reverse Proxy

Place behind nginx or similar:

```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

### 3. Enable HTTPS

Use Let's Encrypt with certbot:
```bash
certbot --nginx -d your-domain.com
```

### 4. Persistent Storage

Ensure content directory is mounted:
```bash
-v /path/to/content:/app/content:ro
```

### 5. Resource Limits

Set appropriate limits in docker compose.yml:
```yaml
services:
  app:
    deploy:
      resources:
        limits:
          cpus: '2'
          memory: 2G
        reservations:
          cpus: '1'
          memory: 1G
```

## Health Checks

The application provides a health check endpoint:

```bash
curl http://localhost:3000/api/health
```

Response when healthy:
```json
{
  "status": "healthy",
  "timestamp": "2024-01-28T12:00:00.000Z",
  "database": "connected"
}
```

## Troubleshooting

### Container won't start

1. Check logs:
```bash
docker compose logs app
```

2. Verify database connectivity:
```bash
docker compose exec postgres pg_isready -U pgnexus
```

3. Test database connection:
```bash
docker compose exec postgres psql -U pgnexus -d pgnexus -c "SELECT NOW();"
```

### Migrations failing

1. Check migration status:
```bash
docker compose exec postgres psql -U pgnexus -d pgnexus -c "SELECT * FROM migrations;"
```

2. Manually apply schema:
```bash
docker compose exec -T postgres psql -U pgnexus -d pgnexus < schema.sql
```

3. Skip migrations and start:
```bash
SKIP_MIGRATIONS=true docker compose up -d app
```

### Application can't connect to database

1. Verify DATABASE_URL is correct:
```bash
docker compose exec app env | grep DATABASE_URL
```

2. Test connection from app container:
```bash
docker compose exec app node -e "
  const { Pool } = require('pg');
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  pool.query('SELECT NOW()', (err, res) => {
    console.log(err ? 'Error: ' + err.message : 'Connected: ' + res.rows[0].now);
    pool.end();
  });
"
```

## Maintenance

### View Logs
```bash
docker compose logs -f app
docker compose logs -f postgres
```

### Restart Services
```bash
docker compose restart app
docker compose restart postgres
```

### Update Application
```bash
# Pull latest code
git pull

# Rebuild and restart
docker compose up -d --build app
```

### Backup Database
```bash
docker compose exec postgres pg_dump -U pgnexus pgnexus > backup-$(date +%Y%m%d).sql
```

### Restore Database
```bash
docker compose exec -T postgres psql -U pgnexus -d pgnexus < backup-20240128.sql
```

## Monitoring

### Container Stats
```bash
docker stats pgnexus-app pgnexus-db
```

### Health Check
```bash
watch -n 5 'curl -s http://localhost:3000/api/health | jq'
```

## Security Best Practices

1. **Never use default passwords** - Change all default credentials
2. **Use strong secrets** - Generate NEXTAUTH_SECRET with proper entropy
3. **Enable HTTPS** - Use SSL/TLS in production
4. **Limit database access** - Use firewall rules to restrict PostgreSQL access
5. **Regular updates** - Keep Docker images and dependencies updated
6. **Monitor logs** - Set up log aggregation and alerting
7. **Backup regularly** - Automate database backups
8. **Use secrets management** - Consider Docker secrets or external secret stores

## Support

For issues or questions:
1. Check logs: `docker compose logs -f`
2. Verify health: `curl http://localhost:3000/api/health`
3. Review this documentation
4. Check application logs in the container
