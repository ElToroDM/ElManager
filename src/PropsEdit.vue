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
import { ref, reactive } from 'vue'
import { isInOpenFolder } from '/Items.js'
const props = defineProps({ items: Object })
const itemref = ref([])
// const state = reactive({})
const state = reactive({ result: '' })
//______________________________________________________________________________
function cellView(item, prop) {
  const cell = item.props[prop]
  if (typeof cell === 'string' || cell instanceof String) {
    // cell it's a string
    // TODO sanitize string
    if (cell.charAt(0) != '=') return cell
    return evaluate(cell + '|||' + item.item_id)
  }
  // cell it's not a string
  return cell
}

window.parentProp = function (string, itemId) {
  return string + '?' + item.item_level;
};

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
        <div v-for="prop in columns" class="cell">{{ cellView(item, prop) }}</div>
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
  box-shadow:
    inset -2px 0 1px -2px var(--on-secondary);


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
  align-items: center;
  justify-content: right;
  flex-grow: 0;
  flex-shrink: 0;
  flex-basis: 60px;
  overflow: hidden;
  padding-right: .2em;
  /* background-color: rgb(125, 69, 63); */
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