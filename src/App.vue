<script setup>
/*
TODO:
save items data
column titles
edit props structure
edit props
undo actions: useManualRefHistory? or Pinia? ...or: https://vuejs.org/examples/#circle-drawer
*/
import { ref, reactive, onMounted } from 'vue'
import ItemsList from './ItemsList.vue'
import PropsEdit from './PropsEdit.vue'
import Pane from './Pane.vue'

const items = ref([
  { "item_id": 732785649503224, "item_name": "Panqueque de dulce de leche", "item_level": 0, "stock": 2 },
  { "item_id": 732785649504646, "item_name": "Enrollar", "item_level": 1, "stock": 0, },
  { "item_id": 732787039516608, "item_name": "Panqueque", "item_level": 2, "stock": 4 },
  { "item_id": 732787228074946, "item_name": "Cocinar vuelta y vuelta", "item_level": 3, "stock": 0 },
  { "item_id": 732787388636990, "item_name": "Pasta", "item_level": 4, "stock": 0 },
  { "item_id": 732787473433670, "item_name": "Batir", "item_level": 5, "stock": 0 },
  { "item_id": 732787615515042, "item_name": "Huevos", "item_level": 6, "stock": 6, "cantidad":4 },
  { "item_id": 732787613195910, "item_name": "Manteca derretida", "item_level": 6, "stock": 2, "cantidad":.05 },
  { "item_id": 732787611591662, "item_name": "Leche", "item_level": 6, "stock": 1, "cantidad":2 },
  { "item_id": 732787609910024, "item_name": "Harina", "item_level": 6, "stock": 1, "cantidad":.8 },
  { "item_id": 732787604156978, "item_name": "Esencia de vainilla", "item_level": 6, "stock": 250, "cantidad":10 },
  { "item_id": 732787571510938, "item_name": "Sal", "item_level": 6, "stock": 500, "cantidad":2 },
  { "item_id": 732787108951490, "item_name": "Dulce de leche", "item_level": 2, "stock": .4, "cantidad":.05 }
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
