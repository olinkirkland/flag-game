<template>
    <ul class="carousel" ref="carousel" :class="{ 'flow-mode': isFlowMode }" @scroll="updateCurrentIndex">
        <li
            v-for="(child, index) in slotChildren"
            :key="index"
            :style="getStyleByDeltaToIndex((index as number) - currentIndex)"
        >
            <component :is="child" />
        </li>
    </ul>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, useSlots } from 'vue';

const FLOW_MODE_THRESHOLD = 500; // px
const currentWidth = ref(0);
const isFlowMode = ref(false);

const carousel = ref<HTMLElement | null>(null);
const slots: any = useSlots();
const slotChildren = computed(() => {
    const children = slots.default?.()[0].children || [];
    return children;
});

const currentIndex = ref(0);

// Listen for a change in width of this element
onMounted(() => {
    handleResize();
    updateCurrentIndex();
    window.addEventListener('resize', handleResize);
});

// Cleanup the event listener when the component is unmounted
onUnmounted(() => {
    window.removeEventListener('resize', handleResize);
});

function updateCurrentIndex() {
    if (!carousel.value) return 0;
    const carouselEl = carousel.value! as HTMLElement;
    const carouselCenter = Math.floor(carouselEl.clientWidth / 2);

    // If it's scrolled to the start, set the index to the first card
    if (carouselEl.scrollLeft <= 0) {
        currentIndex.value = 0;
        return;
    }

    // If it's scrolled to the end, set the index to the last card
    if (carouselEl.scrollLeft + carouselEl.clientWidth >= carouselEl.scrollWidth) {
        currentIndex.value = slotChildren.value.length - 1;
        return;
    }

    // Find the index of the card at the center of the carousel
    // Cards can be different widths, so we need to calculate the center based on the scroll position
    const cards = carouselEl.querySelectorAll('li');
    let closestDistance = Number.POSITIVE_INFINITY;
    for (let i = 0; i < cards.length; i++) {
        const card = cards[i] as HTMLElement;
        const start = card.getBoundingClientRect().x - carouselEl.getBoundingClientRect().x;
        const end = start + card.clientWidth;
        if (end > carouselEl.clientWidth) continue;
        if (start < 0) continue;
        const center = Math.floor((start + end) / 2);
        const distance = Math.floor(Math.abs(center - carouselCenter));
        if (distance < closestDistance) {
            closestDistance = distance;
            currentIndex.value = i;
        }
    }
}

function handleResize() {
    currentWidth.value = window.innerWidth;
    updateCurrentIndex();
    isFlowMode.value = determineIsFlowMode();
}

function determineIsFlowMode() {
    // Scroll width must be greater than the client width to be in flow mode
    if (!carousel.value) return false;
    const carouselEl = carousel.value! as HTMLElement;
    const scrollWidth = carouselEl.scrollWidth;
    const clientWidth = carouselEl.clientWidth;
    if (scrollWidth <= clientWidth) return false;
    return currentWidth.value < FLOW_MODE_THRESHOLD;
}

function getStyleByDeltaToIndex(delta: number): string {
    // Determine variables based on the delta
    const direction = delta > 0 ? -1 : 1;
    const degrees = !delta ? 0 : direction * -2;
    const translateY = Math.abs(delta) * 0.5;
    const scale = 1.2 - Math.abs(delta) * 0.1;
    const brightness = 1 - Math.abs(delta) * 0.2;

    // Make the styles
    const transformStyle = `transform: rotate(${degrees}deg) translateY(${translateY}rem) scale(${scale});`;
    const filterStyle = `filter: brightness(${brightness});`;
    const zIndexStyle = `z-index: ${10 - Math.abs(delta)};`;
    return `${transformStyle} ${filterStyle} ${zIndexStyle}`;
}
</script>

<style scoped lang="scss">
ul.carousel {
    max-width: 100%;
    overflow-x: auto;
    overflow-y: hidden;
    display: flex;
    scrollbar-width: none;
    scroll-snap-type: x mandatory;
    scroll-snap-align: start;
    scroll-behavior: smooth;
    -webkit-overflow-scrolling: touch;
    align-items: center;
    padding: 2rem;

    > * {
        scroll-snap-align: center;
    }

    li {
        height: 100%;
        transition: all 0.2s ease-in-out;
    }
}

ul.carousel:not(.flow-mode) {
    gap: 1rem;
    > li {
        transform: scale(1) rotate(0deg) translateY(0rem) !important;
        filter: unset !important;
    }
}

ul.carousel.flow-mode {
    padding: 4rem;
}
</style>
