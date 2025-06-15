<script setup lang="ts">
import { computed, watch } from 'vue';
import { useProductStore } from '@/store/productStore';
import { useRoute, useRouter } from "vue-router";
import ProductCard from '@/components/product/ProductCard.vue';
import LoadingSpinner from '@/components/common/LoadingSpinner.vue';
import ProductFilters from '@/components/common/ProductFilters.vue';

const productStore = useProductStore();
const route = useRoute();
const router = useRouter();

const fetchProductsBasedOnRoute = () => {
    productStore.fetchProducts(route.query);
};

watch(() => route.query, fetchProductsBasedOnRoute, { immediate: true });

watch(() => productStore.products, (newProducts) => {
    if (route.query.keyword && !route.query.category && newProducts.length > 0) {
        const categoryCounts = newProducts.reduce((acc, product) => {
            const catId = product.category;
            if (catId) {
                acc[catId] = (acc[catId] || 0) + 1;
            }
            return acc;
        }, {} as Record<string, number>);

        if (Object.keys(categoryCounts).length > 0) {
            const mostFrequentCategoryId = Object.keys(categoryCounts).reduce((a, b) => categoryCounts[a] > categoryCounts[b] ? a : b);

            if (mostFrequentCategoryId) {
                router.replace({ query: { ...route.query, category: mostFrequentCategoryId } });
            }
        }
    }
}, { deep: true });

const groupedProducts = computed(() => {
    if (!productStore.products) return {};

    return productStore.products.reduce((acc, product) => {
        const categoryName = product.category_details?.name || 'Bez kategorii';

        if (!acc[categoryName]) {
            acc[categoryName] = [];
        }
        acc[categoryName].push(product);
        return acc;
    }, {} as Record<string, any[]>);
});
</script>

<template>
    <div class="container">
        <div class="header-controls">
            <h1>Products</h1>
            <div class="view-switcher">
                <button @click="productStore.setViewMode('grid')" :class="{ active: productStore.viewMode === 'grid' }">Grid</button>
                <button @click="productStore.setViewMode('list')" :class="{ active: productStore.viewMode === 'list' }">List</button>
            </div>
        </div>
        <ProductFilters />

        <LoadingSpinner v-if="productStore.loading" />

        <div v-else class="categories-wrapper">
            <div v-for="(products, categoryName) in groupedProducts" :key="categoryName" class="category-group">
                <h2 class="category-title">{{ categoryName }}</h2>

                <div class="product-container" :class="productStore.viewMode === 'grid' ? 'grid-view' : 'list-view'">
                    <ProductCard
                        v-for="product in products"
                        :key="product._id"
                        :product="product"
                    />
                </div>
            </div>
            <p v-if="Object.keys(groupedProducts).length === 0">No products found with specific filters, try to change some of them.</p>
        </div>

    </div>
</template>

<style scoped>
.header-controls {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1rem;
}
.view-switcher button {
    margin-left: 0.5rem;
    background-color: var(--light-gray);
    color: var(--text-color);
    border: 1px solid var(--border-color);
}
.view-switcher button.active {
    background-color: var(--primary-color);
    color: white;
    border-color: var(--primary-color);
}
.category-group {
    margin-bottom: 3rem;
}
.category-title {
    font-size: 1.8rem;
    padding-bottom: 0.5rem;
    border-bottom: 2px solid var(--border-color);
    margin-bottom: 1.5rem;
}
.product-container.grid-view {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    gap: 1.5rem;
}
.product-container.list-view {
    display: flex;
    flex-direction: column;
    gap: 1rem;
}
</style>