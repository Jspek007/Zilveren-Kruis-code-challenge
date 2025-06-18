<template>
    <BaseFormStep stepId="personal-info">
        <template #default="{ step }">
            <form @submit.prevent>
                <BaseFormField
                    v-for="field in step?.fields"
                    :key="field.id"
                    :id="field.id"
                    :label="field.label"
                    :type="field.type"
                    :value="personalInfo[field.id as keyof PersonalInfo]"
                    :required="field.required"
                    :options="field.options"
                    :validation="field.validation"
                    @update="
                        value =>
                            updatePersonalInfo(
                                field.id as keyof PersonalInfo,
                                value
                            )
                    "
                    @blur="() => emit('field-blur')"
                />
            </form>
        </template>
    </BaseFormStep>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useFormStore } from '@/stores/formStore';
import BaseFormStep from '@/components/form/base/BaseFormStep.vue';
import BaseFormField from '@/components/form/base/BaseFormField.vue';
import { PersonalInfo } from './steps.interface';

const emit = defineEmits(['field-blur']);

const store = useFormStore();
const personalInfo = computed(() => store.personalInfo);

const updatePersonalInfo = (field: keyof PersonalInfo, value: string) => {
    store.updatePersonalInfo({ [field]: value });
};
</script>

<style lang="scss" scoped>
section {
    padding: 1rem;
}

.form-field {
    margin-bottom: 1rem;
}

label {
    display: block;
    margin-bottom: 0.5rem;
    font-weight: 500;
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
}

.error-message {
    color: #dc3545;
    font-size: 0.875rem;
    margin-top: 0.25rem;
    display: block;
}
</style>
