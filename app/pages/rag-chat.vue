<script lang="ts" setup>
import { Chat } from '@ai-sdk/vue'
import { DefaultChatTransport } from 'ai';
import { useMessage } from 'naive-ui';
import { CloudDownloadOutline } from '@vicons/ionicons5';

const message = useMessage();

const chat = new Chat({
  transport: new DefaultChatTransport({
    api: '/api/chat',
  }),
  onError: (error) => {
    message.error(error.message)
  },
});

const input = ref('');
const uploading = ref(false);
const fileList = ref([]);

function handleSubmit() {
  if (!input.value.trim() || isLoading.value) return;

  chat.sendMessage({ text: input.value });
  input.value = '';
};

const isLoading = computed(() => chat.status !== 'ready' );
</script>

<template>
  <div class="content">
    <n-upload
      v-model:file-list="fileList"
      accept=".pdf"
      action="/api/upload"
      :show-file-list="false"
    >
      <n-icon size="72">
        <CloudDownloadOutline />
      </n-icon>
      <div>文件拖动到此处即可上传</div>
      <div>仅支持PDF文档</div>
    </n-upload>
    
    <div class="messages"></div>
    
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

::v-deep(.n-upload) {
  width: 100%;
  height: 100%;
  border: 4px dashed #e0e0e0;
  border-radius: 8px;
  background: #f5f5f5;

  .n-upload-trigger {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 8px;
    font-size: 18px;
    font-weight: 500;
  }
}
</style>