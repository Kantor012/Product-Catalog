<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useAuthStore } from '@/store/authStore';
import { useUiStore } from '@/store/uiStore';

const authStore = useAuthStore();
const uiStore = useUiStore();

const name = ref('');
const email = ref('');
const password = ref('');
const confirmPassword = ref('');

onMounted(() => {
    if (authStore.user) {
        name.value = authStore.user.name;
        email.value = authStore.user.email;
    }
});

const handleSubmit = () => {
    if (password.value && password.value !== confirmPassword.value) {
        uiStore.setNotification("Passwords do not match!", 'error');
        return;
    }
    const userData: { name: string; email: string; password?: string } = {
        name: name.value,
        email: email.value,
    };
    if (password.value) {
        userData.password = password.value;
    }
    authStore.updateUserProfile(userData);
    password.value = '';
    confirmPassword.value = '';
};
</script>

<template>
    <div class="profile-container container">
        <div class="profile-form">
            <h2>My Profile</h2>
            <form @submit.prevent="handleSubmit">
                <div class="form-group">
                    <label for="name">Name</label>
                    <input type="text" id="name" v-model="name" required>
                </div>
                <div class="form-group">
                    <label for="email">Email</label>
                    <input type="email" id="email" v-model="email" required>
                </div>
                <div class="form-group">
                    <label for="password">New password (only if you want to change password)</label>
                    <input type="password" id="password" v-model="password">
                </div>
                <div class="form-group" v-if="password">
                    <label for="confirmPassword">Confirm new password</label>
                    <input type="password" id="confirmPassword" v-model="confirmPassword">
                </div>
                <button type="submit" :disabled="authStore.loading">
                    {{ authStore.loading ? 'Zapisywanie...' : 'Zapisz zmiany' }}
                </button>
            </form>
        </div>
    </div>
</template>

<style scoped>
.profile-container {
    display: flex;
    justify-content: center;
    padding-top: 3rem;
}
.profile-form {
    width: 100%;
    max-width: 600px;
    padding: 2rem;
    background-color: var(--card-bg);
    border-radius: 12px;
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.08);
}
.profile-form h2 {
    text-align: center;
    margin-bottom: 2rem;
}
.form-group {
    margin-bottom: 1.5rem;
}
.form-group label {
    display: block;
    margin-bottom: 0.5rem;
    font-weight: 500;
}
</style>