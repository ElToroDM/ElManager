<template>
    <div>
        <button @click="toggleTheme">Toggle Theme</button>

        <!-- {{ state.themes }} -->
        <p>{{ state.themes[state.themeIndex] }}</p>
    </div>
</template>
  
<script setup>
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
  
<style >
/* Default Theme */
:root[theme="Default"] {
    --primary: #007bff;
    --primary-variant: #0062cc;
    --on-primary: #ffffff;
    --secondary: #6c757d;
    --secondary-variant: #4e555a;
    --on-secondary: #ffffff;
    --background: #ffffff;
    --on-background: #000000;
    --surface: #f2f2f2;
    --on-surface: #000000;
    --error: #dc3545;
    --on-error: #ffffff;
}

/* Dark Theme */
[theme="Dark"] {
    --primary: #81b3d3;
    --primary-variant: #5d98b3;
    --on-primary: #ffffff;
    --secondary: #9ba3a8;
    --secondary-variant: #757d80;
    --on-secondary: #ffffff;
    --background: #1a1a1a;
    --on-background: #ffffff;
    --surface: #323232;
    --on-surface: #ffffff;
    --error: #ff4c4c;
    --on-error: #ffffff;
}

/* Material Theme */
[theme="Material"] {
    --primary: #2196f3;
    --primary-variant: #1976d2;
    --on-primary: #ffffff;
    --secondary: #9c27b0;
    --secondary-variant: #7b1fa2;
    --on-secondary: #ffffff;
    --background: #f5f5f5;
    --on-background: #000000;
    --surface: #ffffff;
    --on-surface: #000000;
    --error: #f44336;
    --on-error: #ffffff;
}

/* Red Theme */
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

/* Green Theme */
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

p {
    color: var(--on-surface);
    background-color: var(--surface);
    border: 3px solid var(--primary);
}
</style>
  