<script lang="ts" setup>
import { CheckmarkCircle } from '@vicons/ionicons5';

defineProps<{
  toolName: string | undefined;
  state: string | undefined;
  input: unknown;
  output?: unknown;
}>();
</script>

<template>
  <n-card size="small" style="margin-bottom: 8px;">
    <template v-if="state === 'input-available'">
      <n-spin :size="16" />
      正在调用 {{ toolName }}...
    </template>
    <template v-else-if="state === 'output-available'">
      <n-icon :component="CheckmarkCircle" size="16" />
      调用 {{ toolName }} 完成
      <n-collapse>
        <n-collapse-item title="查看结果">
          <pre>{{ JSON.stringify(output, null, 2)}}</pre>
        </n-collapse-item>
      </n-collapse>
    </template>
  </n-card>
</template>