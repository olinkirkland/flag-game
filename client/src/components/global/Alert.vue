<template>
    <Card class="alert" :class="{ [typeClass]: true }" shadow>
        <slot></slot>
        <Button class="close" @click="onClickClose" icon mini>
            <i class="fas fa-times"></i>
        </Button>
    </Card>
</template>

<script lang="ts" setup>
import { ref, watch } from 'vue';

const props = defineProps<{
    type?: 'info' | 'error' | 'success';
}>();

const emits = defineEmits<{
    (e: 'close'): void;
}>();

const typeClasses = {
    info: 'alert--info',
    error: 'alert--error',
    success: 'alert--success'
};

const typeClass = typeClasses[props.type || 'info'];

const isClosed = ref(false);
function onClickClose() {
    isClosed.value = true;
    emits('close');
}
</script>

<style lang="scss" scoped>
.alert {
    width: 100%;
    flex-direction: row;
    align-items: center;
    padding: 1rem;
    gap: 1rem;

    :deep(i) {
        padding: 0.2rem;
    }

    :deep(button) {
        margin-left: auto;
    }

    &--info {
        background-color: var(--info-light);
        border: 1px solid var(--info);
        color: var(--info);
    }

    &--success {
        background-color: var(--success-light);
        border: 1px solid var(--success);
        color: var(--success);
    }

    &--error {
        background-color: var(--danger-light);
        border: 1px solid var(--danger);
        color: var(--danger);
    }
}
</style>
