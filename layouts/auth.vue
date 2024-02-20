<script setup lang="ts">
const { isDark, toggleTheme } = useToggleTheme();
</script>

<template>
  <v-app>
    <slot />
    <v-btn class="theme-toggle position-fixed" @click="toggleTheme">
      <v-icon v-if="isDark">mdi-white-balance-sunny</v-icon>
      <v-icon v-else>mdi-moon-waning-crescent</v-icon>
    </v-btn>
  </v-app>
</template>

<style lang="scss" scoped>
.theme-toggle {
  right: 15px;
  bottom: 15px;
}
</style>
