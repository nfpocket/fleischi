import type { Membership, MembershipWithUser } from "~/types/memberships";
import type { Database } from "~/types/supabase";

const queryString = `
      id,
      budget,
      users (id, name)
    `;

export const useMembershipsApi = () => {
  const supabaseUser = useSupabaseUser();
  const supabaseClient = useSupabaseClient<Database>();
  const loading = ref(false);

  const createMembership = async (membership: Omit<Membership, "id" | "created_at">) => {
    if (!supabaseClient) return null;

    if (!supabaseUser.value) {
      navigateTo("/auth/login");
      return null;
    }

    loading.value = true;
    const { data, error } = await supabaseClient
      .from("memberships")
      .insert([
        {
          ...membership,
        } as Membership,
      ])
      .select(queryString)
      .single();

    loading.value = false;

    if (error) {
      console.error("Error creating membership", error);
      return null;
    }

    return data;
  };

  const updateMembership = async (membership: Partial<Omit<Membership, "owner_id" | "created_at">> & { id: string }) => {
    if (!supabaseClient) return;

    if (!supabaseUser.value) {
      return navigateTo("/auth/login");
    }

    loading.value = true;
    const { data, error } = await supabaseClient.from("memberships").update(membership).eq("id", membership.id).select(queryString).single();
    loading.value = false;

    if (error) {
      console.error("Error updating membership", error);
      return;
    }

    return data;
  };

  const deleteMembership = async (membershipId: string) => {
    if (!supabaseClient) return;

    if (!supabaseUser.value) {
      return navigateTo("/auth/login");
    }

    loading.value = true;
    const { data, error } = await supabaseClient.from("memberships").delete().eq("id", membershipId).single();
    loading.value = false;

    if (error) {
      console.error("Error deleting membership", error);
      return;
    }

    return data;
  };

  const getMembershipsOfGroup = async (groupId: string) => {
    if (!supabaseClient) return [];

    if (!supabaseUser.value) {
      navigateTo("/auth/login");
      return [];
    }

    loading.value = true;
    const { data, error } = await supabaseClient.from("memberships").select(queryString).eq("group_id", groupId);
    loading.value = false;

    if (error) {
      console.error("Error fetching membership", error);
      return [];
    }

    return data;
  };

  return {
    createMembership,
    updateMembership,
    deleteMembership,
    getMembershipsOfGroup,
    loading,
  };
};
