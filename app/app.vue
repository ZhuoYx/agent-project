<template>
  <n-message-provider>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </n-message-provider>
</template>

<style>
/* 全局样式重置 */
*,
*::before,
*::after {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html, body, #__nuxt {
  height: 100%;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}
</style>
