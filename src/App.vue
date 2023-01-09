<script setup>
import { ref } from 'vue'
import itemsList from './itemsList.vue'

// const items = ref([
//   { "name": "AP01", "id": 1, "level": 0, "cost": 1 },
//   { "name": "Armar", "id": 2, "level": 1, "cost": 1 },
//   { "name": "Movimiento", "id": 3, "level": 2, "cost": 1 },
//   { "name": "Zócalo GU10", "id": 4, "level": 2, "cost": 1 },
//   { "name": "Base", "id": 5, "level": 2, "cost": 1 },
//   { "name": "Terminación", "id": 6, "level": 3, "cost": 1 },
//   { "name": "Mecanizado", "id": 7, "level": 4, "cost": 1 },
//   { "name": "Chapa nº20 160x121", "id": 8, "level": 5, "cost": 3 },
//   { "name": "Cilindro", "id": 9, "level": 2, "cost": 1 },
//   { "name": "Terminación", "id": 10, "level": 3, "cost": 1 },
//   { "name": "Mecanizado", "id": 11, "level": 4, "cost": 2 },
//   { "name": "Cilindro repujado", "id": 12, "level": 5, "cost": 3 }
// ])

const items = ref([
  { "name": "Panqueque de dulce de leche", "id": 1, "level": 0, "cost": 1, "open": true },
  { "id": 732785649504646, "name": "Enrollar", "level": 1, "cost": 2, "open": true },
  { "id": 732787039516608, "name": "Panqueque", "level": 2, "cost": 2, "open": true },
  { "id": 732787228074946, "name": "Cocinar vuelta y vuelta", "level": 3, "cost": 2, "open": true },
  { "id": 732787388636990, "name": "Pasta", "level": 4, "cost": 2, "open": true },
  { "id": 732787473433670, "name": "Batir", "level": 5, "cost": 2, "open": true },
  { "id": 732787615515042, "name": "Huevos", "level": 6, "cost": 2 },
  { "id": 732787613195910, "name": "Manteca derretida", "level": 6, "cost": 2 },
  { "id": 732787611591662, "name": "Leche", "level": 6, "cost": 2 },
  { "id": 732787609910024, "name": "Harina", "level": 6, "cost": 2 },
  { "id": 732787604156978, "name": "Esencia de vainilla", "level": 6, "cost": 2 },
  { "id": 732787571510938, "name": "Sal", "level": 6, "cost": 2 },
  { "id": 732787108951490, "name": "Dulce de leche", "level": 2, "cost": 2 }
])
</script>

<template>
  <div style="height: 70vh; overflow-y: scroll; overflow-x:hidden;" onselectstart='return false;'>
    <itemsList :items="items"></itemsList>
  </div>
  <div style="position:absolute; bottom:0;height: 30vh; overflow-y: scroll;width:100%;">
    <div v-for="item in items" style="overflow:hidden; white-space: nowrap;"> {{ item }},</div>
  </div>
</template>

<style>
body {
  margin: 0;
  padding: 0;
  overflow: hidden;
  background-color: rgb(255, 253, 228);
  color: rgb(12, 12, 12);
}

body,
input {
  font-family: "Clear Sans", "Helvetica Neue", Arial, sans-serif;
  font-size: 2vh;
}
</style>
