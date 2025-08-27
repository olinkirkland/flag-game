<template>
    <Card>
        <div class="tabs">
            <div
                v-for="(tab, index) in tabs"
                :key="tab.id"
                class="tab"
                @click="onClickTab(index)"
                :class="{ selected: index === currentTabIndex, disabled: tab.disabled }"
            >
                {{ tab.name }}
            </div>
        </div>
        <div class="tab-content">
            <div v-for="(tab, index) in tabs" :key="tab.id" v-show="index === currentTabIndex">
                <slot :name="tab.id"></slot>
            </div>
        </div>
    </Card>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const props = defineProps({
    tabs: {
        type: Array as () => { id: string; name: string; disabled?: boolean }[],
        required: true
    },
    fullWidth: {
        type: Boolean,
        default: false
    }
});

const currentTabIndex = ref<number | null>(0);

function onClickTab(index: number) {
    currentTabIndex.value = index;
}
</script>

<style lang="scss" scoped>
.tabs {
    display: flex;
    justify-content: center;
    gap: 1.2rem;
    border-bottom: 1px solid var(--surface-border);
    margin-top: -2rem;
    margin-left: -2rem;
    width: calc(100% + 4rem);
    padding: 0.4rem;
    padding-bottom: 0;
    box-shadow: var(--shadow-sm);

    > .tab {
        cursor: pointer;
        padding: 0.4rem 1.6rem;
        border-bottom: 0.4rem solid transparent;

        &.selected {
            border-color: var(--primary);
            color: var(--primary);
        }
    }
}

.tab-content {
    width: 100%;
}
</style>
