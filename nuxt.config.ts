// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: ['@bg-dev/nuxt-naiveui'],
  runtimeConfig: {
    // 服务端私有变量，自动从 .env 中读取同名的 NUXT_ 前缀变量
    // 这里手动映射 .env 中的变量名
    ANTHROPIC_BASE_URL: process.env.ANTHROPIC_BASE_URL,
    ANTHROPIC_EMBEDDING_URL: process.env.ANTHROPIC_EMBEDDING_URL,
    ANTHROPIC_API_KEY: process.env.ANTHROPIC_API_KEY,
  }
})
