<script setup>
/*
TODO:
pane separator movement logic
edit props structure
edit props
undo actions: useManualRefHistory? or Pinia? ...or without libs: https://vuejs.org/examples/#circle-drawer
save data
*/
import { ref, reactive, onMounted } from 'vue'
import itemsList from './itemsList.vue'
import propsEdit from './propsEdit.vue'

const items = ref([
  { "id": 732785649503224, "name": "Panqueque de dulce de leche", "level": 0, "cost": 1, "open": true },
  { "id": 732785649504646, "name": "Enrollar", "level": 1, "cost": 1, "open": true },
  { "id": 732787039516608, "name": "Panqueque", "level": 2, "cost": 1, "open": true },
  { "id": 732787228074946, "name": "Cocinar vuelta y vuelta", "level": 3, "cost": 2, "open": true },
  { "id": 732787388636990, "name": "Pasta", "level": 4, "cost": 1, "open": true },
  { "id": 732787473433670, "name": "Batir", "level": 5, "cost": 1, "open": true },
  { "id": 732787615515042, "name": "Huevos", "level": 6, "cost": 3 },
  { "id": 732787613195910, "name": "Manteca derretida", "level": 6, "cost": 1 },
  { "id": 732787611591662, "name": "Leche", "level": 6, "cost": 4 },
  { "id": 732787609910024, "name": "Harina", "level": 6, "cost": 2 },
  { "id": 732787604156978, "name": "Esencia de vainilla", "level": 6, "cost": 2 },
  { "id": 732787571510938, "name": "Sal", "level": 6, "cost": 1 },
  { "id": 732787108951490, "name": "Dulce de leche", "level": 2, "cost": 6 }
])


const state = reactive({})

//______________________________________________________________________________
// PANES
//______________________________________________________________________________
onMounted(() => {
  // Pane scrolling synchronization
  const divs = document.getElementsByClassName("pane")
  let timeoutId
  Array.from(divs).forEach((div) => {
    div.addEventListener("scroll", () => {
      clearTimeout(timeoutId)
      timeoutId = setTimeout(() => {
        const scrollTop = div.scrollTop;
        Array.from(divs).forEach((otherDiv) => {
          if (otherDiv !== div) otherDiv.scrollTop = scrollTop
        })
      }, 5)
    })
  })
})
//______________________________________________________________________________
function paneSeparatorMouseDown(event) {
  document.addEventListener('mouseup', paneSeparatorMouseUp, true)
  document.addEventListener('touchend', paneSeparatorMouseUp, true)
  window.addEventListener('mousemove', paneSeparatorMouseMove, true)
  state.pane = event.currentTarget.previousElementSibling
  state.baseWidth = state.pane.offsetWidth - event.pageX
}
//______________________________________________________________________________
function paneSeparatorMouseUp() {
  document.removeEventListener('mouseup', paneSeparatorMouseUp, true)
  document.removeEventListener('touchend', paneSeparatorMouseUp, true)
  window.removeEventListener('mousemove', paneSeparatorMouseMove, true)
}
//______________________________________________________________________________
function paneSeparatorMouseMove(event) {
  event.stopPropagation()
  state.pane.style.width = state.baseWidth + event.pageX + 'px'
}
//______________________________________________________________________________
</script>

<template>
  <div class="panesContainer">
    <div class="pane" style="width:300px;">
      <itemsList :items="items"></itemsList>
    </div>
    <div class="paneSeparator" @mousedown="paneSeparatorMouseDown($event)"></div>
    <div class="pane" style="flex-grow: 1;">
      <propsEdit :items="items"></propsEdit>
    </div>
  </div>
  <!-- <div style="position:absolute; bottom:0;height: 40vh; overflow-y: scroll;width:100%;font:.8em monospace;">
    <div v-for="item in items" style="overflow:hidden; white-space: nowrap;"> {{ item }},</div>
  </div> -->
</template>

<style>
.panesContainer {
  display: flex;
  width: 100%;
  height: 40vh;
}

.pane {
  display: flex;
  overflow-y: scroll;
  overflow-x: scroll;
}

.paneSeparator {
  display: flex;
  width: 10px;
  cursor: col-resize;
  background-color: rgb(228, 232, 199);
}



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
