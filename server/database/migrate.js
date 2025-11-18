#!/usr/bin/env node

/**
 * Database Migration Runner
 * Runs SQL migrations in order
 */

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');
const { promisify } = require('util');

const readdir = promisify(fs.readdir);
const readFile = promisify(fs.readFile);

// Configuration
const supabaseUrl = process.env.SUPABASE_URL || process.env.DATABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY;

if (!supabaseUrl) {
  console.error('❌ Error: SUPABASE_URL or DATABASE_URL environment variable is required');
  process.exit(1);
}

// Initialize Supabase client
const supabase = supabaseKey
  ? createClient(supabaseUrl, supabaseKey)
  : null;

// For direct PostgreSQL connection
const { Pool } = require('pg');
const pool = process.env.DATABASE_URL
  ? new Pool({ connectionString: process.env.DATABASE_URL })
  : null;

async function createMigrationsTable() {
  const sql = `
    CREATE TABLE IF NOT EXISTS schema_migrations (
      id SERIAL PRIMARY KEY,
      migration_name VARCHAR(255) NOT NULL UNIQUE,
      applied_at TIMESTAMP DEFAULT NOW()
    );
  `;

  if (pool) {
    await pool.query(sql);
  } else if (supabase) {
    const { error } = await supabase.rpc('exec_sql', { sql });
    if (error) throw error;
  }

  console.log('✓ Migrations table ready');
}

async function getAppliedMigrations() {
  if (pool) {
    const result = await pool.query('SELECT migration_name FROM schema_migrations ORDER BY id');
    return result.rows.map(row => row.migration_name);
  } else if (supabase) {
    const { data, error } = await supabase
      .from('schema_migrations')
      .select('migration_name')
      .order('id');
    if (error) throw error;
    return data.map(row => row.migration_name);
  }
  return [];
}

async function recordMigration(migrationName) {
  if (pool) {
    await pool.query(
      'INSERT INTO schema_migrations (migration_name) VALUES ($1)',
      [migrationName]
    );
  } else if (supabase) {
    const { error } = await supabase
      .from('schema_migrations')
      .insert({ migration_name: migrationName });
    if (error) throw error;
  }
}

async function executeMigration(migrationPath, migrationName) {
  console.log(`\n📝 Applying migration: ${migrationName}`);

  const sql = await readFile(migrationPath, 'utf8');

  // Split by semicolons and execute each statement
  const statements = sql
    .split(';')
    .map(s => s.trim())
    .filter(s => s.length > 0);

  if (pool) {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      for (const statement of statements) {
        if (statement) {
          await client.query(statement);
        }
      }
      await client.query('COMMIT');
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  } else if (supabase) {
    // Note: Supabase client doesn't support transactions via SDK
    // You may need to use SQL functions or direct PostgreSQL connection
    for (const statement of statements) {
      if (statement) {
        const { error } = await supabase.rpc('exec_sql', { sql: statement });
        if (error) throw error;
      }
    }
  }

  await recordMigration(migrationName);
  console.log(`✓ Applied: ${migrationName}`);
}

async function runMigrations() {
  try {
    console.log('🚀 Starting database migrations...\n');

    // Create migrations table
    await createMigrationsTable();

    // Get list of applied migrations
    const appliedMigrations = await getAppliedMigrations();
    console.log(`✓ Found ${appliedMigrations.length} applied migrations`);

    // Get migration files
    const migrationsDir = path.join(__dirname, 'migrations');
    const files = await readdir(migrationsDir);
    const migrationFiles = files
      .filter(f => f.endsWith('.sql'))
      .sort();

    console.log(`✓ Found ${migrationFiles.length} migration files\n`);

    // Apply pending migrations
    let appliedCount = 0;
    for (const file of migrationFiles) {
      if (!appliedMigrations.includes(file)) {
        const migrationPath = path.join(migrationsDir, file);
        await executeMigration(migrationPath, file);
        appliedCount++;
      } else {
        console.log(`⊘ Skipping (already applied): ${file}`);
      }
    }

    console.log(`\n✅ Migration complete! Applied ${appliedCount} new migration(s)`);

    // Close connections
    if (pool) {
      await pool.end();
    }

    process.exit(0);
  } catch (error) {
    console.error('\n❌ Migration failed:', error.message);
    console.error(error.stack);

    if (pool) {
      await pool.end();
    }

    process.exit(1);
  }
}

// Run migrations
runMigrations();
