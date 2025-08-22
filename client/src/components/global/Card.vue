<template>
    <div class="card">
        <header>
            <slot name="header"></slot>
        </header>
        <div class="content">
            <slot name="content"></slot>
        </div>
    </div>
</template>

<script setup lang="ts"></script>

<style lang="scss" scoped>
.card {
    background-color: var(--background);
    border-radius: 7px;
    box-shadow: var(--shadow-sm);
    overflow: hidden;

    display: flex;
    flex-direction: column;
    gap: 1rem;

    > header {
        padding: 2.4rem;
        padding-bottom: 0;
        text-align: center;
        :deep(i) {
            font-size: 2rem;
        }
    }

    > .content {
        padding: 2.4rem;
        padding-top: 0;
    }
}
</style>
