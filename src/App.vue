<script setup>
/*
TODO:
edit props structure
edit props
undo actions: useManualRefHistory? or Pinia? ...or withouts libs
save data
*/
import { ref } from 'vue'
import itemsList from './itemsList.vue'

const items = ref([
  { "id": 732785649503224, "name": "Panqueque de dulce de leche", "level": 0, "cost": 1, "open": true },
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
  <div id="treeView" onselectstart='return false;'>
    <itemsList :items="items"></itemsList>
  </div>
  <div style="position:absolute; bottom:0;height: 40vh; overflow-y: scroll;width:100%;">
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

#treeView {
  height: 60vh;
  overflow-y: scroll;
  overflow-x: hidden;
}
</style>
