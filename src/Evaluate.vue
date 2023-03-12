<script setup>
/*
________________________________________________________________________________
Evaluate test component
by Diego Fraga
exerionbit.com
Code started: january 28, 2023
________________________________________________________________________________
To compile grammar:
nearleyc grammar.ne -o grammar.js
________________________________________________________________________________
TODO:
FORMULAS
  Functions
    function sum average ceiling floor if len trim
    Reference functions
      parentprop(prop) Returns parent item "prop" value
      childrenprop(prop) Return array of "prop" values of the children items
  Operators
    arithmetic + - * / ^ %
    comparison = > < >= <= <>
    text concatenation &
    reference : , (space)
  References
    name propName
    dot parent.item.prop
  Constants
    number
    string
    date
________________________________________________________________________________
*/
import { reactive } from 'vue'
const state = reactive({ result: '' })
function evaluate(inputElement) {
  const input = inputElement.value
  const parser = new nearley.Parser(grammar.ParserRules, grammar.ParserStart)
  try {
    parser.feed(input)
    if (!parser.results[0]) throw new Error(1)
    if (isNaN(parser.results[0].v)) throw new Error(2)
    if (parser.results[0].v === Infinity) throw new Error(3)
    state.result = input.replace(/^\s*=/, '') + ' = ' + parser.results[0].v.toString()
  } catch (e) {
    state.result = input + ' = [error]' + e //+ ' ' + parser.results[0].v.toString()
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
