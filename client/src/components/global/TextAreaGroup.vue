<template>
    <div class="text-area-group">
        <div class="prepend" :class="{ 'is-slot-empty': isSlotEmpty }">
            <slot></slot>
        </div>

        <textarea
            v-bind="attrs"
            :value="modelValue"
            @input="onInput"
            ref="textarea"
            autocomplete="off"
            row="1"
        ></textarea>
    </div>
</template>

<script setup lang="ts">
import { computed, defineEmits, defineProps, onMounted, ref, useAttrs, useSlots } from 'vue';

const props = defineProps<{
    modelValue: string;
}>();

const textarea = ref<HTMLTextAreaElement | null>(null);

const emit = defineEmits<{
    (e: 'update:modelValue', value: string): void;
}>();

const attrs: Record<string, unknown> = useAttrs();
const slots: Record<string, unknown> = useSlots();

const isSlotEmpty = computed(() => {
    //@ts-ignore
    const defaultSlot = slots.default?.();
    const children = defaultSlot?.filter((v: any) => v.type !== Comment && v.type !== Text) ?? [];
    if (children.length === 0) return true;
    const firstChild = children[0];
    return firstChild?.children?.length === 0;
});

onMounted(() => {
    setTimeout(() => {
        autoFitTextArea();
    }, 0);
});

function onInput(event: Event) {
    if (!textarea.value) return;
    emit('update:modelValue', textarea.value.value);
    autoFitTextArea();
}

function autoFitTextArea() {
    if (!textarea.value) return;
    textarea.value.style.height = 'auto';
    textarea.value.style.height = textarea.value.scrollHeight + 'px';
}
</script>

<style scoped lang="scss">
.text-area-group {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    border-radius: 5px;
    width: 100%;
    background-color: var(--background);
    border: 1px solid var(--surface-alt);
    outline: none;
    overflow: hidden;

    textarea {
        overflow: hidden;
        resize: none;
        box-sizing: border-box;
        line-height: 1.4;
        padding: 0.8rem 1.2rem;
    }

    &:focus-within {
        outline: 2px solid var(--primary-alt);
        outline-offset: 0.2rem;
        > .prepend * {
            color: var(--primary-alt);
        }
    }

    > .prepend {
        display: flex;
        gap: 1rem;
        align-items: center;
        padding: 0 1.2rem;
        background-color: var(--surface);
        border-bottom: 1px solid var(--surface-alt);
        min-height: 3.2rem;
        width: 100%;
        white-space: nowrap;
    }

    .is-slot-empty {
        display: none;
    }

    > textarea {
        display: block;
        width: 100%;
        overflow: hidden;
        background-color: transparent;
        color: var(--primary);

        &:focus {
            outline: none;
        }

        &::placeholder {
            opacity: 0.5;
            font-style: italic;
        }
    }
}
</style>
