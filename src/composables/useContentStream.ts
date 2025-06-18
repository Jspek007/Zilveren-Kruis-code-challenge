import { ref, onMounted } from 'vue';

export function useContentStream<T>(contentPath: string) {
    const content = ref<T | null>(null);
    const error = ref<Error | null>(null);
    const loading = ref(true);

    const fetchContent = async () => {
        try {
            const response = await fetch(contentPath);
            if (!response.ok) {
                throw new Error(
                    `Failed to fetch content: ${response.statusText}`
                );
            }
            content.value = await response.json();
        } catch (e) {
            error.value =
                e instanceof Error ? e : new Error('Unknown error occurred');
        } finally {
            loading.value = false;
        }
    };

    onMounted(fetchContent);

    return {
        content,
        error,
        loading,
        refetch: fetchContent
    };
}
