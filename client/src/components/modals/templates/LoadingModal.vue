<template>
    <ModalFrame>
        <template v-slot:content>
            <div class="loader">
                <i class="fas fa-spinner fa-spin"></i>
            </div>
        </template>
    </ModalFrame>
</template>

<script setup lang="ts">
import ModalFrame from '@/components/modals/ModalFrame.vue';
</script>

<style scoped lang="scss">
.loader {
    display: flex;
    width: 100%;
    height: 100%;
    justify-content: center;
    align-items: center;
}

.loader > i {
    font-size: 1.6rem;
}
</style>
