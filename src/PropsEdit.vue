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
</script>

<template>
  <div id="propsEditDiv">
    <div v-for="item in items">
      <div v-if="isInOpenFolder(item)" class="row" ref="itemref">
        <div class="cell">{{ item.cantidad }}</div>
        <div class="cell">{{ item.stock }}</div>
      </div>
    </div>
    <!-- {{ state }}<br />{{ drag }} -->
  </div>
  <!-- {{ drag.info }} -->
  <br />
</template>

<style scoped>
#propsEditDiv {
  flex-grow: 1;
}

.row {
  position: relative;
  display: flex;
  white-space: nowrap;
  overflow: visible;
  color: var(--on-surface);
  background-color: var(--surface);
  height: 4vh;
  cursor: default;
  /* touch-action: none; */
}

.cell {
  display: flex;
  align-items: center;
  justify-content: right;
  width: 50px;
  padding: 0;
  margin: 0;
  padding-right: .2em;
  /* background-color: aqua; */
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