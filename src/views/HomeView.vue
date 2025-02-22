<!-- src/views/HomeView.vue -->
<template>
    <div>
      <Header
        :editing="!!editingId"
        :editingId="editingId"
        :historyVersion="historyVersion"
        @nuevo="handleNuevo"
        @guardar="handleGuardar"
        @guardar-copia="handleGuardarCopia"
        @cargar-entrada="handleCargarEntrada"
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
  const historyVersion = ref(0) // Para notificar cambios en el historial
  
  // Función para actualizar el historial en localStorage y notificar la actualización.
  const updateHistoryStorage = (history) => {
    localStorage.setItem('historyMarkdowns', JSON.stringify(history))
    historyVersion.value++
  }
  
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
        // Crea una nueva entrada.
        history.push({
          id: Date.now().toString(),
          text: markdownText.value,
          createdAt: now,
          updatedAt: now
        })
      }
      updateHistoryStorage(history)
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
      updateHistoryStorage(history)
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
      updateHistoryStorage(history)
    }
  }
  
  // Función para cargar una entrada en el editor (evento "cargar-entrada" desde Header).
  const handleCargarEntrada = (text, id) => {
    markdownText.value = text
    editingId.value = id
  }
  </script>
  
  <style scoped>  
  /* El contenedor se sitúa justo debajo del header fijo (70px) y ocupa el alto restante */
  .container {
    margin-top: 70px;
    height: calc(100vh - 70px);
    display: flex;
    overflow: hidden;
  }
  
  /* Las columnas permiten scroll solo si su contenido excede el alto disponible */
  .column {
    flex: 1;
    padding: 1rem;
    box-sizing: border-box;
    overflow-y: auto;
  }
  body {
    margin: 0;
    padding: 0;
    overflow: hidden;
  }
  </style>
  
  