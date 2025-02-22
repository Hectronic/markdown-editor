<!-- src/components/Header.vue -->
<script setup>
const props = defineProps({
  editing: {
    type: Boolean,
    default: false
  }
})

const title = 'Editor Markdown'
const emit = defineEmits(['nuevo', 'guardar', 'guardar-copia'])

const createNew = () => {
  emit('nuevo')
}

const save = () => {
  emit('guardar')
}

const saveCopy = () => {
  emit('guardar-copia')
}
</script>

<template>
  <header class="app-header">
    <h1>{{ title }}</h1>
    <div class="header-buttons">
      <button @click="createNew">Nuevo</button>
      <button @click="save">Guardar</button>
      <button @click="saveCopy" :disabled="!editing">Guardar copia</button>
      <router-link to="/historial">
        <button>Historial</button>
      </router-link>
    </div>
  </header>
</template>

<style scoped>
.app-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #42b983;
  color: #fff;
  padding: 1rem;
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
}
button:hover:not(:disabled) {
  background-color: #eee;
}
button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>
