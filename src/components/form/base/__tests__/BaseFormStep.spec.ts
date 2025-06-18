import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mount } from '@vue/test-utils';
import BaseFormStep from '../BaseFormStep.vue';
import { useContentStream } from '@/composables/useContentStream';
import { FormContent } from '../../steps/steps.interface';
import { ref } from 'vue';

vi.mock('@/composables/useContentStream', () => ({
    useContentStream: vi.fn()
}));

describe('BaseFormStep', () => {
    const mockStep = {
        id: 'test-step',
        title: 'Test Step',
        description: 'Test Description'
    };

    const mockContent: FormContent = {
        steps: [mockStep]
    };

    const mockUseContentStream = useContentStream as ReturnType<typeof vi.fn>;

    const mockStates = {
        loading: () => ({
            content: ref(null),
            loading: ref(true),
            error: ref(null)
        }),
        error: (message: string) => ({
            content: ref(null),
            loading: ref(false),
            error: ref(new Error(message))
        }),
        success: () => ({
            content: ref(mockContent),
            loading: ref(false),
            error: ref(null)
        })
    };

    beforeEach(() => {
        vi.clearAllMocks();
        mockUseContentStream.mockReturnValue(mockStates.success());
    });

    it('renders loading state correctly', () => {
        mockUseContentStream.mockReturnValue(mockStates.loading());

        const wrapper = mount(BaseFormStep, {
            props: {
                stepId: 'test-step'
            }
        });

        expect(wrapper.find('[role="status"]').exists()).toBe(true);
        expect(wrapper.text()).toContain('Loading...');
    });

    it('renders error state correctly', () => {
        const errorMessage = 'Failed to load content';
        mockUseContentStream.mockReturnValue(mockStates.error(errorMessage));

        const wrapper = mount(BaseFormStep, {
            props: {
                stepId: 'test-step'
            }
        });

        expect(wrapper.find('[role="alert"]').exists()).toBe(true);
        expect(wrapper.text()).toContain(errorMessage);
    });

    it('renders step content correctly when data is loaded', () => {
        const wrapper = mount(BaseFormStep, {
            props: {
                stepId: 'test-step'
            },
            slots: {
                default: '<div class="test-slot">Test Slot Content</div>'
            }
        });

        expect(wrapper.find('h2').text()).toBe('Test Step');
        expect(wrapper.find('p').text()).toBe('Test Description');
        expect(wrapper.find('.test-slot').exists()).toBe(true);
    });

    it('passes step data to slot', () => {
        const wrapper = mount(BaseFormStep, {
            props: {
                stepId: 'test-step'
            },
            slots: {
                default:
                    '<template #default="{ step }">{{ step.title }}</template>'
            }
        });

        expect(wrapper.text()).toContain('Test Step');
    });

    it('handles non-existent step gracefully', () => {
        const wrapper = mount(BaseFormStep, {
            props: {
                stepId: 'non-existent-step'
            }
        });

        expect(wrapper.find('h2').text()).toBe('');
        expect(wrapper.find('p').text()).toBe('');
    });
});
