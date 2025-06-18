import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ref } from 'vue';
import { setActivePinia, createPinia } from 'pinia';
import { useFormSteps } from '../useFormSteps';
import { useFormStore } from '@/stores/formStore';
import { useContentStream } from '@/composables/useContentStream';
import { FormContent } from '@/components/form/steps/steps.interface.d';
import StepReasonSelection from '@/components/form/steps/StepReasonSelection.vue';
import StepPersonalInfo from '@/components/form/steps/StepPersonalInfo.vue';
import StepReasonInsurance from '@/components/form/steps/StepReasonInsurance.vue';
import StepSummary from '@/components/form/steps/StepSummary.vue';

vi.mock('@/composables/useContentStream');
const mockUseContentStream = vi.mocked(useContentStream);

vi.mock('@/components/form/steps/StepReasonSelection.vue', () => ({
    default: { name: 'StepReasonSelection' }
}));
vi.mock('@/components/form/steps/StepPersonalInfo.vue', () => ({
    default: { name: 'StepPersonalInfo' }
}));
vi.mock('@/components/form/steps/StepReasonInsurance.vue', () => ({
    default: { name: 'StepReasonInsurance' }
}));
vi.mock('@/components/form/steps/StepSummary.vue', () => ({
    default: { name: 'StepSummary' }
}));

