<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/store/authStore';
import { useCategoryStore } from '@/store/categoryStore';

const authStore = useAuthStore();
const categoryStore = useCategoryStore();
const router = useRouter();

const isExpanded = ref(false);
const productsMenuOpen = ref(false);

watch(isExpanded, (nowaWartosc) => {
    if (!nowaWartosc) {
        productsMenuOpen.value = false;
    }
});

const selectCategory = (categoryId: string) => {
    router.push({ name: 'products', query: { category: categoryId } });
    productsMenuOpen.value = false;
};

onMounted(() => {
    if (categoryStore.categories.length === 0) {
        categoryStore.fetchCategories();
    }
});
</script>

<template>
    <aside
        :class="{ 'is-expanded': isExpanded }"
        @mouseenter="isExpanded = true"
        @mouseleave="isExpanded = false"
    >
        <div class="logo">
            <router-link to="/">
                <img src="@/assets/logo.svg" alt="Vue" class="logo-full">
                <span class="logo-icon">V</span>
            </router-link>
        </div>

        <h3>Menu</h3>
        <div class="menu">
            <router-link to="/" class="button">
                <span class="material-icons">home</span>
                <span class="text">Home</span>
            </router-link>

            <div class="button-group">
                <div class="button" @click="productsMenuOpen = !productsMenuOpen">
                    <span class="material-icons">inventory_2</span>
                    <span class="text">Products</span>
                    <span
                        v-if="isExpanded"
                        class="material-icons chevron"
                        :class="{'is-rotated': productsMenuOpen}"
                    >expand_more</span>
                </div>
                <div class="sub-menu" v-if="productsMenuOpen">
                    <router-link to="/products" class="sub-button">All products</router-link>
                    <a href="#" v-for="cat in categoryStore.categories" :key="cat._id" @click.prevent="selectCategory(cat._id)" class="sub-button">
                        {{ cat.name }}
                    </a>
                </div>
            </div>

            <router-link v-if="authStore.isAdmin" to="/admin" class="button">
                <span class="material-icons">admin_panel_settings</span>
                <span class="text">Admin Panel</span>
            </router-link>
        </div>

        <div class="flex"></div>

        <div class="menu">
            <template v-if="!authStore.isAuthenticated">
                <router-link to="/login" class="button">
                    <span class="material-icons">login</span>
                    <span class="text">Login</span>
                </router-link>
                <router-link to="/register" class="button">
                    <span class="material-icons">app_registration</span>
                    <span class="text">Register</span>
                </router-link>
            </template>
            <template v-else>
                <router-link to="/profile" class="button">
                    <span class="material-icons">person</span>
                    <span class="text">Profile</span>
                </router-link>
                <a @click="authStore.logout()" href="#" class="button">
                    <span class="material-icons">logout</span>
                    <span class="text">Logout</span>
                </a>
            </template>
        </div>
    </aside>
</template>


<style scoped>
aside {
    display: flex;
    flex-direction: column;
    background-color: var(--secondary-color);
    color: #FFF;
    width: calc(3rem + 42px);
    min-height: 100vh;
    overflow: hidden;
    padding: 0.4rem;
    position: fixed;
    z-index: 99;
    transition: 0.5s ease-out;
}
aside.is-expanded {
    width: 250px;
}
.logo {
    margin-bottom: 1rem;
    height: 5rem;
}
.logo a {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
    overflow: hidden;
    color: #FFF;
    text-decoration: none;
}

.logo-full, .logo-icon {
    position: absolute;
    transition: transform 0.75s ease-in-out;
}
.logo-full {
    width: 5rem;
    transform: translateX(150%);
}
.logo-icon {
    font-size: 2rem;
    font-weight: bold;
    transform: translateX(0);
}
aside.is-expanded .logo-full {
    transform: translateX(0);
}
aside.is-expanded .logo-icon {
    transform: translateX(-650%);
}
h3, .button .text {
    opacity: 0;
    transition: opacity 0.6s ease-in-out;
}
h3 {
    color: #6d7e8f;
    font-size: 0.875rem;
    margin-bottom: 0.5rem;
    text-transform: uppercase;
    padding: 0 0.1rem;
}
.is-expanded h3,
.is-expanded .button .text {
    opacity: 1;
}
.menu {
    margin: 0;
    padding: 0 0.5rem;
}
.button {
    display: flex;
    align-items: center;
    text-decoration: none;
    padding: 0.75rem 1rem;
    color: #FFF;
    transition: 0.4s ease-out;
    border-radius: 8px;
    margin: 0.25rem 0;
}
.button:hover, .router-link-exact-active {
    background-color: #3e5266;
}
.button .material-icons {
    font-size: 2rem;
    margin-right: 0.4rem;
    transition: 0.2s ease-out;
}
.button .text {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}
.flex {
    flex-grow: 1;
}
.chevron {
    margin-left: auto;
    transition: transform 0.2s ease-out;
}
.chevron.is-rotated {
    transform: rotate(180deg);
}
.sub-menu {
    padding-left: calc(1rem + 2rem);
}
.sub-button {
    display: block;
    color: #b0c4de;
    text-decoration: none;
    padding: 0.5rem 0;
    font-size: 0.9rem;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}
.sub-button:hover {
    color: var(--primary-color);
}
</style>