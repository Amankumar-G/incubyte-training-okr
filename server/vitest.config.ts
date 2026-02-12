import { defineConfig } from 'vitest/config';
import swc from 'unplugin-swc';
// import tsconfigPaths from 'vite-tsconfig-paths';.

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
    },
    include: ['**/*.spec.ts'],
  },
  plugins: [
    swc.vite({
      module: { type: 'es6' },
    }),
  ],
});
