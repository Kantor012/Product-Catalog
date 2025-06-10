<script setup lang="ts">
import { onMounted, computed } from 'vue';
import { storeToRefs } from 'pinia';
import { useProductStore } from '@/store/productStore';
import ProductCard from '@/components/product/ProductCard.vue';
import LoadingSpinner from '@/components/common/LoadingSpinner.vue';

const productStore = useProductStore();
const { promotionalProducts, loading } = storeToRefs(productStore);

const limitedPromotionalProducts = computed(() => {
    return promotionalProducts.value.slice(0, 8);
})

onMounted(() => {
    productStore.fetchPromotionalProducts();
});
</script>
<template>
    <div v-if="promotionalProducts.length > 0" class="promotions">
        <h2>Hot Deals!</h2>
        <LoadingSpinner v-if="loading" />
        <div v-else class="product-grid">
            <ProductCard v-for="item in limitedPromotionalProducts" :key="item._id" :product="item" />
        </div>
    </div>
</template>

<style scoped>

.promotions {
    margin: 3rem 0;
    padding: 2rem;
    background-color: var(--card-bg);
    border-radius: 12px;
    border: 1px solid var(--border-color);
}

.promotions h2 {
    font-size: 1.8rem;
    font-weight: 600;
    margin: 0 0 1.5rem;
    padding-bottom: 1rem;
    border-bottom: 1px solid var(--border-color);
    color: var(--primary-color);
}

.product-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    gap: 1.5rem;
}
</style>