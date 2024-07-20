<template>
  <div class="flex items-center justify-between border-b border-gray-200 dark:border-gray-800">
    <div class="flex w-full items-center gap-1">
      <NuxtLink to="/dashboard" class="cursor-pointer select-none p-2 text-3xl font-semibold"> Fleischi </NuxtLink>

      <div class="ml-auto mr-2 flex items-center gap-4">
        <LayoutTopBarProfile v-if="userStore.appUser" />
        <LayoutTopBarLogin v-else />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const userStore = useUserStore();

const handleLogout = async () => {
  userStore.signOut();
};
</script>
