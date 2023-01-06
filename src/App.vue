<script setup>
import { ref } from 'vue'
import itemsList from './itemsList.vue'


// const items = ref([
//   { name: 'AP01', id: 1 },
//   { name: 'Armar', id: 2 },
//   { name: 'Movimiento', id: 3 },
//   { name: 'Zócalo GU10', id: 4 },
//   { name: 'Base', id: 5 },
//   { name: 'Terminación', id: 6 },
//   { name: 'Mecanizado', id: 7 },
//   { name: 'Chapa nº20 160x121', id: 8 },
//   { name: 'Cilindro', id: 9 },
//   { name: 'Terminación', id: 10 },
//   { name: 'Mecanizado', id: 11 },
//   { name: 'Cilindro repujado', id: 12 }
// ])

// const items = ref([
//   { "name": "AP01", "id": 1, "level": 0, "successors": [2] },
//   { "name": "Armar", "id": 2, "level": 1, "predecessors": [1], "successors": [3, 4, 5, 9] },
//   { "name": "Movimiento", "id": 3, "level": 2, "predecessors": [2] },
//   { "name": "Zócalo GU10", "id": 4, "level": 2, "predecessors": [2] },
//   { "name": "Base", "id": 5, "level": 2, "successors": [6], "predecessors": [2] },
//   { "name": "Terminación", "id": 6, "level": 3, "successors": [7], "predecessors": [5] },
//   { "name": "Mecanizado", "id": 7, "level": 4, "successors": [8], "predecessors": [6] },
//   { "name": "Chapa nº20 160x121", "id": 8, "level": 5, "predecessors": [7] },
//   { "name": "Cilindro", "id": 9, "level": 2, "successors": [10], "predecessors": [2] },
//   { "name": "Terminación", "id": 10, "level": 3, "successors": [11], "predecessors": [9] },
//   { "name": "Mecanizado", "id": 11, "level": 4, "successors": [12], "predecessors": [10] },
//   { "name": "Cilindro repujado", "id": 12, "level": 5, "predecessors": [11] }
// ])

// const items = ref([
//   { "name": "AP01", "id": 1, "level": 0, "successors": [2], "cost": 1 },
//   { "name": "Armar", "id": 2, "level": 1, "successors": [3, 4, 5, 9], "cost": 1 },
//   { "name": "Movimiento", "id": 3, "level": 2, "cost": 1 },
//   { "name": "Zócalo GU10", "id": 4, "level": 2, "cost": 1 },
//   { "name": "Base", "id": 5, "level": 2, "successors": [6], "cost": 1 },
//   { "name": "Terminación", "id": 6, "level": 3, "successors": [7], "cost": 1 },
//   { "name": "Mecanizado", "id": 7, "level": 4, "successors": [8], "cost": 1 },
//   { "name": "Chapa nº20 160x121", "id": 8, "level": 5, "cost": 3 },
//   { "name": "Cilindro", "id": 9, "level": 2, "successors": [10], "cost": 1 },
//   { "name": "Terminación", "id": 10, "level": 3, "successors": [11], "cost": 1 },
//   { "name": "Mecanizado", "id": 11, "level": 4, "successors": [12], "cost": 2 },
//   { "name": "Cilindro repujado", "id": 12, "level": 5, "cost": 3 }
// ])

const items = ref([
  { "name": "AP01", "id": 1, "level": 0, "cost": 1 },
  { "name": "Armar", "id": 2, "level": 1, "cost": 1 },
  { "name": "Movimiento", "id": 3, "level": 2, "cost": 1 },
  { "name": "Zócalo GU10", "id": 4, "level": 2, "cost": 1 },
  { "name": "Base", "id": 5, "level": 2, "cost": 1 },
  { "name": "Terminación", "id": 6, "level": 3, "cost": 1 },
  { "name": "Mecanizado", "id": 7, "level": 4, "cost": 1 },
  { "name": "Chapa nº20 160x121", "id": 8, "level": 5, "cost": 3 },
  { "name": "Cilindro", "id": 9, "level": 2, "cost": 1 },
  { "name": "Terminación", "id": 10, "level": 3, "cost": 1 },
  { "name": "Mecanizado", "id": 11, "level": 4, "cost": 2 },
  { "name": "Cilindro repujado", "id": 12, "level": 5, "cost": 3 }
  //,  { "name": "*", "id": -1, "level": -1}
])
</script>

<template>
  <itemsList :items="items"></itemsList>

  <div style="position:absolute; bottom:0;height: 49vh; overflow-y: scroll;width:100%;">
    <div v-for="item in items" style="overflow:hidden; white-space: nowrap;"> {{ item }}</div>
  </div>
</template>

<style>
body {
  margin: 0;
  padding: 0;
  overflow: hidden;
  font-family: "Clear Sans", "Helvetica Neue", Arial, sans-serif;
  font-size: 2vh;
  background-color: rgb(255, 253, 228);
  color: rgb(12, 12, 12);
}
</style>
