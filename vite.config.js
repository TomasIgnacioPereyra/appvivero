import { defineConfig } from 'vite';

// base: './' genera rutas relativas para que la misma compilación funcione
// en la raíz de Vercel y en un subdirectorio de GitHub Pages.
export default defineConfig({
  base: './',
});