describe('useFormSteps', () => {
    let mockContent: FormContent;
    let mockStore: ReturnType<typeof useFormStore>;

    beforeEach(() => {
        setActivePinia(createPinia());

        mockContent = {
            steps: [
                { id: 'reason', title: 'Reason', description: 'Select reason' },
                {
                    id: 'personal',
                    title: 'Personal',
                    description: 'Personal info'
                },
                {
                    id: 'insurance',
                    title: 'Insurance',
                    description: 'Insurance options'
                },
                { id: 'summary', title: 'Summary', description: 'Summary' }
            ]
        };

        mockUseContentStream.mockReturnValue({
            content: ref(mockContent),
            error: ref(null),
            loading: ref(false),
            refetch: vi.fn()
        });

        mockStore = useFormStore();
    });

    describe('computed properties', () => {
        describe('currentStep', () => {
            it('should return the current step from store', () => {
                mockStore.currentStep = 2;
                const { currentStep } = useFormSteps();
                expect(currentStep.value).toBe(2);
            });
        });

        describe('isStepValid', () => {
            it('should return step validity from store', () => {
                vi.spyOn(
                    mockStore,
                    'isCurrentStepValid',
                    'get'
                ).mockReturnValue(true);
                const { isStepValid } = useFormSteps();
                expect(isStepValid.value).toBe(true);
            });
        });

        describe('steps', () => {
            it('should return steps from content when available', () => {
                const { steps } = useFormSteps();
                expect(steps.value).toEqual(mockContent.steps);
            });

            it('should return empty array when content is not available', () => {
                mockUseContentStream.mockReturnValue({
                    content: ref(null),
                    error: ref(null),
                    loading: ref(false),
                    refetch: vi.fn()
                });
                const { steps } = useFormSteps();
                expect(steps.value).toEqual([]);
            });

            it('should return empty array when steps are not available', () => {
                mockUseContentStream.mockReturnValue({
                    content: ref({} as FormContent),
                    error: ref(null),
                    loading: ref(false),
                    refetch: vi.fn()
                });
                const { steps } = useFormSteps();
                expect(steps.value).toEqual([]);
            });
        });

        describe('currentStepComponent', () => {
            it('should return StepReasonSelection for reason step', () => {
                mockStore.currentStep = 0;
                const { currentStepComponent } = useFormSteps();
                expect(currentStepComponent.value).toBe(StepReasonSelection);
            });

            it('should return StepPersonalInfo for personal step', () => {
                mockStore.currentStep = 1;
                const { currentStepComponent } = useFormSteps();
                expect(currentStepComponent.value).toBe(StepPersonalInfo);
            });

            it('should return StepReasonInsurance for insurance step', () => {
                mockStore.currentStep = 2;
                const { currentStepComponent } = useFormSteps();
                expect(currentStepComponent.value).toBe(StepReasonInsurance);
            });

            it('should return StepSummary for summary step', () => {
                mockStore.currentStep = 3;
                const { currentStepComponent } = useFormSteps();
                expect(currentStepComponent.value).toBe(StepSummary);
            });

            it('should return null for unknown step id', () => {
                mockStore.currentStep = 1;
                mockContent.steps[1].id = 'unknown';
                const { currentStepComponent } = useFormSteps();
                expect(currentStepComponent.value).toBeNull();
            });

            it('should return null when content is not available', () => {
                mockUseContentStream.mockReturnValue({
                    content: ref(null),
                    error: ref(null),
                    loading: ref(false),
                    refetch: vi.fn()
                });
                const { currentStepComponent } = useFormSteps();
                expect(currentStepComponent.value).toBeNull();
            });

            it('should return null when steps are not available', () => {
                mockUseContentStream.mockReturnValue({
                    content: ref({} as FormContent),
                    error: ref(null),
                    loading: ref(false),
                    refetch: vi.fn()
                });
                const { currentStepComponent } = useFormSteps();
                expect(currentStepComponent.value).toBeNull();
            });
        });

        describe('canGoBack', () => {
            it('should return true when not on first step', () => {
                mockStore.currentStep = 2;
                const { canGoBack } = useFormSteps();
                expect(canGoBack.value).toBe(true);
            });

            it('should return false when on first step', () => {
                mockStore.currentStep = 0;
                const { canGoBack } = useFormSteps();
                expect(canGoBack.value).toBe(false);
            });
        });

        describe('canGoForward', () => {
            it('should return true when not on last step', () => {
                mockStore.currentStep = 1;
                const { canGoForward } = useFormSteps();
                expect(canGoForward.value).toBe(true);
            });

            it('should return false when on last step', () => {
                mockStore.currentStep = 3;
                const { canGoForward } = useFormSteps();
                expect(canGoForward.value).toBe(false);
            });

            it('should return false when steps are not available', () => {
                mockUseContentStream.mockReturnValue({
                    content: ref(null),
                    error: ref(null),
                    loading: ref(false),
                    refetch: vi.fn()
                });
                const { canGoForward } = useFormSteps();
                expect(canGoForward.value).toBe(false);
            });
        });
    });

    describe('methods', () => {
        describe('nextStep', () => {
            it('should call store.nextStep when current step is valid', () => {
                const spy = vi.spyOn(mockStore, 'nextStep');
                vi.spyOn(
                    mockStore,
                    'isCurrentStepValid',
                    'get'
                ).mockReturnValue(true);

                const { nextStep } = useFormSteps();
                nextStep();

                expect(spy).toHaveBeenCalledOnce();
            });

            it('should not call store.nextStep when current step is invalid', () => {
                const spy = vi.spyOn(mockStore, 'nextStep');
                vi.spyOn(
                    mockStore,
                    'isCurrentStepValid',
                    'get'
                ).mockReturnValue(false);

                const { nextStep } = useFormSteps();
                nextStep();

                expect(spy).not.toHaveBeenCalled();
            });
        });

        describe('previousStep', () => {
            it('should call store.previousStep', () => {
                const spy = vi.spyOn(mockStore, 'previousStep');

                const { previousStep } = useFormSteps();
                previousStep();

                expect(spy).toHaveBeenCalledOnce();
            });
        });

        describe('goToStep', () => {
            it('should call store.setStep with the provided step index', () => {
                const spy = vi.spyOn(mockStore, 'setStep');

                const { goToStep } = useFormSteps();
                goToStep(2);

                expect(spy).toHaveBeenCalledWith(2);
            });
        });
    });
});
