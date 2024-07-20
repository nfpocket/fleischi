import type { Order } from "~/types/orders";
import type { Database } from "~/types/supabase";

export const useOrdersApi = () => {
  const supabaseUser = useSupabaseUser();
  const supabaseClient = useSupabaseClient<Database>();
  const loading = ref(false);

  const createOrder = async (order: Omit<Order, "id" | "created_at" | "closed_at">) => {
    if (!supabaseClient) return null;

    if (!supabaseUser.value) {
      navigateTo("/auth/login");
      return null;
    }

    loading.value = true;
    const { data, error } = await supabaseClient
      .from("orders")
      .insert([
        {
          ...order,
        } as Order,
      ])
      .select()
      .single();
    loading.value = false;

    if (error) {
      console.error("Error creating order", error);
      return null;
    }

    return data;
  };

  const updateOrder = async (order: Partial<Omit<Order, "owner_id" | "created_at">> & { id: string }) => {
    if (!supabaseClient) return null;

    if (!supabaseUser.value) {
      navigateTo("/auth/login");
      return null;
    }

    loading.value = true;
    const { data, error } = await supabaseClient.from("orders").update(order).eq("id", order.id).select().single();
    loading.value = false;

    if (error) {
      console.error("Error updating order", error);
      return null;
    }

    return data;
  };

  const deleteOrder = async (orderId: string) => {
    if (!supabaseClient) return;

    if (!supabaseUser.value) {
      return navigateTo("/auth/login");
    }

    loading.value = true;
    const { data, error } = await supabaseClient.from("orders").delete().eq("id", orderId).single();
    loading.value = false;

    if (error) {
      console.error("Error deleting order", error);
      return;
    }

    return data;
  };

  const getOrderOfGroup = async (groupId: string) => {
    if (!supabaseClient) return null;

    if (!supabaseUser.value) {
      navigateTo("/auth/login");
      return null;
    }

    loading.value = true;
    const { data, error } = await supabaseClient.from("orders").select("*").eq("group_id", groupId).select().maybeSingle();
    loading.value = false;

    if (error) {
      console.error("Error fetching order", error);
      return null;
    }

    return data;
  };

  return {
    createOrder,
    updateOrder,
    deleteOrder,
    getOrderOfGroup,
    loading,
  };
};
