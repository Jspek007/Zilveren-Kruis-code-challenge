import { computed } from 'vue';
import { useFormStore } from '@/stores/formStore';

interface PremiumCalculation {
    basePremium: number;
    ownRiskDiscount: number;
    additionalPremium: number;
    dentalPremium: number;
    totalPremium: number;
    monthlyPremium: number;
    quarterlyPremium: number;
    yearlyPremium: number;
    getPremiumForTerm: () => number;
}

const BASE_PREMIUMS = {
    'basis-zeker': 100,
    'basis-plus': 120,
    'basis-compleet': 150
};

const OWN_RISK_DISCOUNTS = {
    '358': 10,
    '885': 20
};

const ADDITIONAL_PREMIUMS = {
    none: 0,
    basic: 15,
    extended: 25,
    complete: 35
};

const DENTAL_PREMIUMS = {
    none: 0,
    basic: 10,
    extended: 20
};

export function usePremiumCalculation() {
    const store = useFormStore();

    const calculation = computed<PremiumCalculation>(() => {
        const {
            baseInsurance,
            ownRisk,
            additionalInsurance,
            dentalInsurance,
            paymentTerm
        } = store.insuranceOptions;

        const basePremium =
            BASE_PREMIUMS[baseInsurance as keyof typeof BASE_PREMIUMS] || 0;

        const ownRiskDiscount =
            baseInsurance === 'basis-zeker'
                ? OWN_RISK_DISCOUNTS[
                      ownRisk as keyof typeof OWN_RISK_DISCOUNTS
                  ] || 0
                : 0;

        const additionalPremium =
            ADDITIONAL_PREMIUMS[
                additionalInsurance as keyof typeof ADDITIONAL_PREMIUMS
            ] || 0;

        const dentalPremium =
            DENTAL_PREMIUMS[dentalInsurance as keyof typeof DENTAL_PREMIUMS] ||
            0;

        const totalPremium =
            basePremium - ownRiskDiscount + additionalPremium + dentalPremium;

        const monthlyPremium = totalPremium;
        const quarterlyPremium = monthlyPremium * 3;
        const yearlyPremium = totalPremium * 12;

        const getPremiumForTerm = () => {
            switch (paymentTerm) {
                case 'monthly':
                    return monthlyPremium;
                case 'quarterly':
                    return quarterlyPremium;
                case 'yearly':
                    return yearlyPremium;
                default:
                    return monthlyPremium;
            }
        };

        return {
            basePremium,
            ownRiskDiscount,
            additionalPremium,
            dentalPremium,
            totalPremium,
            monthlyPremium,
            quarterlyPremium,
            yearlyPremium,
            getPremiumForTerm
        };
    });

    const formatCurrency = (amount: number): string => {
        return new Intl.NumberFormat('nl-NL', {
            style: 'currency',
            currency: 'EUR',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }).format(amount);
    };

    return {
        calculation,
        formatCurrency
    };
}
