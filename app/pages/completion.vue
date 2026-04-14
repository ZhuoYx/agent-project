<script setup lang="ts">
import { useCompletion } from '@ai-sdk/vue';
import { StopCircleOutline } from '@vicons/ionicons5';
import { useMessage } from 'naive-ui'

const message = useMessage()

const {
  completion, // 当前补全结果(字符串，实时更新)
  input, // 输入内容
  handleSubmit, // 提交处理
  isLoading, // 是否正在生成
  stop, // 中止
  error, // 错误
} = useCompletion({
  api: '/api/completion',
  onError: (error) => {
    message.error(error.message)
  },
});
</script>

<template>
  <div class="content">
    <div class="messages">
      {{ completion }}
    </div>

    <div class="footer">
      <n-input
        v-model:value="input"
        placeholder="输入要润色的文字..."
        :disabled="isLoading"
        @keydown.enter.prevent="handleSubmit"
      />

      <n-button
        v-show="!isLoading"
        @click="handleSubmit"
      >
        发送
      </n-button>
      <n-button
        v-show="isLoading"
        @click="stop"
        circle
      >
        <template #icon>
          <n-icon>
            <StopCircleOutline />
          </n-icon>
        </template>
      </n-button>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.content {
  height: 100%;
  display: flex;
  flex-direction: column;

  .messages {
    flex: 1;
    overflow-y: auto;
    padding: 16px 24px;
    display: flex;
    flex-direction: column;
    gap: 16px;
  }
}

.footer {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px 24px;
  flex-shrink: 0;
}
</style>