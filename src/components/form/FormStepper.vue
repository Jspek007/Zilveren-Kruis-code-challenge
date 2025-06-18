<template>
    <nav aria-label="Form Progress">
        <ol class="stepper-list">
            <li
                v-for="(step, index) in steps"
                :key="step.id"
                class="stepper-item"
                :class="{ 'stepper-item-clickable': index < currentStep }"
                :aria-current="index === currentStep ? 'step' : undefined"
                @click="handleStepClick(index)"
            >
                <span
                    class="stepper-circle"
                    :class="{
                        'stepper-circle-active': index === currentStep,
                        'stepper-circle-completed': index < currentStep
                    }"
                >
                    {{ index + 1 }}
                </span>
                <span
                    class="stepper-label"
                    :class="{ 'stepper-label-active': index === currentStep }"
                >
                    {{ step.title }}
                </span>
            </li>
        </ol>
    </nav>
</template>

<script setup lang="ts">
import { Step } from './steps/steps.interface';

const props = defineProps<{
    currentStep: number;
    steps: Step[];
}>();

const emit = defineEmits<{
    (e: 'step-click', index: number): void;
}>();

const handleStepClick = (index: number) => {
    if (index < props.currentStep) {
        emit('step-click', index);
    }
};

defineExpose({
    name: 'FormStepper'
});
</script>

<style lang="scss" scoped>
.stepper-list {
    display: flex;
    list-style: none;
    padding: 0;
    margin: 0;
}

.stepper-item {
    display: flex;
    align-items: center;
    flex: 1;
    cursor: default;
}

.stepper-circle {
    width: 2rem;
    height: 2rem;
    border-radius: 50%;
    background: #e9ecef;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-right: 0.5rem;
    transition: all 0.2s ease;

    &-active {
        background: #007bff;
        color: white;
    }

    &-completed {
        background: #28a745;
        color: white;
    }
}

.stepper-label {
    color: #6c757d;
    transition: color 0.2s ease;

    &-active {
        color: #007bff;
        font-weight: bold;
    }
}

.stepper-item-clickable {
    cursor: pointer;

    &:hover {
        .stepper-circle {
            background: #e3f2fd;
        }

        .stepper-label {
            color: #007bff;
        }
    }
}
</style>
