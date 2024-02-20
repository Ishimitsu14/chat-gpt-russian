<script setup lang="ts">
const { isDark, toggleTheme } = useToggleTheme();
</script>

<template>
  <v-layout class="rounded rounded-md">
    <v-navigation-drawer>
      <v-list />
    </v-navigation-drawer>

    <v-app-bar title="Chat GPT">
      <v-btn class="theme-toggle" @click="toggleTheme">
        <v-icon v-if="isDark">mdi-white-balance-sunny</v-icon>
        <v-icon v-else>mdi-moon-waning-crescent</v-icon>
      </v-btn>
    </v-app-bar>

    <v-main class="d-flex align-center justify-center">
      <slot />
    </v-main>
  </v-layout>
</template>

<style scoped></style>
