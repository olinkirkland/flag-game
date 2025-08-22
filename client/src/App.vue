<template>
    <div class="app-layout">
        <router-view />
        <TheModalContainer />
        <TheTooltipContainer />
    </div>
</template>

<script setup lang="ts">
import TheModalContainer from './components/modals/TheModalContainer.vue';
import TheTooltipContainer from './components/tooltips/TheTooltipContainer.vue';
</script>

<style lang="scss">
// Not scoped; global styles
@use 'assets/scss/reset.scss';
@use 'assets/scss/styles.scss';
@use 'assets/scss/variables.scss';

.app-layout {
    position: relative;
    height: 100vh;
    min-height: -webkit-fill-available;
    overflow: hidden;
    display: flex;
    flex-direction: column;
}

.page {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
}
</style>
