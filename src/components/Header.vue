<!-- src/components/Header.vue -->
<template>
    <header class="app-header">
      <div class="left-section">
        <h1>{{ title }}</h1>
        <div class="header-buttons">
          <button @click="createNew">Nuevo</button>
          <button @click="save">Guardar</button>
          <button @click="saveCopy" :disabled="!props.editing">Guardar copia</button>
          <button @click="goToHistory">Historial</button>
        </div>
      </div>
      <div class="mini-carousel">
        <div class="carousel-list">
          <div
            v-for="entry in recentEntries"
            :key="entry.id"
            class="carousel-item"
            :class="{ selected: entry.id === props.editingId }"
            @click="loadEntry(entry)"
          >
            <p class="snippet">{{ entry.text.slice(0, 20) }}...</p>
            <small>
                <div>{{ new Date(entry.updatedAt).toLocaleDateString() }}</div>
                <div class="time">{{ new Date(entry.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }}</div>
            </small>
          </div>
          <!-- Último cuadrado: enlace al historial completo -->
          <div class="carousel-item history-link" @click="goToHistory">
            <p class="link-text">Ver Todo</p>
          </div>
        </div>
      </div>
    </header>
  </template>
  
  <script setup>
  import { ref, onMounted, watch } from 'vue'
  import { useRouter } from 'vue-router'
  
  const props = defineProps({
    editing: {
      type: Boolean,
      default: false
    },
    editingId: {
      type: [String, Number],
      default: null
    },
    historyVersion: {
      type: Number,
      default: 0
    }
  })
  
  const emit = defineEmits(['nuevo', 'guardar', 'guardar-copia', 'cargar-entrada'])
  const router = useRouter()
  
  const title = 'Editor Markdown'
  
  // Variable reactiva para las 5 últimas entradas.
  const recentEntries = ref([])
  
  const loadRecentEntries = () => {
    const history = JSON.parse(localStorage.getItem('historyMarkdowns')) || []
    history.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
    recentEntries.value = history.slice(0, 5)
  }
  
  onMounted(() => {
    loadRecentEntries()
  })
  
  // Watch para recargar las entradas cuando historyVersion cambie.
  watch(
    () => props.historyVersion,
    () => {
      loadRecentEntries()
    }
  )
  
  // Métodos de los botones
  const createNew = () => {
    emit('nuevo')
  }
  
  const save = () => {
    emit('guardar')
  }
  
  const saveCopy = () => {
    emit('guardar-copia')
  }
  
  const goToHistory = () => {
    router.push('/historial')
  }
  
  // Al hacer clic en una entrada del mini carrusel, se emite el evento para cargarla en el editor.
  const loadEntry = (entry) => {
    emit('cargar-entrada', entry.text, entry.id)
  }
  </script>
  
  <style scoped>
  /* Fijamos el header en la parte superior con un alto fijo */
  .app-header {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 70px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color: #42b983;
    color: #fff;
    padding: 0 1rem;
    box-sizing: border-box;
    z-index: 1000;
  }
  
  .left-section {
    display: flex;
    align-items: center;
    gap: 1rem;
  }
  
  .left-section h1 {
    margin: 0;
    font-size: 1.5rem;
    white-space: nowrap;
  }
  
  .header-buttons {
    display: flex;
    gap: 0.5rem;
  }
  
  button {
    background-color: #fff;
    color: #42b983;
    border: none;
    padding: 0.5rem 1rem;
    border-radius: 4px;
    cursor: pointer;
    font-weight: bold;
    white-space: nowrap;
    transition: background-color 0.2s;
  }
  
  button:hover:not(:disabled) {
    background-color: #eee;
  }
  
  button:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
  
  .mini-carousel {
    display: flex;
    align-items: center;
  }
  
  .carousel-list {
    display: flex;
    gap: 0.5rem;
  }
  
  /* Todas las tarjetas tendrán un borde de 3px (transparente por defecto) para evitar cambios de tamaño */
  .carousel-item {
    background: #fff;
    color: #42b983;
    width: 80px;
    height: 80px;
    padding: 0.5rem;
    border-radius: 8px;
    cursor: pointer;
    border: 3px solid transparent;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    transition: transform 0.2s, background-color 0.2s, border-color 0.2s;
  }
  
  .carousel-item:hover {
    transform: scale(1.05);
    background: #f0f0f0;
  }
  
  /* Tarjeta seleccionada: resalta con un borde de color verde oscuro */
  .carousel-item.selected {
    border-color: #2e7d32;
  }
  
  .snippet {
    margin: 0;
    font-size: 0.7rem;
    text-align: center;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    width: 100%;
    box-sizing: border-box;
  }

  
  /* Último cuadrado: enlace al historial completo */
  .history-link {
    background-color: #42b983;
    border: 3px solid #fff;
  }
  
  .history-link .link-text {
    color: #fff;
    font-weight: bold;
    margin: 0;
    font-size: 0.8rem;
    text-align: center;
  }

  .time {
    font-size: 0.6rem;
    margin-top: 2px;
  }
  </style>
  