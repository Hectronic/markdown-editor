<!-- src/views/HomeView.vue -->
<template>
    <div>
      <Header
        :editing="!!editingId"
        @nuevo="handleNuevo"
        @guardar="handleGuardar"
        @guardar-copia="handleGuardarCopia"
      />
      <div class="container">
        <div class="column">
          <MarkdownEditor v-model="markdownText" />
        </div>
        <div class="column">
          <MarkdownPreview :markdown="markdownText" />
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue'
  import Header from '@/components/Header.vue'
  import MarkdownEditor from '@/components/MarkdownEditor.vue'
  import MarkdownPreview from '@/components/MarkdownPreview.vue'
  
  const markdownText = ref(`# Bienvenido al Editor Markdown
  
  Escribe **Markdown** y visualiza el resultado en tiempo real.`)
  
  // Si se carga una entrada desde el historial, se guarda su id para edición.
  const editingId = ref(null)
  
  // Al montar la vista, si hay una entrada seleccionada se carga en el editor.
  onMounted(() => {
    const selectedText = localStorage.getItem('selectedMarkdown')
    const selectedId = localStorage.getItem('selectedMarkdownId')
    if (selectedText) {
      markdownText.value = selectedText
      editingId.value = selectedId
      localStorage.removeItem('selectedMarkdown')
      localStorage.removeItem('selectedMarkdownId')
    }
  })
  
  // Función que guarda el contenido actual: si se está editando, actualiza; si no, crea una nueva entrada.
  const handleNuevo = () => {
    const history = JSON.parse(localStorage.getItem('historyMarkdowns')) || []
    if (markdownText.value.trim() !== '') {
      if (editingId.value) {
        // Actualiza la entrada existente.
        const index = history.findIndex(entry => entry.id == editingId.value)
        if (index !== -1) {
          history[index].text = markdownText.value
        } else {
          // Si no se encuentra (por alguna inconsistencia), se crea una nueva.
          history.push({ id: Date.now(), text: markdownText.value })
        }
      } else {
        // Crea una nueva entrada con un id autogenerado.
        history.push({ id: Date.now(), text: markdownText.value })
      }
      localStorage.setItem('historyMarkdowns', JSON.stringify(history))
    }
    // Limpia el editor y resetea el modo de edición.
    markdownText.value = ''
    editingId.value = null
  }
  
  // Función para actualizar la entrada actual sin limpiar el editor.
  const handleGuardar = () => {
    if (editingId.value && markdownText.value.trim() !== '') {
      const history = JSON.parse(localStorage.getItem('historyMarkdowns')) || []
      const index = history.findIndex(entry => entry.id == editingId.value)
      if (index !== -1) {
        history[index].text = markdownText.value
        localStorage.setItem('historyMarkdowns', JSON.stringify(history))
      }
    }
  }
  
  // Función para guardar una copia: guarda el contenido actual como una nueva entrada sin afectar la edición actual.
  const handleGuardarCopia = () => {
    if (editingId.value && markdownText.value.trim() !== '') {
      const history = JSON.parse(localStorage.getItem('historyMarkdowns')) || []
      history.push({ id: Date.now(), text: markdownText.value })
      localStorage.setItem('historyMarkdowns', JSON.stringify(history))
    }
  }
  </script>
  
  <style scoped>
  .container {
    display: flex;
    height: calc(100vh - 70px);
    overflow: hidden;
  }
  .column {
    flex: 1;
    padding: 1rem;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    overflow: hidden;
  }
  </style>
  