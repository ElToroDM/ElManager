<script setup>
/*
________________________________________________________________________________
Pane component for Vue.js
by Diego Fraga
exerionbit.com
Code started: february 12, 2022
________________________________________________________________________________
TODO:
add "Sync groups"
Limit max panes sizes
add horizontal panes
(touch) pane resizing with touchs
________________________________________________________________________________
*/

import { reactive, onMounted } from 'vue'
defineProps({
    splitter: Boolean,
    container: Boolean
})

onMounted(() => {
    // Pane scrolling synchronization
    const divs = document.getElementsByClassName("scrollSync")
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

    // Hide scrollbars adjusting panes margin-right to
    const scrollSyncDiv = document.querySelector('.scrollSync')
    const scrollbarWidth = scrollSyncDiv.clientWidth - scrollSyncDiv.offsetWidth-1
    if (scrollbarWidth) {
        const panes = document.querySelectorAll('.pane:not(:last-child)')
        panes.forEach(pane => {
            pane.style.marginRight = scrollbarWidth + 'px'
        })
    }
})

const state = reactive({})
//______________________________________________________________________________
function paneSplitterMouseDown(event) {
    document.addEventListener('mouseup', paneSplitterMouseUp, true)
    document.addEventListener('touchend', paneSplitterMouseUp, true)
    window.addEventListener('mousemove', paneSplitterMouseMove, true)
    state.paneSplitter = event.currentTarget
    state.paneSplitter.classList.add("paneSplitterResizing")
    state.pane = state.paneSplitter.previousElementSibling
    state.paneBaseWidth = state.pane.offsetWidth - event.pageX
}
//______________________________________________________________________________
function paneSplitterMouseUp() {
    document.removeEventListener('mouseup', paneSplitterMouseUp, true)
    document.removeEventListener('touchend', paneSplitterMouseUp, true)
    window.removeEventListener('mousemove', paneSplitterMouseMove, true)
    state.paneSplitter.classList.remove("paneSplitterResizing")
}
//______________________________________________________________________________
function paneSplitterMouseMove(event) {
    event.stopPropagation()
    // state.pane.style.width = state.paneBaseWidth + event.pageX + 'px'
    // state.pane.style.minWidth = state.paneBaseWidth + event.pageX + 'px'
    state.pane.style.flexBasis = state.paneBaseWidth + event.pageX + 'px'
}
//______________________________________________________________________________
</script>
  
<template>
    <div v-if="container" class="panesContainer">
        <slot></slot>
    </div>
    <div v-else-if="splitter" class="paneSplitter" @mousedown="paneSplitterMouseDown($event)"
        @touchstart="paneSplitterMouseDown($event)">
    </div>
    <div v-else class="pane">
        <slot></slot>
    </div>
</template>

<style>
.panesContainer {
    display: flex;
}

.pane {
    display: flex;
    min-width: 100px;
    overflow: hidden;
}

.pane:not(:last-child) {
    flex-grow: 0;
    flex-shrink: 0;

    /* margin-right: -17px; */
}

.paneSplitter {
    z-index: 100;
    display: flex;
    flex-grow: 0;
    flex-shrink: 0;
    flex-basis: 1vh;
    cursor: col-resize;
    background-color: var(--background);
    transition: 0 background-color;
    transition-duration: 200ms;
}

.paneSplitter:hover,
.paneSplitterResizing {
    background-color: var(--primary);
    transition-delay: 200ms;
    transition-duration: 200ms;
}

.scrollSync {
    display: flex;
    overflow-y: scroll;
    overflow-x: scroll;
}
</style>
