import type { Tables } from "./supabase";

export type Group = Tables<"groups">;
export type GroupWithOwner = {
  created_at: string
  id: string;
  name: string;
  owner_id: string;
  users: {
    id: string;
    name: string;
  };
};
