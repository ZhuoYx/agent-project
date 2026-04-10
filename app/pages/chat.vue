<script setup lang="ts">
import { Chat } from '@ai-sdk/vue';
import { DefaultChatTransport, isTextUIPart } from 'ai';
import { ref, computed } from 'vue';
import { StopCircleOutline } from '@vicons/ionicons5';

const chat = new Chat({
  transport: new DefaultChatTransport({
    api: '/api/chat'
  })
});

const input = ref('');

function handleSubmit() {
  if (!input.value.trim() || chat.status === 'streaming') return;

  chat.sendMessage({ text: input.value });
  input.value = '';
};

const isLoading = computed(() => chat.status === 'streaming' );
</script>

<template>
  <div class="content">
    <div class="messages">
      <div v-for="msg of chat.messages" :key="msg.id">
        <span>{{ msg.role === 'user' ? '你' : 'AI' }}:</span>
        <span v-for="part of msg.parts" :key="part.type">
          <span v-if="isTextUIPart(part)">{{ part.text }}</span>
        </span>
      </div>
    </div>

    <div class="footer">
      <n-input
        v-model:value="input"
        placeholder="输入消息..."
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
        @click="chat.stop"
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

<style scoped>
.content {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.messages {
  flex: 1;
  overflow-y: auto;
  padding: 16px 24px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.footer {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px 24px;
  flex-shrink: 0;
}
</style>