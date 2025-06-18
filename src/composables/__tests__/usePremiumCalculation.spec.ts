import { describe, it, expect, beforeEach } from 'vitest';
import { usePremiumCalculation } from '../usePremiumCalculation';
import { useFormStore } from '@/stores/formStore';
import { setActivePinia, createPinia } from 'pinia';

interface InsuranceOptions {
    baseInsurance: string;
    ownRisk: string;
    additionalInsurance: string;
    dentalInsurance: string;
    paymentTerm: string;
}

vi.mock('@/stores/formStore', () => ({
    useFormStore: vi.fn()
}));

describe('usePremiumCalculation', () => {
    beforeEach(() => {
        setActivePinia(createPinia());
    });

    it('calculates premiums correctly for basis-zeker with own risk', () => {
        (useFormStore as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
            insuranceOptions: {
                baseInsurance: 'basis-zeker',
                ownRisk: '358',
                additionalInsurance: 'none',
                dentalInsurance: 'none',
                paymentTerm: 'monthly'
            } as InsuranceOptions
        });

        const { calculation } = usePremiumCalculation();

        expect(calculation.value.basePremium).toBe(100);
        expect(calculation.value.ownRiskDiscount).toBe(10);
        expect(calculation.value.additionalPremium).toBe(0);
        expect(calculation.value.dentalPremium).toBe(0);
        expect(calculation.value.totalPremium).toBe(90);
        expect(calculation.value.monthlyPremium).toBe(90);
        expect(calculation.value.quarterlyPremium).toBe(270);
        expect(calculation.value.yearlyPremium).toBe(1080);
        expect(calculation.value.getPremiumForTerm()).toBe(90);
    });

    it('calculates premiums correctly for basis-plus without own risk', () => {
        (useFormStore as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
            insuranceOptions: {
                baseInsurance: 'basis-plus',
                ownRisk: '358',
                additionalInsurance: 'basic',
                dentalInsurance: 'basic',
                paymentTerm: 'quarterly'
            } as InsuranceOptions
        });

        const { calculation } = usePremiumCalculation();

        expect(calculation.value.basePremium).toBe(120);
        expect(calculation.value.ownRiskDiscount).toBe(0);
        expect(calculation.value.additionalPremium).toBe(15);
        expect(calculation.value.dentalPremium).toBe(10);
        expect(calculation.value.totalPremium).toBe(145);
        expect(calculation.value.monthlyPremium).toBe(145);
        expect(calculation.value.quarterlyPremium).toBe(435);
        expect(calculation.value.yearlyPremium).toBe(1740);
        expect(calculation.value.getPremiumForTerm()).toBe(435);
    });

    it('calculates premiums correctly for basis-compleet with all options', () => {
        (useFormStore as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
            insuranceOptions: {
                baseInsurance: 'basis-compleet',
                ownRisk: '358',
                additionalInsurance: 'complete',
                dentalInsurance: 'extended',
                paymentTerm: 'monthly'
            }
        });

        const { calculation } = usePremiumCalculation();

        expect(calculation.value.basePremium).toBe(150);
        expect(calculation.value.ownRiskDiscount).toBe(0);
        expect(calculation.value.additionalPremium).toBe(35);
        expect(calculation.value.dentalPremium).toBe(20);
        expect(calculation.value.totalPremium).toBe(205);
        expect(calculation.value.monthlyPremium).toBe(205);
        expect(calculation.value.quarterlyPremium).toBe(615);
        expect(calculation.value.yearlyPremium).toBe(2460);
        expect(calculation.value.getPremiumForTerm()).toBe(205);
    });

    it('handles different payment terms correctly', () => {
        const basePremium = 100;

        (useFormStore as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
            insuranceOptions: {
                baseInsurance: 'basis-zeker',
                ownRisk: 'none',
                additionalInsurance: 'none',
                dentalInsurance: 'none',
                paymentTerm: 'monthly'
            }
        });
        const { calculation: monthlyCalc } = usePremiumCalculation();
        expect(monthlyCalc.value.getPremiumForTerm()).toBe(basePremium);

        (useFormStore as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
            insuranceOptions: {
                baseInsurance: 'basis-zeker',
                ownRisk: 'none',
                additionalInsurance: 'none',
                dentalInsurance: 'none',
                paymentTerm: 'quarterly'
            }
        });
        const { calculation: quarterlyCalc } = usePremiumCalculation();
        expect(quarterlyCalc.value.getPremiumForTerm()).toBe(basePremium * 3);

        (useFormStore as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
            insuranceOptions: {
                baseInsurance: 'basis-zeker',
                ownRisk: 'none',
                additionalInsurance: 'none',
                dentalInsurance: 'none',
                paymentTerm: 'yearly'
            }
        });
        const { calculation: yearlyCalc } = usePremiumCalculation();
        expect(yearlyCalc.value.getPremiumForTerm()).toBe(basePremium * 12);

        (useFormStore as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
            insuranceOptions: {
                baseInsurance: 'basis-zeker',
                ownRisk: 'none',
                additionalInsurance: 'none',
                dentalInsurance: 'none',
                paymentTerm: 'invalid-term'
            }
        });
        const { calculation: defaultCalc } = usePremiumCalculation();
        expect(defaultCalc.value.getPremiumForTerm()).toBe(basePremium);
    });

    it('formats currency correctly', () => {
        const { formatCurrency } = usePremiumCalculation();
        const formattedAmount = formatCurrency(100);

        expect(formattedAmount.replace(/\s+/g, ' ').trim()).toBe('€ 100,00');
    });

    it('handles invalid insurance options gracefully', () => {
        (useFormStore as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
            insuranceOptions: {
                baseInsurance: 'invalid',
                ownRisk: 'invalid',
                additionalInsurance: 'invalid',
                dentalInsurance: 'invalid',
                paymentTerm: 'invalid'
            } as InsuranceOptions
        });

        const { calculation } = usePremiumCalculation();

        expect(calculation.value.basePremium).toBe(0);
        expect(calculation.value.ownRiskDiscount).toBe(0);
        expect(calculation.value.additionalPremium).toBe(0);
        expect(calculation.value.dentalPremium).toBe(0);
        expect(calculation.value.totalPremium).toBe(0);
        expect(calculation.value.getPremiumForTerm()).toBe(0);
    });
});
