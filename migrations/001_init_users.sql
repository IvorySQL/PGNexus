-- Create users table
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    name VARCHAR(255),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create user_subscriptions table
CREATE TABLE IF NOT EXISTS user_subscriptions (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    feed_type VARCHAR(50) NOT NULL CHECK (feed_type IN ('rss', 'email', 'news')),
    source_identifier TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, feed_type, source_identifier)
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_user_subscriptions_user_id ON user_subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_user_subscriptions_feed_type ON user_subscriptions(feed_type);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- Add comments for documentation
COMMENT ON TABLE users IS 'User accounts for authentication and authorization';
COMMENT ON TABLE user_subscriptions IS 'User subscriptions to RSS feeds, email threads, and news sources';
COMMENT ON COLUMN user_subscriptions.feed_type IS 'Type of feed: rss, email, or news';
COMMENT ON COLUMN user_subscriptions.source_identifier IS 'Author for RSS, threadId for email, source for news';
