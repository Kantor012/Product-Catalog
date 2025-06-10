<script setup lang="ts">
import { onMounted, computed, watch, ref } from 'vue';
import { useProductStore } from '@/store/productStore';
import { useAuthStore } from '@/store/authStore';
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

const reviewsCurrentPage = ref(1);
const reviewsPerPage = 5;
const showReviewForm = ref(false);

const editingField = ref<string | null>(null);
const editValue = ref<string | number>('');

const startEditing = (field: string, currentValue: string | number) => {
    editingField.value = field;
    editValue.value = currentValue;
};

const cancelEditing = () => {
    editingField.value = null;
    editValue.value = '';
};

const saveEdit = async () => {
    if (editingField.value && product.value) {
        await productStore.updateProductField(product.value._id, { [editingField.value]: editValue.value });
    }
    cancelEditing();
};

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
    if (newLength !== undefined && oldLength !== undefined && newLength < oldLength) {
        if (reviewsCurrentPage.value > totalReviewPages.value) {
            reviewsCurrentPage.value = totalReviewPages.value;
        }
    }
    else if (newLength && oldLength && newLength > oldLength) {
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
    showReviewForm.value = false;
    cancelEditing();
});
</script>

<template>
    <LoadingSpinner v-if="productStore.loading" />

    <div v-else-if="product" class="product-details-container container">
        <div v-if="authStore.isAdmin" class="admin-actions-header">
            <h3>Admin Actions</h3>
            <button @click="productStore.deleteProductAndRedirect(product._id)" class="btn-danger">
                <span class="material-icons">delete_forever</span> Delete Product
            </button>
        </div>

        <div class="main-info">
            <div class="image-gallery">
                <img :src="product.imageUrl" :alt="product.name">
            </div>
            <div class="product-summary">
                <p v-if="product.category_details" class="category">
                    Category: {{ product.category_details.name }}
                </p>

                <div class="editable-field">
                    <h1 v-if="editingField !== 'name'">
                        {{ product.name }}
                        <span v-if="authStore.isAdmin" class="material-icons edit-icon" @click="startEditing('name', product.name)">edit</span>
                    </h1>
                    <div v-else class="edit-mode">
                        <input type="text" v-model="editValue" class="edit-input-h1" />
                        <button @click="saveEdit" class="btn-save">Save</button>
                        <button @click="cancelEditing" class="btn-cancel">Cancel</button>
                    </div>
                </div>

                <div class="editable-field">
                    <p v-if="editingField !== 'description'" class="description">
                        {{ product.description }}
                        <span v-if="authStore.isAdmin" class="material-icons edit-icon" @click="startEditing('description', product.description)">edit</span>
                    </p>
                    <div v-else class="edit-mode">
                        <textarea v-model="editValue" class="edit-textarea"></textarea>
                        <button @click="saveEdit" class="btn-save">Save</button>
                        <button @click="cancelEditing" class="btn-cancel">Cancel</button>
                    </div>
                </div>


                <div class="price-container-details">
                    <div class="editable-field">
                        <p v-if="editingField !== 'price'" class="price">
                            {{ product.isPromotional ? product.promotionalPrice : product.price }} PLN
                            <span v-if="authStore.isAdmin" class="material-icons edit-icon" @click="startEditing(product.isPromotional ? 'promotionalPrice' : 'price', product.isPromotional ? product.promotionalPrice : product.price)">edit</span>
                        </p>
                        <div v-else class="edit-mode">
                            <input type="number" step="0.01" v-model.number="editValue" class="edit-input-price" />
                            <button @click="saveEdit" class="btn-save">Save</button>
                            <button @click="cancelEditing" class="btn-cancel">Cancel</button>
                        </div>
                    </div>
                    <p v-if="product.isPromotional" class="price-old">{{ product.price }} PLN</p>
                </div>
            </div>
        </div>

        <div v-if="product.details && Object.keys(product.details).length > 0" class="details-section">
            <h3>Product Details</h3>
            <ul class="details-list">
                <li v-for="(value, key) in product.details" :key="key">
                    <strong>{{ key }}:</strong>

                    <span v-if="editingField !== 'details.' + key" class="editable-field-inline">
                        {{ value }}
                        <span v-if="authStore.isAdmin" class="material-icons edit-icon" @click="startEditing('details.' + key, value)">edit</span>
                    </span>
                    <span v-else class="edit-mode-inline">
                        <input type="text" v-model="editValue">
                        <button @click="saveEdit" class="btn-save-inline"><span class="material-icons">check</span></button>
                        <button @click="cancelEditing" class="btn-cancel-inline"><span class="material-icons">close</span></button>
                    </span>

                </li>
            </ul>
        </div>

        <div class="reviews-section">
            <div class="reviews-header">
                <h3>Reviews ({{ product.reviews ? product.reviews.length : 0 }})</h3>
                <button v-if="authStore.isAdmin && product.reviews.length > 0" @click="productStore.deleteAllReviews(product._id)" class="btn-danger-text">
                    <span class="material-icons">delete_sweep</span> Delete All
                </button>
            </div>


            <div class="add-review-container">
                <button v-if="authStore.isAuthenticated" @click="showReviewForm = !showReviewForm" class="toggle-review-form-btn">
                    {{ showReviewForm ? 'Cancel' : 'Add review' }}
                </button>
                <ReviewForm v-if="showReviewForm && product._id" :productId="product._id" />
            </div>


            <div v-if="paginatedReviews.length > 0" class="reviews-list">
                <div v-for="review in paginatedReviews" :key="review._id" class="review-item">
                    <div class="review-header">
                        <strong>{{ review.name }}</strong>
                        <div class="review-actions">
                            <span>Rating: {{ review.rating }}/5</span>
                            <button v-if="authStore.isAdmin" @click="productStore.deleteReview(product._id, review._id)" class="btn-delete-review">
                                <span class="material-icons">delete</span>
                            </button>
                        </div>
                    </div>
                    <p class="review-comment">{{ review.comment }}</p>
                    <small class="review-date">{{ new Date(review.createdAt).toLocaleDateString() }}</small>
                </div>

                <div v-if="totalReviewPages > 1" class="pagination">
                    <button @click="changeReviewPage(reviewsCurrentPage - 1)" :disabled="reviewsCurrentPage === 1">
                        &laquo; Previous
                    </button>
                    <button
                        v-for="page in totalReviewPages"
                        :key="page"
                        @click="changeReviewPage(page)"
                        :class="{ active: reviewsCurrentPage === page }">
                        {{ page }}
                    </button>
                    <button @click="changeReviewPage(reviewsCurrentPage + 1)" :disabled="reviewsCurrentPage === totalReviewPages">
                        Next &raquo;
                    </button>
                </div>
            </div>
            <p v-else class="no-reviews-info">No reviews? You can add yours!</p>
        </div>


        <RecommendedProducts v-if="product._id" :productId="product._id" />
    </div>

    <div v-else>
        <p>Product not found.</p>
    </div>
