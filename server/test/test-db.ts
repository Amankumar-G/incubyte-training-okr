import {
  PostgreSqlContainer,
  StartedPostgreSqlContainer,
} from '@testcontainers/postgresql';

let container: StartedPostgreSqlContainer;

export const startTestDb = async () => {
  container = await new PostgreSqlContainer('postgres:15')
    .withDatabase('testdb')
    .withUsername('test')
    .withPassword('test')
    .start();

  process.env.DATABASE_URL = container.getConnectionUri();

  return container;
};

export const stopTestDb = async () => {
  if (container) {
    await container.stop();
  }
};
