<script setup>
/*
________________________________________________________________________________
PropsEdit - Properties edition component for Vue.js
by Diego Fraga
exerionbit.com
Code started: january 28, 2023
________________________________________________________________________________
TODO:
________________________________________________________________________________
*/
import { ref, reactive, nextTick } from 'vue'
const props = defineProps({ items: Object })
const itemref = ref([])
const state = reactive({})

let previousOpenFolderLevel = 0
function isInOpenFolder(item) {
  // Determine wich items should be hidden or shown based on upper closed or opened folders.
  // (To be called sequentially, must start from the first item)
  if (previousOpenFolderLevel === 0) {
    if (item.level === 0) return true // Root is always visible
    const previousItem = props.items[props.items.indexOf(item) - 1]
    if (previousItem.open === false && item.level === previousItem.level + 1) {
      previousOpenFolderLevel = item.level
      return false
    }
    return true
  }
  if (item.level < previousOpenFolderLevel) {
    previousOpenFolderLevel = 0
    return true
  }
  return false
}
</script>

<template>
  <div id="propsEditDiv">
    <template v-for="item in items">
      <div v-if="isInOpenFolder(item)" class="itemLine" ref="itemref">
        {{ item.cost }}
      </div>
    </template>
    <!-- {{ state }}<br />{{ drag }} -->
  </div>
  <!-- {{ drag.info }} -->
  <br />
</template>



<style>
#propsEditDiv {
  flex-grow: 1;
}
</style>