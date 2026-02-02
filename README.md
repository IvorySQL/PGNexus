# PGNexus - News & Email Summary Web App

A modern Next.js web application for viewing and managing RSS feeds, email summaries, and news articles from a PostgreSQL database.

## Features

- **Unified Feed View**: Display RSS feeds, email threads, and news articles in one place
- **Authentication**: Secure user authentication with NextAuth.js
- **Subscription Management**: Subscribe to specific sources, authors, or threads
- **Advanced Search**: Full-text search with filters by type and date range
- **Bilingual Summaries**: View summaries in both English and Chinese
- **Responsive Design**: Mobile-friendly interface built with Tailwind CSS
- **Modern UI**: Built with shadcn/ui components

## Technology Stack

- **Frontend**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Database**: PostgreSQL with node-postgres
- **Authentication**: NextAuth.js with credentials provider
- **UI Components**: shadcn/ui + Radix UI
- **Styling**: Tailwind CSS
- **Icons**: Lucide React

## Prerequisites

- Node.js 18.17 or higher
- PostgreSQL database with existing tables:
  - `rss_feeds`
  - `email_feeds`
  - `news_feeds`

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd pgnexus
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.local.example .env.local
```

Edit `.env.local` and configure:
```env
DATABASE_URL=postgresql://user:password@localhost:5432/dbname
NEXTAUTH_SECRET=<generate-with-openssl-rand-base64-32>
NEXTAUTH_URL=http://localhost:3000
```

4. Run database migrations:
```bash
npm run migrate
```

This will create the `users` and `user_subscriptions` tables.

## Development

Start the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Database Schema

### Existing Tables (Required)

The application expects these tables to exist in your PostgreSQL database:

**rss_feeds**
- `id` - Serial primary key
- `title` - Article title
- `link` - Article URL
- `description` - Article description
- `pubdate` - Publication date
- `author` - Feed author
- `summary_english` - English summary
- `summary_chinese` - Chinese summary
- `created_at` - Record creation timestamp

**email_feeds**
- `id` - Serial primary key
- `threadid` - Email thread identifier
- `subject` - Email subject
- `lastactivity` - Last activity date
- `summary_english` - English summary
- `summary_chinese` - Chinese summary
- `created_at` - Record creation timestamp

**news_feeds**
- `id` - Serial primary key
- `title` - Article title
- `url` - Article URL
- `source` - News source
- `publishdate` - Publication date
- `summary_english` - English summary
- `summary_chinese` - Chinese summary
- `created_at` - Record creation timestamp

### New Tables (Created by Migration)

**users**
- `id` - Serial primary key
- `email` - Unique email address
- `password_hash` - Bcrypt password hash
- `name` - Optional user name
- `created_at` - Account creation timestamp

**user_subscriptions**
- `id` - Serial primary key
- `user_id` - Foreign key to users
- `feed_type` - Type: 'rss', 'email', or 'news'
- `source_identifier` - Author/threadId/source
- `created_at` - Subscription creation timestamp

## Project Structure

```
pgnexus/
├── app/                          # Next.js App Router
│   ├── api/                     # API routes
│   │   ├── auth/               # Authentication endpoints
│   │   ├── feeds/              # Feed endpoints
│   │   ├── subscriptions/      # Subscription CRUD
│   │   └── sources/            # Available sources
│   ├── dashboard/              # Dashboard pages
│   ├── login/                  # Login page
│   └── signup/                 # Signup page
├── components/                  # React components
│   ├── ui/                     # shadcn/ui components
│   ├── feeds/                  # Feed components
│   ├── subscriptions/          # Subscription components
│   └── dashboard/              # Dashboard components
├── lib/                        # Utilities and helpers
│   ├── db/                     # Database queries
│   ├── types/                  # TypeScript types
│   └── utils/                  # Utility functions
├── migrations/                 # SQL migrations
└── scripts/                    # Build scripts
```

## Usage

### First Time Setup

1. Start the application
2. Navigate to the signup page
3. Create an account with email and password
4. You'll be automatically logged in

### Viewing Feeds

- **Dashboard**: View all feeds in chronological order
- **Show All / Subscribed**: Toggle between all feeds and subscribed sources
- **Search**: Use filters to search by keyword, type, and date range

### Managing Subscriptions

1. Go to Subscriptions page
2. Browse available sources by category (RSS, Email, News)
3. Check/uncheck sources to subscribe/unsubscribe
4. Click "Save Changes" to apply

### Searching

1. Enter keywords in the search box
2. Select feed type (All, RSS, Email, News)
3. Optionally set date range
4. Click Search or press Enter

## API Endpoints

### Authentication
- `POST /api/auth/signup` - Create new user
- `POST /api/auth/signin` - Sign in
- `POST /api/auth/signout` - Sign out

### Feeds
- `GET /api/feeds` - Get all feeds (with pagination)
- `GET /api/feeds/search` - Search feeds

### Subscriptions
- `GET /api/subscriptions` - Get user subscriptions
- `POST /api/subscriptions` - Add subscription
- `DELETE /api/subscriptions` - Remove subscription

### Sources
- `GET /api/sources` - Get all available sources

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `DATABASE_URL` | PostgreSQL connection string | Yes |
| `NEXTAUTH_SECRET` | Secret for JWT signing | Yes |
| `NEXTAUTH_URL` | Application URL | Yes |
| `NODE_ENV` | Environment (development/production) | No |

## Production Deployment

1. Build the application:
```bash
npm run build
```

2. Start production server:
```bash
npm start
```

### Deployment Checklist

- [ ] Set production `DATABASE_URL`
- [ ] Generate secure `NEXTAUTH_SECRET`
- [ ] Set correct `NEXTAUTH_URL`
- [ ] Run migrations on production database
- [ ] Configure SSL/HTTPS
- [ ] Set up monitoring and logging

## Security Considerations

- Passwords are hashed with bcryptjs (10 rounds)
- JWT sessions expire after 30 days
- SQL injection protection via parameterized queries
- XSS protection via React's built-in escaping
- CSRF protection via NextAuth.js

## Performance Optimization

- Database connection pooling (max 20 connections)
- Indexes on frequently queried columns
- Pagination for large result sets
- Optimistic UI updates for subscriptions

## Troubleshooting

### Database Connection Issues
- Verify `DATABASE_URL` is correct
- Ensure PostgreSQL is running
- Check firewall/network settings

### Migration Failures
- Check database credentials
- Verify PostgreSQL version compatibility
- Review migration logs for SQL errors

### Authentication Not Working
- Verify `NEXTAUTH_SECRET` is set
- Check `NEXTAUTH_URL` matches your domain
- Clear browser cookies and try again

## Contributing

This project was created as a full-stack demonstration. Feel free to fork and customize for your needs.

## License

MIT License - See LICENSE file for details
