import { useTheme } from "vuetify";

export const useToggleTheme = () => {
  const theme = useTheme();

  const isDark = computed(() => theme.global.current.value.dark);

  const toggleTheme = () => {
    theme.global.name.value = theme.global.current.value.dark
      ? "light"
      : "dark";
  };

  return {
    toggleTheme,
    isDark,
  };
};
