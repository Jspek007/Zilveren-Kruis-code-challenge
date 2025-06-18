import { defineStore } from 'pinia';
import {
    PersonalInfo,
    InsuranceOptions
} from '@/components/form/steps/steps.interface.d';

interface FormState {
    currentStep: number;
    personalInfo: PersonalInfo;
    insuranceOptions: InsuranceOptions;
}

export const useFormStore = defineStore('form', {
    state: (): FormState => ({
        currentStep: 0,
        personalInfo: {
            firstName: '',
            infix: '',
            lastName: '',
            gender: '',
            dateOfBirth: '',
            personalId: ''
        },
        insuranceOptions: {
            reason: '',
            baseInsurance: '',
            paymentTerm: '',
            ownRisk: '',
            additionalInsurance: '',
            dentalInsurance: ''
        }
    }),
    getters: {
        isCurrentStepValid(): boolean {
            switch (this.currentStep) {
                case 0:
                    return !!this.insuranceOptions.reason;
                case 1:
                    return !!(
                        this.personalInfo.firstName &&
                        this.personalInfo.lastName &&
                        this.personalInfo.gender &&
                        this.personalInfo.dateOfBirth &&
                        this.personalInfo.personalId
                    );
                case 2:
                    return !!(
                        this.insuranceOptions.baseInsurance &&
                        this.insuranceOptions.paymentTerm &&
                        (this.insuranceOptions.baseInsurance !==
                            'basis-zeker' ||
                            this.insuranceOptions.ownRisk)
                    );
                case 3:
                    return true;
                default:
                    return false;
            }
        }
    },
    actions: {
        nextStep() {
            if (this.isCurrentStepValid) {
                this.currentStep++;
            }
        },
        previousStep() {
            this.currentStep--;
        },
        setStep(step: number) {
            if (step <= this.currentStep || this.isCurrentStepValid) {
                this.currentStep = step;
            }
        },
        updatePersonalInfo(info: Partial<PersonalInfo>) {
            this.personalInfo = { ...this.personalInfo, ...info };
        },
        updateInsuranceOptions(options: Partial<InsuranceOptions>) {
            this.insuranceOptions = { ...this.insuranceOptions, ...options };
        },
        resetForm() {
            this.currentStep = 0;
            this.personalInfo = {
                firstName: '',
                infix: '',
                lastName: '',
                gender: '',
                dateOfBirth: '',
                personalId: ''
            };
            this.insuranceOptions = {
                reason: '',
                baseInsurance: '',
                paymentTerm: '',
                ownRisk: '',
                additionalInsurance: '',
                dentalInsurance: ''
            };
        }
    },
    persist: true
});
