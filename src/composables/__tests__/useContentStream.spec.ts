import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { useContentStream } from '../useContentStream';
import { mount } from '@vue/test-utils';
import { defineComponent, nextTick } from 'vue';

const mockFetch = vi.fn();
global.fetch = mockFetch;

describe('useContentStream', () => {
    const mockContent = { test: 'data' };
    const contentPath = '/test/path.json';

    const TestComponent = defineComponent({
        setup() {
            const { content, loading, error, refetch } =
                useContentStream<typeof mockContent>(contentPath);
            return { content, loading, error, refetch };
        },
        template: '<div></div>'
    });

    beforeEach(() => {
        vi.useFakeTimers();
        vi.clearAllMocks();
        mockFetch.mockReset();
    });

    afterEach(() => {
        vi.useRealTimers();
    });

    it('starts in loading state', () => {
        const wrapper = mount(TestComponent);
        expect(wrapper.vm.loading).toBe(true);
        expect(wrapper.vm.content).toBe(null);
        expect(wrapper.vm.error).toBe(null);
    });

    it('fetches content successfully', async () => {
        mockFetch.mockResolvedValueOnce({
            ok: true,
            json: () => Promise.resolve(mockContent)
        });

        const wrapper = mount(TestComponent);
        await nextTick();
        await vi.runAllTimersAsync();

        expect(mockFetch).toHaveBeenCalledWith(contentPath);
        expect(wrapper.vm.loading).toBe(false);
        expect(wrapper.vm.content).toEqual(mockContent);
        expect(wrapper.vm.error).toBe(null);
    });

    it('handles fetch error', async () => {
        const errorMessage = 'Network error';
        mockFetch.mockRejectedValueOnce(new Error(errorMessage));

        const wrapper = mount(TestComponent);
        await nextTick();
        await vi.runAllTimersAsync();

        expect(mockFetch).toHaveBeenCalledWith(contentPath);
        expect(wrapper.vm.loading).toBe(false);
        expect(wrapper.vm.content).toBe(null);
        expect(wrapper.vm.error).toBeInstanceOf(Error);
        expect(wrapper.vm.error?.message).toBe(errorMessage);
    });

    it('handles non-ok response', async () => {
        mockFetch.mockResolvedValueOnce({
            ok: false,
            statusText: 'Not Found'
        });

        const wrapper = mount(TestComponent);
        await nextTick();
        await vi.runAllTimersAsync();

        expect(mockFetch).toHaveBeenCalledWith(contentPath);
        expect(wrapper.vm.loading).toBe(false);
        expect(wrapper.vm.content).toBe(null);
        expect(wrapper.vm.error).toBeInstanceOf(Error);
        expect(wrapper.vm.error?.message).toContain('Failed to fetch content');
    });

    it('handles unknown error types', async () => {
        mockFetch.mockRejectedValueOnce('Unknown error');

        const wrapper = mount(TestComponent);
        await nextTick();
        await vi.runAllTimersAsync();

        expect(wrapper.vm.loading).toBe(false);
        expect(wrapper.vm.content).toBe(null);
        expect(wrapper.vm.error).toBeInstanceOf(Error);
        expect(wrapper.vm.error?.message).toBe('Unknown error occurred');
    });
});
