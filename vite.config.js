import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const isTest = mode === 'test';

  return {
    plugins: [
      react(),
      // VitePWA crashes Vitest - only load in non-test environments
      ...(!isTest ? [VitePWA({
        registerType: 'autoUpdate',
        includeAssets: ['favicon.svg', 'apple-touch-icon.png', 'pwa-192x192.png', 'pwa-512x512.png', 'maskable-icon-512x512.png', 'sw-addon.js'],
        manifest: {
          name: 'BreyHabitos - Salud Renal',
          short_name: 'BreyHabitos',
          description: 'Control de hábitos, hidratación y nutrición para la recuperación y prevención de cálculos renales.',
          start_url: '/',
          display: 'standalone',
          orientation: 'portrait',
          background_color: '#F0F9FF',
          theme_color: '#E0F2FE',
          icons: [
            {
              src: '/pwa-192x192.png',
              sizes: '192x192',
              type: 'image/png'
            },
            {
              src: '/pwa-512x512.png',
              sizes: '512x512',
              type: 'image/png'
            },
            {
              src: '/maskable-icon-512x512.png',
              sizes: '512x512',
              type: 'image/png',
              purpose: 'any maskable'
            }
          ],
          shortcuts: [
            {
              name: 'Tomar 250 ml de Agua',
              short_name: '+250 ml',
              description: 'Registrar un vaso de agua fresca de inmediato',
              url: '/?action=add_water_250',
              icons: [{ src: '/pwa-192x192.png', sizes: '192x192' }]
            },
            {
              name: 'Color de Orina',
              short_name: 'Orina',
              description: 'Chequear el semáforo de hidratación de orina',
              url: '/?tab=urine',
              icons: [{ src: '/pwa-192x192.png', sizes: '192x192' }]
            },
            {
              name: 'Dolor y Molestias',
              short_name: 'Síntomas',
              description: 'Registrar dolor lumbar o síntomas renales',
              url: '/?tab=symptoms',
              icons: [{ src: '/pwa-192x192.png', sizes: '192x192' }]
            },
            {
              name: 'Evolución y Gráficas',
              short_name: 'Evolución',
              description: 'Ver gráficas semanales y mensuales de progreso',
              url: '/?tab=stats',
              icons: [{ src: '/pwa-192x192.png', sizes: '192x192' }]
            }
          ]
        },
        workbox: {
          importScripts: ['/sw-addon.js'],
          globPatterns: ['**/*.{js,css,html,ico,png,svg,webmanifest}'],
          cleanupOutdatedCaches: true,
          clientsClaim: true,
          skipWaiting: true,
          runtimeCaching: [
            {
              urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
              handler: 'CacheFirst',
              options: {
                cacheName: 'google-fonts-stylesheets',
                expiration: {
                  maxEntries: 10,
                  maxAgeSeconds: 60 * 60 * 24 * 365, // 1 year
                },
                cacheableResponse: {
                  statuses: [0, 200],
                },
              },
            },
            {
              urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/i,
              handler: 'CacheFirst',
              options: {
                cacheName: 'google-fonts-webfonts',
                expiration: {
                  maxEntries: 20,
                  maxAgeSeconds: 60 * 60 * 24 * 365, // 1 year
                },
                cacheableResponse: {
                  statuses: [0, 200],
                },
              },
            },
            {
              urlPattern: /\.(?:png|jpg|jpeg|svg|gif|webp|ico)$/i,
              handler: 'StaleWhileRevalidate',
              options: {
                cacheName: 'images-cache',
                expiration: {
                  maxEntries: 50,
                  maxAgeSeconds: 60 * 60 * 24 * 30, // 30 days
                },
              },
            },
          ],
        },
      })] : [])
    ],
    test: {
      globals: true,
      environment: 'node',
      setupFiles: [],
    },
  };
})

