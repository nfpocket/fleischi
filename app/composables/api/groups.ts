import type { Group } from "~/types/groups";
import type { Database } from "~/types/supabase";

export const useGroupsApi = () => {
  const supabaseUser = useSupabaseUser();
  const supabaseClient = useSupabaseClient<Database>();
  const loading = ref(false);

  const createGroup = async (group: Omit<Group, "id" | "owner_id" | "created_at">) => {
    if (!supabaseClient) return null;

    if (!supabaseUser.value) {
      navigateTo("/auth/login");
      return null;
    }

    loading.value = true;
    const { data, error } = await supabaseClient
      .from("groups")
      .insert([
        {
          ...group,
          owner_id: supabaseUser.value.id,
        } as Group,
      ])
      .select()
      .single();
    loading.value = false;

    if (error) {
      console.error("Error creating group", error);
      return null;
    }

    return data;
  };

  const updateGroup = async (group: Omit<Group, "owner_id" | "created_at">) => {
    if (!supabaseClient) return null;

    if (!supabaseUser.value) {
      navigateTo("/auth/login");
      return null;
    }

    loading.value = true;
    const { data, error } = await supabaseClient.from("groups").update(group).eq("id", group.id).select().single();
    loading.value = false;

    if (error) {
      console.error("Error updating group", error);
      return null;
    }

    return data;
  };

  const deleteGroup = async (groupId: string) => {
    if (!supabaseClient) return;

    if (!supabaseUser.value) {
      return navigateTo("/auth/login");
    }

    loading.value = true;
    const { data, error } = await supabaseClient.from("groups").delete().eq("id", groupId).single();
    loading.value = false;

    if (error) {
      console.error("Error deleting group", error);
      return;
    }

    return data;
  };

  const getMyGroup = async () => {
    if (!supabaseClient) return null;

    if (!supabaseUser.value) {
      navigateTo("/auth/login");
      return null;
    }

    loading.value = true;
    const { data, error } = await supabaseClient
      .from("groups")
      .select(
        `
    created_at,
    id,
    name,
    owner_id,
    users(id, name)
      `,
      )
      .eq("owner_id", supabaseUser.value.id)
      .maybeSingle();
    loading.value = false;

    if (error) {
      console.error("Error fetching group", error);
      return null;
    }

    return data;
  };

  return {
    createGroup,
    updateGroup,
    deleteGroup,
    getMyGroup,
    loading,
  };
};
