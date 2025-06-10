<script setup lang="ts">
import { computed } from 'vue';
import { RouterView } from 'vue-router'
import Sidebar from '@/components/common/Sidebar.vue'
import { useUiStore } from '@/store/uiStore';
import { storeToRefs } from 'pinia';

const uiStore = useUiStore();
const { notification } = storeToRefs(uiStore);
</script>

<template>
    <div class="app">
        <Sidebar />
        <main class="main-content">
            <RouterView />
        </main>

        <div v-if="uiStore.isLoading" class="global-loader">Loading...</div>
        <div v-if="notification" :class="['notification', notification.type]">
            {{ notification.message }}
        </div>
    </div>
</template>

<style>
@import '@/assets/styles/main.css';

.app {
    display: flex;
}

.main-content {
    flex-grow: 1;
    padding: 2rem;
    margin-left: var(--sidebar-width-collapsed);
    transition: margin-left 0.2s ease-out;
}

.main-content.is-expanded {
    margin-left: var(--sidebar-width);
}

.notification { padding: 15px; color: white; position: fixed; top: 20px; right: 20px; border-radius: 8px; z-index: 1000; box-shadow: 0 4px 12px rgba(0,0,0,0.15); }
.notification.success { background-color: var(--success-color); }
.notification.error { background-color: var(--error-color); }
</style>