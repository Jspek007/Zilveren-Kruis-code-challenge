<template>
    <BaseFormStep stepId="insurance">
        <template #default="{ step }">
            <form @submit.prevent>
                <div
                    v-for="section in step?.sections"
                    :key="section.id"
                    class="insurance-section"
                    role="group"
                    :aria-labelledby="`${section.id}-title`"
                    :aria-describedby="`${section.id}-description`"
                >
                    <h3 :id="`${section.id}-title`">{{ section.title }}</h3>
                    <p :id="`${section.id}-description`">
                        {{ section.description }}
                    </p>

                    <div
                        v-if="
                            !section.dependsOn ||
                            (section.dependsOn === 'base-insurance' &&
                                showOwnRisk)
                        "
                        :aria-hidden="
                            section.dependsOn === 'base-insurance' &&
                            !showOwnRisk
                        "
                    >
                        <BaseFormField
                            :id="section.id"
                            :label="section.title"
                            type="radio"
                            :value="insuranceOptions[getOptionKey(section.id)]"
                            :options="section.options"
                            :required="true"
                            :description="section.description"
                            @update="
                                value =>
                                    updateInsuranceOption(
                                        getOptionKey(section.id),
                                        value
                                    )
                            "
                        />
                    </div>
                </div>
            </form>
        </template>
    </BaseFormStep>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useFormStore } from '@/stores/formStore';
import BaseFormStep from '@/components/form/base/BaseFormStep.vue';
import BaseFormField from '@/components/form/base/BaseFormField.vue';
import { InsuranceOptions } from './steps.interface.d';

const store = useFormStore();
const insuranceOptions = computed(() => store.insuranceOptions);

const updateInsuranceOption = (
    sectionId: keyof InsuranceOptions,
    value: string
) => {
    store.updateInsuranceOptions({ [sectionId]: value });
};

const showOwnRisk = computed(() => {
    return insuranceOptions.value.baseInsurance === 'basis-zeker';
});

const getOptionKey = (sectionId: string): keyof InsuranceOptions => {
    const keyMap: Record<string, keyof InsuranceOptions> = {
        'base-insurance': 'baseInsurance',
        'payment-term': 'paymentTerm',
        'own-risk': 'ownRisk',
        'additional-insurance': 'additionalInsurance',
        'dental-insurance': 'dentalInsurance'
    };
    return keyMap[sectionId] || 'reason';
};
</script>

<style lang="scss" scoped>
.insurance-section {
    margin-bottom: 2rem;
    padding: 1rem;
    border: 1px solid #e0e0e0;
    border-radius: 8px;
    background-color: #fff;

    h3 {
        margin: 0 0 0.5rem;
        color: #333;
    }

    p {
        margin: 0 0 1rem;
        color: #666;
    }

    &:focus-within {
        border-color: #007bff;
        box-shadow: 0 0 0 2px rgb(0 123 255 / 25%);
    }
}
</style>
