<script setup lang="ts">
import { ref, defineProps, defineEmits } from 'vue';
import { useAuthStore } from '@/store/authStore';
import { useProductStore } from '@/store/productStore';

const props = defineProps<{ productId: string }>();
const emit = defineEmits(['review-submitted']);

const authStore = useAuthStore();
const rating = ref(5);
const comment = ref('');

const handleSubmit = () => {
    if (!comment.value) return;
    if (rating.value < 1 || rating.value > 5) {
        alert('Rating must be between 1 and 5');
        return;
    }
    const productStore = useProductStore();
    productStore.addReview(props.productId, {
        rating: rating.value,
        comment: comment.value
    });

    comment.value = '';
    rating.value = 5;
};
</script>

<template>
    <div v-if="authStore.isAuthenticated" class="review-form">
        <h4>Add your review</h4>
        <form @submit.prevent="handleSubmit">
            <div>
                <label for="rating">Ocena:</label>
                <select v-model="rating" id="rating">
                    <option value="5">5 - Excellent!</option>
                    <option value="4">4 - Very good</option>
                    <option value="3">3 - Good</option>
                    <option value="2">2 - Bad</option>
                    <option value="1">1 - Trash</option>
                </select>
            </div>
            <div>
                <label for="comment">Comment:</label>
                <textarea v-model="comment" id="comment" rows="4" required></textarea>
            </div>
            <button type="submit">Add review</button>
        </form>
    </div>
    <div v-else>
        <p><router-link to="/login">Login</router-link>, to add your review.</p>
    </div>
</template>