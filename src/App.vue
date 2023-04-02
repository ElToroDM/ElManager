<script setup lang="ts">
/*
________________________________________________________________________________
ElManager
by Diego Fraga
exerionbit.com
Code started: november 5, 2022
________________________________________________________________________________
TODO:
save data
edit props structure
edit props
undo actions: useManualRefHistory? or Pinia? ...or: https://vuejs.org/examples/#circle-drawer
________________________________________________________________________________
*/
import { ref, reactive, onMounted } from 'vue'
import ItemsList from './ItemsList.vue'
import PropsEdit from './PropsEdit.vue'
import Pane from './Pane.vue'
import Themes from './Themes.vue'
import Evaluate from './Evaluate.vue'

const items = ref([
{ "item_id": 732785649503224, "item_typeId": 3, "item_name": "Panqueque de dulce de leche", "item_level": 0, "props": { "stock": 2, "reponer": "=max(stockDeseado-stock,0)", "cantidad": "1", "stockDeseado": "12", "reponer_value": "10", "stock_value": 2, "cantidad_value": "1", "stockDeseado_value": "12" } },
{ "item_id": 732785649504646, "item_typeId": 1, "item_name": "Enrollar", "item_level": 1, "props": { "stock": 1, "reponer": "=max(stockDeseado-stock,0)", "cantidad": "1", "stockDeseado": "=cantidad*..reponer", "stockDeseado_value": "10", "reponer_value": "9", "stock_value": 1, "cantidad_value": "1" } },
{ "item_id": 732787039516608, "item_typeId": 1, "item_name": "Panqueque", "item_level": 2, "props": { "stock": 4, "cantidad": "1", "reponer": "=max(stockDeseado-stock,0)", "stockDeseado": "=cantidad*..reponer", "stockDeseado_value": "9", "reponer_value": "5", "stock_value": 4, "cantidad_value": "1" } },
{ "item_id": 732787228074946, "item_typeId": 1, "item_name": "Cocinar vuelta y vuelta", "item_level": 3, "props": { "stock": 0, "cantidad": "1", "reponer": "=max(stockDeseado-stock,0)", "stockDeseado": "=cantidad*..reponer", "stockDeseado_value": "5", "reponer_value": "5", "stock_value": 0, "cantidad_value": "1" } },
{ "item_id": 732787388636990, "item_typeId": 2, "item_name": "Pasta", "item_level": 4, "props": { "stock": 0, "cantidad": "1", "reponer": "=max(stockDeseado-stock,0)", "stockDeseado": "=cantidad*..reponer", "stockDeseado_value": "5", "reponer_value": "5", "stock_value": 0, "cantidad_value": "1" } },
{ "item_id": 732787473433670, "item_typeId": 1, "item_name": "Batir", "item_level": 5, "props": { "stock": 0, "cantidad": "1", "reponer": "=max(stockDeseado-stock,0)", "stockDeseado": "=cantidad*..reponer", "stockDeseado_value": "5", "reponer_value": "5", "stock_value": 0, "cantidad_value": "1" } },
{ "item_id": 732787615515042, "item_typeId": 2, "item_name": "Huevos", "item_level": 6, "props": { "stock": 6, "cantidad": 4, "reponer": "=max(stockDeseado-stock,0)", "stockDeseado": "=cantidad*..reponer", "stockDeseado_value": "20", "reponer_value": "14", "cantidad_value": 4, "stock_value": 6 } },
{ "item_id": 732787613195910, "item_typeId": 2, "item_name": "Manteca derretida", "item_level": 6, "props": { "stock": 2, "cantidad": 0.05, "reponer": "=max(stockDeseado-stock,0)", "stockDeseado": "=cantidad*..reponer", "stockDeseado_value": "0.25", "reponer_value": "0", "cantidad_value": 0.05, "stock_value": 2 } },
{ "item_id": 732787611591662, "item_typeId": 2, "item_name": "Leche", "item_level": 6, "props": { "stock": 1, "cantidad": 2, "reponer": "=max(stockDeseado-stock,0)", "stockDeseado": "=cantidad*..reponer", "stockDeseado_value": "10", "reponer_value": "9", "cantidad_value": 2, "stock_value": 1 } },
{ "item_id": 732787609910024, "item_typeId": 2, "item_name": "Harina", "item_level": 6, "props": { "stock": 1, "cantidad": 0.8, "reponer": "=max(stockDeseado-stock,0)", "stockDeseado": "=cantidad*..reponer", "stockDeseado_value": "4", "reponer_value": "3", "cantidad_value": 0.8, "stock_value": 1 } },
{ "item_id": 732787604156978, "item_typeId": 2, "item_name": "Esencia de vainilla", "item_level": 6, "props": { "stock": 250, "cantidad": 10, "reponer": "=max(stockDeseado-stock,0)", "stockDeseado": "=cantidad*..reponer", "stockDeseado_value": "50", "reponer_value": "0", "cantidad_value": 10, "stock_value": 250 } },
{ "item_id": 732787571510938, "item_typeId": 2, "item_name": "Sal", "item_level": 6, "props": { "stock": 500, "cantidad": 2, "reponer": "=max(stockDeseado-stock,0)", "stockDeseado": "=cantidad*..reponer", "stockDeseado_value": "10", "reponer_value": "0", "cantidad_value": 2, "stock_value": 500 } },
{ "item_id": 732787108951490, "item_typeId": 2, "item_name": "Dulce de leche", "item_level": 2, "props": { "stock": ".5", "cantidad": ".05", "reponer": "=max(stockDeseado-stock,0)", "stockDeseado": "=cantidad*..reponer", "stockDeseado_value": "0.45", "reponer_value": "0", "cantidad_value": ".05", "stock_value": ".5" } }
])

const itemTypes = ref([
  // { "type_id": 0, "type_name": "unassigned" },
  { "type_id": 1, "type_name": "task", "type_props": ["time", "cost"] },
  { "type_id": 2, "type_name": "piece", "type_props": { "stock": "", "cost": "", "reponer": "=parentProp('Reponer')*cantidad" } },
  { "type_id": 3, "type_name": "product", "type_props": ["stock", "cost", "reponer"] }
])

//______________________________________________________________________________
</script>

<template>
  <Pane container style="height: 60vh;">
    <Pane style="width:250px;" class="listPane">
      <ItemsList :items="items" />
    </Pane>
    <Pane splitter />
    <Pane style="flex-grow: 1;" class="listPane">
      <PropsEdit :items="items" />
    </Pane>
  </Pane>
  <div style="position:absolute; bottom:0;height: 40vh; overflow-y: scroll;width:100%;font:.8em monospace;">
    <Evaluate />
    <Themes />
    <!-- <div v-for="item in items" style="overflow:hidden; white-space: nowrap;"> {{ item }}</div> -->
    <div v-for="item in items" style="overflow:hidden; white-space: nowrap;"> {{ item }},</div>
  </div>
</template>

<style>
.listPane {
  flex-direction: column;
  flex-grow: 1;
  overflow: hidden;
}

body {
  margin: 0;
  padding: 0;
  overflow: hidden;
  background-color: var(--background);
  color: var(--on-background);
}

body,
input {
  font-family: "Clear Sans", "Helvetica Neue", Arial, sans-serif;
  font-size: 1.5vh;
}
</style>
