import type { Database } from "~/types/supabase";
import type { User } from "~/types/user";

export const useUsersApi = () => {
  const supabaseUser = useSupabaseUser();
  const supabaseClient = useSupabaseClient<Database>();
  const loading = ref(false);

  const searchUsers = async (name: string) => {
    if (!supabaseClient) return [];

    if (!supabaseUser.value) {
      navigateTo("/auth/login");
      return [];
    }

    loading.value = true;
    const { data, error } = await supabaseClient.from("users").select("*").ilike("name", `%${name}%`);

    loading.value = false;

    if (error) {
      console.error("Error searching users", error);
      return [];
    }

    return data;
  };

  const createUser = async (user: Omit<User, "id" | "created_at">) => {
    if (!supabaseClient) return null;

    if (!supabaseUser.value) {
      navigateTo("/auth/login");
      return null;
    }

    loading.value = true;
    const { data, error } = await supabaseClient
      .from("users")
      .insert([
        {
          ...user,
        } as User,
      ])
      .select()
      .single();
    loading.value = false;

    if (error) {
      console.error("Error creating user", error);
      return null;
    }

    return data;
  };

  return {
    searchUsers,
    createUser,
    loading,
  };
};
