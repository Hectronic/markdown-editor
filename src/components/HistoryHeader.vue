<!-- src/components/HistoryHeader.vue -->
<template>
    <header class="history-header">
      <h1 class="title">Editor Markdown</h1>
      <router-link to="/"><button class="volver-button">Volver</button></router-link>
    </header>
  </template>
  
  <script setup>
  import { useRouter } from 'vue-router'
  </script>
  
  <style scoped>
  .history-header {
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
  
  .title {
    font-size: 1.5rem;
    color: #fff;
    margin: 0;
  }
  
  .volver-button {
    background-color: #fff;
    color: #42b983;
    border: none;
    padding: 0.5rem 1rem;
    border-radius: 4px;
    cursor: pointer;
    font-weight: bold;
  }
  
  .volver-button:hover {
    background-color: #eee;
  }
  </style>
  
  