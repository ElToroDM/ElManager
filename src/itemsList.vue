<script setup>
/*
________________________________________________________________________________
Treevue - Treeview component for Vue.js
by Diego Fraga
exerionbit.com
Code started: november 5, 2022
________________________________________________________________________________
TODO:
transitions https://vuejs.org/examples/#list-transition
add "add button" at the end of treeview
(touch) double clic or make button for rename
(touch) move item buttons to avoid conflicts with touch screens functions like scroll, gestures, etc
folder arrow. Rotate, don't change between 2 chars (right/down) just rotate one
expand/collapse all
________________________________________________________________________________
*/
import { ref, reactive, nextTick } from 'vue'
const props = defineProps({ items: Object })
const itemref = ref([])
const state = reactive({})

//______________________________________________________________________________
// DRAG & DROP
//______________________________________________________________________________
const drag = reactive({})
let vh
//______________________________________________________________________________
function onDragStart(event, item) {
  drag.sourceItemId = item.id
  // Reset horizontal drag threshold
  drag.startPosX = event.pageX || event.touches[0].pageX
  // Mark original items as "dragging"
  const sourceItemIndex = props.items.indexOf(item)
  const lastSuccessorIndex = getLastSuccessorIndex(item)
  for (let i = sourceItemIndex; i <= lastSuccessorIndex; i++) props.items[i].dragging = true
  onMouseMove(event, item)
}
//______________________________________________________________________________
function onDragEnd() {
  // Delete dragging props from items
  props.items.forEach(item => delete item.dragging)
  // Delete drag props
  for (const prop in drag) delete drag[prop]
}
//______________________________________________________________________________
function onDragOver(event, item) {
  const sourceItem = props.items.find(x => x.id == drag.sourceItemId)
  const sourceItemIndex = props.items.indexOf(sourceItem)
  const lastSuccessorIndex = getLastSuccessorIndex(sourceItem)
  let targetItemIndex = props.items.indexOf(item)
  let levelDifference = item.level - sourceItem.level
  let posX, posY
  if (event.touches) { posX = event.touches[0].pageX; posY = event.touches[0].pageY }
  else { posX = event.pageX; posY = event.pageY }
  //______________________________________
  // Handle horizontal dragging, if any, to ajust levels:
  //______________________________________
  if (targetItemIndex === sourceItemIndex) {
    vh = Math.max(document.documentElement.clientHeight, window.innerHeight || 0) / 100
    const dragThresholdX = 1 * vh
    if (targetItemIndex === 0) return
    if (posX > drag.startPosX + dragThresholdX) {
      // Move to the right
      if (props.items[targetItemIndex].level === props.items[targetItemIndex - 1].level) levelDifference++
      for (let i = targetItemIndex; i <= lastSuccessorIndex; i++) props.items[i].level += levelDifference
      drag.startPosX = posX
      return
    } else if (posX < drag.startPosX - dragThresholdX) {
      drag.startPosX = posX
      // Move to the left
      if (props.items[targetItemIndex].level - props.items[targetItemIndex - 1].level === 1) {
        if (lastSuccessorIndex + 1 < props.items.length) {
          if (props.items[targetItemIndex].level === props.items[lastSuccessorIndex + 1].level) return
        }
        levelDifference--
        for (let i = targetItemIndex; i <= lastSuccessorIndex; i++) props.items[i].level += levelDifference
      }
      return
    }
  }
  //______________________________________
  // Vertical dragging to move items
  //______________________________________
  // Adjust item whith touch events (touchMove targets original item, even when the touch is over another item)
  if (event.touches) {
    // Get the element at the touch point
    let element = document.elementFromPoint(posX, posY)
    let index = itemref.value.indexOf(element)
    // If element is not a item, check if it is child of item
    if (index === -1) {
      if (!element) return
      index = itemref.value.indexOf(element.parentNode)
      if (index === -1) return
    }
    item = props.items[index]
    targetItemIndex = props.items.indexOf(item)
    levelDifference = item.level - sourceItem.level
  }
  // Don't vertical drag to the same item
  if (targetItemIndex === sourceItemIndex) return
  // If item target is on the same branch, change it for the item that immediately follows the branch
  if (targetItemIndex > sourceItemIndex && targetItemIndex <= lastSuccessorIndex) {
    targetItemIndex += lastSuccessorIndex - sourceItemIndex
    if (targetItemIndex >= props.items.length) return
    item = props.items[targetItemIndex]
    levelDifference = item.level - sourceItem.level
  }
  // Adjust target position if below than source in the tree (indexes are higher when position is below)
  if (targetItemIndex > sourceItemIndex) {
    targetItemIndex++
    // If folder, open it and adjust its level
    if (isFolder(item)) {
      item.open = true
      levelDifference++
    }
  }
  // Create a copy of the items to move
  let itemsCopy = props.items.slice(sourceItemIndex, lastSuccessorIndex + 1)
  // Adjust levels of items to move
  itemsCopy = itemsCopy.map(e => ({ ...e, level: e.level + levelDifference }))
  // Remove sourceItem (and successors)
  removeItem(sourceItem)
  // Insert items in new position
  if (targetItemIndex > sourceItemIndex) targetItemIndex -= itemsCopy.length
  props.items.splice(targetItemIndex, 0, ...itemsCopy);
  // Vertical dragging made, reset horizontal dragging
  drag.startPosX = posX
}

