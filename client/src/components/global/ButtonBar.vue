<template>
    <div class="button-bar" :class="{ 'full-width': fullWidth, disabled: $attrs.disabled }">
        <slot></slot>
    </div>
</template>

<script setup lang="ts">
const props = defineProps({
    fullWidth: {
        type: Boolean,
        default: false,
    },
});
</script>

<style scoped lang="scss">
.button-bar {
    display: flex;

    :deep(button > .btn__content) {
        border-radius: 0;
    }

    :deep(button > .btn__shadow) {
        border-radius: 0;
    }

    :deep(button:first-child > .btn__content) {
        border-top-left-radius: 5px;
        border-bottom-left-radius: 5px;
    }

    :deep(button:first-child > .btn__shadow) {
        border-top-left-radius: 5px;
        border-bottom-left-radius: 5px;
    }

    :deep(button:last-child > .btn__content) {
        border-top-right-radius: 5px;
        border-bottom-right-radius: 5px;
    }

    :deep(button:last-child > .btn__shadow) {
        border-top-right-radius: 5px;
        border-bottom-right-radius: 5px;
    }
}

.button-bar.full-width {
    width: 100%;
    :deep(button) {
        flex: 1;
        > .btn__content {
            justify-content: center;
        }
    }
}

// For input groups
:deep(.input-group) {
    z-index: 1;
    flex: 1;

    // Handle the border radiuses
    border-radius: 0 !important;
    &:first-child {
        border-top-left-radius: 5px !important;
        border-bottom-left-radius: 5px !important;
    }
    &:last-child {
        border-top-right-radius: 5px !important;
        border-bottom-right-radius: 5px !important;
    }
}
</style>
