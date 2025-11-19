// Nuxt configuration for Pizza Hunt scaffolding
export default defineNuxtConfig({
  compatibilityDate: '2025-11-19',
  // Runtime configuration exposes keys and env-specific values
  runtimeConfig: {
    public: {
      // Spoonacular API key placeholder for public client access
      spoonacularKey: process.env.NUXT_PUBLIC_SPOONACULAR_KEY || ''
    }
  },

  // Register Nuxt modules required by the app
  modules: [
    '@pinia/nuxt' // Pinia store integration with Nuxt 3
  ],

  // Global CSS files available across all pages and components
  css: [
    '@/assets/styles/base.css',
    '@/assets/styles/layout.css'
  ],

  // Auto-import Pinia helpers across the app
  imports: {
    presets: [
      {
        from: 'pinia',
        imports: [
          'defineStore', // direct import
          ['defineStore', 'definePiniaStore'], // alias for clarity when needed
          'storeToRefs' // helper for extracting store refs
        ]
      }
    ]
  },

  // TypeScript options to keep typing strict during development
  typescript: {
    strict: true,
    typeCheck: true
  }
});
