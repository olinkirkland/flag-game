<template>
    <div class="modal-container" :class="{ active: !!currentModal }">
        <div class="modal-container__background" @click="onClickBackground()"></div>
        <Transition name="modal-transition" mode="out-in">
            <component :is="currentModal" v-bind="currentModalConfig" ref="modalRef" />
        </Transition>
    </div>
</template>

<script setup lang="ts">
import ModalController from '@/controllers/modal-controller';
import { ComponentOptions, ref, shallowRef } from 'vue';

const modalRef = ref();
const currentModal = shallowRef<ComponentOptions | null>(null);
const currentModalConfig = shallowRef<any | null>(null);
const fadeInterval = ref();
function onClickBackground() {
    if (currentModalConfig.value?.closeOnClick) ModalController.close();
}

const queue: { modal: any; modalConfig: any }[] = [];

ModalController.getInstance().addEventListener(({ modal, modalConfig }) => {
    // (document.activeElement as HTMLElement)?.blur();

    // If no modal was passed, close the current one
    if (!modal) {
        currentModal.value = null;
        if (!queue.length) return;

        // If there are modals in the queue, open the next one
        const { modal, modalConfig } = queue.shift()!;
        ModalController.open(modal, modalConfig);
        return;
    }

    // Open
    if (currentModal.value) {
        // If a matching modalConfig is already in the queue, don't add it again
        const queueIncludingCurrent = [...queue, { modal: currentModal.value, modalConfig: currentModalConfig.value }];

        const isModalAlreadyInQueue = queueIncludingCurrent.find(
            (queued) => JSON.stringify(queued.modalConfig) === JSON.stringify(modalConfig)
        );

        if (isModalAlreadyInQueue) return;

        // Add the modal to the queue
        // console.log('Queueing modal', JSON.stringify(modalConfig));
        queue.push({ modal, modalConfig });
        return;
    }

    if (modal) {
        // console.log('Opening modal', JSON.stringify(modalConfig));
        currentModal.value = { ...modal! } as any;
        currentModalConfig.value = { ...modalConfig };
    }

    // Wait for the modal to be mounted before fading in
    requestAnimationFrame(() => {
        if (fadeInterval.value) clearInterval(fadeInterval.value);
        const modalEl = modalRef.value?.$el;
        if (!modalEl) return;
        const modalHeaderChildren = modalEl.querySelector('.modal__header')
            ? [modalEl.querySelector('.modal__header')]
            : [];
        const modalContentChildren = Array.from<HTMLElement>(
            modalEl.querySelector('.modal__content > div')?.children || []
        );
        const modalChildren = [...modalHeaderChildren, ...modalContentChildren];
        // @ts-ignore
        window.modalChildren = modalChildren;
    });
});
</script>

<style scoped lang="scss">
.modal-container {
    width: 100%;

    height: 100vh; // Works everywhere, but buggy on mobile Safari (includes address bar)
    height: 100dvh; // Modern fix, uses the dynamic viewport height. Works properly with iOS Safari and all modern browsers
    min-height: -webkit-fill-available; // Fallback for iOS Safari

    -webkit-overflow-scrolling: touch;
    position: absolute;
    top: 0;

    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    z-index: 99;
    padding: 1rem;

    > .modal-container__background {
        width: 100%;
        height: 100%;
        position: absolute;
        top: 0;
        z-index: -1;
        background-color: rgba(0, 0, 0, 0.5);
        opacity: 1;
    }

    &:not(.active) {
        pointer-events: none;
        > .modal-container__background {
            opacity: 0;
        }
    }
}

.modal {
    max-height: calc(100dvh - 4rem);
}

// Media queries
@media (max-width: 768px) {
    .modal-container {
        padding: 0;
    }

    .modal {
        min-width: 100%;
        max-width: 100%;

        height: 100vh; // Works everywhere, but buggy on mobile Safari (includes address bar)
        height: 100dvh; // Modern fix, uses the dynamic viewport height. Works properly with iOS Safari and all modern browsers
        min-height: -webkit-fill-available; // Fallback for iOS Safari

        max-height: unset;
        animation: none;
        border-radius: 0;
    }

    // Transition (for mobile)
    .modal-transition-enter-active,
    .modal-transition-leave-active {
        transition: all 0.2s ease;
    }

    .modal-transition-enter-from,
    .modal-transition-leave-to {
        opacity: 0;
        transform: translateY(2rem);
    }

    .modal-transition-leave-active {
        position: absolute;
    }

    .modal-container__background {
        display: none;
    }
}
</style>
