<script setup>
/*
________________________________________________________________________________
Themes - Color Theme changer for Vue.js
by Diego Fraga
exerionbit.com
Code started: february 18, 2023
________________________________________________________________________________
TODO:
review color names. "variant" is ok?
add pane variation?
test elements/template for showing all theme colors
color editing tool
document
________________________________________________________________________________
*/

import { reactive } from 'vue'

const state = reactive({
    themeIndex: -1,
    themes: []
})
// Save on state.themes then theme names from ccs style
const styles = document.getElementsByTagName('style')
const themeRegex = /\[theme="(.*?)"]/g
for (let i = 0; i < styles.length; i++) {
    const matches = styles[i].innerHTML.matchAll(themeRegex)
    for (let match of matches) state.themes.push(match[1])
}

toggleTheme()

function toggleTheme() {
    state.themeIndex = (state.themeIndex + 1) % state.themes.length;
    document.documentElement.setAttribute('theme', state.themes[state.themeIndex])
}
</script>

<template>
    <div>
        <button @click="toggleTheme">Theme: {{ state.themes[state.themeIndex] }}</button>
    </div>
</template>

<style scoped>
button {
    margin: 0 0 .5em 1em;
    padding: .5em;
    color: var(--on-surface);
    background-color: var(--surface);
    border: 3px solid var(--primary);
}
</style>

<style>
/* Default Theme */
:root[theme="Dark"] {
    --primary: #cc7402;
    --primary-variant: #b45700;
    --on-primary: #ffffff;
    --secondary: #8c9397;
    --secondary-variant: #646a6c;
    --on-secondary: #ffffff;
    --background: #1a1a1a;
    --on-background: #e9e9e9;
    --surface: #323232;
    --on-surface: #e9e9e9;
    --error: #ff4c4c;
    --on-error: #ffffff;
}

[theme="Ocean"] {
    --primary: #1c758a;
    --primary-variant: #134e63;
    --on-primary: #ffffff;
    --secondary: #28abb9;
    --secondary-variant: #1c758a;
    --on-secondary: #ffffff;
    --background: #d9e8ea;
    --on-background: #000000;
    --surface: #ffffff;
    --on-surface: #000000;
    --error: #ff6347;
    --on-error: #ffffff;
}

[theme="FireAndIce"] {
    --primary: #ff4d4d;
    --primary-variant: #b30000;
    --on-primary: #ffffff;
    --secondary: #4d79ff;
    --secondary-variant: #002699;
    --on-secondary: #ffffff;
    --background: #ffffff;
    --on-background: #000000;
    --surface: #f1f1f1;
    --on-surface: #000000;
    --error: #ff9100;
    --on-error: #ffffff;
}

[theme="Material"] {
    --primary: #0e70c0;
    --primary-variant: #0f4f8f;
    --on-primary: #ffffff;
    --secondary: #a077a7;
    --secondary-variant: #8f64a1;
    --on-secondary: #ffffff;
    --background: #eeeaea;
    --on-background: #000000;
    --surface: #ffffff;
    --on-surface: #000000;
    --error: #f44336;
    --on-error: #ffffff;
}

[theme="Red"] {
    --primary: #ff5722;
    --primary-variant: #e64a19;
    --on-primary: #ffffff;
    --secondary: #8d6e63;
    --secondary-variant: #5d4037;
    --on-secondary: #ffffff;
    --background: #fafafa;
    --on-background: #000000;
    --surface: #ffebee;
    --on-surface: #000000;
    --error: #d32f2f;
    --on-error: #ffffff;
}

[theme="Green"] {
    --primary: #4caf50;
    --primary-variant: #388e3c;
    --on-primary: #ffffff;
    --secondary: #607d8b;
    --secondary-variant: #455a64;
    --on-secondary: #ffffff;
    --background: #f9fbe7;
    --on-background: #000000;
    --surface: #c8e6c9;
    --on-surface: #000000;
    --error: #e53935;
    --on-error: #ffffff;
}

[theme="Pink"] {
    --primary: #e91e63;
    --primary-variant: #c2185b;
    --on-primary: #ffffff;
    --secondary: #f48fb1;
    --secondary-variant: #c51162;
    --on-secondary: #ffffff;
    --background: #fafafa;
    --on-background: #000000;
    --surface: #ffffff;
    --on-surface: #000000;
    --error: #d50000;
    --on-error: #ffffff;
}
</style>