//______________________________________________________________________________
// ITEMS MANIPULATION
//______________________________________________________________________________
function newItemId() {
  return (Date.now() + Math.random()) * 10000 % 1000000000000000
}
//______________________________________________________________________________
function insertItem(item) {
  const lastSuccessorItemIndex = getLastSuccessorIndex(item)
  props.items.splice(lastSuccessorItemIndex + 1, 0,
    { id: newItemId(), name: 'New item', level: item.level + 1, cost: 2 })
}
//______________________________________________________________________________
function removeItem(item) {
  const targetItemIndex = props.items.indexOf(item)
  props.items.splice(targetItemIndex, getLastSuccessorIndex(item) - targetItemIndex + 1)
}
//______________________________________________________________________________
function getLastSuccessorIndex(item) {
  const targetItemIndex = props.items.indexOf(item)
  let lastSuccessorIndex = targetItemIndex
  while (lastSuccessorIndex < props.items.length - 1) {
    if (props.items[lastSuccessorIndex + 1].level <= item.level) break
    lastSuccessorIndex++
  }
  return lastSuccessorIndex
}
//______________________________________________________________________________
function itemTotalCost(item) {
  return props.items.slice(props.items.indexOf(item), getLastSuccessorIndex(item) + 1).reduce((a, b) => a + b.cost, 0)
}
//______________________________________________________________________________
function isFolder(item) {
  try {
    return props.items[props.items.indexOf(item) + 1].level === item.level + 1
  } catch {
    return false
  }
}
//______________________________________________________________________________
function toggleOpenFolder(item) {
  if (item.open === false) {
    item.open = true
  } else {
    item.open = false
  }
}
//______________________________________________________________________________
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
//______________________________________________________________________________
function itemHighlight(item) {
  if (item.highlight) return 'itemHighlight' + item.highlight
}
//______________________________________________________________________________
function selectedItemStyleUpdate(item) {
  if (state.mouseDown) return
  // Delete old highlights
  props.items.forEach(item => delete item.highlight)
  if (!item) return
  // Add new highlights props
  const sourceItemIndex = props.items.indexOf(item)
  const lastSuccessorIndex = getLastSuccessorIndex(item)
  item.highlight = 1
  for (let i = sourceItemIndex + 1; i <= lastSuccessorIndex; i++) props.items[i].highlight = 2
}
//______________________________________________________________________________
// ITEMS EVENTS
//______________________________________________________________________________
document.addEventListener('mouseup', onMouseUp)
document.addEventListener('touchend', onMouseUp)
document.addEventListener('mousedown', onMouseDown)
window.addEventListener('mousemove', onMouseMove)
//______________________________________________________________________________
function onMouseDown(event, item) {
  selectedItemStyleUpdate(item)
  event.stopPropagation()
  if (item) {
    state.mouseDown = true
    onDragStart(event, item)
  }
}
//______________________________________________________________________________
function onMouseUp() {
  state.mouseDown = false
  onDragEnd()
}
//______________________________________________________________________________
function onDblClicK(item) {
  state.itemEditing = item.id
  nextTick(() => {
    const itemInput = document.getElementById('itemEditInput')
    itemInput.focus()
    itemInput.select()
  })
}
//______________________________________________________________________________
function onMouseMove(event, item) {
  if (state.mouseDown) {
    if (event.touches) { drag.clientY = event.touches[0].clientY } else if (event.clientY) { drag.clientY = event.clientY }
    // Scroll treevueDiv if target item position is on/near top/bottom border
    if (!drag.autoScroll) drag.autoScroll = setTimeout(() => { autoScroll(event) }, 25)
  }
  // Items highlights on hover
  selectedItemStyleUpdate(item)
  // Handle drags
  if (item && state.mouseDown) onDragOver(event, item)
  event.stopPropagation()
}
//______________________________________________________________________________
function autoScroll(event) {
  drag.autoScroll = false
  if (state.mouseDown) {
    const dragScrollStep = 1 * vh//15//element.clientHeight
    const treevueDiv = document.getElementById("treevueDiv")
    if (drag.clientY <= dragScrollStep) {
      treevueDiv.scrollBy(0, -dragScrollStep * 3)
      drag.autoScroll = setTimeout(() => { autoScroll(event) }, 50)
    } else if (drag.clientY >= treevueDiv.clientHeight - dragScrollStep) {
      treevueDiv.scrollBy(0, dragScrollStep * 3)
      drag.autoScroll = setTimeout(() => { autoScroll(event) }, 50)
    }
  }
}
//______________________________________________________________________________
</script>

