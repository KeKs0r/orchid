import { defineConfig } from 'vite';
import tsConfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  plugins: [
    tsConfigPaths({ root: __dirname, projects: ['tsconfig.base.json'] }),
  ],
});
