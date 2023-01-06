<script setup>
/* TODO:
edit props structure
edit props
undo actions: useManualRefHistory? or Pinia? ...or withouts libs
save data
alternative to :hover buttons because of touch screens
move item buttons for touch because of touch screens functions like scroll, etc
*/
import { ref, reactive, computed, onMounted, nextTick } from 'vue'
const props = defineProps({items: Object})
const itemrefs = ref([])
const states = reactive({})

//______________________________________________________________________________
// DRAG & DROP
//______________________________________________________________________________
const drag = reactive({})

//______________________________________________________________________________
function onDragStart(event, item) {
  drag.sourceItemId = item.id

  const sourceItemIndex = props.items.indexOf(item)
  const lastSuccessorIndex = getLastSuccessorIndex(item)
  // Create a copy of the items to move
  drag.itemsCopy = props.items.slice(sourceItemIndex, lastSuccessorIndex + 1)
  // Mark original items as "dragging"
  for (let i = sourceItemIndex; i <= lastSuccessorIndex; i++) props.items[i].dragging = true

  drag.x = event.pageX || event.touches[0].pageX
}

//______________________________________________________________________________
function onDragEnd() {
  // drag.info = ''
  // delete dragging props from items
  props.items.forEach(item => delete item.dragging)
  // Delete drag props
  for (const prop in drag) delete drag[prop]

}
//______________________________________________________________________________
function onDragOver(event, item) {
  if (!props.mouseDown) return

  // Adjust item whith touch events (touchMove targets original item, even when the touch is over another item)
  if (event.touches) {
    // Get the element at the touch point
    let element = document.elementFromPoint(event.touches[0].clientX, event.touches[0].clientY)//(posX, posY)
    let index = itemrefs.value.indexOf(element)
    // If element is not a item, check if it is child of item
    if (index === -1) {
      if (!element) return
      index = itemrefs.value.indexOf(element.parentNode)
      if (index === -1) return
    }
    item = props.items[index]
    // drag.info = index + ' item: ' + item.id + ' x:' + posX + ' y:' + posY
  }

  // posX (for horizontal dragging)
  const posX = event.pageX || event.touches[0].pageX
  // drag.info = ' item: ' + item.id + ' x:' + posX //+ ' y:' + posY
  const sourceItemId = drag.sourceItemId
  const sourceItem = props.items.find(x => x.id == sourceItemId)
  const sourceItemIndex = props.items.indexOf(sourceItem)
  const lastSuccessorIndex = getLastSuccessorIndex(sourceItem)
  let targetItemIndex = props.items.indexOf(item)
  let levelDifference = item.level - sourceItem.level

  //______________________________________
  // Handle horizontal dragging, if any, for level adjustment and return:
  //______________________________________
  if (targetItemIndex === sourceItemIndex) {
    if (targetItemIndex === 0) return
    if (posX > drag.x + 20) {
      //drag.info = ' item: ' + item.id + ' x:' + posX
      // Move to the right
      if (props.items[targetItemIndex].level === props.items[targetItemIndex - 1].level) levelDifference++
      for (let i = targetItemIndex; i <= lastSuccessorIndex; i++) props.items[i].level += levelDifference
      drag.x = posX
    } else if (posX < drag.x - 20) {
      // Move to the left
      if (props.items[targetItemIndex].level - props.items[targetItemIndex - 1].level === 1) {
        if (lastSuccessorIndex + 1 < props.items.length) {
          if (props.items[targetItemIndex].level === props.items[lastSuccessorIndex + 1].level) return
        }
        levelDifference--
        for (let i = targetItemIndex; i <= lastSuccessorIndex; i++) props.items[i].level += levelDifference
        drag.x = posX
      }
    }
    return
    // End of horizontal handling
  }
  //______________________________________
  // Vertical dragging for moving items
  //______________________________________
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

  // Adjust levels of items to move
  drag.itemsCopy = drag.itemsCopy.map(e => ({ ...e, level: e.level + levelDifference }))
  // Insert items in new position
  props.items.splice(targetItemIndex, 0, ...drag.itemsCopy);
  //Remove sourceItem (and successors)
  removeItem(sourceItem)
}

