<script setup lang="ts">
import { onMounted } from 'vue';
import { useRecentlyAddedStore } from '@/store/recentlyAddedStore';
import ProductCard from '@/components/product/ProductCard.vue';
import LoadingSpinner from '@/components/common/LoadingSpinner.vue';

const recentlyAddedStore = useRecentlyAddedStore();

onMounted(() => {
    recentlyAddedStore.fetchItems();
});
</script>

<template>
    <div class="recently-added">
        <h2>Recently added</h2>
        <LoadingSpinner v-if="recentlyAddedStore.loading" />
        <div v-else class="product-grid">
            <ProductCard v-for="item in recentlyAddedStore.items" :key="item._id" :product="item" />
        </div>
    </div>
</template>

<style scoped>
.product-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    gap: 1.5rem;
}
.recently-added {
    margin-top: 2rem;
}
</style>