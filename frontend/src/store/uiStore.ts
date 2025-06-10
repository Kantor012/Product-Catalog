import { defineStore } from 'pinia';

interface Notification {
    message: string;
    type: 'success' | 'error';
}

export const useUiStore = defineStore('ui', {
    state: () => ({
        isLoading: false,
        notification: null as Notification | null,
    }),
    actions: {
        setLoading(status: boolean) {
            this.isLoading = status;
        },
        setNotification(message: string, type: 'success' | 'error' = 'success') {
            this.notification = { message, type };
            setTimeout(() => {
                this.notification = null; // 5s
            }, 5000);
        },
    }
});