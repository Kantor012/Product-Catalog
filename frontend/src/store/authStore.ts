import { defineStore } from 'pinia';
import apiClient from '@/services/api';
import router from '@/router';
import { useUiStore } from "@/store/uiStore.ts";

interface User {
    _id: string;
    name: string;
    email: string;
    isAdmin: boolean;
}

export const useAuthStore = defineStore('auth', {
    state: () => ({
        user: JSON.parse(localStorage.getItem('user') || 'null') as User | null,
        token: localStorage.getItem('token') || null as string | null,
        error: null as string | null,
        loading: false,
    }),
    getters: {
        isAuthenticated: (state) => !!state.token,
        isAdmin: (state) => state.user?.isAdmin || false,
    },
    actions: {
        async login(credentials: any) {
            this.loading = true;
            this.error = null;
            try {
                const response = await apiClient.post('/users/login', credentials);
                const { token, ...userData } = response.data;
                this.token = token;
                this.user = userData;
                localStorage.setItem('token', token);
                localStorage.setItem('user', JSON.stringify(userData));
                const uiStore = useUiStore();
                uiStore.setNotification('Login successful!', 'success');
                await router.push('/');
            } catch (err: any) {
                this.error = err.response?.data?.message || 'Failed to login.';
                const uiStore = useUiStore();
                uiStore.setNotification(this.error || 'Failed to login.', 'error');
            } finally {
                this.loading = false;
            }
        },
        async register(userInfo: any) {
            this.loading = true;
            this.error = null;
            try {
                await apiClient.post('/users/register', userInfo);
                await router.push({ name: 'login', query: { registered: 'true' } });
                const uiStore = useUiStore();
                uiStore.setNotification('Register successful! Activation link has been sent to your email.', 'success');
            } catch (err: any) {
                this.error = err.response?.data?.message || 'Failed to register.';
                const uiStore = useUiStore();
                uiStore.setNotification(this.error || 'Failed to register.', 'error');
            } finally {
                this.loading = false;
            }
        },
        async verifyEmail(token: string) {
            this.loading = true;
            this.error = null;
            try {
                await apiClient.get(`/users/verify/${token}`);
                this.loading = false;
                return true;
            } catch (err: any) {
                this.error = err.response?.data?.message || 'Verification failed.';
                this.loading = false;
                return false;
            }
        },
        logout() {
            this.user = null;
            this.token = null;
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            router.push('/login').then(() => {
                const uiStore = useUiStore();
                uiStore.setNotification('Successful logout!', 'success');
            });
        },
        async updateUserProfile(userData: any) {
            const uiStore = useUiStore();
            try {
                uiStore.setLoading(true);
                const { data } = await apiClient.put('/users/profile', userData);
                this.user = data;
                localStorage.setItem('user', JSON.stringify(data));
                uiStore.setNotification('Your profile has been modified!', 'success');
            } catch (error: any) {
                uiStore.setNotification(error.response?.data?.message || 'Error while editing profile', 'error');
            } finally {
                uiStore.setLoading(false);
            }
        }
    },
});