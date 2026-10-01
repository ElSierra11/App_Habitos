import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

// Separate config for Vitest - avoids loading VitePWA which crashes the test runner
export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'node',
    pool: 'forks',
    poolOptions: {
      forks: {
        singleFork: true,
      },
    },
  },
});

