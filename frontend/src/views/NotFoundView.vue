<template>
    <div class="not-found container">
        <h1>404</h1>
        <h2>Page not found</h2>
        <p>We're sorry, page you're looking for is invalid.</p>
        <router-link to="/">Return to homepage</router-link>
    </div>
</template>

<style scoped>
.not-found {
    text-align: center;
    padding-top: 50px;
}
.not-found h1 {
    font-size: 6rem;
    margin: 0;
}
</style>