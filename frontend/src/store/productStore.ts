import { defineStore } from 'pinia';
import apiClient from '@/services/api';
import { useUiStore } from "@/store/uiStore";

interface Category {
    _id: string;
    name: string;
}

interface Product {
    _id: string;
    name: string;
    price: number;
    description: string;
    imageUrl: string;
    category: string;
    category_details?: Category;
    details: any;
    isPromotional: boolean;
    reviews: any[];
    rating: number;
    numReviews: number;
    createdAt: string;
}

export const useProductStore = defineStore('products', {
    state: () => ({
        products: [] as Product[],
        promotionalProducts: [] as Product[],
        product: null as Product | null,
        loading: false,
        error: null as string | null,
        viewMode: 'grid' as 'grid' | 'list',
    }),
    actions: {
        async fetchProducts(filters: any = {}) {
            this.loading = true;
            this.error = null;
            try {
                const cleanFilters = Object.fromEntries(Object.entries(filters).filter(([_, v]) => v != null && v !== ''));
                // @ts-ignore
                const params = new URLSearchParams(cleanFilters).toString();
                const response = await apiClient.get(`/products?${params}`);
                this.products = response.data;
            } catch (err: any) {
                this.error = 'Failed to fetch products.';
                const uiStore = useUiStore();
                uiStore.setNotification(this.error, 'error');
            } finally {
                this.loading = false;
            }
        },
        async fetchPromotionalProducts() {
            this.loading = true;
            try {
                const { data } = await apiClient.get('/products/promotional');
                this.promotionalProducts = data;
            } catch (error) {
                const uiStore = useUiStore();
                uiStore.setNotification('Failed to fetch promotional products.', 'error');
                console.error('Failed to fetch promotional products.', error);
            } finally {
                this.loading = false;
            }
        },
        async fetchProductById(id: string) {
            this.loading = true;
            this.error = null;
            try {
                const response = await apiClient.get(`/products/${id}`);
                this.product = response.data;
            } catch (err: any) {
                this.error = 'Failed to fetch product details.';
                this.product = null;
                const uiStore = useUiStore();
                uiStore.setNotification(this.error, 'error');
            } finally {
                this.loading = false;
            }
        },
        async addReview(productId: string, review: any) {
            try {
                await apiClient.post(`/products/${productId}/reviews`, review);
                await this.fetchProductById(productId);
                const uiStore = useUiStore();
                uiStore.setNotification('Review successfully added!', 'success');
            } catch (err: any) {
                console.error('Failed to add review', err);
                const uiStore = useUiStore();
                uiStore.setNotification('Failed to add review', 'error');
            }
        },
        async createProduct(productData: any) {
            try {
                await apiClient.post('/products', productData);
                await this.fetchProducts();
                const uiStore = useUiStore();
                uiStore.setNotification('Product successfully added!', 'success');
            } catch (error: any) {
                this.error = error.response?.data?.message || 'Failed to create product.';
                console.error(this.error);
                const uiStore = useUiStore();
                uiStore.setNotification(this.error || 'Failed to create product.', 'error');
            }
        },
        async updateProduct(id: string, productData: any) {
            try {
                await apiClient.put(`/products/${id}`, productData);
                await this.fetchProducts();
                const uiStore = useUiStore();
                uiStore.setNotification('Product successfully edited!', 'success');
            } catch (error: any) {
                this.error = error.response?.data?.message || 'Failed to update product.';
                console.error(this.error);
                const uiStore = useUiStore();
                uiStore.setNotification(this.error || 'Failed to update product.', 'error');
            }
        },
        async deleteProduct(id: string) {
            if (confirm('Are you sure you want to delete this product?')) {
                try {
                    await apiClient.delete(`/products/${id}`);
                    this.products = this.products.filter(p => p._id !== id);
                    const uiStore = useUiStore();
                    uiStore.setNotification('Product successfully deleted', 'success');
                } catch (error: any) {
                    this.error = error.response?.data?.message || 'Failed to delete product.';
                    const uiStore = useUiStore();
                    uiStore.setNotification(this.error || 'Failed to delete product.', 'error');
                    console.error(this.error);
                }
            }
        },
        setViewMode(mode: 'grid' | 'list') {
            this.viewMode = mode;
        },
    }
});