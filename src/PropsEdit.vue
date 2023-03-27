<script setup>
/*
________________________________________________________________________________
PropsEdit - Properties edition component for Vue.js
by Diego Fraga
exerionbit.com
Code started: january 28, 2023
________________________________________________________________________________
TODO:
** calculate cell formulas eg: =column1+column2
sync title horizontal scroll
resizable columns widths
edit cells
edit columns
add / remove columns (item types?)
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
  prop: string => elMan.item.props[string],
  parentProp: string => getParent(elMan.item).props[string],
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
    if (cell.charAt(0) != '=') return cell
    elMan.item = item
    return evaluate(cell)
  }
  // cell it's not a string
  return cell
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
function onDblClicK(item, prop) {
  state.cellEditing = item.item_id + ':' + prop
  nextTick(() => {
    const cellInput = document.getElementById('cellEditInput')
    cellInput.focus()
    cellInput.select()
  })
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
          <div class="cell" @dblclick="onDblClicK(item, prop)">
            <span>{{ cellView(item, prop) }}</span>
          </div>
          <input v-if="state.cellEditing == item.item_id + ':' + prop" v-model="item.props[prop]"
            @keyup.esc="state.cellEditing = false" @keyup.enter="state.cellEditing = false" id="cellEditInput"
            @blur="state.cellEditing = false" />
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
  /* background-color: rgb(125, 69, 63); */
  box-shadow: inset -2px 0 1px -2px var(--on-secondary);
}

#propsEditDiv {
  /* flex-direction: column; */
  /* flex-grow: 1; */
  display: grid;
  background-color: var(--surface);
  color: var(--on-surface);
}

.row {
  /* flex-grow: 1; */
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
  flex-grow: 0;
  flex-shrink: 0;
  flex-basis: 60px;
  overflow: hidden;
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

#cellEditInput {
  border: none;
  position: absolute;
  top: -1px;
  /* left: 100px; */
  height: 100%;
  outline: none;
  background-color: var(--surface);
  box-shadow: inset 0px 0px 0px 2px var(--primary);
}
</style>