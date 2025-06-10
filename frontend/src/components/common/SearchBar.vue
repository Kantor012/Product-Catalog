<script setup lang="ts">
import { ref } from 'vue';
import { useProductStore } from '@/store/productStore';

const searchQuery = ref('');
const productStore = useProductStore();

const handleSearch = () => {
    productStore.fetchProducts({ keyword: searchQuery.value });
};
</script>

<template>
    <form @submit.prevent="handleSearch" class="search-bar">
        <input
                type="text"
                v-model="searchQuery"
                placeholder="Find products..."
        />
        <button type="submit">Find</button>
    </form>
</template>

<style scoped>
.search-bar {
    display: flex;
    margin-bottom: 2rem;
}
.search-bar input {
    flex-grow: 1;
    margin-bottom: 0;
    margin-right: 1rem;
}
</style>