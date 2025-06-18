<template>
    <main
        role="main"
        aria-live="polite"
    >
        <div
            v-if="loading"
            role="status"
            aria-label="Loading form content"
        >
            Loading...
        </div>
        <div
            v-else-if="error"
            role="alert"
            aria-label="Error loading form content"
        >
            Error: {{ error.message }}
        </div>
        <template v-else>
            <header>
                <h2 id="step-title">{{ currentStep?.title }}</h2>
                <p id="step-description">{{ currentStep?.description }}</p>
            </header>
            <section
                aria-labelledby="step-title"
                aria-describedby="step-description"
            >
                <slot :step="currentStep"></slot>
            </section>
        </template>
    </main>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useContentStream } from '@/composables/useContentStream';
import { FormContent } from '../steps/steps.interface';

const props = defineProps<{
    stepId: string;
}>();

const { content, loading, error } = useContentStream<FormContent>(
    '/cms/form-content.json'
);

const currentStep = computed(() => {
    return content.value?.steps?.find(step => step.id === props.stepId);
});
</script>

<style lang="scss" scoped>
main {
    padding: 1rem;
}

header {
    margin-bottom: 1.5rem;
}

h2 {
    margin: 0 0 0.5rem;
    color: #333;
}

p {
    margin: 0;
    color: #666;
}
</style>
