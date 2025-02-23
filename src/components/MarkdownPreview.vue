<!-- src/components/MarkdownPreview.vue -->
<script setup>
import { computed } from 'vue'
import useMarkdown from '@/composables/useMarkdown.js'

const props = defineProps({
  markdown: {
    type: String,
    default: ''
  }
})

const renderedHTML = computed(() => useMarkdown(props.markdown))
</script>

<template>
  <div class="preview" v-html="renderedHTML"></div>
</template>

<style scoped>
.preview {
  width: 100%;
  height: 100%;
  padding: 1rem;
  border: 1px solid #eee;
  background-color: #fafafa;
  overflow-y: auto;
  box-sizing: border-box;
}
</style>
