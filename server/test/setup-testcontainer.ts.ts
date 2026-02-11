import {
  PostgreSqlContainer,
  StartedPostgreSqlContainer,
} from '@testcontainers/postgresql';
import { execSync } from 'child_process';

let postgresContainer: StartedPostgreSqlContainer;

export async function setup() {
  // Increase timeout for Docker pull
  console.log('Starting PostgreSQL Testcontainer...');

  postgresContainer = await new PostgreSqlContainer('postgres:15')
    .withDatabase('test_db')
    .withUsername('test')
    .withPassword('test')
    .start();

  const databaseUrl = postgresContainer.getConnectionUri();

  process.env.DATABASE_URL = databaseUrl;

  // Run Prisma migrations
  execSync('npx prisma migrate deploy', {
    stdio: 'inherit',
    env: process.env,
  });

  console.log('Test DB ready.');
}

export async function teardown() {
  if (postgresContainer) {
    await postgresContainer.stop();
  }
}
