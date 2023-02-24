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
  // Determine wich items should be hidden or shown based on upper closed or opened folders.
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
      <div v-if="isInOpenFolder(item)" class="itemLine" ref="itemref">
        <div class="cell">{{ item.cantidad }}</div>
        <div class="cell">{{ item.stock }}</div>
      </div>
    </div>
    <!-- {{ state }}<br />{{ drag }} -->
  </div>
  <!-- {{ drag.info }} -->
  <br />
</template>



<style>
#propsEditDiv {
  flex-grow: 1;
}

/* .row{
  display:flex;
} */

.cell {
  display: flex;
  align-items: center;
  justify-content:right;
  width: 50px;
  padding-right: .2em;
  border-right: 1px solid var(--surface);
  /* background-color: aqua; */
}

/* .cell:first-child {
  transform: translateX(-10px);
} */
</style>