/// <reference types="vitest" />
import vue from '@vitejs/plugin-vue';
import { defineConfig } from 'vite';
import { coverageConfigDefaults } from 'vitest/config';
import { resolve } from 'path';

// https://vite.dev/config/
export default defineConfig({
    plugins: [vue()],
    resolve: {
        alias: {
            '@': resolve(__dirname, './src')
        }
    },
    test: {
        globals: true,
        environment: 'happy-dom',
        coverage: {
            enabled: true,
            include: ['src/**'],
            exclude: ['src/*.*', ...coverageConfigDefaults.exclude]
        }
    }
});
