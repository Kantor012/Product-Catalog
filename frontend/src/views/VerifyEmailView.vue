<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useAuthStore } from '@/store/authStore';

const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();
const message = ref('Weryfikacja adresu e-mail, proszę czekać...');
const error = ref(false);

onMounted(async () => {
    const token = route.params.token as string;

    if (token) {
        const success = await authStore.verifyEmail(token);
        if (success) {
            message.value = 'Adres e-mail został pomyślnie zweryfikowany! Za chwilę zostaniesz przekierowany do strony logowania...';
            setTimeout(() => {
                router.push({ name: 'login', query: { verified: 'true' } });
            }, 3000);
        } else {
            error.value = true;
            message.value = authStore.error || 'Weryfikacja nie powiodła się. Link może być nieprawidłowy lub wygasł.';
        }
    } else {
        error.value = true;
        message.value = 'Nieprawidłowy link weryfikacyjny.';
    }
});
</script>

<template>
    <div class="verify-container">
        <div class="verify-box">
            <h2>Weryfikacja Konta</h2>
            <p :class="{ 'error-message': error }">{{ message }}</p>
        </div>
    </div>
</template>

<style scoped>
.verify-container {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 80vh;
    padding: 1rem;
}

.verify-box {
    text-align: center;
    padding: 2rem 3rem;
    background-color: var(--card-bg);
    border-radius: 12px;
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.08);
    max-width: 500px;
}

.error-message {
    color: var(--error-color);
    font-weight: 500;
}
</style>