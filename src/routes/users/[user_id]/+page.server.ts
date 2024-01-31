import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ locals }) => {
  const { data, error } = await locals.supabase
    .from("user_profiles")
    .select("*, organisation_members(*)")
    .eq("id", 1)
    .single();

  return {
    user: data,
  };
};
