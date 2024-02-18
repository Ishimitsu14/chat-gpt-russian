<script lang="ts" setup async>
import { useTheme } from "vuetify";

const theme = useTheme();

const isDark = computed(() => theme.global.current.value.dark);

const toggleTheme = () => {
  theme.global.name.value = theme.global.current.value.dark ? "light" : "dark";
};
</script>

<template>
  <NuxtLayout>
    <v-app>
      <NuxtPage />
      <v-btn class="theme-toggle position-fixed" @click="toggleTheme">
        <v-icon v-if="isDark">mdi-white-balance-sunny</v-icon>
        <v-icon v-else>mdi-moon-waning-crescent</v-icon>
      </v-btn>
    </v-app>
  </NuxtLayout>
</template>

<style lang="scss" scoped>
.theme-toggle {
  right: 15px;
  bottom: 15px;
}
</style>
