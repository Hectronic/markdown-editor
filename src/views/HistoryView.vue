<!-- src/views/HistoryView.vue -->
<template>
  <div class="history-container">
    <!-- Importa el header nuevo con solo el botón de volver y título -->
    <HistoryHeader />

    <!-- Contenedor de tarjetas con scroll vertical -->
    <div class="cards-wrapper">
      <div class="cards-grid">
        <div v-for="entry in history" :key="entry.id" class="card">
          <div class="card-content">
            <pre class="entry-text">{{ entry.text }}</pre>
          </div>
          <div class="card-info">
            <div class="dates">
              <div>Creado: {{ formatDate(entry.createdAt).date }}</div>
              <div class="time">Hora: {{ formatDate(entry.createdAt).time }}</div>
              <div>Modificado: {{ formatDate(entry.updatedAt).date }}</div>
              <div class="time">Hora: {{ formatDate(entry.updatedAt).time }}</div>
            </div>
            <div class="card-buttons">
              <button @click="viewEntry(entry.id)">Ver</button>
              <button @click="deleteEntry(entry.id)">Borrar</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import HistoryHeader from '@/components/HistoryHeader.vue'

const router = useRouter()
const history = ref([])

const loadHistory = () => {
  let hist = JSON.parse(localStorage.getItem('historyMarkdowns')) || []
  // Ordena descendente por la fecha de última modificación
  hist.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
  history.value = hist
}

onMounted(() => {
  loadHistory()
})

const viewEntry = (id) => {
  const entry = history.value.find(entry => entry.id === id)
  if (entry) {
    localStorage.setItem('selectedMarkdown', entry.text)
    localStorage.setItem('selectedMarkdownId', entry.id)
    router.push('/')
  }
}

const deleteEntry = (id) => {
  history.value = history.value.filter(entry => entry.id !== id)
  localStorage.setItem('historyMarkdowns', JSON.stringify(history.value))
}

const formatDate = (dateStr) => {
  const dateObj = new Date(dateStr)
  return {
    date: dateObj.toLocaleDateString(),
    time: dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }
}
</script>

<style scoped>
/* Contenedor principal: usar height fijo para forzar scroll en el contenido */
.history-container {
  display: flex;
  flex-direction: column;
  padding: 1rem;
  background: #f9f9f9;
  height: 100vh; /* Fijamos la altura completa de la ventana */
  box-sizing: border-box;
  padding-top: 70px;
}

/* Contenedor de tarjetas: ocupa el espacio restante y permite scroll vertical */
.cards-wrapper {
  flex: 1;
  overflow-y: auto;
}

/* Cuadrícula de tarjetas en 4 columnas */
.cards-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 1rem;
}

/* Tarjeta individual con altura fija */
.card {
  background: #f0f0f0;
  border-radius: 4px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  display: flex;
  flex-direction: column;
  height: 250px; /* Altura fija */
  box-sizing: border-box;
  overflow: hidden;
}

/* Contenido de la tarjeta */
.card-content {
  padding: 0.5rem;
  overflow: auto;
  flex: 1;
}

.entry-text {
  margin: 0;
  font-size: 0.9rem;
  white-space: pre-wrap;
  word-break: break-word;
}

/* Información en la parte inferior */
.card-info {
  padding: 0.5rem;
  background: #e0e0e0;
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
}

.dates {
  font-size: 0.8rem;
  color: #555;
  display: flex;
  flex-direction: column;
}

.dates .time {
  font-size: 0.7rem;
  margin-top: 2px;
}

.card-buttons {
  margin-top: auto;
  display: flex;
  gap: 0.5rem;
}

.card-buttons button {
  flex: 1;
  background-color: #42b983;
  color: #fff;
  border: none;
  padding: 0.3rem 0.5rem;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.8rem;
}

.card-buttons button:hover {
  background-color: #369870;
}
</style>
