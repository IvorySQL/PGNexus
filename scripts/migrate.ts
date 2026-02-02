#!/usr/bin/env ts-node

import { readFileSync, readdirSync } from 'fs';
import { join } from 'path';
import { Pool } from 'pg';

async function runMigrations() {
  const databaseUrl = process.env.DATABASE_URL;

  if (!databaseUrl) {
    console.error('ERROR: DATABASE_URL environment variable is not set');
    console.error('Please set it in your .env.local file or as an environment variable');
    process.exit(1);
  }

  const pool = new Pool({
    connectionString: databaseUrl,
  });

  try {
    console.log('Connecting to database...');
    await pool.query('SELECT NOW()');
    console.log('✓ Connected to database\n');

    // Create migrations table to track applied migrations
    await pool.query(`
      CREATE TABLE IF NOT EXISTS migrations (
        id SERIAL PRIMARY KEY,
        filename VARCHAR(255) UNIQUE NOT NULL,
        applied_at TIMESTAMPTZ DEFAULT NOW()
      )
    `);
    console.log('✓ Migrations table ready\n');

    // Get all migration files
    const migrationsDir = join(process.cwd(), 'migrations');
    const files = readdirSync(migrationsDir)
      .filter(file => file.endsWith('.sql'))
      .sort();

    if (files.length === 0) {
      console.log('No migration files found');
      return;
    }

    // Check which migrations have been applied
    const result = await pool.query('SELECT filename FROM migrations');
    const appliedMigrations = new Set(result.rows.map(row => row.filename));

    // Run pending migrations
    for (const file of files) {
      if (appliedMigrations.has(file)) {
        console.log(`⊘ Skipping ${file} (already applied)`);
        continue;
      }

      console.log(`→ Running ${file}...`);
      const filePath = join(migrationsDir, file);
      const sql = readFileSync(filePath, 'utf8');

      try {
        // Run migration in a transaction
        await pool.query('BEGIN');
        await pool.query(sql);
        await pool.query('INSERT INTO migrations (filename) VALUES ($1)', [file]);
        await pool.query('COMMIT');
        console.log(`✓ Applied ${file}\n`);
      } catch (error) {
        await pool.query('ROLLBACK');
        console.error(`✗ Failed to apply ${file}:`);
        console.error(error);
        process.exit(1);
      }
    }

    console.log('✓ All migrations completed successfully');
  } catch (error) {
    console.error('Migration failed:');
    console.error(error);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

// Run migrations
runMigrations();