<template>
  <div id="treevueDiv">
    <template v-for="item in items">
      <div v-if="isInOpenFolder(item)" :style="{ 'padding-left': item.level * 2 + 'vh' }" class="itemLine" ref="itemref"
        :class="{ itemLineDragging: item.dragging }, itemHighlight(item)" @mousedown="onMouseDown($event, item)"
        @mousemove="onMouseMove($event, item)" @touchstart="onMouseDown($event, item)"
        @touchmove="onMouseMove($event, item)">
        <span :class="{ invisible: !isFolder(item) }" @click="toggleOpenFolder(item)" class="isFolder">
          {{ item.open === false ? '&#62;' : '&#709;' }}</span>
        <input v-if="state.itemEditing == item.id" v-model="item.name" @blur="state.itemEditing = false"
          @keyup.esc="state.itemEditing = false" @keyup.enter="state.itemEditing = false" id="itemEditInput" />
        <div v-else class="item">
          <!-- [..{{ item.id.toString().slice(-4) }}] -->
          <span @dblclick="onDblClicK(item)">{{ item.name }}</span>
          <!-- ${{ itemTotalCost(item) }}{{ item.info }} -->
        </div>
        <div v-if="item.highlight == 1" class="itemEdition itemHighlight1">
          <span @click="removeItem(item)" class="itemRemove">&times;</span>
          <span @click="insertItem(item); item.open = true" class="insertItem">+</span>
        </div>
      </div>
    </template>
    <!-- {{ state }}<br />{{ drag }} -->
  </div>
  <!-- {{ drag.info }} -->
  <br />
</template>

<style>
#treevueDiv {
  flex-grow: 1;
}

.itemLine {
  position: relative;
  display: flex;
  white-space: nowrap;
  /* text-overflow: ellipsis; */
  overflow:visible;
  border-bottom: 1px solid rgb(228, 232, 199);
  height: 3vh;
  padding: .25vh 0;
  cursor: default;
  /* touch-action: none; */
}

.itemLineDragging {
  background-color: rgba(241, 255, 150, 0.8);
  cursor: ns-resize;
}

.item {
  align-self: center;
}

.invisible {
  visibility: hidden;
}

.isFolder {
  vertical-align: bottom;
  cursor: pointer;
  color: goldenrod;
}

.isFolder:hover {
  color: rgb(128, 109, 0);
}

.itemEdition {
  position:sticky;
  right: 0;
  padding-right: 1vh;
  font-size: 1.5em;
  background-color: rgba(241, 255, 150, 0.7);
  text-shadow: -1px -1px 1px rgba(0, 0, 0, 0.5), 1px -1px 1px rgba(0, 0, 0, 0.5),
    -1px 1px 1px rgba(0, 0, 0, 0.5), 1px 1px 1px rgba(0, 0, 0, 0.5);
}

.itemRemove {
  cursor: pointer;
  margin-left: .5vh;
  color: red;
}

.insertItem {
  cursor: pointer;
  margin-left: .5vh;
  color: green;
}

.itemHighlight1 {
  background-color: rgba(241, 255, 150, 0.6);
}

.itemHighlight2 {
  background-color: rgba(241, 255, 150, 0.3);
}
</style>