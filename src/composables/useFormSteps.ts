import { computed } from 'vue';
import { useFormStore } from '@/stores/formStore';
import { useContentStream } from '@/composables/useContentStream';
import { FormContent } from '@/components/form/steps/steps.interface';
import StepReasonSelection from '@/components/form/steps/StepReasonSelection.vue';
import StepPersonalInfo from '@/components/form/steps/StepPersonalInfo.vue';
import StepReasonInsurance from '@/components/form/steps/StepReasonInsurance.vue';
import StepSummary from '@/components/form/steps/StepSummary.vue';
import router from '@/router';

export function useFormSteps() {
    const store = useFormStore();
    const { content, error, loading } = useContentStream<FormContent>(
        '/cms/form-content.json'
    );

    const currentStep = computed(() => store.currentStep);
    const isStepValid = computed(() => store.isCurrentStepValid);

    const steps = computed(() => {
        if (!content.value?.steps) return [];
        return content.value.steps;
    });

    const currentStepComponent = computed(() => {
        if (!content.value?.steps) return null;

        const stepId = content.value.steps[currentStep.value]?.id;
        switch (stepId) {
            case 'reason':
                return StepReasonSelection;
            case 'personal':
                return StepPersonalInfo;
            case 'insurance':
                return StepReasonInsurance;
            case 'summary':
                return StepSummary;
            default:
                return null;
        }
    });

    const canGoBack = computed(() => currentStep.value > 0);
    const canGoForward = computed(
        () => currentStep.value < steps.value.length - 1
    );

    const nextStep = () => {
        if (isStepValid.value) {
            store.nextStep();
        }
    };

    const previousStep = () => {
        store.previousStep();
    };

    const goToStep = (stepIndex: number) => {
        store.setStep(stepIndex);
    };

    const handleReset = () => {
        store.resetForm();
        router.push('/');
    };

    return {
        content,
        error,
        loading,
        currentStep,
        isStepValid,
        steps,
        currentStepComponent,
        canGoBack,
        canGoForward,
        nextStep,
        previousStep,
        goToStep,
        handleReset
    };
}
