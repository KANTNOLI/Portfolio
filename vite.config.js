import { defineConfig } from 'vite';
import angular from '@vitejs/plugin-angular';

export default defineConfig({
  plugins: [angular()],
  publicDir: 'public', // Папка public
  assetsInclude: ['**/*.glb'],
});