//______________________________________________________________________________
// ITEMS MANIPULATION
//______________________________________________________________________________
function newItemId() {
  return (Date.now() + Math.random()) * 10000
}

//______________________________________________________________________________
function insertItem(item) {
  const targetItemIndex = props.items.indexOf(item)
  props.items.splice(targetItemIndex + 1, 0, { id: newItemId(), name: 'New item', level: item.level + 1, cost: 2 })
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
/*function unregisterFromPredeccessor(itemId) {
  // Search predeccessor item and unregister from it
  for (let i = 0; i < props.items.length; i++) {
    if (props.items[i].successors) {
      for (let s = 0; s < props.items[i].successors.length; s++) {
        if (props.items[i].successors[s] === itemId) {
          // Predeccessor found, now unregister and return
          if (props.items[i].successors.length <= 1) {
            delete props.items[i].successors
          } else {
            props.items[i].successors.splice(s, 1)
          }
          return
        }
      }
    }
  }
}*/

//______________________________________________________________________________
// ITEMS EVENTS
//______________________________________________________________________________
document.addEventListener('mouseup', onMouseUp)
document.addEventListener('touchend', onMouseUp)
document.addEventListener('mousedown', onMouseDown)
//______________________________________________________________________________
function onMouseDown(event, item) {
  props.mouseDown = true
  if (item) onDragStart(event, item)
}
//______________________________________________________________________________
function onMouseUp() {
  props.mouseDown = false
  onDragEnd()
}
//______________________________________________________________________________
function onDblClicK(item) {
  props.itemEditing = item.id
  nextTick(() => {
    const itemInput = document.getElementById('itemEditInput')
    itemInput.focus()
  })
}
//______________________________________________________________________________
function onMouseMove(event) {
  // drag.info = event.clientY + ' ' + event.pageY + ' ' + event.screenY
}
//______________________________________________________________________________
</script>

<template>
  <div style="height: 49vh; overflow-y: scroll;">
    <template v-for="item in items">
      <div v-if="isInOpenFolder(item)" :style="{ 'padding-left': item.level * 2 + 'vh' }" class="itemLine"
        ref="itemrefs" :class="{ dragging: item.dragging }" @mousedown="onMouseDown($event, item)"
        @mousemove="onDragOver($event, item)" @touchstart="onMouseDown($event, item)"
        @touchmove="onDragOver($event, item)">
        <span :class="{ invisible: !isFolder(item) }" @click="toggleOpenFolder(item)" class="isFolder">
          {{ item.open === false ? '&#62;' : '&#709;' }}</span>
        <input v-if="props.itemEditing == item.id" v-model="item.name" @blur="props.itemEditing = false"
          @keyup.enter="props.itemEditing = false" id="itemEditInput" />
        <div v-else @dblclick="onDblClicK(item)" class="item">
          <!-- [{{ item.id.toString().slice(-4) }}] -->
          {{ item.name }}
          <!-- ${{ itemTotalCost(item) }}{{ item.info }} -->
          <span @click="removeItem(item)" class="itemRemove">&#215;</span>
          <span @click="insertItem(item); item.open = true" class="insertItem">+</span>
        </div>
      </div>
    </template>
    <!-- {{ drag }} -->
  </div>
</template>

<style>
.dragging {
  background-color: rgb(241, 255, 150);
}

.itemLine {
  /* border: 2px solid transparent; */
  /* font-size: 2.5vh; */
  white-space: nowrap;
  text-overflow: ellipsis;
  border-bottom: 1px solid rgb(228, 232, 199);
  height: 3vh;
}

.item {
  display: inline;
  overflow: hidden;
}

.itemLine:hover .item span {
  visibility: visible;
}

.invisible {
  visibility: hidden;
}

.isFolder {
  cursor: pointer;
  color: goldenrod;
}

.isFolder:hover {
  color: unset;
}

.itemRemove {
  visibility: hidden;
  cursor: pointer;
  margin-left: .5vh;
  color: red;
}

.insertItem {
  visibility: hidden;
  cursor: pointer;
  margin-left: .25vh;
  color: green;
}
</style>