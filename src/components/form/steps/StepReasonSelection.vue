<template>
    <BaseFormStep stepId="reason">
        <template #default="{ step }">
            <form @submit.prevent>
                <BaseFormField
                    id="reason"
                    label="Reason"
                    type="select"
                    :value="reason"
                    :options="step?.options"
                    @update="updateReason"
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

const store = useFormStore();
const reason = computed(() => store.insuranceOptions.reason);

const updateReason = (value: string) => {
    store.updateInsuranceOptions({ reason: value });
};
</script>

<style lang="scss" scoped>
section {
    padding: 1rem;
}

select {
    width: 100%;
    padding: 0.5rem;
    margin-top: 0.5rem;
    border: 1px solid #ccc;
    border-radius: 4px;
}
</style>
