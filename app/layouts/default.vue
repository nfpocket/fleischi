<template>
  <div class="flex h-full flex-1 flex-col overflow-hidden">
    <LayoutTopBar />

    <UContainer class="flex h-full w-full flex-1 flex-col overflow-hidden p-4">
      <slot></slot>
    </UContainer>
  </div>
</template>

<script setup lang="ts"></script>
