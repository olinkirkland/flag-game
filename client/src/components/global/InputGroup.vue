<template>
    <div
        class="input-group"
        :class="{
            disabled: props.disabled,
            'is-number': props.type === 'number'
        }"
    >
        <div
            class="prepend"
            :class="{ 'is-prepend-slot-empty': isPrependSlotEmpty }"
            @click="onClickPrepend"
        >
            <slot></slot>
        </div>

        <!-- Stepper up -->
        <Button
            @click="onClickStepDown"
            :disabled="props.disabled"
            class="stepper"
            mini
            v-if="props.type === 'number'"
        >
            <i class="fas fa-minus"></i>
        </Button>

        <input
            ref="input"
            v-bind="attrs"
            :value="modelValue"
            :class="{ mini: props.mini }"
            @input="onInput"
            @keydown.enter="onPressEnterKey"
            autocomplete="off"
            autocorrect="off"
            :disabled="props.disabled"
            :type="props.type || 'text'"
        />

        <!-- Stepper down -->
        <Button
            @click="onClickStepUp"
            :disabled="props.disabled"
            class="stepper"
            mini
            v-if="props.type === 'number'"
        >
            <i class="fas fa-plus"></i>
        </Button>
    </div>
</template>

<script setup lang="ts">
import {
    computed,
    defineEmits,
    defineProps,
    ref,
    useAttrs,
    useSlots
} from 'vue';

const props = defineProps<{
    modelValue: string | number | null | undefined;
    disabled?: boolean;
    mini?: boolean;
    type?: 'text' | 'password' | 'email' | 'number' | 'search';
}>();

const input = ref<HTMLInputElement | null>(null);

const emit = defineEmits<{
    (e: 'update:modelValue', value: string): void;
    (e: 'submit'): void;
}>();

defineExpose({ focus, select });

const attrs: Record<string, unknown> = useAttrs();
const slots: Record<string, unknown> = useSlots();

function onClickStepUp() {
    input.value?.stepUp();
    emit('update:modelValue', input.value?.value || '');
}

function onClickStepDown() {
    input.value?.stepDown();
    emit('update:modelValue', input.value?.value || '');
}

const isPrependSlotEmpty = computed(() => {
    //@ts-ignore
    const defaultSlot = slots.default?.();
    const children =
        defaultSlot?.filter(
            (v: any) => v.type !== Comment && v.type !== Text
        ) ?? [];
    if (children.length === 0) return true;
    const firstChild = children[0];
    return firstChild?.children?.length === 0;
});

function onClickPrepend() {
    if (!input.value || props.disabled) return;
    input.value.focus();
}

function onInput(event: Event) {
    const target = event.target as HTMLInputElement;
    emit('update:modelValue', target.value);
}

function onPressEnterKey() {
    if (input.value) input.value.blur();
    emit('submit');
}

function focus() {
    if (input.value) input.value.focus();
}

function select() {
    if (input.value) input.value.select();
}
</script>

<style scoped lang="scss">
.input-group {
    position: relative;
    display: flex;
    align-items: center;
    border-radius: 5px;
    height: 3.2rem;
    width: 100%;
    min-height: 3.2rem;
    background-color: var(--background);
    border: 1px solid var(--border);
    outline: none;

    &.disabled {
        border-color: transparent;
        * {
            border-color: transparent !important;
        }
        input,
        button,
        :deep(.prepend) {
            color: var(--surface-dark);
        }
    }

    &:focus-within {
        outline: 2px solid var(--accent-1-dark);
        outline-offset: 0.2rem;
        > .prepend * {
            color: var(--accent-1-dark);
        }
    }

    > .prepend {
        display: flex;
        flex-shrink: 0;
        gap: 1rem;
        align-items: center;
        padding: 0 1.2rem;
        margin-right: 0.8rem;
        height: 100%;
        border-right: 1px solid var(--border);
        white-space: nowrap;
        border-top-left-radius: 5px;
        border-bottom-left-radius: 5px;
    }

    .is-prepend-slot-empty {
        display: none;
    }

    .is-prepend-slot-empty + input:not(.mini) {
        padding-left: 0.8rem;
    }

    > input {
        display: block;
        width: 100%;
        overflow: hidden;
        height: 100%;
        background-color: transparent;
        color: var(--accent-1);

        &:focus {
            outline: none;
        }

        &::placeholder {
            opacity: 0.5;
            font-style: italic;
        }
    }
}

.stepper {
    margin: 0.4rem;
}

.is-number {
    input {
        text-align: center;
    }
}
</style>
