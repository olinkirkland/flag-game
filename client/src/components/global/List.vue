<template>
    <ul>
        <slot></slot>
    </ul>
</template>

<script setup lang="ts"></script>

<style scoped lang="scss">
ul {
    display: flex;
    flex-direction: column;
    width: 100%;
    padding: 0;
    margin: 0;
    border: 1px solid var(--surface-alt);
    border-radius: 5px;
    overflow-y: auto;

    :deep(li) {
        display: flex;
        gap: 0.8rem;
        align-items: center;
        width: 100%;
        padding: 0.8rem 1.2rem;
        cursor: pointer;

        &:not(:last-child) {
            border-bottom: 1px solid var(--surface-alt);
        }

        &.is-selected {
            background-color: var(--surface-alt);
            color: var(--on-surface);
        }
    }
}
</style>
