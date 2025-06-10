<script setup lang="ts">
import { defineProps } from 'vue';
import { RouterLink } from 'vue-router';

defineProps({
    product: {
        type: Object,
        required: true,
    },
});
</script>

<template>
    <div class="product-card" :class="{ 'is-promotional': product.isPromotional }">
        <RouterLink :to="`/product/${product._id}`">
            <div v-if="product.isPromotional" class="promo-badge">SALE</div>
            <div class="card-image">
                <img v-if="product.imageUrl" :src="product.imageUrl" :alt="product.name" class="product-image-instance" />
                <span v-else>(Image)</span>
            </div>
            <div class="card-content">
                <p v-if="product.category_details" class="category-name">
                    {{ product.category_details.name }}
                </p>
                <h3>{{ product.name }}</h3>

                <div class="price-container">
                    <p class="price">{{ product.isPromotional ? product.promotionalPrice : product.price }} PLN</p>
                    <p v-if="product.isPromotional" class="price-old">{{ product.price }} PLN</p>
                </div>
            </div>
        </RouterLink>
    </div>
</template>

<style scoped>
.product-card {
    position: relative;
    border: 1px solid var(--border-color);
    border-radius: 12px;
    background-color: var(--card-bg);
    overflow: hidden;
    transition: box-shadow 0.3s ease, transform 0.3s ease;
    text-decoration: none;
    color: inherit;
    display: flex;
    flex-direction: column;
}

.product-card.is-promotional {
    border-color: var(--primary-color);
    box-shadow: 0 0 15px rgba(0, 123, 255, 0.8);
}
.promo-badge {
    position: absolute;
    top: 10px;
    right: 10px;
    background-color: var(--error-color);
    color: white;
    padding: 4px 8px;
    border-radius: 4px;
    font-size: 0.8rem;
    font-weight: bold;
    z-index: 2;
}
.price-container {
    display: flex;
    align-items: baseline;
    gap: 10px;
    margin-top: 1rem;
}
.price {
    font-size: 1.25rem;
    font-weight: 600;
    color: var(--primary-color);
    margin: 0;
}
.price-old {
    font-size: 1rem;
    color: #6c757d;
    text-decoration: line-through;
    margin: 0;
}

.product-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.8);
}
.product-card a {
    text-decoration: none;
    color: inherit;
    display: flex;
    flex-direction: column;
    height: 100%;
}
.card-image {
    height: 200px;
    background-color: var(--light-gray);
    display: flex;
    align-items: center;
    justify-content: center;
    color: #9ca3af;
    overflow: hidden;
}
.product-image-instance {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.3s ease;
}
.product-card:hover .product-image-instance {
    transform: scale(1.05);
}
.card-content {
    padding: 1rem 1.5rem;
    display: flex;
    flex-direction: column;
    flex-grow: 1;
}
.category-name {
    font-size: 0.8rem;
    color: #6d7e8f;
    margin: 0 0 0.5rem 0;
    font-weight: 500;
}
.card-content h3 {
    margin: 0 0 0.5rem 0;
    font-size: 1.1rem;
    flex-grow: 1;
}
</style>