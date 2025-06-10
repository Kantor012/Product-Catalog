import { defineStore } from 'pinia';
import apiClient from '@/services/api';
import { useUiStore } from './uiStore';
import {useAuthStore} from "@/store/authStore.ts";

export const useAdminStore = defineStore('admin', {
    state: () => ({
        users: [] as any[],
        loading: false,
    }),
    actions: {
        async fetchUsers() {
            this.loading = true;
            try {
                const { data } = await apiClient.get('/users');
                this.users = data;
            } catch (error) {
                console.error('Failed to fetch users', error);
            } finally {
                this.loading = false;
            }
        },
        async deleteUser(id: string) {
            const uiStore = useUiStore();
            const authStore = useAuthStore();

            if (id === authStore.user?._id) {
                uiStore.setNotification("You cannot delete your own account.", 'error');
                return;
            }

            const userToDelete = this.users.find(u => u._id === id);
            if (userToDelete && userToDelete.isAdmin) {
                const adminCount = this.users.filter(u => u.isAdmin).length;
                if (adminCount <= 1) {
                    uiStore.setNotification("Cannot delete the last remaining administrator.", 'error');
                    return;
                }
            }

            if (confirm('Are you sure you want to delete this user?')) {
                try {
                    await apiClient.delete(`/users/${id}`);
                    await this.fetchUsers();
                    uiStore.setNotification('User deleted', 'success');
                } catch (error: any) {
                    const message = error.response?.data?.message || 'Error while trying to delete user';
                    uiStore.setNotification(message, 'error');
                }
            }
        },
        async createUser(userData: any) {
            const uiStore = useUiStore();
            try {
                await apiClient.post('/users/admin', userData);
                uiStore.setNotification('User added succesfully', 'success');
                await this.fetchUsers();
            } catch (error: any) {
                uiStore.setNotification('Error encountered while trying to CREATE user', 'error');
            }
        },

        async updateUser(id: string, userData: any) {
            const uiStore = useUiStore();
            try {
                await apiClient.put(`/users/${id}`, userData);
                uiStore.setNotification('User successfully edited', 'success');
                await this.fetchUsers();
            } catch (error: any) {
                uiStore.setNotification('Error while editing user', 'error');
            }
        }
    }
});