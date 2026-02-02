import { query } from '../db';
import type { User, UserSubscription } from '../types/database';

/**
 * Get user by email
 */
export async function getUserByEmail(email: string): Promise<User | null> {
  const result = await query(
    'SELECT * FROM users WHERE email = $1',
    [email]
  );

  return result.rows[0] || null;
}

/**
 * Get user by ID
 */
export async function getUserById(id: number): Promise<User | null> {
  const result = await query(
    'SELECT * FROM users WHERE id = $1',
    [id]
  );

  return result.rows[0] || null;
}

/**
 * Create a new user
 */
export async function createUser(
  email: string,
  passwordHash: string,
  name?: string
): Promise<User> {
  const result = await query(
    `INSERT INTO users (email, password_hash, name)
     VALUES ($1, $2, $3)
     RETURNING *`,
    [email, passwordHash, name]
  );

  return result.rows[0];
}

/**
 * Get all subscriptions for a user
 */
export async function getUserSubscriptions(
  userId: number
): Promise<UserSubscription[]> {
  const result = await query(
    'SELECT * FROM user_subscriptions WHERE user_id = $1',
    [userId]
  );

  return result.rows;
}

/**
 * Get subscriptions grouped by feed type
 */
export async function getUserSubscriptionsGrouped(
  userId: number
): Promise<{ rss: string[]; email: string[]; news: string[] }> {
  const subscriptions = await getUserSubscriptions(userId);

  const grouped = {
    rss: [] as string[],
    email: [] as string[],
    news: [] as string[],
  };

  subscriptions.forEach((sub) => {
    if (sub.feed_type === 'rss') {
      grouped.rss.push(sub.source_identifier);
    } else if (sub.feed_type === 'email') {
      grouped.email.push(sub.source_identifier);
    } else if (sub.feed_type === 'news') {
      grouped.news.push(sub.source_identifier);
    }
  });

  return grouped;
}

/**
 * Add a new subscription for a user
 */
export async function addUserSubscription(
  userId: number,
  feedType: 'rss' | 'email' | 'news',
  sourceIdentifier: string
): Promise<UserSubscription> {
  const result = await query(
    `INSERT INTO user_subscriptions (user_id, feed_type, source_identifier)
     VALUES ($1, $2, $3)
     ON CONFLICT (user_id, feed_type, source_identifier) DO NOTHING
     RETURNING *`,
    [userId, feedType, sourceIdentifier]
  );

  return result.rows[0];
}

/**
 * Remove a subscription for a user
 */
export async function removeUserSubscription(
  userId: number,
  feedType: 'rss' | 'email' | 'news',
  sourceIdentifier: string
): Promise<boolean> {
  const result = await query(
    `DELETE FROM user_subscriptions
     WHERE user_id = $1 AND feed_type = $2 AND source_identifier = $3`,
    [userId, feedType, sourceIdentifier]
  );

  return (result.rowCount ?? 0) > 0;
}

/**
 * Remove all subscriptions for a user by feed type
 */
export async function removeAllUserSubscriptions(
  userId: number,
  feedType?: 'rss' | 'email' | 'news'
): Promise<number> {
  let queryText = 'DELETE FROM user_subscriptions WHERE user_id = $1';
  const params: any[] = [userId];

  if (feedType) {
    queryText += ' AND feed_type = $2';
    params.push(feedType);
  }

  const result = await query(queryText, params);
  return result.rowCount ?? 0;
}

/**
 * Check if user has a specific subscription
 */
export async function hasSubscription(
  userId: number,
  feedType: 'rss' | 'email' | 'news',
  sourceIdentifier: string
): Promise<boolean> {
  const result = await query(
    `SELECT 1 FROM user_subscriptions
     WHERE user_id = $1 AND feed_type = $2 AND source_identifier = $3`,
    [userId, feedType, sourceIdentifier]
  );

  return result.rows.length > 0;
}
