import { defineConfig } from 'vite';
import { builtinModules } from 'node:module';

export default defineConfig({
  ssr: {
    noExternal: true,
  },
  logLevel: 'warn',
  build: {
    ssr: 'main.tsx',
    outDir: '../../dist/server',
    emptyOutDir: true,
    target: 'node22',
    sourcemap: true,
    rollupOptions: {
      external: [...builtinModules],

      output: {
        format: 'cjs',
        entryFileNames: 'main.js',
        inlineDynamicImports: true,
      },
    },
  },
});
