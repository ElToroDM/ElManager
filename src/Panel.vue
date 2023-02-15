<script setup>
import { ref, reactive, onMounted } from 'vue'

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
</script>
  
<template>
    <div class="panel">
        <slot>
        </slot>
</div>
</template>

<style>
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