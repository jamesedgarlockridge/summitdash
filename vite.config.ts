import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // `vite dev` never runs the Vercel functions in api/ (that only happens on Vercel itself
  // or under `vercel dev`), so /api/tle 404s locally and the ISS/Tiangong cards show a false
  // "TLE Fetch Failed" that has nothing to do with the app. This proxy sends dev-server
  // requests straight to CelesTrak so local testing sees the same data production does.
  // Skips Vercel's edge cache from api/tle.ts, which is fine at local-dev request volume -
  // that cache exists to protect against CelesTrak's per-IP rate limit at real traffic levels.
  server: {
    proxy: {
      '/api/tle': {
        target: 'https://celestrak.org',
        changeOrigin: true,
        rewrite: (path) => {
          const catnr = new URL(path, 'http://x').searchParams.get('catnr')
          return `/NORAD/elements/gp.php?CATNR=${catnr}&FORMAT=TLE`
        },
      },
    },
  },
})
