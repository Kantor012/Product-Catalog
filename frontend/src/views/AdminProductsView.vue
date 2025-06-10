<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useProductStore } from '@/store/productStore';
import ProductForm from '@/components/admin/ProductForm.vue';
import LoadingSpinner from '@/components/common/LoadingSpinner.vue';

const productStore = useProductStore();

const activeTab = ref<'list' | 'form'>('list');

const productToEdit = ref<any | null>(null);

onMounted(() => {
    productStore.fetchProducts();
});

const startEditing = (product: any) => {
    productToEdit.value = product;
    activeTab.value = 'form';
};
const startCreating = () => {
    productToEdit.value = null;
    activeTab.value = 'form';
};
const handleSubmission = async (productData: any) => {
    if (productToEdit.value) {
        await productStore.updateProduct(productToEdit.value._id, productData);
    } else {
        await productStore.createProduct(productData);
    }
    activeTab.value = 'list';
    productToEdit.value = null;
};
</script>

<template>
    <div class="admin-products-view">
        <h2>Managing Products</h2>
        <div class="tabs">
            <button @click="activeTab = 'list'" :class="{ active: activeTab === 'list' }">
                Product list
            </button>
            <button @click="startCreating" :class="{ active: activeTab === 'form' && !productToEdit }">
                Add new product
            </button>
        </div>
        <div v-if="activeTab === 'list'" class="tab-content">
            <div v-if="productStore.loading"><LoadingSpinner /></div>
            <table v-else>
                <thead>
                <tr>
                    <th>Image</th>
                    <th>Product</th>
                    <th>Category</th>
                    <th>Price</th>
                    <th>Sale offer</th>
                    <th>Actions</th>
                </tr>
                </thead>
                <tbody>
                <tr v-for="product in productStore.products" :key="product._id">
                    <td><img :src="product.imageUrl" :alt="product.name" class="table-img"></td>
                    <td>{{ product.name }}</td>
                    <td>{{ product.category_details?.name || 'None' }}</td>
                    <td>{{ product.price }} PLN</td>
                    <td>{{ product.promotionalPrice ? product.promotionalPrice + ' PLN' : ''}}</td>
                    <td>
                        <button @click="startEditing(product)" class="edit-btn">Edit</button>
                        <button @click="productStore.deleteProduct(product._id)" class="delete-btn">Delete</button>
                    </td>
                </tr>
                </tbody>
            </table>
        </div>
        <div v-if="activeTab === 'form'" class="tab-content">
            <ProductForm :productToEdit="productToEdit" @form-submitted="handleSubmission" @cancel="activeTab = 'list'" />
        </div>
    </div>
</template>

<style scoped>
.tabs {
    margin-bottom: 2rem;
    border-bottom: 1px solid var(--border-color);
}
.tabs button {
    padding: 10px 20px;
    border: none;
    background-color: transparent;
    cursor: pointer;
    font-size: 1rem;
    position: relative;
    color: #6c757d;
    font-weight: 500;
}
.tabs button.active {
    color: var(--primary-color);
    font-weight: bold;
}
.tabs button.active::after {
    content: '';
    position: absolute;
    bottom: -1px;
    left: 0;
    width: 100%;
    height: 2px;
    background-color: var(--primary-color);
}
.tab-content {
    animation: fadeIn 0.3s ease-in-out;
}
@keyframes fadeIn {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
}
table {
    width: 100%;
    border-collapse: collapse;
}
th, td {
    border-bottom: 1px solid var(--border-color);
    padding: 12px 8px;
    text-align: left;
    vertical-align: middle;
}
th {
    background-color: #f8f9fa;
}
.table-img {
    width: 50px;
    height: 50px;
    object-fit: cover;
    border-radius: 4px;
}
td button {
    margin-right: 5px;
    padding: 6px 12px;
}
.edit-btn {
    background-color: #ffc107;
    color: #000;
    border: none;
}
.delete-btn {
    background-color: #f44336;
    border: none;
}
</style>