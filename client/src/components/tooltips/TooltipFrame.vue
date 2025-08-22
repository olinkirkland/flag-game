<template>
    <div ref="tooltip" class="tooltip" :style="{ left: x, top: y }" :class="`tooltip--${position}`">
        <div class="tooltip__content">
            <slot name="content"></slot>
        </div>
        <div class="tooltip__background"></div>
    </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';

const props = defineProps<{
    target: HTMLElement;
    position?: 'top' | 'bottom' | 'left' | 'right';
    offset?: number;
}>();

const tooltip = ref<HTMLElement | null>(null);

const offset = computed(() => {
    return props.offset || 7;
});

const tooltipWidth = computed(() => {
    if (tooltip.value) return Math.round(tooltip.value.getBoundingClientRect().width);
    return 0;
});

const tooltipHeight = computed(() => {
    if (tooltip.value) return Math.round(tooltip.value.getBoundingClientRect().height);
    return 0;
});

const x = computed(() => {
    // Use target's x position to set the tooltip's x position
    let tooltipX = Math.round(props.target.getBoundingClientRect().x);
    tooltipX += props.target.getBoundingClientRect().width / 2;
    switch (props.position) {
        case 'left':
            tooltipX -= tooltipWidth.value + props.target.getBoundingClientRect().width / 2 + offset.value;
            break;
        case 'right':
            tooltipX += props.target.getBoundingClientRect().width / 2 + offset.value;
            break;
        default:
            tooltipX -= tooltipWidth.value / 2;
    }
    return tooltipX + 'px';
});

const y = computed(() => {
    // Use target's y position to set the tooltip's y position
    let tooltipY = Math.round(props.target.getBoundingClientRect().y);
    tooltipY += props.target.getBoundingClientRect().height / 2;
    switch (props.position) {
        case 'top':
            tooltipY -= tooltipHeight.value + props.target.getBoundingClientRect().height / 2 + offset.value;
            break;
        case 'bottom':
            tooltipY += props.target.getBoundingClientRect().height / 2 + offset.value;
            break;
        default:
            tooltipY -= tooltipHeight.value / 2;
    }
    return tooltipY + 'px';
});
</script>

<style lang="scss" scoped>
.tooltip {
    position: relative;
    width: max-content;
    display: flex;
    flex-direction: column;
    color: var(--surface);
    overflow: hidden;
    box-shadow: var(--shadow-sm);
    border-radius: 5px;

    * {
        color: var(--surface);
    }

    .tooltip__background {
        position: absolute;
        background-color: rgba(0, 0, 0, 0.8);
        z-index: -1;
        opacity: 0.9;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
    }

    .tooltip__content {
        display: flex;
        flex-direction: column;
        width: max-content;
        padding: 0.8rem 1.2rem;
        flex: 1;
        max-width: 100%;
        overflow-x: hidden;
        overflow-y: auto;
    }
}

.tooltip {
    &--top::before {
        width: 100%;
        height: 2rem;
        transform: translateY(-100%);
    }

    &--right::before {
        width: 4rem;
        height: 100%;
    }

    &--bottom::before {
        width: 100%;
        height: 2rem;
        transform: translateY(-100%);
    }

    &--left::before {
        width: 4rem;
        height: 100%;
    }
}

:deep(.tooltip__content > *) {
    width: 100%;
}
</style>
