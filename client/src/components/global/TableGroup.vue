<template>
    <Card class="table-group" :class="{ 'tables-group--merge': merge }">
        <slot></slot>
    </Card>
</template>

<script setup lang="ts">
const props = defineProps({
    merge: {
        type: Boolean,
        default: false
    }
});
</script>

<style scoped lang="scss">
.table-group {
    width: 100%;
    padding: 0;
    gap: 0;

    width: 100%;
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(0rem, 1fr));

    > * {
        width: 100%;
        overflow: hidden;
    }

    :deep(.table-card) {
        border-radius: 0;
        border: none;
        &:not(:last-child) {
            border-right: 1px solid var(--surface-border);
        }
    }
}

@media (max-width: 768px) {
    .table-group {
        grid-template-columns: 1fr;
        :deep(.table-card) {
            &:not(:last-child) {
                border-right: none;
            }
        }
    }

    // If the tables are not merged, add a bottom border to each table
    // An example of merging would be a split table, where you have half the items on the left and half on the right
    // for layout purposes (see WildShapeStep.vue)
    .table-group:not(.tables-group--merge) {
        :deep(.table-card) {
            &:not(:last-child) {
                border-bottom: 1px solid var(--surface-border);
            }
        }
    }
}
</style>
