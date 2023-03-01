<script setup>
/*
________________________________________________________________________________
PropsEdit - Properties edition component for Vue.js
by Diego Fraga
exerionbit.com
Code started: january 28, 2023
________________________________________________________________________________
TODO:
columns
columns titles
________________________________________________________________________________
*/
import { ref, reactive } from 'vue'
const props = defineProps({ items: Object })
const itemref = ref([])
const state = reactive({})

//______________________________________________________________________________
let previousOpenFolderLevel = 0
function isInOpenFolder(item) {
  // Determine wich items should be hidden or shown based on closed or opened upper folders.
  // (To be called sequentially, must start from the first item)
  if (previousOpenFolderLevel === 0) {
    if (item.item_level === 0) return true // Root is always visible
    const previousItem = props.items[props.items.indexOf(item) - 1]
    if (previousItem.open === false && item.item_level === previousItem.item_level + 1) {
      previousOpenFolderLevel = item.item_level
      return false
    }
    return true
  }
  if (item.item_level < previousOpenFolderLevel) {
    previousOpenFolderLevel = 0
    return true
  }
  return false
}
//______________________________________________________________________________
let columnsNames = ["Cantidad por padre","Stock","Stock deseado","Reponer"]
let columns = ["cantidad", "stock", "stockDeseado", "reponer"]
</script>

<template >
  <div id="title" class="row scrollSync">
    <div v-for="col in columnsNames" class="titleCell">
      {{ col }}
    </div>
  </div>
  <div id="propsEditDiv" class="scrollSync">
    <template v-for="item in items">
      <div v-if="isInOpenFolder(item)" class="row" ref="itemref">
        <div v-for="prop in columns" class="cell">{{ item.props[prop] }}</div>
      </div>
    </template>
  </div>
</template>

<style scoped>
#title {
  /* display: grid; */
  white-space: nowrap;
  overflow: hidden;
  min-height: 4vh;
  align-items: center;
  cursor: default;
  color: var(--on-secondary);
  background-color: var(--secondary-variant);
  box-shadow: inset 0 -2px 1px -2px var(--on-secondary);
}

.titleCell {
  display: flex;
  align-items: center;
  justify-content: left;
  /* width: 40px; */
  flex-grow: 0;
  flex-shrink: 0;
  flex-basis: 40px;
  overflow: hidden;
  /* padding: 0;
  margin: 0; */
  padding-left: .2em;
  /* background-color: rgb(125, 69, 63); */
  box-shadow:
    inset -2px 0 1px -2px var(--on-secondary);


}

#propsEditDiv {
  /* flex-direction: column; */
  display: grid;
  /* flex-grow: 1; */
}

.row {
  /* flex-grow: 1; */
  position: relative;
  display: flex;
  white-space: nowrap;
  /* overflow: visible; */
  height: 4vh;
  /* cursor: default; */
  color: var(--on-surface);
  background-color: var(--surface);
  /* touch-action: none; */
}

.cell {
  display: flex;
  align-items: center;
  justify-content: right;
  /* width: 40px; */
  flex-grow: 0;
  flex-shrink: 0;
  flex-basis: 40px;
  overflow: hidden;
  /* padding: 0;
  margin: 0; */
  padding-right: .2em;
  /* background-color: rgb(125, 69, 63); */
  box-shadow:
    inset -2px 0 1px -2px var(--on-surface),
    inset 0 -2px 1px -2px var(--on-surface);
}

.cell:first-child {
  box-shadow:
    inset -2px 0 1px -2px var(--on-surface),
    inset 0 -2px 1px -2px var(--on-surface),
    inset 2px 0 1px -2px var(--on-surface)
}
</style>