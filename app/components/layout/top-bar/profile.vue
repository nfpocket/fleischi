<template>
  <UDropdown :items="items" :popper="{ placement: 'bottom-start' }">
    <UButton color="white" :label="userStore.appUser?.name || 'Settings'" trailing-icon="i-heroicons-chevron-down-20-solid" :loading="userStore.loading" />
  </UDropdown>
</template>

<script setup lang="ts">
const userStore = useUserStore();

const colorMode = useColorMode();
const isDark = computed({
  get() {
    return colorMode.value === "dark";
  },
  set() {
    colorMode.preference = colorMode.value === "dark" ? "light" : "dark";
  },
});

const items = computed(() => {
  return [
    [
      {
        label: "My Profile",
        icon: "i-tabler-user",
      },
      {
        label: "My Group",
        icon: "i-tabler-users",
      },
    ],
    [
      {
        label: "Theme",
        slot: "theme",
        icon: isDark.value ? "i-heroicons-moon-20-solid" : "i-heroicons-sun-20-solid",
        click: () => {
          isDark.value = !isDark.value;
        },
      },
    ],
    [
      {
        label: "Logout",
        icon: "i-tabler-logout",
        click: () => {
          userStore.signOut();
        },
      },
    ],
  ];
});
</script>
