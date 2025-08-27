<template>
    <Card class="table-card" :class="{ 'table-card--many': props.many, 'table-card--scroll': props.scroll }">
        <header v-if="title" class="table-header">
            <h2>{{ title }}</h2>
        </header>
        <ul ref="scrollingEl">
            <li v-for="(item, index) in items" :key="index">
                <slot name="item" :item="item"></slot>
            </li>
        </ul>
    </Card>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
const props = defineProps({
    title: {
        type: String,
        required: false
    },
    items: {
        type: Array as () => any[],
        required: true
    },
    many: {
        type: Boolean,
        default: false
    },
    scroll: {
        type: Boolean,
        default: false
    },
    autoScroll: {
        type: Boolean,
        default: false
    }
});

const scrollingEl = ref<HTMLElement | null>(null);

watch(
    () => props.items,
    () => {
        console.log('Items updated:', props.items);
        if (scrollingEl.value) {
            requestAnimationFrame(() => {
                if (props.autoScroll) {
                    scrollingEl.value!.scrollTop = scrollingEl.value!.scrollHeight;
                }
            });
        }
    },
    { deep: true }
);
</script>

<style scoped lang="scss">
.card {
    // Max size
    padding: 0;
    gap: 0;
    height: 100%;

    ul {
        width: 100%;
        height: 100%;
        overflow-y: auto;
        scroll-behavior: smooth;
    }
}

.table-card--many > ul {
    display: grid;
    grid-template-columns: repeat(6, 1fr);
    padding: 2rem;
    gap: 0rem;
    > li {
        display: flex;
        align-items: center;
        background-color: unset;
    }
}

header {
    width: 100%;
    text-align: center;
    padding: 0.4rem 0.8rem;
    color: var(--surface-alt);
    border-bottom: 1px dashed var(--surface-border);
}

li {
    width: 100%;
    padding: 0.4rem 0.8rem;
    display: flex;
    overflow: hidden;
    &:nth-child(odd) {
        background-color: var(--overlay);
    }
}

@media (max-width: 768px) {
    .table-card--many > ul {
        grid-template-columns: repeat(2, 1fr);
    }
}
</style>
