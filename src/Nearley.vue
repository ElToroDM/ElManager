<template>
  <div>
    <input id="input" autofocus type="text" placeholder="3+4*ln(e+pi^2)" v-model="inputValue"
      @keypress.enter="evaluate(inputValue)" />
    <div>{{ state.result }}</div>
  </div>
</template>

<script setup>
// import nearley from './nearley/nearley.js';
// import grammar from './nearley/grammar.js';
// ^^ redblobgames:  If you look at the nearly.js code it doesn't export anything.
//That means it's written in global-variable <script> style, not in module export style.
//You can either convert it to es6 modules, or you can use <script> like you did before.

import { reactive, ref } from 'vue'
const inputValue = ref('')
const state = reactive({ result: '' })

function evaluate(input) {
  const parser = new nearley.Parser(arithmetic.ParserRules, arithmetic.ParserStart)
  try {
    parser.feed(input)
    if (!parser.results[0]) {
      throw new Error()
    }
    if (isNaN(parser.results[0]) || parser.results[0] === Infinity) {
      throw new Error()
    }
    state.result = input + ' = ' + parser.results[0].toString()
  } catch (e) {
    state.result = input + ' = [error]'
  }

  document.getElementById('input').select()
}
</script>
