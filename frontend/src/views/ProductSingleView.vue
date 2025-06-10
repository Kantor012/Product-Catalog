<script setup lang="ts">
import {onMounted, computed, watch, ref} from 'vue';
import { useProductStore } from '@/store/productStore';
import {useAuthStore} from "@/store/authStore.ts";
import RecommendedProducts from '@/components/product/RecommendedProducts.vue';
import LoadingSpinner from '@/components/common/LoadingSpinner.vue';
import ReviewForm from '@/components/product/ReviewForm.vue';

const props = defineProps({
    id: {
        type: String,
        required: true,
    },
});

const productStore = useProductStore();
const authStore = useAuthStore();
const product = computed(() => productStore.product);

const showReviewForm = ref(false);
const reviewsCurrentPage = ref(1);
const reviewsPerPage = 5;

const totalReviewPages = computed(() => {
    if (!product.value || !product.value.reviews || product.value.reviews.length === 0) {
        return 1;
    }
    return Math.ceil(product.value.reviews.length / reviewsPerPage);
});

const paginatedReviews = computed(() => {
    if (!product.value || !product.value.reviews) {
        return [];
    }
    const reversedReviews = [...product.value.reviews].reverse();
    const start = (reviewsCurrentPage.value - 1) * reviewsPerPage;
    const end = start + reviewsPerPage;
    return reversedReviews.slice(start, end);
});

const changeReviewPage = (page: number) => {
    if (page >= 1 && page <= totalReviewPages.value) {
        reviewsCurrentPage.value = page;
    }
}

watch(() => product.value?.reviews.length, (newLength, oldLength) => {
    if (newLength && oldLength && newLength > oldLength) {
        reviewsCurrentPage.value = 1;
        showReviewForm.value = false;
    }
});

onMounted(() => {
    productStore.fetchProductById(props.id);
});

watch(() => props.id, (newId) => {
    productStore.fetchProductById(newId);
    reviewsCurrentPage.value = 1;
});
</script>

<template>
    <LoadingSpinner v-if="productStore.loading" />

    <div v-else-if="product" class="product-details-container container">
        <div class="main-info">
            <div class="image-gallery">
                <img :src="product.imageUrl" :alt="product.name">
            </div>
            <div class="product-summary">
                <p v-if="product.category_details" class="category">
                    Category: {{ product.category_details.name }}
                </p>
                <h1>{{ product.name }}</h1>
                <p class="description">{{ product.description }}</p>

                <div class="price-container-details">
                    <p class="price">{{ product.isPromotional ? product.promotionalPrice : product.price }} PLN</p>
                    <p v-if="product.isPromotional" class="price-old">{{ product.price }} PLN</p>
                </div>
            </div>
        </div>

        <div v-if="product.details && Object.keys(product.details).length > 0" class="details-section">
            <h3>Product details</h3>
            <ul class="details-list">
                <li v-for="(value, key) in product.details" :key="key">
                    <strong>{{ key }}:</strong> {{ value }}
                </li>
            </ul>
        </div>
        <div class="reviews-section">
            <h3>Reviews ({{ product.reviews ? product.reviews.length : 0 }})</h3>

            <div class="add-review-container">
                <button v-if="authStore.isAuthenticated" @click="showReviewForm = !showReviewForm" class="toggle-review-form-btn">
                    {{ showReviewForm ? 'Anuluj' : 'Dodaj recenzję' }}
                </button>
                <ReviewForm v-if="showReviewForm && product._id" :productId="product._id" />
            </div>


            <div v-if="paginatedReviews.length > 0" class="reviews-list">
                <div v-for="review in paginatedReviews" :key="review._id" class="review-item">
                    <div class="review-header">
                        <strong>{{ review.name }}</strong>
                        <span>Rating: {{ review.rating }}/5</span>
                    </div>
                    <p class="review-comment">{{ review.comment }}</p>
                    <small class="review-date">{{ new Date(review.createdAt).toLocaleDateString() }}</small>
                </div>

                <div v-if="totalReviewPages > 1" class="pagination">
                    <button @click="changeReviewPage(reviewsCurrentPage - 1)" :disabled="reviewsCurrentPage === 1">
                        &laquo; Poprzednia
                    </button>
                    <button
                        v-for="page in totalReviewPages"
                        :key="page"
                        @click="changeReviewPage(page)"
                        :class="{ active: reviewsCurrentPage === page }">
                        {{ page }}
                    </button>
                    <button @click="changeReviewPage(reviewsCurrentPage + 1)" :disabled="reviewsCurrentPage === totalReviewPages">
                        Następna &raquo;
                    </button>
                </div>
            </div>
            <p v-else class="no-reviews-info">Brak recenzji. Bądź pierwszy i dodaj swoją opinię!</p>
        </div>

        <RecommendedProducts v-if="product._id" :productId="product._id" />
    </div>

    <div v-else>
        <p>Product not found.</p>
    </div>
</template>

<style scoped>
.main-info {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 3rem;
    margin-bottom: 3rem;
}
.image-gallery img {
    width: 100%;
    border-radius: 12px;
}
.price-container-details {
    display: flex;
    align-items: baseline;
    gap: 15px;
    margin: 1.5rem 0;
}
.price {
    font-size: 2rem;
    font-weight: bold;
    color: var(--primary-color);
}
.price-old {
    font-size: 1.2rem;
    color: #6c757d;
    text-decoration: line-through;
}
.category {
    font-style: italic;
    color: #6c757d;
    margin-bottom: 0.5rem;
}
.description {
    line-height: 1.7;
}
.details-section {
    margin-bottom: 3rem;
    padding: 1.5rem;
    background-color: var(--card-bg);
    border-radius: 8px;
}
.details-section h3, .reviews-section h3 {
    margin-top: 0;
    border-bottom: 1px solid var(--border-color);
    padding-bottom: 1rem;
    margin-bottom: 1.5rem;
}
.details-list {
    list-style: none;
    padding: 0;
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    gap: 1rem;
}

.reviews-section {
    margin-bottom: 3rem;
}
.add-review-container {
    margin-bottom: 1.5rem;
}
.toggle-review-form-btn {
    margin-bottom: 1rem;
}
.review-item {
    background-color: var(--card-bg);
    border: 1px solid var(--border-color);
    border-radius: 8px;
    padding: 1rem;
    margin-bottom: 1rem;
}
.review-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 0.5rem;
}
.review-header span {
    font-size: 0.9rem;
    font-weight: bold;
    color: var(--primary-color);
}
.review-comment {
    margin: 0.5rem 0;
}
.review-date {
    font-size: 0.8rem;
    color: #6c757d;
}
.pagination {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 0.5rem;
    margin-top: 2rem;
}
.pagination button {
    background-color: #fff;
    border: 1px solid var(--border-color);
    color: var(--text-color);
}
.pagination button:disabled {
    opacity: 0.5;
    cursor: not-allowed;
}
.pagination button.active {
    background-color: var(--primary-color);
    color: white;
    border-color: var(--primary-color);
    font-weight: bold;
}
.no-reviews-info {
    margin-top: 1.5rem;
    text-align: center;
    color: #6c757d;
    background-color: var(--card-bg);
    padding: 2rem;
    border-radius: 8px;
}
</style>