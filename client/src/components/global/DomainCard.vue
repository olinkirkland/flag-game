<template>
    <Card :class="{ empty: !domain.name }">
        <h3>{{ domain.name }}</h3>
        <p class="domain-type">{{ t(`Step.Channel-divinity.Domains.${primary ? 'major' : 'minor'}`) }}</p>
        <p v-if="!domain.name" class="no-domain">
            {{ t('Step.Channel-divinity.Domains.empty') }}
        </p>
        <div class="domain__content" v-if="domain.name">
            <p v-if="domain.description">
                <em>{{ domain.description }}</em>
            </p>
            <p
                v-if="domain.tenets"
                v-html="t(`Step.Channel-divinity.Domains.tenets-phrase`, { tenets: domain.tenets })"
            ></p>
            <p
                v-if="domain.magic"
                v-html="t(`Step.Channel-divinity.Domains.magic-phrase`, { magic: domain.magic })"
            ></p>
        </div>
        <div class="controls">
            <Button @click="onClickRoll">
                <i class="fas fa-random"></i>
                <span>{{ t('roll') }}</span>
            </Button>
            <Button @click="onClickEdit">
                <i class="fas fa-edit"></i>
                <span>{{ t('edit') }}</span>
            </Button>
        </div>
    </Card>
</template>

<script setup lang="ts">
import domainsData from '@/assets/data/domains.json';
import EditDomainModal from '@/components/modals/templates/EditDomainModal.vue';
import ModalController from '@/controllers/modal-controller';
import { t } from '@/i18n/locale';
import { Domain } from '@/types/types';
import { capitalizeFirstLetter } from '@/utils/string-util';

const props = defineProps({
    primary: Boolean,
    domain: {
        type: Object as () => Domain,
        required: true
    }
});

function onClickRoll() {
    // Set this domain to a random one
    const randomIndex = Math.floor(Math.random() * domainsData.length);
    const randomDomainKey = capitalizeFirstLetter(domainsData[randomIndex]);
    props.domain.name = t(`Step.Channel-divinity.${randomDomainKey}.name`);
    props.domain.description = t(`Step.Channel-divinity.${randomDomainKey}.description`);
    props.domain.tenets = t(`Step.Channel-divinity.${randomDomainKey}.tenets`);
    props.domain.magic = t(`Step.Channel-divinity.${randomDomainKey}.magic`);
}

function onClickEdit() {
    ModalController.open(EditDomainModal, {
        modelValue: props.domain
    });
}
</script>

<style scoped lang="scss">
.domain-type {
    width: 100%;
    color: var(--surface-alt);
    font-size: 1.4rem;
    font-style: italic;
}

.controls {
    width: 100%;
    display: flex;
    justify-content: center;
    padding-top: 0.8rem;
    margin-top: auto;
    gap: 1rem;
}

.card {
    gap: 0;
    > p.domain-type {
        margin-top: -0.4rem;
        margin-bottom: 0.8rem;
    }
    .domain__content {
        display: flex;
        flex-direction: column;
        gap: 0.4rem;
    }
}

.empty {
    align-items: center;
    justify-content: center;
    > p.domain-type {
        display: none;
    }

    .controls {
        margin-top: unset;
    }
}

.no-domain {
    width: 100%;
    text-align: center;
    font-style: italic;
    color: var(--surface-alt);
}
</style>
