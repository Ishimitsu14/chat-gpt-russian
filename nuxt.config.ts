import vuetify, { transformAssetUrls } from "vite-plugin-vuetify";

export default defineNuxtConfig({
  devtools: {
    enabled: true,
  },
  runtimeConfig: {
    OPENAI_ASSISTANT_ID: "asst_sn6knv7KTmFnAonAxRwA4JPg",
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID || "",
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET || "",
    GITHUB_CLIENT_ID: process.env.GITHUB_CLIENT_ID || "",
    GITHUB_CLIENT_SECRET: process.env.GITHUB_CLIENT_SECRET || "",
    OPENAI_API_KEY: process.env.OPENAI_API_KEY || "",
    AUTH_ORIGIN: process.env.AUTH_ORIGIN || "",
    NEXTAUTH_URL: process.env.NEXTAUTH_URL || "",
  },
  auth: {
    origin: "https://2905-46-17-106-247.ngrok-free.app",
    globalAppMiddleware: true,
    provider: {
      type: "authjs",
    },
  },
  modules: [
    "./modules/eslintrc.ts",
    "@sidebase/nuxt-auth",
    "@nuxtjs/eslint-module",
    (_options, nuxt) => {
      nuxt.hooks.hook("vite:extendConfig", (config) => {
        // @ts-expect-error
        config.plugins.push(vuetify({ autoImport: true }));
      });
    },
  ],
  build: {
    transpile: ["vuetify"],
  },
  nitro: {
    esbuild: {
      options: {
        tsconfigRaw: {
          compilerOptions: {
            experimentalDecorators: true,
          },
        },
      },
    },
  },
  vite: {
    esbuild: {
      tsconfigRaw: {},
    },
    vue: {
      template: {
        transformAssetUrls,
      },
    },
  },
});
