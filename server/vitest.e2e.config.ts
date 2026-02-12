import { defineConfig } from 'vitest/config';
import swc from 'unplugin-swc';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',

    globalSetup: './test/setup-testcontainer.ts',

    include: ['**/*.e2e-spec.ts'],

    hookTimeout: 60000,
    testTimeout: 30000,
    teardownTimeout: 30000,
  },
  plugins: [
    swc.vite({
      module: { type: 'es6' },
    }),
  ],
});
