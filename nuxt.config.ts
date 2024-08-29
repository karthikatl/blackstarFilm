import { defineNuxtConfig } from "nuxt/config";

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  devtools: { enabled: true },
  modules: [
    '@nuxtjs/tailwindcss',
  ],
  css: [
    '~/assets/styles/main.scss',
  ],
  app: {
    head: {
      title:'Blackstarfest',
      meta:[
        {name: 'Blackstar film festival', content: 'Blackstar film festival 2024'}
      ]
    }
  },
  ssr: false
})