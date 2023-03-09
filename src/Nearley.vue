<script setup>
import { reactive } from 'vue'
const state = reactive({})
function evaluate(inputElement) {
  const input = inputElement.value
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
  inputElement.select()
}
</script>

<template>
  <div>
    <input autofocus type="text" @keypress.enter="evaluate($event.currentTarget)" />
    {{ state.result }}
  </div>
</template>
