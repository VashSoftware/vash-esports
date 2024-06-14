import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ locals, params }) => {
  const { data, error } = await locals.supabase
    .from("user_profiles")
    .select(
      "*, organisation_members(*, organisations(*)), team_members(*, teams(*)), user_badges(*, badges(*))"
    )
    .eq("id", params.user_id)
    .single();

  // console.log(error);

  const userScores = await locals.supabase
    .from("scores")
    .select(
      "*, match_participant_players(match_participants(*, participants(*, teams(*, team_members(*, user_profiles(*))))))"
    )
    .eq(
      "match_participant_players.match_participants.participants.teams.team_members.user_id",
      params.user_id
    );

  // console.log(userScores);

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
    userScores: userScores.data,
  };
};
