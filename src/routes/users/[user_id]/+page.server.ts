import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ locals, params }) => {
  const { data, error } = await locals.supabase
    .from("user_profiles")
    .select("*, organisation_members(*), team_members(*)")
    .eq("id", params.user_id)
    .single();

  const userPictureUrl = await locals.supabase.storage
    .from("user_pictures")
    .getPublicUrl(params.user_id);

  let organisationPublicUrls = [];
  for (let i = 0; i < data?.organisation_members.length; i++) {
    const organisationPublicUrl = await locals.supabase.storage
      .from("organisation_logos")
      .getPublicUrl(data.organisation_members[i].organisation_id);
    organisationPublicUrls.push(organisationPublicUrl);
  }

  return {
    user: data,
    userPictureUrl: userPictureUrl.data.publicUrl,
    organisationPublicUrls: organisationPublicUrls,
  };
};
