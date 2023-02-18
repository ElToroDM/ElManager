<script setup>
import { reactive, onMounted } from 'vue'
defineProps({
    splitter: Boolean,
    container: Boolean
})

onMounted(() => {
    // Panel scrolling synchronization
    const divs = document.getElementsByClassName("panel")
    let timeoutId
    Array.from(divs).forEach((div) => {
        div.addEventListener("scroll", () => {
            clearTimeout(timeoutId)
            timeoutId = setTimeout(() => {
                const scrollTop = div.scrollTop;
                Array.from(divs).forEach((otherDiv) => {
                    if (otherDiv !== div) otherDiv.scrollTop = scrollTop
                })
            }, 5)
        })
    })
})

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
    <div v-if="container" class="panelsContainer">
        <slot></slot>
    </div>
    <div v-else-if="splitter" class="panelSeparator" @mousedown="panelSeparatorMouseDown($event)"
        @touchstart="panelSeparatorMouseDown($event)">
    </div>
    <div v-else class="panel">
        <slot></slot>
    </div>
</template>

<style>
.panelsContainer {
    display: flex;
    width: 100%;
}

.panel {
    display: flex;
    overflow-y: scroll;
    overflow-x: scroll;
    min-width: 50px;
}

.panelSeparator {
    display: flex;
    width: .75vh;
    cursor: col-resize;
}

.panelSeparator:hover {
    background-color: orange;
}
</style>