</template>

<style scoped>
.main-info { display: grid; grid-template-columns: 1fr 1fr; gap: 3rem; margin-bottom: 3rem; }
.image-gallery img { width: 100%; border-radius: 12px; }
.price-container-details { display: flex; align-items: baseline; gap: 15px; margin: 1.5rem 0; }
.price { font-size: 2rem; font-weight: bold; color: var(--primary-color); }
.price-old { font-size: 1.2rem; color: #6c757d; text-decoration: line-through; }
.category { font-style: italic; color: #6c757d; margin-bottom: 0.5rem; }
.description { line-height: 1.7; }
.details-section { margin-bottom: 3rem; padding: 1.5rem; background-color: var(--card-bg); border-radius: 8px; }
.details-section h3, .reviews-section h3 { margin-top: 0; border-bottom: 1px solid var(--border-color); padding-bottom: 1rem; margin-bottom: 1.5rem; }
.details-list { list-style: none; padding: 0; display: grid; grid-template-columns: repeat(auto-fill, minmax(250px, 1fr)); gap: 1rem; }

.admin-actions-header { background-color: #fff8e1; border: 1px solid #ffecb3; border-radius: 8px; padding: 1rem; margin-bottom: 2rem; display: flex; justify-content: space-between; align-items: center; }
.admin-actions-header h3 { margin: 0; color: #6d4c41; }
.btn-danger { background-color: var(--error-color); color: white; display: inline-flex; align-items: center; gap: 0.5rem; }
.btn-danger-text { background: none; border: none; color: var(--error-color); cursor: pointer; display: inline-flex; align-items: center; gap: 0.25rem; font-weight: bold;}
.btn-delete-review { background: none; border: none; cursor: pointer; padding: 0.25rem; color: #9e9e9e; }
.btn-delete-review:hover { color: var(--error-color); }
.editable-field { position: relative; display: inline-flex; align-items: center; }
.edit-icon { cursor: pointer; font-size: 1.1rem; color: #757575; vertical-align: middle; margin-left: 0.5rem; transition: color 0.2s ease; }
.editable-field:hover .edit-icon:hover { color: var(--primary-color); }
.edit-mode { display: flex; flex-direction: column; gap: 0.5rem; margin: 1rem 0; }
.edit-mode .btn-save { background-color: var(--success-color); align-self: flex-start;}
.edit-mode .btn-cancel { background-color: #9e9e9e; align-self: flex-start;}
.edit-input-h1 { font-size: 2.5rem; font-weight: bold; }
.edit-textarea { min-height: 120px; }
.edit-input-price { font-size: 2rem; font-weight: bold; }
.editable-field-inline { display: inline-flex; align-items: center; }
.editable-field-inline .edit-icon { font-size: 1rem; margin-left: 8px; vertical-align: middle; }
.edit-mode-inline { display: inline-flex; align-items: center; gap: 0.5rem; }
.edit-mode-inline input { padding: 4px 8px; font-size: 1rem; border: 1px solid var(--primary-color); border-radius: 4px; }
.edit-mode-inline button { background: none; border: none; cursor: pointer; display: flex; align-items: center; padding: 2px; }
.edit-mode-inline .material-icons { font-size: 1.2rem; }
.btn-save-inline { color: var(--success-color); }
.btn-cancel-inline { color: var(--error-color); }

.reviews-section { margin-bottom: 3rem; }
.reviews-list { margin-top: 1.5rem; }
.no-reviews-info { margin-top: 1.5rem; text-align: center; color: #6c757d; background-color: var(--card-bg); padding: 2rem; border-radius: 8px; }
.reviews-header { display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid var(--border-color); padding-bottom: 1rem; margin-bottom: 1.5rem; }
.reviews-header h3 { border: none; margin: 0; padding: 0; }
.review-item { background-color: var(--card-bg); border: 1px solid var(--border-color); border-radius: 8px; padding: 1rem; margin-bottom: 1rem; }
.review-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem; border: none; padding: 0;}
.review-actions { display: flex; align-items: center; gap: 1rem;}
.review-header span { font-size: 0.9rem; font-weight: bold; color: var(--primary-color); }
.review-comment { margin: 0.5rem 0; }
.review-date { font-size: 0.8rem; color: #6c757d; }
.pagination { display: flex; justify-content: center; align-items: center; gap: 0.5rem; margin-top: 2rem; }
.pagination button { background-color: #fff; border: 1px solid var(--border-color); color: var(--text-color); }
.pagination button:disabled { opacity: 0.5; cursor: not-allowed; }
.pagination button.active { background-color: var(--primary-color); color: white; border-color: var(--primary-color); font-weight: bold; }
.add-review-container { margin-bottom: 1.5rem; }
.toggle-review-form-btn { margin-bottom: 1rem; }
</style>