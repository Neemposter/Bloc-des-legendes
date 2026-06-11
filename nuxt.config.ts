// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  css: ['~/assets/css/main.css'],
  app: {
    head: {
      title: 'Bloc des Légendes — Club d\'escalade',
      htmlAttrs: { lang: 'fr' },
      meta: [
        { name: 'description', content: 'Bloc des Légendes, club associatif d\'escalade : actualités, planning des séances, inscriptions et contact.' },
      ],
      link: [
        // Fallbacks temporaires des polices de la charte (Moon get / Coolvetica),
        // en attendant les fichiers du club dans public/fonts/
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Quicksand:wght@600;700&family=Jost:ital,wght@0,400;0,500;1,400&display=swap' },
      ],
    },
  },
})
