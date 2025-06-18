<template>
    <div class="container">
        <div class="row">
            <div class="col-12">
                <img
                    src="https://www.zilverenkruis.nl/assets/zilverenkruis/img/logo/logo_zilverenkruis.svg"
                    alt="Zilveren Kruis raad en daad logo"
                />
                <MultiStepForm class="container" />
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import MultiStepForm from '@/components/form/MultiStepForm.vue';
</script>

<style>
.container {
    max-width: 800px;
    margin: 0 auto;
    padding: 2rem 1rem;
}
</style>
