import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from 'tailwindcss';
import autoprefixer from 'autoprefixer';
import history from 'connect-history-api-fallback';

export default defineConfig({
  base: "./",
  plugins: [react()],
  css: {
    postcss: {
      plugins: [tailwindcss(), autoprefixer()],
    },
  },
  server: {
    middlewareMode: false, // cần false để Vite dùng connect-style middleware
    setupMiddlewares: (middlewares) => {
      middlewares.use(history()); // fallback tất cả route về index.html
      return middlewares;
    },
  },
});
