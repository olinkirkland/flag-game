<template>
    <div class="panel" :class="{ 'panel--border': props.borderMode }">
        <slot></slot>
    </div>
</template>

<script lang="ts" setup>
const props = defineProps<{
    borderMode?: false;
}>();
</script>

<style lang="scss" scoped>
.panel {
    border-radius: 5px;
    box-shadow: var(--shadow-sm);
    background-color: var(--background);

    gap: 1rem;
    display: flex;
    flex-direction: column;
    padding: 2rem;
}

.panel--border {
    border: 1px solid var(--border);
    box-shadow: none;
    background-color: none;
}
</style>
