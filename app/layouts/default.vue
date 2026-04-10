<template>
  <n-layout class="h-screen">
    <!-- 顶部标题栏 -->
    <n-layout-header bordered class="header">
      <div class="header-content">
        <n-text class="title">🤖 RAG文档回答应用</n-text>
      </div>
    </n-layout-header>

    <!-- 中间内容区 -->
    <n-layout-content class="main-content">
      <slot />
    </n-layout-content>
  </n-layout>
</template>

<style scoped>
.h-screen {
  height: 100vh;
  display: flex;
  flex-direction: column;
}

.header {
  flex-shrink: 0;
  padding: 0 24px;
  display: flex;
  align-items: center;
  height: 56px;
  background: #fff;
}

.header-content {
  display: flex;
  align-items: center;
  height: 100%;
}

.title {
  font-size: 18px;
  font-weight: 600;
  color: #18181b;
}

.main-content {
  flex: 1;
  min-height: 0;
  overflow: hidden;
}

:deep(.n-layout-scroll-container) {
  display: flex;
  flex-direction: column;
}
</style>
