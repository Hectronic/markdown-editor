<!-- src/views/HistoryView.vue -->
<template>
  <div class="history">
    <h2>Historial de Markdown Guardados</h2>
    <ul>
      <li v-for="entry in history" :key="entry.id">
        <pre>{{ entry.text }}</pre>
        <div class="info">
          <small>Creado: {{ formatDate(entry.createdAt) }}</small>
          <small>Última Modificación: {{ formatDate(entry.updatedAt) }}</small>
        </div>
        <div class="buttons">
          <button @click="viewEntry(entry.id)">Ver</button>
          <button @click="deleteEntry(entry.id)">Borrar</button>
        </div>
      </li>
    </ul>
    <router-link to="/"><button>Volver</button></router-link>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const history = ref([])

const loadHistory = () => {
  history.value = JSON.parse(localStorage.getItem('historyMarkdowns')) || []
}

onMounted(() => {
  loadHistory()
})

const viewEntry = (id) => {
  const entry = history.value.find((entry) => entry.id === id)
  if (entry) {
    localStorage.setItem('selectedMarkdown', entry.text)
    localStorage.setItem('selectedMarkdownId', entry.id)
    router.push('/')
  }
}

const deleteEntry = (id) => {
  history.value = history.value.filter((entry) => entry.id !== id)
  localStorage.setItem('historyMarkdowns', JSON.stringify(history.value))
}

const formatDate = (dateStr) => {
  const date = new Date(dateStr)
  return date.toLocaleString()
}
</script>

<style scoped>
.history {
  padding: 1rem;
}
ul {
  list-style: none;
  padding: 0;
}
li {
  background: #f0f0f0;
  margin-bottom: 1rem;
  padding: 1rem;
  border-radius: 4px;
  white-space: pre-wrap;
}
.info {
  margin-top: 0.5rem;
  font-size: 0.8rem;
  color: #555;
  display: flex;
  flex-direction: column;
}
.buttons {
  margin-top: 0.5rem;
}
button {
  margin-right: 0.5rem;
  background-color: #42b983;
  color: #fff;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
}
button:hover {
  background-color: #369870;
}
</style>
