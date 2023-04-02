<script setup>
/*
________________________________________________________________________________
PropsEdit - Properties edition component for Vue.js
by Diego Fraga
exerionbit.com
Code started: january 28, 2023
________________________________________________________________________________
TODO:
synchronize titles row horizontal scroll
resizable columns widths
edit columns
add / remove columns (item types?)
cell auto align: numbers right, text left, etc
________________________________________________________________________________
*/
import { ref, reactive, nextTick } from 'vue'
import { isInOpenFolder } from '/Items.js'
const props = defineProps({ items: Object })
const itemref = ref([])
// const state = reactive({})
const state = reactive({ result: '' })
//______________________________________________________________________________

// elMan global functions for nearley's grammar to evaluate props. Functions are globals to use compiled grammar "as is"...
window.elMan = {
  //item: 0,
  prop: string => elMan.item.props[string + '_value'],
  parentProp: string => getParent(elMan.item).props[string + '_value'],
}

function getParent(item) {
  const itemIndex = props.items.indexOf(item)
  let parentIndex = itemIndex
  while (parentIndex > 0) {
    parentIndex--
    if (props.items[parentIndex].item_level + 1 == item.item_level) return props.items[parentIndex]
  }
  return null
}

function cellView(item, prop) {
  const cell = item.props[prop]
  if (typeof cell === 'string' || cell instanceof String) {
    // cell it's a string
    // TODO sanitize string
    if (cell.charAt(0) == '=') {
      elMan.item = item
      item.props[prop + '_value'] = evaluate(cell)
      return item.props[prop + '_value']
    }
  }
  // cell it's not a string
  item.props[prop + '_value'] = cell
  return item.props[prop + '_value']
}

// window.elMan.prop = function (string) {
//   return item.props[string]
// };

function evaluate(input) {
  const parser = new nearley.Parser(grammar.ParserRules, grammar.ParserStart)
  try {
    parser.feed(input)
    if (!parser.results[0]) throw new Error(1)
    //if (isNaN(parser.results[0].v)) throw new Error(2)
    if (parser.results[0].v === Infinity) throw new Error(3)
    return parser.results[0].v.toString()
  } catch (e) {
    return  /*'[error]' +*/ e //+ ' ' + parser.results[0].v.toString()
  }
}
//______________________________________________________________________________
let cellWidth
let editingCell
function onDblClicK(event, item, prop) {
  state.cellEditing = item.item_id + ':' + prop
  nextTick(() => {
    const cellInput = document.getElementById('cellEdit')
    editingCell = event.currentTarget
    cellWidth = editingCell.offsetWidth
    cellInput.style.left = event.currentTarget.offsetLeft - 2 + 'px'
    cellInput.style.minWidth = cellWidth - 2 + 'px'
    cellInput.focus()
    // cellInput.select()
    onChangeInput(cellInput)
    editingCell.style.visibility = 'hidden'
  })
}
function onChangeInput(inputCell) {
  inputCell.style.width = 0
  const scrollWidth = inputCell.scrollWidth
  if (scrollWidth > cellWidth + 2) {
    inputCell.style.width = scrollWidth + 8 + 'px'
  }
}
function endCellEditing(event) {
  editingCell.style.visibility = 'visible'
  state.cellEditing = false
}
//______________________________________________________________________________
let columnsNames = ["Cantidad por padre", "Stock", "Stock deseado", "Reponer"]
let columns = ["cantidad", "stock", "stockDeseado", "reponer"]
//______________________________________________________________________________
</script>

<template >
  <div id="titles" class="row scrollSync">
    <div v-for="col in columnsNames" class="titleCell">
      {{ col }}
    </div>
  </div>
  <div id="propsEditDiv" class="scrollSync">
    <template v-for="item in items">
      <div v-if="isInOpenFolder(item, props)" class="row" ref="itemref">
        <template v-for="prop in columns">
          <div class="cell" @dblclick="onDblClicK($event, item, prop)">
            {{ cellView(item, prop) }}
          </div>
          <input v-if="state.cellEditing == item.item_id + ':' + prop" v-model="item.props[prop]"
            @keyup.esc="endCellEditing($event)" @keyup.enter="endCellEditing($event)" id="cellEdit"
            @blur="endCellEditing($event)" @keyup="onChangeInput($event.currentTarget)"
            @keydown="onChangeInput($event.currentTarget)" />
        </template>
      </div>
    </template>
  </div>
</template>

<style scoped>
#titles {
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
  min-height: inherit;
  flex-grow: 0;
  flex-shrink: 0;
  flex-basis: 60px;
  overflow: hidden;
  padding-left: .2em;
  box-shadow: inset -2px 0 1px -2px var(--on-secondary);
}

#propsEditDiv {
  display: grid;
  height: 100%;
  align-content: start;
  background-color: var(--surface);
  color: var(--on-surface);
}

.row {
  position: relative;
  display: flex;
  white-space: nowrap;
  height: 4vh;
  /* touch-action: none; */
}

.cell {
  display: flex;
  position: relative;
  align-items: center;
  justify-content: right;
  flex: 0 0 60px;
  max-width: 60px;
  /* overflow: hidden; */
  padding-right: .2em;
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

#cellEdit {
  position: absolute;
  z-index: 1;
  top: -1px;
  height: 100%;
  max-width: 95%;

  /* width: min-content; */

  inline-size: 60px;

  outline: none;
  border: none;
  background-color: var(--surface);
  color: var(--on-surface);
  box-shadow: inset 0px 0px 0px 2px var(--primary);
}
</style>