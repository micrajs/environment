import {cwd} from '@micra/vite-config/utilities/cwd';
import {defineConfig} from '@micra/vite-config/library';

export default defineConfig({
  build: {
    rollupOptions: {
      external: ['@micra/error', '@micra/event-emitter', 'vitest'],
      input: {
        index: cwd('index.ts'),
      },
    },
  },
});
