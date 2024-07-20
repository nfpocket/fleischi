<template>
  <div>
    <template v-if="!group">
      <UButton :loading label="Create Group" @click="handleCreateGroup()" />
    </template>

    <div v-else class="flex flex-col gap-4">
      <DashboardUserGroupMembers :group>
        <template #header>
          <div class="group flex items-center gap-4">
            <UInput :loading :padded="false" variant="none" v-model="group.name" @update:model-value="handleUpdateGroupName" />
            <UTooltip class="opacity-0 group-hover:opacity-100" text="Delete group">
              <UButton :loading color="red" icon="i-tabler-trash" @click="handleDelteGroup" />
            </UTooltip>
          </div>
        </template>
      </DashboardUserGroupMembers>
      <UDivider />
      <DashboardUserGroupOrders :group />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useGroupsApi } from "~/composables/api/groups";
import type { Group } from "~/types/groups";

const { createGroup, getMyGroup, loading, updateGroup, deleteGroup } = useGroupsApi();

const group = ref<Group | null>(null);

const handleCreateGroup = async () => {
  group.value = await createGroup({
    name: "My Group",
  });
};

const handleUpdateGroupName = debounce(async (name: string) => {
  if (!group.value) return;

  group.value = await updateGroup({
    id: group.value.id,
    name,
  });
});

const handleDelteGroup = async () => {
  if (!group.value) return;

  await deleteGroup(group.value.id);
  group.value = await getMyGroup();
};

onMounted(async () => {
  group.value = await getMyGroup();
});
</script>
