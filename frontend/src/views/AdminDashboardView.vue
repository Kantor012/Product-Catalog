<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useProductStore } from '@/store/productStore';
import ProductForm from '@/components/admin/ProductForm.vue';

const productStore = useProductStore();
const editingProduct = ref(null);

onMounted(() => {
    productStore.fetchProducts();
});

const handleFormSubmitted = (productData: any) => {
    if (editingProduct.value) {
        productStore.updateProduct(editingProduct.value._id, productData);
    } else {
        productStore.createProduct(productData);
    }
    editingProduct.value = null;
};

const startEditing = (product: any) => {
    editingProduct.value = product;
};
</script>

<template>
    <div class="admin-dashboard container">
        <h1>Admin Panel</h1>

        <nav class="admin-nav">
            <router-link to="/admin">Managing Products</router-link>
            <router-link to="/admin/users">Managing Users</router-link>
        </nav>

        <div class="admin-content">
            <router-view></router-view>
        </div>
    </div>
</template>

<style scoped>
.admin-dashboard h1 {
    border-bottom: 2px solid var(--border-color);
    padding-bottom: 1rem;
    text-align: center;
    width: 85%;
}

.admin-nav {
    display: flex;
    justify-content: center;
    gap: 1rem;
    border-bottom: 1px solid var(--border-color);
    margin-bottom: 2rem;
}

.admin-nav a {
    padding: 1rem 1.5rem;
    color: var(--text-color);
    text-decoration: none;
    font-weight: 500;
    border-bottom: 3px solid transparent;
    transition: color 0.2s, border-color 0.2s;
}

.admin-nav a:hover {
    color: var(--primary-color);
}

.admin-nav a.router-link-exact-active {
    color: var(--primary-color);
    border-bottom-color: var(--primary-color);
}

.admin-content {
    background-color: var(--card-bg);
    padding: 2rem;
    border-radius: 8px;
    box-shadow: 0 4px 15px rgba(0,0,0,0.05);
    width: 100%
;

}
</style>