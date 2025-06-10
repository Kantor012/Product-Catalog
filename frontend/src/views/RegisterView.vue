<script setup lang="ts">
import { ref } from 'vue';
import { useAuthStore } from '@/store/authStore';

const name = ref('');
const email = ref('');
const password = ref('');
const authStore = useAuthStore();

const handleRegister = () => {
    authStore.register({ name: name.value, email: email.value, password: password.value });
};
</script>

<template>
    <div class="page-container">
        <div class="auth-form">
            <h2>Rejestracja</h2>
            <form @submit.prevent="handleRegister">
                <input type="text" v-model="name" placeholder="Name" required />
                <input type="email" v-model="email" placeholder="Email" required />
                <input type="password" v-model="password" placeholder="Password" required />
                <button type="submit" :disabled="authStore.loading">
                    {{ authStore.loading ? 'Registering...' : 'Register' }}
                </button>
                <p v-if="authStore.error" class="error">{{ authStore.error }}</p>
            </form>
        </div>
    </div>
</template>

<style scoped>
.page-container {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 80vh;
}

.auth-form {
    width: 100%;
    max-width: 400px;
    padding: 2rem;
    background-color: var(--card-bg);
    border-radius: 12px;
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.08);
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
}

.auth-form h2 {
    text-align: center;
    margin: 0;
}

.auth-form form {
    display: flex;
    flex-direction: column;
    gap: 1rem;
}

.error {
    color: var(--error-color);
    text-align: center;
    margin-top: 0.5rem;
}
</style>