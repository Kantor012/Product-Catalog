<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useAdminStore } from '@/store/adminStore';
import { useAuthStore } from '@/store/authStore';

const adminStore = useAdminStore();
const authStore = useAuthStore();
const initialFormData = { name: '', email: '', password: '', isAdmin: false, isVerified: false };
const formData = ref({ ...initialFormData });
const editingUserId = ref<string | null>(null);
const showForm = ref(false);

onMounted(() => {
    adminStore.fetchUsers();
});

const isIsAdminCheckboxDisabled = computed(() => {
    if (!editingUserId.value) {
        return false;
    }
    const userToEdit = adminStore.users.find(u => u._id === editingUserId.value);
    if (!userToEdit || !userToEdit.isAdmin) {
        return false;
    }
    const adminCount = adminStore.users.filter(u => u.isAdmin).length;
    return adminCount <= 1;
});

const startEditing = (user: any) => {
    formData.value = { ...user, password: '' };
    editingUserId.value = user._id;
    showForm.value = true;
};

const startCreating = () => {
    formData.value = { ...initialFormData };
    editingUserId.value = null;
    showForm.value = true;
};

const cancelForm = () => {
    showForm.value = false;
    editingUserId.value = null;
};

const handleFormSubmit = () => {
    const payload = { ...formData.value };
    if (editingUserId.value) {
        if (!payload.password) {
            delete payload.password;
        }
        adminStore.updateUser(editingUserId.value, payload);
    } else {
        adminStore.createUser(payload);
    }
    cancelForm();
};
</script>

<template>
    <div class="user-management container">
        <h2>Managing Users</h2>
        <div v-if="showForm" class="form-container">
            <h3>{{ editingUserId ? 'Edit user' : 'Add new user' }}</h3>
            <form @submit.prevent="handleFormSubmit">
                <input type="text" v-model="formData.name" placeholder="Name" required>
                <input type="email" v-model="formData.email" placeholder="Email" required>
                <input
                    type="password"
                    v-model="formData.password"
                    placeholder="Password"
                    :required="!editingUserId"
                >
                <label>
                    <input
                        type="checkbox"
                        v-model="formData.isAdmin"
                        :disabled="isIsAdminCheckboxDisabled"
                    > Admin
                </label>
                <label>
                    <input
                        type="checkbox"
                        v-model="formData.isVerified"
                        :disabled="isIsAdminCheckboxDisabled"
                    > Verified
                </label>
                <div class="form-actions">
                    <button type="submit">Save</button>
                    <button type="button" @click="cancelForm">Cancel</button>
                </div>
            </form>
        </div>
        <button v-if="!showForm" @click="startCreating" class="add-user-btn">Add new user</button>
        <div v-if="adminStore.loading"><p>Loading users list...</p></div>
        <table v-else>
            <thead>
            <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Admin</th>
                <th>Verified</th>
                <th>Actions</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="user in adminStore.users" :key="user._id">
                <td>{{ user.name }}</td>
                <td>{{ user.email }}</td>
                <td>{{ user.isAdmin ? 'Yes' : 'No' }}</td>
                <td>{{ user.isVerified ? 'Yes' : 'No' }}</td>
                <td>
                    <button @click="startEditing(user)" class="edit-btn">Edit</button>
                    <button @click="adminStore.deleteUser(user._id)" :disabled="user._id === authStore.user?._id" class="delete-btn">Delete</button>
                </td>
            </tr>
            </tbody>
        </table>
    </div>
</template>

<style scoped>
    .form-container {
        padding: 1.5rem;
        border: 1px solid var(--border-color);
        margin-bottom: 2rem;
        background-color: #fff;
        border-radius: 8px;
    }
    .form-container input, .form-container label {
        display: block;
        margin-bottom: 1rem;
    }
    .form-container label {
        display: flex;
        align-items: center;
        gap: 10px;
    }
    .form-container input[type="checkbox"]{
        width: auto;
        margin-bottom: 0;
    }
    .form-actions {
        display: flex;
        gap: 1rem;
        margin-top: 1rem;
    }
    .add-user-btn {
        margin-bottom: 1rem;
    }
    table {
        width: 100%;
        border-collapse: collapse;
    }
    th, td {
        border: 1px solid #ddd;
        padding: 8px;
        text-align: left;
    }
    th {
        background-color: #f2f2f2;
    }
    td button {
        margin-right: 5px;
    }
    .edit-btn {
        background-color: #ffc107;
        color: #000;
    }
    .delete-btn {
        background-color: #f44336;
    }
    .delete-btn:disabled {
        background-color: #ccc;
        cursor: not-allowed;
    }
</style>