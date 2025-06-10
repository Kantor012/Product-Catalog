<script setup lang="ts">
import { ref, watch, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useCategoryStore } from '@/store/categoryStore';

const categoryStore = useCategoryStore();
const route = useRoute();
const router = useRouter();

const filters = ref({
    keyword: route.query.keyword || '',
    category: route.query.category || '',
});

watch(filters, (newFilters) => {
    const cleanFilters = Object.fromEntries(
        Object.entries(newFilters).filter(([_, v]) => v != null && v !== '')
    );
    router.replace({ name: 'products', query: cleanFilters });
}, { deep: true });

watch(() => route.query, (newQuery) => {
    filters.value.keyword = newQuery.keyword || '';
    filters.value.category = newQuery.category || '';
});

onMounted(() => {
    if (categoryStore.categories.length === 0) {
        categoryStore.fetchCategories();
    }
});
</script>

<template>
    <div class="filters">
        <input
            type="text"
            v-model.lazy="filters.keyword"
            placeholder="Search products..."
            class="search-input"
        >
        <select v-model="filters.category">
            <option value="">All categories</option>
            <option v-for="cat in categoryStore.categories" :key="cat._id" :value="cat._id">
                {{ cat.name }}
            </option>
        </select>
        <input type="number" v-model.number="filters.minPrice" placeholder="Price min.">
        <input type="number" v-model.number="filters.maxPrice" placeholder="Price max.">
        <select v-model="filters.sort">
            <option value="createdAt_desc">Newest</option>
            <option value="price_asc">Price: Ascending</option>
            <option value="price_desc">Price: Descending</option>
        </select>
    </div>
</template>

<style scoped>
.filters {
    display: grid;
    grid-template-columns: 2fr 1fr 1fr 1fr 1fr;
    gap: 1rem;
    margin-bottom: 2rem;
    align-items: center;
}
@media (max-width: 992px) {
    .filters {
        grid-template-columns: 1fr 1fr;
    }
    .search-input {
        grid-column: 1 / -1;
    }
}
@media (max-width: 576px) {
    .filters {
        grid-template-columns: 1fr;
    }
}
</style>