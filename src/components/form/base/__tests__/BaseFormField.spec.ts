import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import BaseFormField from '../BaseFormField.vue';

describe('BaseFormField', () => {
    const defaultProps = {
        id: 'test-field',
        label: 'Test Label',
        type: 'text' as const,
        value: ''
    };

    describe('Basic rendering', () => {
        it('renders with required props', () => {
            const wrapper = mount(BaseFormField, {
                props: defaultProps
            });

            expect(wrapper.find('label').text()).toContain('Test Label');
            expect(wrapper.find('input').exists()).toBe(true);
            expect(wrapper.find('input').attributes('id')).toBe('test-field');
        });

        it('shows required indicator when required is true', () => {
            const wrapper = mount(BaseFormField, {
                props: {
                    ...defaultProps,
                    required: true
                }
            });

            expect(wrapper.find('.required-indicator').exists()).toBe(true);
            expect(wrapper.find('.required-indicator').text()).toBe('*');
        });

        it('does not show required indicator when required is false', () => {
            const wrapper = mount(BaseFormField, {
                props: {
                    ...defaultProps,
                    required: false
                }
            });

            expect(wrapper.find('.required-indicator').exists()).toBe(false);
        });

        it('shows description when provided', () => {
            const wrapper = mount(BaseFormField, {
                props: {
                    ...defaultProps,
                    description: 'This is a description'
                }
            });

            expect(wrapper.find('.field-description').exists()).toBe(true);
            expect(wrapper.find('.field-description').text()).toBe(
                'This is a description'
            );
        });
    });

    describe('Text input', () => {
        it('renders text input correctly', () => {
            const wrapper = mount(BaseFormField, {
                props: {
                    ...defaultProps,
                    type: 'text',
                    value: 'test value'
                }
            });

            const input = wrapper.find('input');
            expect(input.attributes('type')).toBe('text');
            expect(input.element.value).toBe('test value');
        });

        it('emits update event on input', async () => {
            const wrapper = mount(BaseFormField, {
                props: {
                    ...defaultProps,
                    type: 'text',
                    value: ''
                }
            });

            const input = wrapper.find('input');
            await input.setValue('new value');

            expect(wrapper.emitted('update')).toBeTruthy();
            expect(wrapper.emitted('update')?.[0]).toEqual(['new value']);
        });
    });

    describe('Date input', () => {
        it('renders date input correctly', () => {
            const wrapper = mount(BaseFormField, {
                props: {
                    ...defaultProps,
                    type: 'date',
                    value: '2023-01-01'
                }
            });

            const input = wrapper.find('input');
            expect(input.attributes('type')).toBe('date');
            expect(input.element.value).toBe('2023-01-01');
        });
    });

    describe('Select input', () => {
        const selectProps = {
            ...defaultProps,
            type: 'select' as const,
            options: [
                { id: '1', value: 'option1', label: 'Option 1' },
                { id: '2', value: 'option2', label: 'Option 2' }
            ]
        };

        it('renders select input correctly', () => {
            const wrapper = mount(BaseFormField, {
                props: {
                    ...selectProps,
                    value: 'option1'
                }
            });

            const select = wrapper.find('select');
            expect(select.exists()).toBe(true);
            expect(select.element.value).toBe('option1');
            expect(wrapper.findAll('option')).toHaveLength(3);
        });

        it('emits update event on select change', async () => {
            const wrapper = mount(BaseFormField, {
                props: {
                    ...selectProps,
                    value: ''
                }
            });

            const select = wrapper.find('select');
            await select.setValue('option2');

            expect(wrapper.emitted('update')).toBeTruthy();
            expect(wrapper.emitted('update')?.[0]).toEqual(['option2']);
        });

        it('renders all options correctly', () => {
            const wrapper = mount(BaseFormField, {
                props: selectProps
            });

            const options = wrapper.findAll('option');
            expect(options[0].text()).toBe('Selecteer...');
            expect(options[1].text()).toBe('Option 1');
            expect(options[2].text()).toBe('Option 2');
        });
    });

    describe('Radio input', () => {
        const radioProps = {
            ...defaultProps,
            type: 'radio' as const,
            options: [
                { id: '1', value: 'option1', label: 'Option 1' },
                { id: '2', value: 'option2', label: 'Option 2' }
            ]
        };

        it('renders radio inputs correctly', () => {
            const wrapper = mount(BaseFormField, {
                props: {
                    ...radioProps,
                    value: 'option1'
                }
            });

            const radioInputs = wrapper.findAll('input[type="radio"]');
            expect(radioInputs).toHaveLength(2);
            expect((radioInputs[0].element as HTMLInputElement).checked).toBe(
                true
            );
            expect((radioInputs[1].element as HTMLInputElement).checked).toBe(
                false
            );
        });

        it('emits update event on radio change', async () => {
            const wrapper = mount(BaseFormField, {
                props: {
                    ...radioProps,
                    value: 'option1'
                }
            });

            const radioInputs = wrapper.findAll('input[type="radio"]');
            await radioInputs[1].setValue('option2');

            expect(wrapper.emitted('update')).toBeTruthy();
            expect(wrapper.emitted('update')?.[0]).toEqual(['option2']);
        });

        it('applies selected class to chosen option', () => {
            const wrapper = mount(BaseFormField, {
                props: {
                    ...radioProps,
                    value: 'option2'
                }
            });

            const optionCards = wrapper.findAll('.option-card');
            expect(optionCards[0].classes()).not.toContain('selected');
            expect(optionCards[1].classes()).toContain('selected');
        });

        it('renders option labels correctly', () => {
            const wrapper = mount(BaseFormField, {
                props: radioProps
            });

            const optionLabels = wrapper.findAll('.option-label');
            expect(optionLabels[0].text()).toBe('Option 1');
            expect(optionLabels[1].text()).toBe('Option 2');
        });
    });

    describe('Validation', () => {
        it('shows error message when validation fails', () => {
            const wrapper = mount(BaseFormField, {
                props: {
                    ...defaultProps,
                    type: 'text',
                    value: 'invalid',
                    validation: {
                        pattern: '^[A-Z]+$',
                        errorMessage: 'Only uppercase letters allowed'
                    }
                }
            });

            expect(wrapper.find('.error-message').exists()).toBe(true);
            expect(wrapper.find('.error-message').text()).toBe(
                'Only uppercase letters allowed'
            );
        });

        it('does not show error message when validation passes', () => {
            const wrapper = mount(BaseFormField, {
                props: {
                    ...defaultProps,
                    type: 'text',
                    value: 'VALID',
                    validation: {
                        pattern: '^[A-Z]+$',
                        errorMessage: 'Only uppercase letters allowed'
                    }
                }
            });

            expect(wrapper.find('.error-message').exists()).toBe(false);
        });

        it('does not show error message when no validation pattern is provided', () => {
            const wrapper = mount(BaseFormField, {
                props: {
                    ...defaultProps,
                    type: 'text',
                    value: 'any value',
                    validation: {
                        errorMessage: 'Error message'
                    }
                }
            });

            expect(wrapper.find('.error-message').exists()).toBe(false);
        });

        it('does not show error message when value is empty', () => {
            const wrapper = mount(BaseFormField, {
                props: {
                    ...defaultProps,
                    type: 'text',
                    value: '',
                    validation: {
                        pattern: '^[A-Z]+$',
                        errorMessage: 'Only uppercase letters allowed'
                    }
                }
            });

            expect(wrapper.find('.error-message').exists()).toBe(false);
        });

        it('sets aria-invalid attribute when validation fails', () => {
            const wrapper = mount(BaseFormField, {
                props: {
                    ...defaultProps,
                    type: 'text',
                    value: 'invalid',
                    validation: {
                        pattern: '^[A-Z]+$',
                        errorMessage: 'Only uppercase letters allowed'
                    }
                }
            });

            expect(wrapper.find('input').attributes('aria-invalid')).toBe(
                'true'
            );
        });

        it('sets aria-invalid attribute to false when validation passes', () => {
            const wrapper = mount(BaseFormField, {
                props: {
                    ...defaultProps,
                    type: 'text',
                    value: 'VALID',
                    validation: {
                        pattern: '^[A-Z]+$',
                        errorMessage: 'Only uppercase letters allowed'
                    }
                }
            });

            expect(wrapper.find('input').attributes('aria-invalid')).toBe(
                'false'
            );
        });
    });

    describe('Accessibility', () => {
        it('sets aria-required attribute when required is true', () => {
            const wrapper = mount(BaseFormField, {
                props: {
                    ...defaultProps,
                    required: true
                }
            });

            expect(wrapper.find('input').attributes('aria-required')).toBe(
                'true'
            );
        });

        it('sets aria-required attribute when required is false', () => {
            const wrapper = mount(BaseFormField, {
                props: {
                    ...defaultProps,
                    required: false
                }
            });

            expect(wrapper.find('input').attributes('aria-required')).toBe(
                'false'
            );
        });

        it('sets aria-describedby with description and error IDs', () => {
            const wrapper = mount(BaseFormField, {
                props: {
                    ...defaultProps,
                    description: 'Description',
                    validation: {
                        pattern: '^[A-Z]+$',
                        errorMessage: 'Error'
                    },
                    value: 'invalid'
                }
            });

            const describedBy = wrapper
                .find('input')
                .attributes('aria-describedby');
            expect(describedBy).toContain('test-field-description');
            expect(describedBy).toContain('test-field-error');
        });

        it('sets aria-describedby with only description ID when no error', () => {
            const wrapper = mount(BaseFormField, {
                props: {
                    ...defaultProps,
                    description: 'Description'
                }
            });

            const describedBy = wrapper
                .find('input')
                .attributes('aria-describedby');
            expect(describedBy).toContain('test-field-description');
            expect(describedBy).not.toContain('test-field-error');
        });

        it('sets aria-describedby with only error ID when no description', () => {
            const wrapper = mount(BaseFormField, {
                props: {
                    ...defaultProps,
                    validation: {
                        pattern: '^[A-Z]+$',
                        errorMessage: 'Error'
                    },
                    value: 'invalid'
                }
            });

            const describedBy = wrapper
                .find('input')
                .attributes('aria-describedby');
            expect(describedBy).not.toContain('test-field-description');
            expect(describedBy).toContain('test-field-error');
        });

        it('sets correct role and aria attributes for radio group', () => {
            const wrapper = mount(BaseFormField, {
                props: {
                    ...defaultProps,
                    type: 'radio',
                    options: [{ id: '1', value: 'option1', label: 'Option 1' }]
                }
            });

            const radioGroup = wrapper.find('.options-grid');
            expect(radioGroup.attributes('role')).toBe('radiogroup');
            expect(radioGroup.attributes('aria-labelledby')).toBe('test-field');
        });
    });

    describe('Edge cases', () => {
        it('handles empty options array for select', () => {
            const wrapper = mount(BaseFormField, {
                props: {
                    ...defaultProps,
                    type: 'select',
                    options: []
                }
            });

            expect(wrapper.find('select').exists()).toBe(true);
            expect(wrapper.findAll('option')).toHaveLength(1);
        });

        it('handles empty options array for radio', () => {
            const wrapper = mount(BaseFormField, {
                props: {
                    ...defaultProps,
                    type: 'radio',
                    options: []
                }
            });

            expect(wrapper.find('.options-grid').exists()).toBe(true);
            expect(wrapper.findAll('input[type="radio"]')).toHaveLength(0);
        });

        it('handles undefined value gracefully', () => {
            const wrapper = mount(BaseFormField, {
                props: {
                    ...defaultProps,
                    value: undefined as unknown as string
                }
            });

            expect(wrapper.find('input').exists()).toBe(true);
        });
    });
});
