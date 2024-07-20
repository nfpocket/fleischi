import { useGroupsApi } from "~/composables/api/groups";
import type { Group } from "~/types/groups";
import type { Database } from "~/types/supabase";
import type { User } from "~/types/user";

export const useUserStore = defineStore("user", () => {
  const supabaseUser = useSupabaseUser();
  const supabaseClient = useSupabaseClient<Database>();

  const appUser = ref<User | null>(null);

  const loading = ref(false);

  const fetchAppUser = async () => {
    if (!supabaseClient) return;
    if (!supabaseUser.value) {
      appUser.value = null;
      return navigateTo("/auth/login");
    }
    loading.value = true;
    const { data, error } = await supabaseClient.from("users").select("*").eq("id", supabaseUser.value.id).single();
    loading.value = false;

    if (error) {
      console.error("Error fetching user", error);
      return;
    }

    appUser.value = data;
    navigateTo("/dashboard");
  };

  const signOut = async () => {
    await supabaseClient?.auth.signOut();
    appUser.value = null;
  };

  watch(supabaseUser, fetchAppUser, { immediate: true, deep: true });

  return { appUser, supabaseUser, loading, fetchAppUser, signOut };
});
