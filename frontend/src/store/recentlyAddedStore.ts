import { defineStore } from 'pinia';
import apiClient from '@/services/api';
import { useUiStore } from '@/store/uiStore.ts';

export const useRecentlyAddedStore = defineStore('recentlyAdded', {
    state: () => ({
        items: [] as any[],
        loading: false,
    }),
    actions: {
        async fetchItems() {
            this.loading = true;
            try {
                const response = await apiClient.get('/recently-added');
                this.items = response.data;
            } catch (error) {
                console.error('Failed to fetch recently added items.', error);
                const uiStore = useUiStore();
                uiStore.setNotification('Failed to fetch recently added items.', 'error');
            } finally {
                this.loading = false;
            }
        }
    }
});