import { defineConfig } from 'vitest/config';
import tsConfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  plugins: [
    tsConfigPaths({ root: __dirname, projects: ['tsconfig.base.json'] }),
  ],
  test: {
    globals: true,
  },
});
