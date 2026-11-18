import {defineConfig} from 'vite';

export default defineConfig({
  // Same as the old grunt connect: port 8000, reachable on the local network
  server: {port: 8000, host: true},
  // App code is classic global scripts, not ES modules; skip the dep scan
  optimizeDeps: {entries: []},
  // Serve index.html, debug.html, test/*.html as-is
  appType: 'mpa',
});
