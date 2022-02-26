<template>
  <n-text tag="div" :depth="1" class="preview" >
    <n-scrollbar x-scrollable class="preview-scrollbar">
      <div v-html="result"></div>
    </n-scrollbar>
  </n-text>
</template>
<script setup lang="ts">
import html5Preset from '@bbob/preset-html5/es'
import { render } from '@bbob/html/es'
import bbob from '@bbob/core'
import { NText, NScrollbar } from 'naive-ui'
import { watchEffect } from 'vue'

interface Props {
  modelValue: string
}

const { modelValue } = defineProps<Props>()
defineEmits(['update:modelValue'])

let result = $ref('')

watchEffect((value) => {
  result = bbob(html5Preset()).process(modelValue, { render }).html.replace(/\n/g, '<br>')
})

</script>
<style>
.preview {
  margin: 8px;
  height: 100%
}

.preview-scrollbar {
  min-height: calc(100vh - 64px);
}
</style>
