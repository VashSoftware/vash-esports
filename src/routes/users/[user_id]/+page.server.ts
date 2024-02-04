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

  let teamPublicUrls = [];
  for (let i = 0; i < data?.team_members.length; i++) {
    const teamPublicUrl = await locals.supabase.storage
      .from("team_icons")
      .getPublicUrl(data.team_members[i].team_id);
    teamPublicUrls.push(teamPublicUrl);
  }

  return {
    user: data,
    userPictureUrl: userPictureUrl.data.publicUrl,
    organisationPublicUrls: organisationPublicUrls,
    teamPublicUrls: teamPublicUrls,
  };
};
