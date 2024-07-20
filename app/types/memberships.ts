import type { Tables } from "./supabase";

export type Membership = Tables<"memberships">;
export type MembershipWithUser = {
  id: string;
  budget: number;
  users: {
    id: string;
    name: string;
  } | null;
};
