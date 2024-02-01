import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ locals }) => {
  const { data, error } = await locals.supabase
    .from("user_profiles")
    .select("*, organisation_members(*)")
    .eq("id", 1)
    .single();

  const userPictureUrl = await locals.supabase.storage
    .from("user_pictures")
    .getPublicUrl(locals.user?.id);

  return {
    user: data,
    userPictureUrl: userPictureUrl.data.publicUrl,
  };
};
