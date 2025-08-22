<template>
    <div class="modal">
        <slot name="header"></slot>
        <div class="modal__content">
            <slot name="content"></slot>
        </div>
        <footer v-if="$slots.footer">
            <slot name="footer"></slot>
        </footer>
        <div class="modal__background"></div>
    </div>
</template>

<script setup lang="ts"></script>

<style lang="scss" scoped>
.modal {
    position: relative;
    display: flex;
    flex-direction: column;
    color: var(--on-surface);
    overflow: hidden;
    box-shadow: var(--shadow-sm);
    border-radius: 5px;

    .modal__background {
        position: absolute;
        background-color: var(--background);
        z-index: -1;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
    }

    .modal__content {
        display: flex;
        flex-direction: column;
        padding: 2rem;
        flex: 1;
        max-width: 100%;
        overflow-x: hidden;
        overflow-y: auto;
    }

    footer {
        border-top: 1px solid var(--surface-border);
        background-color: var(--overlay);
        padding: 1rem;
        width: 100%;
        display: flex;
        gap: 1rem;
        justify-content: flex-end;
    }
}

:deep(.modal__content > *) {
    width: 100%;
}

@media (max-width: 768px) {
    .modal footer {
        justify-content: center;
    }
}
</style>
