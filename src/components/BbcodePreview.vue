<template>
  <n-text tag="div" :depth="1" ><div v-html="result"></div></n-text>
</template>
<script setup lang="ts">
import html5Preset from '@bbob/preset-html5/es'
import { render } from '@bbob/html/es'
import bbob from '@bbob/core'
import { NText } from 'naive-ui'
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
