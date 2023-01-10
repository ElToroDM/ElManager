<script setup>
/* TODO:
scroll when dragging upper or lower
add button at the end of treeview
(touch) fix double clic or make button for rename
(touch) move item buttons to avoid conflicts with touch screens functions like scroll, gestures, etc
expand/collapse all
*/
import { ref, reactive, computed, onMounted, nextTick } from 'vue'
const props = defineProps({ items: Object })
const itemref = ref([])
const state = reactive({})

//______________________________________________________________________________
// DRAG & DROP
//______________________________________________________________________________
const drag = reactive({})
//______________________________________________________________________________
function onDragStart(event, item) {
  drag.sourceItemId = item.id
  // Reset horizontal drag threshold
  drag.x = event.pageX || event.touches[0].pageX
  // Create a copy of the items to move
  const sourceItemIndex = props.items.indexOf(item)
  const lastSuccessorIndex = getLastSuccessorIndex(item)
  drag.itemsCopy = props.items.slice(sourceItemIndex, lastSuccessorIndex + 1)
  // Mark original items as "dragging"
  for (let i = sourceItemIndex; i <= lastSuccessorIndex; i++) props.items[i].dragging = true
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
  const sourceItemId = drag.sourceItemId
  const sourceItem = props.items.find(x => x.id == sourceItemId)
  const sourceItemIndex = props.items.indexOf(sourceItem)
  const lastSuccessorIndex = getLastSuccessorIndex(sourceItem)
  let targetItemIndex = props.items.indexOf(item)
  let levelDifference = item.level - sourceItem.level
  let posX; if (event.touches) { posX = event.touches[0].pageX } else { posX = event.pageX }
  let posY; if (event.touches) { posY = event.touches[0].pageY } else { posY = event.pageY }
  //______________________________________
  // Handle horizontal dragging, if any, for level adjustment and return:
  //______________________________________
  const vh = Math.max(document.documentElement.clientHeight, window.innerHeight || 0) / 100
  const dragThresholdX = 1 * vh
  if (targetItemIndex === sourceItemIndex) {
    if (targetItemIndex === 0) return
    if (posX > drag.x + dragThresholdX) {
      // Move to the right
      if (props.items[targetItemIndex].level === props.items[targetItemIndex - 1].level) levelDifference++
      for (let i = targetItemIndex; i <= lastSuccessorIndex; i++) props.items[i].level += levelDifference
      drag.x = posX
      return
    } else if (posX < drag.x - dragThresholdX) {
      drag.x = posX
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

  // drag.info = ' item: ' + item.id + ' drag.x:' + drag.x + ' posX:' + posX

  //______________________________________
  // Vertical dragging for moving items
  //______________________________________
  // Adjust item whith touch events (touchMove targets original item, even when the touch is over another item)
  // if (event.touches) {
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
  // Don't vertical drag to the same item
  if (targetItemIndex === sourceItemIndex) return
  // Adjust levels of items to move
  drag.itemsCopy = drag.itemsCopy.map(e => ({ ...e, level: e.level + levelDifference }))
  // Insert items in new position
  props.items.splice(targetItemIndex, 0, ...drag.itemsCopy);
  //Remove sourceItem (and successors)
  removeItem(sourceItem)
  // Vertical dragging made, reset horizontal dragging
  drag.x = posX
}

//______________________________________________________________________________
// ITEMS MANIPULATION
//______________________________________________________________________________
function newItemId() {
  // return (Date.now() + Math.random()) * 10000
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
  // (To be called sequentially from the first item)
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
// ITEMS EVENTS
//______________________________________________________________________________
document.addEventListener('mouseup', onMouseUp)
document.addEventListener('touchend', onMouseUp)
document.addEventListener('mousedown', onMouseDown)
document.addEventListener('mousemove', onMouseMove)
//______________________________________________________________________________
function onMouseDown(event, item) {
  selectedItemStyleUpdate(item)
  event.stopPropagation()
  state.mouseDown = true
  if (item) onDragStart(event, item)
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
  // drag.info = event.clientY + ' ' + event.pageY + ' ' + event.screenY
  event.stopPropagation()
  // Items highlights on hover
  selectedItemStyleUpdate(item)
  // Handle drags
  if (item && state.mouseDown) onDragOver(event, item)
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
</script>

<template>
  <template v-for="item in items">
    <div v-if="isInOpenFolder(item)" :style="{ 'padding-left': item.level * 2 + 'vh' }" class="itemLine" ref="itemref"
      :class="{ itemLineDragging: item.dragging }, itemHighlight(item)" @mousedown="onMouseDown($event, item)"
      @mousemove="onMouseMove($event, item)" @touchstart="onMouseDown($event, item)"
      @touchmove="onDragOver($event, item)">
      <span :class="{ invisible: !isFolder(item) }" @click="toggleOpenFolder(item)" class="isFolder">
        {{ item.open === false ? '&#62;' : '&#709;' }}</span>
      <input v-if="state.itemEditing == item.id" v-model="item.name" @blur="state.itemEditing = false"
        @keyup.esc="state.itemEditing = false" @keyup.enter="state.itemEditing = false" id="itemEditInput" />
      <div v-else class="item">
        <!-- [{{ item.id.toString().slice(-4) }}] -->
        <span @dblclick="onDblClicK(item)">{{ item.name }}</span>
        <!-- ${{ itemTotalCost(item) }}{{ item.info }} -->
      </div>
      <div v-if="item.highlight == 1" class="itemEdition">
        <span @click="removeItem(item)" class="itemRemove">&times;</span>
        <span @click="insertItem(item); item.open = true" class="insertItem">+</span>
      </div>
    </div>
  </template>
  <!-- {{ state }}<br />{{ drag }} -->
</template>

<style>
.itemLine {
  display: flex;
  white-space: nowrap;
  text-overflow: ellipsis;
  border-bottom: 1px solid rgb(228, 232, 199);
  height: 3vh;
  padding: .25vh 0;
  cursor: default;
}

.itemLineDragging {
  background-color: rgba(241, 255, 150, 0.8);
  cursor: ns-resize;
}

.item {
  overflow: hidden;
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
  margin-left: auto;
  margin-right: .5vh;
  font-size: 1.5em;
  text-shadow: -1px -1px 0 rgba(0, 0, 0, 0.5), 1px -1px 0 rgba(0, 0, 0, 0.5),
    -1px 1px 0 rgba(0, 0, 0, 0.5), 1px 1px 0 rgba(0, 0, 0, 0.5);
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