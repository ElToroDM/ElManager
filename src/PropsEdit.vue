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
// function onDblClicK(event,item, prop) {
//   state.cellEditing = item.item_id + ':' + prop
//   nextTick(() => {
//     const cellInput = document.getElementById('cellEditInput')
//     cellInput.left= event.currentTarget.offsetLeft+'px'
//     cellInput.focus()
//     cellInput.select()
//   })
// }
let cellWidth
function onDblClicK(event, item, prop) {
  state.cellEditing = item.item_id + ':' + prop
  nextTick(() => {
    cellWidth = event.currentTarget.offsetWidth
    const cellInput = document.getElementById('cellEdit')//cellEditInput
    cellInput.style.left = event.currentTarget.offsetLeft - 2 + 'px'
    cellInput.style.width = cellWidth - 2 + 'px'
    cellInput.style.minWidth = cellWidth - 2 + 'px'
    cellInput.focus()
    // cellInput.select()
  })

}
function onChangeInput(event) {
  // event.currentTarget.style.width = 0
  const scrollWidth = event.currentTarget.scrollWidth
  if (scrollWidth > cellWidth + 2) {
    event.currentTarget.style.width = scrollWidth + 8 + 'px'
  }
}

function onChangeTextarea(event) {
  event.currentTarget.style.height = "auto";
  event.currentTarget.style.height = event.currentTarget.scrollHeight + 'px';
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
          <!-- <input v-if="state.cellEditing == item.item_id + ':' + prop" v-model="item.props[prop]"
            @keyup.esc="state.cellEditing = false" @keyup.enter="state.cellEditing = false" id="cellEditInput"
            @blur="state.cellEditing00000000000000000000000 = false" @keyup="onChangeInput($event)"
            @keydown="onChangeInput($event)" /> -->
            <textarea v-if="state.cellEditing == item.item_id + ':' + prop" v-model="item.props[prop]"
            @keyup.esc="state.cellEditing = false" @keyup.enter="state.cellEditing = false" id="cellEdit"
            @blur="state.cellEditing00000000000000000000000 = false" @keyup="onChangeTextarea($event)"
            @keydown="onChangeInput($event)" />
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

/* #cellEditInput {
  position: absolute;
  z-index: 1;
  top: -1px;
  height: 100%;
  max-width: 95%;

  inline-size: 95%;

  outline: none;
  border: none;
  background-color: var(--surface);
  color: var(--on-surface);
  box-shadow: inset 0px 0px 0px 2px var(--primary);
} */

#cellEdit {
  position: absolute;
  z-index: 1;
  top: -1px;
  /* height: 100%; */
  max-width: 95%;

  inline-size: 95%;
  line-height:  4vh; 

  /* white-space:normal;
  word-break:break-word;
  overflow-wrap: break-word;
  word-wrap: break-word;
  hyphens: auto; */

  resize: none;

  outline: none;
  border: none;
  background-color: var(--surface);
  color: var(--on-surface);
  box-shadow: inset 0px 0px 0px 2px var(--primary);
  
}
</style>