<script lang="ts" setup>
import { CheckmarkCircle } from '@vicons/ionicons5';

defineProps<{
  state: string | undefined;
  text: string;
}>();
</script>

<template>
  <n-card size="small" style="margin-bottom: 8px;">
    <template v-if="state === 'streaming'">
      正在思考中...
    </template>
    <template v-else-if="state === 'done'">
      <n-icon :component="CheckmarkCircle" size="16" />
      思考完成
      <n-collapse>
        <n-collapse-item title="查看结果">
          <pre>{{ JSON.stringify(text, null, 2)}}</pre>
        </n-collapse-item>
      </n-collapse>
    </template>
  </n-card>
</template>