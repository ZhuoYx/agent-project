<script lang="ts" setup>
import { Chat } from '@ai-sdk/vue'
import { DefaultChatTransport, isReasoningUIPart, isTextUIPart, isToolUIPart } from 'ai';
import { useMessage } from 'naive-ui';
import { CloudDownloadOutline, StopCircleOutline, LogoReddit, Person } from '@vicons/ionicons5';

const message = useMessage();

const chat = new Chat({
  transport: new DefaultChatTransport({
    api: '/api/rag-chat',
  }),
  onError: (error) => {
    message.error(error.message)
  },
});

const input = ref('');
const fileList = ref<any>([]);

function handleSubmit() {
  if (!input.value.trim() || isLoading.value) return;

  chat.sendMessage({ text: input.value });
  input.value = '';
};

const isLoading = computed(() => chat.status !== 'ready' );

async function uploadFiles(files: File[]) {
  const uploadPromises = files.map(file => {
    const formData = new FormData();
    formData.append('file', file);

    return fetch('/api/upload', {
      method: 'POST',
      body: formData
    }).then(res => {
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      return res.json()
    }).then(data => ({
      file,
      success: true,
      data
    })).catch(err => ({
      file,
      success: false,
      error: err.message
    })) as Promise<{ file: File; success: boolean; data?: any; error?: string }>
  });

  const results = await Promise.all(uploadPromises)
  const successData = results.filter(result => result.success).map(result => result.data);
  const failedFiles = results.filter(result => !result.success).map(result => result.file.name);
  if (failedFiles.length > 0) {
    message.error(`文件上传失败: ${failedFiles.join(', ')}`);
  }

  fileList.value.push(...successData)
}

const isDragging = ref(false)
const drapCount = ref(0)
function handleDropLeave(e: DragEvent) {
  drapCount.value--

  if (drapCount.value <= 0) {
    drapCount.value = 0
    isDragging.value = false
  }
}
function handleDrop(e: DragEvent) {
  isDragging.value = false
  
  // 获取拖拽文件
  const files = Array.from(e.dataTransfer?.files || []);

  // 过滤PDF文件
  const pdfFiles = files.filter(file => file.type === 'application/pdf' || file.name.toLocaleLowerCase().endsWith('.pdf'));

  if (pdfFiles.length === 0) {
    message.warning('请拖拽PDF文件。');
    return;
  }

  uploadFiles(pdfFiles);
}
</script>

<template>
  <div
    class="content"
    @dragover.prevent
    @dragenter.prevent="isDragging = true; drapCount++"
    @dragleave.prevent="handleDropLeave"
    @drop.prevent="handleDrop"
  >
    <div v-show="isDragging" style="height: 100%; width: 100%; pointer-events: none;">
      <n-upload
        v-model:file-list="fileList"
        accept=".pdf"
        action="/api/upload"
        :show-file-list="false"
        disabled
      >
        <n-icon size="72">
          <CloudDownloadOutline />
        </n-icon>
        <div>文件拖动到此处即可上传</div>
        <div>仅支持PDF文档</div>
      </n-upload>
    </div>

    <div v-if="fileList.length > 0 && !isDragging" class="file-list">
      <div
        v-for="(file, index) of fileList"
        :key="index"
        class="file-item"
      >
        {{ file.filename }}
      </div>
    </div>
    
    <div
      v-show="!isDragging"
      class="messages"
    >
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

  .file-list {
    display: flex;
    gap: 16px;
    padding: 16px 24px;
  }

  .file-item {
    height: 100%;
    width: fit-content;
    background-color: rgb(79, 161, 255);
    border-radius: 4px;
    padding: 8px 12px;
    color: #fff;
  }

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