<template>
    <div class="form-navigation">
        <div class="form-navigation-left">
            <button
                type="button"
                class="nav-button nav-button--reset"
                @click="$emit('reset')"
            >
                Clear Pinia Store
            </button>
            <button
                v-if="canGoBack"
                type="button"
                class="nav-button nav-button--back"
                @click="$emit('previous')"
            >
                Vorige
            </button>
        </div>
        <div class="form-navigation-right">
            <button
                v-if="canGoForward"
                type="button"
                class="nav-button nav-button--next"
                :disabled="isNextDisabled"
                :aria-disabled="isNextDisabled"
                @click="$emit('next')"
            >
                Volgende
            </button>
        </div>
    </div>
</template>

<script setup lang="ts">
defineProps<{
    canGoBack: boolean;
    canGoForward: boolean;
    isNextDisabled?: boolean;
}>();

defineEmits<{
    (e: 'next'): void;
    (e: 'previous'): void;
    (e: 'reset'): void;
}>();
</script>

<style lang="scss" scoped>
.form-navigation {
    display: flex;
    justify-content: space-between;
    margin-top: 2rem;
    padding-top: 1rem;
    border-top: 1px solid #e0e0e0;
}

.form-navigation-left,
.form-navigation-right {
    flex: 1;
}

.form-navigation-right {
    display: flex;
    justify-content: flex-end;
}

.nav-button {
    padding: 0.75rem 1.5rem;
    border: none;
    border-radius: 4px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s ease;

    &:disabled {
        background-color: #ccc;
        cursor: not-allowed;
        opacity: 0.7;
    }

    &--back {
        background-color: #f8f9fa;
        color: #495057;

        &:hover:not(:disabled) {
            background-color: #e9ecef;
        }
    }

    &--next {
        background-color: #007bff;
        color: white;

        &:hover:not(:disabled) {
            background-color: #0056b3;
        }
    }

    &--reset {
        background-color: #dc3545;
        color: white;
        margin-right: 0.5rem;

        &:hover:not(:disabled) {
            background-color: #b52a37;
        }
    }
}
</style>
