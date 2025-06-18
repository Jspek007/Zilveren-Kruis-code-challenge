<template>
    <div
        class="multi-step-form"
        role="application"
        aria-label="Insurance Form"
    >
        <FormStepper
            :currentStep="currentStep"
            :steps="steps"
            @step-click="goToStep"
        />

        <div
            v-if="loading"
            role="status"
            aria-label="Loading form content"
        >
            Loading form content...
        </div>
        <div
            v-else-if="error"
            role="alert"
            aria-label="Error loading form content"
        >
            Error loading form content: {{ error.message }}
        </div>
        <template v-else>
            <component
                :is="currentStepComponent"
                :stepId="content?.steps[currentStep]?.id || ''"
                @field-blur="onFieldBlur"
            />

            <FormNavigation
                :canGoBack="canGoBack"
                :canGoForward="canGoForward"
                :isNextDisabled="!isStepValid"
                @next="nextStep"
                @previous="previousStep"
                @reset="handleReset"
            />

            <div
                v-if="!isStepValid && anyTouched"
                class="validation-error"
                role="alert"
            >
                Vul alle verplichte velden in om door te gaan.
            </div>
        </template>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import FormStepper from '@/components/form/FormStepper.vue';
import FormNavigation from '@/components/form/FormNavigation.vue';
import { useFormSteps } from '@/composables/useFormSteps';

const {
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
} = useFormSteps();

const anyTouched = ref(false);
const onFieldBlur = () => {
    anyTouched.value = true;
};
</script>

<style lang="scss" scoped>
.multi-step-form {
    max-width: 800px;
    margin: 0 auto;
    padding: 1rem;
}

.validation-error {
    margin-top: 1rem;
    padding: 0.75rem;
    background-color: #fff3f3;
    border: 1px solid #dc3545;
    border-radius: 4px;
    color: #dc3545;
    font-size: 0.875rem;
}
</style>
