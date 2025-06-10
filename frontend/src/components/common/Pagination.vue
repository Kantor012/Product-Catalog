<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{
    currentPage: number;
    totalPages: number;
}>();

const emit = defineEmits(['page-changed']);

const pages = computed(() => {
    const range = [];
    for (let i = 1; i <= props.totalPages; i++) {
        range.push(i);
    }
    return range;
});

const changePage = (page: number) => {
    if (page < 1 || page > props.totalPages) return;
    emit('page-changed', page);
};
</script>

<template>
    <div v-if="totalPages > 1" class="pagination">
        <button @click="changePage(currentPage - 1)" :disabled="currentPage === 1">
            &laquo;
        </button>
        <button
                v-for="page in pages"
                :key="page"
                @click="changePage(page)"
                :class="{ active: currentPage === page }"
        >
            {{ page }}
        </button>
        <button @click="changePage(currentPage + 1)" :disabled="currentPage === totalPages">
            &raquo;
        </button>
    </div>
</template>

<style scoped>
.pagination {
    display: flex;
    justify-content: center;
    margin-top: 2rem;
}
.pagination button {
    margin: 0 5px;
}
.pagination button.active {
    background-color: var(--secondary-color);
}
</style>