import { redirect } from "@sveltejs/kit";
import type { Actions, PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ locals, params }) => {
  const { data, error } = await locals.supabase
    .from("user_profiles")
    .select(
      "*, pinned_scores(*), organisation_members(*, organisations(*)), team_members(*, teams!inner(*, participants(events(*, event_groups(name))))), user_badges(*, badges(*)), user_platforms(platforms(name), value)"
    )
    .eq("id", params.user_id)
    .eq("team_members.teams.is_personal_team", false)
    .single();

  const userScores = await locals.supabase
    .from("scores")
    .select(
      "*, match_maps(match_id), match_participant_players!inner(match_participants!inner(*, participants!inner(*, teams!inner(*, team_members!inner(*, user_profiles!inner(*))))))"
    )
    .eq(
      "match_participant_players.match_participants.participants.teams.team_members.user_id",
      params.user_id
    )
    .order("score", { ascending: false });
  let organisationPublicUrls = [];
  for (let i = 0; i < data?.organisation_members.length; i++) {
    const organisationPublicUrl = locals.supabase.storage
      .from("organisation_logos")
      .getPublicUrl(data.organisation_members[i].organisation_id);
    organisationPublicUrls.push(organisationPublicUrl);
  }

  let teamPublicUrls = [];
  for (let i = 0; i < data?.team_members.length; i++) {
    const teamPublicUrl = data.team_members[i].teams.picture_url;
    teamPublicUrls.push(teamPublicUrl);
  }

  return {
    user: data,
    organisationPublicUrls: organisationPublicUrls,
    teamPublicUrls: teamPublicUrls,
    userScores: userScores.data,
  };
};

export const actions = {
  signOut: async ({ locals }) => {
    await locals.supabase.auth.signOut();

    throw redirect(302, `/`);
  },
  createTeam: async ({ params, locals, request }) => {
    const formData = await request.formData();

    const team = await locals.supabase
      .from("teams")
      .insert([
        {
          name: formData.get("name"),
          bio: formData.get("bio"),
          is_personal_team: false,
        },
      ])
      .select("id")
      .single();

    await locals.supabase
      .from("teams")
      .update({
        picture_url: `https://mdixwlzweijevgjmcsmt.supabase.co/storage/v1/object/public/team_icons/${team.data.id}`,
      })
      .eq("id", team.data.id);

    const file = formData.get("logo") as File;
    const text = new Uint8Array(await file.arrayBuffer());

    const teamIcon = await locals.supabase.storage
      .from("team_icons")
      .upload(String(team.data.id), text, {
        cacheControl: "3600",
        contentType: file.type,
        upsert: false,
      });

    console.log(teamIcon);

    const teamMember = await locals.supabase.from("team_members").insert([
      {
        team_id: team.data.id,
        user_id: params.user_id,
      },
    ]);

    console.log(teamMember);

    throw redirect(302, `/teams/${team.data.id}`);
  },
} satisfies Actions;
