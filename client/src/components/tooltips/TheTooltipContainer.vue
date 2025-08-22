<template>
    <div class="tooltip-container">
        <Transition :name="`tooltip-transition--${currentTooltipConfig?.position || 'bottom'}`">
            <component :is="currentTooltip" v-bind="currentTooltipConfig" ref="tooltipRef" />
        </Transition>
    </div>
</template>

<script setup lang="ts">
import TooltipController from '@/controllers/tooltip-controller';
import { ComponentOptions, onMounted, ref, shallowRef } from 'vue';

const tooltipRef = ref();
const currentTooltip = shallowRef<ComponentOptions | null>(null);
const currentTooltipConfig = shallowRef<any | null>(null);

TooltipController.getInstance().addEventListener(({ tooltip, tooltipConfig }) => {
    // If no tooltip was passed, close the current one
    if (!tooltip) {
        currentTooltip.value = null;
        return;
    }

    // Compare the current tooltip with the new one (and config)
    const isTooltipAlreadyBeingShown =
        JSON.stringify(currentTooltip.value) === JSON.stringify(tooltip) &&
        JSON.stringify(currentTooltipConfig.value) === JSON.stringify(tooltipConfig);
    if (isTooltipAlreadyBeingShown) return;

    if (tooltip) {
        currentTooltip.value = { ...tooltip! } as any;
        currentTooltipConfig.value = { ...tooltipConfig };
    }
});

onMounted(() => {
    // Add a listener to the document to listen for mouseover events
    // This is used to close the tooltip when the user mouses over an element that is not the tooltip itself or its target
    document.addEventListener('mouseover', (event) => {
        const eventTarget = event.target as HTMLElement;
        const tooltipTarget = currentTooltipConfig.value?.target as HTMLElement;
        const isChildOfTooltipTarget = tooltipTarget?.contains(eventTarget);
        const isTooltip = tooltipRef.value?.$el?.contains(eventTarget);
        const isTooltipTarget = tooltipTarget === eventTarget;

        if (isChildOfTooltipTarget || isTooltip || isTooltipTarget) return;
        TooltipController.close();
    });
});
</script>

<style scoped lang="scss">
.tooltip-container {
    position: absolute;
    width: 100%;

    height: 100vh; // Works everywhere, but buggy on mobile Safari (includes address bar)
    height: 100dvh; // Modern fix, uses the dynamic viewport height. Works properly with iOS Safari and all modern browsers
    min-height: -webkit-fill-available; // Fallback for iOS Safari

    -webkit-overflow-scrolling: touch;
    top: 0;
    display: flex;
    flex-direction: column;
    z-index: 99;
    pointer-events: none;
}

.tooltip-transition--left-enter-active {
    animation: slide-in-left 0.2s ease-out;
}

.tooltip-transition--right-enter-active {
    animation: slide-in-right 0.2s ease-out;
}

.tooltip-transition--top-enter-active {
    animation: slide-in-top 0.2s ease-out;
}

.tooltip-transition--bottom-enter-active {
    animation: slide-in-bottom 0.2s ease-out;
}

@keyframes slide-in-top {
    0% {
        transform: translateY(5px);
        opacity: 0;
    }
    100% {
        transform: translateY(0);
        opacity: 1;
    }
}

@keyframes slide-in-bottom {
    0% {
        transform: translateY(-5px);
        opacity: 0;
    }
    100% {
        transform: translateY(0);
        opacity: 1;
    }
}

@keyframes slide-in-left {
    0% {
        transform: translateX(5px);
        opacity: 0;
    }
    100% {
        transform: translateX(0);
        opacity: 1;
    }
}

@keyframes slide-in-right {
    0% {
        transform: translateX(-5px);
        opacity: 0;
    }
    100% {
        transform: translateX(0);
        opacity: 1;
    }
}
</style>
