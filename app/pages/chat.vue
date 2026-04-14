<script setup lang="ts">
import { Chat } from '@ai-sdk/vue';
import { DefaultChatTransport, isReasoningUIPart, isTextUIPart, isToolUIPart } from 'ai';
import { ref, computed } from 'vue';
import { StopCircleOutline, Person, LogoReddit } from '@vicons/ionicons5';
import { useMessage } from 'naive-ui'
import ReasoningCard from '@/components/reasoning-card.vue';
import ToolcallCard from '@/components/toolcall-card.vue'

const message = useMessage()

const chat = new Chat({
  transport: new DefaultChatTransport({
    api: '/api/chat',
  }),
  onError: (error) => {
    message.error(error.message)
  },
});

const input = ref('');

function handleSubmit() {
  if (!input.value.trim() || isLoading.value) return;

  chat.sendMessage({ text: input.value });
  input.value = '';
};

const isLoading = computed(() => chat.status !== 'ready' );
</script>

<template>
  <div class="content">
    <div class="messages">
      <div
        v-for="msg of chat.messages"
        :key="msg.id"
        class="messages-box"
        :class="msg.role === 'user' ? 'messages-user' : 'messages-ai'"
      >
        <n-icon
          :component="msg.role === 'assistant' ? LogoReddit : Person"
          size="32"
        />
        <div>
          <template v-for="(part, index) of msg.parts" :key="index">
            <ReasoningCard
              v-if="isReasoningUIPart(part)"
              :state="part.state"
              :text="part.text"
            />
            <ToolcallCard
              v-if="isToolUIPart(part)"
              :tool-name="part.title"
              :state="part.state"
              :input="part.input"
              :output="part.output"
            />
            <span v-else-if="isTextUIPart(part)">{{ part.text }}</span>
          </template>
        </div>
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

    &-box {
      max-width: 70%;
      width: fit-content;
      display: flex;
      align-items: flex-start;
      gap: 12px;

      i {
        padding-top: 4px;
      }

      &>div {
        padding: 8px 12px;
        border-radius: 8px;
        background-color: #f5f5f5;
        border: 1px solid #e5e5e5;
        flex: 1;
      }
    }

    &-ai {
      min-width: 50%;
      align-self: flex-start;
    }

    &-user {
      align-self: flex-end;
      flex-direction: row-reverse;
    }
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