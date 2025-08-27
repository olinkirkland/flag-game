<template>
    <div class="badge" :style="style">
        <span>
            <slot></slot>
        </span>
    </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue';

// Color string used as background color for the badge
const props = defineProps<{
    color?: string;
}>();

const style = computed(() => {
    return {
        backgroundColor: props.color || 'var(--surface-alt)',
        color: 'var(--surface)'
    };
});
</script>

<style lang="scss" scoped>
.badge {
    display: flex;
    width: fit-content;
    height: 1.8rem;
    padding: 0 0.5rem;
    gap: 0.4rem;
    align-items: center;
    border-radius: 5px;
    background-color: var(--surface-alt);

    > span {
        font-size: 1.2rem;
        color: var(--text-on-surface);
    }
}
</style>
