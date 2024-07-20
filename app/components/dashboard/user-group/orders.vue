<template>
  <div class="flex flex-col gap-4">
    <UCard>
      <template #header>
        <div v-if="!order" class="flex items-center gap-2">
          <UInput placeholder="What" v-model="what" />
          <UInput placeholder="When" type="datetime-local" v-model="when" />
          <UButton :loading="loadingOrders" label="Start new order" @click="handleCreateNewOrder" />
        </div>

        <div v-else class="group relative flex items-center gap-4">
          <div class="relative flex items-center gap-1">
            Order
            <span ref="spanRef" class="pointer-events-none absolute -z-50 opacity-0" v-html="(order.what || '').replace(/\s/g, '&nbsp;')"></span>
            <UInput
              :style="{
                'min-width': '4rem',
                width: `${(spanRef?.clientWidth || 0) + 8}px`,
              }"
              :padded="false"
              variant="none"
              class="w-fit font-semibold"
              size="xl"
              placeholder="What"
              v-model="order.what"
              @update:model-value="handleUpdateOrderWhat"
            />
            at
            <UInput
              :padded="false"
              type="datetime-local"
              variant="none"
              class="w-fit font-semibold"
              size="xl"
              :model-value="dayjs(order.when).format('YYYY-MM-DDTHH:mm')"
              @update:model-value="handleUpdateOrderWhen"
            />
          </div>
          <UTooltip class="opacity-0 group-hover:opacity-100" text="Delete group">
            <UButton :loading="loadingOrders" color="red" icon="i-tabler-trash" @click="handleDeleteOrder" />
          </UTooltip>
        </div>
      </template>

      <template #default>
        <DashboardUserGroupWishes v-if="order" />
        <div v-else>
          <div class="flex items-center justify-center">
            <span class="text-gray-400">No order yet</span>
          </div>
        </div>
      </template>
    </UCard>
  </div>
</template>

<script setup lang="ts">
import { useOrdersApi } from "~/composables/api/orders";
import type { Group } from "~/types/groups";
import type { Order } from "~/types/orders";
import dayjs from "dayjs";
import type { _minWidth } from "#tailwind-config/theme";

const props = defineProps<{
  group: Group;
}>();

const spanRef = ref<HTMLSpanElement | null>(null);

const { loading: loadingOrders, createOrder, getOrderOfGroup, updateOrder, deleteOrder } = useOrdersApi();
const order = ref<Order | null>(null);

const what = ref("Fleischi");
const when = ref(dayjs().format("YYYY-MM-DDTHH:mm"));

const handleCreateNewOrder = async () => {
  order.value = await createOrder({
    group_id: props.group.id,
    what: what.value,
    when: when.value,
  });
};

const handleUpdateOrderWhat = debounce(async (what: string) => {
  if (!order.value) return;

  order.value = await updateOrder({
    ...order.value,
    what,
  });
});

const handleUpdateOrderWhen = debounce(async (when: string) => {
  if (!order.value) return;

  order.value = await updateOrder({
    ...order.value,
    when: new Date(when).toISOString(),
  });
});

const handleDeleteOrder = async () => {
  if (!order.value) return;

  await deleteOrder(order.value.id);
  order.value = null;
};

onMounted(async () => {
  order.value = await getOrderOfGroup(props.group.id);
});
</script>
