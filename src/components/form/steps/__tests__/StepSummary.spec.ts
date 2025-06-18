import { describe, it, expect, beforeEach, vi } from 'vitest';
import { mount, VueWrapper } from '@vue/test-utils';
import StepSummary from '@/components/form/steps/StepSummary.vue';
import { nextTick } from 'vue';

vi.mock('@/stores/formStore', () => ({
    useFormStore: () => ({
        personalInfo: {
            firstName: 'John',
            infix: 'van',
            lastName: 'Doe',
            gender: 'male',
            dateOfBirth: '1990-01-01',
            personalId: '123456789'
        },
        insuranceOptions: {
            baseInsurance: 'basis-zeker',
            ownRisk: '385',
            paymentTerm: 'monthly',
            additionalInsurance: 'extended',
            dentalInsurance: 'basic'
        }
    })
}));

vi.mock('@/composables/usePremiumCalculation', () => ({
    usePremiumCalculation: () => ({
        formatCurrency: (val: number) => `€ ${val.toFixed(2)}`,
        calculation: {
            basePremium: 110,
            ownRiskDiscount: 10,
            additionalPremium: 20,
            dentalPremium: 15,
            getPremiumForTerm: () => 135
        }
    })
}));

describe('SummaryStep.vue', () => {
    let wrapper: VueWrapper<unknown>;

    beforeEach(async () => {
        wrapper = mount(StepSummary, {
            global: {
                stubs: {
                    BaseFormStep: {
                        template: `<div><slot :step="step" /></div>`,
                        props: ['stepId'],
                        data() {
                            return {
                                step: {
                                    sections: [
                                        {
                                            id: 'chosen-package',
                                            title: 'Gekozen pakket'
                                        },
                                        {
                                            id: 'premium-overview',
                                            title: 'Premie overzicht'
                                        },
                                        {
                                            id: 'personal-details',
                                            title: 'Persoonlijke gegevens'
                                        }
                                    ]
                                }
                            };
                        }
                    }
                }
            }
        });
        await nextTick();
    });

    it('renders all summary sections', () => {
        const html = wrapper.html();
        expect(html).toContain('Basisverzekering');
        expect(html).toContain('Eigen risico');
        expect(html).toContain('Aanvullende verzekering');
        expect(html).toContain('Tandartsverzekering');
        expect(html).toContain('Totaalpremie');
        expect(html).toContain('Naam');
    });

    it('formats currency values correctly', () => {
        expect(wrapper.html()).toContain('€ 110.00');
        expect(wrapper.html()).toContain('-€ 10.00');
        expect(wrapper.html()).toContain('€ 20.00');
        expect(wrapper.html()).toContain('€ 15.00');
        expect(wrapper.html()).toContain('€ 135.00');
    });

    it('shows translated labels correctly', () => {
        expect(wrapper.html()).toContain('Basis Zeker');
        expect(wrapper.html()).toContain('Maandelijks');
        expect(wrapper.html()).toContain('Uitgebreid');
        expect(wrapper.html()).toContain('Basis');
        expect(wrapper.html()).toContain('John van Doe');
        expect(wrapper.html()).toContain('Man');
    });
});
