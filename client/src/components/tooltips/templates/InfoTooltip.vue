<template>
    <TooltipFrame :target="target" :position="'bottom'">
        <template v-slot:content>
            <div class="info">
                <div class="info__html" v-html="html"></div>
            </div>
        </template>
    </TooltipFrame>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import TooltipFrame from '../TooltipFrame.vue';

const props = defineProps<{
    html: string;
    target: HTMLElement;
}>();

const target = computed(() => {
    // Use the event's target to set the tooltip's target
    return props.target;
});
</script>

<style scoped lang="scss">
.info {
    display: flex;
    max-width: 20rem;
    text-align: center;
    flex-direction: column;
    gap: 1.6rem;
    height: 100%;

    * {
        font-size: 1.2rem;
    }
}
</style>
