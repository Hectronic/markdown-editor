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
  
  // Si se carga una entrada del historial, se guarda su id para edición.
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
  
  // Función que guarda o actualiza la entrada actual en el historial y limpia el editor.
  const handleNuevo = () => {
    const history = JSON.parse(localStorage.getItem('historyMarkdowns')) || []
    if (markdownText.value.trim() !== '') {
      const now = new Date().toISOString()
      if (editingId.value) {
        // Actualiza la entrada existente.
        const index = history.findIndex(entry => entry.id == editingId.value)
        if (index !== -1) {
          history[index].text = markdownText.value
          history[index].updatedAt = now
        } else {
          // Por si no se encuentra, se crea una nueva.
          history.push({
            id: Date.now().toString(),
            text: markdownText.value,
            createdAt: now,
            updatedAt: now
          })
        }
      } else {
        // Crea una nueva entrada con id autogenerado y fechas.
        history.push({
          id: Date.now().toString(),
          text: markdownText.value,
          createdAt: now,
          updatedAt: now
        })
      }
      localStorage.setItem('historyMarkdowns', JSON.stringify(history))
    }
    // Limpia el editor y resetea el modo de edición.
    markdownText.value = ''
    editingId.value = null
  }
  
  // Función para guardar (crear o actualizar) la entrada actual sin limpiar el editor.
  const handleGuardar = () => {
    if (markdownText.value.trim() !== '') {
      const now = new Date().toISOString()
      const history = JSON.parse(localStorage.getItem('historyMarkdowns')) || []
      if (editingId.value) {
        // Si ya existe un id, actualiza la entrada existente.
        const index = history.findIndex(entry => entry.id == editingId.value)
        if (index !== -1) {
          history[index].text = markdownText.value
          history[index].updatedAt = now
        }
      } else {
        // Si no existe id, crea una nueva entrada y asigna su id a editingId.
        const newId = Date.now().toString()
        history.push({
          id: newId,
          text: markdownText.value,
          createdAt: now,
          updatedAt: now
        })
        editingId.value = newId
      }
      localStorage.setItem('historyMarkdowns', JSON.stringify(history))
    }
  }
  
  // Función para guardar una copia: crea una nueva entrada con el contenido actual.
  const handleGuardarCopia = () => {
    if (editingId.value && markdownText.value.trim() !== '') {
      const history = JSON.parse(localStorage.getItem('historyMarkdowns')) || []
      const now = new Date().toISOString()
      history.push({
        id: Date.now().toString(),
        text: markdownText.value,
        createdAt: now,
        updatedAt: now
      })
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
  