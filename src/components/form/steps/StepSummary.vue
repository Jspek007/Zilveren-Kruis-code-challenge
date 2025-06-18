<template>
    <BaseFormStep stepId="summary">
        <template #default="{ step }">
            <div class="summary-container">
                <div
                    v-for="section in step?.sections"
                    :key="section.id"
                    class="summary-section"
                >
                    <h3>{{ section.title }}</h3>

                    <div
                        v-if="section.id === 'chosen-package'"
                        class="summary-content"
                    >
                        <div class="summary-row">
                            <span class="label">Basisverzekering:</span>
                            <span class="value">{{
                                getBaseInsuranceLabel(
                                    insuranceOptions.baseInsurance
                                )
                            }}</span>
                        </div>
                        <div
                            v-if="
                                insuranceOptions.baseInsurance === 'basis-zeker'
                            "
                            class="summary-row"
                        >
                            <span class="label">Eigen risico:</span>
                            <span class="value">{{
                                getOwnRiskLabel(insuranceOptions.ownRisk)
                            }}</span>
                        </div>
                        <div class="summary-row">
                            <span class="label">Betalingsperiode:</span>
                            <span class="value">{{
                                insuranceOptions.paymentTerm === 'monthly'
                                    ? 'Maandelijks'
                                    : insuranceOptions.paymentTerm ===
                                        'quarterly'
                                      ? 'Per kwartaal'
                                      : 'Jaarlijks'
                            }}</span>
                        </div>
                        <div class="summary-row">
                            <span class="label">Aanvullende verzekering:</span>
                            <span class="value">{{
                                getAdditionalInsuranceLabel(
                                    insuranceOptions.additionalInsurance
                                )
                            }}</span>
                        </div>
                        <div class="summary-row">
                            <span class="label">Tandartsverzekering:</span>
                            <span class="value">{{
                                getDentalInsuranceLabel(
                                    insuranceOptions.dentalInsurance
                                )
                            }}</span>
                        </div>
                    </div>

                    <div
                        v-if="section.id === 'premium-overview'"
                        class="summary-content"
                    >
                        <div class="summary-row">
                            <span class="label">Basispremie:</span>
                            <span class="value">{{
                                formatCurrency(calculation.basePremium)
                            }}</span>
                        </div>
                        <div
                            v-if="calculation.ownRiskDiscount > 0"
                            class="summary-row discount"
                        >
                            <span class="label">Korting eigen risico:</span>
                            <span class="value"
                                >-{{
                                    formatCurrency(calculation.ownRiskDiscount)
                                }}</span
                            >
                        </div>
                        <div
                            v-if="calculation.additionalPremium > 0"
                            class="summary-row"
                        >
                            <span class="label">Aanvullende verzekering:</span>
                            <span class="value">{{
                                formatCurrency(calculation.additionalPremium)
                            }}</span>
                        </div>
                        <div
                            v-if="calculation.dentalPremium > 0"
                            class="summary-row"
                        >
                            <span class="label">Tandartsverzekering:</span>
                            <span class="value">{{
                                formatCurrency(calculation.dentalPremium)
                            }}</span>
                        </div>
                        <div class="summary-row total">
                            <span class="label">Totaalpremie:</span>
                            <span class="value"
                                >{{
                                    formatCurrency(
                                        calculation.getPremiumForTerm()
                                    )
                                }}
                                {{
                                    getPaymentTermLabel(
                                        insuranceOptions.paymentTerm
                                    )
                                }}</span
                            >
                        </div>
                    </div>

                    <div
                        v-if="section.id === 'personal-details'"
                        class="summary-content"
                    >
                        <div class="summary-row">
                            <span class="label">Naam:</span>
                            <span class="value"
                                >{{ personalInfo.firstName }}
                                {{ personalInfo.infix }}
                                {{ personalInfo.lastName }}</span
                            >
                        </div>
                        <div class="summary-row">
                            <span class="label">Geslacht:</span>
                            <span class="value">{{
                                personalInfo.gender === 'male'
                                    ? 'Man'
                                    : personalInfo.gender === 'female'
                                      ? 'Vrouw'
                                      : 'Anders'
                            }}</span>
                        </div>
                        <div class="summary-row">
                            <span class="label">Geboortedatum:</span>
                            <span class="value">{{
                                personalInfo.dateOfBirth
                            }}</span>
                        </div>
                        <div class="summary-row">
                            <span class="label">BSN:</span>
                            <span class="value">{{
                                personalInfo.personalId
                            }}</span>
                        </div>
                    </div>
                </div>
            </div>
        </template>
    </BaseFormStep>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useFormStore } from '@/stores/formStore';
import BaseFormStep from '@/components/form/base/BaseFormStep.vue';
import { usePremiumCalculation } from '@/composables/usePremiumCalculation';

const store = useFormStore();
const { calculation, formatCurrency } = usePremiumCalculation();

const personalInfo = computed(() => store.personalInfo);
const insuranceOptions = computed(() => store.insuranceOptions);

const getPaymentTermLabel = (term: string): string => {
    switch (term) {
        case 'monthly':
            return 'per maand';
        case 'quarterly':
            return 'per kwartaal';
        case 'yearly':
            return 'per jaar';
        default:
            return '';
    }
};

const getBaseInsuranceLabel = (type: string): string => {
    const labels: Record<string, string> = {
        'basis-zeker': 'Basis Zeker',
        'basis-plus': 'Basis Plus',
        'basis-compleet': 'Basis Compleet'
    };
    return labels[type] || type;
};

const getOwnRiskLabel = (amount: string): string => {
    return `€ ${amount}`;
};

const getAdditionalInsuranceLabel = (type: string): string => {
    const labels: Record<string, string> = {
        none: 'Geen',
        basic: 'Basis',
        extended: 'Uitgebreid',
        complete: 'Compleet'
    };
    return labels[type] || type;
};

const getDentalInsuranceLabel = (type: string): string => {
    const labels: Record<string, string> = {
        none: 'Geen',
        basic: 'Basis',
        extended: 'Uitgebreid'
    };
    return labels[type] || type;
};
</script>

<style lang="scss" scoped>
.summary-container {
    display: flex;
    flex-direction: column;
    gap: 2rem;
}

.summary-section {
    h3 {
        margin: 0 0 1rem;
        color: #333;
    }
}

.summary-content {
    background-color: #f8f9fa;
    border-radius: 8px;
    padding: 1.5rem;
}

.summary-row {
    display: flex;
    justify-content: space-between;
    padding: 0.5rem 0;
    border-bottom: 1px solid #e9ecef;

    &:last-child {
        border-bottom: none;
    }

    &.total {
        margin-top: 1rem;
        padding-top: 1rem;
        border-top: 2px solid #dee2e6;
        font-weight: bold;
        font-size: 1.1em;
    }

    &.discount {
        color: #28a745;
    }

    .label {
        color: #495057;
    }

    .value {
        color: #212529;
        font-weight: 500;
    }
}
</style>
