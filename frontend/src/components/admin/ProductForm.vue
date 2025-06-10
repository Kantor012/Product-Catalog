<script setup lang="ts">
import { ref, watch, defineProps, defineEmits, onMounted } from 'vue';
import { useCategoryStore } from '@/store/categoryStore';

const categoryStore = useCategoryStore();
const props = defineProps({
    productToEdit: {
        type: Object,
        default: null
    }
});

const emit = defineEmits(['form-submitted']);

const form = ref({
    name: '',
    description: '',
    price: 0,
    category: '',
    tags: '',
    isPromotional: false,
    promotionalPrice: null as number | null
});
const detailsList = ref<{ key: string; value: string }[]>([]);

watch(() => props.productToEdit, (newProduct) => {
    if (newProduct) {
        form.value = {
            ...newProduct,
            tags: newProduct.tags?.join(', ') || '',
            category: newProduct.category,
            isPromotional: newProduct.isPromotional || false,
            promotionalPrice: newProduct.promotionalPrice || null
        };
        detailsList.value = newProduct.details ? Object.entries(newProduct.details).map(([key, value]) => ({ key, value: value as string })) : [];
    } else {
        form.value = { name: '', description: '', price: 0, category: '', tags: '', isPromotional: false, promotionalPrice: null };
        detailsList.value = [];
    }
}, { immediate: true, deep: true });

const addDetail = () => {
    detailsList.value.push({ key: '', value: '' });
};

const removeDetail = (index: number) => {
    detailsList.value.splice(index, 1);
};

const handleSubmit = () => {
    const detailsAsObject = detailsList.value.reduce((obj, item) => {
        if (item.key) {
            obj[item.key] = item.value;
        }
        return obj;
    }, {} as Record<string, any>);

    const productData = {
        ...form.value,
        tags: form.value.tags.split(',').map(tag => tag.trim()).filter(t => t),
        details: detailsAsObject
    };

    if (!productData.isPromotional) {
        productData.promotionalPrice = null;
    }

    emit('form-submitted', productData);
};

onMounted(() => {
    if (categoryStore.categories.length === 0) {
        categoryStore.fetchCategories();
    }
})
</script>

<template>
    <form @submit.prevent="handleSubmit" class="product-form">
        <h3>{{ productToEdit ? 'Edit product' : 'Add new product' }}</h3>

        <input type="text" v-model="form.name" placeholder="Product name" required />
        <textarea v-model="form.description" placeholder="Description" rows="3" required></textarea>
        <p>Price</p>
        <input type="number" step="0.01" v-model.number="form.price" placeholder="Price" required />

        <label for="category-select">Category</label>
        <select v-model="form.category" id="category-select" required>
            <option disabled value="">Select a category</option>
            <option v-for="cat in categoryStore.categories" :key="cat._id" :value="cat._id">
                {{ cat.name }}
            </option>
        </select>
        <hr>
        <h4>Promotions</h4>
        <div class="form-group-inline">
            <input type="checkbox" v-model="form.isPromotional" id="is-promotional">
            <label for="is-promotional">Product on sale</label>
        </div>

        <div v-if="form.isPromotional" class="form-group">
            <label for="promotional-price">Sale price</label>
            <input
                type="number"
                step="0.01"
                v-model.number="form.promotionalPrice"
                id="promotional-price"
                placeholder="Sale price"
            >
        </div>
        <hr>
        <h4>Details</h4>

        <div v-for="(detail, index) in detailsList" :key="index" class="attribute-row">
            <input type="text" v-model="detail.key" placeholder="Attribute (eg. Color)">
            <input type="text" v-model="detail.value" placeholder="Value (eg. Red)">
            <button type="button" @click="removeDetail(index)" class="remove-btn">Delete</button>
        </div>

        <button type="button" @click="addDetail" class="add-btn">Add detail</button>

        <hr>

        <button type="submit" class="submit-btn">{{ productToEdit ? 'Save' : 'Add product' }}</button>
    </form>
</template>

<style scoped>
.product-form { display: flex; flex-direction: column; }
.attribute-row { display: flex; gap: 10px; align-items: center; margin-bottom: 10px; }
.attribute-row input { margin-bottom: 0; }
.remove-btn, .add-btn { background-color: #f44336; flex-shrink: 0; }
.add-btn { background-color: #2c3e50; margin-top: 0; align-self: flex-start; }
hr { width: 100%; margin: 20px 0; }
.submit-btn { margin-top: 10px; background-color: var(--primary-color); }

.form-group {
    margin-top: 1rem;
}
.form-group-inline {
    display: flex;
    align-items: center;
    gap: 10px;
}
.form-group-inline input[type="checkbox"] {
    width: auto;
}
</style>