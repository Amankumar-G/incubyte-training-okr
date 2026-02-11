import {
  PostgreSqlContainer,
  StartedPostgreSqlContainer,
} from '@testcontainers/postgresql';

import { execSync } from 'child_process';

let postgresContainer: StartedPostgreSqlContainer;

beforeAll(async () => {
  // 1. Start the container

  postgresContainer = await new PostgreSqlContainer('postgres:15').start();

  // 2. Get the dynamic connection string

  const databaseUrl = postgresContainer.getConnectionUri();

  // 3. Inject it into the environment so NestJS can find it

  process.env.DATABASE_URL = databaseUrl;

  // 4. Run migrations to ensure the schema is ready

  // For Prisma:

  execSync('npx prisma migrate deploy', { env: process.env });

  // For TypeORM: Add your migration command here
}, 60000); // Higher timeout because pulling Docker images takes time

afterAll(async () => {
  if (postgresContainer) {
    await postgresContainer.stop();
  }
});
