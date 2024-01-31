import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ locals, params }) => {
  const { data, error } = await locals.supabase
    .from("matches")
    .select(
      `*, rounds ( events (id, name)), match_participants(points, participants(teams(id, name))), match_maps(maps(*, mapsets(*)))`
    )
    .eq("id", params.match_id)
    .single();

  console.log(data.match_maps[0].maps.mapsets);

  let teamIcons = [];
  for (let i = 0; i < data.match_participants; i++) {
    const teamIcon = await locals.supabase.storage
      .from("team_icons")
      .getPublicUrl(data.match_participants[i].participants.teams.id);

    teamIcons = [...teamIcons, teamIcon];
  }

  return {
    match: data,
    teamIcons: [],
  };
};
