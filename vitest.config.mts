import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    clearMocks: true,
    globals: true,
    environment: 'jsdom',
    include: ['packages/**/test/*.ts'],
    retry: 0,
    setupFiles: ['./vitest.setup.mts'],
  },
});
