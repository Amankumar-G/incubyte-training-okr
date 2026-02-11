import { defineConfig } from 'vitest/config';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  plugins: [tsconfigPaths()],
  test: {
    globals: true,
    environment: 'node',

    globalSetup: './test/setup-testcontainer.ts',

    include: ['**/*.e2e-spec.ts'],

    hookTimeout: 60000,
    testTimeout: 30000,
    teardownTimeout: 30000,
  },
});
