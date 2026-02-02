# PGNexus Setup Guide

## Quick Start

Follow these steps to get PGNexus running:

### 1. Install Dependencies

**Note**: This project requires Node.js 18.17 or higher. Your current system has Node.js v12.14.0, which is not compatible with Next.js 14.

To install dependencies:
```bash
npm install
```

### 2. Configure Environment

Edit `.env.local` with your actual database credentials:

```env
DATABASE_URL=postgresql://username:password@host:port/database
NEXTAUTH_SECRET=<generate-with-openssl-rand-base64-32>
NEXTAUTH_URL=http://localhost:3000
```

To generate a secure NEXTAUTH_SECRET:
```bash
openssl rand -base64 32
```

### 3. Run Database Migration

The migration will create the `users` and `user_subscriptions` tables:

```bash
npm run migrate
```

### 4. Start Development Server

```bash
npm run dev
```

The application will be available at http://localhost:3000

## Initial User Setup

1. Navigate to http://localhost:3000
2. Click "Sign Up"
3. Create an account with:
   - Email address
   - Password (minimum 6 characters)
   - Optional name

4. You'll be automatically logged in to the dashboard

## Database Requirements

Your PostgreSQL database must already have these tables:

### rss_feeds
```sql
CREATE TABLE rss_feeds (
    id SERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    link TEXT,
    description TEXT,
    pubdate TIMESTAMPTZ NOT NULL,
    author TEXT,
    summary_english TEXT,
    summary_chinese TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### email_feeds
```sql
CREATE TABLE email_feeds (
    id SERIAL PRIMARY KEY,
    threadid TEXT NOT NULL,
    subject TEXT NOT NULL,
    lastactivity TIMESTAMPTZ NOT NULL,
    summary_english TEXT,
    summary_chinese TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### news_feeds
```sql
CREATE TABLE news_feeds (
    id SERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    url TEXT,
    source TEXT,
    publishdate TIMESTAMPTZ NOT NULL,
    summary_english TEXT,
    summary_chinese TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
```

## Troubleshooting

### Node.js Version Error

If you see errors about syntax or "Unexpected token", you need to upgrade Node.js:

**Using nvm (recommended)**:
```bash
nvm install 18
nvm use 18
```

**Or download from**: https://nodejs.org/ (LTS version)

### Database Connection Failed

Check:
1. PostgreSQL is running: `pg_isready`
2. Credentials in `.env.local` are correct
3. Database exists: `psql -l`
4. Network/firewall allows connection

### Migration Errors

If migration fails:
1. Check database credentials
2. Verify you have CREATE TABLE permissions
3. Look at the error message in the console
4. Manually connect: `psql $DATABASE_URL`

### Can't Access After Login

Clear browser cookies and cache, then try again.

## Features Overview

### Dashboard
- View all feeds from RSS, email, and news sources
- Toggle between "Show All" and "Subscribed Only" modes
- Feeds display with summaries in both English and Chinese
- Click links to open original content

### Search & Filter
- Search across all feed types
- Filter by feed type (RSS, Email, News)
- Filter by date range
- Results update in real-time

### Subscription Management
- Subscribe to specific RSS authors
- Subscribe to email threads
- Subscribe to news sources
- Changes are saved to database
- Affects "Subscribed Only" view

## Next Steps

After setup is complete:

1. **Add Data**: Ensure your database has feed data in the three tables
2. **Test Subscriptions**: Go to Subscriptions page and subscribe to sources
3. **Try Search**: Use the search and filter features
4. **Mobile Test**: Check responsive design on mobile devices

## Production Deployment

For production deployment:

1. **Build the app**:
```bash
npm run build
```

2. **Set production environment variables**:
```env
DATABASE_URL=postgresql://prod-user:prod-pass@prod-host:5432/prod-db
NEXTAUTH_SECRET=<strong-random-secret>
NEXTAUTH_URL=https://yourdomain.com
NODE_ENV=production
```

3. **Run migrations** on production database:
```bash
NODE_ENV=production npm run migrate
```

4. **Start server**:
```bash
npm start
```

## Support

For issues or questions:
1. Check the README.md for detailed documentation
2. Review the troubleshooting section above
3. Check database logs and application console for errors

## File Structure Reference

```
pgnexus/
├── .env.local              # Environment configuration (YOU MUST EDIT THIS)
├── package.json            # Dependencies
├── next.config.js          # Next.js config
├── tailwind.config.ts      # Tailwind CSS config
├── tsconfig.json           # TypeScript config
├── app/                    # Application pages and API routes
├── components/             # React components
├── lib/                    # Database and utility functions
├── migrations/             # Database migrations
└── scripts/                # Build and maintenance scripts
```
