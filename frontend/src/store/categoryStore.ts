import { defineStore } from 'pinia';
import apiClient from '@/services/api';
import {useUiStore} from "@/store/uiStore.ts";


export const useCategoryStore = defineStore('categories', {
    state: () => ({
        categories: [] as { _id: string, name: string }[],
        loading: false,
    }),
    actions: {
        async fetchCategories() {
            this.loading = true;
            try {
                const response = await apiClient.get('/categories');
                this.categories = response.data;
            } catch (error) {
                console.error('Failed to fetch categories.', error);
                const uiStore = useUiStore();
                uiStore.setNotification('Failed to fetch categories.', 'error');
            } finally {
                this.loading = false;
            }
        }
    }
});