<template>
    <ModalFrame :class="props.mode && `modal-style--${props.mode}`">
        <template v-slot:header>
            <ModalHeader>
                <h2>{{ props.title }}</h2>
            </ModalHeader>
        </template>
        <template v-slot:content>
            <div class="info">
                <div class="info__content" v-html="props.message"></div>
                <div class="choices">
                    <Button class="btn" @click="ModalController.close()">
                        <span>{{ props.confirmText || t('Modals.Confirm.Controls.confirm') }}</span>
                    </Button>
                </div>
            </div>
        </template>
    </ModalFrame>
</template>

<script setup lang="ts">
import ModalFrame from '@/components/modals/ModalFrame.vue';
import ModalHeader from '@/components/modals/ModalHeader.vue';
import ModalController from '@/controllers/modal-controller';
import { t } from '@/i18n/locale';

const props = defineProps<{
    title: string;
    message: string;
    confirmText?: string;
    mode?: string;
}>();
</script>

<style scoped lang="scss">
.info {
    display: flex;
    max-width: 32rem;
    flex-direction: column;
    gap: 1.6rem;
    justify-content: space-between;
    height: 100%;

    > .info__content {
        display: flex;
        flex-direction: column;
        gap: 1.2rem;
    }
}

.choices {
    display: flex;
    gap: 1rem;
    justify-content: flex-end;
}

.modal-style--danger :deep(.modal__header) {
    background-color: var(--danger-light);
}

.modal-style--success :deep(.modal__header) {
    background-color: var(--primary-light);
}

@media (max-width: 768px) {
    .choices {
        flex-direction: column;
    }
}
</style>
