<script setup lang="ts">
import { ref, onMounted, defineProps, watch } from 'vue';
import apiClient from '@/services/api';
import ProductCard from '@/components/product/ProductCard.vue';

const props = defineProps({
    productId: {
        type: String,
        required: true
    }
});

const recommendations = ref<any[]>([]);
const loading = ref(true);

const fetchRecommendations = async (id: string) => {
    if (!id) return;
    loading.value = true;
    try {
        const { data } = await apiClient.get(`/products/recommendations/${id}`);
        recommendations.value = data.filter((p: any) => p._id !== id);
    } catch (error) {
        console.error("Failed to fetch recommendations:", error);
        recommendations.value = [];
    } finally {
        loading.value = false;
    }
};

onMounted(() => {
    fetchRecommendations(props.productId);
});

watch(() => props.productId, (newId) => {
    fetchRecommendations(newId);
});
</script>

<template>
    <div v-if="!loading && recommendations.length > 0" class="recommendations">
        <h3>You might also like</h3>
        <div class="product-grid">
            <ProductCard
                v-for="item in recommendations"
                :key="item._id"
                :product="item"
            />
        </div>
    </div>
</template>

<style scoped>
.recommendations {
    margin-top: 3rem;
    padding-top: 2rem;
    border-top: 1px solid var(--border-color);
}
.recommendations h3 {
    font-size: 1.8rem;
    font-weight: 600;
    margin-bottom: 1.5rem;
}
.product-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    gap: 1.5rem;
}
</style>