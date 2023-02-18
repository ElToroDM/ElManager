<script setup>
/*
TODO:
column titles
edit props structure
edit props
undo actions: useManualRefHistory? or Pinia? ...or without libs: https://vuejs.org/examples/#circle-drawer
save data
*/
import { ref, reactive, onMounted } from 'vue'
import ItemsList from './ItemsList.vue'
import PropsEdit from './PropsEdit.vue'
import Pane from './Pane.vue'

const items = ref([
  { "id": 732785649503224, "name": "Panqueque de dulce de leche", "level": 0, "cost": 1 },
  { "id": 732785649504646, "name": "Enrollar", "level": 1, "cost": 1 },
  { "id": 732787039516608, "name": "Panqueque", "level": 2, "cost": 1 },
  { "id": 732787228074946, "name": "Cocinar vuelta y vuelta", "level": 3, "cost": 2 },
  { "id": 732787388636990, "name": "Pasta", "level": 4, "cost": 1 },
  { "id": 732787473433670, "name": "Batir", "level": 5, "cost": 1 },
  { "id": 732787615515042, "name": "Huevos", "level": 6, "cost": 3 },
  { "id": 732787613195910, "name": "Manteca derretida", "level": 6, "cost": 1 },
  { "id": 732787611591662, "name": "Leche", "level": 6, "cost": 4 },
  { "id": 732787609910024, "name": "Harina", "level": 6, "cost": 2 },
  { "id": 732787604156978, "name": "Esencia de vainilla", "level": 6, "cost": 2 },
  { "id": 732787571510938, "name": "Sal", "level": 6, "cost": 1 },
  { "id": 732787108951490, "name": "Dulce de leche", "level": 2, "cost": 6 }
])
//______________________________________________________________________________
</script>

<template>
  <Pane container style="height: 40vh;">
    <Pane style="width:300px;">
      <ItemsList :items="items" />
    </Pane>
    <Pane splitter />
    <Pane style="flex-grow: 1;">
      <PropsEdit :items="items" />
    </Pane>
  </Pane>
<!-- <div style="position:absolute; bottom:0;height: 40vh; overflow-y: scroll;width:100%;font:.8em monospace;">
    <div v-for="item in items" style="overflow:hidden; white-space: nowrap;"> {{ item }},</div></div>
   --></template>

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
