<!-- src/components/MarkdownEditor.vue -->
<script setup>
const props = defineProps({
  modelValue: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['update:modelValue'])

const updateText = (event) => {
  emit('update:modelValue', event.target.value)
}
</script>

<template>
  <div class="editor">
    <textarea 
      :value="modelValue" 
      @input="updateText" 
      placeholder="Pega o escribe aquí tu Markdown"
    ></textarea>
  </div>
</template>

<style scoped>
.editor {
  height: 100%;
}
.editor textarea {
  width: 100%;
  height: 100%;
  padding: 0.5rem;
  font-family: monospace;
  font-size: 1rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  resize: none;
  box-sizing: border-box;
}
</style>
