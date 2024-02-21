<script setup lang="ts">
definePageMeta({
  auth: {
    unauthenticatedOnly: true,
  },
  layout: "auth",
});
const { signIn } = useAuth();
</script>

<template>
  <v-container class="fill-height align-center justify-center">
    <div class="d-flex align-center justify-center ga-4">
      lox
      <v-btn color="red" @click="signIn('google')">
        <v-icon>mdi-google</v-icon>
      </v-btn>
      <v-btn color="black" @click="signIn('github')">
        <v-icon>mdi-github</v-icon>
      </v-btn>
    </div>
  </v-container>
</template>

<style scoped></style>
