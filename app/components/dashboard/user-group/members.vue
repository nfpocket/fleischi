<template>
  <div class="flex flex-col gap-4">
    <UCard>
      <template #header>
        <slot name="header"></slot>
      </template>
      <div class="flex flex-col gap-4">
        <div class="flex items-center gap-4">
          <USelectMenu
            :key
            class="w-[225px]"
            placeholder="Search for a user to add..."
            option-attribute="name"
            by="id"
            creatable
            :loading="loadingMemberships"
            :searchable="handleUserSearch"
            v-model="selectedUserForNewMembership"
          >
            <template #option-create="{ option }">
              <span class="flex-shrink-0">New user:</span>
              <span class="block truncate">{{ option.name }}</span>
            </template>
          </USelectMenu>
        </div>
        <UTable :rows="memberships" :columns="membersColumn">
          <template #users-data="{ row }">
            {{ row.users.name }}
          </template>
          <template #budget-data="{ row }">
            <UInput
              :padded="false"
              placeholder="Budget..."
              type="number"
              variant="none"
              class="w-fit"
              v-model="row.budget"
              @update:model-value="handleUpdateBudget(row)"
            >
              <template #trailing> EUR </template>
            </UInput>
          </template>
          <template #actions-data="{ row }">
            <UTooltip text="Delete group member">
              <UButton icon="i-tabler-trash" color="red" @click="handleRemoveMembership(row)" />
            </UTooltip>
          </template>
        </UTable>
      </div>
    </UCard>
  </div>
</template>

<script setup lang="ts">
import { useMembershipsApi } from "~/composables/api/memberships";
import { useUsersApi } from "~/composables/api/user";
import type { Group } from "~/types/groups";
import type { Membership, MembershipWithUser } from "~/types/memberships";
import type { User } from "~/types/user";

const props = defineProps<{
  group: Group;
}>();

const membersColumn = [
  {
    key: "users",
    label: "Users",
    sortable: true,
    sort: (a: MembershipWithUser["users"], b: MembershipWithUser["users"], direction: "asc" | "desc") => {
      if (!a?.name || !b?.name) return 0;

      return direction === "asc" ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name);
    },
  },
  {
    key: "budget",
    label: "Budget",
    sortable: true,
  },
  {
    key: "actions",
  },
];

const key = ref(0);

const { loading: loadingMemberships, getMembershipsOfGroup, createMembership, updateMembership, deleteMembership } = useMembershipsApi();
const { loading: loadingUsers, searchUsers, createUser } = useUsersApi();
const memberships = ref<MembershipWithUser[]>([]);

const selectedUser = ref<User | null>(null);
const selectedUserForNewMembership = computed({
  get: () => selectedUser.value,
  set: async (user) => {
    if (!user) return;

    if (user.id) {
      selectedUser.value = user;
      handleCreateMembership(user);
      return;
    }

    const newUser = await createUser({
      name: user?.name || "",
      role: "user",
    });

    if (!newUser) return;

    handleCreateMembership(newUser);
  },
});

const handleUserSearch = async (q: string) => {
  const users = await searchUsers(q);

  return users.filter((user) => !memberships.value.find((membership) => membership.users?.id === user.id));
};

const handleUpdateBudget = debounce(async (membership: MembershipWithUser) => {
  if (!membership.users) return;

  await updateMembership({
    id: membership.id,
    user_id: membership.users.id,
    budget: membership.budget,
  });
});

const handleCreateMembership = async (user: User) => {
  const newMembership = await createMembership({
    group_id: props.group.id,
    user_id: user.id,
    budget: 0,
  });

  if (!newMembership) {
    return;
  }

  selectedUser.value = null;
  memberships.value.push(newMembership);
  key.value += 1;
};

const handleRemoveMembership = async (membership: Membership) => {
  await deleteMembership(membership.id);

  memberships.value = memberships.value.filter((m) => m.id !== membership.id);

  selectedUser.value = null;
  key.value += 1;
};

onMounted(async () => {
  memberships.value = await getMembershipsOfGroup(props.group.id);
});
</script>
