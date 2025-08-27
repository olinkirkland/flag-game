<template>
    <label class="checkbox-container" :class="{ disabled: $attrs.disabled }">
        <input type="checkbox" v-model="checked" @change="updateValue" />
        <i :class="checked ? 'fas fa-check-square' : 'far fa-square'"></i>
        <span>
            <slot></slot>
        </span>
    </label>
</template>

<script setup lang="ts">
import { ref, defineProps, watch } from 'vue';

const props = defineProps({
    modelValue: Boolean,
});

const checked = ref(props.modelValue);

const updateValue = () => {
    emit('update:modelValue', checked.value);
};

watch(
    () => props.modelValue,
    (newVal) => {
        checked.value = newVal;
    }
);

const emit = defineEmits(['update:modelValue']);
</script>

<style scoped lang="scss">
.checkbox-container {
    display: inline-flex;
    align-items: center;
    cursor: pointer;
    font-size: unset;
}
.checkbox-container input[type='checkbox'] {
    display: none;
}
.checkbox-container i {
    font-size: 1.2em;
    margin-right: 0.4em;
    color: var(--primary);
}
</style>
