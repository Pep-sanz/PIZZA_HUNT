export default defineNuxtConfig({
  compatibilityDate: '2025-11-19',
  runtimeConfig: {
    public: {
      spoonacularKey: process.env.SPOONACULAR_KEY || ''
    }
  },

  modules: ['@pinia/nuxt'],

  css: ['@/assets/styles/base.css', '@/assets/styles/layout.css'],

  imports: {
    presets: [
      {
        from: 'pinia',
        imports: ['defineStore', ['defineStore', 'definePiniaStore'], 'storeToRefs']
      }
    ]
  },

  typescript: {
    strict: true,
    typeCheck: true
  }
});
