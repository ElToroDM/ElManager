<script setup>
import { ref, reactive, onMounted } from 'vue'
const state = reactive({})
//______________________________________________________________________________
function panelSeparatorMouseDown(event) {
    document.addEventListener('mouseup', panelSeparatorMouseUp, true)
    document.addEventListener('touchend', panelSeparatorMouseUp, true)
    window.addEventListener('mousemove', panelSeparatorMouseMove, true)
    state.panel = event.currentTarget.previousElementSibling
    state.panelBaseWidth = state.panel.offsetWidth - event.pageX
}
//______________________________________________________________________________
function panelSeparatorMouseUp() {
    document.removeEventListener('mouseup', panelSeparatorMouseUp, true)
    document.removeEventListener('touchend', panelSeparatorMouseUp, true)
    window.removeEventListener('mousemove', panelSeparatorMouseMove, true)
}
//______________________________________________________________________________
function panelSeparatorMouseMove(event) {
    event.stopPropagation()
    state.panel.style.width = state.panelBaseWidth + event.pageX + 'px'
}
//______________________________________________________________________________
</script>

<template>
    <div class="panelSeparator" @mousedown="panelSeparatorMouseDown($event)" @touchstart="panelSeparatorMouseDown($event)">
</div>
</template>