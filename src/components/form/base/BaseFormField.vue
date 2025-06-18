<template>
    <div class="form-field">
        <label :for="id">
            {{ label }}
            <span
                v-if="required"
                class="required-indicator"
                aria-hidden="true"
                >*</span
            >
        </label>

        <p
            v-if="description"
            :id="descriptionId"
            class="field-description"
        >
            {{ description }}
        </p>

        <input
            v-if="type === 'text' || type === 'date'"
            :id="id"
            :type="type"
            :value="value"
            @input="handleInput"
            @blur="handleBlur"
            :required="required"
            :aria-required="required"
            :aria-invalid="!isValid"
            :aria-describedby="`${description ? descriptionId : ''} ${!isValid ? errorId : ''}`"
        />

        <select
            v-else-if="type === 'select'"
            :id="id"
            :value="value"
            @change="handleInput"
            @blur="handleBlur"
            :required="required"
            :aria-required="required"
            :aria-invalid="!isValid"
            :aria-describedby="`${description ? descriptionId : ''} ${!isValid ? errorId : ''}`"
        >
            <option value="">Selecteer...</option>
            <option
                v-for="option in options"
                :key="option.id"
                :value="option.value"
            >
                {{ option.label }}
            </option>
        </select>

        <div
            v-else-if="type === 'radio'"
            class="options-grid"
            role="radiogroup"
            :aria-labelledby="id"
            :aria-describedby="description ? descriptionId : undefined"
            :aria-required="required"
        >
            <div
                v-for="option in options"
                :key="option.id"
                class="option-wrapper"
            >
                <input
                    type="radio"
                    :id="`${id}-${option.id}`"
                    :name="id"
                    :value="option.value"
                    :checked="value === option.value"
                    @change="handleInput"
                    @blur="handleBlur"
                    :required="required"
                    :aria-required="required"
                    class="radio-input"
                />
                <label
                    :for="`${id}-${option.id}`"
                    class="option-card"
                    :class="{ selected: value === option.value }"
                >
                    <span class="option-label">{{ option.label }}</span>
                </label>
            </div>
        </div>

        <span
            v-if="validation && !isValid"
            :id="errorId"
            class="error-message"
            role="alert"
        >
            {{ validation.errorMessage }}
        </span>
    </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';

interface Option {
    id: string;
    value: string;
    label: string;
}

interface Validation {
    pattern?: string;
    errorMessage: string;
}

interface Props {
    id: string;
    label: string;
    type: 'text' | 'date' | 'select' | 'radio';
    value: string;
    required?: boolean;
    options?: Option[];
    validation?: Validation;
    description?: string;
}

const props = defineProps<Props>();
const emit = defineEmits<{
    (e: 'update', value: string): void;
    (e: 'blur'): void;
}>();

const touched = ref(false);

const handleInput = (event: Event) => {
    const value = (event.target as HTMLInputElement | HTMLSelectElement).value;
    emit('update', value);
};

const handleBlur = () => {
    touched.value = true;
    emit('blur');
};

const isValid = computed(() => {
    if (!props.validation?.pattern || !props.value) return true;
    return new RegExp(props.validation.pattern).test(props.value);
});

const errorId = computed(() => `${props.id}-error`);
const descriptionId = computed(() => `${props.id}-description`);
</script>

<style lang="scss" scoped>
.form-field {
    margin-bottom: 1rem;
}

label {
    display: block;
    margin-bottom: 0.5rem;
    font-weight: 500;
}

.required-indicator {
    color: #dc3545;
    margin-left: 0.25rem;
}

.field-description {
    margin: 0 0 0.5rem;
    color: #666;
    font-size: 0.875rem;
}

input,
select {
    width: 100%;
    padding: 0.5rem;
    border: 1px solid #ccc;
    border-radius: 4px;

    &:focus {
        outline: none;
        border-color: #007bff;
    }

    &[aria-invalid='true'] {
        border-color: #dc3545;
    }
}

.error-message {
    color: #dc3545;
    font-size: 0.875rem;
    margin-top: 0.25rem;
    display: block;
}

.options-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 1rem;
}

.option-card {
    position: relative;
    display: flex;
    align-items: center;
    padding: 1rem;
    border: 2px solid #e0e0e0;
    border-radius: 4px;
    cursor: pointer;
    transition: all 0.2s ease;

    &:hover {
        border-color: #007bff;
    }

    .option-label {
        font-weight: 500;
    }
}

.option-wrapper {
    position: relative;
}

.radio-input {
    position: absolute;
    opacity: 0;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border: 0;

    &:focus + .option-card {
        outline: 2px solid #007bff;
        outline-offset: 2px;
    }

    &:checked + .option-card {
        border-color: #007bff;
        background-color: #f0f7ff;
    }
}
</style>
