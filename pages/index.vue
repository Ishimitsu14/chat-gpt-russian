<script setup lang="ts">
definePageMeta({ middleware: "auth" });

const { signOut } = useAuth();
</script>

<template>
  <div>
    you log in
    <v-btn @click="signOut({ callbackUrl: '/login' })">logout</v-btn>
  </div>
</template>

<style scoped></style>
