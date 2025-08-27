<template>
    <div class="page">
        <slot></slot>
    </div>
</template>

<script lang="ts" setup></script>

<style lang="scss" scoped>
.page {
    height: 100vh;
    height: 100dvh; // Safari
    min-height: -webkit-fill-available; // Fallback for iOS Safari

    gap: 1rem;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding: 1rem;
}

@media (max-width: 768px) {
    .page {
        padding: 0;
        overflow-y: auto;
    }
}
</style>
