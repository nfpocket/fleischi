// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2024-04-03",
  devtools: { enabled: false },
  css: ["~/assets/styles/tailwind.css"],
  modules: [
    "@nuxt/ui",
    "@nuxtjs/supabase",
    "@vueuse/nuxt",
    "@vite-pwa/nuxt",
    "nuxt-typed-router"
  ],
  future: {
    compatibilityVersion: 4,
  },
  app: {
    head: {
      htmlAttrs: {
        class: "h-full",
      },
      bodyAttrs: {
        class: "h-full",
      },
      charset: "utf-8",
      title: "Fleischi",
      titleTemplate: "%s | Fleischi",
      meta: [
        { property: "og:type", content: "website" },
        { property: "og:title", content: "Fleischi" },
        { property: "og:description", content: "Fleischi" },
      ],
    },
  },
  ssr: false,
  supabase: {
    redirectOptions: {
      login: "/auth/login",
      callback: "/auth/callback",
      exclude: ["/"],
    },
  },
  ui: {
    icons: ["heroicons", "tabler"],
  },
  pwa: {
    /* PWA options */
  },
});