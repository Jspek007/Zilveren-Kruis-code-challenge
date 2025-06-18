import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import FormNavigation from '../../FormNavigation.vue';

describe('FormNavigation.vue', () => {
    it('renders only "Volgende" button when canGoForward is true and canGoBack is false', () => {
        const wrapper = mount(FormNavigation, {
            props: {
                canGoBack: false,
                canGoForward: true,
                isNextDisabled: false
            }
        });

        expect(wrapper.find('button.nav-button--back').exists()).toBe(false);
        const nextButton = wrapper.find('button.nav-button--next');
        expect(nextButton.exists()).toBe(true);
        expect(nextButton.attributes('disabled')).toBeUndefined();
    });

    it('renders both buttons when canGoBack and canGoForward are true', () => {
        const wrapper = mount(FormNavigation, {
            props: {
                canGoBack: true,
                canGoForward: true,
                isNextDisabled: false
            }
        });

        expect(wrapper.find('button.nav-button--back').exists()).toBe(true);
        expect(wrapper.find('button.nav-button--next').exists()).toBe(true);
    });

    it('disables "Volgende" button when isNextDisabled is true', () => {
        const wrapper = mount(FormNavigation, {
            props: {
                canGoBack: true,
                canGoForward: true,
                isNextDisabled: true
            }
        });

        const nextButton = wrapper.find('button.nav-button--next');
        expect(nextButton.attributes('disabled')).toBeDefined();
        expect(nextButton.attributes('aria-disabled')).toBe('true');
    });

    it('emits "previous" when clicking "Vorige" button', async () => {
        const wrapper = mount(FormNavigation, {
            props: {
                canGoBack: true,
                canGoForward: false
            }
        });

        await wrapper.find('button.nav-button--back').trigger('click');
        expect(wrapper.emitted('previous')).toBeTruthy();
        expect(wrapper.emitted('previous')?.length).toBe(1);
    });

    it('emits "next" when clicking "Volgende" button', async () => {
        const wrapper = mount(FormNavigation, {
            props: {
                canGoBack: false,
                canGoForward: true,
                isNextDisabled: false
            }
        });

        await wrapper.find('button.nav-button--next').trigger('click');
        expect(wrapper.emitted('next')).toBeTruthy();
        expect(wrapper.emitted('next')?.length).toBe(1);
    });

    it('does not emit "next" when disabled', async () => {
        const wrapper = mount(FormNavigation, {
            props: {
                canGoBack: false,
                canGoForward: true,
                isNextDisabled: true
            }
        });

        const nextButton = wrapper.find('button.nav-button--next');
        await nextButton.trigger('click');
        expect(wrapper.emitted('next')).toBeFalsy();
    });
});
